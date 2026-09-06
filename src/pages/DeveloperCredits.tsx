import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Credit = {
  id: number;
  project_id: number;
  serial_number: string;

  quantity: number;
  available_quantity: number;
  retired_quantity: number;

  status: string;
  issued_at: string;

  project_name: string;
  project_type: string;
  location: string;

  listing_id: number | null;
  listed_quantity: number | null;
  remaining_quantity: number | null;
  listing_price: number | null;
  listing_status: string | null;
  listed_at: string | null;
};

function DeveloperCredits() {
  const navigate = useNavigate();

  const [credits, setCredits] = useState<CreditBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [prices, setPrices] = useState<Record<number, string>>({});
  const [listingCreditId, setListingCreditId] = useState<number | null>(
    null
  );

  const loadCredits = async () => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/developer/credits",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load credit inventory."
        );
      }

      setCredits(data.credits || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load credit inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const handleListForSale = async (credit: CreditBatch) => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const price = Number(prices[credit.id]);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price per credit.");
      return;
    }

    setListingCreditId(credit.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/developer/credits/${credit.id}/list`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            price_per_credit: price,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to list credits."
        );
      }

      setSuccess(
        `${credit.available_quantity.toLocaleString()} credits from ${credit.project_name} are now listed at ₹${price.toLocaleString()} per credit.`
      );

      await loadCredits();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to list credits."
      );
    } finally {
      setListingCreditId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <button
            type="button"
            onClick={() => navigate("/developer")}
            className="text-2xl font-semibold tracking-tight"
          >
            verdiq
          </button>

          <p className="text-xs text-[#657064]">
            Credit Inventory
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

      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        <div>
          <p className="text-sm text-[#657064]">
            Developer inventory
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Your carbon credits
          </h1>

          <p className="mt-3 max-w-2xl text-[#657064]">
            Manage issued credit batches and decide when to make your
            credits available in the Verdiq marketplace.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-2xl border border-[#b9d6bc] bg-[#edf5ea] px-5 py-4 text-sm text-[#37643d]">
            {success}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-8 text-[#657064]">
            Loading your credit inventory...
          </div>
        ) : credits.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf5ea] text-[#4d8b55]">
              ◆
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No credits issued yet
            </h2>

            <p className="mt-2 text-sm text-[#657064]">
              Credits will appear here after your verified project
              receives an issuance batch.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {credits.map((credit) => {
              const available = Number(
                credit.available_quantity
              );

              const issued = Number(credit.quantity);
              const retired = Number(
                credit.retired_quantity
              );

              const isListed =
                credit.status === "listed";

              return (
                <article
                  key={credit.id}
                  className="rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm"
                >
                  <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold">
                          {credit.project_name}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            isListed
                              ? "bg-[#edf5ea] text-[#37643d]"
                              : "bg-[#eef2ea] text-[#52604f]"
                          }`}
                        >
                          {credit.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#657064]">
                        {credit.project_type} ·{" "}
                        {credit.location}
                      </p>

                      <div className="mt-7 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-[#fbfcfa] p-4">
                          <p className="text-xs text-[#7b8578]">
                            Issued
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            {issued.toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#fbfcfa] p-4">
                          <p className="text-xs text-[#7b8578]">
                            Available
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            {available.toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#fbfcfa] p-4">
                          <p className="text-xs text-[#7b8578]">
                            Retired
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            {retired.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl bg-[#fbfcfa] p-5">
                        <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                          Credit batch
                        </p>

                        <p className="mt-2 break-all font-mono text-sm">
                          {credit.serial_number}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#dce3d8] bg-[#fbfcfa] p-6">
                      {isListed ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf5ea] text-[#37643d]">
                              ✓
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                Listed for sale
                              </p>

                              <p className="text-xs text-[#7b8578]">
                                This batch is visible to buyers.
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 rounded-xl bg-white p-4">
                            <p className="text-xs text-[#7b8578]">
                              Asking price
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                              ₹
                              {Number(
                                credit.price_per_credit
                              ).toLocaleString()}
                              <span className="ml-1 text-sm font-normal text-[#7b8578]">
                                / credit
                              </span>
                            </p>
                          </div>

                          <div className="mt-4 rounded-xl bg-white p-4">
                            <p className="text-xs text-[#7b8578]">
                              Marketplace inventory
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                              {available.toLocaleString()} credits
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold">
                            List credits for sale
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#657064]">
                            You control the asking price. The issued
                            quantity cannot be changed here.
                          </p>

                          <div className="mt-5 rounded-xl border border-[#b9d6bc] bg-[#edf5ea] p-4">
                            <p className="text-xs text-[#52765a]">
                              Available to list
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-[#37643d]">
                              {available.toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-5">
                            <label className="mb-2 block text-xs font-medium">
                              Your asking price per credit (₹)
                            </label>

                            <input
                              type="number"
                              min="1"
                              step="0.01"
                              placeholder="e.g. 475"
                              value={
                                prices[credit.id] || ""
                              }
                              onChange={(event) =>
                                setPrices((current) => ({
                                  ...current,
                                  [credit.id]:
                                    event.target.value,
                                }))
                              }
                              className="w-full rounded-xl border border-[#cdd5c9] bg-white px-4 py-3 outline-none focus:border-[#4d8b55]"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleListForSale(credit)
                            }
                            disabled={
                              listingCreditId === credit.id
                            }
                            className="mt-4 w-full rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {listingCreditId === credit.id
                              ? "Listing credits..."
                              : `List ${available.toLocaleString()} Credits for Sale`}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default DeveloperCredits;