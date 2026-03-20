const { HttpsProxyAgent } = require("https-proxy-agent");
const logger = require("pino")();

const MAX_CHARS = 1500;

// Lazy ESM import cache (package is ESM-only)
let _translateFn;
let _TooManyRequestsError;
async function getTranslateModule() {
  if (!_translateFn) {
    const mod = await import("@vitalets/google-translate-api");
    _translateFn = mod.translate;
    _TooManyRequestsError = mod.TooManyRequestsError;
  }
  return { translate: _translateFn, TooManyRequestsError: _TooManyRequestsError };
}

// Read proxy list once at startup
const PROXIES = process.env.PROXY_LIST
  ? process.env.PROXY_LIST.split(",").map((p) => p.trim()).filter(Boolean)
  : [];

function getRandomProxy() {
  if (!PROXIES.length) return null;
  return PROXIES[Math.floor(Math.random() * PROXIES.length)];
}

async function translate(text, targetLang) {
  let truncated = false;
  if (text.length > MAX_CHARS) {
    text = text.slice(0, MAX_CHARS);
    truncated = true;
  }

  const { translate: googleTranslate, TooManyRequestsError } = await getTranslateModule();

  const run = async (fetchOptions = {}) => {
    const result = await googleTranslate(text, { to: targetLang, fetchOptions });
    return {
      translatedText: result.text,
      detectedLang: result.raw?.src ?? null,
      truncated,
      error: null,
    };
  };

  try {
    return await run();
  } catch (err) {
    if (err instanceof TooManyRequestsError) {
      logger.warn("Google Translate rate limit hit — retrying with proxy");
      const proxyUrl = getRandomProxy();
      if (!proxyUrl) {
        logger.error("TooManyRequestsError and no PROXY_LIST configured");
        return { translatedText: null, detectedLang: null, truncated, error: err };
      }
      try {
        return await run({ agent: new HttpsProxyAgent(proxyUrl) });
      } catch (retryErr) {
        logger.error(`Translation retry via proxy failed: ${retryErr}`);
        return { translatedText: null, detectedLang: null, truncated, error: retryErr };
      }
    }
    logger.error(`Translation failed: ${err}`);
    return { translatedText: null, detectedLang: null, truncated, error: err };
  }
}

module.exports = { translate };
