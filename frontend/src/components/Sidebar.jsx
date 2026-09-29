// // import { NavLink } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   Users,
// //   ClipboardCheck,
// //   ScanFace,
// //   Settings,
// //   LogOut,
// // } from "lucide-react";

// // function Sidebar() {
// //   const menuItems = [
// //     {
// //       name: "Dashboard",
// //       path: "/",
// //       icon: LayoutDashboard,
// //     },
// //     {
// //       name: "Students",
// //       path: "/students",
// //       icon: Users,
// //     },
// //     {
// //       name: "Attendance",
// //       path: "/attendance",
// //       icon: ClipboardCheck,
// //     },
// //   ];

// //   return (
// //     <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

// //       {/* Logo */}
// //       <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
// //         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
// //           <ScanFace className="text-white" size={23} />
// //         </div>

// //         <div>
// //           <h1 className="text-xl font-bold text-slate-900">
// //             Attend<span className="text-blue-600">AI</span>
// //           </h1>

// //           <p className="text-xs text-slate-400">
// //             Smart Attendance
// //           </p>
// //         </div>
// //       </div>

// //       {/* Navigation */}
// //       <nav className="flex-1 space-y-2 px-4 py-6">
// //         <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
// //           Main Menu
// //         </p>

// //         {menuItems.map((item) => {
// //           const Icon = item.icon;

// //           return (
// //             <NavLink
// //               key={item.path}
// //               to={item.path}
// //               end={item.path === "/"}
// //               className={({ isActive }) =>
// //                 `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
// //                   isActive
// //                     ? "bg-blue-50 text-blue-600"
// //                     : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
// //                 }`
// //               }
// //             >
// //               <Icon size={20} />
// //               {item.name}
// //             </NavLink>
// //           );
// //         })}
// //       </nav>

// //       {/* Bottom Section */}
// //       <div className="border-t border-slate-100 p-4">

// //         <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
// //           <Settings size={19} />
// //           Settings
// //         </button>

// //         <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50">
// //           <LogOut size={19} />
// //           Logout
// //         </button>

// //       </div>
// //     </aside>
// //   );
// // }

// // export default Sidebar;



// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   ClipboardCheck,
//   History,
//   ScanFace,
//   Settings,
//   LogOut,
// } from "lucide-react";

// function Sidebar() {
//   const menuItems = [
//     {
//       name: "Dashboard",
//       path: "/",
//       icon: LayoutDashboard,
//     },
//     {
//       name: "Students",
//       path: "/students",
//       icon: Users,
//     },
//     {
//       name: "Attendance",
//       path: "/attendance",
//       icon: ClipboardCheck,
//     },
//     {
//       name: "Attendance History",
//       path: "/attendance-history",
//       icon: History,
//     },
//   ];

//   return (
//     <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

//       {/* Logo */}
//       <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
//           <ScanFace className="text-white" size={23} />
//         </div>

//         <div>
//           <h1 className="text-xl font-bold text-slate-900">
//             Attend<span className="text-blue-600">AI</span>
//           </h1>

//           <p className="text-xs text-slate-400">
//             Smart Attendance
//           </p>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-2 px-4 py-6">
//         <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
//           Main Menu
//         </p>

//         {menuItems.map((item) => {
//           const Icon = item.icon;

//           return (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/"}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
//                   isActive
//                     ? "bg-blue-50 text-blue-600"
//                     : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
//                 }`
//               }
//             >
//               <Icon size={20} />
//               {item.name}
//             </NavLink>
//           );
//         })}
//       </nav>

//       {/* Bottom Section */}
//       {/* <div className="border-t border-slate-100 p-4">

//         <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
//           <Settings size={19} />
//           Settings
//         </button>

//         <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50">
//           <LogOut size={19} />
//           Logout
//         </button>

//       </div> */}
//     </aside>
//   );
// }

// export default Sidebar;


import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  History,
  ScanFace,
  Settings,
  LogOut,
  X,
} from "lucide-react";

function Sidebar({ mobileOpen = false, onClose }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: ClipboardCheck,
    },
    {
      name: "Attendance History",
      path: "/attendance-history",
      icon: History,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-pointer bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300 ease-in-out
          lg:w-64 lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <ScanFace
                className="text-white"
                size={23}
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Attend<span className="text-blue-600">AI</span>
              </h1>

              <p className="text-xs text-slate-400">
                Smart Attendance
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 sm:px-4 sm:py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:mb-4">
            Main Menu
          </p>

          <div className="space-y-1.5 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon
                    size={20}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        
      </aside>
    </>
  );
}

export default Sidebar;