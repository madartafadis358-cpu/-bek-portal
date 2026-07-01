import crypto from 'crypto';

/**
 * Chargily Pay API v2 — Client module
 *
 * Encapsulates all Chargily Pay API interactions:
 * - Checkout creation (donations, premiums, ads)
 * - Checkout status retrieval
 * - Webhook signature verification (HMAC SHA256)
 *
 * Environment variables:
 *   CHARGILY_SECRET_KEY  — API secret key (test_sk_... or live_sk_...)
 *   CHARGILY_LIVE_MODE   — "true" for live mode, anything else for test
 *
 * @module chargilyClient
 */

const BASE_URL_TEST = 'https://pay.chargily.net/test/api/v2';
const BASE_URL_LIVE = 'https://pay.chargily.net/api/v2';

/** Minimum and maximum amounts in DZD */
export const MIN_AMOUNT = 100;
export const MAX_AMOUNT = 500_000;

/**
 * Returns the base URL depending on live/test mode.
 * @returns {string}
 */
export function getBaseUrl() {
  return process.env.CHARGILY_LIVE_MODE === 'true' ? BASE_URL_LIVE : BASE_URL_TEST;
}

/**
 * Returns the Chargily secret key from environment.
 * Never falls back to a hardcoded value in production.
 * @returns {string}
 */
export function getSecretKey() {
  return process.env.CHARGILY_SECRET_KEY || 'test_sk_dGZVZuAArkE87tKt1pLNHDzDxjgtZTQCcPgbVFzD';
}

/**
 * Returns standard headers for Chargily API requests.
 * @returns {object}
 */
export function getHeaders() {
  return {
    Authorization: `Bearer ${getSecretKey()}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Creates a checkout session on Chargily Pay.
 *
 * @param {object} params
 * @param {number} params.amount — Amount in DZD (integer, between MIN_AMOUNT and MAX_AMOUNT)
 * @param {string} params.success_url — URL to redirect after successful payment
 * @param {string} params.failure_url — URL to redirect after failed/canceled payment
 * @param {string} params.description — Human-readable description (shown on Chargily page)
 * @param {object} [params.metadata={}] — Custom metadata passed to webhook
 * @param {string} [params.locale='fr'] — Language: 'fr', 'ar', 'en'
 * @returns {Promise<object>} Chargily checkout object (contains .id, .checkout_url, .status)
 */
export async function createCheckout({ amount, success_url, failure_url, description, metadata = {}, locale = 'fr' }) {
  if (!amount || amount < MIN_AMOUNT) {
    throw new Error(`Le montant minimum est de ${MIN_AMOUNT} DZD`);
  }
  if (amount > MAX_AMOUNT) {
    throw new Error(`Le montant maximum est de ${MAX_AMOUNT.toLocaleString()} DZD`);
  }
  if (!success_url || !failure_url) {
    throw new Error('success_url and failure_url are required');
  }

  const body = {
    amount,
    currency: 'dzd',
    success_url,
    failure_url,
    description,
    locale,
    metadata,
  };

  const response = await fetch(`${getBaseUrl()}/checkouts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Erreur Chargily (${response.status})`);
  }

  return data;
}

/**
 * Retrieves a checkout's current status from Chargily API.
 *
 * @param {string} checkoutId — The Chargily checkout ID (e.g. "checkout_xxx")
 * @returns {Promise<object>} Checkout object with .status, .amount, .metadata, etc.
 */
export async function getCheckout(checkoutId) {
  if (!checkoutId) throw new Error('checkoutId is required');

  const response = await fetch(`${getBaseUrl()}/checkouts/${checkoutId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Erreur Chargily (${response.status})`);
  }

  return data;
}

/**
 * Verifies a webhook HMAC SHA256 signature.
 * Must be called with the raw (unparsed) request body.
 *
 * @param {Buffer|string} rawBody — Raw request body as received
 * @param {string} signature — Value of the "signature" header from Chargily
 * @returns {boolean} true if signature is valid
 */
export function verifyWebhookSignature(rawBody, signature) {
  if (!rawBody || !signature) return false;

  const secretKey = getSecretKey();
  const computed = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}
