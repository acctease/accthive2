"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuthToken } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint =
        authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body =
        authMode === "login"
          ? { email, password }
          : { email, password, name: name || email.split("@")[0] }; // Use email prefix if name not provided

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        // Store JWT token
        setAuthToken(data.data.token);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-dark">
      {/* Ambient Background Gradients */}
      <div className="absolute inset-0 w-full h-full">
        {/* Top Left Purple Glow */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]"></div>
        {/* Bottom Right Pink/Violet Glow */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/15 blur-[100px]"></div>
        {/* Center subtle light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[90px]"></div>
      </div>

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none z-0"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7yot9nlnD4TvHnj3b_BegAHP1-g5KKfpkhEhQAcCJMVcqMuuT7CUZs57Lf_PP_ji4Zi6QN_Si-j3jDQ06zufhTrS9rYizar4MrTE0YFNE4pYegZH2P3kMnaUSlejgMyLExvi0PnYSDcAWlqUX6h3Igl0NcTEIIzY7U863-VrWYhVAFm6giVF-LX1KxX2-cFJybzvFHsyRywHVpaWTRM1FKSXKl2XqHorvFNW703Gkv4z_qy1YuY4UXJs34kNNSkim5b6BUEo0wuI')",
        }}
      ></div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-[400px] p-8 rounded-[24px] flex flex-col gap-6 mx-4 bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 text-white drop-shadow-[0_0_15px_rgba(106,59,247,0.5)]">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_543)">
                <path
                  d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                  fill="currentColor"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_543">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight">
            Accthive
          </h2>
        </div>

        {/* Segmented Toggle */}
        <div className="flex p-1 bg-[#131118]/40 rounded-full border border-white/5 relative">
          <label className="flex-1 cursor-pointer">
            <input
              checked={authMode === "login"}
              onChange={() => {
                setAuthMode("login");
                setError(null);
              }}
              className="peer sr-only"
              name="auth-mode"
              type="radio"
              value="login"
            />
            <div className="w-full py-2.5 text-sm font-semibold text-center rounded-full text-white/60 peer-checked:bg-[#2c2839] peer-checked:text-white peer-checked:shadow-sm transition-all duration-300">
              Log In
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input
              checked={authMode === "signup"}
              onChange={() => {
                setAuthMode("signup");
                setError(null);
              }}
              className="peer sr-only"
              name="auth-mode"
              type="radio"
              value="signup"
            />
            <div className="w-full py-2.5 text-sm font-semibold text-center rounded-full text-white/60 peer-checked:bg-[#2c2839] peer-checked:text-white peer-checked:shadow-sm transition-all duration-300">
              Sign Up
            </div>
          </label>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Name Field (Signup only) */}
          {authMode === "signup" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/70 ml-2 uppercase tracking-wider">
                Full Name (Optional)
              </label>
              <div className="flex w-full items-center rounded-full px-4 py-1 bg-white/[0.05] border border-white/[0.05] transition-all duration-300 focus-within:bg-white/[0.08] focus-within:border-primary focus-within:shadow-[0_0_0_1px_#6a3bf7]">
                <span className="material-symbols-outlined text-white/40 mr-3">
                  person
                </span>
                <input
                  className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:ring-0 focus:outline-none py-3 text-sm font-medium"
                  placeholder="John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/70 ml-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex w-full items-center rounded-full px-4 py-1 bg-white/[0.05] border border-white/[0.05] transition-all duration-300 focus-within:bg-white/[0.08] focus-within:border-primary focus-within:shadow-[0_0_0_1px_#6a3bf7]">
              <span className="material-symbols-outlined text-white/40 mr-3">
                mail
              </span>
              <input
                className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:ring-0 focus:outline-none py-3 text-sm font-medium"
                placeholder="name@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/70 ml-2 uppercase tracking-wider">
              Password
            </label>
            <div className="flex w-full items-center rounded-full px-4 py-1 bg-white/[0.05] border border-white/[0.05] transition-all duration-300 focus-within:bg-white/[0.08] focus-within:border-primary focus-within:shadow-[0_0_0_1px_#6a3bf7]">
              <span className="material-symbols-outlined text-white/40 mr-3">
                lock
              </span>
              <input
                className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:ring-0 focus:outline-none py-3 text-sm font-medium"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="text-white/40 hover:text-white transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-sm">
                error
              </span>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            className="mt-2 w-full h-12 rounded-full bg-gradient-to-r from-[#6a3bf7] to-fuchsia-600 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(106,59,247,0.3)] flex items-center justify-center font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin material-symbols-outlined mr-2">
                  progress_activity
                </span>
                {authMode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : authMode === "login" ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Helper Links */}
          <div className="flex justify-between items-center text-xs mt-1 px-2">
            <a
              className="text-white/50 hover:text-white transition-colors"
              href="#"
            >
              Forgot Password?
            </a>
            <a
              className="text-white/50 hover:text-white transition-colors"
              href="#"
            >
              Need Help?
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
            <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">
              Or continue with
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
          </div>

          {/* Social Auth */}
          <div className="flex justify-center gap-4">
            <button
              className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
              type="button"
            >
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
            </button>
            <button
              className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
              type="button"
            >
              <svg
                className="size-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13.065 2.684c.646-.776 1.085-1.854.965-2.934-1.012.041-2.238.675-2.964 1.523-.65.748-1.217 1.947-1.063 2.964 1.129.088 2.285-.568 3.062-1.553zM18.84 16.897c1.47 2.138.802 3.948-.485 5.862-.647.962-1.325 1.92-2.396 1.938-1.049.02-1.39-.62-2.607-.62-1.216 0-1.6.602-2.625.639-1.049.037-1.85-1.05-2.525-2.03-1.378-2.001-2.434-5.656-1.018-8.125.706-1.226 1.968-2.002 3.33-2.02 1.031-.02 2.004.693 2.63.693.627 0 1.802-.857 3.037-.732 1.033.104 1.963.693 2.502 1.481-2.238 1.34-1.875 5.253.157 8.017zM15.42 11.236c-.538 2.527 2.235 4.383 2.662 2.844-2.183.18-2.23-2.643-2.662-2.844z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Back to Home */}
      <Link
        className="mt-8 flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors group z-10"
        href="/"
      >
        <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        Back to Home
      </Link>
    </div>
  );
}
