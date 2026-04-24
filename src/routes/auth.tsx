import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login - Bholenath Chai" },
      { name: "description", content: "Sign in or create an account for faster checkout." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user, isConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      void navigate({ to: "/" });
    }
  }, [navigate, user]);

  if (user) return null;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(loginForm.email.trim(), loginForm.password);
      toast.success("Logged in successfully");
      void navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (signupForm.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp({
        fullName: signupForm.fullName.trim(),
        email: signupForm.email.trim(),
        phone: signupForm.phone.trim(),
        password: signupForm.password,
      });

      if (result === "signed_in") {
        toast.success("Account created successfully");
        void navigate({ to: "/" });
      } else {
        toast.success("Account created. Check your email to confirm your account.");
        setActiveTab("login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-section via-background to-white px-4 pb-20 pt-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] bg-gradient-to-br from-chai-brown via-[#5d2f12] to-saffron p-8 text-cream shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cream/70">
              Account Access
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight">
              Login for faster chai orders and a smoother checkout.
            </h1>
            <p className="mt-4 max-w-xl text-base text-cream/85">
              Save your email details, jump back into ordering faster, and keep the experience
              consistent across visits.
            </p>
            <div className="mt-8 space-y-4 text-sm text-cream/90">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                Faster checkout with prefilled details
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                Secure authentication powered by Supabase
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                Works on your deployed Vercel site too
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-orange-100 shadow-xl">
              <CardHeader>
                <CardTitle className="font-heading text-3xl text-chai-brown">
                  Welcome Back
                </CardTitle>
                <CardDescription>
                  Sign in or create an account to continue.
                </CardDescription>
                {!isConfigured && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Supabase auth is not configured yet. Add your Supabase env vars to enable login.
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((current) => ({ ...current, email: event.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((current) => ({
                              ...current,
                              password: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-saffron text-white"
                        disabled={!isConfigured || isSubmitting}
                      >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          placeholder="Ritesh Mahato"
                          value={signupForm.fullName}
                          onChange={(event) =>
                            setSignupForm((current) => ({
                              ...current,
                              fullName: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupForm.email}
                          onChange={(event) =>
                            setSignupForm((current) => ({ ...current, email: event.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone</Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="9876543210"
                          value={signupForm.phone}
                          onChange={(event) =>
                            setSignupForm((current) => ({ ...current, phone: event.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={signupForm.password}
                          onChange={(event) =>
                            setSignupForm((current) => ({
                              ...current,
                              password: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Re-enter your password"
                          value={signupForm.confirmPassword}
                          onChange={(event) =>
                            setSignupForm((current) => ({
                              ...current,
                              confirmPassword: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-saffron text-white"
                        disabled={!isConfigured || isSubmitting}
                      >
                        {isSubmitting ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
