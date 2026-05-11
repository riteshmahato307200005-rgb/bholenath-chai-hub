const OWNER_USERNAME = "owner";
const OWNER_PASSWORD = "bholenath123";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type OwnerAuthScope = "orders" | "admin-page" | "inquiries";

type AttemptState = {
  count: number;
  lockedUntil: number;
};

function getStorageKey(scope: OwnerAuthScope) {
  return `bholenath-owner-auth-${scope}`;
}

function readAttemptState(scope: OwnerAuthScope): AttemptState {
  if (typeof window === "undefined") {
    return { count: 0, lockedUntil: 0 };
  }

  try {
    const stored = window.localStorage.getItem(getStorageKey(scope));
    if (!stored) return { count: 0, lockedUntil: 0 };

    const parsed = JSON.parse(stored) as Partial<AttemptState>;
    return {
      count: Number(parsed.count) || 0,
      lockedUntil: Number(parsed.lockedUntil) || 0,
    };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function writeAttemptState(scope: OwnerAuthScope, state: AttemptState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(scope), JSON.stringify(state));
}

export function clearOwnerLoginFailures(scope: OwnerAuthScope) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getStorageKey(scope));
}

export function validateOwnerLogin(
  username: string,
  password: string,
  scope: OwnerAuthScope
) {
  const state = readAttemptState(scope);
  const now = Date.now();

  if (state.lockedUntil > now) {
    const minutes = Math.ceil((state.lockedUntil - now) / 60000);
    return {
      ok: false,
      message: `Too many wrong attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const isValid =
    username.trim() === OWNER_USERNAME && password === OWNER_PASSWORD;

  if (isValid) {
    clearOwnerLoginFailures(scope);
    return { ok: true, message: "" };
  }

  const nextCount = state.count + 1;
  const nextState = {
    count: nextCount,
    lockedUntil: nextCount >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0,
  };

  writeAttemptState(scope, nextState);

  if (nextState.lockedUntil > now) {
    return {
      ok: false,
      message: "Too many wrong attempts. Owner login is locked for 15 minutes.",
    };
  }

  const attemptsLeft = MAX_ATTEMPTS - nextCount;
  return {
    ok: false,
    message: `Invalid owner credentials. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`,
  };
}
