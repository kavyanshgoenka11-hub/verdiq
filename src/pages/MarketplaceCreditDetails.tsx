

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Document = {
  id: number;
  listing_id: number;
  document_name: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
};

type Credit = {
  id: number;
  listing_id: number;
  project_id: number;
  serial_number: string;
  quantity: number;
  available_quantity: number;
  retired_quantity: number;
  price_per_credit: number;
  status: string;
  issued_at: string;

  project: {
    name: string;
    project_type: string;
    location: string;
    description: string | null;
    expected_credits: number;
    approved_issuance_quantity: number | null;
  };

  owner: {
    name: string;
    organization: string | null;
    email: string;
  };

  documents: Document[];
};

function MarketplaceCreditDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [credit, setCredit] = useState<Credit | null>(null);
  const [quantity, setQuantity] = useState("1");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid marketplace listing.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/marketplace/credits/${id}`,)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load marketplace listing.",
          );
        }

        return data;
      })
      .then((data) => {
        setCredit(data.credit);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load marketplace listing.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const selectedQuantity = Number(quantity);

  const totalPrice =
    credit &&
    Number.isInteger(selectedQuantity) &&
    selectedQuantity > 0
      ? selectedQuantity * Number(credit.price_per_credit)
      : 0;

  const handlePurchase = () => {
    if (!credit) {
      return;
    }

    if (
      !Number.isInteger(selectedQuantity) ||
      selectedQuantity <= 0
    ) {
      setError("Enter a valid whole-number quantity.");
      return;
    }

    if (
      selectedQuantity >
      Number(credit.available_quantity)
    ) {
      setError(
        `Only ${Number(
          credit.available_quantity,
        ).toLocaleString()} credits are currently available.`,
      );
      return;
    }

    navigate(`/marketplace/credits/${credit.listing_id}/buy`, {
      state: {
        quantity: selectedQuantity,
      },
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
        <div className="mx-auto max-w-6xl px-8 py-20 text-center">
          <p className="text-[#657064]">
            Loading credit details...
          </p>
        </div>
      </main>
    );
  }

  if (!credit) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
        <div className="mx-auto max-w-6xl px-8 py-20">
          <div className="rounded-3xl border border-[#e2b8b8] bg-[#fff2f2] p-8 text-[#8a3d3d]">
            {error || "Marketplace listing not found."}
          </div>
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
            Carbon Marketplace
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/marketplace")}
          className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
        >
          Marketplace
        </button>
      </nav>

      <section className="mx-auto max-w-6xl px-8 py-12 lg:px-16">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/marketplace")}
          className="text-sm font-medium text-[#4d8b55] hover:underline"
        >
          ← Back to marketplace
        </button>

        {error && (
          <div className="mt-6 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left side */}
          <div className="space-y-6">
            {/* Project header */}
            <section className="rounded-3xl border border-[#dce3d8] bg-white p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                  ✓ Verified project
                </span>

                <span className="rounded-full bg-[#eef2ea] px-3 py-1 text-xs font-medium text-[#52604f]">
                  {credit.project.project_type}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight">
                {credit.project.name}
              </h1>

              <p className="mt-3 text-[#657064]">
                {credit.project.location}
              </p>

              <p className="mt-6 text-sm leading-7 text-[#657064]">
                {credit.project.description ||
                  "No project description available."}
              </p>
            </section>

            {/* Verification summary */}
            <section className="rounded-3xl border border-[#dce3d8] bg-white p-8">
              <h2 className="text-xl font-semibold">
                Verification summary
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#fbfcfa] p-5">
                  <p className="text-xs text-[#7b8578]">
                    Developer expected
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {Number(
                      credit.project.expected_credits,
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#edf5ea] p-5">
                  <p className="text-xs text-[#52765a]">
                    Auditor approved
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#37643d]">
                    {credit.project
                      .approved_issuance_quantity !== null
                      ? Number(
                          credit.project
                            .approved_issuance_quantity,
                        ).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </section>

            {/* Supporting evidence */}
            <section className="rounded-3xl border border-[#dce3d8] bg-white p-8">
              <h2 className="text-xl font-semibold">
                Supporting evidence
              </h2>

              {credit.documents.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[#cdd5c9] bg-[#fbfcfa] p-6">
                  <p className="text-sm text-[#657064]">
                    No supporting documents are available.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {credit.documents.map((document) => (
                    <a
                      key={document.id}
                      href={`http://localhost:5000${document.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-[#dce3d8] bg-[#fbfcfa] px-5 py-4 transition hover:bg-[#f3f7f1]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {document.document_name}
                        </p>

                        <p className="mt-1 text-xs text-[#7b8578]">
                          {document.document_type}
                        </p>
                      </div>

                      <span className="ml-4 shrink-0 text-sm font-medium text-[#4d8b55]">
                        Open →
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </section>

            {/* Project owner */}
            <section className="rounded-3xl border border-[#dce3d8] bg-white p-8">
              <h2 className="text-xl font-semibold">
                Project owner
              </h2>

              <div className="mt-5">
                <p className="font-medium">
                  {credit.owner.organization ||
                    credit.owner.name}
                </p>

                <p className="mt-1 text-sm text-[#657064]">
                  {credit.owner.name}
                </p>
              </div>
            </section>
          </div>

          {/* Purchase panel */}
          <aside className="h-fit rounded-3xl border border-[#dce3d8] bg-white p-7 lg:sticky lg:top-8">
            <p className="text-sm text-[#657064]">
              Credit batch
            </p>

            <p className="mt-2 break-all font-mono text-sm">
              {credit.serial_number}
            </p>

            <div className="mt-7">
              <p className="text-xs text-[#7b8578]">
                Available credits
              </p>

              <p className="mt-1 text-3xl font-semibold">
                {Number(
                  credit.available_quantity,
                ).toLocaleString()}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs text-[#7b8578]">
                Asking price
              </p>

              <p className="mt-1 text-2xl font-semibold">
                ₹
                {Number(
                  credit.price_per_credit,
                ).toLocaleString()}
                <span className="ml-1 text-sm font-normal text-[#7b8578]">
                  / credit
                </span>
              </p>
            </div>

            <div className="mt-7 border-t border-[#edf0ea] pt-6">
              <label className="text-sm font-medium">
                Credits to purchase
              </label>

              <input
                type="number"
                min="1"
                max={Number(
                  credit.available_quantity,
                )}
                step="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />

              <div className="mt-5 rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs text-[#7b8578]">
                  Estimated total
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  ₹{totalPrice.toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={handlePurchase}
                className="mt-5 w-full rounded-xl bg-[#172018] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                Continue to purchase →
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-[#7b8578]">
                Sign in as a buyer to complete the purchase.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default MarketplaceCreditDetails;