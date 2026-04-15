import { json, createAPIFileRoute } from "@tanstack/react-start/server";
import { contactFormHandler } from "@/api/contact";

export const APIRoute = createAPIFileRoute("/api/contact", {
  PATCH: async ({ request }: { request: Request }) => {
    return contactFormHandler(request);
  },
  POST: async ({ request }: { request: Request }) => {
    return contactFormHandler(request);
  },
  OPTIONS: async () => {
    return json(
      { message: "Contact form API" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  },
});

export async function GET() {
  return json(
    { message: "Contact form API - POST or PATCH to submit" },
    { status: 405 }
  );
}
