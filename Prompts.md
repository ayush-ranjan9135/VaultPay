# Prompts & AI-Assisted Engineering Decisions

## Engineering Decisions

### 1. Architecture Choice
- Decided on a strict separation between frontend (React) and backend (Express) to enforce a clean API layer and improve security boundaries.
- Chose TypeScript for both frontend and backend to ensure type safety, especially critical for financial data (amounts, currencies).

### 2. Security and IDOR Prevention
- Authentication implemented via HttpOnly, Secure, SameSite=Strict cookies to mitigate XSS risks.
- All client-facing routes include explicit Mongoose queries that mandate `clientId: req.user.id`. Even if a client guesses another invoice's ID, the DB query will return null, naturally preventing IDOR.

### 3. Financial Integrity
- Minor currency units (cents) are used for all monetary values in the database and Stripe interactions to prevent floating-point precision errors.
- The frontend is never trusted with the payable amount. The backend always fetches the invoice from the database before creating a Stripe checkout session.

### 4. Stripe Webhook Reliability
- Webhook idempotency is enforced by storing the `webhookEventId` in the Payments collection. A unique index on this field ensures that even concurrent duplicate webhooks fail at the database level, preventing double-processing.

### 5. UI/UX Aesthetics
- Adopted a custom CSS approach (CSS modules/variables) adhering to a professional financial design language (deep navy, functional colors), intentionally avoiding TailwindCSS as per the strict constraints, ensuring a bespoke, enterprise-grade feel.
