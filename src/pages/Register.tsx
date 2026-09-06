import { FormEvent, useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            organization,
            email,
            password,
            role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setMessage("Account created successfully.");
      setName("");
      setOrganization("");
      setEmail("");
      setPassword("");
      setRole("buyer");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] px-6 py-12 text-[#172018]">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <p className="text-2xl font-semibold tracking-tight">verdiq</p>
          <p className="mt-1 text-sm text-[#657064]">
            Create your account and start your carbon journey.
          </p>
        </div>

        <div className="rounded-3xl border border-[#dce3d8] bg-white p-8 shadow-[0_20px_60px_rgba(30,50,30,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create account
          </h1>

          <p className="mt-2 text-sm text-[#657064]">
            Choose how you'll use Verdiq.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none transition focus:border-[#4d8b55]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Organization
              </label>
              <input
                type="text"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none transition focus:border-[#4d8b55]"
                placeholder="Company or organization"
              />
            </div>

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
                minLength={8}
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none transition focus:border-[#4d8b55]"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Account type
              </label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              >
                <option value="buyer">Corporate Buyer</option>
                <option value="developer">Project Developer</option>
              </select>
            </div>

            {message && (
              <div className="rounded-xl border border-[#b9d6bc] bg-[#edf5ea] px-4 py-3 text-sm text-[#37643d]">
                {message}
              </div>
            )}

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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;