# Hosting Guide - Bholenath Chai Hub

## What is ready now

- Customer cart and checkout flow
- Cash on pickup orders
- Razorpay online payment flow
- Supabase order storage after successful payment verification
- Contact form and admin dashboard

## Required environment variables

Add these in local `.env.local` and again in your hosting dashboard:

```env
VITE_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
ADMIN_PASSWORD=change_this_before_hosting
```

## Best hosting option

Use Cloudflare Pages or a Cloudflare Worker deployment for this project.

Why:

- This app already uses `@cloudflare/vite-plugin`
- The Razorpay create-order and verify routes need a server runtime
- Static-only hosting is not enough once payment APIs are enabled

## Recommended deploy flow

1. Push the repo to GitHub.
2. In Cloudflare, create a new Pages project from that repo.
3. Use these build settings:

```txt
Build command: npm run build
Build output directory: dist/client
Root directory: /
```

4. Add all environment variables from the section above.
5. Deploy.

## Important security notes

- Never commit `.env.local`.
- Keep `RAZORPAY_KEY_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` only in server-side env settings.
- Change the default admin password before going live.
- Use Razorpay test keys first, then switch to live keys only after a successful test payment.

## Testing before going live

1. Open the site and add items to cart.
2. Confirm cash checkout creates an order.
3. Confirm online checkout opens Razorpay.
4. Complete a Razorpay test payment.
5. Check that the order appears in Supabase/admin after payment verification.

## If you want a custom domain

After the first successful deploy:

1. Open your Cloudflare Pages project.
2. Go to `Custom domains`.
3. Add your domain.
4. Update DNS as Cloudflare instructs.

## Commands

```bash
npm run build
npm run preview
npm run lint
```

## Practical next step

Before hosting, put real Razorpay test keys into `.env.local`, run the app locally, and complete one test payment end to end. That is the fastest way to confirm hosting will work cleanly.
