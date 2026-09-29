// import { useEffect, useState } from "react";
// import {
//   Plus,
//   Search,
//   Users,
//   UserRound,
//   GraduationCap,
//   Trash2,
//   LoaderCircle,
// } from "lucide-react";

// import AddStudentForm from "../components/AddStudentForm";
// import { supabase } from "../lib/supabase";

// function Students() {
//   const [students, setStudents] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch students from Supabase
//   async function fetchStudents() {
//     setLoading(true);
//     setError("");

//     const { data, error: fetchError } = await supabase
//       .from("students")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (fetchError) {
//       setError(fetchError.message);
//     } else {
//       setStudents(data || []);
//     }

//     setLoading(false);
//   }

//   // Load students when the page opens
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // Add student and upload photograph
//   // async function handleAddStudent(studentData) {
//   //   setSaving(true);
//   //   setError("");

//   //   try {
//   //     let photoUrl = null;

//   //     // Upload photograph to Supabase Storage
//   //     if (studentData.photoFile) {
//   //       const fileExtension =
//   //         studentData.photoFile.name.split(".").pop();

//   //       const filePath = `${crypto.randomUUID()}.${fileExtension}`;

//   //       const { error: uploadError } = await supabase.storage
//   //         .from("student-photos")
//   //         .upload(filePath, studentData.photoFile);

//   //       if (uploadError) {
//   //         throw uploadError;
//   //       }

//   //       const { data: publicUrlData } = supabase.storage
//   //         .from("student-photos")
//   //         .getPublicUrl(filePath);

//   //       photoUrl = publicUrlData.publicUrl;
//   //     }

//   //     // Insert student details into database
//   //     const { data: insertedStudent, error: insertError } =
//   //       await supabase
//   //         .from("students")
//   //         .insert([
//   //           {
//   //             name: studentData.name,
//   //             roll_number: studentData.rollNumber,
//   //             class_name: studentData.className,
//   //             division: studentData.division,
//   //             photo_url: photoUrl,
//   //           },
//   //         ])
//   //         .select()
//   //         .single();

//   //     if (insertError) {
//   //       throw insertError;
//   //     }

//   //     // Update the student list
//   //     setStudents((previousStudents) => [
//   //       insertedStudent,
//   //       ...previousStudents,
//   //     ]);

//   //     // Close the form
//   //     setShowForm(false);
//   //   } catch (submitError) {
//   //     setError(
//   //       submitError.message || "Failed to register student."
//   //     );
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // }

//   // Add student, upload photo, and generate face embedding
// async function handleAddStudent(studentData) {
//   setSaving(true);
//   setError("");

//   try {
//     // A face photo is required for AI registration
//     if (!studentData.photoFile) {
//       throw new Error(
//         "Please upload a clear student photo."
//       );
//     }

//     let photoUrl = null;

//     // ------------------------------------------
//     // 1. Upload student photo
//     // ------------------------------------------

//     const fileExtension =
//       studentData.photoFile.name.split(".").pop();

//     const filePath = `${crypto.randomUUID()}.${fileExtension}`;

//     const { error: uploadError } =
//       await supabase.storage
//         .from("student-photos")
//         .upload(
//           filePath,
//           studentData.photoFile
//         );

//     if (uploadError) {
//       throw uploadError;
//     }

//     const { data: publicUrlData } =
//       supabase.storage
//         .from("student-photos")
//         .getPublicUrl(filePath);

//     photoUrl = publicUrlData.publicUrl;

//     // ------------------------------------------
//     // 2. Create student in Supabase
//     // ------------------------------------------

//     const {
//       data: insertedStudent,
//       error: insertError,
//     } = await supabase
//       .from("students")
//       .insert([
//         {
//           name: studentData.name,
//           roll_number: studentData.rollNumber,
//           class_name: studentData.className,
//           division: studentData.division.trim().toUpperCase(),
//           photo_url: photoUrl,
//         },
//       ])
//       .select()
//       .single();

//     if (insertError) {
//       throw insertError;
//     }

//     // ------------------------------------------
//     // 3. Generate face embedding using FastAPI
//     // ------------------------------------------

//     const formData = new FormData();

//     formData.append(
//       "photo_url",
//       photoUrl
//     );

//     const embeddingResponse = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/students/${insertedStudent.id}/generate-embedding`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const embeddingResult =
//       await embeddingResponse.json();

//     if (!embeddingResponse.ok) {
//       throw new Error(
//         embeddingResult.detail ||
//           "Failed to generate face embedding."
//       );
//     }

//     // ------------------------------------------
//     // 4. Refresh students from Supabase
//     // ------------------------------------------

//     await fetchStudents();

//     // ------------------------------------------
//     // 5. Close form
//     // ------------------------------------------

//     setShowForm(false);

//   } catch (submitError) {
//     setError(
//       submitError.message ||
//         "Failed to register student."
//     );
//   } finally {
//     setSaving(false);
//   }
// }

//   // Delete student
//   async function handleDeleteStudent(studentId) {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this student?"
//     );

//     if (!confirmed) {
//       return;
//     }

//     setError("");

//     const { error: deleteError } = await supabase
//       .from("students")
//       .delete()
//       .eq("id", studentId);

//     if (deleteError) {
//       setError(deleteError.message);
//       return;
//     }

//     setStudents((previousStudents) =>
//       previousStudents.filter(
//         (student) => student.id !== studentId
//       )
//     );
//   }

//   // Search filtering
//   const filteredStudents = students.filter((student) => {
//     const searchValue = searchTerm.toLowerCase();

//     return (
//       student.name.toLowerCase().includes(searchValue) ||
//       student.roll_number.toLowerCase().includes(searchValue) ||
//       student.class_name.toLowerCase().includes(searchValue) ||
//       student.division.toLowerCase().includes(searchValue)
//     );
//   });

//   // Count unique classes
//   const classesRepresented = new Set(
//     students.map(
//       (student) => `${student.class_name}-${student.division}`
//     )
//   ).size;

//   return (
//     <div className="mx-auto w-full max-w-7xl space-y-8">
//       {/* Page Header */}
//       <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">
//             Students
//           </h1>

//           <p className="mt-1 text-slate-500">
//             Register and manage students for AttendAI.
//           </p>
//         </div>

//         <button
//           onClick={() => setShowForm(true)}
//           className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
//         >
//           <Plus size={20} />
//           Add Student
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           {error}
//         </div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//         {/* Total Students */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <p className="text-sm font-medium text-slate-500">
//               Total Students
//             </p>

//             <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
//               <Users size={20} />
//             </div>
//           </div>

//           <p className="text-3xl font-bold text-slate-900">
//             {students.length}
//           </p>

//           <p className="mt-1 text-sm text-slate-400">
//             Registered in AttendAI
//           </p>
//         </div>

//         {/* Registered Faces */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <p className="text-sm font-medium text-slate-500">
//               Registered Faces
//             </p>

//             <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
//               <UserRound size={20} />
//             </div>
//           </div>

//           <p className="text-3xl font-bold text-slate-900">
//             {students.filter((student) => student.photo_url).length}
//           </p>

//           <p className="mt-1 text-sm text-slate-400">
//             Photographs uploaded
//           </p>
//         </div>

//         {/* Classes */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <p className="text-sm font-medium text-slate-500">
//               Classes Represented
//             </p>

//             <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
//               <GraduationCap size={20} />
//             </div>
//           </div>

//           <p className="text-3xl font-bold text-slate-900">
//             {classesRepresented}
//           </p>

//           <p className="mt-1 text-sm text-slate-400">
//             Unique class divisions
//           </p>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative w-full max-w-xl">
//         <Search
//           size={19}
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//         />

//         <input
//           type="text"
//           placeholder="Search by name, roll number or class..."
//           value={searchTerm}
//           onChange={(event) => setSearchTerm(event.target.value)}
//           className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         />
//       </div>

//       {/* Students Table */}
//       <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//         {loading ? (
//           <div className="flex items-center justify-center gap-3 px-6 py-16 text-slate-500">
//             <LoaderCircle
//               className="animate-spin"
//               size={22}
//             />
//             Loading students...
//           </div>
//         ) : filteredStudents.length === 0 ? (
//           <div className="px-6 py-16 text-center">
//             <Users
//               size={48}
//               className="mx-auto mb-4 text-slate-300"
//             />

//             <h3 className="text-lg font-semibold text-slate-800">
//               {searchTerm
//                 ? "No matching students found"
//                 : "No students registered yet"}
//             </h3>

//             <p className="mt-2 text-sm text-slate-500">
//               {searchTerm
//                 ? "Try searching with a different keyword."
//                 : "Add your first student to start building your classroom."}
//             </p>

//             {!searchTerm && (
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
//               >
//                 Add First Student
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[750px] text-left">
//               <thead className="bg-slate-50 text-sm text-slate-500">
//                 <tr>
//                   <th className="px-6 py-4 font-medium">
//                     Student
//                   </th>

//                   <th className="px-6 py-4 font-medium">
//                     Roll Number
//                   </th>

//                   <th className="px-6 py-4 font-medium">
//                     Class
//                   </th>

//                   <th className="px-6 py-4 font-medium">
//                     Face Status
//                   </th>

//                   <th className="px-6 py-4 text-right font-medium">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {filteredStudents.map((student) => (
//                   <tr
//                     key={student.id}
//                     className="transition hover:bg-slate-50"
//                   >
//                     {/* Student */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         {student.photo_url ? (
//                           <img
//                             src={student.photo_url}
//                             alt={student.name}
//                             className="h-11 w-11 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
//                             <UserRound size={20} />
//                           </div>
//                         )}

//                         <div>
//                           <p className="font-semibold text-slate-800">
//                             {student.name}
//                           </p>

//                           <p className="text-sm text-slate-500">
//                             Division {student.division}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Roll Number */}
//                     <td className="px-6 py-4 text-sm text-slate-600">
//                       {student.roll_number}
//                     </td>

//                     {/* Class */}
//                     <td className="px-6 py-4 text-sm text-slate-600">
//                       {student.class_name}-{student.division}
//                     </td>

//                     {/* Face Status */}
//                     <td className="px-6 py-4">
//                       <span
//   className={`rounded-full px-3 py-1 text-xs font-semibold ${
//     student.face_embedding
//       ? "bg-emerald-100 text-emerald-700"
//       : student.photo_url
//       ? "bg-amber-100 text-amber-700"
//       : "bg-red-100 text-red-700"
//   }`}
// >
//   {student.face_embedding
//     ? "AI Ready"
//     : student.photo_url
//     ? "Embedding Pending"
//     : "Photo Missing"}
// </span>
//                     </td>

//                     {/* Delete */}
//                     <td className="px-6 py-4 text-right">
//                       <button
//                         onClick={() =>
//                           handleDeleteStudent(student.id)
//                         }
//                         className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
//                         title="Delete student"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Add Student Modal */}
//       {showForm && (
//         <AddStudentForm
//           onAddStudent={handleAddStudent}
//           onClose={() => setShowForm(false)}
//           saving={saving}
//         />
//       )}
//     </div>
//   );
// }

// export default Students;




import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Users,
  UserRound,
  GraduationCap,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import AddStudentForm from "../components/AddStudentForm";
import { supabase } from "../lib/supabase";

function Students() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchStudents() {
    setLoading(true);
    setError("");

    try {
      const {
        data,
        error: fetchError,
      } = await supabase
        .from("students")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (fetchError) {
        throw fetchError;
      }

      setStudents(data || []);
    } catch (err) {
      console.error(
        "Students fetch error:",
        err
      );

      setError(
        err.message ||
          "Failed to load students."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleAddStudent(
    studentData
  ) {
    setSaving(true);
    setError("");

    let uploadedFilePath = null;

    try {
      let photoUrl = null;

      if (studentData.photoFile) {
        const extension =
          studentData.photoFile.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        uploadedFilePath = `${crypto.randomUUID()}.${extension}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("student-photos")
          .upload(
            uploadedFilePath,
            studentData.photoFile
          );

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: publicUrlData,
        } = supabase.storage
          .from("student-photos")
          .getPublicUrl(
            uploadedFilePath
          );

        photoUrl =
          publicUrlData.publicUrl;
      }

      const {
        data: insertedStudent,
        error: insertError,
      } = await supabase
        .from("students")
        .insert([
          {
            name: studentData.name,
            roll_number:
              studentData.rollNumber,
            class_name:
              studentData.className,
            division:
              studentData.division,
            photo_url: photoUrl,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Generate face embedding
      if (insertedStudent?.id && photoUrl) {
        const apiUrl =
          import.meta.env.VITE_API_URL ||
          "http://127.0.0.1:8000";

        const formData =
          new FormData();

        formData.append(
          "photo_url",
          photoUrl
        );

        try {
          const embeddingResponse =
            await fetch(
              `${apiUrl}/api/students/${insertedStudent.id}/generate-embedding`,
              {
                method: "POST",
                body: formData,
              }
            );

          const embeddingResult =
            await embeddingResponse.json();

          if (!embeddingResponse.ok) {
            throw new Error(
              embeddingResult.detail ||
                "Face embedding generation failed."
            );
          }
        } catch (embeddingError) {
          // Remove student if embedding generation failed
          await supabase
            .from("students")
            .delete()
            .eq(
              "id",
              insertedStudent.id
            );

          if (uploadedFilePath) {
            await supabase.storage
              .from("student-photos")
              .remove([
                uploadedFilePath,
              ]);
          }

          throw new Error(
            embeddingError.message ||
              "Could not register the student's face."
          );
        }
      }

      setStudents((previous) => [
        insertedStudent,
        ...previous,
      ]);

      setShowForm(false);
    } catch (err) {
      console.error(
        "Add student error:",
        err
      );

      setError(
        err.message ||
          "Failed to register student."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStudent(
    studentId
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);

      if (deleteError) {
        throw deleteError;
      }

      setStudents((previous) =>
        previous.filter(
          (student) =>
            student.id !== studentId
        )
      );
    } catch (err) {
      console.error(
        "Delete student error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete student."
      );
    }
  }

  const searchValue =
    searchTerm.toLowerCase().trim();

  const filteredStudents =
    students.filter((student) => {
      return (
        student.name
          ?.toLowerCase()
          .includes(searchValue) ||
        student.roll_number
          ?.toLowerCase()
          .includes(searchValue) ||
        student.class_name
          ?.toLowerCase()
          .includes(searchValue) ||
        student.division
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

  const classesRepresented =
    new Set(
      students.map(
        (student) =>
          `${student.class_name}-${student.division}`
      )
    ).size;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Students
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Register and manage students
            for AttendAI.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(true)
          }
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Students"
          value={students.length}
          description="Registered in AttendAI"
          icon={Users}
          iconClass="bg-blue-100 text-blue-600"
        />

        <SummaryCard
          title="Registered Faces"
          value={
            students.filter(
              (student) =>
                student.photo_url
            ).length
          }
          description="Photographs uploaded"
          icon={UserRound}
          iconClass="bg-emerald-100 text-emerald-600"
        />

        <SummaryCard
          title="Classes Represented"
          value={classesRepresented}
          description="Unique class divisions"
          icon={GraduationCap}
          iconClass="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search
          size={19}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search by name, roll number or class..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-slate-500">
            <LoaderCircle
              size={22}
              className="animate-spin"
            />
            Loading students...
          </div>
        ) : filteredStudents.length ===
          0 ? (
          <div className="px-5 py-14 text-center sm:px-6 sm:py-16">
            <Users
              size={48}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              {searchTerm
                ? "No matching students found"
                : "No students registered yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {searchTerm
                ? "Try searching with a different keyword."
                : "Add your first student to start building your classroom."}
            </p>

            {!searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setShowForm(true)
                }
                className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 sm:w-auto"
              >
                Add First Student
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                    Student
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                    Roll Number
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                    Class
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                    Face Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(
                  (student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {student.photo_url ? (
                            <img
                              src={
                                student.photo_url
                              }
                              alt={
                                student.name
                              }
                              className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 sm:h-11 sm:w-11">
                              <UserRound
                                size={20}
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                              {student.name}
                            </p>

                            <p className="text-sm text-slate-500">
                              Division{" "}
                              {
                                student.division
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">
                        {
                          student.roll_number
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">
                        {student.class_name}-
                        {student.division}
                      </td>

                      <td className="px-5 py-4 sm:px-6">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                            student.photo_url
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {student.photo_url
                            ? "Registered"
                            : "Photo Missing"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteStudent(
                              student.id
                            )
                          }
                          className="cursor-pointer rounded-lg p-2 text-red-500 hover:bg-red-50"
                          title="Delete student"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <AddStudentForm
          onAddStudent={
            handleAddStudent
          }
          onClose={() =>
            setShowForm(false)
          }
          saving={saving}
        />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div
          className={`rounded-xl p-2 ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default Students;