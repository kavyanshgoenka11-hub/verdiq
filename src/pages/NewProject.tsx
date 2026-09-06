import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function NewProject() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState("Reforestation");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [expectedCredits, setExpectedCredits] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("verdiq_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/developer/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            project_type: projectType,
            location,
            description,
            expected_credits: Number(expectedCredits),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project.");
      }

      setMessage(
        `Project created successfully. Project ID: ${data.project.id}`,
      );

      setName("");
      setProjectType("Reforestation");
      setLocation("");
      setDescription("");
      setExpectedCredits("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the project.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">
      <nav className="border-b border-[#dce3d8] bg-white px-8 py-5 lg:px-16">
        <p className="text-2xl font-semibold tracking-tight">verdiq</p>
        <p className="text-xs text-[#657064]">
          Register Environmental Project
        </p>
      </nav>

      <section className="mx-auto max-w-3xl px-8 py-12 lg:px-16">
        <button
          type="button"
          onClick={() => navigate("/developer")}
          className="text-sm text-[#4d8b55] hover:underline"
        >
          ← Back to developer dashboard
        </button>

        <div className="mt-6">
          <h1 className="text-4xl font-semibold tracking-tight">
            Register a new project
          </h1>

          <p className="mt-3 text-[#657064]">
            Submit the basic details of your environmental project.
            The project will remain a draft until you submit it for
            verification.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-[#dce3d8] bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Project name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Green Valley Reforestation Project"
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Project type
              </label>

              <select
                value={projectType}
                onChange={(event) => setProjectType(event.target.value)}
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              >
                <option value="Reforestation">Reforestation</option>
                <option value="Renewable Energy">
                  Renewable Energy
                </option>
                <option value="Methane Capture">
                  Methane Capture
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <input
                type="text"
                required
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Maharashtra, India"
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={5}
                placeholder="Describe the project's environmental impact..."
                className="w-full resize-none rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Expected annual carbon credits
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={expectedCredits}
                onChange={(event) =>
                  setExpectedCredits(event.target.value)
                }
                placeholder="e.g. 12500"
                className="w-full rounded-xl border border-[#cdd5c9] bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#4d8b55]"
              />
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-xl border border-[#b9d6bc] bg-[#edf5ea] px-4 py-3 text-sm text-[#37643d]">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-[#e2b8b8] bg-[#fff2f2] px-4 py-3 text-sm text-[#8a3d3d]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-[#172018] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating project..." : "Save project"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default NewProject;