import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api";

type Purchase = {
  id: number;
  transaction_id: string;

  quantity: number;
  price_per_credit: number;
  total_amount: number;

  purchased_at: string;

  project_name: string;
  serial_number: string;

  seller_name: string;
  seller_organization: string | null;

  buyer_name: string;
  buyer_organization: string | null;
};

function RetireCredits() {
  const navigate = useNavigate();
  const { purchaseId } = useParams();

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("verdiq_token");
    const storedUser = localStorage.getItem("verdiq_user");

    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    if (!token || user?.role !== "buyer") {
      navigate("/login", { replace: true });
      return;
    }

    if (!purchaseId) {
      setError("Invalid purchase.");
      setLoading(false);
      return;
    }

    fetch(
      `${API_BASE_URL}/api/buyer/purchases/${purchaseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load purchase details.",
          );
        }

        return data;
      })
      .then((data) => {
        setPurchase(data.purchase);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load purchase.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, purchaseId]);

  const handleRetire = async () => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!purchase) {
      setError("Purchase details are unavailable.");
      return;
    }

    const retirementQuantity = Number(quantity);

    if (
      !Number.isInteger(retirementQuantity) ||
      retirementQuantity <= 0
    ) {
      setError("Enter a valid whole-number quantity.");
      return;
    }

    if (retirementQuantity > Number(purchase.quantity)) {
      setError(
        `You cannot retire more than ${Number(
          purchase.quantity,
        ).toLocaleString()} credits from this purchase.`,
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/buyer/purchases/${purchase.id}/retire`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: retirementQuantity,
            reason: reason.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to retire credits.",
        );
      }

      navigate(
        `/retirement/success/${data.retirement.id}`,
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to retire credits.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f3] text-[#172018]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#dce3d8] border-t-[#4d8b55]" />

          <p className="mt-4 text-sm text-[#657064]">
            Loading retirement details...
          </p>
        </div>
      </main>
    );
  }

  if (!purchase) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] px-6 py-16 text-[#172018]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#e2b8b8] bg-[#fff2f2] p-8 text-center">
          <h1 className="text-xl font-semibold">
            Purchase unavailable
          </h1>

          <p className="mt-2 text-sm text-[#8a3d3d]">
            {error || "Unable to load purchase details."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
          >
            Back to portfolio
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-2xl font-semibold tracking-tight"
          >
            verdiq
          </button>

          <p className="text-xs text-[#657064]">
            Carbon Retirement
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
        >
          My Portfolio
        </button>
      </nav>

      <section className="mx-auto max-w-5xl px-8 py-12 lg:px-16">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="text-sm font-medium text-[#4d8b55] hover:underline"
        >
          ← Back to portfolio
        </button>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Project information */}
          <section className="rounded-3xl border border-[#dce3d8] bg-white p-8">
            <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
              ✓ Ownership verified
            </span>

            <h1 className="mt-5 text-3xl font-semibold">
              Retire carbon credits
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#657064]">
              Retirement permanently removes credits from your available
              portfolio balance. Retired credits cannot be resold or
              reused.
            </p>

            <div className="mt-7 rounded-2xl bg-[#fbfcfa] p-5">
              <p className="text-xs text-[#7b8578]">
                Project
              </p>

              <p className="mt-1 text-xl font-semibold">
                {purchase.project_name}
              </p>

              <p className="mt-1 text-sm text-[#657064]">
                Verified carbon credit purchase
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs text-[#7b8578]">
                  Purchased credits
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {Number(
                    purchase.quantity,
                  ).toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs text-[#7b8578]">
                  Purchase reference
                </p>

                <p className="mt-1 break-all font-mono text-xs">
                  {purchase.transaction_id}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#dce3d8] p-5">
              <p className="text-xs text-[#7b8578]">
                Credit batch
              </p>

              <p className="mt-2 break-all font-mono text-sm">
                {purchase.serial_number}
              </p>
            </div>
          </section>

          {/* Retirement form */}
          <aside className="h-fit rounded-3xl border border-[#dce3d8] bg-white p-7 lg:sticky lg:top-8">
            <p className="text-sm font-semibold">
              Retirement details
            </p>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Choose how many of your purchased credits you want to
              permanently retire.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-[#e2b8b8] bg-[#fff2f2] px-4 py-3 text-sm text-[#8a3d3d]">
                {error}
              </div>
            )}

            <div className="mt-6">
              <label className="text-sm font-medium">
                Credits to retire
              </label>

              <input
                type="number"
                min="1"
                max={Number(purchase.quantity)}
                step="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />

              <p className="mt-2 text-xs text-[#7b8578]">
                Maximum for this purchase:{" "}
                {Number(
                  purchase.quantity,
                ).toLocaleString()}
              </p>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium">
                Retirement reason
                <span className="ml-1 text-xs font-normal text-[#7b8578]">
                  optional
                </span>
              </label>

              <textarea
                rows={4}
                placeholder="Example: Offset corporate emissions for FY 2026"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="mt-2 w-full resize-none rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 text-sm outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div className="mt-6 rounded-2xl bg-[#edf5ea] p-5">
              <p className="text-xs text-[#52765a]">
                Credits becoming permanently retired
              </p>

              <p className="mt-2 text-3xl font-semibold text-[#37643d]">
                {Number(quantity) > 0 &&
                Number.isFinite(Number(quantity))
                  ? Number(
                      quantity,
                    ).toLocaleString()
                  : "0"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRetire}
              disabled={submitting}
              className="mt-5 w-full rounded-xl bg-[#172018] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Retiring credits..."
                : "Confirm retirement"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-[#7b8578]">
              Retirement is permanent. Retired credits cannot be resold.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default RetireCredits;