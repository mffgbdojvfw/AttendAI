

// import { useRef, useState } from "react";
// import {
//   Camera,
//   Upload,
//   Image as ImageIcon,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   LoaderCircle,
//   Users,
//   GraduationCap,
//   Save,
// } from "lucide-react";

// import { supabase } from "../lib/supabase";

// function Attendance() {
//   const fileInputRef = useRef(null);

//   const [className, setClassName] =
//     useState("");
//   const [division, setDivision] =
//     useState("");

//   const [selectedFile, setSelectedFile] =
//     useState(null);
//   const [previewUrl, setPreviewUrl] =
//     useState("");

//   const [analyzing, setAnalyzing] =
//     useState(false);
//   const [savingAttendance, setSavingAttendance] =
//     useState(false);

//   const [sessionId, setSessionId] =
//     useState(null);

//   const [results, setResults] =
//     useState([]);

//   const [unknownFaces, setUnknownFaces] =
//     useState([]);

//   const [error, setError] =
//     useState("");

//   const [successMessage, setSuccessMessage] =
//     useState("");

//   function handleFileChange(event) {
//     const file =
//       event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     if (!file.type.startsWith("image/")) {
//       setError(
//         "Please select a valid image file."
//       );
//       return;
//     }

//     const maxSize =
//       20 * 1024 * 1024;

//     if (file.size > maxSize) {
//       setError(
//         "Image is too large. Please select an image smaller than 20 MB."
//       );

//       event.target.value = "";
//       return;
//     }

//     if (previewUrl) {
//       URL.revokeObjectURL(
//         previewUrl
//       );
//     }

//     setError("");
//     setSuccessMessage("");
//     setResults([]);
//     setUnknownFaces([]);
//     setSessionId(null);

//     setSelectedFile(file);

//     setPreviewUrl(
//       URL.createObjectURL(file)
//     );
//   }

//   function handleUploadClick() {
//     fileInputRef.current?.click();
//   }

//   async function handleAnalyze() {
//     setError("");
//     setSuccessMessage("");

//     if (!className) {
//       setError(
//         "Please select a class."
//       );
//       return;
//     }

//     if (!division) {
//       setError(
//         "Please select a division."
//       );
//       return;
//     }

//     if (!selectedFile) {
//       setError(
//         "Please upload a classroom photo first."
//       );
//       return;
//     }

//     try {
//       setAnalyzing(true);
//       setResults([]);
//       setUnknownFaces([]);
//       setSessionId(null);

//       // IMPORTANT:
//       // Analysis does NOT save anything.
//       const formData =
//         new FormData();

//       formData.append(
//         "class_name",
//         className
//       );

//       formData.append(
//         "division",
//         division
//       );

//       formData.append(
//         "photo",
//         selectedFile
//       );

//       const apiUrl =
//         import.meta.env.VITE_API_URL ||
//         "http://127.0.0.1:8000";

//       const response =
//         await fetch(
//           `${apiUrl}/api/attendance/analyze`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//       const aiResult =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           aiResult.detail ||
//             "AI attendance analysis failed."
//         );
//       }

//       const {
//         data: registeredStudents,
//         error: studentsError,
//       } = await supabase
//         .from("students")
//         .select(
//           "id,name,roll_number,class_name,division"
//         )
//         .eq(
//           "class_name",
//           className
//         )
//         .eq(
//           "division",
//           division
//         )
//         .order("roll_number", {
//           ascending: true,
//         });

//       if (studentsError) {
//         throw studentsError;
//       }

//       const recognizedStudents =
//         aiResult.students || [];

//       const recognizedMap =
//         new Map();

//       recognizedStudents.forEach(
//         (student) => {
//           recognizedMap.set(
//             student.student_id,
//             student
//           );
//         }
//       );

//       const attendanceResults =
//         (registeredStudents || []).map(
//           (student) => {
//             const recognized =
//               recognizedMap.get(
//                 student.id
//               );

//             if (recognized) {
//               return {
//                 id: student.id,
//                 studentId:
//                   student.id,
//                 name: student.name,
//                 rollNumber:
//                   student.roll_number,
//                 status: "present",
//                 confidence:
//                   recognized.confidence,
//                 similarity:
//                   recognized.similarity,
//                 source: "ai",
//               };
//             }

//             return {
//               id: student.id,
//               studentId:
//                 student.id,
//               name: student.name,
//               rollNumber:
//                 student.roll_number,
//               status: "absent",
//               confidence: null,
//               similarity: null,
//               source: "ai",
//             };
//           }
//         );

//       setResults(
//         attendanceResults
//       );

//       setUnknownFaces(
//         aiResult.unknown_faces || []
//       );
//     } catch (err) {
//       console.error(
//         "Attendance analysis error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Something went wrong while analyzing attendance."
//       );
//     } finally {
//       setAnalyzing(false);
//     }
//   }

//   function handleStatusChange(
//     studentId,
//     status
//   ) {
//     setResults((current) =>
//       current.map((student) =>
//         student.studentId ===
//         studentId
//           ? {
//               ...student,
//               status,
//               source:
//                 status === "present"
//                   ? student.source ||
//                     "teacher"
//                   : "teacher",
//             }
//           : student
//       )
//     );

//     setSuccessMessage("");
//     setError("");
//   }

//   async function handleSaveAttendance() {
//     if (savingAttendance) {
//       return;
//     }

//     if (
//       !selectedFile ||
//       !className ||
//       !division ||
//       results.length === 0
//     ) {
//       setError(
//         "Analyze a classroom photo and review attendance before saving."
//       );
//       return;
//     }

//     let uploadedPath = null;
//     let newSessionId = null;

//     try {
//       setSavingAttendance(true);
//       setError("");
//       setSuccessMessage("");

//       // 1. Upload photo ONLY NOW
//       const extension =
//         selectedFile.name
//           .split(".")
//           .pop()
//           ?.toLowerCase() || "jpg";

//       uploadedPath =
//         `attendance/${crypto.randomUUID()}.${extension}`;

//       const {
//         error: uploadError,
//       } = await supabase.storage
//         .from("student-photos")
//         .upload(
//           uploadedPath,
//           selectedFile
//         );

//       if (uploadError) {
//         throw uploadError;
//       }

//       const {
//         data: publicUrlData,
//       } = supabase.storage
//         .from("student-photos")
//         .getPublicUrl(
//           uploadedPath
//         );

//       const photoUrl =
//         publicUrlData.publicUrl;

//       // 2. Create session ONLY NOW
//       const {
//         data: session,
//         error: sessionError,
//       } = await supabase
//         .from("attendance_sessions")
//         .insert({
//           class_name: className,
//           division: division,
//           photo_url: photoUrl,
//         })
//         .select("id")
//         .single();

//       if (sessionError) {
//         throw sessionError;
//       }

//       newSessionId =
//         session.id;

//       // 3. Prepare every student
//       const attendanceRows =
//         results.map((student) => ({
//           student_id:
//             student.studentId,
//           session_id:
//             session.id,
//           status:
//             student.status,
//           confidence:
//             student.confidence ??
//             null,
//           source:
//             student.source ||
//             "ai",
//         }));

//       // 4. Insert all records
//       const {
//         data: savedAttendance,
//         error: insertError,
//       } = await supabase
//         .from("attendance")
//         .insert(
//           attendanceRows
//         )
//         .select(
//           "student_id,status"
//         );

//       if (insertError) {
//         throw insertError;
//       }

//       if (
//         !savedAttendance ||
//         savedAttendance.length !==
//           attendanceRows.length
//       ) {
//         throw new Error(
//           `Attendance save was incomplete. Expected ${attendanceRows.length} records but received ${
//             savedAttendance?.length ||
//             0
//           }.`
//         );
//       }

//       const present =
//         savedAttendance.filter(
//           (row) =>
//             row.status ===
//             "present"
//         ).length;

//       const absent =
//         savedAttendance.filter(
//           (row) =>
//             row.status ===
//             "absent"
//         ).length;

//       setSessionId(
//         session.id
//       );

//       setSuccessMessage(
//         `Attendance saved successfully! ${present} present · ${absent} absent.`
//       );
//     } catch (err) {
//       console.error(
//         "Save attendance error:",
//         err
//       );

//       if (newSessionId) {
//         await supabase
//           .from("attendance_sessions")
//           .delete()
//           .eq(
//             "id",
//             newSessionId
//           );
//       }

//       if (uploadedPath) {
//         await supabase.storage
//           .from("student-photos")
//           .remove([
//             uploadedPath,
//           ]);
//       }

//       setError(
//         err.message ||
//           "Failed to save attendance."
//       );
//     } finally {
//       setSavingAttendance(false);
//     }
//   }

//   const presentCount =
//     results.filter(
//       (student) =>
//         student.status ===
//         "present"
//     ).length;

//   const absentCount =
//     results.filter(
//       (student) =>
//         student.status ===
//         "absent"
//     ).length;

//   const unknownCount =
//     unknownFaces.length;

//   return (
//     <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
//           Attendance
//         </h1>

//         <p className="mt-1 text-sm text-slate-500 sm:text-base">
//           Select the class and division,
//           then upload a classroom photo.
//         </p>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Success */}
//       {successMessage && (
//         <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
//           <div className="flex items-start gap-2">
//             <CheckCircle2
//               size={20}
//               className="mt-0.5 shrink-0"
//             />

//             <span>
//               {successMessage}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Class details */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
//         <div className="mb-5 flex items-center gap-3">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
//             <GraduationCap
//               className="text-indigo-600"
//               size={20}
//             />
//           </div>

//           <div>
//             <h2 className="font-semibold text-slate-900">
//               Class Details
//             </h2>

//             <p className="text-sm text-slate-500">
//               Choose the classroom for this
//               attendance session.
//             </p>
//           </div>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-700">
//               Standard / Class
//             </label>

//             <select
//               value={className}
//               onChange={(event) => {
//                 setClassName(
//                   event.target.value
//                 );
//                 setResults([]);
//                 setUnknownFaces([]);
//                 setSessionId(null);
//                 setSuccessMessage("");
//               }}
//               className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//             >
//               <option value="">
//                 Select class
//               </option>

//               {Array.from(
//                 { length: 12 },
//                 (_, index) => (
//                   <option
//                     key={index + 1}
//                     value={String(
//                       index + 1
//                     )}
//                   >
//                     {index + 1}th Standard
//                   </option>
//                 )
//               )}
//             </select>
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-700">
//               Division
//             </label>

//             <select
//               value={division}
//               onChange={(event) => {
//                 setDivision(
//                   event.target.value
//                 );
//                 setResults([]);
//                 setUnknownFaces([]);
//                 setSessionId(null);
//                 setSuccessMessage("");
//               }}
//               className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//             >
//               <option value="">
//                 Select division
//               </option>

//               {[
//                 "A",
//                 "B",
//                 "C",
//                 "D",
//                 "E",
//               ].map((item) => (
//                 <option
//                   key={item}
//                   value={item}
//                 >
//                   Division {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Photo */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
//         <div className="mb-5 flex items-center gap-3">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
//             <Camera
//               className="text-indigo-600"
//               size={20}
//             />
//           </div>

//           <div>
//             <h2 className="font-semibold text-slate-900">
//               Classroom Photo
//             </h2>

//             <p className="text-sm text-slate-500">
//               Upload a photo containing
//               multiple students.
//             </p>
//           </div>
//         </div>

//         {!previewUrl ? (
//           <button
//             type="button"
//             onClick={
//               handleUploadClick
//             }
//             className="flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 transition hover:border-indigo-400 hover:bg-indigo-50 sm:min-h-72"
//           >
//             <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm sm:h-16 sm:w-16">
//               <Upload
//                 className="text-indigo-600"
//                 size={27}
//               />
//             </div>

//             <p className="text-center font-semibold text-slate-800">
//               Click to upload classroom
//               photo
//             </p>

//             <p className="mt-1 text-sm text-slate-500">
//               JPG, JPEG or PNG
//             </p>

//             <p className="mt-2 text-xs text-slate-400">
//               Maximum 20 MB
//             </p>
//           </button>
//         ) : (
//           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
//             <img
//               src={previewUrl}
//               alt="Classroom preview"
//               className="max-h-[500px] w-full object-contain"
//             />

//             <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex min-w-0 items-center gap-3">
//                 <ImageIcon
//                   className="shrink-0 text-slate-500"
//                   size={20}
//                 />

//                 <div className="min-w-0">
//                   <p className="truncate text-sm font-medium text-slate-800">
//                     {selectedFile?.name}
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     {selectedFile
//                       ? `${(
//                           selectedFile.size /
//                           1024 /
//                           1024
//                         ).toFixed(
//                           2
//                         )} MB`
//                       : ""}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={
//                   handleUploadClick
//                 }
//                 className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
//               >
//                 Change Photo
//               </button>
//             </div>
//           </div>
//         )}

//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/jpeg,image/png,image/jpg"
//           onChange={handleFileChange}
//           className="hidden"
//         />

//         <button
//           type="button"
//           onClick={handleAnalyze}
//           disabled={
//             !selectedFile ||
//             !className ||
//             !division ||
//             analyzing ||
//             !!sessionId
//           }
//           className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
//         >
//           {analyzing ? (
//             <>
//               <LoaderCircle
//                 className="animate-spin"
//                 size={20}
//               />
//               AI Analyzing...
//             </>
//           ) : sessionId ? (
//             <>
//               <CheckCircle2 size={20} />
//               Attendance Saved
//             </>
//           ) : (
//             <>
//               <Camera size={20} />
//               Analyze Attendance
//             </>
//           )}
//         </button>
//       </div>

//       {/* Results */}
//       {results.length > 0 && (
//         <div className="space-y-5">
//           {/* Unsaved */}
//           {!sessionId && (
//             <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
//               <div className="flex items-start gap-2">
//                 <AlertCircle
//                   size={19}
//                   className="mt-0.5 shrink-0 text-amber-600"
//                 />

//                 <div>
//                   <p className="text-sm font-semibold text-amber-800">
//                     Attendance has not been
//                     saved yet.
//                   </p>

//                   <p className="mt-1 text-xs text-amber-700">
//                     Review the results and
//                     click Save Attendance
//                     when ready.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Summary */}
//           <div>
//             <h2 className="mb-4 text-lg font-semibold text-slate-900">
//               Attendance Results
//             </h2>

//             <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//               <ResultCard
//                 title="Registered"
//                 value={results.length}
//                 icon={Users}
//                 className="bg-slate-100 text-slate-600"
//               />

//               <ResultCard
//                 title="Present"
//                 value={presentCount}
//                 icon={CheckCircle2}
//                 className="bg-emerald-50 text-emerald-600"
//               />

//               <ResultCard
//                 title="Absent"
//                 value={absentCount}
//                 icon={XCircle}
//                 className="bg-red-50 text-red-600"
//               />

//               <ResultCard
//                 title="Unknown Faces"
//                 value={unknownCount}
//                 icon={AlertCircle}
//                 className="bg-amber-50 text-amber-600"
//               />
//             </div>
//           </div>

//           {/* Students */}
//           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
//               <h3 className="font-semibold text-slate-900">
//                 Detected Students
//               </h3>

//               <p className="mt-1 text-sm text-slate-500">
//                 Review and edit before saving.
//               </p>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[700px] text-left">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Student
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Roll Number
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Status
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Confidence
//                     </th>

//                     <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Source
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {results.map(
//                     (student) => (
//                       <tr
//                         key={student.id}
//                       >
//                         <td className="px-5 py-4">
//                           <div className="font-medium text-slate-900">
//                             {student.name}
//                           </div>
//                         </td>

//                         <td className="px-5 py-4 text-sm text-slate-600">
//                           {
//                             student.rollNumber
//                           }
//                         </td>

//                         <td className="px-5 py-4">
//                           <select
//                             value={
//                               student.status
//                             }
//                             onChange={(
//                               event
//                             ) =>
//                               handleStatusChange(
//                                 student.studentId,
//                                 event.target
//                                   .value
//                               )
//                             }
//                             disabled={
//                               !!sessionId
//                             }
//                             className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium outline-none ${
//                               student.status ===
//                               "present"
//                                 ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//                                 : "border-red-200 bg-red-50 text-red-700"
//                             } disabled:cursor-not-allowed disabled:opacity-60`}
//                           >
//                             <option value="present">
//                               Present
//                             </option>

//                             <option value="absent">
//                               Absent
//                             </option>
//                           </select>
//                         </td>

//                         <td className="px-5 py-4 text-sm text-slate-600">
//                           {student.confidence !=
//                           null
//                             ? `${student.confidence}%`
//                             : "-"}
//                         </td>

//                         <td className="px-5 py-4">
//                           <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
//                             {student.source ||
//                               "ai"}
//                           </span>
//                         </td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Unknown */}
//             {unknownFaces.length >
//               0 && (
//               <div className="border-t border-slate-200 bg-amber-50 px-4 py-5 sm:px-6">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle
//                     size={20}
//                     className="mt-0.5 shrink-0 text-amber-600"
//                   />

//                   <div>
//                     <h4 className="font-semibold text-amber-900">
//                       Unknown Faces
//                     </h4>

//                     <p className="mt-1 text-sm text-amber-700">
//                       {
//                         unknownFaces.length
//                       }{" "}
//                       face
//                       {unknownFaces.length !==
//                       1
//                         ? "s"
//                         : ""}{" "}
//                       could not be matched.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Save */}
//             <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//               <p className="text-sm text-slate-500">
//                 <strong className="text-slate-700">
//                   {presentCount}
//                 </strong>{" "}
//                 present ·{" "}
//                 <strong className="text-slate-700">
//                   {absentCount}
//                 </strong>{" "}
//                 absent
//               </p>

//               <button
//                 type="button"
//                 onClick={
//                   handleSaveAttendance
//                 }
//                 disabled={
//                   savingAttendance ||
//                   !!sessionId
//                 }
//                 className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
//               >
//                 {savingAttendance ? (
//                   <>
//                     <LoaderCircle
//                       size={19}
//                       className="animate-spin"
//                     />
//                     Saving...
//                   </>
//                 ) : sessionId ? (
//                   <>
//                     <CheckCircle2 size={19} />
//                     Attendance Saved
//                   </>
//                 ) : (
//                   <>
//                     <Save size={19} />
//                     Save Attendance
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function ResultCard({
//   title,
//   value,
//   icon: Icon,
//   className,
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
//       <div className="flex items-center justify-between gap-2">
//         <div>
//           <p className="text-xs text-slate-500 sm:text-sm">
//             {title}
//           </p>

//           <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
//             {value}
//           </p>
//         </div>

//         <div
//           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${className}`}
//         >
//           <Icon size={20} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Attendance;




import { useRef, useState } from "react";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LoaderCircle,
  Users,
  GraduationCap,
  Save,
} from "lucide-react";

import { supabase } from "../lib/supabase";

function Attendance() {
  const fileInputRef = useRef(null);

  const [className, setClassName] = useState("");
  const [division, setDivision] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);

  const [sessionId, setSessionId] = useState(null);

  const [results, setResults] = useState([]);
  const [unknownFaces, setUnknownFaces] = useState([]);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // GET CURRENT TEACHER'S SCHOOL
  // =========================================================

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

    const { data, error: schoolError } = await supabase
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

  // =========================================================
  // GET SUPABASE ACCESS TOKEN
  // =========================================================

  async function getAccessToken() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session?.access_token) {
      throw new Error(
        "Your login session has expired. Please log in again."
      );
    }

    return session.access_token;
  }

  // =========================================================
  // FILE CHANGE
  // =========================================================

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image is too large. Please select an image smaller than 20 MB."
      );

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError("");
    setSuccessMessage("");
    setResults([]);
    setUnknownFaces([]);
    setSessionId(null);

    setSelectedFile(file);

    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  // =========================================================
  // AI ANALYSIS
  // =========================================================

  async function handleAnalyze() {
    setError("");
    setSuccessMessage("");

    if (!className) {
      setError("Please select a class.");
      return;
    }

    if (!division) {
      setError("Please select a division.");
      return;
    }

    if (!selectedFile) {
      setError("Please upload a classroom photo first.");
      return;
    }

    try {
      setAnalyzing(true);
      setResults([]);
      setUnknownFaces([]);
      setSessionId(null);

      // -----------------------------------------------------
      // Get current logged-in teacher's access token
      // -----------------------------------------------------

      const accessToken = await getAccessToken();

      // -----------------------------------------------------
      // Get teacher's school
      // -----------------------------------------------------

      const schoolId = await getMySchoolId();

      // -----------------------------------------------------
      // Prepare classroom photo
      // -----------------------------------------------------

      const formData = new FormData();

      formData.append("class_name", className);
      formData.append("division", division);
      formData.append("photo", selectedFile);

      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:8000";

      // -----------------------------------------------------
      // Send photo to authenticated backend
      // -----------------------------------------------------

      const response = await fetch(
        `${apiUrl}/api/attendance/analyze`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

          body: formData,
        }
      );

      const aiResult = await response.json();

      if (!response.ok) {
        throw new Error(
          aiResult.detail ||
            "AI attendance analysis failed."
        );
      }

      // -----------------------------------------------------
      // Load students from THIS school only
      // -----------------------------------------------------

      const {
        data: registeredStudents,
        error: studentsError,
      } = await supabase
        .from("students")
        .select(
          "id,name,roll_number,class_name,division,school_id"
        )
        .eq("school_id", schoolId)
        .eq("class_name", className)
        .eq("division", division)
        .order("roll_number", {
          ascending: true,
        });

      if (studentsError) {
        throw studentsError;
      }

      // -----------------------------------------------------
      // AI recognized students
      // -----------------------------------------------------

      const recognizedStudents =
        aiResult.students || [];

      const recognizedMap = new Map();

      recognizedStudents.forEach((student) => {
        recognizedMap.set(
          student.student_id,
          student
        );
      });

      // -----------------------------------------------------
      // Create attendance result for EVERY student
      //
      // Recognized = Present
      // Not recognized = Absent
      // -----------------------------------------------------

      const attendanceResults =
        (registeredStudents || []).map(
          (student) => {
            const recognized =
              recognizedMap.get(student.id);

            if (recognized) {
              return {
                id: student.id,
                studentId: student.id,
                name: student.name,
                rollNumber:
                  student.roll_number,
                status: "present",
                confidence:
                  recognized.confidence,
                similarity:
                  recognized.similarity,
                source: "ai",
              };
            }

            return {
              id: student.id,
              studentId: student.id,
              name: student.name,
              rollNumber:
                student.roll_number,
              status: "absent",
              confidence: null,
              similarity: null,
              source: "ai",
            };
          }
        );

      setResults(attendanceResults);

      setUnknownFaces(
        aiResult.unknown_faces || []
      );

      if (attendanceResults.length === 0) {
        setError(
          `No students are registered for Class ${className}, Division ${division} in your school.`
        );
      }
    } catch (err) {
      console.error(
        "Attendance analysis error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while analyzing attendance."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  // =========================================================
  // CHANGE ATTENDANCE STATUS
  // =========================================================

  function handleStatusChange(
    studentId,
    status
  ) {
    setResults((current) =>
      current.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              status,
              source:
                status === "present"
                  ? student.source || "teacher"
                  : "teacher",
            }
          : student
      )
    );

    setSuccessMessage("");
    setError("");
  }

  // =========================================================
  // SAVE ATTENDANCE
  // =========================================================

  async function handleSaveAttendance() {
    if (savingAttendance) {
      return;
    }

    if (
      !selectedFile ||
      !className ||
      !division ||
      results.length === 0
    ) {
      setError(
        "Analyze a classroom photo and review attendance before saving."
      );
      return;
    }

    let uploadedPath = null;
    let newSessionId = null;

    try {
      setSavingAttendance(true);
      setError("");
      setSuccessMessage("");

      // -----------------------------------------------------
      // Get teacher's school
      // -----------------------------------------------------

      const schoolId = await getMySchoolId();

      // -----------------------------------------------------
      // Upload classroom photo
      // -----------------------------------------------------

      const extension =
        selectedFile.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      uploadedPath =
        `attendance/${crypto.randomUUID()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("student-photos")
        .upload(
          uploadedPath,
          selectedFile
        );

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("student-photos")
        .getPublicUrl(
          uploadedPath
        );

      const photoUrl =
        publicUrlData.publicUrl;

      // -----------------------------------------------------
      // Create attendance session
      // -----------------------------------------------------

      const {
        data: session,
        error: sessionError,
      } = await supabase
        .from("attendance_sessions")
        .insert({
          class_name: className,
          division: division,
          photo_url: photoUrl,
          school_id: schoolId,
        })
        .select("id")
        .single();

      if (sessionError) {
        throw sessionError;
      }

      newSessionId = session.id;

      // -----------------------------------------------------
      // Prepare attendance records
      // -----------------------------------------------------

      const attendanceRows =
        results.map((student) => ({
          student_id:
            student.studentId,

          session_id:
            session.id,

          status:
            student.status,

          confidence:
            student.confidence ?? null,

          source:
            student.source || "ai",
        }));

      // -----------------------------------------------------
      // Save attendance
      // -----------------------------------------------------

      const {
        data: savedAttendance,
        error: insertError,
      } = await supabase
        .from("attendance")
        .insert(
          attendanceRows
        )
        .select(
          "student_id,status"
        );

      if (insertError) {
        throw insertError;
      }

      if (
        !savedAttendance ||
        savedAttendance.length !==
          attendanceRows.length
      ) {
        throw new Error(
          `Attendance save was incomplete. Expected ${attendanceRows.length} records but received ${
            savedAttendance?.length || 0
          }.`
        );
      }

      // -----------------------------------------------------
      // Calculate totals
      // -----------------------------------------------------

      const present =
        savedAttendance.filter(
          (row) =>
            row.status ===
            "present"
        ).length;

      const absent =
        savedAttendance.filter(
          (row) =>
            row.status ===
            "absent"
        ).length;

      setSessionId(session.id);

      setSuccessMessage(
        `Attendance saved successfully! ${present} present · ${absent} absent.`
      );
    } catch (err) {
      console.error(
        "Save attendance error:",
        err
      );

      // ---------------------------------------------------
      // Cleanup session if save failed
      // ---------------------------------------------------

      if (newSessionId) {
        const {
          error: cleanupError,
        } = await supabase
          .from("attendance_sessions")
          .delete()
          .eq(
            "id",
            newSessionId
          );

        if (cleanupError) {
          console.error(
            "Session cleanup failed:",
            cleanupError
          );
        }
      }

      // ---------------------------------------------------
      // Cleanup uploaded photo
      // ---------------------------------------------------

      if (uploadedPath) {
        const {
          error:
            photoCleanupError,
        } = await supabase.storage
          .from("student-photos")
          .remove([
            uploadedPath,
          ]);

        if (photoCleanupError) {
          console.error(
            "Photo cleanup failed:",
            photoCleanupError
          );
        }
      }

      setError(
        err.message ||
          "Failed to save attendance."
      );
    } finally {
      setSavingAttendance(false);
    }
  }

  // =========================================================
  // COUNTS
  // =========================================================

  const presentCount =
    results.filter(
      (student) =>
        student.status === "present"
    ).length;

  const absentCount =
    results.filter(
      (student) =>
        student.status === "absent"
    ).length;

  const unknownCount =
    unknownFaces.length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Attendance
        </h1>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Select the class and division,
          then upload a classroom photo.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
          <div className="flex items-start gap-2">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <span>
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* CLASS DETAILS */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <GraduationCap
              className="text-indigo-600"
              size={20}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Class Details
            </h2>

            <p className="text-sm text-slate-500">
              Choose the classroom for this
              attendance session.
            </p>
          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          {/* CLASS */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Standard / Class
            </label>

            <select
              value={className}
              onChange={(event) => {
                setClassName(
                  event.target.value
                );

                setResults([]);
                setUnknownFaces([]);
                setSessionId(null);
                setSuccessMessage("");
                setError("");
              }}
              className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                Select class
              </option>

              {Array.from(
                { length: 12 },
                (_, index) => (
                  <option
                    key={index + 1}
                    value={String(
                      index + 1
                    )}
                  >
                    {index + 1}th Standard
                  </option>
                )
              )}
            </select>
          </div>

          {/* DIVISION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Division
            </label>

            <select
              value={division}
              onChange={(event) => {
                setDivision(
                  event.target.value
                );

                setResults([]);
                setUnknownFaces([]);
                setSessionId(null);
                setSuccessMessage("");
                setError("");
              }}
              className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                Select division
              </option>

              {[
                "A",
                "B",
                "C",
                "D",
                "E",
              ].map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  Division {item}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* CLASSROOM PHOTO */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Camera
              className="text-indigo-600"
              size={20}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Classroom Photo
            </h2>

            <p className="text-sm text-slate-500">
              Upload a photo containing
              multiple students.
            </p>
          </div>

        </div>

        {/* UPLOAD */}

        {!previewUrl ? (

          <button
            type="button"
            onClick={
              handleUploadClick
            }
            className="flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 transition hover:border-indigo-400 hover:bg-indigo-50 sm:min-h-72"
          >

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm sm:h-16 sm:w-16">

              <Upload
                className="text-indigo-600"
                size={27}
              />

            </div>

            <p className="text-center font-semibold text-slate-800">
              Click to upload classroom
              photo
            </p>

            <p className="mt-1 text-sm text-slate-500">
              JPG, JPEG or PNG
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Maximum 20 MB
            </p>

          </button>

        ) : (

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

            <img
              src={previewUrl}
              alt="Classroom preview"
              className="max-h-[500px] w-full object-contain"
            />

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 items-center gap-3">

                <ImageIcon
                  className="shrink-0 text-slate-500"
                  size={20}
                />

                <div className="min-w-0">

                  <p className="truncate text-sm font-medium text-slate-800">
                    {selectedFile?.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {selectedFile
                      ? `${(
                          selectedFile.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )} MB`
                      : ""}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  handleUploadClick
                }
                className="w-full cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
              >
                Change Photo
              </button>

            </div>

          </div>
        )}

        {/* FILE INPUT */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* ANALYZE */}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={
            !selectedFile ||
            !className ||
            !division ||
            analyzing ||
            !!sessionId
          }
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >

          {analyzing ? (
            <>
              <LoaderCircle
                className="animate-spin"
                size={20}
              />
              AI Analyzing...
            </>
          ) : sessionId ? (
            <>
              <CheckCircle2 size={20} />
              Attendance Saved
            </>
          ) : (
            <>
              <Camera size={20} />
              Analyze Attendance
            </>
          )}

        </button>

      </div>

      {/* RESULTS */}

      {results.length > 0 && (

        <div className="space-y-5">

          {/* UNSAVED WARNING */}

          {!sessionId && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">

              <div className="flex items-start gap-2">

                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>

                  <p className="text-sm font-semibold text-amber-800">
                    Attendance has not been
                    saved yet.
                  </p>

                  <p className="mt-1 text-xs text-amber-700">
                    Review the results and
                    click Save Attendance
                    when ready.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* SUMMARY */}

          <div>

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Attendance Results
            </h2>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

              <ResultCard
                title="Registered"
                value={results.length}
                icon={Users}
                className="bg-slate-100 text-slate-600"
              />

              <ResultCard
                title="Present"
                value={presentCount}
                icon={CheckCircle2}
                className="bg-emerald-50 text-emerald-600"
              />

              <ResultCard
                title="Absent"
                value={absentCount}
                icon={XCircle}
                className="bg-red-50 text-red-600"
              />

              <ResultCard
                title="Unknown Faces"
                value={unknownCount}
                icon={AlertCircle}
                className="bg-amber-50 text-amber-600"
              />

            </div>

          </div>

          {/* STUDENTS TABLE */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-4 py-4 sm:px-6">

              <h3 className="font-semibold text-slate-900">
                Detected Students
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review and edit before saving.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Student
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Roll Number
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Confidence
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Source
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {results.map(
                    (student) => (

                      <tr
                        key={student.id}
                      >

                        <td className="px-5 py-4">

                          <div className="font-medium text-slate-900">
                            {student.name}
                          </div>

                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {student.rollNumber}
                        </td>

                        <td className="px-5 py-4">

                          <select
                            value={
                              student.status
                            }
                            onChange={(
                              event
                            ) =>
                              handleStatusChange(
                                student.studentId,
                                event.target
                                  .value
                              )
                            }
                            disabled={
                              !!sessionId
                            }
                            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium outline-none ${
                              student.status ===
                              "present"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                          >

                            <option value="present">
                              Present
                            </option>

                            <option value="absent">
                              Absent
                            </option>

                          </select>

                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {student.confidence !=
                          null
                            ? `${student.confidence}%`
                            : "-"}
                        </td>

                        <td className="px-5 py-4">

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                            {student.source ||
                              "ai"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* UNKNOWN FACES */}

            {unknownFaces.length > 0 && (

              <div className="border-t border-slate-200 bg-amber-50 px-4 py-5 sm:px-6">

                <div className="flex items-start gap-3">

                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>

                    <h4 className="font-semibold text-amber-900">
                      Unknown Faces
                    </h4>

                    <p className="mt-1 text-sm text-amber-700">
                      {unknownFaces.length}{" "}
                      face
                      {unknownFaces.length !==
                      1
                        ? "s"
                        : ""}{" "}
                      could not be matched.
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* SAVE */}

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <p className="text-sm text-slate-500">

                <strong className="text-slate-700">
                  {presentCount}
                </strong>{" "}
                present ·{" "}

                <strong className="text-slate-700">
                  {absentCount}
                </strong>{" "}
                absent

              </p>

              <button
                type="button"
                onClick={
                  handleSaveAttendance
                }
                disabled={
                  savingAttendance ||
                  !!sessionId
                }
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
              >

                {savingAttendance ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : sessionId ? (
                  <>
                    <CheckCircle2 size={19} />
                    Attendance Saved
                  </>
                ) : (
                  <>
                    <Save size={19} />
                    Save Attendance
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// =========================================================
// RESULT CARD
// =========================================================

function ResultCard({
  title,
  value,
  icon: Icon,
  className,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-center justify-between gap-2">

        <div>

          <p className="text-xs text-slate-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${className}`}
        >
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
}

export default Attendance;