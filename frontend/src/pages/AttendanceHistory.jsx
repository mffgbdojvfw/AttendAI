



// // import { useEffect, useState } from "react";
// // import {
// //   CalendarDays,
// //   Clock,
// //   Users,
// //   CheckCircle2,
// //   XCircle,
// //   Eye,
// //   RefreshCw,
// //   Trash2,
// //   FileSpreadsheet,
// //   Download,
// // } from "lucide-react";

// // import * as XLSX from "xlsx";

// // import { supabase } from "../lib/supabase";

// // function AttendanceHistory() {
// //   const [sessions, setSessions] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const [selectedSession, setSelectedSession] =
// //     useState(null);

// //   const [attendanceDetails, setAttendanceDetails] =
// //     useState([]);

// //   const [loadingDetails, setLoadingDetails] =
// //     useState(false);

// //   const [deletingSessionId, setDeletingSessionId] =
// //     useState(null);

// //   const [downloadingSessionId, setDownloadingSessionId] =
// //     useState(null);

// //   // -----------------------------------------
// //   // Fetch attendance sessions
// //   // -----------------------------------------

// //   async function fetchSessions() {
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const {
// //         data,
// //         error: sessionsError,
// //       } = await supabase
// //         .from("attendance_sessions")
// //         .select("*")
// //         .order("session_date", {
// //           ascending: false,
// //         })
// //         .order("session_time", {
// //           ascending: false,
// //         });

// //       if (sessionsError) {
// //         throw sessionsError;
// //       }

// //       setSessions(data || []);
// //     } catch (fetchError) {
// //       console.error(
// //         "Attendance history error:",
// //         fetchError
// //       );

// //       setError(
// //         fetchError.message ||
// //           "Failed to load attendance history."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // -----------------------------------------
// //   // Open attendance session
// //   // -----------------------------------------

// //   async function openSession(session) {
// //     setSelectedSession(session);
// //     setLoadingDetails(true);
// //     setError("");

// //     try {
// //       const {
// //         data,
// //         error: attendanceError,
// //       } = await supabase
// //         .from("attendance")
// //         .select(`
// //           id,
// //           student_id,
// //           attendance_date,
// //           attendance_time,
// //           status,
// //           confidence,
// //           source,
// //           students (
// //             id,
// //             name,
// //             roll_number,
// //             class_name,
// //             division,
// //             photo_url
// //           )
// //         `)
// //         .eq("session_id", session.id)
// //         .order("status", {
// //           ascending: true,
// //         });

// //       if (attendanceError) {
// //         throw attendanceError;
// //       }

// //       setAttendanceDetails(data || []);
// //     } catch (detailsError) {
// //       console.error(
// //         "Attendance details error:",
// //         detailsError
// //       );

// //       setError(
// //         detailsError.message ||
// //           "Failed to load attendance details."
// //       );
// //     } finally {
// //       setLoadingDetails(false);
// //     }
// //   }

// //   // -----------------------------------------
// //   // Close selected session
// //   // -----------------------------------------

// //   function closeSession() {
// //     setSelectedSession(null);
// //     setAttendanceDetails([]);
// //     setError("");
// //   }

// //   // -----------------------------------------
// //   // Delete attendance session
// //   // -----------------------------------------

// //   async function deleteSession(session) {
// //     const confirmed = window.confirm(
// //       `Are you sure you want to delete the attendance record for Class ${session.class_name} - Division ${session.division} on ${formatDate(
// //         session.session_date
// //       )}?`
// //     );

// //     if (!confirmed) {
// //       return;
// //     }

// //     setDeletingSessionId(session.id);
// //     setError("");

// //     try {
// //       const {
// //         error: deleteError,
// //       } = await supabase
// //         .from("attendance_sessions")
// //         .delete()
// //         .eq("id", session.id);

// //       if (deleteError) {
// //         throw deleteError;
// //       }

// //       if (
// //         selectedSession &&
// //         selectedSession.id === session.id
// //       ) {
// //         setSelectedSession(null);
// //         setAttendanceDetails([]);
// //       }

// //       setSessions((previousSessions) =>
// //         previousSessions.filter(
// //           (item) => item.id !== session.id
// //         )
// //       );
// //     } catch (deleteError) {
// //       console.error(
// //         "Delete attendance session error:",
// //         deleteError
// //       );

// //       setError(
// //         deleteError.message ||
// //           "Failed to delete attendance record."
// //       );
// //     } finally {
// //       setDeletingSessionId(null);
// //     }
// //   }

// //   // -----------------------------------------
// //   // Download Excel for a session
// //   // -----------------------------------------

// //   // async function downloadExcel(session) {
// //   //   setDownloadingSessionId(session.id);
// //   //   setError("");

// //   //   try {
// //   //     // ---------------------------------------
// //   //     // Get attendance records for this session
// //   //     // ---------------------------------------

// //   //     const {
// //   //       data,
// //   //       error: attendanceError,
// //   //     } = await supabase
// //   //       .from("attendance")
// //   //       .select(`
// //   //         id,
// //   //         student_id,
// //   //         attendance_date,
// //   //         attendance_time,
// //   //         status,
// //   //         confidence,
// //   //         source,
// //   //         students (
// //   //           id,
// //   //           name,
// //   //           roll_number,
// //   //           class_name,
// //   //           division
// //   //         )
// //   //       `)
// //   //       .eq("session_id", session.id)
// //   //       .order("student_id", {
// //   //         ascending: true,
// //   //       });

// //   //     if (attendanceError) {
// //   //       throw attendanceError;
// //   //     }

// //   //     const attendanceRecords = data || [];

// //   //     // ---------------------------------------
// //   //     // Create Excel data
// //   //     // ---------------------------------------

// //   //     const excelData = attendanceRecords.map(
// //   //       (attendance) => {
// //   //         const student = attendance.students;

// //   //         return {
// //   //           Date: formatDate(
// //   //             session.session_date
// //   //           ),

// //   //           Time: formatTime(
// //   //             session.session_time
// //   //           ),

// //   //           Class:
// //   //             session.class_name || "-",

// //   //           Division:
// //   //             session.division || "-",

// //   //           "Roll Number":
// //   //             student?.roll_number || "-",

// //   //           "Student Name":
// //   //             student?.name ||
// //   //             "Unknown Student",

// //   //           Status:
// //   //             attendance.status
// //   //               ? attendance.status
// //   //                   .charAt(0)
// //   //                   .toUpperCase() +
// //   //                 attendance.status.slice(1)
// //   //               : "-",

// //   //           Confidence:
// //   //             attendance.confidence != null
// //   //               ? `${Number(
// //   //                   attendance.confidence
// //   //                 ).toFixed(2)}%`
// //   //               : "-",

// //   //           Source:
// //   //             attendance.source || "manual",
// //   //         };
// //   //       }
// //   //     );

// //   //     // ---------------------------------------
// //   //     // Create worksheet
// //   //     // ---------------------------------------

// //   //     const worksheet =
// //   //       XLSX.utils.json_to_sheet(
// //   //         excelData
// //   //       );

// //   //     // ---------------------------------------
// //   //     // Set column widths
// //   //     // ---------------------------------------

// //   //     worksheet["!cols"] = [
// //   //       { wch: 15 }, // Date
// //   //       { wch: 12 }, // Time
// //   //       { wch: 10 }, // Class
// //   //       { wch: 12 }, // Division
// //   //       { wch: 15 }, // Roll Number
// //   //       { wch: 28 }, // Student Name
// //   //       { wch: 12 }, // Status
// //   //       { wch: 15 }, // Confidence
// //   //       { wch: 12 }, // Source
// //   //     ];

// //   //     // ---------------------------------------
// //   //     // Create workbook
// //   //     // ---------------------------------------

// //   //     const workbook =
// //   //       XLSX.utils.book_new();

// //   //     XLSX.utils.book_append_sheet(
// //   //       workbook,
// //   //       worksheet,
// //   //       "Attendance"
// //   //     );

// //   //     // ---------------------------------------
// //   //     // Create safe filename
// //   //     // ---------------------------------------

// //   //     const safeClass =
// //   //       String(
// //   //         session.class_name || "Class"
// //   //       ).replace(
// //   //         /[^a-zA-Z0-9-_]/g,
// //   //         "_"
// //   //       );

// //   //     const safeDivision =
// //   //       String(
// //   //         session.division || "Division"
// //   //       ).replace(
// //   //         /[^a-zA-Z0-9-_]/g,
// //   //         "_"
// //   //       );

// //   //     const safeDate =
// //   //       String(
// //   //         session.session_date ||
// //   //           "Attendance"
// //   //       ).replace(
// //   //         /[^a-zA-Z0-9-_]/g,
// //   //         "_"
// //   //       );

// //   //     const filename =
// //   //       `Attendance_Class_${safeClass}_Division_${safeDivision}_${safeDate}.xlsx`;

// //   //     // ---------------------------------------
// //   //     // Download Excel
// //   //     // ---------------------------------------

// //   //     XLSX.writeFile(
// //   //       workbook,
// //   //       filename
// //   //     );
// //   //   } catch (downloadError) {
// //   //     console.error(
// //   //       "Excel download error:",
// //   //       downloadError
// //   //     );

// //   //     setError(
// //   //       downloadError.message ||
// //   //         "Failed to download Excel file."
// //   //     );
// //   //   } finally {
// //   //     setDownloadingSessionId(null);
// //   //   }
// //   // }

// //   async function downloadExcel(session) {
// //   setDownloadingSessionId(session.id);
// //   setError("");

// //   try {
// //     // ---------------------------------------
// //     // 1. Get ALL students from this
// //     // Class + Division
// //     // ---------------------------------------

// //     const {
// //       data: students,
// //       error: studentsError,
// //     } = await supabase
// //       .from("students")
// //       .select(`
// //         id,
// //         name,
// //         roll_number,
// //         class_name,
// //         division
// //       `)
// //       .eq("class_name", session.class_name)
// //       .eq("division", session.division)
// //       .order("roll_number", {
// //         ascending: true,
// //       });

// //     if (studentsError) {
// //       throw studentsError;
// //     }

// //     // ---------------------------------------
// //     // 2. Get attendance records for this
// //     // particular session
// //     // ---------------------------------------

// //     const {
// //       data: attendanceRecords,
// //       error: attendanceError,
// //     } = await supabase
// //       .from("attendance")
// //       .select(`
// //         id,
// //         student_id,
// //         status,
// //         confidence,
// //         source,
// //         attendance_date,
// //         attendance_time
// //       `)
// //       .eq("session_id", session.id);

// //     if (attendanceError) {
// //       throw attendanceError;
// //     }

// //     // ---------------------------------------
// //     // 3. Create a map of attendance
// //     // using student_id
// //     // ---------------------------------------

// //     const attendanceMap = new Map();

// //     (attendanceRecords || []).forEach(
// //       (record) => {
// //         attendanceMap.set(
// //           record.student_id,
// //           record
// //         );
// //       }
// //     );

// //     // ---------------------------------------
// //     // 4. Create Excel rows from ALL students
// //     // ---------------------------------------

// //     const excelData = (students || []).map(
// //       (student) => {
// //         const attendance =
// //           attendanceMap.get(student.id);

// //         return {
// //           Date: formatDate(
// //             session.session_date
// //           ),

// //           Time: formatTime(
// //             session.session_time
// //           ),

// //           Class:
// //             session.class_name || "-",

// //           Division:
// //             session.division || "-",

// //           "Roll Number":
// //             student.roll_number || "-",

// //           "Student Name":
// //             student.name || "-",

// //           Status:
// //             attendance?.status
// //               ? attendance.status
// //                   .charAt(0)
// //                   .toUpperCase() +
// //                 attendance.status.slice(1)
// //               : "Absent",

// //           Confidence:
// //             attendance?.confidence != null
// //               ? `${Number(
// //                   attendance.confidence
// //                 ).toFixed(2)}%`
// //               : "-",

// //           Source:
// //             attendance?.source || "AI",
// //         };
// //       }
// //     );

// //     // ---------------------------------------
// //     // 5. Safety check
// //     // ---------------------------------------

// //     if (excelData.length === 0) {
// //       throw new Error(
// //         "No students were found for this class and division."
// //       );
// //     }

// //     // ---------------------------------------
// //     // 6. Create worksheet
// //     // ---------------------------------------

// //     const worksheet =
// //       XLSX.utils.json_to_sheet(
// //         excelData
// //       );

// //     // ---------------------------------------
// //     // 7. Column widths
// //     // ---------------------------------------

// //     worksheet["!cols"] = [
// //       { wch: 15 },
// //       { wch: 12 },
// //       { wch: 10 },
// //       { wch: 12 },
// //       { wch: 15 },
// //       { wch: 28 },
// //       { wch: 12 },
// //       { wch: 15 },
// //       { wch: 12 },
// //     ];

// //     // ---------------------------------------
// //     // 8. Create workbook
// //     // ---------------------------------------

// //     const workbook =
// //       XLSX.utils.book_new();

// //     XLSX.utils.book_append_sheet(
// //       workbook,
// //       worksheet,
// //       "Attendance"
// //     );

// //     // ---------------------------------------
// //     // 9. Create safe filename
// //     // ---------------------------------------

// //     const safeClass =
// //       String(
// //         session.class_name || "Class"
// //       ).replace(
// //         /[^a-zA-Z0-9-_]/g,
// //         "_"
// //       );

// //     const safeDivision =
// //       String(
// //         session.division || "Division"
// //       ).replace(
// //         /[^a-zA-Z0-9-_]/g,
// //         "_"
// //       );

// //     const safeDate =
// //       String(
// //         session.session_date ||
// //           "Attendance"
// //       ).replace(
// //         /[^a-zA-Z0-9-_]/g,
// //         "_"
// //       );

// //     const filename =
// //       `Attendance_Class_${safeClass}_Division_${safeDivision}_${safeDate}.xlsx`;

// //     // ---------------------------------------
// //     // 10. Download
// //     // ---------------------------------------

// //     XLSX.writeFile(
// //       workbook,
// //       filename
// //     );
// //   } catch (downloadError) {
// //     console.error(
// //       "Excel download error:",
// //       downloadError
// //     );

// //     setError(
// //       downloadError.message ||
// //         "Failed to download Excel file."
// //     );
// //   } finally {
// //     setDownloadingSessionId(null);
// //   }
// // }

// //   // -----------------------------------------
// //   // Load sessions when page opens
// //   // -----------------------------------------

// //   useEffect(() => {
// //     fetchSessions();
// //   }, []);

// //   // -----------------------------------------
// //   // Format date
// //   // -----------------------------------------

// //   function formatDate(dateString) {
// //     if (!dateString) {
// //       return "-";
// //     }

// //     return new Date(
// //       `${dateString}T00:00:00`
// //     ).toLocaleDateString("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     });
// //   }

// //   // -----------------------------------------
// //   // Format time
// //   // -----------------------------------------

// //   function formatTime(dateString) {
// //     if (!dateString) {
// //       return "-";
// //     }

// //     return new Date(
// //       dateString
// //     ).toLocaleTimeString("en-IN", {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   }

// //   // -----------------------------------------
// //   // Present / absent counts
// //   // -----------------------------------------

// //   const presentCount =
// //     attendanceDetails.filter(
// //       (item) =>
// //         item.status === "present"
// //     ).length;

// //   const absentCount =
// //     attendanceDetails.filter(
// //       (item) =>
// //         item.status === "absent"
// //     ).length;

// //   // -----------------------------------------
// //   // UI
// //   // -----------------------------------------

// //   return (
// //     <div className="space-y-6">

// //       {/* ----------------------------------- */}
// //       {/* Header */}
// //       {/* ----------------------------------- */}

// //       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

// //         <div>
// //           <h1 className="text-2xl font-bold text-slate-900">
// //             Attendance History
// //           </h1>

// //           <p className="mt-1 text-sm text-slate-500">
// //             View previous attendance sessions and student records.
// //           </p>
// //         </div>

// //         <button
// //           type="button"
// //           onClick={fetchSessions}
// //           disabled={loading}
// //           className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
// //         >
// //           <RefreshCw
// //             size={17}
// //             className={
// //               loading
// //                 ? "animate-spin"
// //                 : ""
// //             }
// //           />

// //           Refresh
// //         </button>
// //       </div>

// //       {/* ----------------------------------- */}
// //       {/* Error */}
// //       {/* ----------------------------------- */}

// //       {error && (
// //         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //           {error}
// //         </div>
// //       )}

// //       {/* ----------------------------------- */}
// //       {/* Selected Session */}
// //       {/* ----------------------------------- */}

// //       {selectedSession ? (
// //         <div className="space-y-6">

// //           <button
// //             type="button"
// //             onClick={closeSession}
// //             className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
// //           >
// //             ← Back to Attendance History
// //           </button>

// //           {/* Session Summary */}
// //           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

// //             <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

// //               <div>
// //                 <h2 className="text-xl font-bold text-slate-900">
// //                   Class{" "}
// //                   {selectedSession.class_name}{" "}
// //                   — Division{" "}
// //                   {selectedSession.division}
// //                 </h2>

// //                 <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

// //                   <div className="flex items-center gap-2">
// //                     <CalendarDays size={16} />

// //                     {formatDate(
// //                       selectedSession.session_date
// //                     )}
// //                   </div>

// //                   <div className="flex items-center gap-2">
// //                     <Clock size={16} />

// //                     {formatTime(
// //                       selectedSession.session_time
// //                     )}
// //                   </div>

// //                 </div>
// //               </div>

// //               {/* Right side actions */}
// //               <div className="flex flex-wrap items-center gap-3">

// //                 {/* Present */}
// //                 <div className="rounded-xl bg-emerald-50 px-5 py-3 text-center">
// //                   <div className="text-xl font-bold text-emerald-700">
// //                     {presentCount}
// //                   </div>

// //                   <div className="text-xs font-medium text-emerald-600">
// //                     Present
// //                   </div>
// //                 </div>

// //                 {/* Absent */}
// //                 <div className="rounded-xl bg-red-50 px-5 py-3 text-center">
// //                   <div className="text-xl font-bold text-red-700">
// //                     {absentCount}
// //                   </div>

// //                   <div className="text-xs font-medium text-red-600">
// //                     Absent
// //                   </div>
// //                 </div>

// //                 {/* Download */}
// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     downloadExcel(
// //                       selectedSession
// //                     )
// //                   }
// //                   disabled={
// //                     loadingDetails ||
// //                     downloadingSessionId ===
// //                       selectedSession.id
// //                   }
// //                   className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
// //                 >
// //                   {downloadingSessionId ===
// //                   selectedSession.id ? (
// //                     <RefreshCw
// //                       size={17}
// //                       className="animate-spin"
// //                     />
// //                   ) : (
// //                     <FileSpreadsheet
// //                       size={17}
// //                     />
// //                   )}

// //                   {downloadingSessionId ===
// //                   selectedSession.id
// //                     ? "Preparing..."
// //                     : "Download Excel"}
// //                 </button>

// //               </div>
// //             </div>
// //           </div>

// //           {/* -------------------------------- */}
// //           {/* Student Attendance Table */}
// //           {/* -------------------------------- */}

// //           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

// //             <div className="border-b border-slate-200 px-6 py-4">
// //               <h3 className="font-semibold text-slate-900">
// //                 Student Attendance
// //               </h3>
// //             </div>

// //             {loadingDetails ? (
// //               <div className="flex items-center justify-center px-6 py-12">

// //                 <div className="flex items-center gap-3 text-sm text-slate-500">

// //                   <RefreshCw
// //                     size={18}
// //                     className="animate-spin"
// //                   />

// //                   Loading attendance...

// //                 </div>

// //               </div>
// //             ) : attendanceDetails.length ===
// //               0 ? (
// //               <div className="px-6 py-12 text-center">

// //                 <Users
// //                   size={40}
// //                   className="mx-auto text-slate-300"
// //                 />

// //                 <p className="mt-3 text-sm text-slate-500">
// //                   No attendance records found for this session.
// //                 </p>

// //               </div>
// //             ) : (
// //               <div className="overflow-x-auto">

// //                 <table className="w-full min-w-[700px]">

// //                   <thead>
// //                     <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

// //                       <th className="px-6 py-4">
// //                         Student
// //                       </th>

// //                       <th className="px-6 py-4">
// //                         Roll Number
// //                       </th>

// //                       <th className="px-6 py-4">
// //                         Status
// //                       </th>

// //                       <th className="px-6 py-4">
// //                         Confidence
// //                       </th>

// //                       <th className="px-6 py-4">
// //                         Source
// //                       </th>

// //                     </tr>
// //                   </thead>

// //                   <tbody>

// //                     {attendanceDetails.map(
// //                       (attendance) => {
// //                         const student =
// //                           attendance.students;

// //                         const isPresent =
// //                           attendance.status ===
// //                           "present";

// //                         return (
// //                           <tr
// //                             key={
// //                               attendance.id
// //                             }
// //                             className="border-b border-slate-100 last:border-b-0"
// //                           >

// //                             {/* Student */}
// //                             <td className="px-6 py-4">

// //                               <div className="flex items-center gap-3">

// //                                 {student?.photo_url ? (
// //                                   <img
// //                                     src={
// //                                       student.photo_url
// //                                     }
// //                                     alt={
// //                                       student.name
// //                                     }
// //                                     className="h-10 w-10 rounded-full object-cover"
// //                                   />
// //                                 ) : (
// //                                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
// //                                     {student?.name
// //                                       ?.charAt(
// //                                         0
// //                                       )
// //                                       ?.toUpperCase() ||
// //                                       "?"}
// //                                   </div>
// //                                 )}

// //                                 <div>

// //                                   <div className="font-medium text-slate-900">
// //                                     {student?.name ||
// //                                       "Unknown Student"}
// //                                   </div>

// //                                   <div className="text-xs text-slate-500">
// //                                     {student?.class_name ||
// //                                       "-"}{" "}
// //                                     -{" "}
// //                                     {student?.division ||
// //                                       "-"}
// //                                   </div>

// //                                 </div>

// //                               </div>

// //                             </td>

// //                             {/* Roll */}
// //                             <td className="px-6 py-4 text-sm text-slate-600">
// //                               {student?.roll_number ||
// //                                 "-"}
// //                             </td>

// //                             {/* Status */}
// //                             <td className="px-6 py-4">

// //                               {isPresent ? (
// //                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">

// //                                   <CheckCircle2
// //                                     size={14}
// //                                   />

// //                                   Present

// //                                 </span>
// //                               ) : (
// //                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">

// //                                   <XCircle
// //                                     size={14}
// //                                   />

// //                                   Absent

// //                                 </span>
// //                               )}

// //                             </td>

// //                             {/* Confidence */}
// //                             <td className="px-6 py-4 text-sm text-slate-600">

// //                               {attendance.confidence !=
// //                               null
// //                                 ? `${Number(
// //                                     attendance.confidence
// //                                   ).toFixed(
// //                                     2
// //                                   )}%`
// //                                 : "-"}

// //                             </td>

// //                             {/* Source */}
// //                             <td className="px-6 py-4">

// //                               <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
// //                                 {attendance.source ||
// //                                   "manual"}
// //                               </span>

// //                             </td>

// //                           </tr>
// //                         );
// //                       }
// //                     )}

// //                   </tbody>

// //                 </table>

// //               </div>
// //             )}

// //           </div>

// //         </div>
// //       ) : (

// //         /* ---------------------------------- */
// //         /* Sessions List */
// //         /* ---------------------------------- */

// //         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

// //           {loading ? (
// //             <div className="flex items-center justify-center px-6 py-16">

// //               <div className="flex items-center gap-3 text-sm text-slate-500">

// //                 <RefreshCw
// //                   size={18}
// //                   className="animate-spin"
// //                 />

// //                 Loading attendance history...

// //               </div>

// //             </div>
// //           ) : sessions.length === 0 ? (

// //             <div className="px-6 py-16 text-center">

// //               <CalendarDays
// //                 size={48}
// //                 className="mx-auto text-slate-300"
// //               />

// //               <h3 className="mt-4 font-semibold text-slate-900">
// //                 No attendance history
// //               </h3>

// //               <p className="mt-1 text-sm text-slate-500">
// //                 Saved attendance sessions will appear here.
// //               </p>

// //             </div>
// //           ) : (

// //             <div className="overflow-x-auto">

// //               <table className="w-full min-w-[1000px]">

// //                 <thead>

// //                   <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

// //                     <th className="px-6 py-4">
// //                       Date
// //                     </th>

// //                     <th className="px-6 py-4">
// //                       Class
// //                     </th>

// //                     <th className="px-6 py-4">
// //                       Division
// //                     </th>

// //                     <th className="px-6 py-4">
// //                       Session Time
// //                     </th>

// //                     <th className="px-6 py-4 text-right">
// //                       Actions
// //                     </th>

// //                   </tr>

// //                 </thead>

// //                 <tbody>

// //                   {sessions.map(
// //                     (session) => (
// //                       <tr
// //                         key={session.id}
// //                         className="border-b border-slate-100 transition hover:bg-slate-50 last:border-b-0"
// //                       >

// //                         {/* Date */}
// //                         <td className="px-6 py-4">

// //                           <div className="flex items-center gap-2 text-sm font-medium text-slate-900">

// //                             <CalendarDays
// //                               size={16}
// //                               className="text-slate-400"
// //                             />

// //                             {formatDate(
// //                               session.session_date
// //                             )}

// //                           </div>

// //                         </td>

// //                         {/* Class */}
// //                         <td className="px-6 py-4 text-sm text-slate-700">

// //                           Class{" "}
// //                           {session.class_name}

// //                         </td>

// //                         {/* Division */}
// //                         <td className="px-6 py-4">

// //                           <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
// //                             {session.division}
// //                           </span>

// //                         </td>

// //                         {/* Time */}
// //                         <td className="px-6 py-4 text-sm text-slate-500">

// //                           {formatTime(
// //                             session.session_time
// //                           )}

// //                         </td>

// //                         {/* Actions */}
// //                         <td className="px-6 py-4">

// //                           <div className="flex justify-end gap-2">

// //                             {/* View */}
// //                             <button
// //                               type="button"
// //                               onClick={() =>
// //                                 openSession(
// //                                   session
// //                                 )
// //                               }
// //                               className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
// //                             >
// //                               <Eye
// //                                 size={16}
// //                               />

// //                               View
// //                             </button>

// //                             {/* Excel */}
// //                             <button
// //                               type="button"
// //                               onClick={() =>
// //                                 downloadExcel(
// //                                   session
// //                                 )
// //                               }
// //                               disabled={
// //                                 downloadingSessionId ===
// //                                 session.id
// //                               }
// //                               className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
// //                             >

// //                               {downloadingSessionId ===
// //                               session.id ? (
// //                                 <RefreshCw
// //                                   size={16}
// //                                   className="animate-spin"
// //                                 />
// //                               ) : (
// //                                 <Download
// //                                   size={16}
// //                                 />
// //                               )}

// //                               {downloadingSessionId ===
// //                               session.id
// //                                 ? "Preparing..."
// //                                 : "Excel"}

// //                             </button>

// //                             {/* Delete */}
// //                             <button
// //                               type="button"
// //                               onClick={() =>
// //                                 deleteSession(
// //                                   session
// //                                 )
// //                               }
// //                               disabled={
// //                                 deletingSessionId ===
// //                                 session.id
// //                               }
// //                               className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
// //                             >

// //                               {deletingSessionId ===
// //                               session.id ? (
// //                                 <RefreshCw
// //                                   size={16}
// //                                   className="animate-spin"
// //                                 />
// //                               ) : (
// //                                 <Trash2
// //                                   size={16}
// //                                 />
// //                               )}

// //                               {deletingSessionId ===
// //                               session.id
// //                                 ? "Deleting..."
// //                                 : "Delete"}

// //                             </button>

// //                           </div>

// //                         </td>

// //                       </tr>
// //                     )
// //                   )}

// //                 </tbody>

// //               </table>

// //             </div>
// //           )}

// //         </div>
// //       )}

// //     </div>
// //   );
// // }

// // export default AttendanceHistory;



// import { useEffect, useState } from "react";
// import {
//   CalendarDays,
//   Clock,
//   Users,
//   CheckCircle2,
//   XCircle,
//   Eye,
//   RefreshCw,
//   Trash2,
//   FileSpreadsheet,
//   Download,
// } from "lucide-react";

// import * as XLSX from "xlsx";

// import { supabase } from "../lib/supabase";

// function AttendanceHistory() {
//   const [sessions, setSessions] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [selectedSession, setSelectedSession] =
//     useState(null);

//   const [attendanceDetails, setAttendanceDetails] =
//     useState([]);

//   const [loadingDetails, setLoadingDetails] =
//     useState(false);

//   const [deletingSessionId, setDeletingSessionId] =
//     useState(null);

//   const [downloadingSessionId, setDownloadingSessionId] =
//     useState(null);

//   async function fetchSessions() {
//     setLoading(true);
//     setError("");

//     try {
//       const {
//         data,
//         error: sessionsError,
//       } = await supabase
//         .from("attendance_sessions")
//         .select("*")
//         .order("session_date", {
//           ascending: false,
//         })
//         .order("session_time", {
//           ascending: false,
//         });

//       if (sessionsError) {
//         throw sessionsError;
//       }

//       setSessions(data || []);
//     } catch (err) {
//       console.error(
//         "Attendance history error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to load attendance history."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function openSession(session) {
//     setSelectedSession(session);
//     setLoadingDetails(true);
//     setError("");

//     try {
//       const {
//         data,
//         error: attendanceError,
//       } = await supabase
//         .from("attendance")
//         .select(`
//           id,
//           student_id,
//           attendance_date,
//           attendance_time,
//           status,
//           confidence,
//           source,
//           students (
//             id,
//             name,
//             roll_number,
//             class_name,
//             division,
//             photo_url
//           )
//         `)
//         .eq(
//           "session_id",
//           session.id
//         )
//         .order("status", {
//           ascending: true,
//         });

//       if (attendanceError) {
//         throw attendanceError;
//       }

//       setAttendanceDetails(
//         data || []
//       );
//     } catch (err) {
//       console.error(
//         "Attendance details error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to load attendance details."
//       );
//     } finally {
//       setLoadingDetails(false);
//     }
//   }

//   function closeSession() {
//     setSelectedSession(null);
//     setAttendanceDetails([]);
//     setError("");
//   }

//   async function deleteSession(
//     session
//   ) {
//     const confirmed =
//       window.confirm(
//         `Are you sure you want to delete the attendance record for Class ${session.class_name} - Division ${session.division} on ${formatDate(
//           session.session_date
//         )}?`
//       );

//     if (!confirmed) {
//       return;
//     }

//     setDeletingSessionId(
//       session.id
//     );
//     setError("");

//     try {
//       const {
//         error: deleteError,
//       } = await supabase
//         .from(
//           "attendance_sessions"
//         )
//         .delete()
//         .eq("id", session.id);

//       if (deleteError) {
//         throw deleteError;
//       }

//       if (
//         selectedSession?.id ===
//         session.id
//       ) {
//         setSelectedSession(null);
//         setAttendanceDetails([]);
//       }

//       setSessions((previous) =>
//         previous.filter(
//           (item) =>
//             item.id !== session.id
//         )
//       );
//     } catch (err) {
//       console.error(
//         "Delete attendance error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to delete attendance record."
//       );
//     } finally {
//       setDeletingSessionId(null);
//     }
//   }

//   async function downloadExcel(
//     session
//   ) {
//     setDownloadingSessionId(
//       session.id
//     );
//     setError("");

//     try {
//       // Get ALL students for this classroom
//       const {
//         data: students,
//         error: studentsError,
//       } = await supabase
//         .from("students")
//         .select(
//           "id,name,roll_number,class_name,division"
//         )
//         .eq(
//           "class_name",
//           session.class_name
//         )
//         .eq(
//           "division",
//           session.division
//         )
//         .order("roll_number", {
//           ascending: true,
//         });

//       if (studentsError) {
//         throw studentsError;
//       }

//       // Get attendance for this session
//       const {
//         data: attendanceRecords,
//         error: attendanceError,
//       } = await supabase
//         .from("attendance")
//         .select(
//           "id,student_id,status,confidence,source"
//         )
//         .eq(
//           "session_id",
//           session.id
//         );

//       if (attendanceError) {
//         throw attendanceError;
//       }

//       const attendanceMap =
//         new Map();

//       (
//         attendanceRecords || []
//       ).forEach((record) => {
//         attendanceMap.set(
//           record.student_id,
//           record
//         );
//       });

//       const excelData =
//         (students || []).map(
//           (student) => {
//             const attendance =
//               attendanceMap.get(
//                 student.id
//               );

//             return {
//               Date: formatDate(
//                 session.session_date
//               ),

//               Time: formatTime(
//                 session.session_time
//               ),

//               Class:
//                 session.class_name,

//               Division:
//                 session.division,

//               "Roll Number":
//                 student.roll_number,

//               "Student Name":
//                 student.name,

//               Status:
//                 attendance?.status
//                   ? attendance.status
//                       .charAt(0)
//                       .toUpperCase() +
//                     attendance.status.slice(
//                       1
//                     )
//                   : "Absent",

//               Confidence:
//                 attendance?.confidence !=
//                 null
//                   ? `${Number(
//                       attendance.confidence
//                     ).toFixed(2)}%`
//                   : "-",

//               Source:
//                 attendance?.source ||
//                 "manual",
//             };
//           }
//         );

//       if (
//         excelData.length === 0
//       ) {
//         throw new Error(
//           "No students found for this class and division."
//         );
//       }

//       const worksheet =
//         XLSX.utils.json_to_sheet(
//           excelData
//         );

//       worksheet["!cols"] = [
//         { wch: 15 },
//         { wch: 12 },
//         { wch: 10 },
//         { wch: 12 },
//         { wch: 15 },
//         { wch: 30 },
//         { wch: 12 },
//         { wch: 15 },
//         { wch: 12 },
//       ];

//       const workbook =
//         XLSX.utils.book_new();

//       XLSX.utils.book_append_sheet(
//         workbook,
//         worksheet,
//         "Attendance"
//       );

//       const safeClass =
//         String(
//           session.class_name ||
//             "Class"
//         ).replace(
//           /[^a-zA-Z0-9-_]/g,
//           "_"
//         );

//       const safeDivision =
//         String(
//           session.division ||
//             "Division"
//         ).replace(
//           /[^a-zA-Z0-9-_]/g,
//           "_"
//         );

//       const safeDate =
//         String(
//           session.session_date ||
//             "Attendance"
//         ).replace(
//           /[^a-zA-Z0-9-_]/g,
//           "_"
//         );

//       const filename =
//         `Attendance_Class_${safeClass}_Division_${safeDivision}_${safeDate}.xlsx`;

//       XLSX.writeFile(
//         workbook,
//         filename
//       );
//     } catch (err) {
//       console.error(
//         "Excel download error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to download Excel file."
//       );
//     } finally {
//       setDownloadingSessionId(
//         null
//       );
//     }
//   }

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   function formatDate(
//     dateString
//   ) {
//     if (!dateString) {
//       return "-";
//     }

//     return new Date(
//       `${dateString}T00:00:00`
//     ).toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   }

//   function formatTime(
//     dateString
//   ) {
//     if (!dateString) {
//       return "-";
//     }

//     return new Date(
//       dateString
//     ).toLocaleTimeString(
//       "en-IN",
//       {
//         hour: "2-digit",
//         minute: "2-digit",
//       }
//     );
//   }

//   const presentCount =
//     attendanceDetails.filter(
//       (item) =>
//         item.status === "present"
//     ).length;

//   const absentCount =
//     attendanceDetails.filter(
//       (item) =>
//         item.status === "absent"
//     ).length;

//   return (
//     <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
//             Attendance History
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             View previous attendance
//             sessions and student records.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={fetchSessions}
//           disabled={loading}
//           className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
//         >
//           <RefreshCw
//             size={17}
//             className={
//               loading
//                 ? "animate-spin"
//                 : ""
//             }
//           />
//           Refresh
//         </button>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {selectedSession ? (
//         <div className="space-y-5 sm:space-y-6">
//           {/* Back */}
//           <button
//             type="button"
//             onClick={closeSession}
//             className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
//           >
//             ← Back to Attendance History
//           </button>

//           {/* Session header */}
//           <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
//             <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
//                   Class{" "}
//                   {
//                     selectedSession.class_name
//                   }{" "}
//                   — Division{" "}
//                   {
//                     selectedSession.division
//                   }
//                 </h2>

//                 <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
//                   <div className="flex items-center gap-2">
//                     <CalendarDays
//                       size={16}
//                     />
//                     {formatDate(
//                       selectedSession.session_date
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Clock size={16} />
//                     {formatTime(
//                       selectedSession.session_time
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-2 sm:gap-3">
//                 <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
//                   <div className="text-xl font-bold text-emerald-700">
//                     {presentCount}
//                   </div>

//                   <div className="text-xs font-medium text-emerald-600">
//                     Present
//                   </div>
//                 </div>

//                 <div className="rounded-xl bg-red-50 px-4 py-3 text-center">
//                   <div className="text-xl font-bold text-red-700">
//                     {absentCount}
//                   </div>

//                   <div className="text-xs font-medium text-red-600">
//                     Absent
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     downloadExcel(
//                       selectedSession
//                     )
//                   }
//                   disabled={
//                     loadingDetails ||
//                     downloadingSessionId ===
//                       selectedSession.id
//                   }
//                   className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
//                 >
//                   {downloadingSessionId ===
//                   selectedSession.id ? (
//                     <RefreshCw
//                       size={17}
//                       className="animate-spin"
//                     />
//                   ) : (
//                     <FileSpreadsheet
//                       size={17}
//                     />
//                   )}

//                   {downloadingSessionId ===
//                   selectedSession.id
//                     ? "Preparing..."
//                     : "Download Excel"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
//               <h3 className="font-semibold text-slate-900">
//                 Student Attendance
//               </h3>
//             </div>

//             {loadingDetails ? (
//               <div className="flex items-center justify-center px-6 py-12 text-sm text-slate-500">
//                 <div className="flex items-center gap-3">
//                   <RefreshCw
//                     size={18}
//                     className="animate-spin"
//                   />
//                   Loading attendance...
//                 </div>
//               </div>
//             ) : attendanceDetails.length ===
//               0 ? (
//               <div className="px-6 py-12 text-center">
//                 <Users
//                   size={40}
//                   className="mx-auto text-slate-300"
//                 />

//                 <p className="mt-3 text-sm text-slate-500">
//                   No attendance records
//                   found for this session.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[700px]">
//                   <thead>
//                     <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       <th className="px-5 py-4 sm:px-6">
//                         Student
//                       </th>

//                       <th className="px-5 py-4 sm:px-6">
//                         Roll Number
//                       </th>

//                       <th className="px-5 py-4 sm:px-6">
//                         Status
//                       </th>

//                       <th className="px-5 py-4 sm:px-6">
//                         Confidence
//                       </th>

//                       <th className="px-5 py-4 sm:px-6">
//                         Source
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {attendanceDetails.map(
//                       (attendance) => {
//                         const student =
//                           attendance.students;

//                         const isPresent =
//                           attendance.status ===
//                           "present";

//                         return (
//                           <tr
//                             key={
//                               attendance.id
//                             }
//                             className="border-b border-slate-100 last:border-0"
//                           >
//                             <td className="px-5 py-4 sm:px-6">
//                               <div className="flex items-center gap-3">
//                                 {student?.photo_url ? (
//                                   <img
//                                     src={
//                                       student.photo_url
//                                     }
//                                     alt={
//                                       student.name
//                                     }
//                                     className="h-10 w-10 shrink-0 rounded-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
//                                     {student?.name
//                                       ?.charAt(
//                                         0
//                                       )
//                                       ?.toUpperCase() ||
//                                       "?"}
//                                   </div>
//                                 )}

//                                 <div className="min-w-0">
//                                   <div className="truncate font-medium text-slate-900">
//                                     {student?.name ||
//                                       "Unknown Student"}
//                                   </div>

//                                   <div className="text-xs text-slate-500">
//                                     {student?.class_name ||
//                                       "-"}{" "}
//                                     -{" "}
//                                     {student?.division ||
//                                       "-"}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">
//                               {student?.roll_number ||
//                                 "-"}
//                             </td>

//                             <td className="px-5 py-4 sm:px-6">
//                               {isPresent ? (
//                                 <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
//                                   <CheckCircle2
//                                     size={14}
//                                   />
//                                   Present
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
//                                   <XCircle
//                                     size={14}
//                                   />
//                                   Absent
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">
//                               {attendance.confidence !=
//                               null
//                                 ? `${Number(
//                                     attendance.confidence
//                                   ).toFixed(
//                                     2
//                                   )}%`
//                                 : "-"}
//                             </td>

//                             <td className="px-5 py-4 sm:px-6">
//                               <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
//                                 {attendance.source ||
//                                   "manual"}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       }
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         /* Session list */
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {loading ? (
//             <div className="flex items-center justify-center px-6 py-16 text-sm text-slate-500">
//               <div className="flex items-center gap-3">
//                 <RefreshCw
//                   size={18}
//                   className="animate-spin"
//                 />
//                 Loading attendance
//                 history...
//               </div>
//             </div>
//           ) : sessions.length ===
//             0 ? (
//             <div className="px-6 py-16 text-center">
//               <CalendarDays
//                 size={48}
//                 className="mx-auto text-slate-300"
//               />

//               <h3 className="mt-4 font-semibold text-slate-900">
//                 No attendance history
//               </h3>

//               <p className="mt-1 text-sm text-slate-500">
//                 Saved attendance sessions
//                 will appear here.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[900px]">
//                 <thead>
//                   <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                     <th className="px-5 py-4 sm:px-6">
//                       Date
//                     </th>

//                     <th className="px-5 py-4 sm:px-6">
//                       Class
//                     </th>

//                     <th className="px-5 py-4 sm:px-6">
//                       Division
//                     </th>

//                     <th className="px-5 py-4 sm:px-6">
//                       Session Time
//                     </th>

//                     <th className="px-5 py-4 text-right sm:px-6">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {sessions.map(
//                     (session) => (
//                       <tr
//                         key={session.id}
//                         className="border-b border-slate-100 hover:bg-slate-50"
//                       >
//                         <td className="px-5 py-4 sm:px-6">
//                           <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
//                             <CalendarDays
//                               size={16}
//                               className="text-slate-400"
//                             />

//                             {formatDate(
//                               session.session_date
//                             )}
//                           </div>
//                         </td>

//                         <td className="px-5 py-4 text-sm text-slate-700 sm:px-6">
//                           Class{" "}
//                           {
//                             session.class_name
//                           }
//                         </td>

//                         <td className="px-5 py-4 sm:px-6">
//                           <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//                             {
//                               session.division
//                             }
//                           </span>
//                         </td>

//                         <td className="px-5 py-4 text-sm text-slate-500 sm:px-6">
//                           {formatTime(
//                             session.session_time
//                           )}
//                         </td>

//                         <td className="px-5 py-4 sm:px-6">
//                           <div className="flex flex-wrap justify-end gap-2">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 openSession(
//                                   session
//                                 )
//                               }
//                               className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
//                             >
//                               <Eye
//                                 size={16}
//                               />
//                               View
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 downloadExcel(
//                                   session
//                                 )
//                               }
//                               disabled={
//                                 downloadingSessionId ===
//                                 session.id
//                               }
//                               className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                               {downloadingSessionId ===
//                               session.id ? (
//                                 <RefreshCw
//                                   size={16}
//                                   className="animate-spin"
//                                 />
//                               ) : (
//                                 <Download
//                                   size={16}
//                                 />
//                               )}

//                               {downloadingSessionId ===
//                               session.id
//                                 ? "Preparing..."
//                                 : "Excel"}
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 deleteSession(
//                                   session
//                                 )
//                               }
//                               disabled={
//                                 deletingSessionId ===
//                                 session.id
//                               }
//                               className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                               {deletingSessionId ===
//                               session.id ? (
//                                 <RefreshCw
//                                   size={16}
//                                   className="animate-spin"
//                                 />
//                               ) : (
//                                 <Trash2
//                                   size={16}
//                                 />
//                               )}

//                               {deletingSessionId ===
//                               session.id
//                                 ? "Deleting..."
//                                 : "Delete"}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AttendanceHistory;



import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Trash2,
  FileSpreadsheet,
  Download,
} from "lucide-react";

import * as XLSX from "xlsx";

import { supabase } from "../lib/supabase";

function AttendanceHistory() {
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedSession, setSelectedSession] =
    useState(null);

  const [attendanceDetails, setAttendanceDetails] =
    useState([]);

  const [loadingDetails, setLoadingDetails] =
    useState(false);

  const [deletingSessionId, setDeletingSessionId] =
    useState(null);

  const [downloadingSessionId, setDownloadingSessionId] =
    useState(null);

  // ==================================================
  // GET TEACHER SCHOOL
  // ==================================================

  async function getMySchoolId() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error("You are not logged in.");
    }

    const {
      data,
      error: schoolError,
    } = await supabase
      .from("school_teachers")
      .select("school_id")
      .eq("user_id", user.id)
      .single();

    if (schoolError) {
      throw schoolError;
    }

    if (!data?.school_id) {
      throw new Error(
        "Your account is not connected to a school."
      );
    }

    return data.school_id;
  }

  // ==================================================
  // FETCH ATTENDANCE SESSIONS
  // ==================================================

  async function fetchSessions() {
    setLoading(true);
    setError("");

    try {
      const schoolId =
        await getMySchoolId();

      const {
        data,
        error: sessionsError,
      } = await supabase
        .from("attendance_sessions")
        .select("*")
        .eq("school_id", schoolId)
        .order("session_date", {
          ascending: false,
        })
        .order("session_time", {
          ascending: false,
        });

      if (sessionsError) {
        throw sessionsError;
      }

      setSessions(data || []);
    } catch (err) {
      console.error(
        "Attendance history error:",
        err
      );

      setError(
        err.message ||
          "Failed to load attendance history."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // OPEN SESSION
  // ==================================================

  async function openSession(session) {
    setSelectedSession(session);
    setLoadingDetails(true);
    setError("");

    try {
      const schoolId =
        await getMySchoolId();

      // Make sure the selected session belongs
      // to the teacher's school.
      if (
        session.school_id !== schoolId
      ) {
        throw new Error(
          "You do not have access to this attendance session."
        );
      }

      const {
        data,
        error: attendanceError,
      } = await supabase
        .from("attendance")
        .select(`
          id,
          student_id,
          attendance_date,
          attendance_time,
          status,
          confidence,
          source,
          students (
            id,
            name,
            roll_number,
            class_name,
            division,
            photo_url
          )
        `)
        .eq(
          "session_id",
          session.id
        )
        .order("status", {
          ascending: true,
        });

      if (attendanceError) {
        throw attendanceError;
      }

      setAttendanceDetails(
        data || []
      );
    } catch (err) {
      console.error(
        "Attendance details error:",
        err
      );

      setError(
        err.message ||
          "Failed to load attendance details."
      );
    } finally {
      setLoadingDetails(false);
    }
  }

  // ==================================================
  // CLOSE SESSION
  // ==================================================

  function closeSession() {
    setSelectedSession(null);
    setAttendanceDetails([]);
    setError("");
  }

  // ==================================================
  // DELETE SESSION
  // ==================================================

  async function deleteSession(session) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete the attendance record for Class ${session.class_name} - Division ${session.division} on ${formatDate(
          session.session_date
        )}?`
      );

    if (!confirmed) {
      return;
    }

    setDeletingSessionId(
      session.id
    );

    setError("");

    try {
      const schoolId =
        await getMySchoolId();

      if (
        session.school_id !== schoolId
      ) {
        throw new Error(
          "You do not have permission to delete this session."
        );
      }

      const {
        error: deleteError,
      } = await supabase
        .from("attendance_sessions")
        .delete()
        .eq("id", session.id)
        .eq("school_id", schoolId);

      if (deleteError) {
        throw deleteError;
      }

      if (
        selectedSession?.id ===
        session.id
      ) {
        setSelectedSession(null);
        setAttendanceDetails([]);
      }

      setSessions((previous) =>
        previous.filter(
          (item) =>
            item.id !== session.id
        )
      );
    } catch (err) {
      console.error(
        "Delete attendance error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete attendance record."
      );
    } finally {
      setDeletingSessionId(null);
    }
  }

  // ==================================================
  // DOWNLOAD EXCEL
  // ==================================================

  async function downloadExcel(session) {
    setDownloadingSessionId(
      session.id
    );

    setError("");

    try {
      const schoolId =
        await getMySchoolId();

      if (
        session.school_id !== schoolId
      ) {
        throw new Error(
          "You do not have permission to download this session."
        );
      }

      // ----------------------------------------------
      // Get ALL students for this classroom
      // ----------------------------------------------

      const {
        data: students,
        error: studentsError,
      } = await supabase
        .from("students")
        .select(
          "id,name,roll_number,class_name,division"
        )
        .eq("school_id", schoolId)
        .eq(
          "class_name",
          session.class_name
        )
        .eq(
          "division",
          session.division
        )
        .order("roll_number", {
          ascending: true,
        });

      if (studentsError) {
        throw studentsError;
      }

      // ----------------------------------------------
      // Get attendance for this session
      // ----------------------------------------------

      const {
        data: attendanceRecords,
        error: attendanceError,
      } = await supabase
        .from("attendance")
        .select(
          "id,student_id,status,confidence,source"
        )
        .eq(
          "session_id",
          session.id
        );

      if (attendanceError) {
        throw attendanceError;
      }

      // ----------------------------------------------
      // Create attendance map
      // ----------------------------------------------

      const attendanceMap =
        new Map();

      (
        attendanceRecords || []
      ).forEach((record) => {
        attendanceMap.set(
          record.student_id,
          record
        );
      });

      // ----------------------------------------------
      // Build Excel data
      // ----------------------------------------------

      const excelData =
        (students || []).map(
          (student) => {
            const attendance =
              attendanceMap.get(
                student.id
              );

            return {
              Date: formatDate(
                session.session_date
              ),

              Time: formatTime(
                session.session_time
              ),

              Class:
                session.class_name,

              Division:
                session.division,

              "Roll Number":
                student.roll_number,

              "Student Name":
                student.name,

              Status:
                attendance?.status
                  ? attendance.status
                      .charAt(0)
                      .toUpperCase() +
                    attendance.status.slice(
                      1
                    )
                  : "Absent",

              Confidence:
                attendance?.confidence !=
                null
                  ? `${Number(
                      attendance.confidence
                    ).toFixed(2)}%`
                  : "-",

              Source:
                attendance?.source ||
                "manual",
            };
          }
        );

      if (
        excelData.length === 0
      ) {
        throw new Error(
          "No students found for this class and division."
        );
      }

      // ----------------------------------------------
      // Create worksheet
      // ----------------------------------------------

      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );

      worksheet["!cols"] = [
        { wch: 15 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 15 },
        { wch: 30 },
        { wch: 12 },
        { wch: 15 },
        { wch: 12 },
      ];

      // ----------------------------------------------
      // Create workbook
      // ----------------------------------------------

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Attendance"
      );

      // ----------------------------------------------
      // Safe filename
      // ----------------------------------------------

      const safeClass =
        String(
          session.class_name ||
            "Class"
        ).replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );

      const safeDivision =
        String(
          session.division ||
            "Division"
        ).replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );

      const safeDate =
        String(
          session.session_date ||
            "Attendance"
        ).replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );

      const filename =
        `Attendance_Class_${safeClass}_Division_${safeDivision}_${safeDate}.xlsx`;

      XLSX.writeFile(
        workbook,
        filename
      );
    } catch (err) {
      console.error(
        "Excel download error:",
        err
      );

      setError(
        err.message ||
          "Failed to download Excel file."
      );
    } finally {
      setDownloadingSessionId(
        null
      );
    }
  }

  // ==================================================
  // LOAD ON PAGE OPEN
  // ==================================================

  useEffect(() => {
    fetchSessions();
  }, []);

  // ==================================================
  // FORMAT DATE
  // ==================================================

  function formatDate(dateString) {
    if (!dateString) {
      return "-";
    }

    return new Date(
      `${dateString}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ==================================================
  // FORMAT TIME
  // ==================================================

  function formatTime(dateString) {
    if (!dateString) {
      return "-";
    }

    return new Date(
      dateString
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // ==================================================
  // COUNTS
  // ==================================================

  const presentCount =
    attendanceDetails.filter(
      (item) =>
        item.status === "present"
    ).length;

  const absentCount =
    attendanceDetails.filter(
      (item) =>
        item.status === "absent"
    ).length;

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Attendance History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View previous attendance
            sessions and student records.
          </p>

        </div>

        <button
          type="button"
          onClick={fetchSessions}
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ==================================================
          SELECTED SESSION
          ================================================== */}

      {selectedSession ? (

        <div className="space-y-5 sm:space-y-6">

          {/* Back */}

          <button
            type="button"
            onClick={closeSession}
            className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Attendance History
          </button>

          {/* Session Header */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">

                  Class{" "}
                  {
                    selectedSession.class_name
                  }{" "}
                  — Division{" "}
                  {
                    selectedSession.division
                  }

                </h2>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                  <div className="flex items-center gap-2">

                    <CalendarDays
                      size={16}
                    />

                    {formatDate(
                      selectedSession.session_date
                    )}

                  </div>

                  <div className="flex items-center gap-2">

                    <Clock size={16} />

                    {formatTime(
                      selectedSession.session_time
                    )}

                  </div>

                </div>

              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">

                {/* Present */}

                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">

                  <div className="text-xl font-bold text-emerald-700">
                    {presentCount}
                  </div>

                  <div className="text-xs font-medium text-emerald-600">
                    Present
                  </div>

                </div>

                {/* Absent */}

                <div className="rounded-xl bg-red-50 px-4 py-3 text-center">

                  <div className="text-xl font-bold text-red-700">
                    {absentCount}
                  </div>

                  <div className="text-xs font-medium text-red-600">
                    Absent
                  </div>

                </div>

                {/* Excel */}

                <button
                  type="button"
                  onClick={() =>
                    downloadExcel(
                      selectedSession
                    )
                  }
                  disabled={
                    loadingDetails ||
                    downloadingSessionId ===
                      selectedSession.id
                  }
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >

                  {downloadingSessionId ===
                  selectedSession.id ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <FileSpreadsheet
                      size={17}
                    />
                  )}

                  {downloadingSessionId ===
                  selectedSession.id
                    ? "Preparing..."
                    : "Download Excel"}

                </button>

              </div>

            </div>

          </div>

          {/* Student Attendance */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-4 py-4 sm:px-6">

              <h3 className="font-semibold text-slate-900">
                Student Attendance
              </h3>

            </div>

            {loadingDetails ? (

              <div className="flex items-center justify-center px-6 py-12 text-sm text-slate-500">

                <div className="flex items-center gap-3">

                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />

                  Loading attendance...

                </div>

              </div>

            ) : attendanceDetails.length ===
              0 ? (

              <div className="px-6 py-12 text-center">

                <Users
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No attendance records
                  found for this session.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px]">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                      <th className="px-5 py-4 sm:px-6">
                        Student
                      </th>

                      <th className="px-5 py-4 sm:px-6">
                        Roll Number
                      </th>

                      <th className="px-5 py-4 sm:px-6">
                        Status
                      </th>

                      <th className="px-5 py-4 sm:px-6">
                        Confidence
                      </th>

                      <th className="px-5 py-4 sm:px-6">
                        Source
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {attendanceDetails.map(
                      (attendance) => {

                        const student =
                          attendance.students;

                        const isPresent =
                          attendance.status ===
                          "present";

                        return (
                          <tr
                            key={
                              attendance.id
                            }
                            className="border-b border-slate-100 last:border-0"
                          >

                            {/* Student */}

                            <td className="px-5 py-4 sm:px-6">

                              <div className="flex items-center gap-3">

                                {student?.photo_url ? (

                                  <img
                                    src={
                                      student.photo_url
                                    }
                                    alt={
                                      student.name
                                    }
                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                  />

                                ) : (

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">

                                    {student?.name
                                      ?.charAt(
                                        0
                                      )
                                      ?.toUpperCase() ||
                                      "?"}

                                  </div>

                                )}

                                <div className="min-w-0">

                                  <div className="truncate font-medium text-slate-900">
                                    {student?.name ||
                                      "Unknown Student"}
                                  </div>

                                  <div className="text-xs text-slate-500">

                                    {student?.class_name ||
                                      "-"}{" "}

                                    -{" "}

                                    {student?.division ||
                                      "-"}

                                  </div>

                                </div>

                              </div>

                            </td>

                            {/* Roll Number */}

                            <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">

                              {student?.roll_number ||
                                "-"}

                            </td>

                            {/* Status */}

                            <td className="px-5 py-4 sm:px-6">

                              {isPresent ? (

                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                                  <CheckCircle2
                                    size={14}
                                  />

                                  Present

                                </span>

                              ) : (

                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">

                                  <XCircle
                                    size={14}
                                  />

                                  Absent

                                </span>

                              )}

                            </td>

                            {/* Confidence */}

                            <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">

                              {attendance.confidence !=
                              null
                                ? `${Number(
                                    attendance.confidence
                                  ).toFixed(
                                    2
                                  )}%`
                                : "-"}

                            </td>

                            {/* Source */}

                            <td className="px-5 py-4 sm:px-6">

                              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">

                                {attendance.source ||
                                  "manual"}

                              </span>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      ) : (

        /* ==================================================
           SESSION LIST
           ================================================== */

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {loading ? (

            <div className="flex items-center justify-center px-6 py-16 text-sm text-slate-500">

              <div className="flex items-center gap-3">

                <RefreshCw
                  size={18}
                  className="animate-spin"
                />

                Loading attendance
                history...

              </div>

            </div>

          ) : sessions.length ===
            0 ? (

            <div className="px-6 py-16 text-center">

              <CalendarDays
                size={48}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-semibold text-slate-900">
                No attendance history
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Saved attendance sessions
                will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                    <th className="px-5 py-4 sm:px-6">
                      Date
                    </th>

                    <th className="px-5 py-4 sm:px-6">
                      Class
                    </th>

                    <th className="px-5 py-4 sm:px-6">
                      Division
                    </th>

                    <th className="px-5 py-4 sm:px-6">
                      Session Time
                    </th>

                    <th className="px-5 py-4 text-right sm:px-6">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {sessions.map(
                    (session) => (

                      <tr
                        key={session.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >

                        {/* Date */}

                        <td className="px-5 py-4 sm:px-6">

                          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">

                            <CalendarDays
                              size={16}
                              className="text-slate-400"
                            />

                            {formatDate(
                              session.session_date
                            )}

                          </div>

                        </td>

                        {/* Class */}

                        <td className="px-5 py-4 text-sm text-slate-700 sm:px-6">

                          Class{" "}
                          {
                            session.class_name
                          }

                        </td>

                        {/* Division */}

                        <td className="px-5 py-4 sm:px-6">

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                            {
                              session.division
                            }

                          </span>

                        </td>

                        {/* Time */}

                        <td className="px-5 py-4 text-sm text-slate-500 sm:px-6">

                          {formatTime(
                            session.session_time
                          )}

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4 sm:px-6">

                          <div className="flex flex-wrap justify-end gap-2">

                            {/* View */}

                            <button
                              type="button"
                              onClick={() =>
                                openSession(
                                  session
                                )
                              }
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                            >

                              <Eye
                                size={16}
                              />

                              View

                            </button>

                            {/* Excel */}

                            <button
                              type="button"
                              onClick={() =>
                                downloadExcel(
                                  session
                                )
                              }
                              disabled={
                                downloadingSessionId ===
                                session.id
                              }
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              {downloadingSessionId ===
                              session.id ? (

                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />

                              ) : (

                                <Download
                                  size={16}
                                />

                              )}

                              {downloadingSessionId ===
                              session.id
                                ? "Preparing..."
                                : "Excel"}

                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteSession(
                                  session
                                )
                              }
                              disabled={
                                deletingSessionId ===
                                session.id
                              }
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              {deletingSessionId ===
                              session.id ? (

                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />

                              ) : (

                                <Trash2
                                  size={16}
                                />

                              )}

                              {deletingSessionId ===
                              session.id
                                ? "Deleting..."
                                : "Delete"}

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default AttendanceHistory;