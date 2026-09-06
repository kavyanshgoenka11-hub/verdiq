import React from "react";

export const VerdiqComponetDiagram: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ================= PAGE INTRO ================= */}
      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">
        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            UML · Component Diagram
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            Verdiq
            <span className="text-[#4d8b55]"> Component Diagram</span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            A structural view of the Verdiq software architecture showing
            how the frontend, backend services, application modules, and
            MySQL database work together to support the carbon-credit
            lifecycle.
          </p>

        </div>
      </section>


      {/* ================= DIAGRAM SECTION ================= */}
      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

          <div className="overflow-hidden rounded-2xl border border-[#bcc8be] bg-white shadow-[0_16px_50px_rgba(25,45,30,0.10)]">

            {/* ================= DIAGRAM HEADER ================= */}
            <div className="border-b border-[#ccd5cd] bg-white px-8 py-7">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                Formal UML component model
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Verdiq — Component Diagram
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#657064]">
                The component diagram presents the major software components
                of the Verdiq platform and the dependencies between the
                client interface, application backend, business modules,
                authentication layer, and persistent database.
              </p>

            </div>


            {/* ================= COMPONENT DIAGRAM IMAGE ================= */}
            <div className="bg-[#fbfcfa] p-5 sm:p-8 lg:p-10">
              <div className="overflow-x-auto pb-2">

                <div className="flex min-w-[1100px] justify-center">
                  <div className="overflow-hidden rounded-2xl border border-[#d5ddd6] bg-white shadow-[0_8px_24px_rgba(25,45,30,0.06)]">
                    <img
                      src="/ComponetDiagram.png"
                      alt="Verdiq Component Diagram"
                      className="block h-auto max-w-full object-contain"
                    />
                  </div>
                </div>

              </div>
            </div>


            {/* ================= SUPPORTING INFORMATION ================= */}
            <div className="border-t border-[#dbe2dc] bg-[#fbfcfa] px-8 py-7">
              <div className="grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Frontend & Backend
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    The React and TypeScript frontend communicates with the
                    Express.js backend API, which coordinates the platform's
                    application logic and protected operations.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Core Application Modules
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    The backend supports authentication and role
                    authorization, developer projects, auditor verification,
                    administrator credit issuance, marketplace operations,
                    buyer footprint reporting, portfolio management,
                    retirement, and certificates.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Database Layer
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    MySQL provides persistent storage for users, projects,
                    documents and metadata, audits, credits, marketplace
                    listings, purchases, footprint reports, retirements,
                    and certificates.
                  </p>
                </div>

              </div>
            </div>


            {/* ================= NOTE ================= */}
            <div className="border-t border-[#dce3d8] bg-white px-8 py-5">
              <p className="text-xs leading-6 text-[#657064]">
                The component diagram focuses on the major software
                components and their dependencies. It does not introduce
                external services such as Gmail notifications, blockchain,
                cloud object storage, or third-party payment infrastructure
                that are not part of the Verdiq implementation.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default VerdiqComponetDiagram;