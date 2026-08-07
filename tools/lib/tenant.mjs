const LOADER = "js/4.1.3";

/**
 * Seal a payload the way the agent does and POST it, then read the verdict back through the site's
 * own BFF. No secret is needed: the demo backend holds the tenant's server key and hands back the
 * parsed identification, which is exactly how the playground shows a result.
 */

/**
 * Seal a payload the way the agent does and POST it, then read the verdict back through the site's
 * own BFF. No secret is needed: the demo backend holds the tenant's server key and hands back the
 * parsed identification, which is exactly how the playground shows a result.
 */
export async function sendPayload(codec, payload, { endpoint, origin, userAgent, region = "us" }) {
  const encoded = codec.encodeJson(payload);
  const [compressed, body] = await codec.compress(encoded);
  const bytes = compressed ? new Uint8Array(body) : encoded;
  const profile =
    codec.profiles.find(
      (candidate) => candidate.markerBytes.join() === (compressed ? "3,14" : "3,13"),
    ) ?? codec.profiles[0];
  const frame = new Uint8Array(codec.sealFrame(bytes, profile));
  const target = `${endpoint}?region=${encodeURIComponent(region)}&ci=${encodeURIComponent(LOADER)}&q=${encodeURIComponent(payload.c)}`;
  const response = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Origin: origin,
      "User-Agent": userAgent,
    },
    body: frame,
  });
  const text = await response.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {}
  const eventId = parsed?.event_id ?? null;
  if (!eventId)
    return {
      status: response.status,
      error: text.slice(0, 200),
      verdict: null,
    };
  const result = await fetch(`${origin}/api/event/v4/${encodeURIComponent(eventId)}`, {
    method: "POST",
    headers: {
      Origin: origin,
      "User-Agent": userAgent,
    },
  });
  const resultText = await result.text();
  try {
    return {
      status: response.status,
      eventId,
      verdict: JSON.parse(resultText),
    };
  } catch {
    return {
      status: response.status,
      eventId,
      error: resultText.slice(0, 200),
      verdict: null,
    };
  }
}

/** The GET leg. What comes back is the blob the agent replays as `s56`. */

/** The GET leg. What comes back is the blob the agent replays as `s56`. */
export async function fetchBrowserCache(codec, { endpoint, origin, userAgent, apiKey }) {
  const helper = codec.helperUrl ? codec.helperUrl(endpoint) : null;
  if (!helper) return null;
  const response = await fetch(`${helper}?q=${encodeURIComponent(apiKey)}`, {
    headers: {
      Origin: origin,
      "User-Agent": userAgent,
    },
  });
  const text = (await response.text()).trim();
  return response.ok && text ? text : null;
}

/** The fields worth keeping off a verdict, flattened. */

/** The fields worth keeping off a verdict, flattened. */
export const readVerdict = (outcome) => ({
  status: outcome.status,
  error: outcome.error ?? null,
  eventId: outcome.eventId ?? null,
  visitor: outcome.verdict?.identification?.visitor_id ?? null,
  confidence: outcome.verdict?.identification?.confidence?.score ?? null,
  found: outcome.verdict?.identification?.visitor_found ?? null,
  firstSeen: outcome.verdict?.identification?.first_seen_at ?? null,
  replayed: outcome.verdict?.replayed ?? null,
  address: outcome.verdict?.ip_address ?? null,
  suspect: outcome.verdict?.suspect_score ?? null,
  tampering: outcome.verdict?.tampering ?? null,
});
