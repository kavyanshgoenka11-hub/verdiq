import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type PortfolioSummary = {
  total_purchased: number;
  total_owned: number;
  total_retired: number;
  purchase_count: number;
  total_purchase_value: number;
};

type Holding = {
  purchase_id: number;
  project_id: number;
  project_name: string;
  project_type: string;
  location: string;

  purchased_quantity: number;
  retired_quantity: number;
  owned_quantity: number;

  price_per_credit: number;
  purchased_at: string;
};

type FootprintReport = {
  id: number;
  reporting_year: number;

  scope1: number;
  scope2: number;
  scope3: number;
  total: number;

  status: string;

  created_at: string;
  updated_at: string;
};

type PortfolioResponse = {
  summary: PortfolioSummary;
  holdings: Holding[];
  purchases: unknown[];
  retirements: unknown[];
};

function Dashboard() {
  const navigate = useNavigate();

  const [portfolio, setPortfolio] =
    useState<PortfolioResponse | null>(null);

  const [reports, setReports] =
    useState<FootprintReport[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const storedUser =
    localStorage.getItem("verdiq_user");

  let user: {
    id?: number;
    name?: string;
    organization?: string | null;
    email?: string;
    role?: string;
  } | null = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    const token =
      localStorage.getItem("verdiq_token");

    if (!token || user?.role !== "buyer") {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [portfolioResponse, reportsResponse] =
          await Promise.all([
            fetch(
              "http://localhost:5000/api/buyer/portfolio",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            ),

            fetch(
              "http://localhost:5000/api/buyer/footprint-reports",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            ),
          ]);

        const portfolioData =
          await portfolioResponse.json();

        const reportsData =
          await reportsResponse.json();

        if (!portfolioResponse.ok) {
          throw new Error(
            portfolioData.error ||
              "Failed to load portfolio.",
          );
        }

        if (!reportsResponse.ok) {
          throw new Error(
            reportsData.error ||
              "Failed to load footprint reports.",
          );
        }

        setPortfolio(portfolioData);

        setReports(
          Array.isArray(reportsData.reports)
            ? reportsData.reports
            : [],
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", {
      replace: true,
    });
  };

  const latestReport =
    reports.length > 0
      ? reports[0]
      : null;

  const activeHolding =
    portfolio?.holdings?.find(
      (holding) =>
        Number(holding.owned_quantity) > 0,
    ) ||
    portfolio?.holdings?.[0] ||
    null;

  const hasFinalizedReport =
    reports.some(
      (report) =>
        report.status === "finalized",
    );

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <nav className="sticky top-0 z-50 border-b border-[#dce3d8] bg-[#f6f8f3]/95 px-8 py-5 backdrop-blur lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-2xl font-semibold tracking-tight"
            >
              verdiq
            </button>

            <p className="text-xs text-[#657064]">
              Corporate Impact Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/portfolio")
              }
              className="hidden rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea] sm:block"
            >
              Portfolio
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/marketplace")
              }
              className="hidden rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea] md:block"
            >
              Marketplace
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="max-w-4xl">
          <p className="text-sm text-[#657064]">
            Corporate climate workspace
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {user?.organization ||
              user?.name ||
              "Corporate buyer"}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#657064]">
            Measure your emissions, understand your carbon position,
            acquire verified credits, and permanently retire them with
            traceable proof.
          </p>
        </div>

        {/* ====================================================== */}
        {/* ERROR */}
        {/* ====================================================== */}

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {/* ====================================================== */}
        {/* QUICK ACTIONS */}
        {/* ====================================================== */}

        <section className="mt-10">
          <div>
            <p className="text-sm text-[#657064]">
              Climate actions
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Take your next step
            </h2>

            <p className="mt-2 text-sm text-[#657064]">
              Everything important is one click away.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Calculate */}
            <button
              type="button"
              onClick={() =>
                navigate("/calculator")
              }
              className="group rounded-3xl border border-[#dce3d8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
                ≈
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Calculate footprint
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Measure Scope 1, Scope 2 and Scope 3 emissions and create
                a traceable report.
              </p>

              <p className="mt-5 text-sm font-medium text-[#4d8b55]">
                Measure emissions →
              </p>
            </button>

            {/* Marketplace */}
            <button
              type="button"
              onClick={() =>
                navigate("/marketplace")
              }
              className="group rounded-3xl border border-[#dce3d8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
                ◆
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Explore marketplace
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Discover verified environmental projects and acquire
                credits for your climate strategy.
              </p>

              <p className="mt-5 text-sm font-medium text-[#4d8b55]">
                Explore credits →
              </p>
            </button>

            {/* Portfolio */}
            <button
              type="button"
              onClick={() =>
                navigate("/portfolio")
              }
              className="group rounded-3xl border border-[#dce3d8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Manage portfolio
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Review purchases, current ownership, retirements, and
                certificates.
              </p>

              <p className="mt-5 text-sm font-medium text-[#4d8b55]">
                Open portfolio →
              </p>
            </button>
          </div>
        </section>

        {/* ====================================================== */}
        {/* PORTFOLIO KPIs */}
        {/* ====================================================== */}

        <section className="mt-12">
          <div>
            <p className="text-sm text-[#657064]">
              Portfolio snapshot
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Your carbon position
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#657064]">
                Purchased
              </p>

              <p className="mt-3 text-4xl font-semibold">
                {loading
                  ? "…"
                  : portfolio?.summary.total_purchased.toLocaleString() ??
                    "0"}
              </p>

              <p className="mt-2 text-xs text-[#7b8578]">
                Total credits acquired
              </p>
            </div>

            <div className="rounded-3xl border border-[#c9dcc9] bg-[#edf5ea] p-6 shadow-sm">
              <p className="text-sm text-[#52765a]">
                Currently owned
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#37643d]">
                {loading
                  ? "…"
                  : portfolio?.summary.total_owned.toLocaleString() ??
                    "0"}
              </p>

              <p className="mt-2 text-xs text-[#52765a]">
                Available in your portfolio
              </p>
            </div>

            <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#657064]">
                Permanently retired
              </p>

              <p className="mt-3 text-4xl font-semibold">
                {loading
                  ? "…"
                  : portfolio?.summary.total_retired.toLocaleString() ??
                    "0"}
              </p>

              <p className="mt-2 text-xs text-[#7b8578]">
                Removed from circulation
              </p>
            </div>

            <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#657064]">
                Transactions
              </p>

              <p className="mt-3 text-4xl font-semibold">
                {loading
                  ? "…"
                  : portfolio?.summary.purchase_count ??
                    0}
              </p>

              <p className="mt-2 text-xs text-[#7b8578]">
                Completed purchases
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* LATEST FOOTPRINT */}
        {/* ====================================================== */}

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-[#657064]">
                Carbon measurement
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Latest footprint
              </h2>

              <p className="mt-2 text-sm text-[#657064]">
                Your most recent saved emissions report.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/calculator")
              }
              className="text-sm font-medium text-[#4d8b55] hover:underline"
            >
              Calculate new report →
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm">
            {!latestReport ? (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="rounded-full bg-[#fbfcfa] px-3 py-1 text-xs font-medium text-[#657064]">
                    No report yet
                  </span>

                  <h3 className="mt-5 text-2xl font-semibold">
                    Start measuring your footprint
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#657064]">
                    Calculate Scope 1, Scope 2 and Scope 3 emissions,
                    save the report, review the result, and finalize it
                    for Verdiq climate analytics.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/calculator")
                  }
                  className="shrink-0 rounded-xl bg-[#172018] px-6 py-3.5 text-sm font-medium text-white"
                >
                  Calculate footprint →
                </button>
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                        {latestReport.status}
                      </span>

                      <span className="rounded-full bg-[#fbfcfa] px-3 py-1 text-xs font-medium text-[#657064]">
                        {latestReport.reporting_year}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-semibold">
                      {latestReport.total.toFixed(2)} tCO₂e
                    </h3>

                    <p className="mt-2 text-sm text-[#657064]">
                      Total reported emissions
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#edf5ea] p-5 lg:min-w-[240px]">
                    <p className="text-xs text-[#52765a]">
                      Report status
                    </p>

                    <p className="mt-1 text-lg font-semibold text-[#37643d]">
                      {latestReport.status ===
                      "finalized"
                        ? "✓ Finalized"
                        : "Review required"}
                    </p>

                    <p className="mt-1 text-xs text-[#52765a]">
                      {latestReport.status ===
                      "finalized"
                        ? "Included in Verdiq analytics"
                        : "Finalize to publish analytics"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#fbfcfa] p-5">
                    <p className="text-xs text-[#7b8578]">
                      Scope 1
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {latestReport.scope1.toFixed(2)}
                    </p>

                    <p className="text-xs text-[#7b8578]">
                      tCO₂e
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fbfcfa] p-5">
                    <p className="text-xs text-[#7b8578]">
                      Scope 2
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {latestReport.scope2.toFixed(2)}
                    </p>

                    <p className="text-xs text-[#7b8578]">
                      tCO₂e
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fbfcfa] p-5">
                    <p className="text-xs text-[#7b8578]">
                      Scope 3
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {latestReport.scope3.toFixed(2)}
                    </p>

                    <p className="text-xs text-[#7b8578]">
                      tCO₂e
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 border-t border-[#edf0ea] pt-6 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/calculator")
                    }
                    className="rounded-xl border border-[#cdd5c9] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#eef2ea]"
                  >
                    New calculation
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/marketplace")
                    }
                    className="rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
                  >
                    Explore credits →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================== */}
        {/* CURRENT CARBON POSITION */}
        {/* ====================================================== */}

        <section className="mt-12">
          <div>
            <p className="text-sm text-[#657064]">
              Current position
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Your carbon asset status
            </h2>
          </div>

          <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm">
            {!activeHolding ? (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">
                    No carbon credits in your portfolio
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#657064]">
                    Once you purchase verified credits, your current
                    ownership and retirement position will appear here.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/marketplace")
                  }
                  className="shrink-0 rounded-xl bg-[#172018] px-6 py-3.5 text-sm font-medium text-white"
                >
                  Explore marketplace →
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                      ✓ Verified holding
                    </span>

                    <h3 className="mt-5 text-2xl font-semibold">
                      {activeHolding.project_name}
                    </h3>

                    <p className="mt-2 text-sm text-[#657064]">
                      {activeHolding.project_type} ·{" "}
                      {activeHolding.location}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/portfolio")
                    }
                    className="rounded-xl border border-[#cdd5c9] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#eef2ea]"
                  >
                    Open full portfolio →
                  </button>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#fbfcfa] p-5">
                    <p className="text-xs text-[#7b8578]">
                      Purchased
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {activeHolding.purchased_quantity.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#edf5ea] p-5">
                    <p className="text-xs text-[#52765a]">
                      Currently owned
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-[#37643d]">
                      {activeHolding.owned_quantity.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fbfcfa] p-5">
                    <p className="text-xs text-[#7b8578]">
                      Retired
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      {activeHolding.retired_quantity.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 border-t border-[#edf0ea] pt-6 sm:flex-row">
                  {activeHolding.owned_quantity >
                    0 && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/retire/${activeHolding.purchase_id}`,
                        )
                      }
                      className="rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
                    >
                      Retire credits →
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/portfolio")
                    }
                    className="rounded-xl border border-[#cdd5c9] bg-white px-5 py-3 text-sm font-medium"
                  >
                    View portfolio
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ====================================================== */}
        {/* STATUS STRIP */}
        {/* ====================================================== */}

        <section className="mt-12">
          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm">
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Measurement
                </p>

                <p className="mt-2 font-semibold">
                  {reports.length > 0
                    ? "Active"
                    : "Not started"}
                </p>

                <p className="mt-1 text-xs text-[#657064]">
                  Footprint reporting
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Reporting
                </p>

                <p className="mt-2 font-semibold">
                  {hasFinalizedReport
                    ? "Finalized"
                    : reports.length > 0
                      ? "Review"
                      : "Not started"}
                </p>

                <p className="mt-1 text-xs text-[#657064]">
                  Public climate analytics
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Ownership
                </p>

                <p className="mt-2 font-semibold">
                  {portfolio?.summary.total_owned &&
                  portfolio.summary.total_owned > 0
                    ? "Active"
                    : "No holdings"}
                </p>

                <p className="mt-1 text-xs text-[#657064]">
                  Carbon portfolio
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Impact
                </p>

                <p className="mt-2 font-semibold">
                  {portfolio?.summary.total_retired &&
                  portfolio.summary.total_retired > 0
                    ? "Recorded"
                    : "No retirements"}
                </p>

                <p className="mt-1 text-xs text-[#657064]">
                  Permanent retirement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* FINAL CTA */}
        {/* ====================================================== */}

        <section className="mt-12 overflow-hidden rounded-[2rem] bg-[#172018] p-8 text-white sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm text-[#bcc7b9]">
              Your climate action workspace
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Measure your footprint. Act on the result. Prove the impact.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#bcc7b9]">
              Verdiq connects carbon measurement, verified projects,
              marketplace activity, ownership, retirement, and
              certificates into one traceable workflow.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate("/calculator")
                }
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#172018]"
              >
                Calculate footprint
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/marketplace")
                }
                className="rounded-full border border-[#556054] px-6 py-3 text-sm font-medium text-white"
              >
                Explore marketplace
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;