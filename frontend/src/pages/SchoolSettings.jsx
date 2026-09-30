// import { useEffect, useState } from "react";
// import {
//   School,
//   Users,
//   ShieldCheck,
//   Loader2,
//   AlertCircle,
//   UserRound,
// } from "lucide-react";

// import { supabase } from "../lib/supabase";

// function SchoolSettings() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [school, setSchool] = useState(null);
//   const [teachers, setTeachers] = useState([]);

//   const [currentUserId, setCurrentUserId] = useState("");

//   useEffect(() => {
//     loadSchoolSettings();
//   }, []);

//   async function loadSchoolSettings() {
//     setLoading(true);
//     setError("");

//     try {
//       // ---------------------------------------------------------
//       // Get current authenticated teacher
//       // ---------------------------------------------------------

//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError) {
//         throw userError;
//       }

//       if (!user) {
//         throw new Error("You are not authenticated.");
//       }

//       setCurrentUserId(user.id);

//       // ---------------------------------------------------------
//       // Get teacher's school membership
//       // ---------------------------------------------------------

//       const { data: membership, error: membershipError } =
//         await supabase
//           .from("school_teachers")
//           .select("school_id")
//           .eq("user_id", user.id)
//           .limit(1)
//           .maybeSingle();

//       if (membershipError) {
//         throw membershipError;
//       }

//       if (!membership?.school_id) {
//         throw new Error(
//           "You are not assigned to a school."
//         );
//       }

//       const schoolId = membership.school_id;

//       // ---------------------------------------------------------
//       // Get school information
//       // ---------------------------------------------------------

//       const { data: schoolData, error: schoolError } =
//         await supabase
//           .from("schools")
//           .select(
//             "id, school_name, school_code, owner_id, created_at"
//           )
//           .eq("id", schoolId)
//           .maybeSingle();

//       if (schoolError) {
//         throw schoolError;
//       }

//       if (!schoolData) {
//         throw new Error("School information could not be found.");
//       }

//       setSchool(schoolData);

//       // ---------------------------------------------------------
//       // Get teachers belonging to this school
//       // ---------------------------------------------------------

//       const { data: teacherData, error: teacherError } =
//         await supabase
//           .from("school_teachers")
//           .select("id, user_id, created_at")
//           .eq("school_id", schoolId)
//           .order("created_at", {
//             ascending: true,
//           });

//       if (teacherError) {
//         throw teacherError;
//       }

//       setTeachers(teacherData || []);
//     } catch (err) {
//       console.error(
//         "School settings loading error:",
//         err
//       );

//       setError(
//         err?.message ||
//           "Unable to load school settings."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="text-center">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
//             <Loader2
//               size={24}
//               className="animate-spin"
//             />
//           </div>

//           <p className="mt-4 text-sm font-medium text-slate-500">
//             Loading school settings...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center px-4">
//         <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
//           <div className="flex items-start gap-3">
//             <div className="rounded-xl bg-red-50 p-2 text-red-600">
//               <AlertCircle size={22} />
//             </div>

//             <div>
//               <h2 className="text-lg font-bold text-slate-900">
//                 Unable to load school settings
//               </h2>

//               <p className="mt-1 text-sm leading-6 text-red-600">
//                 {error}
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={loadSchoolSettings}
//             className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isOwner =
//     school?.owner_id === currentUserId;

//   return (
//     <div className="space-y-6">

//       {/* ======================================================
//           PAGE HEADER
//       ====================================================== */}

//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//           School Settings
//         </h1>

//         <p className="mt-1 text-sm text-slate-500">
//           Manage your school information and teachers.
//         </p>
//       </div>

//       {/* ======================================================
//           SCHOOL INFORMATION
//       ====================================================== */}

//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

//         <div className="border-b border-slate-100 p-5 sm:p-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//               <School size={22} />
//             </div>

//             <div>
//               <h2 className="text-lg font-bold text-slate-900">
//                 School Information
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Basic information about your school.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

//           {/* School name */}

//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//               School name
//             </p>

//             <p className="mt-1 text-base font-semibold text-slate-900">
//               {school?.school_name || "—"}
//             </p>
//           </div>

//           {/* School code */}

//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//               School code
//             </p>

//             <p className="mt-1 font-mono text-base font-semibold text-slate-900">
//               {school?.school_code || "—"}
//             </p>
//           </div>

//           {/* Role */}

//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//               Your role
//             </p>

//             <div className="mt-2">
//               {isOwner ? (
//                 <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
//                   <ShieldCheck size={16} />
//                   School Owner
//                 </span>
//               ) : (
//                 <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
//                   <UserRound size={16} />
//                   Teacher
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Teacher count */}

//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//               Teachers
//             </p>

//             <p className="mt-1 text-base font-semibold text-slate-900">
//               {teachers.length}
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* ======================================================
//           TEACHERS
//       ====================================================== */}

//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

//         <div className="border-b border-slate-100 p-5 sm:p-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
//               <Users size={22} />
//             </div>

//             <div>
//               <h2 className="text-lg font-bold text-slate-900">
//                 School Teachers
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Teachers currently connected to this school.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="divide-y divide-slate-100">

//           {teachers.length === 0 ? (
//             <div className="p-6 text-center">
//               <p className="text-sm text-slate-500">
//                 No teachers found.
//               </p>
//             </div>
//           ) : (
//             teachers.map((teacher, index) => {
//               const teacherIsOwner =
//                 teacher.user_id === school?.owner_id;

//               const isCurrentUser =
//                 teacher.user_id === currentUserId;

//               return (
//                 <div
//                   key={teacher.id}
//                   className="flex items-center justify-between gap-4 p-5"
//                 >
//                   <div className="flex min-w-0 items-center gap-3">

//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
//                       {index + 1}
//                     </div>

//                     <div className="min-w-0">
//                       <p className="truncate text-sm font-semibold text-slate-900">
//                         {isCurrentUser
//                           ? "You"
//                           : `Teacher ${index + 1}`}
//                       </p>

//                       <p className="truncate text-xs text-slate-400">
//                         Teacher account
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex shrink-0 flex-wrap justify-end gap-2">

//                     {teacherIsOwner && (
//                       <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
//                         <ShieldCheck size={14} />
//                         Owner
//                       </span>
//                     )}

//                     {isCurrentUser && !teacherIsOwner && (
//                       <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
//                         You
//                       </span>
//                     )}

//                   </div>
//                 </div>
//               );
//             })
//           )}

//         </div>
//       </div>

//     </div>
//   );
// }

// export default SchoolSettings;




import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  School,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function SchoolSettings() {
  const [loading, setLoading] = useState(true);
  const [savingCode, setSavingCode] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [removingTeacher, setRemovingTeacher] = useState(false);

  const [school, setSchool] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [newSchoolCode, setNewSchoolCode] = useState("");

  const [newSchoolPassword, setNewSchoolPassword] = useState("");
  const [confirmSchoolPassword, setConfirmSchoolPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [teacherToRemove, setTeacherToRemove] = useState(null);

  async function loadSchoolSettings() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You are not logged in.");
      }

      setCurrentUserId(user.id);

      const { data: membership, error: membershipError } =
        await supabase
          .from("school_teachers")
          .select("school_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

      if (membershipError) {
        throw membershipError;
      }

      if (!membership?.school_id) {
        throw new Error("You are not assigned to a school.");
      }

      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("id, school_name, school_code, owner_id")
        .eq("id", membership.school_id)
        .single();

      if (schoolError) {
        throw schoolError;
      }

      setSchool(schoolData);

      const { data: teacherData, error: teacherError } =
        await supabase.rpc("get_my_school_teachers");

      if (teacherError) {
        throw teacherError;
      }

      setTeachers(teacherData || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load school settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchoolSettings();
  }, []);

  const isOwner =
    school?.owner_id && currentUserId
      ? school.owner_id === currentUserId
      : false;

  async function handleChangeSchoolCode(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanedCode = newSchoolCode.trim();

    if (!cleanedCode) {
      setError("Please enter a new school code.");
      return;
    }

    if (cleanedCode.length < 4) {
      setError("School code must be at least 4 characters.");
      return;
    }

    if (!isOwner) {
      setError("Only the school owner can change the school code.");
      return;
    }

    if (
      cleanedCode.toUpperCase() ===
      String(school?.school_code || "").toUpperCase()
    ) {
      setError("This is already your current school code.");
      return;
    }

    setSavingCode(true);

    try {
      const { error: rpcError } = await supabase.rpc(
        "change_school_code_for_owner",
        {
          p_new_school_code: cleanedCode,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setSuccess("School code changed successfully.");
      setNewSchoolCode("");

      await loadSchoolSettings();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to change school code.");
    } finally {
      setSavingCode(false);
    }
  }

  async function handleChangeSchoolPassword(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!isOwner) {
      setError("Only the school owner can change the school password.");
      return;
    }

    if (!newSchoolPassword) {
      setError("Please enter a new school password.");
      return;
    }

    if (newSchoolPassword.length < 6) {
      setError("School password must be at least 6 characters.");
      return;
    }

    if (newSchoolPassword !== confirmSchoolPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const { error: rpcError } = await supabase.rpc(
        "change_school_password_for_owner",
        {
          p_new_school_password: newSchoolPassword,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setSuccess("School password changed successfully.");

      setNewSchoolPassword("");
      setConfirmSchoolPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to change school password.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleRemoveTeacher() {
    if (!teacherToRemove) return;

    setError("");
    setSuccess("");
    setRemovingTeacher(true);

    try {
      const { error: rpcError } = await supabase.rpc(
        "remove_teacher_from_my_school",
        {
          p_teacher_user_id: teacherToRemove.user_id,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setSuccess(
        `${teacherToRemove.full_name || "Teacher"} has been removed from the school.`
      );

      setTeacherToRemove(null);

      await loadSchoolSettings();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to remove teacher.");
    } finally {
      setRemovingTeacher(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading school settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          School Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your school information, teachers, and owner settings.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <X className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* School Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <School className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              School Information
            </h2>

            <p className="text-sm text-slate-500">
              Basic information about your school.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* School Name */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              School Name
            </p>

            <p className="mt-1 text-base font-semibold text-slate-900">
              {school?.school_name || "—"}
            </p>
          </div>

          {/* School Code */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              School Code
            </p>

            <p className="mt-1 break-all font-mono text-base font-semibold text-slate-900">
              {school?.school_code || "—"}
            </p>
          </div>

          {/* Role */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Your Role
            </p>

            <div className="mt-2">
              {isOwner ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  School Owner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  <UserRound className="h-4 w-4" />
                  Teacher
                </span>
              )}
            </div>
          </div>

          {/* Teacher Count */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Teachers
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" />

              <span className="text-base font-semibold text-slate-900">
                {teachers.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Settings */}
      {isOwner && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <KeyRound className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Owner Settings
              </h2>

              <p className="text-sm text-slate-500">
                Settings available only to the school owner.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Change School Code */}
            <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">
                  Change School Code
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Change the code that teachers use when joining your school.
                  Existing teachers will remain members of the school.
                </p>
              </div>

              <form
                onSubmit={handleChangeSchoolCode}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  value={newSchoolCode}
                  onChange={(e) => setNewSchoolCode(e.target.value)}
                  placeholder="Enter new school code"
                  minLength={4}
                  maxLength={50}
                  disabled={savingCode}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 sm:flex-1"
                />

                <button
                  type="submit"
                  disabled={savingCode}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingCode && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {savingCode ? "Changing..." : "Change Code"}
                </button>
              </form>

              <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                <strong>Important:</strong> After changing the code, new
                teachers must use the new code to join your school. Existing
                teachers are not affected.
              </div>
            </div>

            {/* Change School Password */}
            <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">
                  Change School Password
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Change the password that new teachers need when joining your
                  school.
                </p>
              </div>

              <form
                onSubmit={handleChangeSchoolPassword}
                className="space-y-4"
              >
                {/* New Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    New School Password
                  </label>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newSchoolPassword}
                      onChange={(e) =>
                        setNewSchoolPassword(e.target.value)
                      }
                      placeholder="Enter new password"
                      minLength={6}
                      disabled={savingPassword}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword((value) => !value)
                      }
                      disabled={savingPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500">
                    Minimum 6 characters.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmSchoolPassword}
                      onChange={(e) =>
                        setConfirmSchoolPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      minLength={6}
                      disabled={savingPassword}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      disabled={savingPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {savingPassword && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {savingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </form>

              <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                <strong>Important:</strong> Existing teachers will remain
                connected to this school. The new password will be required
                when a new teacher joins.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Teachers */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Users className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              School Teachers
            </h2>

            <p className="text-sm text-slate-500">
              Teachers currently connected to this school.
            </p>
          </div>
        </div>

        {teachers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-400" />

            <p className="mt-3 text-sm text-slate-500">
              No teachers found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {teachers.map((teacher) => {
              const teacherIsOwner = teacher.role === "owner";

              return (
                <div
                  key={teacher.user_id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <UserRound className="h-5 w-5 text-slate-500" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-slate-900">
                          {teacher.full_name || "Teacher"}
                        </p>

                        {teacherIsOwner ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Owner
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            Teacher
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 break-all text-sm text-slate-500">
                        {teacher.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  {isOwner && !teacherIsOwner && (
                    <button
                      type="button"
                      onClick={() => setTeacherToRemove(teacher)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Remove Teacher Modal */}
      {teacherToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Remove Teacher?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Are you sure you want to remove{" "}
                  <strong>
                    {teacherToRemove.full_name || "this teacher"}
                  </strong>{" "}
                  from this school?
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTeacherToRemove(null)}
                disabled={removingTeacher}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
              Their account will <strong>not</strong> be deleted. They will
              simply lose access to this school and can join another school
              using its school code and password.
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setTeacherToRemove(null)}
                disabled={removingTeacher}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRemoveTeacher}
                disabled={removingTeacher}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {removingTeacher && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {removingTeacher ? "Removing..." : "Remove Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}