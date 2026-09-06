import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Purchase = {
  id: number;
  transaction_id: string;
  listing_id: number;
  buyer_id: number;

  quantity: number;
  price_per_credit: number;
  total_amount: number;

  status: string;
  purchased_at: string;

  project_name: string;
  project_id: number;

  serial_number: string;

  seller_name: string;
  seller_organization: string | null;

  buyer_name: string;
  buyer_organization: string | null;
};

function PurchaseSuccess() {
  const navigate = useNavigate();
  const { purchaseId } = useParams();

  const [purchase, setPurchase] =
    useState<Purchase | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("verdiq_token");

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

    if (!purchaseId) {
      setError("Invalid purchase reference.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/buyer/purchases/${purchaseId}`,
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
              "Failed to load transaction details."
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
            : "Failed to load transaction."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, purchaseId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f3] text-[#172018]">
        <p className="text-sm text-[#657064]">
          Verifying transaction...
        </p>
      </main>
    );
  }

  if (!purchase) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] px-6 py-16 text-[#172018]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#e2b8b8] bg-[#fff2f2] p-8 text-center">
          <h1 className="text-xl font-semibold">
            Transaction unavailable
          </h1>

          <p className="mt-2 text-sm text-[#8a3d3d]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/marketplace")
            }
            className="mt-6 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
          >
            Back to marketplace
          </button>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(
    purchase.purchased_at
  ).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-[#f6f8f3] px-6 py-10 text-[#172018] sm:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Brand */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.25em]">
            VERDIQ
          </p>

          {/* Animated success */}
          <div className="success-pop mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#e7f1e5]">
            <div className="success-check flex h-16 w-16 items-center justify-center rounded-full bg-[#4d8b55] text-4xl font-bold text-white">
              ✓
            </div>
          </div>

          <h1 className="mt-7 text-4xl font-semibold tracking-tight">
            Purchase successful
          </h1>

          <p className="mt-3 text-[#657064]">
            Your carbon-credit purchase has been recorded successfully.
          </p>
        </div>

        {/* Receipt */}
        <section className="receipt-reveal mt-10 overflow-hidden rounded-3xl border border-[#dce3d8] bg-white shadow-sm">

          {/* Transaction reference */}
          <div className="border-b border-[#edf0ea] px-7 py-6 sm:px-9">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Transaction ID
                </p>

                <p className="mt-2 font-mono text-sm font-semibold">
                  {purchase.transaction_id}
                </p>

                <p className="mt-1 text-xs text-[#7b8578]">
                  {formattedDate}
                </p>
              </div>

              <div className="rounded-full bg-[#edf5ea] px-4 py-2 text-sm font-medium text-[#37643d]">
                ✓ Completed
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="px-7 py-7 sm:px-9">
            <h2 className="text-lg font-semibold">
              Payment details
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">

              <div>
                <p className="text-xs text-[#7b8578]">
                  Paid by
                </p>

                <p className="mt-1 font-medium">
                  {purchase.buyer_organization ||
                    purchase.buyer_name}
                </p>

                <p className="mt-1 text-sm text-[#657064]">
                  {purchase.buyer_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7b8578]">
                  Purchased from
                </p>

                <p className="mt-1 font-medium">
                  {purchase.seller_organization ||
                    purchase.seller_name}
                </p>

                <p className="mt-1 text-sm text-[#657064]">
                  {purchase.seller_name}
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-[#fbfcfa] p-5">
              <p className="text-xs text-[#7b8578]">
                Amount
              </p>

              <p className="mt-1 text-3xl font-semibold">
                ₹
                {Number(
                  purchase.total_amount
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Credit details */}
          <div className="border-t border-[#edf0ea] px-7 py-7 sm:px-9">
            <h2 className="text-lg font-semibold">
              Carbon credit details
            </h2>

            <div className="mt-5 rounded-2xl border border-[#dce3d8] bg-[#fbfcfa] p-5">

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                  ✓ Verified project
                </span>

                <span className="rounded-full bg-[#eef2ea] px-3 py-1 text-xs font-medium text-[#52604f]">
                  Ownership recorded
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                {purchase.project_name}
              </h3>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Credits purchased
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {Number(
                      purchase.quantity
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Price / credit
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    ₹
                    {Number(
                      purchase.price_per_credit
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Credit batch
                  </p>

                  <p className="mt-1 break-all font-mono text-xs">
                    {purchase.serial_number}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="border-t border-[#edf0ea] px-7 py-7 sm:px-9">
            <h2 className="text-lg font-semibold">
              Verdiq verification
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#edf5ea] p-4 text-sm font-medium text-[#37643d]">
                ✓ Project verified
              </div>

              <div className="rounded-2xl bg-[#edf5ea] p-4 text-sm font-medium text-[#37643d]">
                ✓ Issuance verified
              </div>

              <div className="rounded-2xl bg-[#edf5ea] p-4 text-sm font-medium text-[#37643d]">
                ✓ Purchase recorded
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-[#edf0ea] bg-[#fbfcfa] px-7 py-6 text-center sm:px-9">
            <p className="text-xs leading-5 text-[#7b8578]">
              This is a Verdiq prototype transaction.
              No real payment was processed.
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex-1 rounded-xl bg-[#172018] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            View my portfolio
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/marketplace")
            }
            className="flex-1 rounded-xl border border-[#cdd5c9] bg-white px-5 py-3.5 text-sm font-medium transition hover:bg-[#eef2ea]"
          >
            Back to marketplace
          </button>
        </div>
      </div>

      <style>{`
        @keyframes successPop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          70% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes successCheck {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          70% {
            transform: scale(1.12) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes receiptReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .success-pop {
          animation: successPop 0.55s ease-out forwards;
        }

        .success-check {
          animation: successCheck 0.45s 0.15s ease-out both;
        }

        .receipt-reveal {
          animation: receiptReveal 0.6s 0.25s ease-out both;
        }
      `}</style>
    </main>
  );
}

export default PurchaseSuccess;