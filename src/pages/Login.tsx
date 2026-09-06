import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      // Store the authentication token temporarily.
      localStorage.setItem("verdiq_token", data.token);

      // Store basic user information for the current prototype.
      localStorage.setItem(
        "verdiq_user",
        JSON.stringify(data.user),
      );

      // Redirect based on role.
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "developer") {
        navigate("/developer");
      } else if (data.user.role === "auditor") {
        navigate("/auditor");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during login.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] px-6 py-12 text-[#172018]">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <p className="text-2xl font-semibold tracking-tight">
            verdiq
          </p>

          <p className="mt-1 text-sm text-[#657064]">
            Welcome back. Continue your carbon journey.
          </p>
        </div>

        <div className="rounded-3xl border border-[#dce3d8] bg-white p-8 shadow-[0_20px_60px_rgba(30,50,30,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-[#657064]">
            Access your Verdiq account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none transition focus:border-[#4d8b55]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none transition focus:border-[#4d8b55]"
                placeholder="Your password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-[#e2b8b8] bg-[#fff2f2] px-4 py-3 text-sm text-[#8a3d3d]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#172018] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#657064]">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium text-[#4d8b55] hover:underline"
            >
              Create one
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;