// Env-gated Sentry loader. When SENTRY_DSN is not set, all exported
// functions are no-ops and the SDK is never imported.

const DSN = process.env.SENTRY_DSN;
const ENV = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development';
const RELEASE = process.env.SENTRY_RELEASE;

let sentryModule = null;
let initialized = false;

async function loadSentry() {
    if (!DSN) return null;
    if (sentryModule) return sentryModule;
    try {
        sentryModule = await import('@sentry/node');
        return sentryModule;
    } catch {
        // eslint-disable-next-line no-console
        console.warn('[sentry] SENTRY_DSN configured but @sentry/node is not installed. Run `npm i @sentry/node` to enable.');
        return null;
    }
}

export async function initSentry() {
    if (!DSN || initialized) return null;
    const Sentry = await loadSentry();
    if (!Sentry) return null;
    Sentry.init({
        dsn: DSN,
        environment: ENV,
        release: RELEASE,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
    });
    initialized = true;
    return Sentry;
}

export async function captureError(error, context = {}) {
    if (!DSN) return;
    const Sentry = await loadSentry();
    if (!Sentry) return;
    Sentry.captureException(error, { extra: context });
}

export function isSentryEnabled() {
    return Boolean(DSN);
}
