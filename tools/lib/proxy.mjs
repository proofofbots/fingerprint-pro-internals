import tls from "node:tls";
import { Agent, setGlobalDispatcher } from "undici";
import { SocksClient } from "socks";

const SESSION_RE = /session-([A-Za-z0-9]+)/;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const MIN_SESSION_LEN = 9;

function randToken(length) {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}

/**
 * Positional line: `socks5://host:port:user:pass`. Non-standard — user and pass are extra
 * colon-separated fields, not URL auth — so this is parsed by position, not by `new URL`.
 */

/**
 * Positional line: `socks5://host:port:user:pass`. Non-standard — user and pass are extra
 * colon-separated fields, not URL auth — so this is parsed by position, not by `new URL`.
 */
export function parseProxy(spec) {
  const m = /^socks5h?:\/\/(.+)$/i.exec(spec.trim());
  if (!m) throw new Error(`unsupported proxy, want socks5://host:port:user:pass — got ${spec}`);
  const parts = m[1].split(":");
  if (parts.length < 2) throw new Error(`proxy needs at least host:port — got ${spec}`);
  const [host, port, user] = parts;
  return {
    host,
    port: Number(port),
    user: user || undefined,
    pass: parts.slice(3).join(":") || undefined,
  };
}

export function sessionToken(proxy) {
  return proxy.pass ? (SESSION_RE.exec(proxy.pass)?.[1] ?? null) : null;
}

/**
 * Swap the `session-XXXX` token in the password for a fresh one of the same length. The upstream
 * hands out a distinct exit IP per session id, so a fresh token per replay sidesteps the per-IP
 * rate limit the endpoint enforces on the ingress POST.
 */

/**
 * Swap the `session-XXXX` token in the password for a fresh one of the same length. The upstream
 * hands out a distinct exit IP per session id, so a fresh token per replay sidesteps the per-IP
 * rate limit the endpoint enforces on the ingress POST.
 */
export function rotateSession(proxy) {
  const current = sessionToken(proxy);
  if (!current)
    return {
      ...proxy,
    };
  const len = Math.max(current.length, MIN_SESSION_LEN);
  return {
    ...proxy,
    pass: proxy.pass.replace(SESSION_RE, `session-${randToken(len)}`),
  };
}

/**
 * Pin the session token instead of rotating it, so a run of requests leaves from one exit IP. The
 * upstream also takes a `_lifetime-<minutes>` suffix, which is what holds that IP across the run
 * rather than only across a connection.
 */

/**
 * Pin the session token instead of rotating it, so a run of requests leaves from one exit IP. The
 * upstream also takes a `_lifetime-<minutes>` suffix, which is what holds that IP across the run
 * rather than only across a connection.
 */
export function setSession(proxy, token, lifetimeMinutes = null) {
  if (!proxy.pass)
    return {
      ...proxy,
    };
  let pass = proxy.pass.replace(SESSION_RE, `session-${token}`);
  if (lifetimeMinutes) {
    pass = /_lifetime-\d+/.test(pass)
      ? pass.replace(/_lifetime-\d+/, `_lifetime-${lifetimeMinutes}`)
      : `${pass}_lifetime-${lifetimeMinutes}`;
  }
  return {
    ...proxy,
    pass,
  };
}

export function freshToken(length = MIN_SESSION_LEN) {
  return randToken(length);
}

export function installProxy(proxy) {
  const dispatcher = new Agent({
    connect(opts, callback) {
      const port = Number(opts.port) || (opts.protocol === "https:" ? 443 : 80);
      SocksClient.createConnection({
        proxy: {
          host: proxy.host,
          port: proxy.port,
          type: 5,
          userId: proxy.user,
          password: proxy.pass,
        },
        command: "connect",
        destination: {
          host: opts.hostname,
          port,
        },
      })
        .then(({ socket }) => {
          if (opts.protocol !== "https:") return callback(null, socket);
          const tlsSocket = tls.connect({
            socket,
            servername: opts.servername || opts.hostname,
            ALPNProtocols: ["http/1.1"],
          });
          tlsSocket.once("secureConnect", () => callback(null, tlsSocket));
          tlsSocket.once("error", (err) => callback(err, null));
        })
        .catch((err) => callback(err, null));
    },
  });
  setGlobalDispatcher(dispatcher);
  return dispatcher;
}
