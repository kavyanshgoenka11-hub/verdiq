import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Calculator from "./pages/Calculator";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import NewProject from "./pages/NewProject";
import AuditorDashboard from "./pages/AuditorDashboard";
import DeveloperProjects from "./pages/DeveloperProjects";
import AuditorProjectReview from "./pages/AuditorProjectReview";
import AdminCredits from "./pages/AdminCredits";
import DeveloperCredits from "./pages/DeveloperCredits";
import Marketplace from "./pages/Marketplace";
import MarketplaceCreditDetails from "./pages/MarketplaceCreditDetails";
import BuyCredits from "./pages/BuyCredits";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import RetireCredits from "./pages/RetireCredits";
import RetirementSuccess from "./pages/RetirementSuccess";
import Certificate from "./pages/Certificate";
import AdminUsers from "./pages/AdminUsers";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Documentation from "./pages/Documentation";
import UseCase from "./pages/UseCase";
import ActivityDiagram from "./pages/ActivityDiagram";
import ClassDiagram from "./pages/ClassDiagram";
import StateDiagram from "./pages/StateDiagram";
import SequenceDiagram from "./pages/SequenceDiagram";
import CollaborationDiagram from "./pages/CollaborationDiagram";
import ComponentDiagram from "./pages/ComponentDiagram";
import CFD from "./pages/CFD";
import DFD from "./pages/DFD";
import Requirements from "./pages/Requirements";
import VerdiqProblemSolution from "./pages/ProblemSolution";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            GLOBAL SITE LAYOUT
            Footer + common site structure
        ===================================================== */}
        <Route element={<SiteLayout />}>

          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/marketplace"
            element={<Marketplace />}
          />

          <Route
            path="/marketplace/credits/:id"
            element={<MarketplaceCreditDetails />}
          />

          <Route
            path="/marketplace/credits/:id/buy"
            element={<BuyCredits />}
          />

          <Route path="/about" element={<About />} />

          <Route
            path="/documentation"
            element={<Documentation />}
          />

          <Route
            path="/use-case"
            element={<UseCase />}
          />

          <Route
            path="/activity-diagram"
            element={<ActivityDiagram />}
          />

          <Route
            path="/class-diagram"
            element={<ClassDiagram />}
          />

          <Route
              path="/calculator"
              element={<Calculator />}
            />

            <Route
            path="/state-diagram"
            element={<StateDiagram />}
          />

           <Route
            path="/sequence-diagram"
            element={<SequenceDiagram />}
          />

          <Route
            path="/collaboration-diagram"
            element={<CollaborationDiagram />}
          />

          <Route
            path="/component-diagram"
            element={<ComponentDiagram />}
          />

          <Route
            path="/cfd-diagram"
            element={<CFD />}
          />

          <Route
            path="/dfd-diagram"
            element={<DFD />}
          />

          <Route
            path="/requirements"
            element={<Requirements />}
          />

          <Route
            path="/problem-solution"
            element={<VerdiqProblemSolution />}
          />


          {/* =================================================
              PROTECTED PAGES
          ================================================= */}
          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            

            <Route
              path="/developer"
              element={<DeveloperDashboard />}
            />

            <Route
              path="/developer/projects/new"
              element={<NewProject />}
            />

            <Route
              path="/developer/projects"
              element={<DeveloperProjects />}
            />

            <Route
              path="/developer/credits"
              element={<DeveloperCredits />}
            />

            <Route
              path="/auditor"
              element={<AuditorDashboard />}
            />

            <Route
              path="/auditor/projects/:id"
              element={<AuditorProjectReview />}
            />

            <Route
              path="/admin/credits"
              element={<AdminCredits />}
            />

            <Route
              path="/purchase/success/:purchaseId"
              element={<PurchaseSuccess />}
            />

            <Route
              path="/retire/:purchaseId"
              element={<RetireCredits />}
            />

            <Route
              path="/retirement/success/:retirementId"
              element={<RetirementSuccess />}
            />

            <Route
              path="/certificate/:certificateId"
              element={<Certificate />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/portfolio"
              element={<Portfolio />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;