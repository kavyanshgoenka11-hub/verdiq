import React from "react";

export const VerdiqSequenceDiagram: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ======================================================
          PAGE INTRO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">

        <div className="max-w-4xl">

          {/* Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">

            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />

            UML · Sequence Diagram

          </div>


          {/* Title */}
          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">

            Verdiq

            <span className="text-[#4d8b55]">
              {" "}Sequence Diagram
            </span>

          </h1>


          {/* Description */}
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            An end-to-end interaction flow showing how the Developer,
            Auditor, Administrator, Buyer, Verdiq platform, and database
            interact throughout the carbon credit lifecycle.
          </p>

        </div>

      </section>


      {/* ======================================================
          SEQUENCE DIAGRAM DISPLAY
      ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

          <div className="overflow-x-auto pb-4">

            <div className="min-w-[1200px]">

              <div className="overflow-hidden rounded-2xl border border-[#bcc8be] bg-white shadow-[0_16px_50px_rgba(25,45,30,0.10)]">

                {/* ==================================================
                    DIAGRAM HEADER
                ================================================== */}

                <div className="border-b border-[#ccd5cd] bg-white px-8 py-7">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                    Formal interaction sequence model
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    Verdiq — Sequence Diagram
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#657064]">
                    This sequence illustrates the chronological interaction
                    between system participants during project verification,
                    credit issuance, marketplace purchase, retirement, and
                    certificate generation.
                  </p>

                </div>


                {/* ==================================================
                    SEQUENCE IMAGE
                ================================================== */}

                <div className="bg-[#fbfcfa] p-5 sm:p-8 lg:p-10">

                  <div className="overflow-hidden rounded-2xl border border-[#d5ddd6] bg-white shadow-[0_8px_24px_rgba(25,45,30,0.06)]">

                    <img
                      src="/SequenceDiagram.png"
                      alt="Verdiq Sequence Diagram"
                      className="block h-auto w-full object-contain"
                    />

                  </div>

                </div>


                {/* ==================================================
                    SUPPORTING INFORMATION
                ================================================== */}

                <div className="border-t border-[#dbe2dc] bg-[#fbfcfa] px-8 py-7">

                  <div className="grid gap-6 md:grid-cols-3">

                    {/* Participants */}
                    <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">

                      <p className="text-sm font-semibold text-[#35653c]">
                        Participants
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#657064]">
                        Developer, Auditor, Administrator, Buyer, Verdiq
                        Platform, and MySQL Database participate in the
                        application workflow.
                      </p>

                    </div>


                    {/* Verification */}
                    <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">

                      <p className="text-sm font-semibold text-[#35653c]">
                        Verification & Issuance
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#657064]">
                        Projects are submitted by developers, reviewed by
                        auditors, and approved projects proceed to
                        administrator-controlled credit issuance.
                      </p>

                    </div>


                    {/* Buyer lifecycle */}
                    <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">

                      <p className="text-sm font-semibold text-[#35653c]">
                        Buyer Lifecycle
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#657064]">
                        Buyers browse listed credits, complete purchases,
                        receive credits in their portfolio, retire them,
                        and receive the resulting retirement certificate.
                      </p>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    NOTE
                ================================================== */}

                <div className="border-t border-[#dce3d8] bg-white px-8 py-5">

                  <p className="text-xs leading-6 text-[#657064]">
                    The sequence diagram focuses on the principal interactions
                    implemented by the Verdiq application and abstracts
                    lower-level internal API and database operations where
                    they do not change the participant-level interaction flow.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default VerdiqSequenceDiagram;