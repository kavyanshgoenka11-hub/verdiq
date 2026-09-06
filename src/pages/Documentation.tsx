import { useNavigate } from "react-router-dom";

function Documentation() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 pb-16 pt-16 lg:px-16 lg:pb-20 lg:pt-20">
        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#d5ddd0] bg-white px-4 py-2 text-sm text-[#52604f]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            Verdiq Documentation
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            Understand how
            <span className="text-[#4d8b55]">
              {" "}Verdiq works.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#657064]">
            Verdiq connects carbon-footprint measurement, environmental
            project verification, carbon-credit issuance, marketplace
            activity, retirement, and proof of impact through a role-based
            platform.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/use-case")
              }
              className="rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              View use cases →
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/activity-diagram")
              }
              className="rounded-full border border-[#cdd5c9] bg-white px-6 py-3.5 text-sm font-medium transition hover:bg-[#eef2ea]"
            >
              View activity diagram
            </button>

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* QUICK OVERVIEW */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto max-w-7xl px-8 py-16 lg:px-16">

          <div className="grid gap-5 md:grid-cols-4">

            {[
              [
                "01",
                "Measure",
                "Calculate Scope 1, Scope 2 and Scope 3 emissions.",
              ],
              [
                "02",
                "Verify",
                "Review environmental projects and supporting evidence.",
              ],
              [
                "03",
                "Trade",
                "Issue and list verified carbon credits for marketplace activity.",
              ],
              [
                "04",
                "Retire",
                "Permanently retire purchased credits and generate proof.",
              ],
            ].map(
              ([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6"
                >

                  <p className="text-xs text-[#7b8578]">
                    {number}
                  </p>

                  <h2 className="mt-4 text-xl font-semibold">
                    {title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#657064]">
                    {description}
                  </p>

                </div>
              ),
            )}

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* SYSTEM ARCHITECTURE */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

          <div>
            <p className="text-sm text-[#657064]">
              01 · Platform architecture
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              A role-based carbon lifecycle.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#657064]">
              Verdiq separates responsibilities between platform roles.
              This allows a project to move through clearly defined
              stages rather than allowing one participant to control the
              entire lifecycle.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#dce3d8] bg-white p-7 shadow-sm">

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl bg-[#edf5ea] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#52765a]">
                  Buyer
                </p>

                <p className="mt-3 text-sm font-semibold">
                  Measure → Purchase → Retire
                </p>

                <p className="mt-2 text-xs leading-5 text-[#52765a]">
                  Handles emissions reporting, credit acquisition,
                  portfolio ownership, retirement, and certificates.
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#7b8578]">
                  Developer
                </p>

                <p className="mt-3 text-sm font-semibold">
                  Register → Submit → List
                </p>

                <p className="mt-2 text-xs leading-5 text-[#657064]">
                  Creates projects, uploads evidence, tracks verification,
                  and manages issued credit inventory.
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#7b8578]">
                  Auditor
                </p>

                <p className="mt-3 text-sm font-semibold">
                  Review → Approve / Reject
                </p>

                <p className="mt-2 text-xs leading-5 text-[#657064]">
                  Reviews projects and evidence and determines whether
                  a project can progress to the verified state.
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#7b8578]">
                  Administrator
                </p>

                <p className="mt-3 text-sm font-semibold">
                  Manage → Issue
                </p>

                <p className="mt-2 text-xs leading-5 text-[#657064]">
                  Manages user accounts, monitors verified projects,
                  and issues approved carbon-credit batches.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* AUTHENTICATION & ACCESS CONTROL */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">
            <p className="text-sm text-[#657064]">
              02 · Authentication
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Role-based access protects platform operations.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#657064]">
              Verdiq uses authenticated sessions backed by JSON Web Tokens.
              The server determines the user's role from the verified token
              and restricts protected operations accordingly.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6">
              <p className="text-sm font-semibold">
                Registration
              </p>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Public registration currently permits buyer and developer
                accounts. Passwords are hashed before storage.
              </p>
            </div>

            <div className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6">
              <p className="text-sm font-semibold">
                Login
              </p>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Credentials are checked against the stored password hash
                and an authenticated JWT is issued after successful login.
              </p>
            </div>

            <div className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6">
              <p className="text-sm font-semibold">
                Role enforcement
              </p>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Protected endpoints apply role checks so buyer, developer,
                auditor, and administrator operations remain separated.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BUYER WORKFLOW */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="max-w-3xl">
          <p className="text-sm text-[#657064]">
            03 · Buyer workflow
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            From emissions measurement to proof of retirement.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#657064]">
            Buyers can create footprint reports, participate in the
            marketplace, manage acquired credits, and permanently
            retire credits.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {[
            [
              "01",
              "Calculate",
              "Enter activity data and calculate Scope 1, Scope 2 and Scope 3 emissions.",
            ],
            [
              "02",
              "Save & finalize",
              "Store the footprint report and finalize it for Verdiq analytics.",
            ],
            [
              "03",
              "Purchase",
              "Select an active marketplace listing and purchase available credits.",
            ],
            [
              "04",
              "Retire",
              "Retire purchased credits and receive a retirement certificate.",
            ],
          ].map(
            ([number, title, description]) => (
              <div
                key={number}
                className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm"
              >

                <p className="text-xs text-[#7b8578]">
                  {number}
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
      {/* DEVELOPER + AUDITOR WORKFLOW */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Developer */}
            <div className="rounded-[2rem] border border-[#dce3d8] bg-[#fbfcfa] p-8">

              <p className="text-sm text-[#657064]">
                Developer workflow
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                From project creation to credit listing.
              </h2>

              <div className="mt-8 space-y-5">

                {[
                  [
                    "01",
                    "Register project",
                    "Create the project with its type, location, description, and expected credit quantity.",
                  ],
                  [
                    "02",
                    "Upload evidence",
                    "Attach supporting project documents.",
                  ],
                  [
                    "03",
                    "Submit",
                    "Move the project from draft to under review.",
                  ],
                  [
                    "04",
                    "Receive issuance",
                    "After approval, the administrator issues the approved credit quantity.",
                  ],
                  [
                    "05",
                    "List credits",
                    "Set a price and offer available credits through the marketplace.",
                  ],
                ].map(
                  ([
                    number,
                    title,
                    description,
                  ]) => (
                    <div
                      key={number}
                      className="flex gap-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#4d8b55]">
                        {number}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[#657064]">
                          {description}
                        </p>
                      </div>
                    </div>
                  ),
                )}

              </div>
            </div>

            {/* Auditor */}
            <div className="rounded-[2rem] border border-[#dce3d8] bg-white p-8">

              <p className="text-sm text-[#657064]">
                Auditor workflow
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Evidence-based project review.
              </h2>

              <div className="mt-8 space-y-5">

                {[
                  [
                    "01",
                    "Open review queue",
                    "View projects currently under review.",
                  ],
                  [
                    "02",
                    "Inspect project",
                    "Review project information and expected credits.",
                  ],
                  [
                    "03",
                    "Inspect evidence",
                    "Review documents associated with the project.",
                  ],
                  [
                    "04",
                    "Record findings",
                    "Create an audit record with findings.",
                  ],
                  [
                    "05",
                    "Decide",
                    "Approve with an issuance quantity or reject the project.",
                  ],
                ].map(
                  ([
                    number,
                    title,
                    description,
                  ]) => (
                    <div
                      key={number}
                      className="flex gap-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf5ea] text-xs font-semibold text-[#4d8b55]">
                        {number}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[#657064]">
                          {description}
                        </p>
                      </div>
                    </div>
                  ),
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ADMIN WORKFLOW */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="max-w-3xl">
          <p className="text-sm text-[#657064]">
            05 · Administration
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Administrative controls keep the lifecycle moving.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#657064]">
            The administrator operates the platform layer between project
            verification and credit inventory while also managing user
            accounts.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-xs uppercase tracking-[0.16em] text-[#7b8578]">
              User management
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Create platform accounts
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Administrators can create buyer, developer, auditor, and
              administrator accounts.
            </p>

          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-xs uppercase tracking-[0.16em] text-[#7b8578]">
              Credit issuance
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Issue verified credits
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Credits can only be issued when a project is verified and
              has an auditor-approved issuance quantity.
            </p>

          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-xs uppercase tracking-[0.16em] text-[#7b8578]">
              Monitoring
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              Monitor platform state
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              Platform statistics provide visibility into users,
              projects, credits issued, and retired credits.
            </p>

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* MARKETPLACE */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">
            <p className="text-sm text-[#657064]">
              06 · Marketplace
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Verified assets enter the market only after approval.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#657064]">
              Marketplace listings are connected to issued credit batches
              and verified projects. The system checks inventory before a
              purchase is completed.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">

            {[
              [
                "Verified project",
                "Only verified projects can have credits listed.",
              ],
              [
                "Issued batch",
                "The administrator creates the credit inventory.",
              ],
              [
                "Active listing",
                "The developer lists available credits with a price.",
              ],
              [
                "Purchase",
                "The buyer purchases an available quantity and marketplace inventory is reduced.",
              ],
            ].map(
              ([title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6"
                >

                  <h3 className="text-lg font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#657064]">
                    {description}
                  </p>

                </div>
              ),
            )}

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* RETIREMENT + CERTIFICATE */}
      {/* ====================================================== */}

      <section className="bg-[#172018] text-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">

            <div>
              <p className="text-sm text-[#9fc79a]">
                07 · Retirement
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Retirement closes the lifecycle.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#bcc7b9]">
                A buyer can retire credits from a completed purchase.
                The platform checks the buyer's remaining balance before
                recording the retirement.
              </p>

              <div className="mt-8 space-y-4">

                {[
                  "Completed purchase is selected.",
                  "Available retirement quantity is calculated.",
                  "Retirement record is created.",
                  "A unique retirement reference is generated.",
                  "A certificate is associated with the retirement.",
                ].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex gap-3"
                    >

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#263328] text-xs text-[#9fc79a]">
                        {index + 1}
                      </div>

                      <p className="text-sm text-[#c7d0c5]">
                        {item}
                      </p>

                    </div>
                  ),
                )}

              </div>
            </div>

            <div className="rounded-[2rem] border border-[#344036] bg-[#202b21] p-8">

              <p className="text-xs uppercase tracking-[0.18em] text-[#9fc79a]">
                Proof of impact
              </p>

              <h3 className="mt-4 text-2xl font-semibold">
                Retirement certificate
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#bcc7b9]">
                The certificate links the retirement back to the purchase,
                project, credit serial number, buyer, quantity, retirement
                reference, and certificate number.
              </p>

              <div className="mt-7 rounded-2xl bg-[#172018] p-5">

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-[#7f8c7f]">
                      Certificate
                    </span>

                    <span className="font-mono text-[#d2dbd0]">
                      VQ-CERT-••••••
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#7f8c7f]">
                      Retirement
                    </span>

                    <span className="font-mono text-[#d2dbd0]">
                      RET-••••••
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#7f8c7f]">
                      Status
                    </span>

                    <span className="text-[#9fc79a]">
                      Completed
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* PUBLIC ANALYTICS */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="max-w-3xl">

          <p className="text-sm text-[#657064]">
            08 · Public transparency
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            The public layer exposes measurable activity.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#657064]">
            Verdiq provides public endpoints for network statistics,
            participating organizations, emissions by scope, verified
            projects, and atmospheric CO₂ context.
          </p>

        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-sm font-semibold">
              Verdiq network
            </p>

            <div className="mt-5 space-y-3">

              <div className="flex justify-between border-b border-[#edf0ea] pb-3">
                <span className="text-sm text-[#657064]">
                  Platform overview
                </span>

                <span className="font-mono text-xs text-[#7b8578]">
                  /api/public/overview
                </span>
              </div>

              <div className="flex justify-between border-b border-[#edf0ea] pb-3">
                <span className="text-sm text-[#657064]">
                  Climate leaderboard
                </span>

                <span className="font-mono text-xs text-[#7b8578]">
                  /api/public/leaderboard
                </span>
              </div>

              <div className="flex justify-between border-b border-[#edf0ea] pb-3">
                <span className="text-sm text-[#657064]">
                  Scope breakdown
                </span>

                <span className="font-mono text-xs text-[#7b8578]">
                  /api/public/scope-breakdown
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-[#657064]">
                  Verified projects
                </span>

                <span className="font-mono text-xs text-[#7b8578]">
                  /api/public/projects
                </span>
              </div>

            </div>

          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-[#edf5ea] p-7">

            <p className="text-sm font-semibold text-[#37643d]">
              External climate context
            </p>

            <p className="mt-3 text-sm leading-7 text-[#52765a]">
              The atmospheric CO₂ card on the public homepage is kept
              separate from Verdiq's internal platform statistics.
              Current observations are requested from NOAA's Global
              Monitoring Laboratory through the Verdiq backend.
            </p>

            <a
              href="https://gml.noaa.gov/ccgg/trends/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block text-sm font-medium text-[#37643d] hover:underline"
            >
              View NOAA climate data →
            </a>

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* DATABASE / RECORD TRACEABILITY */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">

            <p className="text-sm text-[#657064]">
              09 · Data traceability
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Core records remain connected.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#657064]">
              Verdiq stores the major lifecycle events as relational
              records so later actions can be traced back to their
              originating project, credit, purchase, or retirement.
            </p>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">

            {[
              [
                "Projects",
                "Environmental project records and verification state.",
              ],
              [
                "Credits",
                "Issued credit batches and remaining inventory.",
              ],
              [
                "Purchases",
                "Buyer transactions linked to marketplace listings.",
              ],
              [
                "Retirements",
                "Permanent retirement events and associated certificates.",
              ],
            ].map(
              ([title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6"
                >

                  <h3 className="text-lg font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#657064]">
                    {description}
                  </p>

                </div>
              ),
            )}

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* LIMITATIONS */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="rounded-[2rem] border border-[#dce3d8] bg-white p-8 sm:p-10">

          <p className="text-sm text-[#657064]">
            10 · Current prototype boundaries
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            What Verdiq does not currently claim.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#657064]">
            The current implementation is a functional prototype.
            The following capabilities are intentionally outside the
            present system and should not be represented as implemented
            features.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            {[
              "No real payment gateway or financial settlement system.",
              "No blockchain or distributed-ledger implementation.",
              "No automated scientific project verification.",
              "No external carbon-standard registry integration.",
              "The footprint calculator currently uses prototype emission factors.",
              "NOAA atmospheric CO₂ is an external climate indicator, not a Verdiq-generated measurement.",
            ].map(
              (item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl bg-[#fbfcfa] p-5"
                >

                  <span className="text-[#4d8b55]">
                    →
                  </span>

                  <p className="text-sm leading-6 text-[#657064]">
                    {item}
                  </p>

                </div>
              ),
            )}

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* NAVIGATION CTA */}
      {/* ====================================================== */}

      <section className="border-t border-[#dce3d8] bg-[#edf5ea]">

        <div className="mx-auto max-w-7xl px-8 py-16 lg:px-16">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <p className="text-sm text-[#52765a]">
                Explore the system
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                See Verdiq's actors and workflow visually.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#657064]">
                The use case and activity diagrams summarize the
                relationships and lifecycle described in this document.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/use-case")
                }
                className="rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white"
              >
                Use Case Diagram
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/activity-diagram")
                }
                className="rounded-full border border-[#cdd5c9] bg-white px-6 py-3.5 text-sm font-medium"
              >
                Activity Diagram
              </button>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

export default Documentation;