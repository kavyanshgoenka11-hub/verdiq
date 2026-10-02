import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

type Project = {
  id: number;
  name: string;
  project_type: string;
  location: string;
  description: string | null;
  expected_credits: number;
  status: string;
  submitted_at: string | null;
  developer_name: string;
  organization: string | null;
};

function AuditorDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`${API_BASE_URL}/api/auditor/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load projects.");
        }

        return data;
      })
      .then((data) => {
        setProjects(data.projects);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load auditor dashboard.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("verdiq_token");
    localStorage.removeItem("verdiq_user");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      <nav className="flex items-center justify-between border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            verdiq
          </p>
          <p className="text-xs text-[#657064]">
            Auditor / Validator Dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
        >
          Sign out
        </button>
      </nav>

      <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        <p className="text-sm text-[#657064]">
          Verification workspace
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Projects awaiting review
        </h1>

        <p className="mt-3 max-w-2xl text-[#657064]">
          Review submitted environmental projects and determine whether
          they meet the verification requirements.
        </p>

        {error && (
          <div className="mt-8 rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-8 text-[#657064]">
            Loading submitted projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-8">
            <h2 className="text-xl font-semibold">
              No projects awaiting review
            </h2>

            <p className="mt-2 text-sm text-[#657064]">
              New developer submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">
                        {project.name}
                      </h2>

                      <span className="rounded-full bg-[#fff7df] px-3 py-1 text-xs font-medium text-[#80651f]">
                        Under Review
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#657064]">
                      {project.project_type} · {project.location}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-[#657064]">
                      {project.description ||
                        "No project description provided."}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-[#7b8578]">
                          Developer
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {project.developer_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#7b8578]">
                          Organization
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {project.organization || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#7b8578]">
                          Expected credits
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {Number(
                            project.expected_credits,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/auditor/projects/${project.id}`)
                    }
                    className="rounded-xl bg-[#172018] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                  >
                    Review project →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AuditorDashboard;