import React from "react";

export const VerdiqCFDDiagram: React.FC = () => {
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

            Project Management · Cumulative Flow Diagram

          </div>


          {/* Title */}
          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">

            Verdiq

            <span className="text-[#4d8b55]">
              {" "}Cumulative Flow Diagram
            </span>

          </h1>


          {/* Description */}
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            A visual representation of project work progressing through the
            major stages of the Verdiq carbon credit lifecycle, from project
            creation and verification to credit issuance, listing, purchase,
            and retirement.
          </p>

        </div>

      </section>


      {/* ======================================================
          CFD DISPLAY
      ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

          <div className="overflow-x-auto pb-4">

            <div className="min-w-[1100px]">

              <div className="overflow-hidden rounded-2xl border border-[#bcc8be] bg-white shadow-[0_16px_50px_rgba(25,45,30,0.10)]">


                {/* ==================================================
                    DIAGRAM HEADER
                ================================================== */}

                <div className="border-b border-[#ccd5cd] bg-white px-8 py-7">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                    Formal cumulative flow model
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    Verdiq — Cumulative Flow Diagram
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#657064]">
                    The diagram shows how work items accumulate and move
                    through the major stages of the Verdiq project lifecycle.
                  </p>

                </div>


                {/* ==================================================
                    CFD IMAGE
                ================================================== */}

                <div className="bg-[#fbfcfa] p-5 sm:p-8 lg:p-10">

                  <div className="overflow-hidden rounded-2xl border border-[#d5ddd6] bg-white shadow-[0_8px_24px_rgba(25,45,30,0.06)]">

                    <img
                      src="/CFD.png"
                      alt="Verdiq Cumulative Flow Diagram"
                      className="block h-auto w-full object-contain"
                    />

                  </div>

                </div>


                {/* ==================================================
                    SUPPORTING INFORMATION
                ================================================== */}

                <div className="border-t border-[#dbe2dc] bg-[#fbfcfa] px-8 py-7">

                  <div className="grid gap-6 md:grid-cols-3">


                    {/* Work stages */}
                    <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">

                      <p className="text-sm font-semibold text-[#35653c]">
                        Work Stages
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#657064]">
                        Project Created, Under Review, Changes / Rejected,
                        Verified, Credits Issued, Listed, Purchased, and
                        Retired represent the major lifecycle stages.
                      </p>

                    </div>


                    {/* Flow interpretation */}
                    <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">

                      <p className="text-sm font-semibold text-[#35653c]">
                        Flow Interpretation
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#657064]">
                        Increasing band thickness indicates accumulation of
                        work within a lifecycle stage, while movement between
                        bands represents progress through the platform.
                      </p>

                    </div>


                    {/* Purpose */}
                    <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">

                      <p className="text-sm font-semibold text-[#35653c]">
                        Purpose
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#657064]">
                        The CFD provides a high-level view of workflow
                        progression and helps identify where work is
                        accumulating within the Verdiq lifecycle.
                      </p>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    NOTE
                ================================================== */}

                <div className="border-t border-[#dce3d8] bg-white px-8 py-5">

                  <p className="text-xs leading-6 text-[#657064]">
                    Note: the displayed CFD should be interpreted according
                    to the data and stages represented in the accompanying
                    diagram. It should not be treated as live production
                    metrics unless the underlying chart is generated from
                    recorded Verdiq project-history data.
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

export default VerdiqCFDDiagram;