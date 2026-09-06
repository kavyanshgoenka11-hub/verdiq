import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ====================================================== */}
      {/* PAGE HEADER */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 pb-16 pt-16 lg:px-16 lg:pb-20 lg:pt-20">
        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#d5ddd0] bg-white px-4 py-2 text-sm text-[#52604f]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            About Verdiq
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Making climate action
            <span className="text-[#4d8b55]">
              {" "}measurable and traceable.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#657064]">
            Verdiq is a carbon-impact platform designed to connect
            emissions measurement, environmental project verification,
            carbon-credit issuance, marketplace activity, retirement,
            and proof of impact in one traceable workflow.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/calculator")}
              className="rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              Measure your footprint →
            </button>

            <button
              type="button"
              onClick={() => navigate("/marketplace")}
              className="rounded-full border border-[#cdd5c9] bg-white px-6 py-3.5 text-sm font-medium transition hover:bg-[#eef2ea]"
            >
              Explore marketplace
            </button>
          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* WHY VERDIQ */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <p className="text-sm text-[#657064]">
                Why Verdiq
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Climate action is only useful when the trail is clear.
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-7 text-[#657064]">

              <p>
                Environmental action involves multiple steps and multiple
                participants. A company needs to understand its emissions,
                a project developer needs to establish a credible project,
                an auditor needs to review the evidence, and carbon credits
                need to remain traceable after they enter the market.
              </p>

              <p>
                Verdiq brings these activities into one system so that the
                movement from emissions measurement to credit retirement
                can be followed as a connected lifecycle.
              </p>

              <p>
                The goal is not simply to display a carbon number. The goal
                is to create a record of what was measured, what was
                verified, what was issued, what was purchased, and what
                was permanently retired.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHAT VERDIQ CONNECTS */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="max-w-3xl">
          <p className="text-sm text-[#657064]">
            The Verdiq ecosystem
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            One platform, four core roles.
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#657064]">
            Each role has a defined responsibility in the carbon-credit
            lifecycle.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* Buyer */}
          <article className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
              B
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Buyer
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Measures organizational emissions, saves footprint reports,
              purchases verified credits, manages holdings, and retires
              credits for permanent impact records.
            </p>

          </article>

          {/* Developer */}
          <article className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
              D
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Project Developer
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Registers environmental projects, uploads supporting
              evidence, follows verification, and manages issued credits
              and marketplace listings.
            </p>

          </article>

          {/* Auditor */}
          <article className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
              A
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Auditor
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Reviews submitted projects, examines supporting documents,
              records findings, and approves or rejects projects.
            </p>

          </article>

          {/* Admin */}
          <article className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ea] text-lg text-[#4d8b55]">
              A
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Administrator
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Manages platform users, monitors the verified-project
              inventory, and issues carbon credits approved through
              the verification process.
            </p>

          </article>

        </div>
      </section>

      {/* ====================================================== */}
      {/* MEASUREMENT */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">

            <div>

              <p className="text-sm text-[#657064]">
                01 · Measure
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Start with the footprint.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#657064]">
                Buyers can calculate Scope 1, Scope 2, and Scope 3
                emissions using structured activity inputs and save
                the resulting footprint as a report.
              </p>

              <button
                type="button"
                onClick={() => navigate("/calculator")}
                className="mt-7 rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white"
              >
                Open calculator →
              </button>

            </div>

            <div className="rounded-3xl bg-[#edf5ea] p-7">

              <p className="text-xs uppercase tracking-[0.18em] text-[#52765a]">
                Footprint structure
              </p>

              <div className="mt-6 space-y-4">

                {[
                  [
                    "Scope 1",
                    "Direct emissions from owned or controlled sources.",
                  ],
                  [
                    "Scope 2",
                    "Indirect emissions associated with purchased energy.",
                  ],
                  [
                    "Scope 3",
                    "Value-chain emissions associated with upstream and downstream activities.",
                  ],
                ].map(
                  ([title, description]) => (
                    <div
                      key={title}
                      className="rounded-2xl bg-white p-5"
                    >
                      <p className="font-semibold">
                        {title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#657064]">
                        {description}
                      </p>
                    </div>
                  ),
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* PROJECT VERIFICATION */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="max-w-3xl">

          <p className="text-sm text-[#657064]">
            02 · Verify
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Verification happens before issuance.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#657064]">
            Developers create projects and submit supporting evidence.
            Auditors review the project and record their findings before
            a project can move into the verified state.
          </p>

        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">

          {[
            [
              "Register",
              "Create the environmental project and define its expected credit volume.",
            ],
            [
              "Submit evidence",
              "Upload supporting project documents.",
            ],
            [
              "Audit",
              "An auditor reviews the project and evidence.",
            ],
            [
              "Approve",
              "Approved projects receive an auditor-authorized issuance quantity.",
            ],
          ].map(
            ([title, description], index) => (
              <div
                key={title}
                className="rounded-3xl border border-[#dce3d8] bg-white p-6"
              >

                <p className="text-xs text-[#7b8578]">
                  0{index + 1}
                </p>

                <h3 className="mt-4 text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#657064]">
                  {description}
                </p>

              </div>
            ),
          )}

        </div>
      </section>

      {/* ====================================================== */}
      {/* CREDIT LIFECYCLE */}
      {/* ====================================================== */}

      <section className="bg-[#172018] text-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">

            <p className="text-sm text-[#9fc79a]">
              03 · Track the asset
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              From verified project to permanent retirement.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#bcc7b9]">
              Verdiq keeps the credit lifecycle connected across project
              verification, issuance, marketplace activity, ownership,
              retirement, and certification.
            </p>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">

            {[
              [
                "01",
                "Verified",
                "Project passes auditor review.",
              ],
              [
                "02",
                "Issued",
                "Admin creates the approved credit batch.",
              ],
              [
                "03",
                "Listed",
                "Developer offers credits through the marketplace.",
              ],
              [
                "04",
                "Purchased",
                "Buyer acquires credits from an active listing.",
              ],
              [
                "05",
                "Retired",
                "Buyer permanently retires credits and receives proof.",
              ],
            ].map(
              ([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-[#344036] bg-[#202b21] p-6"
                >

                  <p className="text-xs text-[#7f967f]">
                    {number}
                  </p>

                  <h3 className="mt-4 text-xl font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#aeb9ac]">
                    {description}
                  </p>

                </div>
              ),
            )}

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* TRANSPARENCY */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-sm text-[#657064]">
              Transparency
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Public climate visibility
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              The public Verdiq experience exposes platform statistics,
              participating organizations, verified projects, and
              emissions-by-scope data.
            </p>

          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-sm text-[#657064]">
              Traceability
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Follow every major state change
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Project verification, issuance, purchase, retirement, and
              certification are represented as connected records.
            </p>

          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-sm text-[#657064]">
              External context
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Separate platform data from climate data
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Verdiq distinguishes its own network analytics from external
              atmospheric CO₂ observations sourced from NOAA.
            </p>

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="border-t border-[#dce3d8] bg-[#edf5ea]">

        <div className="mx-auto max-w-7xl px-8 py-16 lg:px-16">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <p className="text-sm text-[#52765a]">
                Explore Verdiq
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                See the platform in action.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#657064]">
                Move from carbon measurement to verified projects,
                marketplace activity, retirement, and proof of impact.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => navigate("/marketplace")}
                className="rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white"
              >
                Explore marketplace
              </button>

              <button
                type="button"
                onClick={() => navigate("/documentation")}
                className="rounded-full border border-[#cdd5c9] bg-white px-6 py-3.5 text-sm font-medium"
              >
                Read documentation
              </button>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

export default About;