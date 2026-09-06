import {
  DragEvent,
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type Project = {
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

type Document = {
  id: number;
  document_name: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".xlsx",
  ".csv",
];

function DeveloperProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Record<number, Document[]>>(
    {},
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedFile, setSelectedFile] = useState<
    Record<number, File | null>
  >({});

  const [draggingProject, setDraggingProject] = useState<number | null>(
    null,
  );

  const [uploadingProject, setUploadingProject] = useState<number | null>(
    null,
  );

  const getToken = () => {
    return localStorage.getItem("verdiq_token");
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum allowed size is 10 MB.";
    }

    const lowerName = file.name.toLowerCase();

    const isAllowed = ALLOWED_EXTENSIONS.some((extension) =>
      lowerName.endsWith(extension),
    );

    if (!isAllowed) {
      return "Unsupported file type. Please upload PDF, PNG, JPG, JPEG, XLSX, or CSV.";
    }

    return null;
  };

  const setFileForProject = (
    projectId: number,
    file: File | null,
  ) => {
    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile((current) => ({
        ...current,
        [projectId]: null,
      }));
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile((current) => ({
        ...current,
        [projectId]: null,
      }));

      setError(validationError);
      return;
    }

    setSelectedFile((current) => ({
      ...current,
      [projectId]: file,
    }));
  };

  const handleFileChange = (
    projectId: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;

    setFileForProject(projectId, file);

    // Allows the same file to be selected again later.
    event.target.value = "";
  };

  const handleDragOver = (
    projectId: number,
    event: DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDraggingProject(projectId);
  };

  const handleDragLeave = (
    projectId: number,
    event: DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDraggingProject((current) =>
      current === projectId ? null : current,
    );
  };

  const handleDrop = (
    projectId: number,
    event: DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDraggingProject(null);

    const file = event.dataTransfer.files?.[0] || null;

    setFileForProject(projectId, file);
  };

  const loadProjects = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/developer/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load projects.",
        );
      }

      const projectList: Project[] = data.projects || [];

      setProjects(projectList);

      const documentMap: Record<number, Document[]> = {};

      await Promise.all(
        projectList.map(async (project) => {
          try {
            const documentResponse = await fetch(
              `http://localhost:5000/api/developer/projects/${project.id}/documents`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!documentResponse.ok) {
              documentMap[project.id] = [];
              return;
            }

            const documentData = await documentResponse.json();

            documentMap[project.id] =
              documentData.documents || [];
          } catch {
            documentMap[project.id] = [];
          }
        }),
      );

      setDocuments(documentMap);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load developer projects.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleUpload = async (projectId: number) => {
    const file = selectedFile[projectId];

    if (!file) {
      setError("Please choose a document first.");
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setUploadingProject(projectId);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(
        `http://localhost:5000/api/developer/projects/${projectId}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload document.",
        );
      }

      setSelectedFile((current) => ({
        ...current,
        [projectId]: null,
      }));

      setSuccess(
        `"${file.name}" uploaded successfully.`,
      );

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload document.",
      );
    } finally {
      setUploadingProject(null);
    }
  };

  const handleSubmitForVerification = async (projectId: number) => {
  const token = getToken();

  if (!token) {
    navigate("/login", { replace: true });
    return;
  }

  setError("");
  setSuccess("");

  try {
    const response = await fetch(
      `http://localhost:5000/api/developer/projects/${projectId}/submit`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to submit project.",
      );
    }

    setSuccess(
      `Project #${projectId} has been submitted for verification.`,
    );

    await loadProjects();
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Failed to submit project for verification.",
    );
  }
};

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");

    navigate("/login", { replace: true });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-[#edf5ea] text-[#37643d]";

      case "rejected":
        return "bg-[#fff2f2] text-[#8a3d3d]";

      case "under_review":
        return "bg-[#fff7df] text-[#80651f]";

      case "draft":
      default:
        return "bg-[#eef2ea] text-[#52604f]";
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <button
            type="button"
            onClick={() => navigate("/developer")}
            className="text-2xl font-semibold tracking-tight"
          >
            verdiq
          </button>

          <p className="text-xs text-[#657064]">
            Developer Projects
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

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-[#657064]">
              Project management
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              My projects
            </h1>

            <p className="mt-3 max-w-2xl text-[#657064]">
              Manage your environmental projects, upload supporting
              evidence, and track verification status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/developer/projects/new")}
            className="rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            + Register project
          </button>
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
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          /* Empty state */
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf5ea] text-2xl text-[#4d8b55]">
              +
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#657064]">
              Create your first environmental project to begin the
              verification and carbon-credit process.
            </p>

            <button
              type="button"
              onClick={() => navigate("/developer/projects/new")}
              className="mt-6 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white"
            >
              Register your first project
            </button>
          </div>
        ) : (
          /* Project list */
          <div className="mt-10 space-y-6">
            {projects.map((project) => {
              const file = selectedFile[project.id];
              const projectDocuments =
                documents[project.id] || [];
              const isUploading =
                uploadingProject === project.id;
              const isDragging =
                draggingProject === project.id;

              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-3xl border border-[#dce3d8] bg-white shadow-sm"
                >
                  <div className="grid lg:grid-cols-[1fr_380px]">
                    {/* Project information */}
                    <div className="p-7 lg:p-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold">
                          {project.name}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyles(
                            project.status,
                          )}`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#657064]">
                        {project.project_type} ·{" "}
                        {project.location}
                      </p>

                      <p className="mt-5 max-w-3xl text-sm leading-6 text-[#657064]">
                        {project.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-7 grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                            Expected annual credits
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            {Number(
                              project.expected_credits,
                            ).toLocaleString()}
                          </p>
                        </div>

                        {project.status === "draft" && (
  <div className="mt-7 border-t border-[#edf0ea] pt-6">
    <p className="text-sm text-[#657064]">
      Your project is currently a draft. Make sure the required
      evidence has been uploaded before submitting it for review.
    </p>

    <button
      type="button"
      onClick={() =>
        handleSubmitForVerification(project.id)
      }
      className="mt-4 rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
    >
      Submit for verification →
    </button>
  </div>
)}

                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#7b8578]">
                            Project ID
                          </p>

                          <p className="mt-1 text-xl font-semibold">
                            #{project.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Evidence */}
                    <div className="border-t border-[#dce3d8] bg-[#fbfcfa] p-7 lg:border-l lg:border-t-0 lg:p-8">
                      <div>
                        <p className="text-sm font-semibold">
                          Project evidence
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#7b8578]">
                          Upload documents supporting your project
                          verification.
                        </p>
                      </div>

                      {/* Existing documents */}
                      {projectDocuments.length > 0 && (
                        <div className="mt-5 space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-[#7b8578]">
                            Uploaded documents
                          </p>

                          {projectDocuments.map((document) => (
                            <a
                              key={document.id}
                              href={`http://localhost:5000${document.file_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-xl border border-[#dce3d8] bg-white px-4 py-3 transition hover:border-[#b9cdb8] hover:bg-[#f3f7f1]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf5ea] text-sm text-[#4d8b55]">
                                  ↗
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
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Upload area */}
                      <div className="mt-6">
                        <input
                          id={`document-upload-${project.id}`}
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
                          className="hidden"
                          onChange={(event) =>
                            handleFileChange(
                              project.id,
                              event,
                            )
                          }
                        />

                        <label
                          htmlFor={`document-upload-${project.id}`}
                          onDragOver={(event) =>
                            handleDragOver(
                              project.id,
                              event,
                            )
                          }
                          onDragLeave={(event) =>
                            handleDragLeave(
                              project.id,
                              event,
                            )
                          }
                          onDrop={(event) =>
                            handleDrop(
                              project.id,
                              event,
                            )
                          }
                          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-9 text-center transition ${
                            isDragging
                              ? "border-[#4d8b55] bg-[#edf5ea] scale-[1.01]"
                              : "border-[#cdd5c9] bg-white hover:border-[#4d8b55] hover:bg-[#f3f7f1]"
                          }`}
                        >
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition ${
                              isDragging
                                ? "bg-[#4d8b55] text-white"
                                : "bg-[#edf5ea] text-[#4d8b55] group-hover:scale-105"
                            }`}
                          >
                            {isDragging ? "↓" : "↑"}
                          </div>

                          <p className="mt-4 text-sm font-semibold">
                            {isDragging
                              ? "Release to add your document"
                              : file
                                ? "Choose a different document"
                                : "Drop your project evidence here"}
                          </p>

                          <p className="mt-1 text-sm text-[#657064]">
                            {isDragging
                              ? "We’ll use this file for your project evidence."
                              : "or click here to browse your device"}
                          </p>

                          <p className="mt-4 text-xs text-[#7b8578]">
                            PDF · PNG · JPG · XLSX · CSV
                          </p>

                          <p className="mt-1 text-xs text-[#7b8578]">
                            Maximum file size: 10 MB
                          </p>
                        </label>

                        {/* Selected file */}
                        {file && (
                          <div className="mt-3 rounded-xl border border-[#cdd5c9] bg-white px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#edf5ea] text-sm text-[#4d8b55]">
                                ✓
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {file.name}
                                </p>

                                <p className="mt-1 text-xs text-[#7b8578]">
                                  {(
                                    file.size /
                                    (1024 * 1024)
                                  ).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setFileForProject(
                                    project.id,
                                    null,
                                  )
                                }
                                className="shrink-0 text-xs font-medium text-[#8a3d3d] hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Upload */}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpload(project.id)
                          }
                          disabled={!file || isUploading}
                          className="mt-3 w-full rounded-xl bg-[#172018] px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isUploading
                            ? "Uploading document..."
                            : "Upload selected document"}
                        </button>
                      </div>
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

export default DeveloperProjects;