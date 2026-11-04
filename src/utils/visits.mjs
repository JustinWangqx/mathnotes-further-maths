export const trackedSite = 'https://justinwangqx.github.io/mathnotes-further-maths/';
export const counterEndpoint = 'https://hitscounter.dev/api/hit';

export function isTrackedPage(pageUrl, siteUrl = trackedSite) {
  const page = new URL(pageUrl);
  const site = new URL(siteUrl);
  return page.origin === site.origin && page.pathname.startsWith(site.pathname);
}

export function parseVisitCounts(data) {
  if (!data || !Number.isSafeInteger(data.total_hits) || !Number.isSafeInteger(data.today_hits)
      || data.total_hits < 0 || data.today_hits < 0 || data.today_hits > data.total_hits) {
    throw new Error('Invalid visit counter response');
  }
  return {total: data.total_hits, today: data.today_hits};
}

// One request both records this page view and returns the shared site totals.
// Never retry automatically: a timed-out request may already have been counted.
export async function recordPageView(pageUrl, fetchImpl = globalThis.fetch) {
  if (!isTrackedPage(pageUrl)) return null;
  const endpoint = new URL(counterEndpoint);
  endpoint.search = new URLSearchParams({url: trackedSite, output: 'json', tz: 'Asia/Shanghai'}).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetchImpl(endpoint.href, {
      signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
    });
    if (!response.ok) throw new Error('Visit counter unavailable');
    return parseVisitCounts(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}
