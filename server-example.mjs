/* Solia — Stripe server (example, Node + Express)
   ------------------------------------------------------------------
   The SECRET key lives ONLY in an environment variable.
   It is never hardcoded or sent to the browser.
   ------------------------------------------------------------------
   Install:  npm i express stripe cors
   Run:      STRIPE_SECRET_KEY=sk_live_xxx node server-example.mjs
   ------------------------------------------------------------------ */
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Secret key from env — DO NOT commit a real sk_ key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const PLANS = {
  pro: { amount: 1900, currency: 'usd', name: 'Solia Pro', recurring: true },
  byo: { amount: 500, currency: 'usd', name: 'Solia BYO API', recurring: false },
};

// POST /api/checkout  → create a Checkout Session for a plan
app.post('/api/checkout', async (req, res) => {
  const plan = PLANS[req.body.plan];
  if (!plan) return res.status(400).json({ error: 'Unknown plan' });

  const priceData = plan.recurring
    ? { currency: plan.currency, unit_amount: plan.amount,
        recurring: { interval: 'month' } }
    : { currency: plan.currency, unit_amount: plan.amount };

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price_data: priceData, quantity: 1 }],
    success_url: 'https://your-site.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://your-site.com/#pricing',
  });
  res.json({ id: session.id });
});

// GET /api/admin/payments  → payments + MRR for the admin dashboard
app.get('/api/admin/payments', async (_req, res) => {
  const [invoices, subs] = await Promise.all([
    stripe.invoices.list({ limit: 10, status: 'paid' }),
    stripe.subscriptions.list({ status: 'active', limit: 100 }),
  ]);
  const payments = invoices.data.map((i) => ({
    customer: i.customer_email || 'customer',
    plan: (i.lines.data[0] && i.lines.data[0].description) || 'Pro',
    amount: (i.amount_paid / 100).toFixed(2),
    status: 'Active',
  }));
  const mrr = subs.data.reduce((s, sub) => s + (sub.items.data[0]?.price.unit_amount || 0), 0) / 100;
  res.json({
    payments,
    meta: { mrr: mrr.toFixed(2), subscribers: subs.data.length },
  });
});

app.listen(8787, () => console.log('Solia Stripe server on :8787'));