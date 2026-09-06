import React from "react";

/* ============================================================
   TYPES & INTERFACES
============================================================ */

interface EnumBoxProps {
  title: string;
  items: string[];
  headerBg: string;
  borderColor: string;
}

interface ClassCardProps {
  title: string;
  attributes: string[];
  methods?: string[];
  headerBg: string;
  borderColor: string;
  style?: React.CSSProperties;
  className?: string;
}

/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

function EnumCard({ title, items, headerBg, borderColor }: EnumBoxProps) {
  return (
    <div className={`w-full overflow-hidden rounded-md border ${borderColor} bg-white shadow-xs`}>
      <div className={`${headerBg} px-2 py-1 text-center font-bold text-[11px] text-slate-800 border-b ${borderColor}`}>
        {title}
      </div>
      <div className="p-1.5 font-mono text-[9.5px] font-semibold leading-tight text-slate-700 space-y-0.5">
        {items.map((item, idx) => (
          <div key={idx} className="tracking-tight uppercase">{item}</div>
        ))}
      </div>
    </div>
  );
}

function ClassCard({ title, attributes, methods, headerBg, borderColor, style, className = "" }: ClassCardProps) {
  return (
    <div
      style={style}
      className={`absolute overflow-hidden rounded-lg border-[1.5px] ${borderColor} bg-white shadow-md transition-shadow hover:shadow-lg ${className}`}
    >
      {/* Header */}
      <div className={`${headerBg} px-3 py-1.5 text-center font-bold text-[12px] text-white tracking-wide shadow-xs`}>
        {title}
      </div>

      {/* Attributes */}
      <div className="p-2 font-mono text-[10px] leading-snug text-slate-800 space-y-0.5">
        {attributes.map((attr, idx) => {
          const isPK = attr.includes("(PK)");
          const isFK = attr.includes("(FK)");
          return (
            <div key={idx} className={`${isPK || isFK ? "font-semibold text-slate-900" : ""}`}>
              {attr}
            </div>
          );
        })}
      </div>

      {/* Methods */}
      {methods && methods.length > 0 && (
        <div className={`border-t ${borderColor} p-2 font-mono text-[10px] leading-snug text-slate-900 space-y-0.5 bg-slate-50/60`}>
          {methods.map((method, idx) => (
            <div key={idx} className="font-medium text-slate-800">{method}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN CLASS DIAGRAM COMPONENT WITH PRECISE SVG ARROWS
============================================================ */


export default function ClassDiagram() {
  return (
    <main className="min-h-screen bg-[#f6f8f3] text-[#172018]">

      {/* ================= PAGE INTRO ================= */}
      <section className="mx-auto max-w-7xl px-8 pb-14 pt-16 lg:px-16 lg:pb-16 lg:pt-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c6d5c3] bg-[#eef5eb] px-4 py-2 text-sm font-medium text-[#37643d]">
            <span className="h-2 w-2 rounded-full bg-[#4d8b55]" />
            UML · Class Diagram
          </div>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            Verdiq
            <span className="text-[#4d8b55]"> Class Diagram</span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-[#657064]">
            A structural view of the Verdiq platform showing its core
            classes, attributes, operations, enumerations, and relationships
            across the carbon-credit lifecycle.
          </p>
        </div>
      </section>

      {/* ================= DOCUMENTATION CONTAINER ================= */}
      <section className="border-y border-[#dce3d8] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="overflow-hidden rounded-2xl border border-[#bcc8be] bg-white shadow-[0_16px_50px_rgba(25,45,30,0.10)]">

            {/* ================= DIAGRAM HEADER ================= */}
            <div className="border-b border-[#ccd5cd] bg-white px-8 py-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53715a]">
                Formal UML structural model
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Verdiq — Class Diagram
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#657064]">
                Core domain classes, attributes, operations, enumerations,
                and associations used by the Verdiq application.
              </p>
            </div>

            {/* ================= EXISTING DIAGRAM (UNCHANGED) ================= */}
            <div className="bg-[#fbfcfa] p-5 sm:p-8 lg:p-10">
              <div className="overflow-x-auto pb-4">
                <div className="flex min-w-[1450px] justify-center">

                  <div className="relative w-[1400px] h-[950px] rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-2xl overflow-hidden select-none">

        {/* Title */}
        <div className="w-full text-center pt-1 pb-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Verdiq Carbon Impact Platform – Class Diagram
          </h1>
        </div>

        {/* ================= LEFT SIDEBAR: ENUMERATIONS ================= */}
        <div className="absolute left-4 top-14 w-[130px] h-[875px] rounded-xl border border-slate-200 bg-slate-50/80 p-2 space-y-2.5 shadow-xs">
          <div className="text-center font-extrabold text-[10px] uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-1">
            ENUMERATIONS
          </div>

          <EnumCard
            title="UserRole"
            items={["BUYER", "DEVELOPER", "AUDITOR", "ADMIN"]}
            headerBg="bg-blue-100"
            borderColor="border-blue-300"
          />
          <EnumCard
            title="UserStatus"
            items={["ACTIVE", "INACTIVE", "SUSPENDED"]}
            headerBg="bg-purple-100"
            borderColor="border-purple-300"
          />
          <EnumCard
            title="ProjectStatus"
            items={["DRAFT", "UNDER_REVIEW", "VERIFIED", "REJECTED"]}
            headerBg="bg-amber-100"
            borderColor="border-amber-300"
          />
          <EnumCard
            title="AuditStatus"
            items={["PENDING", "APPROVED", "REJECTED"]}
            headerBg="bg-amber-100"
            borderColor="border-amber-300"
          />
          <EnumCard
            title="CreditStatus"
            items={["ISSUED", "LISTED", "SOLD", "RETIRED"]}
            headerBg="bg-purple-100"
            borderColor="border-purple-300"
          />
          <EnumCard
            title="ListingStatus"
            items={["ACTIVE", "SOLD", "DELISTED", "EXPIRED"]}
            headerBg="bg-emerald-100"
            borderColor="border-emerald-300"
          />
          <EnumCard
            title="PurchaseStatus"
            items={["PENDING", "COMPLETED", "CANCELLED"]}
            headerBg="bg-emerald-100"
            borderColor="border-emerald-300"
          />
        </div>

        {/* ================= SVG CONNECTOR LINES & UML ARROWS LAYER ================= */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
          <defs>
            {/* Standard UML Association Open Arrowhead */}
            <marker
              id="uml-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>

            {/* Filled UML Arrowhead for Directional Flow */}
            <marker
              id="uml-arrow-filled"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#334155" />
            </marker>

            <style>{`
              .uml-line { stroke: #334155; stroke-width: 1.5; stroke-linejoin: round; fill: none; }
              .uml-line-dashed { stroke: #475569; stroke-width: 1.25; stroke-dasharray: 4 3; stroke-linejoin: round; fill: none; }
              .uml-label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; fill: #1e293b; font-weight: 600; text-anchor: middle; }
              .uml-role { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 10px; fill: #475569; font-weight: 500; text-anchor: middle; }
              .uml-cardinality { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; fill: #0f172a; font-weight: 700; }
            `}</style>
          </defs>

          {/* -------------------------------------------------------------
              1. USER -> PROJECT (creates)
          ------------------------------------------------------------- */}
          <line x1="370" y1="160" x2="532" y2="160" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="382" y="152" className="uml-cardinality">1</text>
          <text x="450" y="152" className="uml-label">creates</text>
          <text x="508" y="152" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              2. PROJECT -> PROJECT DOCUMENT (has)
          ------------------------------------------------------------- */}
          <line x1="730" y1="160" x2="872" y2="160" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="742" y="152" className="uml-cardinality">1</text>
          <text x="800" y="152" className="uml-label">has</text>
          <text x="848" y="152" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              3. PROJECT -> AUDIT (audited in)
          ------------------------------------------------------------- */}
          <line x1="630" y1="310" x2="630" y2="422" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="615" y="328" className="uml-cardinality">1</text>
          <text x="630" y="370" className="uml-label" transform="rotate(-90, 620, 370)">audited in</text>
          <text x="615" y="410" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              4. AUDIT -> CREDIT (approved -> generates)
          ------------------------------------------------------------- */}
          <line x1="730" y1="530" x2="872" y2="530" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="732" y="522" className="uml-cardinality">1</text>
          <text x="800" y="520" className="uml-label">approved → generates</text>
          <text x="862" y="522" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              5. CREDIT -> MARKETPLACE LISTING (listed as)
          ------------------------------------------------------------- */}
          <line x1="1070" y1="530" x2="1162" y2="530" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="1082" y="522" className="uml-cardinality">1</text>
          <text x="1116" y="520" className="uml-label">listed as</text>
          <text x="1142" y="522" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              6. MARKETPLACE LISTING -> PURCHASE (purchased through)
          ------------------------------------------------------------- */}
          <line x1="1265" y1="620" x2="1265" y2="712" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="1280" y="638" className="uml-cardinality">1</text>
          <text x="1255" y="670" className="uml-label" transform="rotate(-90, 1255, 670)">purchased through</text>
          <text x="1280" y="700" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              7. PURCHASE -> RETIREMENT (retires)
          ------------------------------------------------------------- */}
          <line x1="1170" y1="785" x2="1082" y2="785" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="1152" y="777" className="uml-cardinality">1</text>
          <text x="1126" y="777" className="uml-label">retires</text>
          <text x="1094" y="777" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              8. RETIREMENT -> CERTIFICATE (generates)
          ------------------------------------------------------------- */}
          <line x1="910" y1="785" x2="852" y2="785" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="895" y="777" className="uml-cardinality">1</text>
          <text x="881" y="800" className="uml-label">generates</text>
          <text x="862" y="777" className="uml-cardinality">0..1</text>

          {/* -------------------------------------------------------------
              9. FOOTPRINT REPORT -> FOOTPRINT INPUT (contains)
          ------------------------------------------------------------- */}
          <line x1="370" y1="785" x2="442" y2="785" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="372" y="760" className="uml-cardinality">1</text>
          <text x="406" y="777" className="uml-label">contains</text>
          <text x="424" y="760" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              10. USER -> FOOTPRINT REPORT
          ------------------------------------------------------------- */}
          <line x1="275" y1="350" x2="275" y2="632" className="uml-line" markerEnd="url(#uml-arrow)" />
          <text x="260" y="370" className="uml-cardinality">1</text>
          <text x="250" y="630" className="uml-cardinality">0..*</text>

          {/* -------------------------------------------------------------
              11. USER MULTI-ROLE BRANCH CONNECTOR BUS (Developer, Auditor, Seller, Buyer)
          ------------------------------------------------------------- */}
          {/* Main bus exit from User right bottom */}
          <path d="M 370 270 L 410 270" className="uml-line-dashed" />
          <line x1="410" y1="210" x2="410" y2="580" className="uml-line-dashed" />

          {/* Branch to Developer */}
          <line x1="410" y1="210" x2="532" y2="210" className="uml-line-dashed" markerEnd="url(#uml-arrow)" />
          <text x="465" y="204" className="uml-role">(as Developer)</text>

          {/* Branch to Auditor */}
          <line x1="410" y1="465" x2="532" y2="465" className="uml-line-dashed" markerEnd="url(#uml-arrow)" />
          <text x="465" y="459" className="uml-role">(as Auditor)</text>

          {/* Branch to Marketplace (Seller) */}
          <path d="M 410 530 L 410 530" className="uml-line-dashed" />
          <path d="M 410 530 L 510 530 L 510 600 L 1162 600" className="uml-line-dashed" markerEnd="url(#uml-arrow)" />
          <text x="465" y="524" className="uml-role">(as Seller)</text>

          {/* Branch to Purchase (Buyer) */}
          <path d="M 410 580 L 1162 580" className="uml-line-dashed" markerEnd="url(#uml-arrow)" />
          <text x="465" y="574" className="uml-role">(as Buyer)</text>

        </svg>

        {/* ================= CLASS CARDS LAYER ================= */}
        
        {/* ROW 1 */}
        {/* User Class */}
        <ClassCard
          title="User"
          headerBg="bg-blue-600"
          borderColor="border-blue-600"
          style={{ left: "165px", top: "70px", width: "205px" }}
          attributes={[
            "- id: int (PK)",
            "- name: varchar",
            "- organization: varchar",
            "- email: varchar (unique)",
            "- password_hash: varchar",
            "- role: UserRole",
            "- status: UserStatus",
            "- created_at: datetime",
            "- updated_at: datetime",
          ]}
          methods={[
            "+ register(): void",
            "+ login(email, pass): boolean",
            "+ updateProfile(): void",
            "+ deactivate(): void",
          ]}
        />

        {/* Project Class */}
        <ClassCard
          title="Project"
          headerBg="bg-amber-500"
          borderColor="border-amber-500"
          style={{ left: "535px", top: "70px", width: "195px" }}
          attributes={[
            "- id: int (PK)",
            "- developer_id: int (FK)",
            "- title: varchar",
            "- description: text",
            "- type: varchar",
            "- location: varchar",
            "- start_date: date",
            "- status: ProjectStatus",
            "- created_at: datetime",
            "- updated_at: datetime",
          ]}
          methods={[
            "+ submitForVerification(): void",
            "+ updateDetails(): void",
          ]}
        />

        {/* ProjectDocument Class */}
        <ClassCard
          title="ProjectDocument"
          headerBg="bg-blue-600"
          borderColor="border-blue-600"
          style={{ left: "875px", top: "70px", width: "195px" }}
          attributes={[
            "- id: int (PK)",
            "- project_id: int (FK)",
            "- name: varchar",
            "- file_url: varchar",
            "- document_type: varchar",
            "- uploaded_at: datetime",
          ]}
          methods={[
            "+ upload(): void",
            "+ delete(): void",
          ]}
        />

        {/* ROW 2 */}
        {/* Audit Class */}
        <ClassCard
          title="Audit"
          headerBg="bg-amber-500"
          borderColor="border-amber-500"
          style={{ left: "535px", top: "425px", width: "195px" }}
          attributes={[
            "- id: int (PK)",
            "- project_id: int (FK)",
            "- auditor_id: int (FK)",
            "- status: AuditStatus",
            "- findings: text",
            "- score: double",
            "- approved_issuance_quantity: double",
            "- audited_at: datetime",
            "- remarks: text",
          ]}
          methods={[
            "+ approve(qty, remarks): void",
            "+ reject(remarks): void",
          ]}
        />

        {/* Credit Class */}
        <ClassCard
          title="Credit"
          headerBg="bg-purple-600"
          borderColor="border-purple-600"
          style={{ left: "875px", top: "425px", width: "195px" }}
          attributes={[
            "- id: int (PK)",
            "- project_id: int (FK)",
            "- serial_number: varchar (unique)",
            "- quantity: double",
            "- issued_quantity: double",
            "- available_quantity: double",
            "- retired_quantity: double",
            "- status: CreditStatus",
            "- issue_date: datetime",
          ]}
          methods={[
            "+ isAvailable(qty: double): boolean",
          ]}
        />

        {/* MarketplaceListing Class */}
        <ClassCard
          title="MarketplaceListing"
          headerBg="bg-emerald-600"
          borderColor="border-emerald-600"
          style={{ left: "1165px", top: "400px", width: "200px" }}
          attributes={[
            "- id: int (PK)",
            "- credit_id: int (FK)",
            "- seller_id: int (FK)",
            "- price_per_unit: double",
            "- quantity_available: double",
            "- status: ListingStatus",
            "- listed_at: datetime",
          ]}
          methods={[
            "+ updatePrice(price: double): void",
            "+ delist(): void",
          ]}
        />

        {/* ROW 3 */}
        {/* FootprintReport Class */}
        <ClassCard
          title="FootprintReport"
          headerBg="bg-emerald-600"
          borderColor="border-emerald-600"
          style={{ left: "165px", top: "645px", width: "205px" }}
          attributes={[
            "- id: int (PK)",
            "- user_id: int (FK)",
            "- reporting_year: int",
            "- scope1_emissions: double",
            "- scope2_emissions: double",
            "- scope3_emissions: double",
            "- total_emissions: double",
            "- status: varchar",
            "- created_at: datetime",
            "- updated_at: datetime",
          ]}
          methods={[
            "+ save(): void",
            "+ finalize(): void",
          ]}
        />

        {/* FootprintInput Class */}
        <ClassCard
          title="FootprintInput"
          headerBg="bg-emerald-600"
          borderColor="border-emerald-600"
          style={{ left: "445px", top: "695px", width: "190px" }}
          attributes={[
            "- id: int (PK)",
            "- report_id: int (FK)",
            "- scope: varchar",
            "- category: varchar",
            "- quantity: double",
            "- unit: varchar",
            "- emission_factor: double",
            "- calculated_emissions: double",
          ]}
          methods={[
            "+ calculate(): void",
          ]}
        />

        {/* Certificate Class */}
        <ClassCard
          title="Certificate"
          headerBg="bg-emerald-600"
          borderColor="border-emerald-600"
          style={{ left: "675px", top: "715px", width: "175px" }}
          attributes={[
            "- id: int (PK)",
            "- retirement_id: int (FK)",
            "- certificate_number: varchar (unique)",
            "- issued_at: datetime",
            "- file_url: varchar",
          ]}
          methods={[
            "+ generateFile(): void",
          ]}
        />

        {/* Retirement Class */}
        <ClassCard
          title="Retirement"
          headerBg="bg-emerald-600"
          borderColor="border-emerald-600"
          style={{ left: "915px", top: "715px", width: "165px" }}
          attributes={[
            "- id: int (PK)",
            "- purchase_id: int (FK)",
            "- buyer_id: int (FK)",
            "- quantity: double",
            "- reason: text",
            "- retired_at: datetime",
          ]}
          methods={[
            "+ retire(): void",
          ]}
        />

        {/* Purchase Class */}
        <ClassCard
          title="Purchase"
          headerBg="bg-emerald-600"
          borderColor="border-emerald-600"
          style={{ left: "1165px", top: "735px", width: "200px" }}
          attributes={[
            "- id: int (PK)",
            "- listing_id: int (FK)",
            "- buyer_id: int (FK)",
            "- quantity: double",
            "- total_amount: double",
            "- purchase_date: datetime",
            "- status: PurchaseStatus",
          ]}
          methods={[
            "+ view(): void",
          ]}
        />

        {/* ================= FOOTER: LEGEND & NOTES ================= */}
        
        {/* Color Legend (Bottom Left) */}
        <div className="absolute left-[165px] bottom-3.5 flex items-center space-x-5 text-xs font-semibold text-slate-800 bg-slate-50/90 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-1.5">
            <span className="h-3.5 w-3.5 rounded-sm bg-blue-600" />
            <span>Developer</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3.5 w-3.5 rounded-sm bg-amber-500" />
            <span>Auditor</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3.5 w-3.5 rounded-sm bg-purple-600" />
            <span>Administrator</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3.5 w-3.5 rounded-sm bg-emerald-600" />
            <span>Buyer</span>
          </div>
          <div className="flex items-center space-x-2 pl-3 border-l border-slate-300">
            <span className="h-[2px] w-5 bg-slate-700 inline-block" />
            <span>Association</span>
          </div>
        </div>

        

      </div>

                </div>
              </div>
            </div>

            {/* ================= SUPPORTING INFORMATION ================= */}
            <div className="border-t border-[#dbe2dc] bg-[#fbfcfa] px-8 py-7">
              <div className="grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Core Platform Structure
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    User, Project, ProjectDocument, Audit, and Credit
                    represent the main verification and carbon-credit
                    lifecycle entities.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Marketplace Structure
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    MarketplaceListing and Purchase represent the listing
                    and buying flow for issued carbon credits.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d8e0d9] bg-white p-5">
                  <p className="text-sm font-semibold text-[#35653c]">
                    Buyer & Retirement Structure
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#657064]">
                    FootprintReport, FootprintInput, Retirement, and
                    Certificate represent the buyer-side reporting and
                    retirement lifecycle.
                  </p>
                </div>

              </div>
            </div>

            {/* ================= NOTE ================= */}
            <div className="border-t border-[#dce3d8] bg-white px-8 py-5">
              <p className="text-xs leading-6 text-[#657064]">
                User roles are represented through the User role attribute
                rather than separate persistent role classes.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
