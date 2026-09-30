import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";

import { supabase } from "../lib/supabase";

export default function SchoolSetup() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("create");

  const [teacherName, setTeacherName] = useState("");

  // Create school
  const [schoolName, setSchoolName] = useState("");
  const [createSchoolCode, setCreateSchoolCode] = useState("");
  const [createSchoolPassword, setCreateSchoolPassword] =
    useState("");

  // Join school
  const [joinSchoolCode, setJoinSchoolCode] = useState("");
  const [joinSchoolPassword, setJoinSchoolPassword] =
    useState("");

  const [showCreatePassword, setShowCreatePassword] =
    useState(false);

  const [showJoinPassword, setShowJoinPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const fullName =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Teacher";

      setTeacherName(fullName);

      // Check whether the teacher already has a school.
      const { data: membership, error: membershipError } =
        await supabase
          .from("school_teachers")
          .select("school_id")
          .eq("user_id", user.id)
          .limit(1);

      if (membershipError) {
        throw membershipError;
      }

      if (membership && membership.length > 0) {
        navigate("/", { replace: true });
        return;
      }
    } catch (err) {
      console.error("School setup check error:", err);

      setError(
        err?.message ||
          "Unable to check your school membership."
      );
    } finally {
      setChecking(false);
    }
  }

  async function handleCreateSchool(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = schoolName.trim();
    const trimmedCode = createSchoolCode.trim().toUpperCase();

    if (!trimmedName) {
      setError("Please enter your school name.");
      return;
    }

    if (!trimmedCode) {
      setError("Please enter a school code.");
      return;
    }

    if (trimmedCode.length < 3) {
      setError("School code must be at least 3 characters.");
      return;
    }

    if (createSchoolPassword.length < 6) {
      setError(
        "School password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc(
        "create_school_for_teacher",
        {
          p_school_name: trimmedName,
          p_school_code: trimmedCode,
          p_school_password: createSchoolPassword,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      if (!data) {
        throw new Error(
          "School was not created. Please try again."
        );
      }

      setSuccess(
        "Your school has been created successfully. Redirecting..."
      );

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 700);
    } catch (err) {
      console.error("Create school error:", err);

      let message =
        err?.message ||
        "Unable to create the school.";

      if (
        message.toLowerCase().includes("already exists") ||
        message.toLowerCase().includes("school with this code")
      ) {
        message =
          "A school with this code already exists. Please use a different code.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinSchool(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedCode = joinSchoolCode.trim().toUpperCase();

    if (!trimmedCode) {
      setError("Please enter the school code.");
      return;
    }

    if (joinSchoolPassword.length < 1) {
      setError("Please enter the school password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc(
        "join_school_for_teacher",
        {
          p_school_code: trimmedCode,
          p_school_password: joinSchoolPassword,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      if (!data) {
        throw new Error(
          "Unable to join the school. Please try again."
        );
      }

      setSuccess(
        "You joined the school successfully. Redirecting..."
      );

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 700);
    } catch (err) {
      console.error("Join school error:", err);

      let message =
        err?.message ||
        "Unable to join the school.";

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("school not found")) {
        message =
          "School not found. Please check the school code.";
      } else if (
        lowerMessage.includes("incorrect school password")
      ) {
        message =
          "Incorrect school password.";
      } else if (
        lowerMessage.includes("does not have a school password")
      ) {
        message =
          "This school does not have a school password configured.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Loader2
              size={28}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking your school account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <School size={32} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome to AttendAI
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Hello {teacherName}. Before you start using
              AttendAI, connect your teacher account to a
              school.
            </p>
          </div>

          {/* Main card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Mode selector */}
            <div className="grid grid-cols-2 border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setMode("create");
                  setError("");
                  setSuccess("");
                }}
                className={`flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition ${
                  mode === "create"
                    ? "border-b-2 border-blue-600 bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Building2 size={19} />
                Create School
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("join");
                  setError("");
                  setSuccess("");
                }}
                className={`flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition ${
                  mode === "join"
                    ? "border-b-2 border-blue-600 bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Users size={19} />
                Join School
              </button>
            </div>

            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              {/* Information */}
              <div className="border-b border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <h2 className="text-xl font-bold text-slate-900">
                  {mode === "create"
                    ? "Create your school"
                    : "Join your school"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {mode === "create"
                    ? "Create a secure school workspace. Other teachers can join it using the school code and password."
                    : "Enter the school code and password provided by your school administrator or school creator."}
                </p>

                <div className="mt-7 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Secure school access
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        School passwords are stored securely
                        as hashes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Users size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Shared school workspace
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Teachers in the same school can work
                        with the school's students and
                        attendance.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <KeyRound size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        School code + password
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Keep these credentials private and
                        share them only with authorized
                        teachers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 sm:p-8">
                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{success}</p>
                  </div>
                )}

                {mode === "create" ? (
                  <form
                    onSubmit={handleCreateSchool}
                    className="space-y-5"
                  >
                    {/* School Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        School Name
                      </label>

                      <div className="relative">
                        <School
                          size={19}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={schoolName}
                          onChange={(event) =>
                            setSchoolName(event.target.value)
                          }
                          placeholder="e.g. Sunrise Public School"
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* School Code */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        School Code
                      </label>

                      <div className="relative">
                        <Building2
                          size={19}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={createSchoolCode}
                          onChange={(event) =>
                            setCreateSchoolCode(
                              event.target.value.toUpperCase()
                            )
                          }
                          placeholder="e.g. SUNRISE2026"
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                        />
                      </div>

                      <p className="mt-1.5 text-xs text-slate-400">
                        Other teachers will use this code to
                        join your school.
                      </p>
                    </div>

                    {/* School Password */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        School Password
                      </label>

                      <div className="relative">
                        <KeyRound
                          size={19}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={
                            showCreatePassword
                              ? "text"
                              : "password"
                          }
                          value={createSchoolPassword}
                          onChange={(event) =>
                            setCreateSchoolPassword(
                              event.target.value
                            )
                          }
                          placeholder="Minimum 6 characters"
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowCreatePassword(
                              (value) => !value
                            )
                          }
                          disabled={loading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showCreatePassword ? (
                            <EyeOff size={19} />
                          ) : (
                            <Eye size={19} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                          Creating school...
                        </>
                      ) : (
                        <>
                          <Building2 size={19} />
                          Create School
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={handleJoinSchool}
                    className="space-y-5"
                  >
                    {/* School Code */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        School Code
                      </label>

                      <div className="relative">
                        <Building2
                          size={19}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={joinSchoolCode}
                          onChange={(event) =>
                            setJoinSchoolCode(
                              event.target.value.toUpperCase()
                            )
                          }
                          placeholder="e.g. SUNRISE2026"
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* School Password */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        School Password
                      </label>

                      <div className="relative">
                        <KeyRound
                          size={19}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type={
                            showJoinPassword
                              ? "text"
                              : "password"
                          }
                          value={joinSchoolPassword}
                          onChange={(event) =>
                            setJoinSchoolPassword(
                              event.target.value
                            )
                          }
                          placeholder="Enter school password"
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowJoinPassword(
                              (value) => !value
                            )
                          }
                          disabled={loading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showJoinPassword ? (
                            <EyeOff size={19} />
                          ) : (
                            <Eye size={19} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                          Joining school...
                        </>
                      ) : (
                        <>
                          <Users size={19} />
                          Join School
                        </>
                      )}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            AttendAI • Teacher Portal
          </p>
        </div>
      </div>
    </div>
  );
}