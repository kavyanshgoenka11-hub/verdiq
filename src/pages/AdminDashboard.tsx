import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

type AdminStats = {
  total_users: number;
  total_projects: number;
  total_credits: number;
  total_retired: number;
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load admin statistics.",
          );
        }

        return data;
      })
      .then((data) => {
        setStats({
          total_users: Number(data.total_users),
          total_projects: Number(data.total_projects),
          total_credits: Number(data.total_credits),
          total_retired: Number(data.total_retired),
        });
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load admin dashboard.",
        );
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            verdiq
          </p>

          <p className="text-xs text-[#657064]">
            Administration
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
        >
          Sign out
        </button>
      </nav>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        {/* Header */}
        <div>
          <p className="text-sm text-[#657064]">
            Admin overview
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Platform control center
          </h1>

          <p className="mt-3 max-w-2xl text-[#657064]">
            Monitor users, environmental projects, carbon credits,
            and retirement activity across Verdiq.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#657064]">
              Registered users
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {stats ? stats.total_users : "…"}
            </p>
          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#657064]">
              Projects
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {stats ? stats.total_projects : "…"}
            </p>
          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#657064]">
              Credits issued
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {stats
                ? stats.total_credits.toLocaleString()
                : "…"}
            </p>
          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#657064]">
              Credits retired
            </p>

            <p className="mt-3 text-4xl font-semibold">
              {stats
                ? stats.total_retired.toLocaleString()
                : "…"}
            </p>
          </div>
        </div>

        {/* Admin operations */}
        <div className="mt-12">
          <div>
            <p className="text-sm text-[#657064]">
              Platform operations
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Manage Verdiq
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#657064]">
              Manage users and control the carbon-credit lifecycle
              from one place.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* User management */}
            <button
  type="button"
  onClick={() => navigate("/admin/users")}
  className="group rounded-3xl border border-[#dce3d8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
>
  <div className="flex items-start justify-between">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
      +
    </div>

    <span className="text-sm text-[#7b8578]">
      Admin
    </span>
  </div>

  <h3 className="mt-5 text-xl font-semibold">
    User management
  </h3>

  <p className="mt-2 text-sm leading-6 text-[#657064]">
    Create platform accounts for buyers, developers, auditors,
    and administrators.
  </p>

  <p className="mt-4 text-sm font-medium text-[#4d8b55]">
    Manage users →
  </p>
</button>

            {/* Credit management */}
            <button
              type="button"
              onClick={() => navigate("/admin/credits")}
              className="group rounded-3xl border border-[#dce3d8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
                  ◆
                </div>

                <span className="text-sm text-[#7b8578]">
                  Issuance
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Manage carbon credits
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Issue credits for verified projects and manage the
                platform's available credit inventory.
              </p>

              <p className="mt-4 text-sm font-medium text-[#4d8b55]">
                Open credit management →
              </p>
            </button>
          </div>
        </div>

        {/* Current platform state */}
        <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-[#657064]">
                Current credit lifecycle
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Verified → Issued → Listed → Retired
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Verdiq separates project verification, credit
                issuance, marketplace activity, and retirement so
                the lifecycle remains traceable.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/credits")}
              className="shrink-0 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              View credit inventory
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;