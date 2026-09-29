


// import { useEffect, useState } from "react";
// import {
//   Users,
//   UserCheck,
//   UserX,
//   ScanFace,
//   Upload,
//   ArrowRight,
//   CalendarDays,
//   RefreshCw,
//   ChevronDown,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// import { supabase } from "../lib/supabase";

// function Dashboard() {
//   const [allStudents, setAllStudents] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedDivision, setSelectedDivision] = useState("");

//   const [totalStudents, setTotalStudents] = useState(0);
//   const [presentToday, setPresentToday] = useState(0);
//   const [absentToday, setAbsentToday] = useState(0);
//   const [attendanceRate, setAttendanceRate] = useState(0);

//   const [loadingStudents, setLoadingStudents] = useState(true);
//   const [loadingStats, setLoadingStats] = useState(false);

//   const [error, setError] = useState("");

//   // -----------------------------------------
//   // Get today's date in YYYY-MM-DD format
//   // -----------------------------------------
//   function getTodayDate() {
//     return new Date().toLocaleDateString("en-CA");
//   }

//   // -----------------------------------------
//   // Load all students
//   // -----------------------------------------
//   async function fetchStudents() {
//     setLoadingStudents(true);
//     setError("");

//     try {
//       const {
//         data,
//         error: studentsError,
//       } = await supabase
//         .from("students")
//         .select(
//           "id, name, roll_number, class_name, division"
//         )
//         .order("class_name", {
//           ascending: true,
//         })
//         .order("division", {
//           ascending: true,
//         })
//         .order("roll_number", {
//           ascending: true,
//         });

//       if (studentsError) {
//         throw studentsError;
//       }

//       const students = data || [];

//       setAllStudents(students);

//       // -----------------------------------------
//       // Automatically select first available class
//       // -----------------------------------------
//       if (students.length > 0) {
//         const classes = [
//           ...new Set(
//             students.map(
//               (student) => student.class_name
//             )
//           ),
//         ];

//         if (classes.length > 0) {
//           setSelectedClass((currentClass) => {
//             if (
//               currentClass &&
//               classes.includes(currentClass)
//             ) {
//               return currentClass;
//             }

//             return classes[0];
//           });
//         }
//       } else {
//         setSelectedClass("");
//         setSelectedDivision("");
//       }
//     } catch (studentsError) {
//       console.error(
//         "Student loading error:",
//         studentsError
//       );

//       setError(
//         studentsError.message ||
//           "Failed to load students."
//       );
//     } finally {
//       setLoadingStudents(false);
//     }
//   }

//   // -----------------------------------------
//   // Get available classes
//   // -----------------------------------------
//   const classOptions = [
//     ...new Set(
//       allStudents.map(
//         (student) => student.class_name
//       )
//     ),
//   ];

//   // -----------------------------------------
//   // Get divisions for selected class
//   // -----------------------------------------
//   const divisionOptions = [
//     ...new Set(
//       allStudents
//         .filter(
//           (student) =>
//             student.class_name === selectedClass
//         )
//         .map(
//           (student) => student.division
//         )
//     ),
//   ];

//   // -----------------------------------------
//   // When class changes, select first division
//   // -----------------------------------------
//   useEffect(() => {
//     if (!selectedClass) {
//       setSelectedDivision("");
//       return;
//     }

//     const divisions = [
//       ...new Set(
//         allStudents
//           .filter(
//             (student) =>
//               student.class_name ===
//               selectedClass
//           )
//           .map(
//             (student) => student.division
//           )
//       ),
//     ];

//     setSelectedDivision((currentDivision) => {
//       if (
//         currentDivision &&
//         divisions.includes(currentDivision)
//       ) {
//         return currentDivision;
//       }

//       return divisions[0] || "";
//     });
//   }, [selectedClass, allStudents]);

//   // -----------------------------------------
//   // Fetch dashboard statistics
//   // -----------------------------------------
//   async function fetchDashboardStats() {
//     if (
//       !selectedClass ||
//       !selectedDivision
//     ) {
//       setTotalStudents(0);
//       setPresentToday(0);
//       setAbsentToday(0);
//       setAttendanceRate(0);
//       return;
//     }

//     setLoadingStats(true);
//     setError("");

//     try {
//       // ---------------------------------------
//       // 1. Get students of selected class/division
//       // ---------------------------------------
//       const classroomStudents =
//         allStudents.filter(
//           (student) =>
//             student.class_name ===
//               selectedClass &&
//             student.division ===
//               selectedDivision
//         );

//       const studentIds =
//         classroomStudents.map(
//           (student) => student.id
//         );

//       const total = classroomStudents.length;

//       setTotalStudents(total);

//       // ---------------------------------------
//       // No students in selected classroom
//       // ---------------------------------------
//       if (studentIds.length === 0) {
//         setPresentToday(0);
//         setAbsentToday(0);
//         setAttendanceRate(0);
//         setLoadingStats(false);
//         return;
//       }

//       const today = getTodayDate();

//       // ---------------------------------------
//       // 2. Find today's latest attendance session
//       // for this class/division
//       // ---------------------------------------
//       const {
//         data: sessions,
//         error: sessionsError,
//       } = await supabase
//         .from("attendance_sessions")
//         .select(
//           "id, class_name, division, session_date, session_time"
//         )
//         .eq("class_name", selectedClass)
//         .eq("division", selectedDivision)
//         .eq("session_date", today)
//         .order("session_time", {
//           ascending: false,
//         })
//         .limit(1);

//       if (sessionsError) {
//         throw sessionsError;
//       }

//       // ---------------------------------------
//       // No attendance taken today
//       // ---------------------------------------
//       if (!sessions || sessions.length === 0) {
//         setPresentToday(0);
//         setAbsentToday(0);
//         setAttendanceRate(0);
//         setLoadingStats(false);
//         return;
//       }

//       const latestSession = sessions[0];

//       // ---------------------------------------
//       // 3. Get attendance for latest session
//       // ---------------------------------------
//       const {
//         data: attendanceData,
//         error: attendanceError,
//       } = await supabase
//         .from("attendance")
//         .select(
//           "student_id, status"
//         )
//         .eq(
//           "session_id",
//           latestSession.id
//         )
//         .in(
//           "student_id",
//           studentIds
//         );

//       if (attendanceError) {
//         throw attendanceError;
//       }

//       // ---------------------------------------
//       // 4. Count present and absent
//       // ---------------------------------------
//       const presentIds = new Set();
//       const absentIds = new Set();

//       (attendanceData || []).forEach(
//         (record) => {
//           if (
//             record.status ===
//             "present"
//           ) {
//             presentIds.add(
//               record.student_id
//             );
//           }

//           if (
//             record.status ===
//             "absent"
//           ) {
//             absentIds.add(
//               record.student_id
//             );
//           }
//         }
//       );

//       const present =
//         presentIds.size;

//       const absent =
//         absentIds.size;

//       setPresentToday(present);
//       setAbsentToday(absent);

//       // ---------------------------------------
//       // 5. Calculate attendance percentage
//       // ---------------------------------------
//       const rate =
//         total > 0
//           ? Math.round(
//               (present / total) * 100
//             )
//           : 0;

//       setAttendanceRate(rate);
//     } catch (dashboardError) {
//       console.error(
//         "Dashboard statistics error:",
//         dashboardError
//       );

//       setError(
//         dashboardError.message ||
//           "Failed to load dashboard statistics."
//       );
//     } finally {
//       setLoadingStats(false);
//     }
//   }

//   // -----------------------------------------
//   // Initial student loading
//   // -----------------------------------------
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // -----------------------------------------
//   // Reload statistics whenever
//   // class/division changes
//   // -----------------------------------------
//   useEffect(() => {
//     if (
//       selectedClass &&
//       selectedDivision &&
//       allStudents.length > 0
//     ) {
//       fetchDashboardStats();
//     }
//   }, [
//     selectedClass,
//     selectedDivision,
//     allStudents,
//   ]);

//   // -----------------------------------------
//   // Refresh everything
//   // -----------------------------------------
//   async function handleRefresh() {
//     await fetchStudents();
//   }

//   return (
//     <div className="p-8">

//       {/* ---------------------------------- */}
//       {/* Header */}
//       {/* ---------------------------------- */}

//       <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

//         <div>
//           <p className="text-sm text-slate-500">
//             Teacher Portal
//           </p>

//           <h1 className="mt-1 text-3xl font-bold text-slate-900">
//             Good Morning, Teacher 👋
//           </h1>

//           <p className="mt-2 text-slate-500">
//             Here's what's happening with your classroom today.
//           </p>
//         </div>

//         <div className="flex flex-col gap-3 sm:flex-row">

//           {/* Class Selector */}
//           <div className="relative">
//             <select
//               value={selectedClass}
//               onChange={(event) =>
//                 setSelectedClass(
//                   event.target.value
//                 )
//               }
//               disabled={
//                 loadingStudents ||
//                 classOptions.length === 0
//               }
//               className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-36"
//             >
//               {classOptions.length === 0 ? (
//                 <option value="">
//                   No Classes
//                 </option>
//               ) : (
//                 classOptions.map(
//                   (className) => (
//                     <option
//                       key={className}
//                       value={className}
//                     >
//                       Class {className}
//                     </option>
//                   )
//                 )
//               )}
//             </select>

//             <ChevronDown
//               size={17}
//               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//           </div>

//           {/* Division Selector */}
//           <div className="relative">
//             <select
//               value={selectedDivision}
//               onChange={(event) =>
//                 setSelectedDivision(
//                   event.target.value
//                 )
//               }
//               disabled={
//                 loadingStudents ||
//                 divisionOptions.length === 0
//               }
//               className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-36"
//             >
//               {divisionOptions.length === 0 ? (
//                 <option value="">
//                   No Division
//                 </option>
//               ) : (
//                 divisionOptions.map(
//                   (division) => (
//                     <option
//                       key={division}
//                       value={division}
//                     >
//                       Division {division}
//                     </option>
//                   )
//                 )
//               )}
//             </select>

//             <ChevronDown
//               size={17}
//               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//           </div>

//           {/* Refresh */}
//           <button
//             type="button"
//             onClick={handleRefresh}
//             disabled={loadingStudents}
//             className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <RefreshCw
//               size={17}
//               className={
//                 loadingStudents
//                   ? "animate-spin"
//                   : ""
//               }
//             />

//             Refresh
//           </button>

//           {/* Date */}
//           <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
//             <CalendarDays size={17} />

//             {new Date().toLocaleDateString(
//               "en-IN",
//               {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               }
//             )}
//           </div>

//         </div>
//       </div>

//       {/* ---------------------------------- */}
//       {/* Selected Classroom */}
//       {/* ---------------------------------- */}

//       {selectedClass &&
//         selectedDivision && (
//           <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-5 py-3">

//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
//                 Selected Classroom
//               </p>

//               <p className="mt-0.5 text-sm font-semibold text-blue-900">
//                 Class {selectedClass} — Division{" "}
//                 {selectedDivision}
//               </p>
//             </div>

//             <div className="text-right">
//               <p className="text-xs text-blue-500">
//                 Students
//               </p>

//               <p className="text-lg font-bold text-blue-900">
//                 {totalStudents}
//               </p>
//             </div>

//           </div>
//         )}

//       {/* ---------------------------------- */}
//       {/* Error */}
//       {/* ---------------------------------- */}

//       {error && (
//         <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {/* ---------------------------------- */}
//       {/* Statistics */}
//       {/* ---------------------------------- */}

//       <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

//         <StatCard
//           title="Total Students"
//           value={
//             loadingStudents
//               ? "..."
//               : totalStudents
//           }
//           description="Registered students"
//           icon={Users}
//           iconBg="bg-blue-50"
//           iconColor="text-blue-600"
//         />

//         <StatCard
//           title="Present Today"
//           value={
//             loadingStats
//               ? "..."
//               : presentToday
//           }
//           description="Students present"
//           icon={UserCheck}
//           iconBg="bg-emerald-50"
//           iconColor="text-emerald-600"
//         />

//         <StatCard
//           title="Absent Today"
//           value={
//             loadingStats
//               ? "..."
//               : absentToday
//           }
//           description="Students absent"
//           icon={UserX}
//           iconBg="bg-rose-50"
//           iconColor="text-rose-600"
//         />

//         <StatCard
//           title="Attendance Rate"
//           value={
//             loadingStats
//               ? "..."
//               : `${attendanceRate}%`
//           }
//           description="Today's attendance"
//           icon={ScanFace}
//           iconBg="bg-violet-50"
//           iconColor="text-violet-600"
//         />

//       </div>

//       {/* ---------------------------------- */}
//       {/* Main Cards */}
//       {/* ---------------------------------- */}

//       <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

//         {/* AI Attendance */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-7">

//           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
//             <ScanFace
//               className="text-blue-600"
//               size={25}
//             />
//           </div>

//           <h2 className="mt-5 text-xl font-semibold text-slate-900">
//             AI Attendance
//           </h2>

//           <p className="mt-2 leading-relaxed text-slate-500">
//             Upload a classroom photograph and let AI recognize
//             registered students automatically.
//           </p>

//           <Link
//             to="/attendance"
//             className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
//           >
//             <Upload size={18} />
//             Take Attendance
//             <ArrowRight size={17} />
//           </Link>

//         </div>

//         {/* Quick Actions */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-7">

//           <h2 className="text-xl font-semibold text-slate-900">
//             Quick Actions
//           </h2>

//           <p className="mt-2 text-slate-500">
//             Manage your classroom easily.
//           </p>

//           <div className="mt-6 space-y-3">

//             {/* Add Student */}
//             <Link
//               to="/students"
//               className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50"
//             >
//               <div className="flex items-center gap-3">

//                 <Users
//                   className="text-blue-600"
//                   size={20}
//                 />

//                 <div>
//                   <p className="font-medium text-slate-800">
//                     Add New Student
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     Register student details and face photos
//                   </p>
//                 </div>

//               </div>

//               <ArrowRight
//                 size={18}
//                 className="text-slate-400"
//               />
//             </Link>

//             {/* Attendance History */}
//             <Link
//               to="/attendance-history"
//               className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50"
//             >
//               <div className="flex items-center gap-3">

//                 <UserCheck
//                   className="text-blue-600"
//                   size={20}
//                 />

//                 <div>
//                   <p className="font-medium text-slate-800">
//                     View Attendance
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     Check previous attendance records
//                   </p>
//                 </div>

//               </div>

//               <ArrowRight
//                 size={18}
//                 className="text-slate-400"
//               />
//             </Link>

//           </div>
//         </div>

//       </div>

//     </div>
//   );
// }

// // -----------------------------------------
// // Statistics Card
// // -----------------------------------------

// function StatCard({
//   title,
//   value,
//   description,
//   icon: Icon,
//   iconBg,
//   iconColor,
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5">

//       <div className="flex items-center justify-between">

//         <div
//           className={`rounded-xl p-3 ${iconBg}`}
//         >
//           <Icon
//             className={iconColor}
//             size={22}
//           />
//         </div>

//         <span className="text-xs text-slate-400">
//           Overview
//         </span>

//       </div>

//       <h3 className="mt-5 text-3xl font-bold text-slate-900">
//         {value}
//       </h3>

//       <p className="mt-1 font-medium text-slate-700">
//         {title}
//       </p>

//       <p className="mt-1 text-xs text-slate-400">
//         {description}
//       </p>

//     </div>
//   );
// }

// export default Dashboard;



import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ScanFace,
  Upload,
  ArrowRight,
  CalendarDays,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";

function Dashboard() {
  const [allStudents, setAllStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] =
    useState("");

  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);

  const [loadingStudents, setLoadingStudents] =
    useState(true);
  const [loadingStats, setLoadingStats] =
    useState(false);

  const [error, setError] = useState("");

  function getTodayDate() {
    return new Date().toLocaleDateString("en-CA");
  }

  async function fetchStudents() {
    setLoadingStudents(true);
    setError("");

    try {
      const {
        data,
        error: studentsError,
      } = await supabase
        .from("students")
        .select(
          "id,name,roll_number,class_name,division"
        )
        .order("class_name", {
          ascending: true,
        })
        .order("division", {
          ascending: true,
        })
        .order("roll_number", {
          ascending: true,
        });

      if (studentsError) {
        throw studentsError;
      }

      const students = data || [];

      setAllStudents(students);

      if (students.length > 0) {
        const classes = [
          ...new Set(
            students.map(
              (student) => student.class_name
            )
          ),
        ];

        setSelectedClass((current) => {
          if (
            current &&
            classes.includes(current)
          ) {
            return current;
          }

          return classes[0] || "";
        });
      } else {
        setSelectedClass("");
        setSelectedDivision("");
      }
    } catch (err) {
      console.error(
        "Dashboard students error:",
        err
      );

      setError(
        err.message ||
          "Failed to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  }

  const classOptions = [
    ...new Set(
      allStudents.map(
        (student) => student.class_name
      )
    ),
  ];

  const divisionOptions = [
    ...new Set(
      allStudents
        .filter(
          (student) =>
            student.class_name ===
            selectedClass
        )
        .map(
          (student) => student.division
        )
    ),
  ];

  useEffect(() => {
    if (!selectedClass) {
      setSelectedDivision("");
      return;
    }

    setSelectedDivision((current) => {
      if (
        current &&
        divisionOptions.includes(current)
      ) {
        return current;
      }

      return divisionOptions[0] || "";
    });
  }, [selectedClass, allStudents]);

  async function fetchDashboardStats() {
    if (
      !selectedClass ||
      !selectedDivision
    ) {
      setTotalStudents(0);
      setPresentToday(0);
      setAbsentToday(0);
      setAttendanceRate(0);
      return;
    }

    setLoadingStats(true);
    setError("");

    try {
      const classroomStudents =
        allStudents.filter(
          (student) =>
            student.class_name ===
              selectedClass &&
            student.division ===
              selectedDivision
        );

      const studentIds =
        classroomStudents.map(
          (student) => student.id
        );

      const total =
        classroomStudents.length;

      setTotalStudents(total);

      if (studentIds.length === 0) {
        setPresentToday(0);
        setAbsentToday(0);
        setAttendanceRate(0);
        return;
      }

      const today = getTodayDate();

      const {
        data: sessions,
        error: sessionsError,
      } = await supabase
        .from("attendance_sessions")
        .select(
          "id,class_name,division,session_date,session_time"
        )
        .eq("class_name", selectedClass)
        .eq("division", selectedDivision)
        .eq("session_date", today)
        .order("session_time", {
          ascending: false,
        })
        .limit(1);

      if (sessionsError) {
        throw sessionsError;
      }

      if (
        !sessions ||
        sessions.length === 0
      ) {
        setPresentToday(0);
        setAbsentToday(0);
        setAttendanceRate(0);
        return;
      }

      const latestSession = sessions[0];

      const {
        data: attendanceData,
        error: attendanceError,
      } = await supabase
        .from("attendance")
        .select(
          "student_id,status"
        )
        .eq(
          "session_id",
          latestSession.id
        )
        .in(
          "student_id",
          studentIds
        );

      if (attendanceError) {
        throw attendanceError;
      }

      const presentIds = new Set();
      const absentIds = new Set();

      (attendanceData || []).forEach(
        (record) => {
          if (
            record.status ===
            "present"
          ) {
            presentIds.add(
              record.student_id
            );
          }

          if (
            record.status ===
            "absent"
          ) {
            absentIds.add(
              record.student_id
            );
          }
        }
      );

      const present =
        presentIds.size;

      const absent =
        absentIds.size;

      setPresentToday(present);
      setAbsentToday(absent);

      setAttendanceRate(
        total > 0
          ? Math.round(
              (present / total) * 100
            )
          : 0
      );
    } catch (err) {
      console.error(
        "Dashboard statistics error:",
        err
      );

      setError(
        err.message ||
          "Failed to load dashboard statistics."
      );
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (
      selectedClass &&
      selectedDivision &&
      allStudents.length > 0
    ) {
      fetchDashboardStats();
    }
  }, [
    selectedClass,
    selectedDivision,
    allStudents,
  ]);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            Teacher Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            Good Morning, Teacher 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Here's what's happening with your
            classroom today.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {/* Class */}
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(event) =>
                setSelectedClass(
                  event.target.value
                )
              }
              disabled={
                loadingStudents ||
                classOptions.length === 0
              }
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-36 sm:pl-4"
            >
              {classOptions.length === 0 ? (
                <option value="">
                  No Classes
                </option>
              ) : (
                classOptions.map(
                  (className) => (
                    <option
                      key={className}
                      value={className}
                    >
                      Class {className}
                    </option>
                  )
                )
              )}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Division */}
          <div className="relative">
            <select
              value={selectedDivision}
              onChange={(event) =>
                setSelectedDivision(
                  event.target.value
                )
              }
              disabled={
                loadingStudents ||
                divisionOptions.length === 0
              }
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-36 sm:pl-4"
            >
              {divisionOptions.length === 0 ? (
                <option value="">
                  No Division
                </option>
              ) : (
                divisionOptions.map(
                  (division) => (
                    <option
                      key={division}
                      value={division}
                    >
                      Division {division}
                    </option>
                  )
                )
              )}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={fetchStudents}
            disabled={loadingStudents}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <RefreshCw
              size={16}
              className={
                loadingStudents
                  ? "animate-spin"
                  : ""
              }
            />
            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          {/* Date */}
          <div className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 sm:col-span-1 sm:px-4">
            <CalendarDays size={16} />

            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
          </div>
        </div>
      </div>

      {/* Selected classroom */}
      {selectedClass &&
        selectedDivision && (
          <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                Selected Classroom
              </p>

              <p className="mt-1 text-sm font-semibold text-blue-900">
                Class {selectedClass} —
                Division{" "}
                {selectedDivision}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-blue-500">
                Students
              </p>

              <p className="text-lg font-bold text-blue-900">
                {totalStudents}
              </p>
            </div>
          </div>
        )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={
            loadingStudents
              ? "..."
              : totalStudents
          }
          description="Registered students"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Present Today"
          value={
            loadingStats
              ? "..."
              : presentToday
          }
          description="Students present"
          icon={UserCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Absent Today"
          value={
            loadingStats
              ? "..."
              : absentToday
          }
          description="Students absent"
          icon={UserX}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />

        <StatCard
          title="Attendance Rate"
          value={
            loadingStats
              ? "..."
              : `${attendanceRate}%`
          }
          description="Today's attendance"
          icon={ScanFace}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
      </div>

      {/* Main cards */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* AI Attendance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            <ScanFace
              className="text-blue-600"
              size={25}
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            AI Attendance
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
            Upload a classroom photograph
            and let AI recognize registered
            students automatically.
          </p>

          <Link
            to="/attendance"
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            <Upload size={18} />
            Take Attendance
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage your classroom easily.
          </p>

          <div className="mt-5 space-y-3">
            <Link
              to="/students"
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Users
                  className="shrink-0 text-blue-600"
                  size={20}
                />

                <div className="min-w-0">
                  <p className="font-medium text-slate-800">
                    Add New Student
                  </p>

                  <p className="text-xs text-slate-500">
                    Register student details
                    and face photos
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="shrink-0 text-slate-400"
              />
            </Link>

            <Link
              to="/attendance-history"
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <UserCheck
                  className="shrink-0 text-blue-600"
                  size={20}
                />

                <div className="min-w-0">
                  <p className="font-medium text-slate-800">
                    View Attendance
                  </p>

                  <p className="text-xs text-slate-500">
                    Check previous attendance
                    records
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="shrink-0 text-slate-400"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Icon
            className={iconColor}
            size={22}
          />
        </div>

        <span className="text-xs text-slate-400">
          Overview
        </span>
      </div>

      <h3 className="mt-5 text-3xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-1 font-medium text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default Dashboard;