FROM node:20-slim AS base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ENV DATABASE_URL=postgresql://low:bUs9jGTv8HfC@ep-snowy-frog-a4vyrlp1.us-east-1.aws.neon.tech/expense_tracker_db?sslmode=require
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGliZXJhbC1sYWR5YnVnLTg2LmNsZXJrLmFjY291bnRzLmRldiQ
ENV CLERK_SECRET_KEY=sk_test_Ltu7uNZ1RJUU3Gc1vKWDhREwRyLFIcxGFbG1DabmJ2

RUN npm run build

FROM base AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://low:bUs9jGTv8HfC@ep-snowy-frog-a4vyrlp1.us-east-1.aws.neon.tech/expense_tracker_db?sslmode=require
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGliZXJhbC1sYWR5YnVnLTg2LmNsZXJrLmFjY291bnRzLmRldiQ
ENV CLERK_SECRET_KEY=sk_test_Ltu7uNZ1RJUU3Gc1vKWDhREwRyLFIcxGFbG1DabmJ2

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]