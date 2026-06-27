import { FormEvent, useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Fingerprint, Lock, Mail, ShieldAlert, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import LogoIcon from "../components/LogoIcon";

type AuthMode = "login" | "signup";

export default function Login() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const originalClasses = Array.from(root.classList);

    const applySystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      root.classList.remove('dark', 'light');
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    };

    applySystemTheme(mediaQuery);
    const listener = (e: MediaQueryListEvent) => applySystemTheme(e);
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      root.className = '';
      if (originalClasses.length > 0) {
        root.classList.add(...originalClasses);
      }
    };
  }, []);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        navigate(from, { replace: true });
        return;
      }

      const { error } = await signUp(email, password, displayName || undefined);
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg(
        "Account created. Check your email to confirm your address, then sign in."
      );
      setMode("login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      <style>{`
        /* Autofill overrides specifically for Auth forms */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #fafafa inset !important;
          -webkit-text-fill-color: #18181b !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover, 
        .dark input:-webkit-autofill:focus, 
        .dark input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #23272f inset !important;
          -webkit-text-fill-color: #FFFFFF !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="h-14 border-b border-zinc-200 dark:border-zinc-900 px-5 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6" />
            <div className="flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-sm tracking-tight">Sign in to Socialintel</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-lg font-bold tracking-tight">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-xs text-zinc-500">
              {mode === "login"
                ? "Sign in with your email to access your workspace."
                : "Register with email to start using Socialintel."}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-950/20 rounded-lg text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 rounded-lg text-xs font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="login-display-name"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 font-bold text-xs text-white rounded-lg transition shadow-lg shadow-orange-500/10"
            >
              {submitting
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div className="text-center text-xs text-zinc-500">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-orange-500 font-bold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-orange-500 font-bold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
