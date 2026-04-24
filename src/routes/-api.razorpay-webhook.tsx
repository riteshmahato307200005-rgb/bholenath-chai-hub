import { createAPIFileRoute } from "@tanstack/react-start/server";
import { handleRazorpayWebhook } from "@/lib/payment-server";

export const APIRoute = createAPIFileRoute("/api/razorpay/webhook", {
  POST: async ({ request }: { request: Request }) => {
    return handleRazorpayWebhook(request);
  },
});
