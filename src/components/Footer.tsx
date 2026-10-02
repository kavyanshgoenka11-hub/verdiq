import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-16 border-t border-[#dce3d8] bg-[#172018] text-white">
      <div className="mx-auto max-w-7xl px-8 py-12 lg:px-16">

        {/* ================= FOOTER CONTENT ================= */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ================= BRAND ================= */}
          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-2xl font-semibold tracking-tight transition hover:text-[#b8d4b9]"
            >
              verdiq
            </button>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#bcc7b9]">
              Transparent climate infrastructure for measuring,
              verifying, trading, and proving environmental impact.
            </p>

            <p className="mt-6 text-xs leading-5 text-[#7f8d80]">
              Measure. Verify. Make an Impact.
            </p>
          </div>


          {/* ================= PLATFORM ================= */}
          <div>
            <p className="text-sm font-semibold">
              Platform
            </p>

            <div className="mt-4 space-y-2.5">

              <button
                type="button"
                onClick={() => navigate("/marketplace")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Marketplace
              </button>

              <button
                type="button"
                onClick={() => navigate("/calculator")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Carbon Calculator
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Create account
              </button>

            </div>
          </div>


          {/* ================= PROJECT ================= */}
          <div>
            <p className="text-sm font-semibold">
              Project
            </p>

            <div className="mt-4 space-y-2.5">

              <button
                type="button"
                onClick={() => navigate("/problem-solution")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Problem & Solution
              </button>

              <button
                type="button"
                onClick={() => navigate("/requirements")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Requirements
              </button>

              <button
                type="button"
                onClick={() => navigate("/documentation")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Documentation
              </button>

              <button
                type="button"
                onClick={() => navigate("/about")}
                className="block text-sm text-[#bcc7b9] transition hover:text-white"
              >
                About Verdiq
              </button>

            </div>
          </div>


          {/* ================= DIAGRAMS ================= */}
          <div>
            <p className="text-sm font-semibold">
              Diagrams
            </p>

            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5">

              <button
                type="button"
                onClick={() => navigate("/use-case")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Use Case
              </button>

              <button
                type="button"
                onClick={() => navigate("/activity-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Activity
              </button>

              <button
                type="button"
                onClick={() => navigate("/class-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Class
              </button>

              <button
                type="button"
                onClick={() => navigate("/state-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                State
              </button>

              <button
                type="button"
                onClick={() => navigate("/sequence-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Sequence
              </button>

              <button
                type="button"
                onClick={() => navigate("/collaboration-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Collaboration
              </button>

              <button
                type="button"
                onClick={() => navigate("/component-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                Component
              </button>

              <button
                type="button"
                onClick={() => navigate("/cfd-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                CFD
              </button>

              <button
                type="button"
                onClick={() => navigate("/dfd-diagram")}
                className="text-left text-sm text-[#bcc7b9] transition hover:text-white"
              >
                DFD
              </button>

            </div>
          </div>

        </div>


        {/* ================= EXTERNAL RESOURCES ================= */}
        <div className="mt-10 border-t border-[#354137] pt-8">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-sm font-semibold">
                Resources
              </p>

              <div className="mt-4 space-y-2.5">

                <a
                  href="https://www.india.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-[#bcc7b9] transition hover:text-white"
                >
                  Government Resources
                </a>

                <a
                  href="https://moef.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-[#bcc7b9] transition hover:text-white"
                >
                  Environmental Policy
                </a>

              </div>
            </div>

          </div>
        </div>


        {/* ================= BOTTOM BAR ================= */}
        {/* ================= BOTTOM BAR ================= */}
<div className="mt-8 flex flex-col gap-3 border-t border-[#354137] pt-5 sm:flex-row sm:items-center sm:justify-between">

  <p className="text-xs text-[#8f9d90]">
    © {new Date().getFullYear()} Verdiq. All rights reserved.
  </p>

  <p className="text-xs text-[#8f9d90]">
    Designed & developed by{" "}
    <span className="font-medium text-[#b8d4b9]">
      Kavyansh Goenka
    </span>
  </p>

</div>

      </div>
    </footer>
  );
}

export default Footer;