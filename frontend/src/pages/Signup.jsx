// import { useState } from "react";
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
//   User,
// } from "lucide-react";

// import { supabase } from "../lib/supabase";

// function Signup() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   async function handleSignup(event) {
//     event.preventDefault();

//     setError("");
//     setSuccess(false);

//     const cleanName = name.trim();
//     const cleanEmail = email.trim();

//     if (!cleanName) {
//       setError("Please enter your name.");
//       return;
//     }

//     if (!cleanEmail) {
//       setError("Please enter your email address.");
//       return;
//     }

//     if (!password) {
//       setError("Please enter a password.");
//       return;
//     }

//     if (password.length < 6) {
//       setError(
//         "Password must be at least 6 characters long."
//       );
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data, error: signupError } =
//         await supabase.auth.signUp({
//           email: cleanEmail,
//           password,
//           options: {
//             data: {
//               full_name: cleanName,
//               role: "teacher",
//             },
//           },
//         });

//       if (signupError) {
//         const message =
//           signupError.message.toLowerCase();

//         if (
//           message.includes("already registered") ||
//           message.includes("already been registered")
//         ) {
//           setError(
//             "An account with this email already exists. Please log in instead."
//           );
//         } else {
//           setError(signupError.message);
//         }

//         return;
//       }

//       if (data.session) {
//         navigate("/", { replace: true });
//         return;
//       }

//       setSuccess(true);

//       setName("");
//       setEmail("");
//       setPassword("");
//       setConfirmPassword("");
//     } catch (signupError) {
//       console.error(
//         "Signup error:",
//         signupError
//       );

//       setError(
//         "Something went wrong while creating your account. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-dvh bg-slate-50">
//       <div className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6">
//         <div className="w-full max-w-md">
//           {/* Logo */}
//           <div className="mb-8 text-center">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
//               <ScanFace
//                 size={30}
//                 className="text-white"
//               />
//             </div>

//             <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//               Attend<span className="text-blue-600">AI</span>
//             </h1>

//             <p className="mt-2 text-sm text-slate-500">
//               Smart attendance for teachers
//             </p>
//           </div>

//           {/* Card */}
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-slate-900">
//                 Create your account
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Create a teacher account to start using AttendAI.
//               </p>
//             </div>

//             {/* Success */}
//             {success && (
//               <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
//                 <div className="flex items-start gap-3">
//                   <CheckCircle2
//                     size={19}
//                     className="mt-0.5 shrink-0"
//                   />

//                   <div>
//                     <p className="font-semibold">
//                       Account created successfully.
//                     </p>

//                     <p className="mt-1 leading-5">
//                       Please check your email and confirm
//                       your email address before logging in.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Error */}
//             {error && (
//               <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
//                 <AlertCircle
//                   size={19}
//                   className="mt-0.5 shrink-0"
//                 />

//                 <p>{error}</p>
//               </div>
//             )}

//             <form
//               onSubmit={handleSignup}
//               className="space-y-5"
//             >
//               {/* Name */}
//               <div>
//                 <label
//                   htmlFor="signup-name"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Full name
//                 </label>

//                 <div className="relative">
//                   <User
//                     size={19}
//                     className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                   />

//                   <input
//                     id="signup-name"
//                     type="text"
//                     value={name}
//                     onChange={(event) =>
//                       setName(event.target.value)
//                     }
//                     placeholder="Enter your full name"
//                     autoComplete="name"
//                     disabled={loading}
//                     className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="signup-email"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Email address
//                 </label>

//                 <div className="relative">
//                   <Mail
//                     size={19}
//                     className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                   />

//                   <input
//                     id="signup-email"
//                     type="email"
//                     value={email}
//                     onChange={(event) =>
//                       setEmail(event.target.value)
//                     }
//                     placeholder="teacher@example.com"
//                     autoComplete="email"
//                     disabled={loading}
//                     className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label
//                   htmlFor="signup-password"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Password
//                 </label>

//                 <div className="relative">
//                   <Lock
//                     size={19}
//                     className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                   />

//                   <input
//                     id="signup-password"
//                     type={
//                       showPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={password}
//                     onChange={(event) =>
//                       setPassword(event.target.value)
//                     }
//                     placeholder="Create a password"
//                     autoComplete="new-password"
//                     disabled={loading}
//                     className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowPassword(
//                         (current) => !current
//                       )
//                     }
//                     aria-label={
//                       showPassword
//                         ? "Hide password"
//                         : "Show password"
//                     }
//                     disabled={loading}
//                     className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
//                   >
//                     {showPassword ? (
//                       <EyeOff size={19} />
//                     ) : (
//                       <Eye size={19} />
//                     )}
//                   </button>
//                 </div>

//                 <p className="mt-1.5 text-xs text-slate-400">
//                   Use at least 6 characters.
//                 </p>
//               </div>

//               {/* Confirm password */}
//               <div>
//                 <label
//                   htmlFor="signup-confirm-password"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Confirm password
//                 </label>

//                 <div className="relative">
//                   <Lock
//                     size={19}
//                     className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                   />

//                   <input
//                     id="signup-confirm-password"
//                     type={
//                       showConfirmPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={confirmPassword}
//                     onChange={(event) =>
//                       setConfirmPassword(
//                         event.target.value
//                       )
//                     }
//                     placeholder="Enter your password again"
//                     autoComplete="new-password"
//                     disabled={loading}
//                     className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowConfirmPassword(
//                         (current) => !current
//                       )
//                     }
//                     aria-label={
//                       showConfirmPassword
//                         ? "Hide password"
//                         : "Show password"
//                     }
//                     disabled={loading}
//                     className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={19} />
//                     ) : (
//                       <Eye size={19} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Signup button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2
//                       size={19}
//                       className="animate-spin"
//                     />
//                     Creating account...
//                   </>
//                 ) : (
//                   "Create account"
//                 )}
//               </button>
//             </form>

//             {/* Login */}
//             <div className="mt-6 border-t border-slate-100 pt-6 text-center">
//               <p className="text-sm text-slate-500">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="font-semibold text-blue-600 hover:text-blue-700"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </div>
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

// export default Signup;




import { useState } from "react";
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
  User,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            role: "teacher",
          },
        },
      });

      if (signupError) {
        throw signupError;
      }

      /*
       * Supabase has email confirmation enabled.
       *
       * Therefore, normally data.session will be null here.
       * We intentionally DO NOT create/join a school yet.
       *
       * After the teacher confirms their email and logs in,
       * the Login page will handle school setup.
       */

      if (data.session) {
        navigate("/");
        return;
      }

      setSuccess(
        "Account created successfully! Please check your email and confirm your email address. After confirmation, return here and log in to complete your school setup."
      );
    } catch (err) {
      console.error("Signup error:", err);

      if (
        err?.message?.toLowerCase().includes("already registered") ||
        err?.message?.toLowerCase().includes("already been registered")
      ) {
        setError(
          "This email is already registered. Please log in instead."
        );
      } else {
        setError(
          err?.message || "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ScanFace size={30} strokeWidth={2} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create your AttendAI teacher account
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3 text-sm text-emerald-700">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      Account created successfully
                    </p>

                    <p className="mt-1 leading-6">
                      {success}
                    </p>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Go to Login
                </Link>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={loading || !!success}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@example.com"
                    autoComplete="email"
                    disabled={loading || !!success}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    disabled={loading || !!success}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading || !!success}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    disabled={loading || !!success}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    disabled={loading || !!success}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              {!success && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      Creating account...
                    </>
                  ) : (
                    "Create Teacher Account"
                  )}
                </button>
              )}
            </form>

            {/* Login */}
            <div className="mt-6 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Verification note */}
          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            You will need to verify your email before accessing
            AttendAI.
          </p>
        </div>
      </div>
    </div>
  );
}