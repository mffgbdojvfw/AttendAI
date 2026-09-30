import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Users,
  UserRound,
  GraduationCap,
  Trash2,
  LoaderCircle,
  Pencil,
  X,
  Save,
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
  const [successMessage, setSuccessMessage] = useState("");

  // Edit student states
  const [editingStudent, setEditingStudent] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    rollNumber: "",
    className: "",
    division: "",
  });

  // ==========================================
  // GET CURRENT TEACHER'S SCHOOL
  // ==========================================

  async function getMySchoolId() {
    const { data, error: schoolError } = await supabase.rpc(
      "get_my_school_id"
    );

    if (schoolError) {
      console.error("School lookup error:", schoolError);
      throw new Error(
        schoolError.message ||
          "Could not determine your school."
      );
    }

    if (!data) {
      throw new Error(
        "Your teacher account is not assigned to a school."
      );
    }

    return data;
  }

  // ==========================================
  // GET CURRENT AUTH SESSION
  // ==========================================

  async function getAccessToken() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(
        sessionError.message ||
          "Could not get your authentication session."
      );
    }

    if (!session?.access_token) {
      throw new Error(
        "Your login session has expired. Please log in again."
      );
    }

    return session.access_token;
  }

  // ==========================================
  // FETCH STUDENTS
  // ==========================================

  async function fetchStudents() {
    setLoading(true);
    setError("");
    setSuccessMessage("");

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

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // ADD STUDENT
  // ==========================================

  async function handleAddStudent(studentData) {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    let uploadedFilePath = null;

    try {
      // ==========================================
      // 1. GET TEACHER'S SCHOOL
      // ==========================================

      const schoolId = await getMySchoolId();

      let photoUrl = null;

      // ==========================================
      // 2. UPLOAD STUDENT PHOTO
      // ==========================================

      if (studentData.photoFile) {
        const fileExtension =
          studentData.photoFile.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        uploadedFilePath = `${crypto.randomUUID()}.${fileExtension}`;

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

      // ==========================================
      // 3. INSERT STUDENT
      // ==========================================

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

            // IMPORTANT:
            // Assign the student to the
            // currently logged-in teacher's school.
            school_id: schoolId,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // ==========================================
      // 4. GENERATE FACE EMBEDDING
      // ==========================================

      if (
        insertedStudent?.id &&
        photoUrl
      ) {
        const apiUrl =
          import.meta.env.VITE_API_URL ||
          "http://127.0.0.1:8000";

        // Get Supabase login token.
        // The production backend requires
        // authentication.
        const accessToken =
          await getAccessToken();

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
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
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
          // If embedding generation fails,
          // remove the student because the
          // registration is incomplete.

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

      // ==========================================
      // 5. UPDATE LOCAL STUDENT LIST
      // ==========================================

      setStudents((previous) => [
        insertedStudent,
        ...previous,
      ]);

      setShowForm(false);

      setSuccessMessage(
        `${insertedStudent.name} was registered successfully.`
      );
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

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  function handleEditStudent(student) {
    setError("");
    setSuccessMessage("");

    setEditingStudent(student);

    setEditForm({
      name: student.name || "",
      rollNumber:
        student.roll_number || "",
      className:
        student.class_name || "",
      division:
        student.division || "",
    });
  }

  // ==========================================
  // HANDLE EDIT INPUT
  // ==========================================

  function handleEditChange(event) {
  const {
    name,
    value,
  } = event.target;

  const formattedValue =
    name === "division"
      ? value.toUpperCase()
      : value;

  setEditForm((previous) => ({
    ...previous,
    [name]: formattedValue,
  }));
}

  // ==========================================
  // SAVE EDITED STUDENT
  // ==========================================

  async function handleSaveStudent(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const name =
      editForm.name.trim();

    const rollNumber =
      editForm.rollNumber.trim();

    const className =
      editForm.className.trim();

    const division =
      editForm.division.trim();

    if (!name) {
      setError(
        "Student name is required."
      );
      return;
    }

    if (!rollNumber) {
      setError(
        "Roll number is required."
      );
      return;
    }

    if (!className) {
      setError(
        "Class is required."
      );
      return;
    }

    if (!division) {
      setError(
        "Division is required."
      );
      return;
    }

    if (!editingStudent) {
      return;
    }

    setEditSaving(true);

    try {
      // Get current school so the update
      // explicitly remains inside the
      // teacher's school.
      const schoolId =
        await getMySchoolId();

      const {
        data: updatedStudent,
        error: updateError,
      } = await supabase
        .from("students")
        .update({
          name,
          roll_number: rollNumber,
          class_name: className,
          division,
        })
        .eq(
          "id",
          editingStudent.id
        )
        .eq(
          "school_id",
          schoolId
        )
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update student in local list.
      setStudents(
        (previousStudents) =>
          previousStudents.map(
            (student) =>
              student.id ===
              editingStudent.id
                ? {
                    ...student,
                    ...updatedStudent,
                  }
                : student
          )
      );

      setEditingStudent(null);

      setSuccessMessage(
        `${name}'s details were updated successfully.`
      );
    } catch (updateError) {
      console.error(
        "Update student error:",
        updateError
      );

      setError(
        updateError.message ||
          "Failed to update student details."
      );
    } finally {
      setEditSaving(false);
    }
  }

  // ==========================================
  // DELETE STUDENT
  // ==========================================

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
    setSuccessMessage("");

    try {
      // Make sure the student belongs
      // to the current teacher's school.
      const schoolId =
        await getMySchoolId();

      const {
        error: deleteError,
      } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId)
        .eq(
          "school_id",
          schoolId
        );

      if (deleteError) {
        throw deleteError;
      }

      setStudents(
        (previous) =>
          previous.filter(
            (student) =>
              student.id !==
              studentId
          )
      );

      setSuccessMessage(
        "Student deleted successfully."
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

  // ==========================================
  // SEARCH
  // ==========================================

  const searchValue =
    searchTerm
      .toLowerCase()
      .trim();

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

  // ==========================================
  // COUNT UNIQUE CLASSES
  // ==========================================

  const classesRepresented =
    new Set(
      students.map(
        (student) =>
          `${student.class_name}-${student.division}`
      )
    ).size;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">

      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Students
          </h1>

          <p className="mt-1 text-slate-500">
            Register and manage students for AttendAI.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(true)
          }
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {/* Total Students */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total Students
            </p>

            <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
              <Users size={20} />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {students.length}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Registered in AttendAI
          </p>
        </div>

        {/* Registered Faces */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Registered Faces
            </p>

            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
              <UserRound size={20} />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {
              students.filter(
                (student) =>
                  student.photo_url
              ).length
            }
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Photographs uploaded
          </p>
        </div>

        {/* Classes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Classes Represented
            </p>

            <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
              <GraduationCap size={20} />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {classesRepresented}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Unique class divisions
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
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
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Students Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-slate-500">
            <LoaderCircle
              className="animate-spin"
              size={22}
            />
            Loading students...
          </div>
        ) : filteredStudents.length ===
          0 ? (
          <div className="px-6 py-16 text-center">
            <Users
              size={48}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-semibold text-slate-800">
              {searchTerm
                ? "No matching students found"
                : "No students registered yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
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
                className="mt-5 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Add First Student
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Student
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Roll Number
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Class
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Face Status
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(
                  (student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.photo_url ? (
                            <img
                              src={
                                student.photo_url
                              }
                              alt={
                                student.name
                              }
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                              <UserRound size={20} />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-800">
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

                      {/* Roll Number */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {
                          student.roll_number
                        }
                      </td>

                      {/* Class */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.class_name}-
                        {student.division}
                      </td>

                      {/* Face Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() =>
                              handleEditStudent(
                                student
                              )
                            }
                            className="cursor-pointer rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                            title="Edit student"
                          >
                            <Pencil size={18} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteStudent(
                                student.id
                              )
                            }
                            className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            title="Delete student"
                          >
                            <Trash2 size={18} />
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

      {/* Add Student Modal */}
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

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Student
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the student's details.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingStudent(
                    null
                  )
                }
                disabled={editSaving}
                className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
              >
                <X size={20} />
              </button>
            </div>

            {/* Edit Form */}
            <form
              onSubmit={
                handleSaveStudent
              }
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Student Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter student name"
                  disabled={editSaving}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Roll Number
                </label>

                <input
                  type="text"
                  name="rollNumber"
                  value={
                    editForm.rollNumber
                  }
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter roll number"
                  disabled={editSaving}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              {/* Class + Division */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Class
                  </label>

                  <input
                    type="text"
                    name="className"
                    value={
                      editForm.className
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="e.g. 10"
                    disabled={editSaving}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Division
                  </label>

                  <input
                    type="text"
                    name="division"
                    value={
                      editForm.division
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="e.g. A"
                    disabled={editSaving}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Information */}
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                The student's registered face/photo will remain
                unchanged. Only the information above will be
                updated.
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setEditingStudent(
                      null
                    )
                  }
                  disabled={editSaving}
                  className="cursor-pointer rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editSaving}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editSaving ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
