import React from "react";

export const VerdiqStateDiagram: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ================= PAGE INTRO ================= */}
      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">
        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            UML · State Diagram
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            Verdiq
            <span className="text-[#4d8b55]"> State Diagram</span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            A behavioral view of the Verdiq platform showing how users move
            through authentication, role-based access, platform dashboards,
            and the major application states.
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
                Formal UML behavioral model
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Verdiq — State Diagram
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#657064]">
                The state diagram represents the major states and transitions
                of a user within the Verdiq application, including public
                access, authentication, role verification, dashboards,
                access denial, and sign-out behavior.
              </p>

            </div>


            {/* ================= STATE DIAGRAM IMAGE ================= */}
            <div className="bg-[#fbfcfa] p-5 sm:p-8 lg:p-10">
              <div className="overflow-x-auto pb-2">

                <div className="flex min-w-[1100px] justify-center">
                  <div className="overflow-hidden rounded-2xl border border-[#d5ddd6] bg-white shadow-[0_8px_24px_rgba(25,45,30,0.06)]">
                    <img
                      src="/StateDiagram.png"
                      alt="Verdiq State Diagram"
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
                    Public States
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    Users can access the public platform and use the
                    calculator before authentication. Saving protected
                    information requires the appropriate account.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Authentication & Role Check
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    After authentication, the platform determines the
                    user's role and routes the user to the corresponding
                    dashboard or denies access when the role is not
                    authorized.
                  </p>
                </div>


                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Role-Based Dashboards
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    Developer, Auditor, Buyer, and Administrator users
                    transition into their respective application areas
                    based on their assigned role.
                  </p>
                </div>

              </div>
            </div>


            {/* ================= NOTE ================= */}
            <div className="border-t border-[#dce3d8] bg-white px-8 py-5">
              <p className="text-xs leading-6 text-[#657064]">
                The diagram focuses on the principal application states and
                user-facing transitions rather than representing every
                individual page or internal API operation.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default VerdiqStateDiagram;