import React from "react";

interface Requirement {
  id: string;
  title: string;
  description: string;
}

const functionalRequirements: Requirement[] = [
  {
    id: "FR-01",
    title: "User Registration & Authentication",
    description:
      "The system shall allow buyers and developers to register and authenticate using their credentials. Protected operations shall require a valid authenticated session.",
  },
  {
    id: "FR-02",
    title: "Role-Based Access Control",
    description:
      "The system shall distinguish between Buyer, Developer, Auditor, and Administrator roles and provide access to functionality according to the user's assigned role.",
  },
  {
    id: "FR-03",
    title: "Project Creation",
    description:
      "The system shall allow developers to create carbon-credit projects by submitting project information such as title, description, project type, location, and related details.",
  },
  {
    id: "FR-04",
    title: "Project Evidence Upload",
    description:
      "The system shall allow developers to upload project-related supporting documents and associate those documents with the corresponding project.",
  },
  {
    id: "FR-05",
    title: "Project Submission",
    description:
      "The system shall allow developers to submit completed projects for verification after entering the required project information and supporting evidence.",
  },
  {
    id: "FR-06",
    title: "Project Verification",
    description:
      "The system shall provide auditors with a queue of submitted projects and allow them to review project information and supporting evidence.",
  },
  {
    id: "FR-07",
    title: "Approval & Rejection",
    description:
      "The system shall allow an auditor to approve or reject a project. Rejected projects shall provide feedback that can be used by the developer before resubmission.",
  },
  {
    id: "FR-08",
    title: "Credit Issuance",
    description:
      "The system shall allow an administrator to issue carbon credits for approved projects using the issuance quantity approved during verification.",
  },
  {
    id: "FR-09",
    title: "Credit Listing",
    description:
      "The system shall allow developers holding issued credits to list available credits in the marketplace with a price and available quantity.",
  },
  {
    id: "FR-10",
    title: "Marketplace Browsing",
    description:
      "The system shall allow buyers and public users to browse verified project information and available carbon-credit marketplace listings.",
  },
  {
    id: "FR-11",
    title: "Credit Purchase",
    description:
      "The system shall allow authenticated buyers to purchase available carbon credits and update the associated marketplace and credit inventory.",
  },
  {
    id: "FR-12",
    title: "Carbon Footprint Calculation",
    description:
      "The system shall provide a carbon footprint calculator that allows users to enter emissions-related inputs and calculate a resulting footprint.",
  },
  {
    id: "FR-13",
    title: "Footprint Report Management",
    description:
      "The system shall allow authenticated buyers to save and finalize their calculated footprint reports for later reference.",
  },
  {
    id: "FR-14",
    title: "Portfolio Management",
    description:
      "The system shall allow buyers to view the carbon credits acquired through completed purchases and monitor their portfolio holdings.",
  },
  {
    id: "FR-15",
    title: "Credit Retirement",
    description:
      "The system shall allow buyers to retire eligible carbon credits from their portfolio and record the retirement quantity, reason, and related transaction.",
  },
  {
    id: "FR-16",
    title: "Certificate Generation",
    description:
      "The system shall generate and provide access to a retirement certificate associated with a completed credit retirement.",
  },
  {
    id: "FR-17",
    title: "Public Platform Information",
    description:
      "The system shall provide public access to platform overview information, verified projects, marketplace listings, climate information, and emissions-related public statistics.",
  },
];

const nonFunctionalRequirements: Requirement[] = [
  {
    id: "NFR-01",
    title: "Security",
    description:
      "Authentication and authorization shall protect role-specific operations. Passwords shall not be stored as plain text, and protected API endpoints shall validate authenticated access.",
  },
  {
    id: "NFR-02",
    title: "Data Integrity",
    description:
      "Transactions involving purchases, credit inventory, and related records shall maintain consistent database state and prevent invalid inventory updates.",
  },
  {
    id: "NFR-03",
    title: "Reliability",
    description:
      "The application shall handle invalid requests, authorization failures, and operational errors without causing the complete application to fail.",
  },
  {
    id: "NFR-04",
    title: "Performance",
    description:
      "Common user operations such as authentication, project retrieval, marketplace browsing, portfolio viewing, and report retrieval should respond efficiently under normal system load.",
  },
  {
    id: "NFR-05",
    title: "Scalability",
    description:
      "The architecture should support growth in users, projects, carbon credits, marketplace transactions, and footprint records without requiring a complete redesign of the application.",
  },
  {
    id: "NFR-06",
    title: "Maintainability",
    description:
      "The frontend and backend should remain modular so that authentication, project management, verification, marketplace, footprint, and retirement functionality can be maintained independently.",
  },
  {
    id: "NFR-07",
    title: "Usability",
    description:
      "The user interface should present workflows clearly, provide understandable feedback, and make role-specific actions easy to discover and complete.",
  },
  {
    id: "NFR-08",
    title: "Responsiveness",
    description:
      "The user interface should adapt to different screen sizes and remain usable on desktop and smaller viewport dimensions.",
  },
  {
    id: "NFR-09",
    title: "Availability of Public Features",
    description:
      "Public information and the footprint calculation experience should remain accessible without requiring authentication, while protected data-management operations require authentication.",
  },
  {
    id: "NFR-10",
    title: "Consistency",
    description:
      "The platform should maintain consistent terminology, navigation patterns, visual hierarchy, validation behavior, and feedback across different user roles and workflows.",
  },
  {
    id: "NFR-11",
    title: "Database Persistence",
    description:
      "Core application data shall be persistently stored so that users, projects, audits, credits, listings, purchases, reports, retirements, and certificates can be retrieved across sessions.",
  },
  {
    id: "NFR-12",
    title: "Error Handling",
    description:
      "The system should provide meaningful error responses and user-facing feedback for invalid input, unauthorized access, failed operations, and unavailable resources.",
  },
];

const RequirementCard: React.FC<{
  requirement: Requirement;
  type: "functional" | "non-functional";
}> = ({ requirement, type }) => {
  const isFunctional = type === "functional";

  return (
    <article className="group rounded-2xl border border-[#d8e0d9] bg-white p-6 shadow-[0_6px_20px_rgba(25,45,30,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(25,45,30,0.08)]">
      <div className="flex items-start gap-4">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
            isFunctional
              ? "bg-[#eef5eb] text-[#35653c]"
              : "bg-[#f5f1e9] text-[#826b3c]"
          }`}
        >
          {isFunctional ? "F" : "N"}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                isFunctional ? "text-[#53715a]" : "text-[#826b3c]"
              }`}
            >
              {requirement.id}
            </span>

            <span className="h-1 w-1 rounded-full bg-[#b8c2b8]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#879087]">
              Requirement
            </span>
          </div>

          <h3 className="mt-2 text-base font-semibold text-[#172018]">
            {requirement.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#657064]">
            {requirement.description}
          </p>
        </div>

      </div>
    </article>
  );
};

const RequirementsSection: React.FC<{
  title: string;
  description: string;
  requirements: Requirement[];
  type: "functional" | "non-functional";
}> = ({ title, description, requirements, type }) => {
  const isFunctional = type === "functional";

  return (
    <section className="border-t border-[#dce3d8]">
      <div className="px-6 py-10 sm:px-8 lg:px-10 lg:py-12">

        <div className="max-w-3xl">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              isFunctional
                ? "border border-[#c6d5c3] bg-[#eef5eb] text-[#37643d]"
                : "border border-[#e2d7bd] bg-[#faf6eb] text-[#806a3d]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isFunctional ? "bg-[#4d8b55]" : "bg-[#b28b43]"
              }`}
            />

            {isFunctional
              ? "What the system does"
              : "How the system should perform"}
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#172018]">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#657064]">
            {description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {requirements.map((requirement) => (
            <RequirementCard
              key={requirement.id}
              requirement={requirement}
              type={type}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export const VerdiqRequirements: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ================= PAGE INTRO ================= */}
      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">
        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            Software Requirements
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            Verdiq
            <span className="text-[#4d8b55]"> Requirements</span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            A structured specification of the functional capabilities and
            quality attributes of the Verdiq Carbon Impact Platform,
            covering its users, carbon-credit lifecycle, footprint
            reporting, marketplace, verification, and certificate workflows.
          </p>

        </div>
      </section>


      {/* ================= REQUIREMENTS DOCUMENT ================= */}
      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

          <div className="overflow-hidden rounded-3xl border border-[#bcc8be] bg-white shadow-[0_16px_50px_rgba(25,45,30,0.10)]">

            {/* ================= DOCUMENT HEADER ================= */}
            <div className="bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-9">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                    System specification
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    Verdiq — Functional & Non-Functional Requirements
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#657064]">
                    Functional requirements define the capabilities provided
                    by the platform, while non-functional requirements define
                    the expected security, usability, reliability,
                    performance, maintainability, and data characteristics.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-[#d8e0d9] bg-[#fbfcfa] px-4 py-3 text-center">
                    <p className="text-2xl font-semibold text-[#35653c]">
                      {functionalRequirements.length}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b857b]">
                      Functional
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e2d7bd] bg-[#faf8f1] px-4 py-3 text-center">
                    <p className="text-2xl font-semibold text-[#826b3c]">
                      {nonFunctionalRequirements.length}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b857b]">
                      Non-functional
                    </p>
                  </div>
                </div>

              </div>
            </div>


            {/* ================= FUNCTIONAL REQUIREMENTS ================= */}
            <RequirementsSection
              title="Functional Requirements"
              description="These requirements describe the observable capabilities and operations that Verdiq provides to its users."
              requirements={functionalRequirements}
              type="functional"
            />


            {/* ================= NON-FUNCTIONAL REQUIREMENTS ================= */}
            <RequirementsSection
              title="Non-Functional Requirements"
              description="These requirements describe the quality, security, reliability, usability, and operational characteristics expected from the Verdiq platform."
              requirements={nonFunctionalRequirements}
              type="non-functional"
            />


            {/* ================= REQUIREMENT SUMMARY ================= */}
            <section className="border-t border-[#dce3d8] bg-[#fbfcfa] px-6 py-10 sm:px-8 lg:px-10">

              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                  Requirement Coverage
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  End-to-end platform coverage
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#657064]">
                  Together, these requirements cover the major Verdiq
                  workflows from user access and project creation through
                  verification, credit issuance, marketplace transactions,
                  footprint reporting, portfolio management, retirement,
                  and certificate generation.
                </p>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Project Lifecycle
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    Create → upload evidence → submit → audit → approve or
                    reject → resubmit when required.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Credit Lifecycle
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    Issue → list → purchase → hold in portfolio → retire.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Footprint Lifecycle
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    Calculate → save report → finalize → review historical
                    footprint records.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Retirement Lifecycle
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    Select eligible holdings → retire credits → generate and
                    access the retirement certificate.
                  </p>
                </div>

              </div>
            </section>


            {/* ================= NOTE ================= */}
            <div className="border-t border-[#dce3d8] bg-white px-6 py-5 sm:px-8 lg:px-10">
              <p className="text-xs leading-6 text-[#657064]">
                The requirements presented here describe the implemented
                Verdiq platform at a system level. Quantitative service-level
                targets such as exact response-time limits, concurrent-user
                capacity, or uptime percentages are not specified because
                corresponding measurements or acceptance thresholds have not
                been established.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default VerdiqRequirements;