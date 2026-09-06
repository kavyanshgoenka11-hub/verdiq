import { useNavigate } from "react-router-dom";

type ActorCardProps = {
  name: string;
  role: string;
  symbol: string;
  className: string;
  textClassName: string;
};

type UseCaseBoxProps = {
  label: string;
};

type RoleSectionProps = {
  title: string;
  description: string;
  badge: string;
  wrapperClass: string;
  titleClass: string;
  descriptionClass: string;
  badgeClass: string;
  items: string[];
};

function ActorCard({
  name,
  role,
  symbol,
  className,
  textClassName,
}: ActorCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-[70px] w-[70px] items-center justify-center rounded-full border-[3px] text-xl font-bold shadow-[0_8px_24px_rgba(0,0,0,0.25)] ${className}`}
      >
        {symbol}
      </div>

      <p
        className={`mt-3 text-center text-sm font-semibold ${textClassName}`}
      >
        {name}
      </p>

      <p
        className={`mt-1 max-w-[145px] text-center text-xs leading-5 ${
          textClassName === "text-white"
            ? "text-[#aebfaf]"
            : "text-[#657064]"
        }`}
      >
        {role}
      </p>
    </div>
  );
}

function UseCaseBox({
  label,
}: UseCaseBoxProps) {
  return (
    <div className="flex min-h-[56px] items-center justify-center rounded-full border border-[#b8c9b9] bg-[#f8fbf8] px-4 py-3 text-center text-xs font-medium text-[#26352b] shadow-[0_4px_12px_rgba(0,0,0,0.14)] transition duration-200 hover:-translate-y-0.5 hover:border-[#6e9d73] hover:bg-white hover:shadow-md">
      {label}
    </div>
  );
}

function RoleSection({
  title,
  description,
  badge,
  wrapperClass,
  titleClass,
  descriptionClass,
  badgeClass,
  items,
}: RoleSectionProps) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-[0_8px_24px_rgba(0,0,0,0.14)] ${wrapperClass}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className={`text-base font-semibold ${titleClass}`}>
            {title}
          </h4>

          <p
            className={`mt-1 max-w-2xl text-xs leading-5 ${descriptionClass}`}
          >
            {description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${badgeClass}`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <UseCaseBox
            key={item}
            label={item}
          />
        ))}
      </div>
    </div>
  );
}

function UseCase() {
  const navigate = useNavigate();

  const publicCases = [
    "View platform overview",
    "View climate leaderboard",
    "View emissions by scope",
    "Explore verified projects",
    "View marketplace listings",
    "View atmospheric CO₂",
  ];

  const buyerCases = [
    "Register / Login",
    "Calculate footprint",
    "Save footprint report",
    "Finalize footprint report",
    "View footprint reports",
    "Browse marketplace",
    "View credit details",
    "Purchase credits",
    "View purchases",
    "Manage portfolio",
    "Retire purchased credits",
    "View retirement record",
    "View certificate",
  ];

  const developerCases = [
    "Register / Login",
    "Create project",
    "View own projects",
    "Upload project evidence",
    "View project documents",
    "Submit project for verification",
    "View issued credits",
    "List credits for sale",
  ];

  const auditorCases = [
    "Login",
    "View verification queue",
    "View project details",
    "Review project evidence",
    "View previous audits",
    "Approve project",
    "Reject project",
    "Set approved issuance quantity",
  ];

  const adminCases = [
    "Login",
    "View platform statistics",
    "Create user account",
    "Create administrator account",
    "View verified projects",
    "Issue carbon credits",
  ];

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">
        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            UML · System Design
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] text-[#172018] sm:text-6xl">
            Verdiq
            <span className="text-[#4d8b55]">
              {" "}Use Case Diagram
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            A role-based model of the Verdiq platform showing how
            public visitors, buyers, project developers, auditors,
            and administrators interact with the system.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/activity-diagram")
              }
              className="rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#263328]"
            >
              View activity diagram →
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/documentation")
              }
              className="rounded-full border border-[#cdd5c9] bg-white px-6 py-3.5 text-sm font-medium transition hover:bg-[#eef2ea]"
            >
              Read documentation
            </button>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* MAIN DIAGRAM */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

          {/* ================================================== */}
          {/* DARK DIAGRAM CANVAS */}
          {/* ================================================== */}

          <div className="overflow-hidden rounded-[2.25rem] border border-[#425b47] bg-[#263a2a] p-5 shadow-[0_24px_70px_rgba(23,41,28,0.20)] sm:p-8 lg:p-10">

            {/* Diagram header */}
            <div className="border-b border-[#3b5741] pb-7">

              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

                <div>

                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#91bd96]">
                    System model
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    Verdiq Carbon Impact Platform
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#b8c9b9]">
                    The dark canvas represents the platform boundary.
                    Each role has a dedicated visual identity, while the
                    light capsules represent individual system operations.
                  </p>

                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">

                  <div className="flex items-center gap-2 rounded-xl border border-[#58745b] bg-[#314a34] px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#82a985]" />
                    <span className="text-[11px] font-medium text-[#d8e4d8]">
                      Buyer
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#627b9b] bg-[#334a62] px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#8caed2]" />
                    <span className="text-[11px] font-medium text-[#dbe5ee]">
                      Developer
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#a47a2b] bg-[#5b451f] px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d3a24d]" />
                    <span className="text-[11px] font-medium text-[#f0dfc0]">
                      Auditor
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#8664a0] bg-[#4b3858] px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#b194cf]" />
                    <span className="text-[11px] font-medium text-[#e9e0ef]">
                      Admin
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#66736a] bg-[#39433b] px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#aeb9b0]" />
                    <span className="text-[11px] font-medium text-[#e0e5e1]">
                      Visitor
                    </span>
                  </div>

                </div>

              </div>
            </div>

            {/* ================================================= */}
            {/* DIAGRAM */}
            {/* ================================================= */}

            <div className="mt-8 overflow-x-auto pb-3">

              <div className="min-w-[1180px]">

                <div className="grid grid-cols-[175px_1fr_175px] gap-8">

                  {/* ================================================= */}
                  {/* LEFT ACTORS */}
                  {/* ================================================= */}

                  <div className="flex flex-col justify-around py-10">

                    <ActorCard
                      name="Public Visitor"
                      role="Unauthenticated visitor"
                      symbol="V"
                      className="border-[#8b9a8e] bg-[#dce5de] text-[#34463a]"
                      textClassName="text-white"
                    />

                    <ActorCard
                      name="Buyer"
                      role="Corporate / organizational participant"
                      symbol="B"
                      className="border-[#66a76e] bg-[#d9eedc] text-[#37643d]"
                      textClassName="text-white"
                    />

                    <ActorCard
                      name="Project Developer"
                      role="Environmental project owner"
                      symbol="D"
                      className="border-[#759bc5] bg-[#dce8f7] text-[#355981]"
                      textClassName="text-white"
                    />

                  </div>

                  {/* ================================================= */}
                  {/* SYSTEM BOUNDARY */}
                  {/* ================================================= */}

                  <div className="rounded-[2rem] border-[3px] border-dashed border-[#76977c] bg-white p-5 shadow-[inset_0_0_80px_rgba(0,0,0,0.20)] sm:p-6">

                    {/* Boundary header */}
                    <div className="flex flex-col items-center text-center">

                      <span className="rounded-full border border-[#618067] bg-[#0e1f14] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b0d2b2]">
                        System Boundary
                      </span>

                      <h3 className="mt-3 text-2xl font-semibold text-white">
                        Verdiq
                      </h3>

                      <p className="mt-1 text-l text-black">
                        Carbon Impact Platform
                      </p>

                    </div>

                    <div className="mt-8 space-y-5">

                      {/* ================================================= */}
                      {/* PUBLIC */}
                      {/* ================================================= */}

                      <RoleSection
                        title="Public access"
                        description="Read-only platform information available to visitors."
                        badge="Visitor"
                        wrapperClass="border-[#708274] bg-[#46534a]"
                        titleClass="text-[#f1f5f1]"
                        descriptionClass="text-[#c0ccc1]"
                        badgeClass="bg-[#d9e2da] text-[#465449]"
                        items={publicCases}
                      />

                      {/* ================================================= */}
                      {/* BUYER */}
                      {/* ================================================= */}

                      <RoleSection
                        title="Buyer operations"
                        description="Measure emissions, acquire credits, manage holdings, and retire impact."
                        badge="Buyer"
                        wrapperClass="border-[#5f8e66] bg-[#34523a]"
                        titleClass="text-[#f3faf3]"
                        descriptionClass="text-[#c8dbc9]"
                        badgeClass="bg-[#cde6d0] text-[#37643d]"
                        items={buyerCases}
                      />

                      {/* ================================================= */}
                      {/* DEVELOPER */}
                      {/* ================================================= */}

                      <RoleSection
                        title="Developer operations"
                        description="Create projects, provide evidence, and bring verified credits to market."
                        badge="Developer"
                        wrapperClass="border-[#6d8eae] bg-[#354d65]"
                        titleClass="text-[#f1f6fc]"
                        descriptionClass="text-[#c9d8e5]"
                        badgeClass="bg-[#d6e3f2] text-[#355784]"
                        items={developerCases}
                      />

                      {/* ================================================= */}
                      {/* AUDITOR */}
                      {/* ================================================= */}

                      <RoleSection
                        title="Auditor operations"
                        description="Review projects, inspect evidence, and determine verification outcomes."
                        badge="Auditor"
                        wrapperClass="border-[#a8792c] bg-[#5d471f]"
                        titleClass="text-[#fff9eb]"
                        descriptionClass="text-[#e7d7ba]"
                        badgeClass="bg-[#f1dfb7] text-[#765615]"
                        items={auditorCases}
                      />

                      {/* ================================================= */}
                      {/* ADMIN */}
                      {/* ================================================= */}

                      <RoleSection
                        title="Administrative operations"
                        description="Control user accounts, monitor verified projects, and issue credits."
                        badge="Admin"
                        wrapperClass="border-[#86649f] bg-[#503b5c]"
                        titleClass="text-[#fbf7fe]"
                        descriptionClass="text-[#dbcde3]"
                        badgeClass="bg-[#e4d5f0] text-[#62428a]"
                        items={adminCases}
                      />

                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* RIGHT ACTORS */}
                  {/* ================================================= */}

                  <div className="flex flex-col justify-around py-24">

                    <ActorCard
                      name="Auditor"
                      role="Project verification role"
                      symbol="A"
                      className="border-[#a87920] bg-[#dca746] text-[#5e4512]"
                      textClassName="text-white"
                    />

                    <ActorCard
                      name="Administrator"
                      role="Platform administration"
                      symbol="A"
                      className="border-[#76529a] bg-[#c7a6dc] text-[#53356f]"
                      textClassName="text-white"
                    />

                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ACTOR RESPONSIBILITIES */}
      {/* ====================================================== */}

      <section className="bg-[#f6f8f3]">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">

            <p className="text-sm text-[#657064]">
              Actor responsibilities
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Who does what in Verdiq?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#657064]">
              The role colors used in the system model are repeated below
              to make responsibilities easy to distinguish.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* Buyer */}
            <article className="rounded-3xl border border-[#b6d2ba] bg-[#f0f8f1] p-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dceede] font-semibold text-[#37643d]">
                B
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Buyer
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5d6b60]">
                Measures emissions, saves and finalizes reports, purchases
                credits, manages holdings, retires credits, and views
                certificates.
              </p>

            </article>

            {/* Developer */}
            <article className="rounded-3xl border border-[#bfd0e7] bg-[#f2f6fc] p-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dfeafa] font-semibold text-[#355784]">
                D
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Project Developer
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5a687b]">
                Registers projects, uploads evidence, submits projects for
                review, receives issued credits, and lists them for sale.
              </p>

            </article>

            {/* Auditor */}
            <article className="rounded-3xl border border-[#e2ce9e] bg-[#fff9ed] p-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0cd] font-semibold text-[#7b5817]">
                A
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Auditor
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6e613f]">
                Reviews projects and supporting evidence, records findings,
                and approves or rejects projects.
              </p>

            </article>

            {/* Administrator */}
            <article className="rounded-3xl border border-[#d2c1e7] bg-[#f8f4fc] p-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eee5f8] font-semibold text-[#65458f]">
                A
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Administrator
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#655b70]">
                Manages user accounts, monitors verified projects, and
                issues carbon credits approved through verification.
              </p>

            </article>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CORE RELATIONSHIPS */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">

            <p className="text-sm text-[#657064]">
              Core relationships
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              The roles connect at defined handoffs.
            </h2>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-[#bfd0e7] bg-[#edf4fc] p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4d72ad]">
                Developer → Auditor
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                Project submission
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5a687b]">
                A developer submits the project and supporting evidence
                for verification.
              </p>

            </div>

            <div className="rounded-3xl border border-[#e2ce9e] bg-[#fff8e8] p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b57a1c]">
                Auditor → Admin
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                Verification approval
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6e613f]">
                Approval and the authorized issuance quantity make the
                project eligible for credit issuance.
              </p>

            </div>

            <div className="rounded-3xl border border-[#d2c1e7] bg-[#f8f4fc] p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7953a7]">
                Admin → Developer
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                Credit issuance
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#655b70]">
                The administrator creates the credit batch, which enters
                the developer's inventory.
              </p>

            </div>

            <div className="rounded-3xl border border-[#b6d2ba] bg-[#eef8ef] p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4d8b55]">
                Market → Buyer
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                Purchase → retirement
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5d6b60]">
                The buyer acquires credits, manages the holding, and can
                permanently retire the available balance.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <section className="border-t border-[#dce3d8] bg-[#edf5ea]">

        <div className="mx-auto max-w-7xl px-8 py-16 lg:px-16">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <p className="text-sm text-[#52765a]">
                Next system view
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                See how these interactions become a workflow.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#657064]">
                Follow the same participants through the operational
                lifecycle represented in the activity diagram.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/activity-diagram")
              }
              className="shrink-0 rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#263328]"
            >
              Open activity diagram →
            </button>

          </div>

        </div>
      </section>

    </main>
  );
}

export default UseCase;