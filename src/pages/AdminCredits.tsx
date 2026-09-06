import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type VerifiedProject = {
  id: number;
  name: string;
  project_type: string;
  location: string;
  expected_credits: number;
  approved_issuance_quantity: number | null;
  status: string;
  issued_credits: number;
  available_credits: number;
};

function AdminCredits() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<VerifiedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [issuingProject, setIssuingProject] = useState<number | null>(
    null,
  );

  const loadProjects = async () => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/projects/verified",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load verified projects.",
        );
      }

      setProjects(data.projects || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load verified projects.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleIssueCredits = async (
    project: VerifiedProject,
  ) => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const approvedQuantity = Number(
      project.approved_issuance_quantity,
    );

    if (
      !Number.isFinite(approvedQuantity) ||
      !Number.isInteger(approvedQuantity) ||
      approvedQuantity <= 0
    ) {
      setError(
        "This project does not have a valid auditor-approved issuance quantity.",
      );
      return;
    }

    setIssuingProject(project.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/projects/${project.id}/issue-credits`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to issue credits.",
        );
      }

      setSuccess(
        `${approvedQuantity.toLocaleString()} credits issued for ${project.name}.`,
      );

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to issue credits.",
      );
    } finally {
      setIssuingProject(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="text-2xl font-semibold tracking-tight"
          >
            verdiq
          </button>

          <p className="text-xs text-[#657064]">
            Credit Issuance
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
        >
          Sign out
        </button>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        <div>
          <p className="text-sm text-[#657064]">
            Administrative issuance
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Issue carbon credits
          </h1>

          <p className="mt-3 max-w-2xl text-[#657064]">
            Credits can only be issued for verified projects and only
            up to the quantity authorized by the auditor.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 rounded-2xl border border-[#b9d6bc] bg-[#edf5ea] px-5 py-4 text-sm text-[#37643d]">
            {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-8 text-[#657064]">
            Loading verified projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf5ea] text-2xl text-[#4d8b55]">
              ✓
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No verified projects ready for issuance
            </h2>

            <p className="mt-2 text-sm text-[#657064]">
              Approved projects with an authorized issuance quantity
              will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {projects.map((project) => {
              const expected = Number(
                project.expected_credits,
              );

              const approved = Number(
                project.approved_issuance_quantity,
              );

              const issued = Number(
                project.issued_credits,
              );

              const available = Number(
                project.available_credits,
              );

              const alreadyIssued = issued > 0;

              return (
                <article
                  key={project.id}
                  className="rounded-3xl border border-[#dce3d8] bg-white p-7 shadow-sm"
                >
                  <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Project information */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold">
                          {project.name}
                        </h2>

                        <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                          Verified
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#657064]">
                        {project.project_type} ·{" "}
                        {project.location}
                      </p>

                      <div className="mt-7 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-[#fbfcfa] p-4">
                          <p className="text-xs text-[#7b8578]">
                            Developer expected
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            {expected.toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#edf5ea] p-4">
                          <p className="text-xs text-[#52765a]">
                            Auditor approved
                          </p>

                          <p className="mt-1 text-xl font-semibold text-[#37643d]">
                            {Number.isFinite(approved)
                              ? approved.toLocaleString()
                              : "—"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#fbfcfa] p-4">
                          <p className="text-xs text-[#7b8578]">
                            Already issued
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            {issued.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Issuance panel */}
                    <div className="rounded-2xl border border-[#dce3d8] bg-[#fbfcfa] p-6">
                      {alreadyIssued ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf5ea] text-[#37643d]">
                              ✓
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                Credit batch already issued
                              </p>

                              <p className="text-xs text-[#7b8578]">
                                Duplicate issuance is disabled.
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 space-y-3">
                            <div className="rounded-xl bg-white p-4">
                              <p className="text-xs text-[#7b8578]">
                                Auditor-approved quantity
                              </p>

                              <p className="mt-1 text-2xl font-semibold">
                                {approved.toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white p-4">
                              <p className="text-xs text-[#7b8578]">
                                Available inventory
                              </p>

                              <p className="mt-1 text-2xl font-semibold">
                                {available.toLocaleString()}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white p-4">
                              <p className="text-xs text-[#7b8578]">
                                Pricing
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                Set by project owner when listed
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold">
                            Authorized credit issuance
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#657064]">
                            This amount was approved by the auditor.
                            The administrator cannot change it.
                          </p>

                          <div className="mt-5 rounded-2xl border border-[#b9d6bc] bg-[#edf5ea] p-5">
                            <p className="text-xs uppercase tracking-wide text-[#52765a]">
                              Auditor-approved quantity
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-[#37643d]">
                              {Number.isFinite(approved)
                                ? approved.toLocaleString()
                                : "—"}
                            </p>

                            <p className="mt-1 text-xs text-[#52765a]">
                              Credits authorized for issuance
                            </p>
                          </div>

                          <div className="mt-5 rounded-xl bg-white p-4">
                            <p className="text-xs text-[#7b8578]">
                              Developer expected
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {expected.toLocaleString()} credits
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleIssueCredits(project)
                            }
                            disabled={
                              issuingProject === project.id ||
                              !Number.isFinite(approved) ||
                              approved <= 0
                            }
                            className="mt-5 w-full rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {issuingProject === project.id
                              ? "Issuing credits..."
                              : `Issue ${Number.isFinite(approved) ? approved.toLocaleString() : ""} Credits`}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminCredits;