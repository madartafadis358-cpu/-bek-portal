const BASE_URL_TEST = 'https://pay.chargily.net/test/api/v2';
const BASE_URL_LIVE = 'https://pay.chargily.net/api/v2';

function getSecretKey() {
  return process.env.CHARGILY_SECRET_KEY || 'test_sk_dGZVZuAArkE87tKt1pLNHDzDxjgtZTQCcPgbVFzD';
}

export function getChargilyBaseUrl() {
  return process.env.CHARGILY_LIVE_MODE === 'true' ? BASE_URL_LIVE : BASE_URL_TEST;
}

export function getChargilyHeaders() {
  const secretKey = getSecretKey();
  return {
    'Authorization': `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
  };
}
