# 🍷 Arianova Developer Playbook

Use these commands to spin up the local development environment and the required webhook tunnels.

## 1. Next.js Development Server
Start the core application with Turbopack.
```bash
npm run dev
```

## 2. Stripe Webhook Listener (Inventory Safety Net)
Forwards Stripe events to your local environment.
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 3. Clerk Webhook Tunnel (User Sync)
Forwards Clerk authentication events using the ngrok tunnel.
```bash
npm run webhook:clerk
```

---

## 🛠️ Testing & Simulation

### Trigger a Stripe Success Event
```bash
stripe trigger checkout.session.completed
```

### Trigger a Stripe Expiry Event
```bash
stripe trigger checkout.session.expired
```

### Run Safety Net Unit Tests
```bash
npm run test src/__tests__/safety-net.test.ts
```

> [!IMPORTANT]
> Always ensure your `.env.local` contains the current `STRIPE_WEBHOOK_SECRET` provided by the CLI when it starts!
