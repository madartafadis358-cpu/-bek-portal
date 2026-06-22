-- ============================================================
-- CHARGILY PAY : Migration Stripe -> Chargily
-- ============================================================

-- 1. Ajouter chargily_checkout_id aux donations
ALTER TABLE donations ADD COLUMN IF NOT EXISTS chargily_checkout_id TEXT UNIQUE;
ALTER TABLE donations ALTER COLUMN amount_eur DROP NOT NULL;
ALTER TABLE donations ALTER COLUMN amount_eur SET DEFAULT 0;

-- 2. Ajouter chargily_checkout_id aux subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS chargily_checkout_id TEXT UNIQUE;
ALTER TABLE subscriptions ALTER COLUMN stripe_customer_id DROP NOT NULL;

-- 3. Ajouter chargily_checkout_id aux businesses (optionnel, déjà stripe_subscription_id)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS chargily_checkout_id TEXT UNIQUE;
