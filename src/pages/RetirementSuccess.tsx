import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Retirement = {
  id: number;
  purchase_id: number;
  buyer_id: number;
  quantity: number;
  reason: string | null;
  retirement_reference: string;
  retired_at: string;

  project_id: number;
  project_name: string;
  project_type: string;
  location: string;

  serial_number: string;

  certificate: {
    id: number;
    certificate_number: string;
    issued_at: string;
  } | null;
};

function RetirementSuccess() {
  const navigate = useNavigate();
  const { retirementId } = useParams();

  const [retirement, setRetirement] =
    useState<Retirement | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      navigate("/login", { replace: true });
      return;
    }

    if (!retirementId) {
      setError("Invalid retirement reference.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/buyer/retirements/${retirementId}`,
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
              "Failed to load retirement details."
          );
        }

        return data;
      })
      .then((data) => {
        setRetirement(data.retirement);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load retirement."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, retirementId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f3] text-[#172018]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#dce3d8] border-t-[#4d8b55]" />

          <p className="mt-4 text-sm text-[#657064]">
            Verifying your retirement...
          </p>
        </div>
      </main>
    );
  }

  if (!retirement) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] px-6 py-16 text-[#172018]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#e2b8b8] bg-[#fff2f2] p-8 text-center">
          <h1 className="text-xl font-semibold">
            Retirement unavailable
          </h1>

          <p className="mt-2 text-sm text-[#8a3d3d]">
            {error}
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

  const formattedDate = new Date(
    retirement.retired_at
  ).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-[#f6f8f3] px-6 py-10 text-[#172018] sm:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Success header */}
        <div className="text-center">

          <p className="text-sm font-semibold tracking-[0.25em]">
            VERDIQ
          </p>

          <div className="retirement-pop mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#e7f1e5]">
            <div className="retirement-check flex h-16 w-16 items-center justify-center rounded-full bg-[#4d8b55] text-4xl font-bold text-white">
              ✓
            </div>
          </div>

          <h1 className="mt-7 text-4xl font-semibold tracking-tight">
            Retirement complete
          </h1>

          <p className="mt-3 text-[#657064]">
            Your carbon credits have been permanently retired.
          </p>
        </div>

        {/* Receipt */}
        <section className="retirement-receipt mt-10 overflow-hidden rounded-3xl border border-[#dce3d8] bg-white shadow-sm">

          {/* Reference */}
          <div className="border-b border-[#edf0ea] px-7 py-6 sm:px-9">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Retirement reference
                </p>

                <p className="mt-2 font-mono text-sm font-semibold">
                  {retirement.retirement_reference}
                </p>

                <p className="mt-1 text-xs text-[#7b8578]">
                  {formattedDate}
                </p>
              </div>

              <div className="rounded-full bg-[#edf5ea] px-4 py-2 text-sm font-medium text-[#37643d]">
                ✓ Permanently retired
              </div>
            </div>
          </div>

          {/* Retirement summary */}
          <div className="px-7 py-8 sm:px-9">

            <h2 className="text-lg font-semibold">
              Retirement summary
            </h2>

            <div className="mt-6 rounded-2xl bg-[#fbfcfa] p-6">

              <p className="text-xs text-[#7b8578]">
                Project
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                {retirement.project_name}
              </h3>

              <p className="mt-1 text-sm text-[#657064]">
                {retirement.project_type} ·{" "}
                {retirement.location}
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#7b8578]">
                    Credits retired
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#37643d]">
                    {Number(
                      retirement.quantity
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-[#37643d]">
                    Permanent
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {retirement.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="mt-5 rounded-2xl border border-[#dce3d8] p-5">
              <p className="text-xs text-[#7b8578]">
                Retirement purpose
              </p>

              <p className="mt-2 text-sm leading-6">
                {retirement.reason ||
                  "No retirement purpose was specified."}
              </p>
            </div>
          </div>

          {/* Credit identity */}
          <div className="border-t border-[#edf0ea] px-7 py-7 sm:px-9">

            <h2 className="text-lg font-semibold">
              Credit identity
            </h2>

            <div className="mt-5 rounded-2xl bg-[#fbfcfa] p-5">

              <p className="text-xs text-[#7b8578]">
                Credit batch
              </p>

              <p className="mt-2 break-all font-mono text-xs">
                {retirement.serial_number}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-[#edf5ea] p-4 text-sm font-medium text-[#37643d]">
                  ✓ Ownership verified
                </div>

                <div className="rounded-xl bg-[#edf5ea] p-4 text-sm font-medium text-[#37643d]">
                  ✓ Credit retired
                </div>

                <div className="rounded-xl bg-[#edf5ea] p-4 text-sm font-medium text-[#37643d]">
                  ✓ Record secured
                </div>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="border-t border-[#edf0ea] bg-[#fbfcfa] px-7 py-7 sm:px-9">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs text-[#7b8578]">
                  Retirement certificate
                </p>

                {retirement.certificate ? (
                  <>
                    <p className="mt-1 font-mono text-sm font-semibold">
                      {retirement.certificate.certificate_number}
                    </p>

                    <p className="mt-1 text-xs text-[#7b8578]">
                      Issued {new Date(
                        retirement.certificate.issued_at
                      ).toLocaleDateString("en-IN", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-[#657064]">
                    Certificate is being prepared.
                  </p>
                )}
              </div>

              {retirement.certificate && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/certificate/${retirement.certificate?.id}`
                    )
                  }
                  className="rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                >
                  View certificate →
                </button>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-[#edf0ea] px-7 py-6 text-center sm:px-9">
            <p className="text-xs leading-5 text-[#7b8578]">
              Verdiq prototype retirement record. This retirement
              permanently removes the selected credits from the buyer's
              available portfolio balance.
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 rounded-xl bg-[#172018] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            View portfolio
          </button>

          <button
            type="button"
            onClick={() => navigate("/marketplace")}
            className="flex-1 rounded-xl border border-[#cdd5c9] bg-white px-5 py-3.5 text-sm font-medium transition hover:bg-[#eef2ea]"
          >
            Back to marketplace
          </button>
        </div>
      </div>

      <style>{`
        @keyframes retirementPop {
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

        @keyframes retirementCheck {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          70% {
            transform: scale(1.12);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes retirementReceipt {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .retirement-pop {
          animation: retirementPop 0.55s ease-out forwards;
        }

        .retirement-check {
          animation: retirementCheck 0.45s 0.15s ease-out both;
        }

        .retirement-receipt {
          animation: retirementReceipt 0.6s 0.25s ease-out both;
        }
      `}</style>
    </main>
  );
}

export default RetirementSuccess;