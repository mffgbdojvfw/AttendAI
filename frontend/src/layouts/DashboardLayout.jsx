

import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden sm:px-6">
          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(true)
            }
            aria-label="Open navigation"
            className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Menu size={24} />
          </button>

          <div className="ml-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">
                A
              </span>
            </div>

            <span className="font-bold text-slate-900">
              Attend<span className="text-blue-600">AI</span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100dvh-4rem)] w-full overflow-x-hidden p-4 sm:p-6 lg:min-h-dvh lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;