import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Certificate = {
  id: number;
  certificate_number: string;
  issued_at: string;

  retirement: {
    id: number;
    purchase_id: number;
    quantity: number;
    reason: string | null;
    retirement_reference: string;
    retired_at: string;
  };

  purchase: {
    quantity: number;
    price_per_credit: number;
    total_amount: number;
    purchased_at: string;
  };

  buyer: {
    name: string;
    organization: string | null;
  };

  project: {
    id: number;
    name: string;
    project_type: string;
    location: string;
    description: string | null;
  };

  credit: {
    id: number;
    serial_number: string;
  };
};

function Certificate() {
  const navigate = useNavigate();
  const { certificateId } = useParams();

  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

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
      navigate("/login", {
        replace: true,
      });

      return;
    }

    if (!certificateId) {
      setError("Invalid certificate.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/buyer/certificates/${certificateId}`,
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
            data.error ||
              "Failed to load certificate.",
          );
        }

        return data;
      })
      .then((data) => {
        setCertificate(data.certificate);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load certificate.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, certificateId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f3] text-[#172018]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#dce3d8] border-t-[#4d8b55]" />

          <p className="mt-4 text-sm text-[#657064]">
            Verifying certificate...
          </p>
        </div>
      </main>
    );
  }

  if (!certificate) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] px-6 py-16 text-[#172018]">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#e2b8b8] bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">
            Certificate unavailable
          </h1>

          <p className="mt-3 text-sm text-[#8a3d3d]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
          >
            Back to portfolio
          </button>
        </div>
      </main>
    );
  }

  const retirementDate =
    new Date(
      certificate.retirement.retired_at,
    ).toLocaleDateString("en-IN", {
      dateStyle: "long",
    });

  const certificateDate =
    new Date(
      certificate.issued_at,
    ).toLocaleDateString("en-IN", {
      dateStyle: "long",
    });

  return (
    <main className="min-h-screen bg-[#eef2ea] px-5 py-8 text-[#172018] sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/retirement/success/${certificate.retirement.id}`,
              )
            }
            className="text-sm font-medium text-[#4d8b55] hover:underline"
          >
            ← Back to retirement
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            Print / Save certificate
          </button>
        </div>

        {/* Certificate */}
        <section className="certificate-card relative overflow-hidden rounded-[2rem] border border-[#cfd8ca] bg-white shadow-lg">

          {/* Decorative top */}
          <div className="h-3 bg-[#172018]" />

          <div className="px-7 py-10 sm:px-14 sm:py-14">

            {/* Brand */}
            <div className="text-center">
              <p className="text-sm font-semibold tracking-[0.35em]">
                VERDIQ
              </p>

              <p className="mt-2 text-xs tracking-[0.18em] text-[#7b8578]">
                VERIFIED CARBON MARKETPLACE
              </p>
            </div>

            {/* Certificate title */}
            <div className="mt-12 text-center">
              <div className="certificate-seal mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#4d8b55] bg-[#edf5ea]">
                <span className="text-4xl text-[#4d8b55]">
                  ✓
                </span>
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-[#7b8578]">
                Certificate of
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                Carbon Retirement
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#657064]">
                This certificate confirms that the carbon credits
                identified below have been permanently retired through
                the Verdiq platform.
              </p>
            </div>

            {/* Certificate number */}
            <div className="mx-auto mt-10 max-w-md rounded-2xl bg-[#fbfcfa] p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                Certificate number
              </p>

              <p className="mt-2 break-all font-mono text-sm font-semibold">
                {certificate.certificate_number}
              </p>
            </div>

            {/* Holder */}
            <div className="mx-auto mt-12 max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7b8578]">
                Issued to
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                {certificate.buyer.organization ||
                  certificate.buyer.name}
              </h2>

              <p className="mt-2 text-sm text-[#657064]">
                {certificate.buyer.name}
              </p>
            </div>

            {/* Retired quantity */}
            <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-8 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7b8578]">
                Carbon credits permanently retired
              </p>

              <p className="mt-3 text-6xl font-semibold text-[#37643d]">
                {Number(
                  certificate.retirement.quantity,
                ).toLocaleString()}
              </p>

              <p className="mt-2 text-sm text-[#657064]">
                verified carbon credits
              </p>
            </div>

            {/* Project */}
            <div className="mt-12">
              <div className="border-b border-[#dce3d8] pb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7b8578]">
                  Project information
                </p>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#7b8578]">
                    Project
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {certificate.project.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Project type
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {certificate.project.project_type}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {certificate.project.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Credit batch
                  </p>

                  <p className="mt-1 break-all font-mono text-xs">
                    {certificate.credit.serial_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Retirement details */}
            <div className="mt-12">
              <div className="border-b border-[#dce3d8] pb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7b8578]">
                  Retirement details
                </p>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#7b8578]">
                    Retirement reference
                  </p>

                  <p className="mt-1 break-all font-mono text-sm font-semibold">
                    {certificate.retirement.retirement_reference}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Retirement date
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {retirementDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Certificate issued
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {certificateDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7b8578]">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-[#37643d]">
                    ✓ Permanently retired
                  </p>
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="mt-10 rounded-2xl bg-[#edf5ea] p-6">
              <p className="text-xs uppercase tracking-wide text-[#52765a]">
                Retirement purpose
              </p>

              <p className="mt-2 text-sm leading-6 text-[#37643d]">
                {certificate.retirement.reason ||
                  "No specific retirement purpose was provided."}
              </p>
            </div>

            {/* Verification */}
            <div className="mt-12">
              <div className="border-b border-[#dce3d8] pb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7b8578]">
                  Verification
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#edf5ea] p-5">
                  <p className="font-medium text-[#37643d]">
                    ✓ Ownership verified
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#52765a]">
                    Credit ownership was established through a completed
                    Verdiq marketplace purchase.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#edf5ea] p-5">
                  <p className="font-medium text-[#37643d]">
                    ✓ Project verified
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#52765a]">
                    The underlying project passed the Verdiq audit
                    workflow.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#edf5ea] p-5">
                  <p className="font-medium text-[#37643d]">
                    ✓ Retirement recorded
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#52765a]">
                    The retirement is recorded against the buyer's
                    purchase.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 border-t border-[#dce3d8] pt-8 text-center">
              <p className="text-xs leading-5 text-[#7b8578]">
                Verdiq prototype certificate. This document represents
                a digital retirement record within the demonstration
                platform.
              </p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes certificateSeal {
          0% {
            transform: scale(0.5);
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

        .certificate-seal {
          animation: certificateSeal 0.6s ease-out forwards;
        }

        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          .certificate-card {
            box-shadow: none !important;
            border: 1px solid #dce3d8 !important;
          }
        }
      `}</style>
    </main>
  );
}

export default Certificate;