import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f3] text-[#172018]">
      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default SiteLayout;