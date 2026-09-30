
// import { useEffect, useState } from "react";
// import {
//   BrowserRouter,
//   Navigate,
//   Outlet,
//   Route,
//   Routes,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import { supabase } from "./lib/supabase";

// import DashboardLayout from "./layouts/DashboardLayout";

// import Dashboard from "./pages/Dashboard";
// import Students from "./pages/Students";
// import Attendance from "./pages/Attendance";
// import AttendanceHistory from "./pages/AttendanceHistory";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import SchoolSetup from "./pages/SchoolSetup";
// import SchoolSettings from "./pages/SchoolSettings";


// // ============================================================
// // AUTHENTICATION GUARD
// // ============================================================

// function AuthRequired() {
//   const navigate = useNavigate();

//   const [checking, setChecking] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     async function checkAuthentication() {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();

//         if (!mounted) return;

//         if (!session) {
//           setAuthenticated(false);
//           navigate("/login", { replace: true });
//           return;
//         }

//         setAuthenticated(true);
//       } catch (error) {
//         console.error(
//           "Authentication check error:",
//           error
//         );

//         if (mounted) {
//           setAuthenticated(false);
//           navigate("/login", { replace: true });
//         }
//       } finally {
//         if (mounted) {
//           setChecking(false);
//         }
//       }
//     }

//     checkAuthentication();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         if (!mounted) return;

//         if (!session) {
//           setAuthenticated(false);
//           navigate("/login", { replace: true });
//         } else {
//           setAuthenticated(true);
//         }

//         setChecking(false);
//       }
//     );

//     return () => {
//       mounted = false;
//       subscription.unsubscribe();
//     };
//   }, [navigate]);

//   if (checking) {
//     return <LoadingScreen />;
//   }

//   if (!authenticated) {
//     return null;
//   }

//   return <Outlet />;
// }


// // ============================================================
// // SCHOOL GUARD
// // ============================================================

// function SchoolRequired() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [checking, setChecking] = useState(true);
//   const [hasSchool, setHasSchool] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let mounted = true;

//     async function checkSchoolMembership() {
//       setChecking(true);
//       setError("");

//       try {
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();

//         if (!user) {
//           navigate("/login", { replace: true });
//           return;
//         }

//         const { data, error: membershipError } =
//           await supabase
//             .from("school_teachers")
//             .select("school_id")
//             .eq("user_id", user.id)
//             .limit(1);

//         if (membershipError) {
//           throw membershipError;
//         }

//         const schoolExists =
//           Array.isArray(data) && data.length > 0;

//         if (!mounted) return;

//         setHasSchool(schoolExists);

//         if (!schoolExists) {
//           navigate("/school-setup", {
//             replace: true,
//             state: {
//               from: location.pathname,
//             },
//           });

//           return;
//         }
//       } catch (err) {
//         console.error(
//           "School membership check error:",
//           err
//         );

//         if (!mounted) return;

//         setError(
//           err?.message ||
//             "Unable to check your school membership."
//         );
//       } finally {
//         if (mounted) {
//           setChecking(false);
//         }
//       }
//     }

//     checkSchoolMembership();

//     return () => {
//       mounted = false;
//     };
//   }, [navigate, location.pathname]);

//   if (checking) {
//     return <LoadingScreen />;
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
//         <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
//           <h1 className="text-xl font-bold text-slate-900">
//             Unable to verify school
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-red-600">
//             {error}
//           </p>

//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!hasSchool) {
//     return null;
//   }

//   return <Outlet />;
// }


// // ============================================================
// // LOADING SCREEN
// // ============================================================

// function LoadingScreen() {
//   return (
//     <div className="flex min-h-dvh items-center justify-center bg-slate-50">
//       <div className="text-center">
//         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
//           <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//         </div>

//         <p className="mt-4 text-sm font-medium text-slate-500">
//           Loading AttendAI...
//         </p>
//       </div>
//     </div>
//   );
// }


// // ============================================================
// // APP
// // ============================================================

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* ==================================================
//             PUBLIC AUTHENTICATION
//         ================================================== */}

//         <Route path="/login" element={<Login />} />

//         <Route path="/signup" element={<Signup />} />


//         {/* ==================================================
//             AUTHENTICATED USER
//         ================================================== */}

//         <Route element={<AuthRequired />}>

//           {/* ================================================
//               SCHOOL SETUP
//           ================================================ */}

//           <Route
//             path="/school-setup"
//             element={<SchoolSetup />}
//           />


//           {/* ================================================
//               SCHOOL-REQUIRED APPLICATION
//           ================================================ */}

//           <Route element={<SchoolRequired />}>

//             <Route element={<DashboardLayout />}>
//   <Route path="/" element={<Dashboard />} />
//   <Route path="/students" element={<Students />} />
//   <Route path="/attendance" element={<Attendance />} />
//   <Route
//     path="/attendance-history"
//     element={<AttendanceHistory />}
//   />
//   <Route
//     path="/school-settings"
//     element={<SchoolSettings />}
//   />
// </Route>

//           </Route>

//         </Route>


//         {/* ==================================================
//             UNKNOWN URL
//         ================================================== */}

//         <Route
//           path="*"
//           element={<Navigate to="/login" replace />}
//         />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SchoolSetup from "./pages/SchoolSetup";
import SchoolSettings from "./pages/SchoolSettings";

// ============================================================
// AUTHENTICATION GUARD
// ============================================================

function AuthRequired() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuthentication() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          setAuthenticated(false);
          navigate("/login", { replace: true });
          return;
        }

        setAuthenticated(true);
      } catch (error) {
        console.error(
          "Authentication check error:",
          error
        );

        if (mounted) {
          setAuthenticated(false);
          navigate("/login", { replace: true });
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkAuthentication();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (!session) {
          setAuthenticated(false);
          navigate("/login", { replace: true });
        } else {
          setAuthenticated(true);
        }

        setChecking(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking) {
    return <LoadingScreen />;
  }

  if (!authenticated) {
    return null;
  }

  return <Outlet />;
}

// ============================================================
// SCHOOL GUARD
// ============================================================

function SchoolRequired() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [hasSchool, setHasSchool] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSchoolMembership() {
      setChecking(true);
      setError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login", { replace: true });
          return;
        }

        const { data, error: membershipError } =
          await supabase
            .from("school_teachers")
            .select("school_id")
            .eq("user_id", user.id)
            .limit(1);

        if (membershipError) {
          throw membershipError;
        }

        const schoolExists =
          Array.isArray(data) && data.length > 0;

        if (!mounted) return;

        setHasSchool(schoolExists);

        if (!schoolExists) {
          navigate("/school-setup", {
            replace: true,
            state: {
              from: location.pathname,
            },
          });

          return;
        }
      } catch (err) {
        console.error(
          "School membership check error:",
          err
        );

        if (!mounted) return;

        setError(
          err?.message ||
            "Unable to check your school membership."
        );
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkSchoolMembership();

    return () => {
      mounted = false;
    };
  }, [navigate, location.pathname]);

  if (checking) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Unable to verify school
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hasSchool) {
    return null;
  }

  return <Outlet />;
}

// ============================================================
// LOADING SCREEN
// ============================================================

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading AttendAI...
        </p>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC AUTHENTICATION
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ==================================================
            AUTHENTICATED USER
        ================================================== */}

        <Route element={<AuthRequired />}>

          {/* ================================================
              SCHOOL SETUP
          ================================================ */}

          <Route
            path="/school-setup"
            element={<SchoolSetup />}
          />

          {/* ================================================
              SCHOOL-REQUIRED APPLICATION
          ================================================ */}

          <Route element={<SchoolRequired />}>

            <Route element={<DashboardLayout />}>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/students"
                element={<Students />}
              />

              <Route
                path="/attendance"
                element={<Attendance />}
              />

              <Route
                path="/attendance-history"
                element={<AttendanceHistory />}
              />

              <Route
                path="/school-settings"
                element={<SchoolSettings />}
              />

            </Route>

          </Route>

        </Route>

        {/* ==================================================
            UNKNOWN URL
        ================================================== */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;