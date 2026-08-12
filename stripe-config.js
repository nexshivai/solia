/* Solia — Stripe config
   ------------------------------------------------------------------
   PUBLISHABLE key: safe to expose in the browser (front-end only).
   SECRET key:      NEVER expose. Only used server-side via env var.
   ------------------------------------------------------------------ */
window.SOLIA_STRIPE_PUBLISHABLE_KEY =
  window.SOLIA_STRIPE_PUBLISHABLE_KEY ||
  'pk_live_51SXz7eK2aeRNu9nGGTAaVtnxRTfHFGVMaQwlRLfgyITmia0jVGQePGZB9JLYLl6onCdXUDJUBATXXHuhALSXuYw400veLMWlq1';

/* Payment Links — create in Stripe Dashboard → Payment Links, then paste here.
   Without a backend, Payment Links are the fastest way to accept $ live. */
window.SOLIA_PAYMENT_LINKS = {
  pro: '', // 'https://buy.stripe.com/xxxx'  → Pro $19/mo recurring
  byo: ''  // 'https://buy.stripe.com/yyyy'  → BYO API $5
};