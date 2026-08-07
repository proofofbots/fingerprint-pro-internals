/**
 * The page origin is bound into several signals — the window/location probe, the crypto-origin
 * list, the loader URL, an error stack trace — and the tenant rejects the whole event when they
 * disagree with the request `Origin`. Rewriting is done by string rather than against a fixed id
 * list, so an origin-bearing signal added in a future build is covered without a code change.
 */
export function captureOrigin(payload) {
  const location = payload.s71?.v;
  if (location?.w) return String(location.w);
  if (typeof payload.sc?.u === "string") {
    try {
      return new URL(payload.sc.u).origin;
    } catch {}
  }
  return null;
}

export function rewriteOrigin(node, from, to) {
  if (typeof node === "string") return node.split(from).join(to);
  if (Array.isArray(node)) return node.map((item) => rewriteOrigin(item, from, to));
  if (node && typeof node === "object") {
    for (const key of Object.keys(node)) node[key] = rewriteOrigin(node[key], from, to);
    return node;
  }
  return node;
}

/**
 * Present a payload as having been collected on `origin`. Mutates in place and reports what moved.
 * `sc.u` is the loader URL rather than a bare origin, so it is rebuilt in the form the tenant serves
 * instead of being substituted.
 */

/**
 * Present a payload as having been collected on `origin`. Mutates in place and reports what moved.
 * `sc.u` is the loader URL rather than a bare origin, so it is rebuilt in the form the tenant serves
 * instead of being substituted.
 */
export function presentAs(payload, { origin, endpoint, apiKey, loaderTag = "jsl/4.0.0" }) {
  const from = captureOrigin(payload);
  const to = new URL(origin).origin;
  if (!from)
    return {
      from: null,
      to,
      rewritten: false,
    };
  if (from !== to) {
    rewriteOrigin(payload, from, to);
    if (endpoint && apiKey) {
      payload.sc = {
        u: `${endpoint.replace(/\/$/, "")}/web/v4/${apiKey}?ci=${loaderTag}`,
      };
    }
    return {
      from,
      to,
      rewritten: true,
    };
  }
  return {
    from,
    to,
    rewritten: false,
  };
}
