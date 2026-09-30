// // // // // import { NavLink } from "react-router-dom";
// // // // // import {
// // // // //   LayoutDashboard,
// // // // //   Users,
// // // // //   ClipboardCheck,
// // // // //   ScanFace,
// // // // //   Settings,
// // // // //   LogOut,
// // // // // } from "lucide-react";

// // // // // function Sidebar() {
// // // // //   const menuItems = [
// // // // //     {
// // // // //       name: "Dashboard",
// // // // //       path: "/",
// // // // //       icon: LayoutDashboard,
// // // // //     },
// // // // //     {
// // // // //       name: "Students",
// // // // //       path: "/students",
// // // // //       icon: Users,
// // // // //     },
// // // // //     {
// // // // //       name: "Attendance",
// // // // //       path: "/attendance",
// // // // //       icon: ClipboardCheck,
// // // // //     },
// // // // //   ];

// // // // //   return (
// // // // //     <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

// // // // //       {/* Logo */}
// // // // //       <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
// // // // //         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
// // // // //           <ScanFace className="text-white" size={23} />
// // // // //         </div>

// // // // //         <div>
// // // // //           <h1 className="text-xl font-bold text-slate-900">
// // // // //             Attend<span className="text-blue-600">AI</span>
// // // // //           </h1>

// // // // //           <p className="text-xs text-slate-400">
// // // // //             Smart Attendance
// // // // //           </p>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Navigation */}
// // // // //       <nav className="flex-1 space-y-2 px-4 py-6">
// // // // //         <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
// // // // //           Main Menu
// // // // //         </p>

// // // // //         {menuItems.map((item) => {
// // // // //           const Icon = item.icon;

// // // // //           return (
// // // // //             <NavLink
// // // // //               key={item.path}
// // // // //               to={item.path}
// // // // //               end={item.path === "/"}
// // // // //               className={({ isActive }) =>
// // // // //                 `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
// // // // //                   isActive
// // // // //                     ? "bg-blue-50 text-blue-600"
// // // // //                     : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
// // // // //                 }`
// // // // //               }
// // // // //             >
// // // // //               <Icon size={20} />
// // // // //               {item.name}
// // // // //             </NavLink>
// // // // //           );
// // // // //         })}
// // // // //       </nav>

// // // // //       {/* Bottom Section */}
// // // // //       <div className="border-t border-slate-100 p-4">

// // // // //         <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
// // // // //           <Settings size={19} />
// // // // //           Settings
// // // // //         </button>

// // // // //         <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50">
// // // // //           <LogOut size={19} />
// // // // //           Logout
// // // // //         </button>

// // // // //       </div>
// // // // //     </aside>
// // // // //   );
// // // // // }

// // // // // export default Sidebar;



// // // // import { NavLink } from "react-router-dom";
// // // // import {
// // // //   LayoutDashboard,
// // // //   Users,
// // // //   ClipboardCheck,
// // // //   History,
// // // //   ScanFace,
// // // //   Settings,
// // // //   LogOut,
// // // // } from "lucide-react";

// // // // function Sidebar() {
// // // //   const menuItems = [
// // // //     {
// // // //       name: "Dashboard",
// // // //       path: "/",
// // // //       icon: LayoutDashboard,
// // // //     },
// // // //     {
// // // //       name: "Students",
// // // //       path: "/students",
// // // //       icon: Users,
// // // //     },
// // // //     {
// // // //       name: "Attendance",
// // // //       path: "/attendance",
// // // //       icon: ClipboardCheck,
// // // //     },
// // // //     {
// // // //       name: "Attendance History",
// // // //       path: "/attendance-history",
// // // //       icon: History,
// // // //     },
// // // //   ];

// // // //   return (
// // // //     <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

// // // //       {/* Logo */}
// // // //       <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
// // // //         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
// // // //           <ScanFace className="text-white" size={23} />
// // // //         </div>

// // // //         <div>
// // // //           <h1 className="text-xl font-bold text-slate-900">
// // // //             Attend<span className="text-blue-600">AI</span>
// // // //           </h1>

// // // //           <p className="text-xs text-slate-400">
// // // //             Smart Attendance
// // // //           </p>
// // // //         </div>
// // // //       </div>

// // // //       {/* Navigation */}
// // // //       <nav className="flex-1 space-y-2 px-4 py-6">
// // // //         <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
// // // //           Main Menu
// // // //         </p>

// // // //         {menuItems.map((item) => {
// // // //           const Icon = item.icon;

// // // //           return (
// // // //             <NavLink
// // // //               key={item.path}
// // // //               to={item.path}
// // // //               end={item.path === "/"}
// // // //               className={({ isActive }) =>
// // // //                 `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
// // // //                   isActive
// // // //                     ? "bg-blue-50 text-blue-600"
// // // //                     : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
// // // //                 }`
// // // //               }
// // // //             >
// // // //               <Icon size={20} />
// // // //               {item.name}
// // // //             </NavLink>
// // // //           );
// // // //         })}
// // // //       </nav>

// // // //       {/* Bottom Section */}
// // // //       {/* <div className="border-t border-slate-100 p-4">

// // // //         <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
// // // //           <Settings size={19} />
// // // //           Settings
// // // //         </button>

// // // //         <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50">
// // // //           <LogOut size={19} />
// // // //           Logout
// // // //         </button>

// // // //       </div> */}
// // // //     </aside>
// // // //   );
// // // // }

// // // // export default Sidebar;


// // // import { NavLink } from "react-router-dom";
// // // import {
// // //   LayoutDashboard,
// // //   Users,
// // //   ClipboardCheck,
// // //   History,
// // //   ScanFace,
// // //   Settings,
// // //   LogOut,
// // //   X,
// // // } from "lucide-react";

// // // function Sidebar({ mobileOpen = false, onClose }) {
// // //   const menuItems = [
// // //     {
// // //       name: "Dashboard",
// // //       path: "/",
// // //       icon: LayoutDashboard,
// // //     },
// // //     {
// // //       name: "Students",
// // //       path: "/students",
// // //       icon: Users,
// // //     },
// // //     {
// // //       name: "Attendance",
// // //       path: "/attendance",
// // //       icon: ClipboardCheck,
// // //     },
// // //     {
// // //       name: "Attendance History",
// // //       path: "/attendance-history",
// // //       icon: History,
// // //     },
// // //   ];

// // //   return (
// // //     <>
// // //       {/* Mobile backdrop */}
// // //       {mobileOpen && (
// // //         <button
// // //           type="button"
// // //           aria-label="Close menu"
// // //           onClick={onClose}
// // //           className="fixed inset-0 z-40 cursor-pointer bg-slate-900/40 lg:hidden"
// // //         />
// // //       )}

// // //       <aside
// // //         className={`
// // //           fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col
// // //           border-r border-slate-200 bg-white
// // //           transition-transform duration-300 ease-in-out
// // //           lg:w-64 lg:translate-x-0
// // //           ${
// // //             mobileOpen
// // //               ? "translate-x-0"
// // //               : "-translate-x-full"
// // //           }
// // //         `}
// // //       >
// // //         {/* Logo */}
// // //         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6 sm:py-6">
// // //           <div className="flex items-center gap-3">
// // //             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
// // //               <ScanFace
// // //                 className="text-white"
// // //                 size={23}
// // //               />
// // //             </div>

// // //             <div>
// // //               <h1 className="text-xl font-bold text-slate-900">
// // //                 Attend<span className="text-blue-600">AI</span>
// // //               </h1>

// // //               <p className="text-xs text-slate-400">
// // //                 Smart Attendance
// // //               </p>
// // //             </div>
// // //           </div>

// // //           {/* Mobile close */}
// // //           <button
// // //             type="button"
// // //             onClick={onClose}
// // //             aria-label="Close navigation"
// // //             className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
// // //           >
// // //             <X size={20} />
// // //           </button>
// // //         </div>

// // //         {/* Navigation */}
// // //         <nav className="flex-1 overflow-y-auto px-3 py-5 sm:px-4 sm:py-6">
// // //           <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:mb-4">
// // //             Main Menu
// // //           </p>

// // //           <div className="space-y-1.5 sm:space-y-2">
// // //             {menuItems.map((item) => {
// // //               const Icon = item.icon;

// // //               return (
// // //                 <NavLink
// // //                   key={item.path}
// // //                   to={item.path}
// // //                   end={item.path === "/"}
// // //                   onClick={onClose}
// // //                   className={({ isActive }) =>
// // //                     `flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
// // //                       isActive
// // //                         ? "bg-blue-50 text-blue-600"
// // //                         : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
// // //                     }`
// // //                   }
// // //                 >
// // //                   <Icon
// // //                     size={20}
// // //                     className="shrink-0"
// // //                   />

// // //                   <span className="truncate">
// // //                     {item.name}
// // //                   </span>
// // //                 </NavLink>
// // //               );
// // //             })}
// // //           </div>
// // //         </nav>

        
// // //       </aside>
// // //     </>
// // //   );
// // // }

// // // export default Sidebar;





// // import { NavLink, useNavigate } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   Users,
// //   ClipboardCheck,
// //   History,
// //   ScanFace,
// //   Settings,
// //   LogOut,
// //   X,
// //   Loader2,
// // } from "lucide-react";
// // import { useState } from "react";

// // import { supabase } from "../lib/supabase";

// // function Sidebar({ mobileOpen, onClose }) {
// //   const navigate = useNavigate();

// //   const [loggingOut, setLoggingOut] = useState(false);

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
// //     {
// //       name: "Attendance History",
// //       path: "/attendance-history",
// //       icon: History,
// //     },
// //   ];

// //   async function handleLogout() {
// //     if (loggingOut) return;

// //     setLoggingOut(true);

// //     try {
// //       const { error } = await supabase.auth.signOut();

// //       if (error) {
// //         console.error("Logout error:", error);
// //         return;
// //       }

// //       onClose();

// //       navigate("/login", {
// //         replace: true,
// //       });
// //     } catch (error) {
// //       console.error("Logout error:", error);
// //     } finally {
// //       setLoggingOut(false);
// //     }
// //   }

// //   return (
// //     <>
// //       {/* Mobile overlay */}
// //       {mobileOpen && (
// //         <button
// //           type="button"
// //           aria-label="Close sidebar"
// //           onClick={onClose}
// //           className="fixed inset-0 z-40 cursor-pointer bg-slate-950/40 lg:hidden"
// //         />
// //       )}

// //       {/* Sidebar */}
// //       <aside
// //         className={`
// //           fixed left-0 top-0 z-50 flex h-dvh w-[280px] flex-col
// //           border-r border-slate-200 bg-white
// //           shadow-xl
// //           transition-transform duration-300 ease-in-out
// //           lg:w-64 lg:translate-x-0 lg:shadow-none
// //           ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
// //         `}
// //       >
// //         {/* Logo */}
// //         <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6 sm:py-6">
// //           <div className="flex min-w-0 items-center gap-3">
// //             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
// //               <ScanFace
// //                 className="text-white"
// //                 size={23}
// //               />
// //             </div>

// //             <div className="min-w-0">
// //               <h1 className="truncate text-xl font-bold text-slate-900">
// //                 Attend<span className="text-blue-600">AI</span>
// //               </h1>

// //               <p className="truncate text-xs text-slate-400">
// //                 Smart Attendance
// //               </p>
// //             </div>
// //           </div>

// //           {/* Mobile close */}
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             aria-label="Close navigation"
// //             className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         {/* Navigation */}
// //         <nav className="flex-1 overflow-y-auto px-3 py-5 sm:px-4 sm:py-6">
// //           <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:mb-4">
// //             Main Menu
// //           </p>

// //           <div className="space-y-1.5 sm:space-y-2">
// //             {menuItems.map((item) => {
// //               const Icon = item.icon;

// //               return (
// //                 <NavLink
// //                   key={item.path}
// //                   to={item.path}
// //                   end={item.path === "/"}
// //                   onClick={onClose}
// //                   className={({ isActive }) =>
// //                     `flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
// //                       isActive
// //                         ? "bg-blue-50 text-blue-600"
// //                         : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
// //                     }`
// //                   }
// //                 >
// //                   <Icon
// //                     size={20}
// //                     className="shrink-0"
// //                   />

// //                   <span className="truncate">
// //                     {item.name}
// //                   </span>
// //                 </NavLink>
// //               );
// //             })}
// //           </div>
// //         </nav>

// //         {/* Bottom actions */}
// //         <div className="shrink-0 border-t border-slate-100 p-3 sm:p-4">
// //           {/* Settings */}
// //           <button
// //             type="button"
// //             className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
// //           >
// //             <Settings
// //               size={19}
// //               className="shrink-0"
// //             />

// //             <span>Settings</span>
// //           </button>

// //           {/* Logout */}
// //           <button
// //             type="button"
// //             onClick={handleLogout}
// //             disabled={loggingOut}
// //             className="mt-1 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
// //           >
// //             {loggingOut ? (
// //               <Loader2
// //                 size={19}
// //                 className="shrink-0 animate-spin"
// //               />
// //             ) : (
// //               <LogOut
// //                 size={19}
// //                 className="shrink-0"
// //               />
// //             )}

// //             <span>
// //               {loggingOut
// //                 ? "Logging out..."
// //                 : "Logout"}
// //             </span>
// //           </button>
// //         </div>
// //       </aside>
// //     </>
// //   );
// // }

// // export default Sidebar;



// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   ClipboardCheck,
//   History,
//   ScanFace,
//   Settings,
//   LogOut,
// } from "lucide-react";

// import { supabase } from "../lib/supabase";

// function Sidebar() {
//   const navigate = useNavigate();

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

//   async function handleLogout() {
//     await supabase.auth.signOut();
//     navigate("/login", { replace: true });
//   }

//   return (
//     <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

//       {/* ======================================================
//           LOGO
//       ====================================================== */}

//       <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
//           <ScanFace
//             size={22}
//             className="text-white"
//           />
//         </div>

//         <div>
//           <h1 className="text-xl font-bold tracking-tight text-slate-900">
//             Attend
//             <span className="text-blue-600">
//               AI
//             </span>
//           </h1>

//           <p className="text-xs text-slate-400">
//             Teacher Portal
//           </p>
//         </div>
//       </div>

//       {/* ======================================================
//           MAIN NAVIGATION
//       ====================================================== */}

//       <nav className="flex-1 space-y-1 p-4">

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
//                     : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                 }`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   <Icon
//                     size={19}
//                     className={
//                       isActive
//                         ? "text-blue-600"
//                         : "text-slate-400"
//                     }
//                   />

//                   <span>{item.name}</span>
//                 </>
//               )}
//             </NavLink>
//           );
//         })}

//       </nav>

//       {/* ======================================================
//           BOTTOM ACTIONS
//       ====================================================== */}

//       <div className="border-t border-slate-100 p-4">

//         {/* School Settings */}

//         <NavLink
//           to="/school-settings"
//           className={({ isActive }) =>
//             `mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
//               isActive
//                 ? "bg-blue-50 text-blue-600"
//                 : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//             }`
//           }
//         >
//           {({ isActive }) => (
//             <>
//               <Settings
//                 size={19}
//                 className={
//                   isActive
//                     ? "text-blue-600"
//                     : "text-slate-400"
//                 }
//               />

//               <span>School Settings</span>
//             </>
//           )}
//         </NavLink>

//         {/* Logout */}

//         <button
//           type="button"
//           onClick={handleLogout}
//           className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
//         >
//           <LogOut
//             size={19}
//             className="text-slate-400"
//           />

//           <span>Logout</span>
//         </button>

//       </div>
//     </aside>
//   );
// }

// export default Sidebar;




import { NavLink, useNavigate } from "react-router-dom";
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

import { supabase } from "../lib/supabase";

function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate();

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

  async function handleLogout() {
    await supabase.auth.signOut();
    onClose?.();
    navigate("/login", { replace: true });
  }

  function handleNavigation() {
    onClose?.();
  }

  return (
    <>
      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* ======================================================
            LOGO
        ====================================================== */}

        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
              <ScanFace
                size={22}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Attend
                <span className="text-blue-600">
                  AI
                </span>
              </h1>

              <p className="text-xs text-slate-400">
                Teacher Portal
              </p>
            </div>
          </div>

          {/* Mobile close button */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* ======================================================
            MAIN NAVIGATION
        ====================================================== */}

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      className={
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400"
                      }
                    />

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ======================================================
            BOTTOM ACTIONS
        ====================================================== */}

        <div className="shrink-0 border-t border-slate-100 p-4">
          {/* School Settings */}

          <NavLink
            to="/school-settings"
            onClick={handleNavigation}
            className={({ isActive }) =>
              `mb-1 flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings
                  size={19}
                  className={
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400"
                  }
                />

                <span>School Settings</span>
              </>
            )}
          </NavLink>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              size={19}
              className="text-slate-400"
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;