import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../api";

type UserRole =
  | "buyer"
  | "developer"
  | "auditor"
  | "admin";

function AdminUsers() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", { replace: true });
  };

  const handleCreateUser = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            organization: organization.trim() || null,
            email: email.trim(),
            password,
            role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create user.",
        );
      }

      setSuccess(
        `${data.user.name} was created successfully as ${data.user.role}.`,
      );

      setName("");
      setOrganization("");
      setEmail("");
      setPassword("");
      setRole("buyer");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create user.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="text-2xl font-semibold tracking-tight"
          >
            verdiq
          </button>

          <p className="text-xs text-[#657064]">
            User Management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
          >
            Admin Dashboard
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
          >
            Sign out
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-8 py-12 lg:px-16">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="text-sm font-medium text-[#4d8b55] hover:underline"
        >
          ← Back to admin
        </button>

        <div className="mt-8 max-w-2xl">
          <p className="text-sm text-[#657064]">
            Platform administration
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            User management
          </h1>

          <p className="mt-3 text-[#657064]">
            Create accounts for every role in the Verdiq ecosystem.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-8 rounded-2xl border border-[#c9dcc9] bg-[#edf5ea] px-5 py-4 text-sm text-[#37643d]">
            ✓ {success}
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-[#dce3d8] bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#7b8578]">
              Create account
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              New platform user
            </h2>
          </div>

          <form
            onSubmit={handleCreateUser}
            className="space-y-6"
          >
            <div>
              <label className="text-sm font-medium">
                Full name
              </label>

              <input
                required
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter full name"
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Organization
              </label>

              <input
                type="text"
                value={organization}
                onChange={(event) =>
                  setOrganization(event.target.value)
                }
                placeholder="Company or organization"
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Email
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="user@company.com"
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Temporary password
              </label>

              <input
                required
                minLength={6}
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Role
              </label>

              <select
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value as UserRole,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              >
                <option value="buyer">
                  Buyer
                </option>

                <option value="developer">
                  Developer
                </option>

                <option value="auditor">
                  Auditor
                </option>

                <option value="admin">
                  Administrator
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#172018] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating user..."
                : "Create user"}
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6">
          <p className="text-sm font-semibold">
            Available roles
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4">
              <p className="font-medium">Buyer</p>
              <p className="mt-1 text-xs text-[#657064]">
                Purchase, own, and retire credits.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="font-medium">Developer</p>
              <p className="mt-1 text-xs text-[#657064]">
                Create projects and list verified credits.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="font-medium">Auditor</p>
              <p className="mt-1 text-xs text-[#657064]">
                Review projects and approve issuance.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="font-medium">Administrator</p>
              <p className="mt-1 text-xs text-[#657064]">
                Manage platform operations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminUsers;