import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

type Holding = {
  purchase_id: number;
  listing_id: number;
  credit_id: number;

  project_id: number;
  project_name: string;
  project_type: string;
  location: string;

  serial_number: string;

  purchased_quantity: number;
  retired_quantity: number;
  owned_quantity: number;

  price_per_credit: number;
  total_amount: number;

  purchased_at: string;
};

type Purchase = {
  id: number;
  listing_id: number;
  credit_id: number;

  project_name: string;
  serial_number: string;

  seller: {
    name: string;
    organization: string | null;
  };

  quantity: number;
  price_per_credit: number;
  total_amount: number;

  status: string;
  purchased_at: string;
};

type Retirement = {
  id: number;
  purchase_id: number;

  project_name: string;
  quantity: number;

  reason: string | null;
  retirement_reference: string;
  retired_at: string;

  certificate: {
    id: number;
    certificate_number: string;
    issued_at: string;
  } | null;
};

type PortfolioData = {
  summary: {
    total_purchased: number;
    total_owned: number;
    total_retired: number;
    purchase_count: number;
    total_purchase_value: number;
  };

  holdings: Holding[];
  purchases: Purchase[];
  retirements: Retirement[];
};

function Portfolio() {
  const navigate = useNavigate();

  const [portfolio, setPortfolio] =
    useState<PortfolioData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("verdiq_token");

    const storedUser =
      localStorage.getItem("verdiq_user");

    let user = null;

    try {
      user = storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      user = null;
    }

    if (!token || user?.role !== "buyer") {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    fetch(
      `${API_BASE_URL}/api/buyer/portfolio`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load portfolio."
          );
        }

        return data;
      })
      .then((data) => {
        setPortfolio(data);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load portfolio."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f3] text-[#172018]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#dce3d8] border-t-[#4d8b55]" />

          <p className="mt-4 text-sm text-[#657064]">
            Loading your portfolio...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* Navigation */}
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
              Carbon Portfolio
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="hidden rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea] sm:block"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/marketplace")
              }
              className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
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
        {/* Header */}
        <div>
          <p className="text-sm text-[#657064]">
            Carbon asset management
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Your portfolio
          </h1>

          <p className="mt-3 max-w-2xl text-[#657064]">
            Track every purchased credit, current ownership,
            retirement, and certificate from one place.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {portfolio && (
          <>
            {/* Summary */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-3xl border border-[#dce3d8] bg-white p-6">
                <p className="text-sm text-[#657064]">
                  Purchased
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  {portfolio.summary.total_purchased.toLocaleString()}
                </p>
              </div>

              <div className="rounded-3xl border border-[#dce3d8] bg-[#edf5ea] p-6">
                <p className="text-sm text-[#52765a]">
                  Currently owned
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#37643d]">
                  {portfolio.summary.total_owned.toLocaleString()}
                </p>
              </div>

              <div className="rounded-3xl border border-[#dce3d8] bg-white p-6">
                <p className="text-sm text-[#657064]">
                  Retired
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  {portfolio.summary.total_retired.toLocaleString()}
                </p>
              </div>

              <div className="rounded-3xl border border-[#dce3d8] bg-white p-6">
                <p className="text-sm text-[#657064]">
                  Transactions
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  {portfolio.summary.purchase_count}
                </p>
              </div>

              <div className="rounded-3xl border border-[#dce3d8] bg-white p-6">
                <p className="text-sm text-[#657064]">
                  Purchase value
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  ₹
                  {portfolio.summary.total_purchase_value.toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>

            {/* Holdings */}
            <section className="mt-12">
              <div>
                <p className="text-sm text-[#657064]">
                  Current holdings
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Carbon credits you own
                </h2>
              </div>

              {portfolio.holdings.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-10 text-center">
                  <h3 className="text-xl font-semibold">
                    No credits owned yet
                  </h3>

                  <p className="mt-2 text-sm text-[#657064]">
                    Explore the marketplace to acquire your first
                    verified carbon credits.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/marketplace")
                    }
                    className="mt-6 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
                  >
                    Explore marketplace →
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {portfolio.holdings.map(
                    (holding) => (
                      <article
                        key={holding.purchase_id}
                        className="rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm"
                      >
                        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                                ✓ Verified
                              </span>

                              <span className="rounded-full bg-[#fbfcfa] px-3 py-1 text-xs font-medium text-[#657064]">
                                {holding.project_type}
                              </span>
                            </div>

                            <h3 className="mt-4 text-2xl font-semibold">
                              {holding.project_name}
                            </h3>

                            <p className="mt-2 text-sm text-[#657064]">
                              {holding.location}
                            </p>

                            <p className="mt-4 break-all font-mono text-xs text-[#7b8578]">
                              {holding.serial_number}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-3 lg:w-[430px]">
                            <div className="rounded-2xl bg-[#fbfcfa] p-4">
                              <p className="text-xs text-[#7b8578]">
                                Purchased
                              </p>

                              <p className="mt-2 text-2xl font-semibold">
                                {holding.purchased_quantity.toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-[#edf5ea] p-4">
                              <p className="text-xs text-[#52765a]">
                                Owned
                              </p>

                              <p className="mt-2 text-2xl font-semibold text-[#37643d]">
                                {holding.owned_quantity.toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-[#fbfcfa] p-4">
                              <p className="text-xs text-[#7b8578]">
                                Retired
                              </p>

                              <p className="mt-2 text-2xl font-semibold">
                                {holding.retired_quantity.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-7 flex flex-col gap-5 border-t border-[#edf0ea] pt-6 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-6 text-sm">
                            <div>
                              <p className="text-xs text-[#7b8578]">
                                Price
                              </p>

                              <p className="mt-1 font-semibold">
                                ₹
                                {holding.price_per_credit.toLocaleString(
                                  "en-IN",
                                )}
                                <span className="ml-1 text-xs font-normal text-[#7b8578]">
                                  / credit
                                </span>
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-[#7b8578]">
                                Purchased
                              </p>

                              <p className="mt-1 font-medium">
                                {new Date(
                                  holding.purchased_at,
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    dateStyle:
                                      "medium",
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              holding.owned_quantity <= 0
                            }
                            onClick={() =>
                              navigate(
                                `/retire/${holding.purchase_id}`,
                              )
                            }
                            className="rounded-xl bg-[#172018] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {holding.owned_quantity > 0
                              ? "Retire credits →"
                              : "Fully retired"}
                          </button>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
            </section>

            {/* Purchase history */}
            <section className="mt-12">
              <p className="text-sm text-[#657064]">
                Transaction history
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Purchases
              </h2>

              {portfolio.purchases.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-8 text-center text-sm text-[#657064]">
                  No purchases yet.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {portfolio.purchases.map(
                    (purchase) => (
                      <div
                        key={purchase.id}
                        className="rounded-2xl border border-[#dce3d8] bg-white p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="font-semibold">
                              {purchase.project_name}
                            </p>

                            <p className="mt-1 text-xs text-[#7b8578]">
                              Purchase #{purchase.id} ·{" "}
                              {new Date(
                                purchase.purchased_at,
                              ).toLocaleDateString(
                                "en-IN",
                              )}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-6 text-sm">
                            <div>
                              <p className="text-xs text-[#7b8578]">
                                Quantity
                              </p>

                              <p className="mt-1 font-semibold">
                                {purchase.quantity.toLocaleString()}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-[#7b8578]">
                                Price
                              </p>

                              <p className="mt-1 font-semibold">
                                ₹
                                {purchase.price_per_credit.toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-[#7b8578]">
                                Total
                              </p>

                              <p className="mt-1 font-semibold">
                                ₹
                                {purchase.total_amount.toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </div>
                          </div>

                          <span className="self-start rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            {/* Retirement history */}
            <section className="mt-12">
              <p className="text-sm text-[#657064]">
                Retirement history
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Permanently retired credits
              </h2>

              {portfolio.retirements.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-8 text-center text-sm text-[#657064]">
                  No credits have been retired yet.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {portfolio.retirements.map(
                    (retirement) => (
                      <div
                        key={retirement.id}
                        className="rounded-2xl border border-[#dce3d8] bg-white p-5"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="font-semibold">
                              {retirement.project_name}
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-[#7b8578]">
                              {
                                retirement.retirement_reference
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#7b8578]">
                              {new Date(
                                retirement.retired_at,
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  dateStyle:
                                    "medium",
                                },
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-[#7b8578]">
                              Credits retired
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[#37643d]">
                              {retirement.quantity.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/retirement/success/${retirement.id}`,
                                )
                              }
                              className="rounded-xl border border-[#cdd5c9] bg-white px-4 py-2.5 text-sm font-medium"
                            >
                              View retirement
                            </button>

                            {retirement.certificate && (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/certificate/${retirement.certificate?.id}`,
                                  )
                                }
                                className="rounded-xl bg-[#172018] px-4 py-2.5 text-sm font-medium text-white"
                              >
                                Certificate →
                              </button>
                            )}
                          </div>
                        </div>

                        {retirement.reason && (
                          <div className="mt-5 border-t border-[#edf0ea] pt-4">
                            <p className="text-xs text-[#7b8578]">
                              Purpose
                            </p>

                            <p className="mt-1 text-sm text-[#657064]">
                              {retirement.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default Portfolio;