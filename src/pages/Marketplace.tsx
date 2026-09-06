import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type MarketplaceCredit = {
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

  project_name: string;
  project_type: string;
  location: string;
  description: string | null;

  developer_name: string;
  developer_organization: string | null;
};

function Marketplace() {
  const navigate = useNavigate();

  const [credits, setCredits] = useState<MarketplaceCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/marketplace/credits")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load marketplace.",
          );
        }

        return data;
      })
      .then((data) => {
        setCredits(data.credits || []);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load marketplace.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
          >
            Sign in
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-sm text-[#657064]">
            Verified carbon marketplace
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Explore verified carbon credits
          </h1>

          <p className="mt-3 text-[#657064]">
            Discover verified project-based carbon credits listed by
            project owners on the Verdiq marketplace.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-8 text-[#657064]">
            Loading available credits...
          </div>
        ) : credits.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
              No credits currently listed
            </h2>

            <p className="mt-2 text-sm text-[#657064]">
              Verified credit batches will appear here when project
              owners list them for sale.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {credits.map((credit) => {
              const available = Number(
                credit.available_quantity,
              );

              const price = Number(
                credit.price_per_credit,
              );

              return (
                <article
                  key={credit.listing_id}
                  className="rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                        Verified
                      </span>

                      <h2 className="mt-4 text-2xl font-semibold">
                        {credit.project_name}
                      </h2>

                      <p className="mt-2 text-sm text-[#657064]">
                        {credit.project_type} ·{" "}
                        {credit.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#7b8578]">
                        Asking price
                      </p>

                      <p className="mt-1 text-xl font-semibold">
                        ₹{price.toLocaleString()}
                      </p>

                      <p className="text-xs text-[#7b8578]">
                        per credit
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#657064]">
                    {credit.description ||
                      "No project description available."}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-[#fbfcfa] p-4">
                      <p className="text-xs text-[#7b8578]">
                        Available
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {available.toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbfcfa] p-4">
                      <p className="text-xs text-[#7b8578]">
                        Project owner
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold">
                        {credit.developer_organization ||
                          credit.developer_name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/marketplace/credits/${credit.listing_id}`,
                        )
                      }
                      className="flex-1 rounded-xl border border-[#cdd5c9] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#eef2ea]"
                    >
                      View details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/marketplace/credits/${credit.listing_id}/buy`,
                        )
                      }
                      className="flex-1 rounded-xl bg-[#172018] px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                    >
                      Buy credits
                    </button>
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

export default Marketplace;