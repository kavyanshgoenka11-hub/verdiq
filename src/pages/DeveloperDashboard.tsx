import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

type DeveloperProject = {
  id: number;
  name: string;
  project_type: string;
  location: string;
  description: string | null;
  expected_credits: number;
  status: string;
  submitted_at: string | null;
  created_at: string;
};

type DeveloperCredit = {
  id: number;
  project_id: number;
  serial_number: string;
  quantity: number;
  available_quantity: number;
  retired_quantity: number;
  price_per_credit: number;
  status: string;
  issued_at: string;

  project_name: string;
  project_type: string;
  location: string;
};

function DeveloperDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<
    DeveloperProject[]
  >([]);

  const [credits, setCredits] = useState<
    DeveloperCredit[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser =
    localStorage.getItem("verdiq_user");

  let user: {
    id?: number;
    name?: string;
    organization?: string | null;
    email?: string;
    role?: string;
  } | null = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    const token =
      localStorage.getItem("verdiq_token");

    if (!token || user?.role !== "developer") {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const loadDeveloperData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          projectsResponse,
          creditsResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/developer/projects`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),

          fetch(
            `${API_BASE_URL}/api/developer/credits`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ]);

        const projectsData =
          await projectsResponse.json();

        const creditsData =
          await creditsResponse.json();

        if (!projectsResponse.ok) {
          throw new Error(
            projectsData.error ||
              "Failed to load developer projects.",
          );
        }

        if (!creditsResponse.ok) {
          throw new Error(
            creditsData.error ||
              "Failed to load developer credits.",
          );
        }

        setProjects(
          Array.isArray(projectsData.projects)
            ? projectsData.projects
            : [],
        );

        setCredits(
          Array.isArray(creditsData.credits)
            ? creditsData.credits.map(
                (credit: any) => ({
                  id: Number(credit.id),
                  project_id: Number(
                    credit.project_id,
                  ),
                  serial_number:
                    credit.serial_number,
                  quantity: Number(
                    credit.quantity ?? 0,
                  ),
                  available_quantity:
                    Number(
                      credit.available_quantity ??
                        0,
                    ),
                  retired_quantity:
                    Number(
                      credit.retired_quantity ??
                        0,
                    ),
                  price_per_credit:
                    Number(
                      credit.price_per_credit ??
                        0,
                    ),
                  status: credit.status,
                  issued_at: credit.issued_at,
                  project_name:
                    credit.project_name,
                  project_type:
                    credit.project_type,
                  location:
                    credit.location,
                }),
              )
            : [],
        );
      } catch (err) {
        console.error(
          "Developer dashboard error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load developer dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDeveloperData();
  }, [navigate, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", {
      replace: true,
    });
  };

  /* ============================================================
     PROJECT METRICS
     ============================================================ */

  const totalProjects =
    projects.length;

  const pendingVerification =
    projects.filter(
      (project) =>
        project.status === "under_review",
    ).length;

  const verifiedProjects =
    projects.filter(
      (project) =>
        project.status === "verified",
    ).length;

  /* ============================================================
     CREDIT METRICS
     ============================================================ */

  const totalCreditsIssued =
    credits.reduce(
      (sum, credit) =>
        sum + Number(credit.quantity),
      0,
    );

  const totalCreditsAvailable =
    credits.reduce(
      (sum, credit) =>
        sum +
        Number(
          credit.available_quantity,
        ),
      0,
    );

  const totalCreditsRetired =
    credits.reduce(
      (sum, credit) =>
        sum +
        Number(
          credit.retired_quantity,
        ),
      0,
    );

  const listedCreditBatches =
    credits.filter(
      (credit) =>
        credit.status === "listed",
    ).length;

  /* ============================================================
     RECENT DATA
     ============================================================ */

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(
          b.created_at,
        ).getTime() -
        new Date(
          a.created_at,
        ).getTime(),
    )
    .slice(0, 4);

  const recentCredits = [...credits]
    .sort(
      (a, b) =>
        new Date(
          b.issued_at,
        ).getTime() -
        new Date(
          a.issued_at,
        ).getTime(),
    )
    .slice(0, 3);

  const getProjectStatusLabel = (
    status: string,
  ) => {
    switch (status) {
      case "draft":
        return "Draft";

      case "under_review":
        return "Under review";

      case "verified":
        return "Verified";

      case "rejected":
        return "Rejected";

      default:
        return status;
    }
  };

  const getProjectStatusClass = (
    status: string,
  ) => {
    switch (status) {
      case "verified":
        return "bg-[#edf5ea] text-[#37643d]";

      case "under_review":
        return "bg-[#fff7e6] text-[#856404]";

      case "rejected":
        return "bg-[#fff2f2] text-[#8a3d3d]";

      default:
        return "bg-[#fbfcfa] text-[#657064]";
    }
  };

  const getCreditStatusClass = (
    status: string,
  ) => {
    switch (status) {
      case "listed":
        return "bg-[#edf5ea] text-[#37643d]";

      case "issued":
        return "bg-[#eef2ea] text-[#52604f]";

      case "partially_sold":
        return "bg-[#fff7e6] text-[#856404]";

      default:
        return "bg-[#fbfcfa] text-[#657064]";
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <nav className="sticky top-0 z-50 border-b border-[#dce3d8] bg-[#f6f8f3]/95 px-8 py-5 backdrop-blur lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-2xl font-semibold tracking-tight"
            >
              verdiq
            </button>

            <p className="text-xs text-[#657064]">
              Project Developer Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/developer/projects",
                )
              }
              className="hidden rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea] md:block"
            >
              My Projects
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/developer/credits",
                )
              }
              className="hidden rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea] sm:block"
            >
              Credit Inventory
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
            >
              Sign out
            </button>

          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="max-w-4xl">

          <p className="text-sm text-[#657064]">
            Project developer workspace
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {user?.organization ||
              user?.name ||
              "Project Developer"}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#657064]">
            Register environmental projects, submit supporting
            evidence, follow verification, and manage issued carbon
            credits from one place.
          </p>

        </div>

        {/* ====================================================== */}
        {/* ERROR */}
        {/* ====================================================== */}

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {/* ====================================================== */}
        {/* PROJECT OPERATIONS — PRIMARY DARK SECTION */}
        {/* ====================================================== */}

        <section className="mt-10 overflow-hidden rounded-[2rem] bg-[#172018] text-white shadow-[0_20px_60px_rgba(23,32,24,0.14)]">

          <div className="p-8 sm:p-10">

            <div className="max-w-3xl">

              <p className="text-sm text-[#9fc79a]">
                Project operations
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Manage your climate projects
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#bcc7b9]">
                Move projects from registration through verification
                and into the carbon marketplace.
              </p>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              {/* Register project */}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/developer/projects/new",
                  )
                }
                className="group rounded-3xl border border-[#344036] bg-[#202b21] p-6 text-left transition duration-200 hover:-translate-y-1 hover:bg-[#263328]"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg text-[#172018]">
                  +
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  Register a project
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#bcc7b9]">
                  Submit a new environmental project and provide the
                  information required for verification.
                </p>

                <p className="mt-5 text-sm font-medium text-[#9fc79a]">
                  Create project →
                </p>

              </button>

              {/* My projects */}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/developer/projects",
                  )
                }
                className="group rounded-3xl border border-[#344036] bg-[#202b21] p-6 text-left transition duration-200 hover:-translate-y-1 hover:bg-[#263328]"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg text-[#172018]">
                  ✓
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  My projects
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#bcc7b9]">
                  Track project status, upload evidence, submit projects,
                  and review verification outcomes.
                </p>

                <p className="mt-5 text-sm font-medium text-[#9fc79a]">
                  Manage projects →
                </p>

              </button>

              {/* Credit inventory */}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/developer/credits",
                  )
                }
                className="group rounded-3xl border border-[#344036] bg-[#202b21] p-6 text-left transition duration-200 hover:-translate-y-1 hover:bg-[#263328]"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg text-[#172018]">
                  ◆
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  Credit inventory
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#bcc7b9]">
                  Monitor issued credits, available inventory, prices,
                  and marketplace listings.
                </p>

                <p className="mt-5 text-sm font-medium text-[#9fc79a]">
                  Manage credits →
                </p>

              </button>

            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* LIVE DATABASE DATA */}
        {/* ====================================================== */}

        <section className="mt-12">

          <div>
            <p className="text-sm text-[#657064]">
              Live database data
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Developer overview
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">

              <p className="text-sm text-[#657064]">
                Projects
              </p>

              <p className="mt-3 text-4xl font-semibold">
                {loading
                  ? "…"
                  : totalProjects}
              </p>

              <p className="mt-2 text-xs text-[#7b8578]">
                Total registered projects
              </p>

            </div>

            <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">

              <p className="text-sm text-[#657064]">
                Pending verification
              </p>

              <p className="mt-3 text-4xl font-semibold">
                {loading
                  ? "…"
                  : pendingVerification}
              </p>

              <p className="mt-2 text-xs text-[#7b8578]">
                Projects under auditor review
              </p>

            </div>

            <div className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm">

              <p className="text-sm text-[#657064]">
                Credits issued
              </p>

              <p className="mt-3 text-4xl font-semibold">
                {loading
                  ? "…"
                  : totalCreditsIssued.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-[#7b8578]">
                Total credits issued to your projects
              </p>

            </div>

            <div className="rounded-3xl border border-[#c9dcc9] bg-[#edf5ea] p-6 shadow-sm">

              <p className="text-sm text-[#52765a]">
                Available credits
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#37643d]">
                {loading
                  ? "…"
                  : totalCreditsAvailable.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-[#52765a]">
                Credits remaining in inventory
              </p>

            </div>

          </div>
        </section>

        {/* ====================================================== */}
        {/* SECONDARY METRICS */}
        {/* ====================================================== */}

        <section className="mt-5 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-6">

            <p className="text-sm text-[#657064]">
              Verified projects
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {loading
                ? "…"
                : verifiedProjects}
            </p>

            <p className="mt-2 text-xs text-[#7b8578]">
              Approved by an auditor
            </p>

          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-6">

            <p className="text-sm text-[#657064]">
              Listed credit batches
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {loading
                ? "…"
                : listedCreditBatches}
            </p>

            <p className="mt-2 text-xs text-[#7b8578]">
              Currently available in marketplace
            </p>

          </div>

          <div className="rounded-3xl border border-[#dce3d8] bg-white p-6">

            <p className="text-sm text-[#657064]">
              Credits retired
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {loading
                ? "…"
                : totalCreditsRetired.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-[#7b8578]">
              No longer available for sale
            </p>

          </div>

        </section>

        {/* ====================================================== */}
        {/* RECENT PROJECTS */}
        {/* ====================================================== */}

        <section className="mt-12">

          <div className="flex items-end justify-between">
            <div>

              <p className="text-sm text-[#657064]">
                Project activity
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Recent projects
              </h2>

            </div>

            {recentProjects.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/developer/projects",
                  )
                }
                className="text-sm font-medium text-[#4d8b55] hover:underline"
              >
                View all →
              </button>
            )}
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-8 text-sm text-[#657064]">
              Loading projects...
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-10 text-center">

              <h3 className="text-xl font-semibold">
                No projects yet
              </h3>

              <p className="mt-2 text-sm text-[#657064]">
                Register your first environmental project to begin
                the verification process.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/developer/projects/new",
                  )
                }
                className="mt-6 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
              >
                Register project →
              </button>

            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {recentProjects.map(
                (project) => (
                  <article
                    key={project.id}
                    className="rounded-3xl border border-[#dce3d8] bg-white p-6"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getProjectStatusClass(
                            project.status,
                          )}`}
                        >
                          {getProjectStatusLabel(
                            project.status,
                          )}
                        </span>

                        <h3 className="mt-4 text-xl font-semibold">
                          {project.name}
                        </h3>

                        <p className="mt-2 text-sm text-[#657064]">
                          {project.project_type} ·{" "}
                          {project.location}
                        </p>

                      </div>

                      <span className="rounded-full bg-[#fbfcfa] px-3 py-1 text-xs text-[#7b8578]">
                        #{project.id}
                      </span>

                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">

                      <div className="rounded-2xl bg-[#fbfcfa] p-4">

                        <p className="text-xs text-[#7b8578]">
                          Expected credits
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          {Number(
                            project.expected_credits,
                          ).toLocaleString()}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#fbfcfa] p-4">

                        <p className="text-xs text-[#7b8578]">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {new Date(
                            project.created_at,
                          ).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>

                      </div>

                    </div>

                  </article>
                ),
              )}

            </div>
          )}
        </section>

        {/* ====================================================== */}
        {/* RECENT CREDIT INVENTORY */}
        {/* ====================================================== */}

        <section className="mt-12">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-sm text-[#657064]">
                Credit activity
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Recent issued batches
              </h2>

            </div>

            {recentCredits.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/developer/credits",
                  )
                }
                className="text-sm font-medium text-[#4d8b55] hover:underline"
              >
                View inventory →
              </button>
            )}

          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-8 text-sm text-[#657064]">
              Loading credit inventory...
            </div>
          ) : recentCredits.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-10 text-center">

              <h3 className="text-xl font-semibold">
                No credits issued yet
              </h3>

              <p className="mt-2 text-sm text-[#657064]">
                Credits will appear here after your verified project
                receives an issuance.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-3">

              {recentCredits.map(
                (credit) => (
                  <div
                    key={credit.id}
                    className="rounded-2xl border border-[#dce3d8] bg-white p-5"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getCreditStatusClass(
                              credit.status,
                            )}`}
                          >
                            {credit.status}
                          </span>

                          <span className="text-xs text-[#7b8578]">
                            Batch #{credit.id}
                          </span>

                        </div>

                        <p className="mt-3 font-semibold">
                          {credit.project_name}
                        </p>

                        <p className="mt-1 break-all font-mono text-xs text-[#7b8578]">
                          {credit.serial_number}
                        </p>

                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">

                        <div>

                          <p className="text-xs text-[#7b8578]">
                            Issued
                          </p>

                          <p className="mt-1 font-semibold">
                            {credit.quantity.toLocaleString()}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-[#7b8578]">
                            Available
                          </p>

                          <p className="mt-1 font-semibold text-[#37643d]">
                            {credit.available_quantity.toLocaleString()}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-[#7b8578]">
                            Price
                          </p>

                          <p className="mt-1 font-semibold">
                            ₹
                            {credit.price_per_credit.toLocaleString(
                              "en-IN",
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                ),
              )}

            </div>
          )}

        </section>

                {/* ====================================================== */}
        {/* LIFECYCLE — INFORMATION ONLY */}
        {/* ====================================================== */}

        <section className="mt-12 rounded-[2rem] border border-[#dce3d8] bg-white p-7 shadow-sm">

          <p className="text-sm text-[#657064]">
            Credit lifecycle
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            From project registration to market
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#657064]">
            Every project follows a traceable lifecycle from registration
            and evidence collection through verification, credit issuance,
            and marketplace listing.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">

            {[
              [
                "01",
                "Register",
                "Create your environmental project.",
              ],
              [
                "02",
                "Evidence",
                "Upload supporting documentation.",
              ],
              [
                "03",
                "Verify",
                "Auditor reviews the project.",
              ],
              [
                "04",
                "Issue",
                "Admin issues approved credits.",
              ],
              [
                "05",
                "List",
                "Place credits on the marketplace.",
              ],
            ].map(
              ([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-2xl bg-[#fbfcfa] p-5"
                >
                  <p className="text-xs font-medium text-[#7b8578]">
                    {number}
                  </p>

                  <h3 className="mt-3 font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    {description}
                  </p>
                </div>
              ),
            )}

          </div>

        </section>

      </section>


    </main>
  );
}

export default DeveloperDashboard;