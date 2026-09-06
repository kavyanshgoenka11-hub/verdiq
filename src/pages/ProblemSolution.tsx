import React from "react";

interface SolutionStep {
  number: string;
  title: string;
  description: string;
}

const solutionSteps: SolutionStep[] = [
  {
    number: "01",
    title: "Measure Carbon Footprint",
    description:
      "Users can calculate their carbon footprint using the Verdiq calculator and understand their emissions before deciding how to offset them.",
  },
  {
    number: "02",
    title: "Create & Submit Projects",
    description:
      "Developers can create carbon projects, provide project information, upload supporting evidence, and submit the project for verification.",
  },
  {
    number: "03",
    title: "Independent Verification",
    description:
      "Auditors review submitted project information and evidence, then approve or reject the project and specify the approved issuance quantity where applicable.",
  },
  {
    number: "04",
    title: "Controlled Credit Issuance",
    description:
      "Approved projects move to administrator-controlled credit issuance, ensuring that credits are issued only after the verification workflow.",
  },
  {
    number: "05",
    title: "Transparent Marketplace",
    description:
      "Developers can list issued credits for sale, while buyers can browse available listings and review verified project information before purchasing.",
  },
  {
    number: "06",
    title: "Purchase, Portfolio & Retirement",
    description:
      "Purchased credits are reflected in the buyer's portfolio. Buyers can later retire eligible credits and obtain a corresponding retirement certificate.",
  },
];

export const VerdiqProblemSolution: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ================= PAGE INTRO ================= */}
      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">
        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            Project Overview
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            Problem Statement
            <span className="text-[#4d8b55]"> & Proposed Solution</span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            Verdiq addresses the challenge of making carbon measurement,
            carbon-credit verification, marketplace transactions, and
            credit retirement accessible through a single structured
            digital platform.
          </p>

        </div>
      </section>


      {/* ================= MAIN DOCUMENT ================= */}
      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

          <div className="overflow-hidden rounded-3xl border border-[#bcc8be] bg-white shadow-[0_16px_50px_rgba(25,45,30,0.10)]">

            {/* ================= PROBLEM STATEMENT ================= */}
            <section className="px-6 py-10 sm:px-8 lg:px-10 lg:py-14">

              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

                {/* Left heading */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#e1caca] bg-[#fff5f5] px-3.5 py-1.5 text-xs font-semibold text-[#8a4b4b]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b85a5a]" />
                    The Challenge
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                    The Problem
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#657064]">
                    Carbon management involves multiple stakeholders and
                    disconnected activities, making it difficult to maintain
                    a clear and trustworthy lifecycle from measurement to
                    credit retirement.
                  </p>
                </div>


                {/* Problem content */}
                <div className="space-y-4">

                  <div className="rounded-2xl border border-[#eadada] bg-[#fffafa] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5dddd] text-sm font-bold text-[#8a4b4b]">
                        01
                      </div>

                      <div>
                        <h3 className="text-base font-semibold">
                          Fragmented Carbon Management
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#657064]">
                          Carbon-footprint measurement, project verification,
                          credit issuance, marketplace transactions, and
                          retirement can exist as separate activities rather
                          than as one connected workflow.
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="rounded-2xl border border-[#eadada] bg-[#fffafa] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5dddd] text-sm font-bold text-[#8a4b4b]">
                        02
                      </div>

                      <div>
                        <h3 className="text-base font-semibold">
                          Trust & Verification Challenges
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#657064]">
                          Buyers need confidence that listed credits
                          originate from projects that have passed a defined
                          review process and that issuance is controlled
                          after verification.
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="rounded-2xl border border-[#eadada] bg-[#fffafa] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5dddd] text-sm font-bold text-[#8a4b4b]">
                        03
                      </div>

                      <div>
                        <h3 className="text-base font-semibold">
                          Limited Lifecycle Visibility
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#657064]">
                          Without a connected platform, it is harder to
                          follow the journey of a project and its credits
                          from creation and verification through listing,
                          purchase, portfolio ownership, and retirement.
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="rounded-2xl border border-[#eadada] bg-[#fffafa] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5dddd] text-sm font-bold text-[#8a4b4b]">
                        04
                      </div>

                      <div>
                        <h3 className="text-base font-semibold">
                          Need for Accessible Carbon Action
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#657064]">
                          Users need an approachable way to understand their
                          own emissions while being able to discover and
                          interact with verified carbon-credit opportunities.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>


            {/* ================= DIVIDER / TRANSITION ================= */}
            <div className="border-y border-[#dce3d8] bg-[#fbfcfa] px-6 py-10 sm:px-8 lg:px-10">

              <div className="mx-auto max-w-4xl text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3e8] text-[#4d8b55] shadow-sm">
                  ↓
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  The Verdiq Approach
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#657064]">
                  Verdiq connects measurement, verification, issuance,
                  marketplace transactions, ownership, and retirement into
                  one role-based application workflow.
                </p>

              </div>

            </div>


            {/* ================= PROPOSED SOLUTION ================= */}
            <section className="px-6 py-10 sm:px-8 lg:px-10 lg:py-14">

              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

                {/* Left heading */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-3.5 py-1.5 text-xs font-semibold text-[#37643d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4d8b55]" />
                    Proposed Solution
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                    Verdiq
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#657064]">
                    A role-based carbon impact platform designed to connect
                    carbon measurement with a structured carbon-credit
                    lifecycle.
                  </p>

                  <div className="mt-7 rounded-2xl border border-[#d8e0d9] bg-[#fbfcfa] p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#53715a]">
                      Core idea
                    </p>

                    <p className="mt-3 text-lg font-semibold leading-7 text-[#172018]">
                      Measure → Verify → Issue → Trade → Retire
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[#657064]">
                      Every major stage is represented within a connected
                      application workflow with role-specific responsibilities.
                    </p>
                  </div>
                </div>


                {/* Solution description */}
                <div className="rounded-3xl border border-[#d8e0d9] bg-[#fbfcfa] p-6 sm:p-8">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4d8b55] text-lg font-bold text-white shadow-sm">
                      ✓
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        A Unified Carbon-Credit Lifecycle
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-[#657064]">
                        Verdiq provides a single digital environment where
                        different stakeholders perform their respective
                        responsibilities through controlled workflows.
                        Developers manage projects, auditors verify submitted
                        evidence, administrators issue approved credits,
                        and buyers discover, purchase, manage, and retire
                        credits.
                      </p>

                      <p className="mt-4 text-sm leading-6 text-[#657064]">
                        In parallel, the footprint calculator allows buyers
                        to understand their emissions and maintain footprint
                        reports, creating a stronger connection between
                        measurement and carbon-offset actions.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </section>


            {/* ================= HOW THE SOLUTION WORKS ================= */}
            <section className="border-t border-[#dce3d8] bg-[#fbfcfa] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">

              <div className="max-w-3xl">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                  Solution Workflow
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  How Verdiq Solves the Problem
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#657064]">
                  The platform divides the complete workflow into controlled
                  stages, with each stage handled by the role responsible
                  for that operation.
                </p>

              </div>


              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {solutionSteps.map((step) => (
                  <article
                    key={step.number}
                    className="rounded-2xl border border-[#d8e0d9] bg-white p-6 shadow-[0_6px_20px_rgba(25,45,30,0.04)]"
                  >
                    <div className="flex items-center justify-between">

                      <span className="text-2xl font-semibold tracking-tight text-[#d5ddd5]">
                        {step.number}
                      </span>

                      <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />

                    </div>

                    <h3 className="mt-5 text-base font-semibold">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#657064]">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>

            </section>


            {/* ================= ROLE RESPONSIBILITIES ================= */}
            <section className="border-t border-[#dce3d8] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">

              <div className="max-w-3xl">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                  Role-Based Solution
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  One Platform, Multiple Responsibilities
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#657064]">
                  Verdiq separates responsibilities by role so that project
                  creation, verification, credit issuance, and buyer
                  operations follow defined access boundaries.
                </p>

              </div>


              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-[#bfd5eb] bg-[#f5f9fd] p-6">
                  <div className="h-9 w-9 rounded-xl bg-[#2e73b7]" />
                  <h3 className="mt-5 text-base font-semibold">
                    Developer
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#657064]">
                    Creates projects, uploads evidence, submits projects,
                    views issued credits, and lists eligible credits for sale.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#ead9a8] bg-[#fffaf0] p-6">
                  <div className="h-9 w-9 rounded-xl bg-[#d79a16]" />
                  <h3 className="mt-5 text-base font-semibold">
                    Auditor
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#657064]">
                    Reviews project details and evidence and decides whether
                    a project should be approved or rejected.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#d9c9e9] bg-[#f8f4fb] p-6">
                  <div className="h-9 w-9 rounded-xl bg-[#7b55a4]" />
                  <h3 className="mt-5 text-base font-semibold">
                    Administrator
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#657064]">
                    Manages administrative operations and issues credits for
                    projects that have passed verification.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#c7dfca] bg-[#f3faf4] p-6">
                  <div className="h-9 w-9 rounded-xl bg-[#3b8646]" />
                  <h3 className="mt-5 text-base font-semibold">
                    Buyer
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#657064]">
                    Calculates footprint, saves reports, purchases credits,
                    manages holdings, retires credits, and accesses
                    certificates.
                  </p>
                </div>

              </div>

            </section>


            {/* ================= EXPECTED OUTCOME ================= */}
            <section className="border-t border-[#dce3d8] bg-[#172018] px-6 py-10 text-white sm:px-8 lg:px-10 lg:py-14">

              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

                <div className="max-w-3xl">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9c9ae]">
                    Expected Outcome
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                    From fragmented activities to a connected carbon workflow
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-[#c3ccc4]">
                    Verdiq brings carbon measurement, project verification,
                    controlled credit issuance, marketplace transactions,
                    portfolio management, and retirement into one coherent
                    platform. The result is a more structured and
                    understandable lifecycle for the stakeholders using the
                    system.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a9c9ae]">
                    Lifecycle
                  </p>

                  <p className="mt-2 whitespace-nowrap text-lg font-semibold">
                    Measure → Verify → Issue → Trade → Retire
                  </p>
                </div>

              </div>

            </section>


            {/* ================= NOTE ================= */}
            <div className="border-t border-[#dce3d8] bg-white px-6 py-5 sm:px-8 lg:px-10">
              <p className="text-xs leading-6 text-[#657064]">
                Verdiq is designed as a structured application platform for
                carbon-impact management. The proposed solution focuses on
                the workflows implemented within the project and does not
                claim independent certification, regulatory verification, or
                real-world validation of carbon credits beyond the platform's
                defined verification workflow.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default VerdiqProblemSolution;