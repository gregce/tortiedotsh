import { setTimeout as sleep } from "node:timers/promises";

// GitHub treats repository coordinates and clone URLs case-insensitively.
// Do not extend that rule to another forge or to a different owner/repository.
export function repositoryIdentityMatches(project, record) {
  const forge = project.forge || "github";
  const normalize = (value) => typeof value === "string"
    ? forge === "github" ? value.toLowerCase() : value
    : null;
  const url = project.repositoryUrl || project.githubUrl;
  return Boolean(record) && (record.forge || "github") === forge &&
    normalize(record.owner) === normalize(project.owner) &&
    normalize(record.repo) === normalize(project.repo) &&
    normalize(record.repositoryUrl || record.githubUrl) === normalize(url) &&
    normalize(record.cloneUrl) === normalize(project.cloneUrl || `${url}.git`) &&
    record.metricScope === (project.metricScope || null);
}

function serverDelay(response, now) {
  const retryAfter = response.headers.get("retry-after");
  const reset = response.headers.get("x-ratelimit-reset");
  const delays = [0];
  if (retryAfter !== null) {
    const seconds = Number(retryAfter);
    delays.push(Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - now);
  }
  if (response.headers.get("x-ratelimit-remaining") === "0" && reset) {
    delays.push(Number(reset) * 1000 - now);
  }
  return Math.max(...delays.filter(Number.isFinite));
}

// Only used for read requests (including the GitLab GraphQL query). Each
// attempt gets a fresh timeout; permanent permission/not-found errors fail fast.
export async function fetchWithRetry(url, init = {}, {
  fetchImpl = globalThis.fetch,
  wait = sleep,
  now = Date.now,
  random = Math.random,
  onRetry = (message) => console.warn(message),
} = {}) {
  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let response;
    let delay = 2_000 * 2 ** (attempt - 1) + Math.floor(random() * 500);
    let reason;
    try {
      response = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(30_000) });
      const rateLimited = response.status === 429 || response.status === 403 && (
        response.headers.has("retry-after") || response.headers.get("x-ratelimit-remaining") === "0"
      );
      const transient = [408, 500, 502, 503, 504].includes(response.status);
      if ((!rateLimited && !transient) || attempt === attempts) return response;
      // GitHub asks for at least one minute when throttled without a reset.
      delay = Math.max(delay, serverDelay(response, now()), rateLimited ? 60_000 : 0);
      // Leave long rate limits as explicit failures, never retry before reset.
      if (delay > 60_000) return response;
      reason = `HTTP ${response.status}`;
    } catch (error) {
      const transient = ["TimeoutError", "AbortError"].includes(error.name) ||
        error instanceof TypeError && /fetch failed/i.test(error.message) ||
        ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN", "ENOTFOUND", "UND_ERR_SOCKET"].includes(error.cause?.code);
      if (!transient || attempt === attempts) throw error;
      reason = error.name;
    }
    await response?.body?.cancel();
    onRetry(`Retrying ${url} after ${reason} in ${delay}ms (attempt ${attempt + 1}/${attempts})`);
    await wait(delay);
  }
}
