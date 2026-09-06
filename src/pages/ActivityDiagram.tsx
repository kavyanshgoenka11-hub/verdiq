import type { ReactNode } from "react";

/* ============================================================
   TYPES
============================================================ */

type ActivityNodeProps = {
  children: ReactNode;
  variant?:
    | "developer"
    | "auditor"
    | "admin"
    | "buyer"
    | "success"
    | "danger";
  icon?: string;
};

type LaneHeaderProps = {
  letter: string;
  title: string;
  subtitle: string;
  badgeClass: string;
};

/* ============================================================
   ICONS (INLINE SVG)
============================================================ */

function SVGIcon({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) {
  const icons: Record<string, ReactNode> = {
    filePlus: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </>
    ),

    fileText: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),

    cloudUpload: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </>
    ),

    send: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),

    inbox: (
      <>
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),

    folder: (
      <>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </>
    ),

    clipboardCheck: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 14l2 2 4-4" />
      </>
    ),

    xCircle: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </>
    ),

    messageSquare: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </>
    ),

    edit2: (
      <>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </>
    ),

    checkCircle: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),

    shieldCheck: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),

    layers: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 12 12 17 22 12" />
        <polyline points="2 17 12 22 22 17" />
      </>
    ),

    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),

    wallet: (
      <>
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
        <path d="M21 12H16v5h5v-5z" />
      </>
    ),

    store: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),

    listCheck: (
      <>
        <polyline points="3 6 5 8 9 4" />
        <polyline points="3 14 5 16 9 12" />
        <polyline points="3 22 5 24 9 20" />
        <line x1="13" y1="6" x2="21" y2="6" />
        <line x1="13" y1="14" x2="21" y2="14" />
        <line x1="13" y1="22" x2="21" y2="22" />
      </>
    ),

    shoppingCart: (
      <>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </>
    ),

    creditCard: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),

    recycle: (
      <>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </>
    ),

    award: (
      <>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name] || icons.filePlus}
    </svg>
  );
}

/* ============================================================
   ACTIVITY NODE
============================================================ */

function ActivityNode({
  children,
  variant = "developer",
  icon,
}: ActivityNodeProps) {
  const styles = {
    developer: {
      border: "border-[#4a8ad4]",
      background: "bg-[#f4f8fd]",
      text: "text-[#1d4b7e]",
    },

    auditor: {
      border: "border-[#d8a52e]",
      background: "bg-[#fffaf0]",
      text: "text-[#7d5917]",
    },

    admin: {
      border: "border-[#9571c1]",
      background: "bg-[#faf5fd]",
      text: "text-[#5e407e]",
    },

    buyer: {
      border: "border-[#61a36d]",
      background: "bg-[#f4faf5]",
      text: "text-[#34663c]",
    },

    success: {
      border: "border-[#4e9b5a]",
      background: "bg-[#edf8ef]",
      text: "text-[#2e6a38]",
    },

    danger: {
      border: "border-[#d46f6f]",
      background: "bg-[#fff4f4]",
      text: "text-[#8d4040]",
    },
  };

  const style = styles[variant];

  return (
    <div
      className={`relative z-10 mx-auto flex min-h-[52px] w-[220px] items-center rounded-xl border-[2px] px-4 py-3 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${style.border} ${style.background} ${style.text}`}
    >
      {icon && (
        <div className="mr-3 flex shrink-0 items-center justify-center">
          <SVGIcon
            name={icon}
            className="h-5 w-5 opacity-90"
          />
        </div>
      )}

      <div className="flex-1 text-left font-semibold leading-tight">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   ARROWS & SHAPES
============================================================ */

function VerticalArrow({
  color = "#26332a",
}: {
  color?: string;
}) {
  return (
    <div
      className="relative mx-auto h-8 w-px"
      style={{ backgroundColor: color }}
    >
      <span
        className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b-2 border-r-2"
        style={{ borderColor: color }}
      />
    </div>
  );
}

function DecisionDiamond() {
  return (
    <div className="relative z-10 mx-auto h-[100px] w-[100px]">
      <div className="flex h-full w-full rotate-45 items-center justify-center border-2 border-[#dfa92f] bg-[#fff5cf] shadow-sm">
        <span className="-rotate-45 px-2 text-center text-[11px] font-bold leading-[1.2] text-[#775514]">
          Project
          <br />
          approved?
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   LANE HEADER
============================================================ */

function LaneHeader({
  letter,
  title,
  subtitle,
  badgeClass,
}: LaneHeaderProps) {
  return (
    <div className="border-b border-[#cdd6ce] px-5 py-5">
      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${badgeClass}`}
        >
          {letter}
        </div>

        <div>

          <h3 className="text-lg font-bold tracking-tight text-[#172018]">
            {title}
          </h3>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#657064]">
            {subtitle}
          </p>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   FINAL COMPONENT
============================================================ */

function ActivityDiagram() {
  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ======================================================
          PAGE INTRO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">

        <div className="max-w-4xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">

            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />

            UML · Activity Diagram

          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">

            Verdiq

            <span className="text-[#4d8b55]">
              {" "}Carbon Credit Lifecycle
            </span>

          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            A complete swimlane activity diagram showing how a project moves
            from creation and verification through credit issuance, marketplace
            listing, purchase, retirement, and certification.
          </p>

        </div>

      </section>


      {/* ======================================================
          DIAGRAM SECTION
      ====================================================== */}

      <section className="border-y border-[#dce3d8] bg-white">

        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">

          <div className="overflow-x-auto pb-4">

            <div className="min-w-[1260px]">

              <div className="overflow-hidden rounded-2xl border border-[#bcc8be] bg-white shadow-[0_16px_50px_rgba(25,45,30,0.10)]">


                {/* ==================================================
                    DIAGRAM HEADER
                ================================================== */}

                <div className="border-b border-[#ccd5cd] bg-white px-8 py-7">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                    Formal swimlane activity model
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    Verdiq — Carbon Credit Lifecycle
                  </h2>

                </div>


                {/* ==================================================
                    ACTOR LANE HEADERS
                ================================================== */}

                <div className="relative z-20 grid grid-cols-4 bg-white">

                  {/* Developer */}
                  <div className="bg-[#eaf3fd]">

                    <LaneHeader
                      letter="D"
                      title="DEVELOPER"
                      subtitle="Environmental project owner"
                      badgeClass="bg-[#2e73b7] text-white"
                    />

                  </div>


                  {/* Auditor */}
                  <div className="border-l border-[#cdd6ce] bg-[#fff8e7]">

                    <LaneHeader
                      letter="A"
                      title="AUDITOR"
                      subtitle="Project verification role"
                      badgeClass="bg-[#d79a16] text-white"
                    />

                  </div>


                  {/* Administrator */}
                  <div className="border-l border-[#cdd6ce] bg-[#f4edfa]">

                    <LaneHeader
                      letter="A"
                      title="ADMINISTRATOR"
                      subtitle="Platform control and issuance"
                      badgeClass="bg-[#7b55a4] text-white"
                    />

                  </div>


                  {/* Buyer */}
                  <div className="border-l border-[#cdd6ce] bg-[#edf8ee]">

                    <LaneHeader
                      letter="B"
                      title="BUYER"
                      subtitle="Corporate / organizational participant"
                      badgeClass="bg-[#3b8646] text-white"
                    />

                  </div>

                </div>


                {/* ==================================================
                    FLOW DIAGRAM
                ================================================== */}

                <div className="relative">


                  {/* ==================================================
                      BAND 1 — DEVELOPER INITIAL FLOW
                  ================================================== */}

                  <div className="grid grid-cols-4">

                    <div className="flex flex-col items-center border-r border-[#cdd6ce] bg-[#f4f8fd] py-8">

                      <div className="flex flex-col items-center">

                        <div className="h-6 w-6 rounded-full bg-[#172018]" />

                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#657064]">
                          Initial Node
                        </p>

                      </div>

                      <VerticalArrow />

                      <ActivityNode
                        variant="developer"
                        icon="filePlus"
                      >
                        Create new project
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="developer"
                        icon="fileText"
                      >
                        Enter project details
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="developer"
                        icon="cloudUpload"
                      >
                        Upload supporting documents
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="developer"
                        icon="send"
                      >
                        Submit project for verification
                      </ActivityNode>

                    </div>


                    <div className="border-r border-[#cdd6ce] bg-[#fffaf0]" />

                    <div className="border-r border-[#cdd6ce] bg-[#faf5fd]" />

                    <div className="bg-[#f4faf5]" />

                  </div>


                  {/* ==================================================
                      BAND 2 — DEVELOPER → AUDITOR
                  ================================================== */}

                  <div className="relative h-16 bg-white">

                    <div className="absolute left-[20%] top-1/2 h-[2px] w-[9%] -translate-y-1/2 bg-[#26332a]" />

                    <span className="absolute left-[28.2%] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-[#26332a]" />

                    <span className="absolute left-[24.5%] top-1/2 -translate-x-1/2 -translate-y-[145%] whitespace-nowrap rounded-full border border-[#d3dcd3] bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[#536156] shadow-sm">
                      Submitted → Auditor
                    </span>

                  </div>


                  {/* ==================================================
                      BAND 3 — AUDITOR REVIEW
                  ================================================== */}

                  <div className="relative grid grid-cols-4">

                    <div className="border-r border-[#cdd6ce] bg-[#f4f8fd]" />

                    <div className="flex flex-col items-center border-r border-[#cdd6ce] bg-[#fffaf0] pb-2 pt-4">

                      <ActivityNode
                        variant="auditor"
                        icon="inbox"
                      >
                        Receive project for review
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="auditor"
                        icon="search"
                      >
                        Review project details
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="auditor"
                        icon="folder"
                      >
                        Review supporting documents
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="auditor"
                        icon="clipboardCheck"
                      >
                        Perform audit and record findings
                      </ActivityNode>

                      <VerticalArrow />

                    </div>

                    <div className="border-r border-[#cdd6ce] bg-[#faf5fd]" />

                    <div className="bg-[#f4faf5]" />

                  </div>


                  {/* ==================================================
                      BAND 3.5 — DECISION
                  ================================================== */}

                  <div className="relative grid grid-cols-4">

                    <div className="border-r border-[#cdd6ce] bg-[#f4f8fd]" />


                    <div className="relative flex h-[164px] justify-center border-r border-[#cdd6ce] bg-[#fffaf0] py-4">

                      <div className="absolute top-[-18px] flex w-full flex-col items-center">

                        <VerticalArrow />

                        <DecisionDiamond />

                      </div>


                      {/* YES */}
                      <div className="absolute right-0 top-[65px] h-[2px] w-[calc(50%-50px)] bg-[#4e9b5a]" />

                      <span className="absolute right-6 top-[48px] font-bold text-xs text-[#4e9b5a]">
                        YES
                      </span>


                      {/* NO */}
                      <div className="absolute left-1/2 top-[188px] h-[7px] w-[2px] -translate-x-1/2 bg-[#d56f6f]" />

                      <span className="absolute left-[calc(50%-50px)] top-[138px] font-bold text-xs text-[#d56f6f]">
                        NO
                      </span>

                    </div>


                    {/* YES → ADMIN */}
                    <div className="relative border-r border-[#cdd6ce] bg-[#faf5fd]">

                      <div className="absolute left-0 top-[65px] h-[2px] w-[50%] bg-[#4e9b5a]" />

                      <div className="absolute left-[calc(50%-1px)] top-[65px] h-[88px] w-[2px] bg-[#4e9b5a]">

                        <span className="absolute bottom-0 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#4e9b5a]" />

                      </div>

                    </div>


                    <div className="bg-[#f4faf5]" />

                  </div>


                  {/* ==================================================
                      BAND 4 — REJECTION + APPROVAL
                  ================================================== */}

                  <div className="relative grid grid-cols-4">


                    {/* ==================================================
                        DEVELOPER — RECEIVE REJECTION
                    ================================================== */}

                    <div className="relative flex flex-col items-center border-r border-[#cdd6ce] bg-[#f4f8fd] py-6">

                      <ActivityNode
                        variant="developer"
                        icon="messageSquare"
                      >
                        Receive rejection & feedback
                      </ActivityNode>
                      <VerticalArrow/>
                      <ActivityNode
                        variant="developer"
                        icon="edit2"
                      >
                        Make necessary changes
                      </ActivityNode>
                      <VerticalArrow/>
                      <ActivityNode
                        variant="developer"
                        icon="send"
                      >
                        Resubmit project for verification
                      </ActivityNode>


                      {/* Auditor → Developer rejection arrow */}
                      <div className="absolute right-0 top-[48px] h-[2px] w-[10%] bg-[#d46f6f]" />

                      <span className="absolute right-[8.5%] top-[48px] h-3 w-3 -translate-y-1/2 rotate-[225deg] border-r-2 border-t-2 border-[#d46f6f]" />

                    </div>


                    {/* ==================================================
                        AUDITOR — SEND REJECTION
                    ================================================== */}

                    <div className="relative flex flex-col items-center border-r border-[#cdd6ce] bg-[#fffaf0] py-7">

                      <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 flex-col items-center">

                        <div className="relative h-5 w-px bg-[#d46f6f]">

                          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#d46f6f]" />

                        </div>

                      </div>


                      <ActivityNode
                        variant="danger"
                        icon="xCircle"
                      >
                        Send rejection with feedback
                      </ActivityNode>


                      <p className="mt-2 text-center text-[10px] font-medium text-[#9a6b6b]">
                        Feedback returns to Developer
                      </p>
                      <div className="relative flex flex-col items-center  bg-[#fffaf0] py-25">
                      <ActivityNode
                        variant="auditor"
                        icon="inbox"
                      >
                        Receive project for review
                      </ActivityNode>
                      <p className="mt-2 text-center text-[10px] font-semibold text-[#775514]">
                        Repeat verification cycle
                      </p>
                      </div>

                    </div>


                    {/* ==================================================
                        ADMIN — APPROVAL
                    ================================================== */}

                    <div className="relative flex flex-col items-center border-r border-[#cdd6ce] bg-[#faf5fd] py-0">

                      <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 flex-col items-center">

                        <div className="relative h-5 w-px bg-[#4e9b5a]">

                          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#4e9b5a]" />

                        </div>

                      </div>


                      <ActivityNode
                        variant="admin"
                        icon="checkCircle"
                      >
                        Receive approved project
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="admin"
                        icon="shieldCheck"
                      >
                        Validate approved issuance quantity
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="admin"
                        icon="layers"
                      >
                        Issue carbon-credit batch
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="admin"
                        icon="user"
                      >
                        Assign credits to developer account
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="admin"
                        icon="bell"
                      >
                        Notify developer
                      </ActivityNode>

                    </div>


                    {/* Buyer */}
                    <div className="bg-[#f4faf5]" />

                  </div>


                  {/* ==================================================
                      BAND 5 — MAKE NECESSARY CHANGES
                  ================================================== */}

                  <div className="relative grid grid-cols-4">


                    {/* Developer */}
                    <div className="flex flex-col items-center border-r border-[#cdd6ce] bg-[#f4f8fd] py-4">

                    

                      

                    </div>


                    {/* Auditor */}
                    <div className="border-r border-[#cdd6ce] bg-[#fffaf0]" />

                    {/* Admin */}
                    <div className="border-r border-[#cdd6ce] bg-[#faf5fd]" />

                    {/* Buyer */}
                    <div className="bg-[#f4faf5]" />

                  </div>


                  {/* ==================================================
                      BAND 6 — RESUBMIT → RECEIVE PROJECT
                  ================================================== */}

                  <div className="relative grid grid-cols-4">


                    {/* ==================================================
                        DEVELOPER — RESUBMIT
                    ================================================== */}

                    <div className="flex flex-col items-center border-r border-[#cdd6ce] bg-[#f4f8fd] py-4">

                      

                    </div>


                    {/* ==================================================
                        AUDITOR — RECEIVE AGAIN
                    ================================================== */}

                    <div className="relative flex flex-col items-center border-r border-[#cdd6ce] bg-[#fffaf0] py-4">

                    </div>


                    {/* Admin */}
                    <div className="border-r border-[#cdd6ce] bg-[#faf5fd]" />

                    {/* Buyer */}
                    <div className="bg-[#f4faf5]" />


                    {/* ==================================================
                        RESUBMIT → RECEIVE REVIEW ARROW
                    ================================================== */}

                    <div
                      className="absolute top-[40px] h-[2px] bg-[#d9a62e]"
                      style={{
                        left: "calc(12.5% + 110px)",
                        right: "calc(62.5% + 110px)",
                      }}
                    />


                    {/* Arrow head */}
                    <span
                      className="absolute top-[40px] h-3 w-3 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-[#d9a62e]"
                      style={{
                        left: "calc(37.5% - 110px)",
                      }}
                    />


                    {/* Connector label */}
                    <span
                      className="absolute top-[-180px] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#d3dcd3] bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[#775514] shadow-sm"
                      style={{
                        left: "25%",
                      }}
                    >
                      Resubmitted → Review Again
                    </span>

                  </div>


                  {/* ==================================================
                      BAND 7 — SPACER
                  ================================================== */}

                  <div className="grid grid-cols-4">

                    <div className="border-r border-[#cdd6ce] bg-[#f4f8fd]" />

                    <div className="border-r border-[#cdd6ce] bg-[#fffaf0]" />

                    <div className="border-r border-[#cdd6ce] bg-[#faf5fd]" />

                    <div className="bg-[#f4faf5]" />

                  </div>


                  {/* ==================================================
                      BAND 8 — ADMIN → DEVELOPER INVENTORY
                  ================================================== */}

                  <div className="relative h-16 bg-white">

                    <div className="absolute left-[22%] right-[28%] top-1/2 h-[2px] -translate-y-1/2 bg-[#26332a]" />

                    <span className="absolute left-[21.4%] top-1/2 h-3 w-3 -translate-y-1/2 rotate-[225deg] border-r-2 border-t-2 border-[#26332a]" />

                    <span className="absolute left-[42.8%] top-1/2 -translate-x-1/2 -translate-y-[145%] whitespace-nowrap rounded-full border border-[#d3dcd3] bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[#536156] shadow-sm">
                      Credits → Developer inventory
                    </span>

                  </div>


                  {/* ==================================================
                      BAND 9 — DEVELOPER CREDIT INVENTORY
                  ================================================== */}

                  <div className="relative grid grid-cols-4">

                    <div className="flex flex-col items-center border-r border-[#cdd6ce] bg-[#f4f8fd] py-4">

                      <VerticalArrow />

                      <ActivityNode
                        variant="success"
                        icon="wallet"
                      >
                        Receive issued credits in account
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="developer"
                        icon="store"
                      >
                        List credits for sale in marketplace
                      </ActivityNode>

                    </div>


                    <div className="border-r border-[#cdd6ce] bg-[#fffaf0]" />

                    <div className="border-r border-[#cdd6ce] bg-[#faf5fd]" />

                    <div className="bg-[#f4faf5]" />

                  </div>


                  {/* ==================================================
                      BAND 10 — MARKETPLACE → BUYER
                  ================================================== */}

                  <div className="relative h-16 bg-white">

                    <div className="absolute left-[20%] right-[20%] top-1/2 h-[2px] -translate-y-1/2 bg-[#26332a]" />

                    <span className="absolute right-[19.3%] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-[#26332a]" />

                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[145%] whitespace-nowrap rounded-full border border-[#d3dcd3] bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[#536156] shadow-sm">
                      Marketplace → Buyer
                    </span>

                  </div>


                  {/* ==================================================
                      BAND 11 — BUYER FLOW
                  ================================================== */}

                  <div className="relative grid grid-cols-4">


                    {/* Developer */}
                    <div className="border-r border-[#cdd6ce] bg-[#f4f8fd]" />


                    {/* Auditor */}
                    <div className="border-r border-[#cdd6ce] bg-[#fffaf0]" />


                    {/* Admin */}
                    <div className="border-r border-[#cdd6ce] bg-[#faf5fd]" />


                    {/* Buyer */}
                    <div className="flex flex-col items-center bg-[#f4faf5] pb-10 pt-4">

                      <ActivityNode
                        variant="buyer"
                        icon="listCheck"
                      >
                        Browse available credit listings
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="buyer"
                        icon="shoppingCart"
                      >
                        Select credits & purchase
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="buyer"
                        icon="creditCard"
                      >
                        Complete purchase transaction
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="buyer"
                        icon="wallet"
                      >
                        Credits added to buyer portfolio
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="buyer"
                        icon="recycle"
                      >
                        Retire purchased credits
                      </ActivityNode>

                      <VerticalArrow />

                      <ActivityNode
                        variant="success"
                        icon="award"
                      >
                        Generate retirement certificate
                      </ActivityNode>

                      <VerticalArrow />

                      <div className="mt-2 flex flex-col items-center">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-[4px] border-[#26332a] bg-white">

                          <div className="h-4 w-4 rounded-full bg-[#26332a]" />

                        </div>

                        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#4d654f]">
                          Final node
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    LEGEND
                ================================================== */}

                <div className="border-t border-[#cdd6ce] bg-[#fbfcfa] px-8 py-7">

                  <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">


                    {/* UML notation */}
                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#526257]">
                        UML notation
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">

                        <div className="flex items-center gap-3 text-xs font-medium text-[#526057]">

                          <div className="h-5 w-5 rounded-full bg-[#172018]" />

                          Initial node

                        </div>


                        <div className="flex items-center gap-3 text-xs font-medium text-[#526057]">

                          <div className="h-6 w-10 rounded-lg border-2 border-[#7399c1] bg-[#f4f8fd]" />

                          Activity

                        </div>


                        <div className="flex items-center gap-3 text-xs font-medium text-[#526057]">

                          <div className="h-5 w-5 rotate-45 border-2 border-[#dfa92f] bg-[#fff5cf]" />

                          Decision

                        </div>


                        <div className="flex items-center gap-3 text-xs font-medium text-[#526057]">

                          <span className="text-lg font-bold">
                            →
                          </span>

                          Control flow

                        </div>


                        <div className="flex items-center gap-3 text-xs font-medium text-[#526057]">

                          <span className="rounded-full border border-dashed border-[#9d7676] bg-white px-2 py-1 text-[9px] font-semibold text-[#8b4a4a]">
                            ↶
                          </span>

                          Repeat flow

                        </div>


                        <div className="flex items-center gap-3 text-xs font-medium text-[#526057]">

                          <div className="flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#26332a] bg-white">

                            <div className="h-2 w-2 rounded-full bg-[#26332a]" />

                          </div>

                          Final node

                        </div>

                      </div>

                    </div>


                    {/* Lifecycle logic */}
                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#526257]">
                        Lifecycle logic
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">

                        <div className="rounded-2xl border border-[#9fcaa5] bg-[#edf8ef] p-4">

                          <p className="text-sm font-semibold text-[#35653c]">
                            Approved path
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#5e7161]">
                            Auditor approval → Admin validates quantity →
                            credits are issued → developer receives inventory →
                            credits are listed → buyer purchases and retires.
                          </p>

                        </div>


                        <div className="rounded-2xl border border-[#dda0a0] bg-[#fff3f3] p-4">

                          <p className="text-sm font-semibold text-[#8b4040]">
                            Rejected path
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#6f6060]">
                            Auditor rejection → developer receives feedback →
                            changes are made → project is resubmitted →
                            auditor reviews it again.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default ActivityDiagram;