import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Overview = {
  total_users: number;
  total_projects: number;
  verified_projects: number;
  total_credits: number;
  available_credits: number;
  total_retired: number;
};

type ClimateData = {
  atmospheric_co2_ppm: number;
  observation_year: number;
  observation_month: number;
  source: string;
  source_url: string;
  dataset: string;
};

type LeaderboardEntry = {
  rank: number;
  user_id: number;
  organization: string;
  reporting_year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  total_emissions: number;
};

type ScopeData = {
  scope1: number;
  scope2: number;
  scope3: number;
};

type Project = {
  id: number;
  name: string;
  project_type: string;
  location: string;
  description: string | null;
  expected_credits: number;
  approved_issuance_quantity: number | null;
  available_credits: number;
};

function Home() {
  const navigate = useNavigate();

  const [overview, setOverview] =
    useState<Overview | null>(null);

  const [climate, setClimate] =
    useState<ClimateData | null>(null);

  const [co2Display, setCo2Display] =
    useState(0);

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>([]);

  const [scopeData, setScopeData] =
    useState<ScopeData | null>(null);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Safely fetch JSON.
   */
  const fetchJson = async (url: string) => {
    const response = await fetch(url);

    let data: any = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          `Request failed with status ${response.status}.`,
      );
    }

    return data;
  };

  /*
   * Load each public data source independently.
   *
   * This is intentionally NOT Promise.all().
   * If NOAA fails, Verdiq's own platform data should still load.
   */
  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      try {
        const data = await fetchJson(
          "http://localhost:5000/api/public/overview",
        );

        if (cancelled) return;

        setOverview({
          total_users: Number(
            data?.total_users ?? 0,
          ),

          total_projects: Number(
            data?.total_projects ?? 0,
          ),

          verified_projects: Number(
            data?.verified_projects ?? 0,
          ),

          total_credits: Number(
            data?.total_credits ?? 0,
          ),

          available_credits: Number(
            data?.available_credits ?? 0,
          ),

          total_retired: Number(
            data?.total_retired ?? 0,
          ),
        });
      } catch (err) {
        console.error(
          "Overview API error:",
          err,
        );

        if (!cancelled) {
          setError(
            "Some platform statistics could not be loaded.",
          );
        }
      }
    };

    const loadLeaderboard = async () => {
      try {
        const data = await fetchJson(
          "http://localhost:5000/api/public/leaderboard",
        );

        if (cancelled) return;

        setLeaderboard(
          Array.isArray(data?.leaderboard)
            ? data.leaderboard.map(
                (entry: any, index: number) => ({
                  rank: Number(
                    entry.rank ?? index + 1,
                  ),

                  user_id: Number(
                    entry.user_id ?? 0,
                  ),

                  organization:
                    entry.organization ||
                    "Unnamed organization",

                  reporting_year: Number(
                    entry.reporting_year ?? 0,
                  ),

                  scope1: Number(
                    entry.scope1 ?? 0,
                  ),

                  scope2: Number(
                    entry.scope2 ?? 0,
                  ),

                  scope3: Number(
                    entry.scope3 ?? 0,
                  ),

                  total_emissions: Number(
                    entry.total_emissions ?? 0,
                  ),
                }),
              )
            : [],
        );
      } catch (err) {
        console.error(
          "Leaderboard API error:",
          err,
        );

        if (!cancelled) {
          setLeaderboard([]);
        }
      }
    };

    const loadScopeData = async () => {
      try {
        const data = await fetchJson(
          "http://localhost:5000/api/public/scope-breakdown",
        );

        if (cancelled) return;

        setScopeData({
          scope1: Number(
            data?.scope1 ?? 0,
          ),

          scope2: Number(
            data?.scope2 ?? 0,
          ),

          scope3: Number(
            data?.scope3 ?? 0,
          ),
        });
      } catch (err) {
        console.error(
          "Scope breakdown API error:",
          err,
        );

        if (!cancelled) {
          setScopeData({
            scope1: 0,
            scope2: 0,
            scope3: 0,
          });
        }
      }
    };

    const loadProjects = async () => {
      try {
        const data = await fetchJson(
          "http://localhost:5000/api/public/projects",
        );

        if (cancelled) return;

        setProjects(
          Array.isArray(data?.projects)
            ? data.projects.map(
                (project: any) => ({
                  id: Number(project.id ?? 0),

                  name:
                    project.name ||
                    "Unnamed project",

                  project_type:
                    project.project_type ||
                    "Environmental project",

                  location:
                    project.location ||
                    "Location unavailable",

                  description:
                    project.description ??
                    null,

                  expected_credits: Number(
                    project.expected_credits ?? 0,
                  ),

                  approved_issuance_quantity:
                    project
                      .approved_issuance_quantity !==
                    null
                      ? Number(
                          project.approved_issuance_quantity,
                        )
                      : null,

                  available_credits: Number(
                    project.available_credits ?? 0,
                  ),
                }),
              )
            : [],
        );
      } catch (err) {
        console.error(
          "Projects API error:",
          err,
        );

        if (!cancelled) {
          setProjects([]);
        }
      }
    };

    const loadClimate = async () => {
      try {
        const data = await fetchJson(
          "http://localhost:5000/api/public/climate",
        );

        const ppm = Number(
          data?.atmospheric_co2_ppm,
        );

        if (
          !cancelled &&
          Number.isFinite(ppm) &&
          ppm > 0
        ) {
          setClimate({
            atmospheric_co2_ppm: ppm,

            observation_year: Number(
              data?.observation_year ?? 0,
            ),

            observation_month: Number(
              data?.observation_month ?? 0,
            ),

            source:
              data?.source ||
              "NOAA Global Monitoring Laboratory",

            source_url:
              data?.source_url ||
              "https://gml.noaa.gov/ccgg/trends/",

            dataset:
              data?.dataset ||
              "Mauna Loa Monthly Mean CO2",
          });
        }
      } catch (err) {
        console.error(
          "Climate API error:",
          err,
        );

        /*
         * Climate data is external.
         * Its failure should not break the homepage.
         */
        if (!cancelled) {
          setClimate(null);
        }
      }
    };

    Promise.allSettled([
      loadOverview(),
      loadLeaderboard(),
      loadScopeData(),
      loadProjects(),
      loadClimate(),
    ]).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Animate the NOAA atmospheric CO2 number.
   */
  useEffect(() => {
    if (!climate) {
      setCo2Display(0);
      return;
    }

    const target =
      climate.atmospheric_co2_ppm;

    const duration = 1400;
    const startTime = performance.now();

    let animationFrame = 0;

    const animate = (
      currentTime: number,
    ) => {
      const elapsed =
        currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1,
      );

      /*
       * Ease-out cubic.
       */
      const eased =
        1 - Math.pow(1 - progress, 3);

      setCo2Display(
        target * eased,
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(
            animate,
          );
      }
    };

    animationFrame =
      requestAnimationFrame(
        animate,
      );

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );
    };
  }, [climate]);

  const leader =
    leaderboard.length > 0
      ? leaderboard[0]
      : null;

  const challenger =
    leaderboard.length > 1
      ? leaderboard[1]
      : null;

  const hasScopeData =
    scopeData !== null;

  const hasNoScopeData =
    !scopeData ||
    (
      scopeData.scope1 === 0 &&
      scopeData.scope2 === 0 &&
      scopeData.scope3 === 0
    );

  const scopeMaximum = scopeData
    ? Math.max(
        1,
        scopeData.scope1,
        scopeData.scope2,
        scopeData.scope3,
      )
    : 1;

  const challengerGap =
    leader &&
    challenger &&
    leader.total_emissions > 0
      ? (
          ((leader.total_emissions -
            challenger.total_emissions) /
            leader.total_emissions) *
          100
        ).toFixed(1)
      : "0.0";

  const challengerProgress =
    leader &&
    challenger &&
    leader.total_emissions > 0
      ? Math.max(
          5,
          Math.min(
            100,
            (challenger.total_emissions /
              leader.total_emissions) *
              100,
          ),
        )
      : 5;

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
              Measure. Verify. Make an Impact.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/marketplace")
              }
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#52604f] transition hover:bg-white sm:block"
            >
              Marketplace
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="rounded-full border border-[#cdd5c9] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#eef2ea]"
            >
              Sign in
            </button>

          </div>
        </div>
      </nav>

      {/* ====================================================== */}
      {/* NON-BLOCKING ERROR */}
      {/* ====================================================== */}

      {error && (
        <div className="mx-auto max-w-7xl px-8 pt-6 lg:px-16">
          <div className="rounded-2xl border border-[#e2b8b8] bg-[#fff2f2] px-5 py-4 text-sm text-[#8a3d3d]">
            {error}
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-8 pb-16 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:pb-24 lg:pt-24">

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d5ddd0] bg-white px-4 py-2 text-sm text-[#52604f]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            Transparent climate infrastructure
          </div>

          <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Carbon data that
            <span className="text-[#4d8b55]">
              {" "}
              leads to action.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#657064]">
            Verdiq connects emissions measurement, environmental
            project verification, carbon-credit trading, retirement,
            and proof of impact in one transparent ecosystem.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/marketplace")
              }
              className="rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore verified credits →
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/calculator")
              }
              className="rounded-full border border-[#cdd5c9] bg-white px-6 py-3.5 text-sm font-medium transition hover:bg-[#eef2ea]"
            >
              Calculate footprint
            </button>
          </div>
        </div>

        {/* Network card */}
        <div className="rounded-[2rem] border border-[#dce3d8] bg-white p-7 shadow-[0_25px_70px_rgba(30,50,30,0.08)]">

          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-sm text-[#657064]">
                Verdiq network
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Climate activity
              </h2>
            </div>

            <span className="rounded-full bg-[#edf5ea] px-3 py-1.5 text-xs font-medium text-[#37643d]">
              LIVE
            </span>
          </div>

          <div className="mt-8 space-y-5">

            <div className="rounded-2xl bg-[#fbfcfa] p-5">
              <p className="text-xs text-[#7b8578]">
                Credits issued
              </p>

              <p className="mt-1 text-4xl font-semibold">
                {loading
                  ? "…"
                  : overview?.total_credits
                      .toLocaleString() ?? "0"}
              </p>

              <p className="mt-1 text-xs text-[#7b8578]">
                Across Verdiq projects
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl bg-[#edf5ea] p-5">
                <p className="text-xs text-[#52765a]">
                  In marketplace
                </p>

                <p className="mt-1 text-2xl font-semibold text-[#37643d]">
                  {loading
                    ? "…"
                    : overview?.available_credits
                        .toLocaleString() ?? "0"}
                </p>

                <p className="mt-1 text-xs text-[#52765a]">
                  Currently listed
                </p>
              </div>

              <div className="rounded-2xl bg-[#fbfcfa] p-5">
                <p className="text-xs text-[#7b8578]">
                  Permanently retired
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {loading
                    ? "…"
                    : overview?.total_retired
                        .toLocaleString() ?? "0"}
                </p>

                <p className="mt-1 text-xs text-[#7b8578]">
                  No longer available
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between border-t border-[#edf0ea] pt-5 text-sm">
              <span className="text-[#657064]">
                Verified projects
              </span>

              <span className="font-semibold">
                {loading
                  ? "…"
                  : overview?.verified_projects ?? 0}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* NETWORK METRICS */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-16">

          <div>
            <p className="text-3xl font-semibold">
              {loading
                ? "…"
                : overview?.total_users ?? 0}
            </p>

            <p className="mt-1 text-sm text-[#657064]">
              Participating users
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold">
              {loading
                ? "…"
                : overview?.total_projects ?? 0}
            </p>

            <p className="mt-1 text-sm text-[#657064]">
              Registered projects
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold">
              {loading
                ? "…"
                : overview?.available_credits
                    .toLocaleString() ?? "0"}
            </p>

            <p className="mt-1 text-sm text-[#657064]">
              Credits currently listed
            </p>
          </div>

          <div>
            <p className="text-3xl font-semibold">
              {loading
                ? "…"
                : overview?.total_retired
                    .toLocaleString() ?? "0"}
            </p>

            <p className="mt-1 text-sm text-[#657064]">
              Credits permanently retired
            </p>
          </div>

        </div>
      </section>

      {/* ====================================================== */}
      {/* CLIMATE PULSE + SCOPE */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Atmospheric CO2 */}
          <div>
            <p className="text-sm text-[#657064]">
              Climate pulse
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Understand the pressure.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#657064]">
              Atmospheric CO₂ is an external climate indicator.
              Verdiq separately tracks measurable climate action
              inside its own network.
            </p>

            {/* CO2 CARD */}
            <div className="relative mt-6 overflow-hidden rounded-3xl border border-[#344036] bg-[#172018] p-7 text-white shadow-[0_20px_60px_rgba(23,32,24,0.15)]">

              {/* Decorative animated glow */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-16 -top-16 h-40 w-40 animate-pulse rounded-full bg-[#4d8b55]/20 blur-3xl" />

                <div
                  className="absolute -bottom-16 -left-10 h-40 w-40 animate-pulse rounded-full bg-[#8caf87]/10 blur-3xl"
                  style={{
                    animationDelay: "700ms",
                  }}
                />
              </div>

              <div className="relative">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#bcc7b9]">
                      Atmospheric CO₂
                    </p>

                    <p className="mt-2 text-sm text-[#d4ddd1]">
                      Global climate indicator
                    </p>
                  </div>

                  <span className="rounded-full border border-[#526054] bg-[#243025] px-3 py-1 text-xs font-medium text-[#c8d5c5]">
                    NOAA
                  </span>

                </div>

                {climate ? (
                  <>
                    <div className="mt-8 flex items-end gap-3">

                      <span className="tabular-nums text-6xl font-semibold tracking-[-0.04em] sm:text-7xl">
                        {co2Display.toFixed(2)}
                      </span>

                      <span className="mb-2 text-lg text-[#bcc7b9]">
                        ppm
                      </span>

                    </div>

                    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#bcc7b9]">
                      <span>
                        Observation:{" "}
                        {climate.observation_year}
                        -
                        {String(
                          climate.observation_month,
                        ).padStart(2, "0")}
                      </span>

                      <span>
                        {climate.dataset}
                      </span>
                    </div>

                    <div className="mt-7 border-t border-[#344036] pt-5">

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <p className="text-xs text-[#7f8c7f]">
                            Data source
                          </p>

                          <p className="mt-1 text-sm text-[#d4ddd1]">
                            {climate.source}
                          </p>
                        </div>

                        <a
                          href={climate.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-[#9fc79a] hover:underline"
                        >
                          View NOAA data →
                        </a>

                      </div>

                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-10">
                      <p className="text-3xl font-semibold">
                        Data temporarily unavailable
                      </p>

                      <p className="mt-3 max-w-md text-sm leading-6 text-[#bcc7b9]">
                        The latest NOAA atmospheric CO₂ observation
                        could not be loaded right now.
                      </p>

                      <a
                        href="https://gml.noaa.gov/ccgg/trends/"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-block text-sm font-medium text-[#9fc79a] hover:underline"
                      >
                        Open NOAA climate data →
                      </a>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

          {/* Scope breakdown */}
          <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

            <p className="text-sm text-[#657064]">
              Participating organizations
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Emissions by scope
            </h2>

            {!hasScopeData ? (
              <div className="mt-8 rounded-2xl bg-[#fbfcfa] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5ea] text-lg text-[#4d8b55]">
                  ≈
                </div>

                <h3 className="mt-4 font-semibold">
                  Loading footprint data...
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#657064]">
                  Verdiq is loading finalized emissions reports.
                </p>

              </div>
            ) : hasNoScopeData ? (
              <div className="mt-8 rounded-2xl bg-[#fbfcfa] p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5ea] text-lg text-[#4d8b55]">
                  ≈
                </div>

                <h3 className="mt-4 font-semibold">
                  No finalized footprint data yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#657064]">
                  Scope 1, Scope 2 and Scope 3 emissions will appear
                  here when participating organizations finalize their
                  footprint reports.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/calculator")
                  }
                  className="mt-5 text-sm font-medium text-[#4d8b55] hover:underline"
                >
                  Measure your footprint →
                </button>

              </div>
            ) : (
              <div className="mt-8 space-y-6">

                {[
                  {
                    label: "Scope 1",
                    value:
                      scopeData?.scope1 ?? 0,
                    description:
                      "Direct emissions",
                  },

                  {
                    label: "Scope 2",
                    value:
                      scopeData?.scope2 ?? 0,
                    description:
                      "Purchased energy",
                  },

                  {
                    label: "Scope 3",
                    value:
                      scopeData?.scope3 ?? 0,
                    description:
                      "Value-chain emissions",
                  },
                ].map((scope) => (
                  <div key={scope.label}>

                    <div className="flex justify-between gap-4">

                      <div>
                        <p className="font-semibold">
                          {scope.label}
                        </p>

                        <p className="text-xs text-[#7b8578]">
                          {scope.description}
                        </p>
                      </div>

                      <p className="font-semibold">
                        {scope.value.toLocaleString()}{" "}
                        tCO₂e
                      </p>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf0ea]">
                      <div
                        className="h-full rounded-full bg-[#4d8b55]"
                        style={{
                          width: `${Math.max(
                            4,
                            Math.min(
                              100,
                              (scope.value /
                                scopeMaximum) *
                                100,
                            ),
                          )}%`,
                        }}
                      />
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CARBON MEASUREMENT */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 pb-20 lg:px-16">

        <div className="overflow-hidden rounded-[2rem] border border-[#dce3d8] bg-white">

          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">

            <div className="p-8 sm:p-10">

              <p className="text-sm text-[#657064]">
                Carbon measurement
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Measure before you offset.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#657064]">
                Build a structured footprint across Scope 1, Scope 2
                and Scope 3, understand where emissions come from, and
                create a traceable record before taking climate action.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">

                <div className="rounded-2xl bg-[#fbfcfa] p-5">
                  <p className="text-sm font-semibold">
                    Scope 1
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#7b8578]">
                    Direct emissions from owned or controlled sources.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fbfcfa] p-5">
                  <p className="text-sm font-semibold">
                    Scope 2
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#7b8578]">
                    Indirect emissions from purchased energy.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fbfcfa] p-5">
                  <p className="text-sm font-semibold">
                    Scope 3
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#7b8578]">
                    Value-chain emissions across upstream and
                    downstream activities.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/calculator")
                }
                className="mt-7 rounded-full bg-[#172018] px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
              >
                Calculate your footprint →
              </button>

            </div>

            <div className="bg-[#edf5ea] p-8 sm:p-10">

              <p className="text-xs uppercase tracking-[0.2em] text-[#52765a]">
                Verdiq measurement flow
              </p>

              <div className="mt-7 space-y-5">

                {[
                  [
                    "01",
                    "Collect",
                    "Record activity data and emission factors.",
                  ],

                  [
                    "02",
                    "Calculate",
                    "Convert activity into tCO₂e by scope.",
                  ],

                  [
                    "03",
                    "Finalize",
                    "Create a traceable footprint record.",
                  ],

                  [
                    "04",
                    "Act",
                    "Use verified climate projects and credits.",
                  ],
                ].map(
                  ([
                    number,
                    title,
                    description,
                  ]) => (
                    <div
                      key={number}
                      className="flex gap-4"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#4d8b55]">
                        {number}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#52765a]">
                          {description}
                        </p>
                      </div>

                    </div>
                  ),
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* LEADERBOARD */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>
              <p className="text-sm text-[#657064]">
                Verdiq Climate Leaderboard
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Who is leading the network?
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#657064]">
                Participating organizations with finalized footprint
                reports. Rankings reflect the latest finalized reporting
                year available for each organization.
              </p>
            </div>

            <span className="text-xs text-[#7b8578]">
              Reported CO₂e · participating organizations
            </span>

          </div>

          {leaderboard.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-8 text-center">

              <h3 className="font-semibold">
                No finalized footprint reports yet
              </h3>

              <p className="mt-2 text-sm text-[#657064]">
                Organizations will appear here after finalizing
                their emissions reports.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/calculator")
                }
                className="mt-5 text-sm font-medium text-[#4d8b55] hover:underline"
              >
                Measure your footprint →
              </button>

            </div>
          ) : (
            <>
              {/* Leader and challenger */}
              <div className="mt-10 grid gap-5 lg:grid-cols-2">

                {leader && (
                  <div className="rounded-3xl border border-[#c9dcc9] bg-[#edf5ea] p-7">

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#37643d]">
                        🏆 Current leader
                      </span>

                      <span className="text-xs text-[#52765a]">
                        Rank #{leader.rank}
                      </span>

                    </div>

                    <h3 className="mt-6 text-2xl font-semibold">
                      {leader.organization}
                    </h3>

                    <p className="mt-2 text-sm text-[#52765a]">
                      Highest reported emissions among participating
                      organizations
                    </p>

                    <p className="mt-6 text-4xl font-semibold text-[#37643d]">
                      {leader.total_emissions.toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm text-[#52765a]">
                      tCO₂e · {leader.reporting_year}
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-3">

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs text-[#7b8578]">
                          Scope 1
                        </p>

                        <p className="mt-1 font-semibold">
                          {leader.scope1.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs text-[#7b8578]">
                          Scope 2
                        </p>

                        <p className="mt-1 font-semibold">
                          {leader.scope2.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs text-[#7b8578]">
                          Scope 3
                        </p>

                        <p className="mt-1 font-semibold">
                          {leader.scope3.toLocaleString()}
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {challenger && (
                  <div className="rounded-3xl border border-[#dce3d8] bg-white p-7">

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-[#fbfcfa] px-3 py-1 text-xs font-medium text-[#52604f]">
                        🔥 Closest challenger
                      </span>

                      <span className="text-xs text-[#7b8578]">
                        Rank #{challenger.rank}
                      </span>

                    </div>

                    <h3 className="mt-6 text-2xl font-semibold">
                      {challenger.organization}
                    </h3>

                    <p className="mt-2 text-sm text-[#657064]">
                      Currently chasing the network leader
                    </p>

                    <p className="mt-6 text-4xl font-semibold">
                      {challenger.total_emissions.toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm text-[#657064]">
                      tCO₂e · {challenger.reporting_year}
                    </p>

                    <div className="mt-6 rounded-2xl bg-[#fbfcfa] p-5">

                      <div className="flex items-center justify-between text-sm">

                        <span className="text-[#657064]">
                          Gap to leader
                        </span>

                        <span className="font-semibold">
                          {challengerGap}%
                        </span>

                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7ebe4]">

                        <div
                          className="h-full rounded-full bg-[#4d8b55]"
                          style={{
                            width: `${challengerProgress}%`,
                          }}
                        />

                      </div>

                      <p className="mt-3 text-xs leading-5 text-[#7b8578]">
                        A lower percentage gap means the organization is
                        closer to the leader's reported emissions.
                      </p>

                    </div>
                  </div>
                )}

              </div>

              {/* Full leaderboard */}
              <div className="mt-8 overflow-hidden rounded-3xl border border-[#dce3d8]">

                <div className="hidden grid-cols-[70px_1fr_150px_180px] gap-6 bg-[#fbfcfa] px-6 py-4 text-xs uppercase tracking-wide text-[#7b8578] sm:grid">

                  <span>Rank</span>
                  <span>Organization</span>
                  <span>Year</span>

                  <span className="text-right">
                    Reported CO₂e
                  </span>

                </div>

                {leaderboard
                  .slice(0, 10)
                  .map((entry) => (
                    <div
                      key={`${entry.user_id}-${entry.reporting_year}`}
                      className="grid gap-3 border-t border-[#edf0ea] px-6 py-5 sm:grid-cols-[70px_1fr_150px_180px] sm:items-center"
                    >

                      <span className="text-lg font-semibold">
                        #{entry.rank}
                      </span>

                      <div>

                        <p className="font-semibold">
                          {entry.organization}
                        </p>

                        <p className="mt-1 text-xs text-[#7b8578]">
                          S1 {entry.scope1.toLocaleString()} · S2{" "}
                          {entry.scope2.toLocaleString()} · S3{" "}
                          {entry.scope3.toLocaleString()} tCO₂e
                        </p>

                      </div>

                      <span className="text-sm text-[#657064]">
                        {entry.reporting_year}
                      </span>

                      <span className="font-semibold sm:text-right">
                        {entry.total_emissions.toLocaleString()} tCO₂e
                      </span>

                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ====================================================== */}
      {/* FEATURED VERIFIED PROJECTS */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm text-[#657064]">
              Verified projects
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Put climate action to work.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#657064]">
              Explore environmental projects that have passed the
              Verdiq verification workflow.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/marketplace")
            }
            className="text-sm font-medium text-[#4d8b55] hover:underline"
          >
            Explore marketplace →
          </button>

        </div>

        {projects.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#dce3d8] bg-white p-8 text-center">

            <p className="text-sm text-[#657064]">
              No verified projects are currently available.
            </p>

          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-3xl border border-[#dce3d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-center justify-between gap-3">

                  <span className="rounded-full bg-[#edf5ea] px-3 py-1 text-xs font-medium text-[#37643d]">
                    ✓ Verified
                  </span>

                  <span className="text-xs text-[#7b8578]">
                    {project.project_type}
                  </span>

                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  {project.name}
                </h3>

                <p className="mt-2 text-sm text-[#657064]">
                  {project.location}
                </p>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#657064]">
                  {project.description ||
                    "Verified environmental project."}
                </p>

                <div className="mt-6 rounded-2xl bg-[#fbfcfa] p-4">

                  <p className="text-xs text-[#7b8578]">
                    Marketplace availability
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {project.available_credits.toLocaleString()}
                  </p>

                  <p className="text-xs text-[#7b8578]">
                    credits currently listed
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/marketplace")
                  }
                  className="mt-5 w-full rounded-xl bg-[#172018] px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                >
                  Explore credits →
                </button>

              </article>
            ))}

          </div>
        )}
      </section>

      {/* ====================================================== */}
      {/* GOVERNMENT CLIMATE ACTION */}
      {/* ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">

            <p className="text-sm text-[#657064]">
              Climate action resources
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Connect with official climate initiatives.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#657064]">
              Verdiq complements public climate programs by making
              project activity, credits, purchases, retirement, and
              impact records easier to understand.
            </p>

          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <a
              href="https://www.india.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-sm"
            >

              <p className="text-xs font-medium uppercase tracking-wide text-[#7b8578]">
                Government of India
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                National climate resources
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Explore official government information and national
                programs.
              </p>

              <p className="mt-4 text-sm font-medium text-[#4d8b55]">
                Visit official portal →
              </p>

            </a>

            <a
              href="https://moef.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-sm"
            >

              <p className="text-xs font-medium uppercase tracking-wide text-[#7b8578]">
                Ministry of Environment
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                Environmental policy
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Access official environmental policy and climate
                information.
              </p>

              <p className="mt-4 text-sm font-medium text-[#4d8b55]">
                Visit official portal →
              </p>

            </a>

            <a
              href="https://missionlife-moefcc.nic.in/"
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border border-[#dce3d8] bg-[#fbfcfa] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-sm"
            >

              <p className="text-xs font-medium uppercase tracking-wide text-[#7b8578]">
                Mission LiFE
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                Lifestyle for Environment
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#657064]">
                Explore India's public climate-action movement.
              </p>

              <p className="mt-4 text-sm font-medium text-[#4d8b55]">
                Visit official portal →
              </p>

            </a>

          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* HOW VERDIQ WORKS */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

        <p className="text-sm text-[#657064]">
          How Verdiq works
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          From project to proof.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-4">

          {[
            [
              "01",
              "Measure",
              "Calculate and report emissions.",
            ],

            [
              "02",
              "Verify",
              "Audit projects and approve issuance.",
            ],

            [
              "03",
              "Trade",
              "Buy verified credits through the marketplace.",
            ],

            [
              "04",
              "Retire",
              "Permanently retire credits and generate proof.",
            ],
          ].map(
            ([
              number,
              title,
              description,
            ]) => (
              <div
                key={number}
                className="rounded-3xl border border-[#dce3d8] bg-white p-6"
              >

                <p className="text-sm text-[#7b8578]">
                  {number}
                </p>

                <h3 className="mt-4 text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#657064]">
                  {description}
                </p>

              </div>
            ),
          )}

        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="border-t border-[#dce3d8] bg-[#172018] text-white">

        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-16">

          <div className="max-w-3xl">

            <p className="text-sm text-[#bcc7b9]">
              Start your climate action journey
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Measure it. Verify it. Retire it. Prove it.
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/marketplace")
                }
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#172018]"
              >
                Explore marketplace
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                className="rounded-full border border-[#556054] px-6 py-3 text-sm font-medium text-white"
              >
                Join Verdiq
              </button>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;