import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Document = {
  id: number;
  document_name: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
};

type Audit = {
  id: number;
  status: string;
  findings: string | null;
  audited_at: string | null;
  auditor_name: string;
};

type Project = {
  id: number;
  name: string;
  project_type: string;
  location: string;
  description: string | null;
  expected_credits: number;
  approved_issuance_quantity: number | null;
  status: string;
  submitted_at: string | null;
  created_at: string;

  developer: {
    id: number;
    name: string;
    organization: string | null;
    email: string;
  };

  documents: Document[];
  audits: Audit[];
};

function AuditorProjectReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);

  const [findings, setFindings] = useState("");
  const [approvedIssuanceQuantity, setApprovedIssuanceQuantity] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!id) {
      setError("Invalid project ID.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/auditor/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load project details.",
          );
        }

        return data;
      })
      .then((data) => {
        setProject(data.project);

        if (data.project.approved_issuance_quantity) {
          setApprovedIssuanceQuantity(
            String(
              data.project.approved_issuance_quantity,
            ),
          );
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load project.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  const handleReview = async (
    decision: "approved" | "rejected",
  ) => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!id || !project) {
      setError("Invalid project information.");
      return;
    }

    if (!findings.trim()) {
      setError(
        "Please enter your audit findings before submitting the decision.",
      );
      return;
    }

    let approvedQuantity: number | null = null;

    if (decision === "approved") {
      approvedQuantity = Number(
        approvedIssuanceQuantity,
      );

      if (
        !Number.isFinite(approvedQuantity) ||
        !Number.isInteger(approvedQuantity) ||
        approvedQuantity <= 0
      ) {
        setError(
          "Enter a valid whole-number approved issuance quantity.",
        );
        return;
      }

      if (
        approvedQuantity >
        Number(project.expected_credits)
      ) {
        setError(
          `Approved quantity cannot exceed ${Number(
            project.expected_credits,
          ).toLocaleString()} credits.`,
        );
        return;
      }
    }

    setReviewing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/auditor/projects/${id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            decision,
            findings: findings.trim(),
            approved_issuance_quantity: approvedQuantity,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to submit audit decision.",
        );
      }

      setSuccess(
        decision === "approved"
          ? `Project approved with ${approvedQuantity?.toLocaleString()} authorized credits.`
          : "Project rejected successfully.",
      );

      setProject((current) =>
        current
          ? {
              ...current,
              status:
                decision === "approved"
                  ? "verified"
                  : "rejected",
              approved_issuance_quantity:
                approvedQuantity,
            }
          : current,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit audit decision.",
      );
    } finally {
      setReviewing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
        <div className="mx-auto max-w-5xl px-8 py-20 text-center">
          <p className="text-[#657064]">
            Loading project review...
          </p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
        <div className="mx-auto max-w-5xl px-8 py-20">
          <div className="rounded-3xl border border-[#e2b8b8] bg-[#fff2f2] p-8 text-[#8a3d3d]">
            {error || "Project not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <button
            type="button"
            onClick={() => navigate("/auditor")}
            className="text-2xl font-semibold tracking-tight"
          >
            verdiq
          </button>

          <p className="text-xs text-[#657064]">
            Project Verification
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

      <section className="mx-auto max-w-6xl px-8 py-12 lg:px-16">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/auditor")}
          className="text-sm font-medium text-[#4d8b55] hover:underline"
        >
          ← Back to review queue
        </button>

        {/* Header */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              {project.name}
            </h1>

            <span className="rounded-full bg-[#fff7df] px-3 py-1 text-xs font-medium capitalize text-[#80651f]">
              {project.status.replace("_", " ")}
            </span>
          </div>

          <p className="mt-3 text-[#657064]">
            Project #{project.id} · {project.project_type} ·{" "}
            {project.location}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-8 rounded-2xl border border-[#b9d6bc] bg-[#edf5ea] px-5 py-4 text-sm text-[#37643d]">
            {success}
          </div>
        )}

        {/* Project + developer */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-[#dce3d8] bg-white p-7 lg:col-span-2">
            <h2 className="text-xl font-semibold">
              Project details
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Description
                </p>

                <p className="mt-2 text-sm leading-7 text-[#657064]">
                  {project.description ||
                    "No project description provided."}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                    Project type
                  </p>

                  <p className="mt-1 font-medium">
                    {project.project_type}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                    Location
                  </p>

                  <p className="mt-1 font-medium">
                    {project.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                    Developer expected credits
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {Number(
                      project.expected_credits,
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                    Auditor-approved credits
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {project.approved_issuance_quantity
                      ? Number(
                          project.approved_issuance_quantity,
                        ).toLocaleString()
                      : "Not approved yet"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Developer */}
          <section className="rounded-3xl border border-[#dce3d8] bg-white p-7">
            <h2 className="text-xl font-semibold">
              Developer
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Name
                </p>

                <p className="mt-1 font-medium">
                  {project.developer.name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Organization
                </p>

                <p className="mt-1 font-medium">
                  {project.developer.organization || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                  Email
                </p>

                <p className="mt-1 break-all font-medium">
                  {project.developer.email}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Supporting evidence */}
        <section className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Supporting evidence
              </h2>

              <p className="mt-1 text-sm text-[#657064]">
                Documents submitted by the developer for verification.
              </p>
            </div>

            <span className="rounded-full bg-[#eef2ea] px-3 py-1 text-xs font-medium text-[#52604f]">
              {project.documents.length}{" "}
              {project.documents.length === 1
                ? "document"
                : "documents"}
            </span>
          </div>

          {project.documents.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#cdd5c9] bg-[#fbfcfa] p-8 text-center">
              <p className="text-sm font-medium">
                No supporting documents uploaded.
              </p>

              <p className="mt-1 text-xs text-[#7b8578]">
                The developer has not provided evidence yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {project.documents.map((document) => (
                <a
                  key={document.id}
                  href={`http://localhost:5000${document.file_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-[#dce3d8] bg-[#fbfcfa] px-5 py-4 transition hover:border-[#b9cdb8] hover:bg-[#f3f7f1]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5ea] text-xs font-semibold text-[#4d8b55]">
                      FILE
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {document.document_name}
                      </p>

                      <p className="mt-1 text-xs text-[#7b8578]">
                        {document.document_type}
                      </p>
                    </div>
                  </div>

                  <span className="ml-4 shrink-0 text-sm font-medium text-[#4d8b55]">
                    Open →
                  </span>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Previous audits */}
        {project.audits.length > 0 && (
          <section className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-7">
            <h2 className="text-xl font-semibold">
              Previous audit history
            </h2>

            <div className="mt-5 space-y-4">
              {project.audits.map((audit) => (
                <div
                  key={audit.id}
                  className="rounded-2xl border border-[#dce3d8] bg-[#fbfcfa] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium capitalize">
                      {audit.status}
                    </span>

                    <span className="text-xs text-[#7b8578]">
                      {audit.audited_at
                        ? new Date(
                            audit.audited_at,
                          ).toLocaleString()
                        : "—"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#657064]">
                    {audit.findings ||
                      "No findings recorded."}
                  </p>

                  <p className="mt-2 text-xs text-[#7b8578]">
                    Auditor: {audit.auditor_name}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Auditor decision */}
        {project.status === "under_review" && (
          <section className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-7">
            <h2 className="text-xl font-semibold">
              Verification decision
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#657064]">
              The auditor determines how many credits are authorized
              for issuance based on the submitted evidence.
            </p>

            {/* Approved quantity */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Approved issuance quantity
              </label>

              <input
                type="number"
                min="1"
                max={Number(project.expected_credits)}
                step="1"
                value={approvedIssuanceQuantity}
                onChange={(event) =>
                  setApprovedIssuanceQuantity(
                    event.target.value,
                  )
                }
                placeholder={`Maximum ${Number(
                  project.expected_credits,
                ).toLocaleString()}`}
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />

              <p className="mt-2 text-xs text-[#7b8578]">
                Developer expected:{" "}
                {Number(
                  project.expected_credits,
                ).toLocaleString()}{" "}
                credits. The auditor may authorize a lower amount.
              </p>
            </div>

            {/* Findings */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Audit findings
              </label>

              <textarea
                value={findings}
                onChange={(event) =>
                  setFindings(event.target.value)
                }
                rows={6}
                placeholder="Document your verification findings, evidence assessment, methodology review, and reasons for the decision..."
                className="w-full resize-none rounded-2xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 text-sm outline-none focus:border-[#4d8b55]"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={reviewing}
                onClick={() =>
                  handleReview("rejected")
                }
                className="rounded-xl border border-[#e2b8b8] bg-[#fff7f7] px-6 py-3 text-sm font-medium text-[#8a3d3d] transition hover:bg-[#fff0f0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewing
                  ? "Submitting..."
                  : "Reject project"}
              </button>

              <button
                type="button"
                disabled={reviewing}
                onClick={() =>
                  handleReview("approved")
                }
                className="rounded-xl bg-[#172018] px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewing
                  ? "Submitting..."
                  : "Approve project"}
              </button>
            </div>
          </section>
        )}

        {/* Completed review */}
        {project.status !== "under_review" && (
          <section className="mt-6 rounded-3xl border border-[#dce3d8] bg-white p-7">
            <p className="text-sm text-[#657064]">
              This project has already been reviewed.
            </p>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#7b8578]">
                  Final status
                </p>

                <p className="mt-1 text-lg font-semibold capitalize">
                  {project.status}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7b8578]">
                  Authorized issuance
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {project.approved_issuance_quantity
                    ? `${Number(
                        project.approved_issuance_quantity,
                      ).toLocaleString()} credits`
                    : "None"}
                </p>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default AuditorProjectReview;