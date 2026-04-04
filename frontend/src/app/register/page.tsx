"use client";

import { useAuth } from "@/features/auth/auth.context";
import { register } from "@/lib/auth/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Customer registration page.
 */
import PageLayout from "@/components/layout/UX/PageLayout";
import BackButton from "@/components/layout/UX/BackButton";
import { useToastContext } from "@/components/providers/ToastProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { addToast } = useToastContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast("error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({ email, password });
      addToast("success", "Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      addToast("error", err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4 font-sans">
        <div className="w-full max-w-md">
          <BackButton className="mb-10" label="Back to Shop" />
          
          <div className="bg-white dark:bg-zinc-950 p-10 rounded-[2.5rem] shadow-2xl shadow-zinc-200 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic">Join Arohoo</h1>
              <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Create your global commerce account today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all text-sm font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all text-sm font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all text-sm font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-zinc-950 text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-800 disabled:bg-zinc-400 shadow-xl shadow-zinc-200 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:shadow-none mt-4"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-10">
              <p className="text-xs font-bold text-zinc-500">
                Already have an account?{" "}
                <Link href="/login" className="text-zinc-900 dark:text-zinc-50 hover:underline underline-offset-4">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">
            Sustainable Marketplace Protocol v7.0
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
