// // import { useEffect, useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import {
// //   Eye,
// //   EyeOff,
// //   Lock,
// //   Mail,
// //   ScanFace,
// //   Loader2,
// //   AlertCircle,
// // } from "lucide-react";

// // import { supabase } from "../lib/supabase";

// // function Login() {
// //   const navigate = useNavigate();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     let mounted = true;

// //     async function checkExistingSession() {
// //       const { data } = await supabase.auth.getSession();

// //       if (mounted && data.session) {
// //         navigate("/", { replace: true });
// //       }
// //     }

// //     checkExistingSession();

// //     return () => {
// //       mounted = false;
// //     };
// //   }, [navigate]);

// //   async function handleLogin(event) {
// //     event.preventDefault();

// //     setError("");

// //     const cleanEmail = email.trim();

// //     if (!cleanEmail || !password) {
// //       setError("Please enter your email and password.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const { error: loginError } =
// //         await supabase.auth.signInWithPassword({
// //           email: cleanEmail,
// //           password,
// //         });

// //       if (loginError) {
// //         if (
// //           loginError.message
// //             .toLowerCase()
// //             .includes("email not confirmed")
// //         ) {
// //           setError(
// //             "Please confirm your email address before logging in."
// //           );
// //         } else if (
// //           loginError.message
// //             .toLowerCase()
// //             .includes("invalid login credentials")
// //         ) {
// //           setError("Incorrect email or password.");
// //         } else {
// //           setError(loginError.message);
// //         }

// //         return;
// //       }

// //       navigate("/", { replace: true });
// //     } catch (loginError) {
// //       console.error("Login error:", loginError);

// //       setError(
// //         "Something went wrong while logging in. Please try again."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="min-h-dvh bg-slate-50">
// //       <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
// //         <div className="w-full max-w-md">
// //           {/* Logo */}
// //           <div className="mb-8 text-center">
// //             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
// //               <ScanFace
// //                 size={30}
// //                 className="text-white"
// //               />
// //             </div>

// //             <h1 className="text-3xl font-bold tracking-tight text-slate-900">
// //               Attend<span className="text-blue-600">AI</span>
// //             </h1>

// //             <p className="mt-2 text-sm text-slate-500">
// //               Smart attendance for teachers
// //             </p>
// //           </div>

// //           {/* Card */}
// //           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
// //             <div className="mb-6">
// //               <h2 className="text-2xl font-bold text-slate-900">
// //                 Welcome back
// //               </h2>

// //               <p className="mt-1 text-sm text-slate-500">
// //                 Sign in to continue to your AttendAI dashboard.
// //               </p>
// //             </div>

// //             {/* Error */}
// //             {error && (
// //               <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
// //                 <AlertCircle
// //                   size={19}
// //                   className="mt-0.5 shrink-0"
// //                 />

// //                 <p>{error}</p>
// //               </div>
// //             )}

// //             <form
// //               onSubmit={handleLogin}
// //               className="space-y-5"
// //             >
// //               {/* Email */}
// //               <div>
// //                 <label
// //                   htmlFor="login-email"
// //                   className="mb-2 block text-sm font-medium text-slate-700"
// //                 >
// //                   Email address
// //                 </label>

// //                 <div className="relative">
// //                   <Mail
// //                     size={19}
// //                     className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
// //                   />

// //                   <input
// //                     id="login-email"
// //                     type="email"
// //                     value={email}
// //                     onChange={(event) =>
// //                       setEmail(event.target.value)
// //                     }
// //                     placeholder="teacher@example.com"
// //                     autoComplete="email"
// //                     disabled={loading}
// //                     className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
// //                   />
// //                 </div>
// //               </div>

// //               {/* Password */}
// //               <div>
// //                 <div className="mb-2 flex items-center justify-between">
// //                   <label
// //                     htmlFor="login-password"
// //                     className="block text-sm font-medium text-slate-700"
// //                   >
// //                     Password
// //                   </label>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setError(
// //                         "Password reset will be added next."
// //                       );
// //                     }}
// //                     disabled={loading}
// //                     className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed"
// //                   >
// //                     Forgot password?
// //                   </button>
// //                 </div>

// //                 <div className="relative">
// //                   <Lock
// //                     size={19}
// //                     className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
// //                   />

// //                   <input
// //                     id="login-password"
// //                     type={
// //                       showPassword
// //                         ? "text"
// //                         : "password"
// //                     }
// //                     value={password}
// //                     onChange={(event) =>
// //                       setPassword(event.target.value)
// //                     }
// //                     placeholder="Enter your password"
// //                     autoComplete="current-password"
// //                     disabled={loading}
// //                     className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
// //                   />

// //                   <button
// //                     type="button"
// //                     onClick={() =>
// //                       setShowPassword(
// //                         (current) => !current
// //                       )
// //                     }
// //                     aria-label={
// //                       showPassword
// //                         ? "Hide password"
// //                         : "Show password"
// //                     }
// //                     disabled={loading}
// //                     className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
// //                   >
// //                     {showPassword ? (
// //                       <EyeOff size={19} />
// //                     ) : (
// //                       <Eye size={19} />
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Login button */}
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Loader2
// //                       size={19}
// //                       className="animate-spin"
// //                     />
// //                     Signing in...
// //                   </>
// //                 ) : (
// //                   "Sign in"
// //                 )}
// //               </button>
// //             </form>

// //             {/* Signup */}
// //             <div className="mt-6 border-t border-slate-100 pt-6 text-center">
// //               <p className="text-sm text-slate-500">
// //                 Don't have an account?{" "}
// //                 <Link
// //                   to="/signup"
// //                   className="font-semibold text-blue-600 hover:text-blue-700"
// //                 >
// //                   Create account
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>

// //           {/* Footer */}
// //           <p className="mt-6 text-center text-xs text-slate-400">
// //             AttendAI • Teacher Portal
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Login;



// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Eye,
//   EyeOff,
//   Lock,
//   Mail,
//   ScanFace,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
//   ArrowLeft,
//   KeyRound,
// } from "lucide-react";

// import { supabase } from "../lib/supabase";

// function Login() {
//   const navigate = useNavigate();

//   const [mode, setMode] = useState("login");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [checkingSession, setCheckingSession] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     let mounted = true;

//     async function checkExistingSession() {
//       try {
//         const { data, error: sessionError } =
//           await supabase.auth.getSession();

//         if (sessionError) {
//           console.error(
//             "Session check error:",
//             sessionError
//           );
//         }

//         if (mounted && data.session) {
//           navigate("/", { replace: true });
//         }
//       } finally {
//         if (mounted) {
//           setCheckingSession(false);
//         }
//       }
//     }

//     checkExistingSession();

//     return () => {
//       mounted = false;
//     };
//   }, [navigate]);

//   // ============================================================
//   // LOGIN
//   // ============================================================

//   async function handleLogin(event) {
//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail || !password) {
//       setError("Please enter your email and password.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { error: loginError } =
//         await supabase.auth.signInWithPassword({
//           email: cleanEmail,
//           password,
//         });

//       if (loginError) {
//         const message =
//           loginError.message?.toLowerCase() || "";

//         if (message.includes("email not confirmed")) {
//           setError(
//             "Please confirm your email address before logging in."
//           );
//         } else if (
//           message.includes("invalid login credentials")
//         ) {
//           setError("Incorrect email or password.");
//         } else {
//           setError(loginError.message);
//         }

//         return;
//       }

//       navigate("/", { replace: true });
//     } catch (loginError) {
//       console.error("Login error:", loginError);

//       setError(
//         "Something went wrong while logging in. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ============================================================
//   // FORGOT PASSWORD
//   // ============================================================

//   async function handleForgotPassword(event) {
//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail) {
//       setError(
//         "Please enter your email address first."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       /*
//        * Supabase will send the password reset email.
//        *
//        * IMPORTANT:
//        * Add your frontend URL to Supabase:
//        *
//        * Authentication
//        * → URL Configuration
//        * → Redirect URLs
//        *
//        * Local:
//        * http://localhost:5173/login
//        *
//        * Production:
//        * https://attend-ai-rfsx.vercel.app/login
//        */

//       const { error: resetError } =
//         await supabase.auth.resetPasswordForEmail(
//           cleanEmail,
//           {
//             redirectTo: `${window.location.origin}/login`,
//           }
//         );

//       if (resetError) {
//         throw resetError;
//       }

//       setSuccess(
//         "If an account exists with this email, a password reset link has been sent. Please check your inbox."
//       );
//     } catch (resetError) {
//       console.error(
//         "Password reset error:",
//         resetError
//       );

//       setError(
//         resetError?.message ||
//           "Unable to send the password reset email. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ============================================================
//   // SWITCH TO FORGOT PASSWORD
//   // ============================================================

//   function openForgotPassword() {
//     setMode("forgot");
//     setError("");
//     setSuccess("");
//   }

//   // ============================================================
//   // BACK TO LOGIN
//   // ============================================================

//   function backToLogin() {
//     setMode("login");
//     setError("");
//     setSuccess("");
//   }

//   // ============================================================
//   // LOADING SESSION
//   // ============================================================

//   if (checkingSession) {
//     return (
//       <div className="flex min-h-dvh items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
//             <Loader2
//               size={28}
//               className="animate-spin"
//             />
//           </div>

//           <p className="mt-4 text-sm text-slate-500">
//             Loading AttendAI...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-dvh bg-slate-50">
//       <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
//         <div className="w-full max-w-md">

//           {/* ==================================================
//               LOGO
//           ================================================== */}

//           <div className="mb-8 text-center">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
//               <ScanFace
//                 size={30}
//                 className="text-white"
//               />
//             </div>

//             <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//               Attend
//               <span className="text-blue-600">
//                 AI
//               </span>
//             </h1>

//             <p className="mt-2 text-sm text-slate-500">
//               Smart attendance for teachers
//             </p>
//           </div>


//           {/* ==================================================
//               CARD
//           ================================================== */}

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

//             {/* ==================================================
//                 LOGIN MODE
//             ================================================== */}

//             {mode === "login" && (
//               <>
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-slate-900">
//                     Welcome back
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Sign in to continue to your
//                     AttendAI dashboard.
//                   </p>
//                 </div>


//                 {/* Error */}

//                 {error && (
//                   <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
//                     <AlertCircle
//                       size={19}
//                       className="mt-0.5 shrink-0"
//                     />

//                     <p>{error}</p>
//                   </div>
//                 )}


//                 {/* Success */}

//                 {success && (
//                   <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700">
//                     <CheckCircle2
//                       size={19}
//                       className="mt-0.5 shrink-0"
//                     />

//                     <p>{success}</p>
//                   </div>
//                 )}


//                 <form
//                   onSubmit={handleLogin}
//                   className="space-y-5"
//                 >

//                   {/* Email */}

//                   <div>
//                     <label
//                       htmlFor="login-email"
//                       className="mb-2 block text-sm font-medium text-slate-700"
//                     >
//                       Email address
//                     </label>

//                     <div className="relative">
//                       <Mail
//                         size={19}
//                         className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                       />

//                       <input
//                         id="login-email"
//                         type="email"
//                         value={email}
//                         onChange={(event) =>
//                           setEmail(event.target.value)
//                         }
//                         placeholder="teacher@example.com"
//                         autoComplete="email"
//                         disabled={loading}
//                         className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
//                       />
//                     </div>
//                   </div>


//                   {/* Password */}

//                   <div>
//                     <div className="mb-2 flex items-center justify-between">

//                       <label
//                         htmlFor="login-password"
//                         className="block text-sm font-medium text-slate-700"
//                       >
//                         Password
//                       </label>

//                       <button
//                         type="button"
//                         onClick={openForgotPassword}
//                         disabled={loading}
//                         className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed"
//                       >
//                         Forgot password?
//                       </button>

//                     </div>


//                     <div className="relative">

//                       <Lock
//                         size={19}
//                         className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                       />

//                       <input
//                         id="login-password"
//                         type={
//                           showPassword
//                             ? "text"
//                             : "password"
//                         }
//                         value={password}
//                         onChange={(event) =>
//                           setPassword(
//                             event.target.value
//                           )
//                         }
//                         placeholder="Enter your password"
//                         autoComplete="current-password"
//                         disabled={loading}
//                         className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
//                       />


//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowPassword(
//                             (current) => !current
//                           )
//                         }
//                         aria-label={
//                           showPassword
//                             ? "Hide password"
//                             : "Show password"
//                         }
//                         disabled={loading}
//                         className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
//                       >
//                         {showPassword ? (
//                           <EyeOff size={19} />
//                         ) : (
//                           <Eye size={19} />
//                         )}
//                       </button>

//                     </div>
//                   </div>


//                   {/* Login button */}

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2
//                           size={19}
//                           className="animate-spin"
//                         />
//                         Signing in...
//                       </>
//                     ) : (
//                       "Sign in"
//                     )}
//                   </button>

//                 </form>


//                 {/* Signup */}

//                 <div className="mt-6 border-t border-slate-100 pt-6 text-center">
//                   <p className="text-sm text-slate-500">
//                     Don't have an account?{" "}
//                     <Link
//                       to="/signup"
//                       className="font-semibold text-blue-600 hover:text-blue-700"
//                     >
//                       Create account
//                     </Link>
//                   </p>
//                 </div>
//               </>
//             )}


//             {/* ==================================================
//                 FORGOT PASSWORD MODE
//             ================================================== */}

//             {mode === "forgot" && (
//               <>
//                 <button
//                   type="button"
//                   onClick={backToLogin}
//                   disabled={loading}
//                   className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed"
//                 >
//                   <ArrowLeft size={17} />
//                   Back to login
//                 </button>


//                 <div className="mb-6">
//                   <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                     <KeyRound size={24} />
//                   </div>

//                   <h2 className="text-2xl font-bold text-slate-900">
//                     Forgot password?
//                   </h2>

//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     Enter the email address associated
//                     with your AttendAI account and we'll
//                     send you a password reset link.
//                   </p>
//                 </div>


//                 {/* Error */}

//                 {error && (
//                   <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
//                     <AlertCircle
//                       size={19}
//                       className="mt-0.5 shrink-0"
//                     />

//                     <p>{error}</p>
//                   </div>
//                 )}


//                 {/* Success */}

//                 {success && (
//                   <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
//                     <CheckCircle2
//                       size={19}
//                       className="mt-0.5 shrink-0"
//                     />

//                     <p className="leading-5">
//                       {success}
//                     </p>
//                   </div>
//                 )}


//                 <form
//                   onSubmit={handleForgotPassword}
//                   className="space-y-5"
//                 >

//                   {/* Email */}

//                   <div>
//                     <label
//                       htmlFor="forgot-email"
//                       className="mb-2 block text-sm font-medium text-slate-700"
//                     >
//                       Email address
//                     </label>

//                     <div className="relative">

//                       <Mail
//                         size={19}
//                         className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                       />

//                       <input
//                         id="forgot-email"
//                         type="email"
//                         value={email}
//                         onChange={(event) =>
//                           setEmail(event.target.value)
//                         }
//                         placeholder="teacher@example.com"
//                         autoComplete="email"
//                         disabled={loading}
//                         className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
//                       />

//                     </div>
//                   </div>


//                   {/* Send button */}

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2
//                           size={19}
//                           className="animate-spin"
//                         />
//                         Sending reset link...
//                       </>
//                     ) : (
//                       "Send reset link"
//                     )}
//                   </button>

//                 </form>


//                 {/* Back to login */}

//                 <div className="mt-6 border-t border-slate-100 pt-6 text-center">
//                   <button
//                     type="button"
//                     onClick={backToLogin}
//                     className="text-sm font-semibold text-blue-600 hover:text-blue-700"
//                   >
//                     Return to login
//                   </button>
//                 </div>
//               </>
//             )}

//           </div>


//           {/* Footer */}

//           <p className="mt-6 text-center text-xs text-slate-400">
//             AttendAI • Teacher Portal
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;



import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ScanFace,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        /*
         * Supabase sends the user back to /login after
         * clicking the password-reset email.
         *
         * The PASSWORD_RECOVERY event tells us that this
         * is a legitimate password-reset session.
         */

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          /*
           * If the URL contains recovery information,
           * Supabase will establish the recovery session.
           *
           * We don't immediately redirect here because
           * we need to allow the user to set a new password.
           */

          const hash = window.location.hash || "";
          const search = window.location.search || "";

          const isRecoveryUrl =
            hash.includes("type=recovery") ||
            search.includes("type=recovery");

          if (isRecoveryUrl) {
            setMode("reset");
            setCheckingSession(false);
            return;
          }

          /*
           * Normal authenticated session.
           */
          navigate("/", { replace: true });
          return;
        }

        /*
         * No session.
         *
         * Listen for PASSWORD_RECOVERY because Supabase may
         * establish the recovery session asynchronously.
         */
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(
          (event, recoverySession) => {
            if (!mounted) return;

            if (event === "PASSWORD_RECOVERY" && recoverySession) {
              setMode("reset");
              setError("");
              setSuccess("");
              setCheckingSession(false);
              return;
            }

            if (event === "SIGNED_IN" && recoverySession) {
              const hash = window.location.hash || "";
              const search = window.location.search || "";

              const isRecoveryUrl =
                hash.includes("type=recovery") ||
                search.includes("type=recovery");

              if (!isRecoveryUrl) {
                navigate("/", { replace: true });
              }
            }

            setCheckingSession(false);
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (sessionError) {
        console.error("Session check error:", sessionError);

        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    let cleanup;

    checkSession().then((cleanupFunction) => {
      cleanup = cleanupFunction;
    });

    return () => {
      mounted = false;

      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [navigate]);

  // ============================================================
  // LOGIN
  // ============================================================

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        const message =
          loginError.message?.toLowerCase() || "";

        if (message.includes("email not confirmed")) {
          setError(
            "Please confirm your email address before logging in."
          );
        } else if (
          message.includes("invalid login credentials")
        ) {
          setError("Incorrect email or password.");
        } else {
          setError(loginError.message);
        }

        return;
      }

      navigate("/", { replace: true });
    } catch (loginError) {
      console.error("Login error:", loginError);

      setError(
        "Something went wrong while logging in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  async function handleForgotPassword(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Please enter your email address first."
      );
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: `${window.location.origin}/login`,
          }
        );

      if (resetError) {
        throw resetError;
      }

      setSuccess(
        "If an account exists with this email, a password reset link has been sent. Please check your inbox."
      );
    } catch (resetError) {
      console.error(
        "Password reset error:",
        resetError
      );

      setError(
        resetError?.message ||
          "Unable to send the password reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  async function handleResetPassword(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!newPassword || !confirmNewPassword) {
      setError(
        "Please enter and confirm your new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Your new password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Supabase only allows this successfully when the
       * current session is authorized to change the password.
       *
       * For a forgot-password flow, that session comes from
       * the secure reset link sent to the user's email.
       */

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw updateError;
      }

      setNewPassword("");
      setConfirmNewPassword("");

      setSuccess(
        "Your password has been changed successfully."
      );

      /*
       * Give the user a moment to see the success message,
       * then return them to the normal login screen.
       */
      setTimeout(async () => {
        await supabase.auth.signOut();

        setMode("login");
        setSuccess(
          "Password changed successfully. Please sign in with your new password."
        );
      }, 1500);
    } catch (resetError) {
      console.error(
        "Update password error:",
        resetError
      );

      setError(
        resetError?.message ||
          "Unable to change your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // SWITCH TO FORGOT PASSWORD
  // ============================================================

  function openForgotPassword() {
    setMode("forgot");
    setError("");
    setSuccess("");
  }

  // ============================================================
  // BACK TO LOGIN
  // ============================================================

  function backToLogin() {
    setMode("login");
    setError("");
    setSuccess("");
  }

  // ============================================================
  // LOADING SESSION
  // ============================================================

  if (checkingSession) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Loader2
              size={28}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Loading AttendAI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">

          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <ScanFace
                size={30}
                className="text-white"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Attend
              <span className="text-blue-600">
                AI
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Smart attendance for teachers
            </p>
          </div>

          {/* ==================================================
              CARD
          ================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            {/* ==================================================
                LOGIN MODE
            ================================================== */}

            {mode === "login" && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Welcome back
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Sign in to continue to your
                    AttendAI dashboard.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{success}</p>
                  </div>
                )}

                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  {/* Email */}

                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={19}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="teacher@example.com"
                        autoComplete="email"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Password */}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="login-password"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={openForgotPassword}
                        disabled={loading}
                        className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock
                        size={19}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="login-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        disabled={loading}
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login button */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={19}
                          className="animate-spin"
                        />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>

                {/* Signup */}

                <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* ==================================================
                FORGOT PASSWORD MODE
            ================================================== */}

            {mode === "forgot" && (
              <>
                <button
                  type="button"
                  onClick={backToLogin}
                  disabled={loading}
                  className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={17} />
                  Back to login
                </button>

                <div className="mb-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <KeyRound size={24} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Forgot password?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter the email address associated
                    with your AttendAI account and we'll
                    send you a password reset link.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="leading-5">
                      {success}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={handleForgotPassword}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={19}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="teacher@example.com"
                        autoComplete="email"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={19}
                          className="animate-spin"
                        />
                        Sending reset link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>

                <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                  <button
                    type="button"
                    onClick={backToLogin}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Return to login
                  </button>
                </div>
              </>
            )}

            {/* ==================================================
                RESET PASSWORD MODE
            ================================================== */}

            {mode === "reset" && (
              <>
                <div className="mb-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <KeyRound size={24} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Create new password
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter a new password for your
                    AttendAI teacher account.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="leading-5">
                      {success}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={handleResetPassword}
                  className="space-y-5"
                >
                  {/* New password */}

                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      New password
                    </label>

                    <div className="relative">
                      <Lock
                        size={19}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="new-password"
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (current) => !current
                          )
                        }
                        disabled={loading}
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                      >
                        {showNewPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}

                  <div>
                    <label
                      htmlFor="confirm-new-password"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Confirm new password
                    </label>

                    <div className="relative">
                      <Lock
                        size={19}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="confirm-new-password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmNewPassword}
                        onChange={(event) =>
                          setConfirmNewPassword(
                            event.target.value
                          )
                        }
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        disabled={loading}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Update button */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={19}
                          className="animate-spin"
                        />
                        Updating password...
                      </>
                    ) : (
                      "Update password"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer */}

          <p className="mt-6 text-center text-xs text-slate-400">
            AttendAI • Teacher Portal
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;