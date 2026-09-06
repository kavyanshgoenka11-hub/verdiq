import { useState } from "react";
import { useNavigate } from "react-router-dom";

type CalculationResult = {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
};

type SavedReport = {
  id: number;
  reporting_year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  status: string;
};

function Calculator() {
  const navigate = useNavigate();

  const [fuel, setFuel] = useState("");
  const [electricity, setElectricity] = useState("");
  const [travel, setTravel] = useState("");

  const [reportingYear, setReportingYear] = useState(
    String(new Date().getFullYear()),
  );

  const [result, setResult] =
    useState<CalculationResult | null>(null);

  const [savedReport, setSavedReport] =
    useState<SavedReport | null>(null);

  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ============================================================
     CALCULATE FOOTPRINT
  ============================================================ */

  const calculateFootprint = () => {
    setError("");
    setSuccess("");
    setSavedReport(null);

    const fuelValue = Number(fuel) || 0;
    const electricityValue = Number(electricity) || 0;
    const travelValue = Number(travel) || 0;

    if (
      fuelValue < 0 ||
      electricityValue < 0 ||
      travelValue < 0
    ) {
      setError(
        "Activity values cannot be negative.",
      );
      return;
    }

    /*
     * Prototype factors.
     * These should eventually be moved into a central
     * emissions-factor configuration/database.
     */
    const fuelFactor = 0.00268;
    const electricityFactor = 0.0007;
    const travelFactor = 0.00017;

    const scope1 = fuelValue * fuelFactor;
    const scope2 =
      electricityValue * electricityFactor;
    const scope3 =
      travelValue * travelFactor;

    const total =
      scope1 +
      scope2 +
      scope3;

    setResult({
      scope1,
      scope2,
      scope3,
      total,
    });
  };

  /* ============================================================
     SAVE FOOTPRINT REPORT
  ============================================================ */

  const saveReport = async () => {
    /*
     * The calculator itself is public.
     * Only saving requires authentication.
     */
    if (!result) {
      setSuccess("");
      setError(
        "Calculate your footprint before saving the report.",
      );
      return;
    }

    const token =
      localStorage.getItem("verdiq_token");

    /*
     * User is not logged in.
     *
     * IMPORTANT:
     * Do not redirect automatically.
     * Just show the red alert.
     */
    if (!token) {
      setSuccess("");
      setError(
        "Please sign in first to save your footprint report.",
      );
      return;
    }

    /*
     * Read the logged-in user's role.
     */
    const storedUser =
      localStorage.getItem("verdiq_user");

    let user: {
      role?: string;
    } | null = null;

    try {
      user = storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      user = null;
    }

    /*
     * The backend endpoint is buyer-only.
     * Stop invalid role requests before they reach the API.
     */
    if (user?.role !== "buyer") {
      setSuccess("");
      setError(
        "Please sign in with a buyer account to save your footprint report.",
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const year = Number(reportingYear);

      if (
        !Number.isInteger(year) ||
        year < 2000 ||
        year > 2100
      ) {
        throw new Error(
          "Enter a valid reporting year.",
        );
      }

      const fuelValue =
        Number(fuel) || 0;

      const electricityValue =
        Number(electricity) || 0;

      const travelValue =
        Number(travel) || 0;

      const response = await fetch(
        "http://localhost:5000/api/buyer/footprint-reports",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            reporting_year: year,

            scope1: result.scope1,
            scope2: result.scope2,
            scope3: result.scope3,

            inputs: [
              {
                scope: "scope1",
                category: "Fuel consumption",
                quantity: fuelValue,
                unit: "litres",
                emission_factor: 0.00268,
                calculated_emissions:
                  result.scope1,
              },

              {
                scope: "scope2",
                category:
                  "Electricity consumption",
                quantity:
                  electricityValue,
                unit: "kWh",
                emission_factor: 0.0007,
                calculated_emissions:
                  result.scope2,
              },

              {
                scope: "scope3",
                category: "Business travel",
                quantity: travelValue,
                unit: "km",
                emission_factor: 0.00017,
                calculated_emissions:
                  result.scope3,
              },
            ],
          }),
        },
      );

      const data =
        await response.json();

      /*
       * Handle expired or invalid sessions.
       */
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "verdiq_token",
        );

        localStorage.removeItem(
          "verdiq_user",
        );

        setSaving(false);
        setSuccess("");

        setError(
          "Your session has expired. Please sign in again before saving your footprint report.",
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save footprint report.",
        );
      }

      setSavedReport({
        id: Number(data.report.id),

        reporting_year: Number(
          data.report.reporting_year,
        ),

        scope1: Number(
          data.report.scope1,
        ),

        scope2: Number(
          data.report.scope2,
        ),

        scope3: Number(
          data.report.scope3,
        ),

        total: Number(
          data.report.total,
        ),

        status:
          data.report.status,
      });

      setSuccess(
        "Footprint report saved successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save footprint report.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     FINALIZE REPORT
  ============================================================ */

  const finalizeReport = async () => {
    const token =
      localStorage.getItem("verdiq_token");

    if (!token) {
      setSuccess("");
      setError(
        "Please sign in first to finalize your footprint report.",
      );
      return;
    }

    if (!savedReport) {
      setSuccess("");
      setError(
        "Save the report before finalizing it.",
      );
      return;
    }

    setFinalizing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/buyer/footprint-reports/${savedReport.id}/finalize`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data =
        await response.json();

      /*
       * Handle expired/invalid authentication.
       */
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "verdiq_token",
        );

        localStorage.removeItem(
          "verdiq_user",
        );

        setFinalizing(false);
        setSuccess("");

        setError(
          "Your session has expired. Please sign in again to finalize your report.",
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to finalize report.",
        );
      }

      setSavedReport({
        ...savedReport,
        status: "finalized",
      });

      setSuccess(
        "Footprint report finalized successfully. Your data can now appear in Verdiq climate analytics.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to finalize report.",
      );
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="text-2xl font-semibold tracking-tight"
          >
            verdiq
          </button>

          <p className="text-xs text-[#657064]">
            Corporate Footprint Calculator
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
        >
          My Portfolio
        </button>

      </nav>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-8 py-12 lg:px-16">

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="text-sm font-medium text-[#4d8b55] hover:underline"
        >
          ← Back to portfolio
        </button>

        <div className="mt-8">

          <p className="text-sm text-[#657064]">
            Carbon measurement
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Calculate your carbon footprint
          </h1>

          <p className="mt-3 max-w-2xl text-[#657064]">
            Enter activity data to estimate Scope 1, Scope 2 and
            Scope 3 emissions. Save and finalize the report to create
            a traceable footprint record.
          </p>

        </div>

        {/* ======================================================
            ERROR ALERT
        ====================================================== */}

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b84e4e] text-sm font-bold text-white">
                  !
                </div>

                <div>
                  <p className="font-medium">
                    {error}
                  </p>

                  {!localStorage.getItem(
                    "verdiq_token",
                  ) && (
                    <p className="mt-1 text-xs text-[#9c5b5b]">
                      Your calculation is still available on this page.
                    </p>
                  )}
                </div>

              </div>

              {!localStorage.getItem(
                "verdiq_token",
              ) && (
                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="shrink-0 rounded-xl bg-[#b84e4e] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#993f3f]"
                >
                  Sign in →
                </button>
              )}

            </div>

          </div>
        )}

        {/* ======================================================
            SUCCESS ALERT
        ====================================================== */}

        {success && (
          <div className="mt-8 rounded-2xl border border-[#c9dcc9] bg-[#edf5ea] px-5 py-4 text-sm text-[#37643d]">
            ✓ {success}
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          {/* ==================================================
              INPUTS
          ================================================== */}

          <section className="rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm">

            <h2 className="text-xl font-semibold">
              Emission inputs
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Use your organization's activity data for the selected
              reporting year.
            </p>

            {/* Reporting year */}

            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium">
                Reporting year
              </label>

              <input
                type="number"
                min="2000"
                max="2100"
                value={reportingYear}
                onChange={(event) =>
                  setReportingYear(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />

            </div>

            {/* Scope 1 */}

            <div className="mt-5 rounded-2xl bg-[#fbfcfa] p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-semibold">
                    Scope 1
                  </p>

                  <p className="mt-1 text-xs text-[#7b8578]">
                    Direct fuel-related emissions
                  </p>

                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs text-[#7b8578]">
                  litres
                </span>

              </div>

              <input
                type="number"
                min="0"
                value={fuel}
                onChange={(event) =>
                  setFuel(
                    event.target.value,
                  )
                }
                placeholder="e.g. 2000"
                className="mt-4 w-full rounded-xl border border-[#cdd5c9] bg-white px-4 py-3 outline-none focus:border-[#4d8b55]"
              />

            </div>

            {/* Scope 2 */}

            <div className="mt-4 rounded-2xl bg-[#fbfcfa] p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-semibold">
                    Scope 2
                  </p>

                  <p className="mt-1 text-xs text-[#7b8578]">
                    Purchased electricity
                  </p>

                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs text-[#7b8578]">
                  kWh
                </span>

              </div>

              <input
                type="number"
                min="0"
                value={electricity}
                onChange={(event) =>
                  setElectricity(
                    event.target.value,
                  )
                }
                placeholder="e.g. 50000"
                className="mt-4 w-full rounded-xl border border-[#cdd5c9] bg-white px-4 py-3 outline-none focus:border-[#4d8b55]"
              />

            </div>

            {/* Scope 3 */}

            <div className="mt-4 rounded-2xl bg-[#fbfcfa] p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-semibold">
                    Scope 3
                  </p>

                  <p className="mt-1 text-xs text-[#7b8578]">
                    Business travel
                  </p>

                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs text-[#7b8578]">
                  km
                </span>

              </div>

              <input
                type="number"
                min="0"
                value={travel}
                onChange={(event) =>
                  setTravel(
                    event.target.value,
                  )
                }
                placeholder="e.g. 10000"
                className="mt-4 w-full rounded-xl border border-[#cdd5c9] bg-white px-4 py-3 outline-none focus:border-[#4d8b55]"
              />

            </div>

            <button
              type="button"
              onClick={calculateFootprint}
              className="mt-6 w-full rounded-xl bg-[#172018] px-5 py-3.5 font-medium text-white transition hover:-translate-y-0.5"
            >
              Calculate footprint
            </button>

          </section>

          {/* ==================================================
              RESULT
          ================================================== */}

          <section className="h-fit rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm lg:sticky lg:top-24">

            <p className="text-sm text-[#657064]">
              Footprint report
            </p>

            {!result ? (

              <div className="mt-10 rounded-2xl bg-[#fbfcfa] p-6">

                <p className="text-2xl font-semibold">
                  No calculation yet
                </p>

                <p className="mt-3 text-sm leading-6 text-[#657064]">
                  Enter your organization's activity data and calculate
                  the footprint. The result remains local until you
                  explicitly save it.
                </p>

              </div>

            ) : (

              <>

                {/* Total */}

                <div className="mt-6 rounded-3xl bg-[#edf5ea] p-6">

                  <p className="text-xs uppercase tracking-[0.18em] text-[#52765a]">
                    Total emissions
                  </p>

                  <p className="mt-3 text-5xl font-semibold text-[#37643d]">
                    {result.total.toFixed(2)}
                  </p>

                  <p className="mt-1 text-sm text-[#52765a]">
                    tCO₂e · reporting year{" "}
                    {reportingYear}
                  </p>

                </div>

                {/* Scope breakdown */}

                <div className="mt-7 space-y-4">

                  <div className="flex items-center justify-between border-b border-[#edf0ea] pb-4">

                    <div>
                      <p className="font-medium">
                        Scope 1
                      </p>

                      <p className="text-xs text-[#7b8578]">
                        Direct emissions
                      </p>
                    </div>

                    <p className="font-semibold">
                      {result.scope1.toFixed(2)} tCO₂e
                    </p>

                  </div>

                  <div className="flex items-center justify-between border-b border-[#edf0ea] pb-4">

                    <div>
                      <p className="font-medium">
                        Scope 2
                      </p>

                      <p className="text-xs text-[#7b8578]">
                        Purchased energy
                      </p>
                    </div>

                    <p className="font-semibold">
                      {result.scope2.toFixed(2)} tCO₂e
                    </p>

                  </div>

                  <div className="flex items-center justify-between border-b border-[#edf0ea] pb-4">

                    <div>
                      <p className="font-medium">
                        Scope 3
                      </p>

                      <p className="text-xs text-[#7b8578]">
                        Value-chain activity
                      </p>
                    </div>

                    <p className="font-semibold">
                      {result.scope3.toFixed(2)} tCO₂e
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    SAVE
                ================================================== */}

                {!savedReport ? (

                  <div className="mt-8">

                    <button
                      type="button"
                      onClick={saveReport}
                      disabled={saving}
                      className="w-full rounded-xl bg-[#172018] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Saving report..."
                        : "Save footprint report"}
                    </button>

                    <p className="mt-3 text-center text-xs leading-5 text-[#7b8578]">
                      Saving creates a calculated report in your Verdiq
                      account.
                    </p>

                  </div>

                ) : (

                  <div className="mt-8 rounded-2xl border border-[#dce3d8] bg-[#fbfcfa] p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs text-[#7b8578]">
                          Report saved
                        </p>

                        <p className="mt-1 font-mono text-sm font-semibold">
                          VF-
                          {String(
                            savedReport.id,
                          ).padStart(6, "0")}
                        </p>

                      </div>

                      <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                        {savedReport.status}
                      </span>

                    </div>

                    {savedReport.status !==
                      "finalized" && (

                      <button
                        type="button"
                        onClick={
                          finalizeReport
                        }
                        disabled={
                          finalizing
                        }
                        className="mt-5 w-full rounded-xl bg-[#4d8b55] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {finalizing
                          ? "Finalizing..."
                          : "Finalize report"}
                      </button>

                    )}

                    {savedReport.status ===
                      "finalized" && (

                      <div className="mt-5 rounded-xl bg-[#edf5ea] px-4 py-3 text-sm text-[#37643d]">
                        ✓ This report is finalized and can contribute to
                        Verdiq climate analytics.
                      </div>

                    )}

                  </div>

                )}

                {/* ==================================================
                    NEXT STEPS
                ================================================== */}

                <div className="mt-7 rounded-2xl bg-[#fbfcfa] p-5">

                  <p className="text-sm font-medium">
                    What happens next?
                  </p>

                  <div className="mt-4 space-y-3 text-sm text-[#657064]">

                    <p>
                      <span className="font-medium text-[#172018]">
                        1.
                      </span>{" "}
                      Save your calculated footprint.
                    </p>

                    <p>
                      <span className="font-medium text-[#172018]">
                        2.
                      </span>{" "}
                      Review the numbers.
                    </p>

                    <p>
                      <span className="font-medium text-[#172018]">
                        3.
                      </span>{" "}
                      Finalize the report.
                    </p>

                    <p>
                      <span className="font-medium text-[#172018]">
                        4.
                      </span>{" "}
                      Use the result to understand your residual
                      emissions and evaluate appropriate climate action.
                    </p>

                  </div>

                </div>

              </>
            )}

          </section>

        </div>

      </section>

    </main>
  );
}

export default Calculator;