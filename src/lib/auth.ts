import { createClient } from "@supabase/supabase-js";

let browserClient: ReturnType<typeof createClient> | null | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
  const key = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

export function getUserDisplayName(input: {
  email?: string | null;
  fullName?: string | null;
}) {
  if (input.fullName?.trim()) {
    return input.fullName.trim();
  }

  if (input.email?.trim()) {
    return input.email.split("@")[0];
  }

  return "Guest";
}
