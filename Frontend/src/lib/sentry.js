// Env-gated Sentry loader. When VITE_SENTRY_DSN is not set, this module
// exports no-op stubs so nothing is imported from @sentry/react and the
// vendor chunk is not pulled into the build.

const DSN = import.meta.env.VITE_SENTRY_DSN;
const ENV = import.meta.env.VITE_SENTRY_ENVIRONMENT || (import.meta.env.PROD ? 'production' : 'development');
const RELEASE = import.meta.env.VITE_SENTRY_RELEASE || undefined;

let sentryModule = null;
let initialized = false;

async function loadSentry() {
    if (!DSN) return null;
    if (sentryModule) return sentryModule;
    // Computed specifier defeats Rollup's static analysis, so the SDK is
    // not required at build time. If it's installed, we import it; if not,
    // we log a warning and no-op.
    const specifier = '@sentry' + '/react';
    try {
        sentryModule = await import(/* @vite-ignore */ specifier);
        return sentryModule;
    } catch {
        // eslint-disable-next-line no-console
        console.warn('[sentry] DSN configured but @sentry/react is not installed. Run `npm i @sentry/react` to enable.');
        return null;
    }
}

export async function initSentry() {
    if (!DSN || initialized) return;
    const Sentry = await loadSentry();
    if (!Sentry) return;
    Sentry.init({
        dsn: DSN,
        environment: ENV,
        release: RELEASE,
        integrations: [Sentry.browserTracingIntegration?.()].filter(Boolean),
        tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.1),
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
    });
    initialized = true;
}

export async function captureError(error, context = {}) {
    if (!DSN) {
        // Preserve visibility when Sentry is disabled.
        // eslint-disable-next-line no-console
        console.error('[error]', error, context);
        return;
    }
    const Sentry = await loadSentry();
    if (!Sentry) return;
    Sentry.captureException(error, { extra: context });
}

export function isSentryEnabled() {
    return Boolean(DSN);
}
