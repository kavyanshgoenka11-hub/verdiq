import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Credit = {
  id: number;
  serial_number: string;
  quantity: number;
  available_quantity: number;
  price_per_credit: number;

  project: {
    name: string;
    project_type: string;
    location: string;
  };

  owner: {
    name: string;
    organization: string | null;
  };
};

function BuyCredits() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const stateQuantity = location.state?.quantity;

  const [credit, setCredit] = useState<Credit | null>(null);
  const [quantity, setQuantity] = useState(
    stateQuantity ? String(stateQuantity) : "1",
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid credit listing.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/marketplace/credits/${id}`,
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load credit listing.",
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
            : "Failed to load credit listing.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
        <div className="mx-auto max-w-4xl px-8 py-20 text-center">
          <p className="text-[#657064]">
            Preparing purchase...
          </p>
        </div>
      </main>
    );
  }

  if (!credit) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
        <div className="mx-auto max-w-4xl px-8 py-20">
          <div className="rounded-3xl border border-[#e2b8b8] bg-[#fff2f2] p-8 text-[#8a3d3d]">
            {error || "Credit listing not found."}
          </div>
        </div>
      </main>
    );
  }

  const selectedQuantity = Number(quantity);

  const total =
    Number.isInteger(selectedQuantity) &&
    selectedQuantity > 0
      ? selectedQuantity *
        Number(credit.price_per_credit)
      : 0;

  const handleConfirm = async () => {
  const buyerToken = localStorage.getItem(
    "verdiq_token",
  );

  const storedUser = localStorage.getItem(
    "verdiq_user",
  );

  const buyer = storedUser
    ? JSON.parse(storedUser)
    : null;

  if (!buyerToken || buyer?.role !== "buyer") {
    navigate("/login", {
      state: {
        redirectTo: `/marketplace/credits/${credit?.listing_id}/buy`,
        quantity: selectedQuantity,
      },
    });

    return;
  }

  if (!id || !credit) {
    setError("Invalid marketplace listing.");
    return;
  }

  if (
    !Number.isInteger(selectedQuantity) ||
    selectedQuantity <= 0
  ) {
    setError(
      "Enter a valid whole-number quantity.",
    );
    return;
  }

  if (
    selectedQuantity >
    Number(credit.available_quantity)
  ) {
    setError(
      `Only ${Number(
        credit.available_quantity,
      ).toLocaleString()} credits are available.`,
    );
    return;
  }

  setError("");

  try {
    const response = await fetch(
      `http://localhost:5000/api/marketplace/listings/${id}/purchase`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${buyerToken}`,
        },

        body: JSON.stringify({
          quantity: selectedQuantity,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to complete purchase.",
      );
    }

    navigate(`/purchase/success/${data.purchase.id}`, {
       
        replace: true,
    },
);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Failed to complete purchase.",
    );
  }
};

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
            Purchase review
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

      <section className="mx-auto max-w-5xl px-8 py-12 lg:px-16">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/marketplace/credits/${credit.id}`,
            )
          }
          className="text-sm font-medium text-[#4d8b55] hover:underline"
        >
          ← Back to credit details
        </button>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Summary */}
          <section className="rounded-3xl border border-[#dce3d8] bg-white p-8">
            <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
              ✓ Verified credit batch
            </span>

            <h1 className="mt-5 text-3xl font-semibold">
              Review your purchase
            </h1>

            <div className="mt-8 rounded-2xl bg-[#fbfcfa] p-5">
              <p className="text-xs text-[#7b8578]">
                Project
              </p>

              <p className="mt-1 text-lg font-semibold">
                {credit.project.name}
              </p>

              <p className="mt-1 text-sm text-[#657064]">
                {credit.project.project_type} ·{" "}
                {credit.project.location}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs text-[#7b8578]">
                  Available
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {Number(
                    credit.available_quantity,
                  ).toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs text-[#7b8578]">
                  Price / credit
                </p>

                <p className="mt-1 text-xl font-semibold">
                  ₹
                  {Number(
                    credit.price_per_credit,
                  ).toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs text-[#7b8578]">
                  Seller
                </p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {credit.owner.organization ||
                    credit.owner.name}
                </p>
              </div>
            </div>
          </section>

          {/* Purchase summary */}
          <aside className="h-fit rounded-3xl border border-[#dce3d8] bg-white p-7 lg:sticky lg:top-8">
            <p className="text-sm font-semibold">
              Purchase summary
            </p>

            <div className="mt-6">
              <label className="text-sm font-medium">
                Number of credits
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
                  setQuantity(
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-[#e2b8b8] bg-[#fff2f2] px-4 py-3 text-xs text-[#8a3d3d]">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-3 border-t border-[#edf0ea] pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#657064]">
                  Credits
                </span>

                <span className="font-medium">
                  {Number.isInteger(
                    selectedQuantity,
                  ) && selectedQuantity > 0
                    ? selectedQuantity.toLocaleString()
                    : "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#657064]">
                  Price / credit
                </span>

                <span className="font-medium">
                  ₹
                  {Number(
                    credit.price_per_credit,
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#edf0ea] pt-4">
                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-semibold">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="mt-6 w-full rounded-xl bg-[#172018] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Confirm purchase
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-[#7b8578]">
              Your purchase will transfer the selected credits into
              your buyer portfolio.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default BuyCredits;