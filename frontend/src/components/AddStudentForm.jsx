// // // import { useState } from "react";
// // // import { UserPlus, Upload, X, Save } from "lucide-react";

// // // function AddStudentForm({ onAddStudent, onClose,saving }) {
// // //   const [formData, setFormData] = useState({
// // //     name: "",
// // //     rollNumber: "",
// // //     className: "",
// // //     division: "",
// // //     photo: null,
// // //   });

// // //   const [preview, setPreview] = useState(null);
// // //   const [error, setError] = useState("");

// // //   function handleChange(event) {
// // //     const { name, value } = event.target;

// // //     setFormData((previousData) => ({
// // //       ...previousData,
// // //       [name]: value,
// // //     }));
// // //   }

// // //   function handlePhotoChange(event) {
// // //     const file = event.target.files[0];

// // //     if (!file) {
// // //       return;
// // //     }

// // //     if (!file.type.startsWith("image/")) {
// // //       setError("Please upload a valid image file.");
// // //       return;
// // //     }

// // //     if (file.size > 5 * 1024 * 1024) {
// // //       setError("Image size must be less than 5 MB.");
// // //       return;
// // //     }

// // //     setFormData((previousData) => ({
// // //       ...previousData,
// // //       photo: file,
// // //     }));

// // //     setPreview(URL.createObjectURL(file));
// // //     setError("");
// // //   }

// // //   function handleSubmit(event) {
// // //     event.preventDefault();
// // //     setError("");

// // //     if (
// // //       !formData.name.trim() ||
// // //       !formData.rollNumber.trim() ||
// // //       !formData.className.trim() ||
// // //       !formData.division.trim() ||
// // //       !formData.photo
// // //     ) {
// // //       setError("Please fill in all fields and upload a photograph.");
// // //       return;
// // //     }

// // //     const newStudent = {
// // //   name: formData.name.trim(),
// // //   rollNumber: formData.rollNumber.trim(),
// // //   className: formData.className.trim(),
// // //   division: formData.division.trim(),
// // //   photoFile: formData.photo,
// // // };

// // // onAddStudent(newStudent);
// // //   }

// // //   return (
// // //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
// // //       <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
// // //         {/* Header */}
// // //         <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
// // //           <div className="flex items-center gap-3">
// // //             <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
// // //               <UserPlus size={22} />
// // //             </div>

// // //             <div>
// // //               <h2 className="text-xl font-semibold text-slate-900">
// // //                 Add New Student
// // //               </h2>

// // //               <p className="text-sm text-slate-500">
// // //                 Register a student for face recognition
// // //               </p>
// // //             </div>
// // //           </div>

// // //           <button
// // //             type="button"
// // //             onClick={onClose}
// // //             className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
// // //           >
// // //             <X size={20} />
// // //           </button>
// // //         </div>

// // //         {/* Form */}
// // //         <form onSubmit={handleSubmit} className="space-y-6 p-6">
// // //           {/* Student Name */}
// // //           <div>
// // //             <label className="mb-2 block text-sm font-medium text-slate-700">
// // //               Student Name
// // //             </label>

// // //             <input
// // //               type="text"
// // //               name="name"
// // //               value={formData.name}
// // //               onChange={handleChange}
// // //               placeholder="Enter student's full name"
// // //               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// // //             />
// // //           </div>

// // //           {/* Roll Number */}
// // //           <div>
// // //             <label className="mb-2 block text-sm font-medium text-slate-700">
// // //               Roll Number
// // //             </label>

// // //             <input
// // //               type="text"
// // //               name="rollNumber"
// // //               value={formData.rollNumber}
// // //               onChange={handleChange}
// // //               placeholder="Example: 101"
// // //               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// // //             />
// // //           </div>

// // //           {/* Class and Division */}
// // //           <div className="grid gap-4 sm:grid-cols-2">
// // //             <div>
// // //               <label className="mb-2 block text-sm font-medium text-slate-700">
// // //                 Class
// // //               </label>

// // //               <input
// // //                 type="text"
// // //                 name="className"
// // //                 value={formData.className}
// // //                 onChange={handleChange}
// // //                 placeholder="Example: 10"
// // //                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// // //               />
// // //             </div>

// // //             <div>
// // //               <label className="mb-2 block text-sm font-medium text-slate-700">
// // //                 Division
// // //               </label>

// // //               <input
// // //                 type="text"
// // //                 name="division"
// // //                 value={formData.division}
// // //                 onChange={handleChange}
// // //                 placeholder="Example: A"
// // //                 className="w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* Photograph Upload */}
// // //           <div>
// // //             <label className="mb-2 block text-sm font-medium text-slate-700">
// // //               Student Photograph
// // //             </label>

// // //             <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
// // //               {preview ? (
// // //                 <img
// // //                   src={preview}
// // //                   alt="Student preview"
// // //                   className="mb-4 h-32 w-32 rounded-xl object-cover shadow-md"
// // //                 />
// // //               ) : (
// // //                 <Upload className="mb-3 text-slate-400" size={32} />
// // //               )}

// // //               <span className="font-medium text-slate-700">
// // //                 {preview ? "Change photograph" : "Upload photograph"}
// // //               </span>

// // //               <span className="mt-1 text-sm text-slate-500">
// // //                 PNG, JPG or JPEG — Maximum 5 MB
// // //               </span>

// // //               <input
// // //                 type="file"
// // //                 accept="image/png,image/jpeg,image/jpg"
// // //                 onChange={handlePhotoChange}
// // //                 className="hidden"
// // //               />
// // //             </label>
// // //           </div>

// // //           {/* Error Message */}
// // //           {error && (
// // //             <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
// // //               {error}
// // //             </div>
// // //           )}

// // //           {/* Buttons */}
// // //           <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
// // //             <button
// // //               type="button"
// // //               onClick={onClose}
// // //               className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
// // //             >
// // //               Cancel
// // //             </button>

// // //             <button
// // //   type="submit"
// // //   disabled={saving}
// // //   className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
// // // >
// // //   <Save size={18} />

// // //   {saving ? "Saving..." : "Register Student"}
// // // </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default AddStudentForm;



// // import { useState } from "react";
// // import {
// //   UserPlus,
// //   Upload,
// //   X,
// //   Save,
// // } from "lucide-react";

// // function AddStudentForm({
// //   onAddStudent,
// //   onClose,
// //   saving,
// // }) {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     rollNumber: "",
// //     className: "",
// //     division: "",
// //     photo: null,
// //   });

// //   const [preview, setPreview] = useState(null);
// //   const [error, setError] = useState("");

// //   function handleChange(event) {
// //     const { name, value } = event.target;

// //     setFormData((previousData) => ({
// //       ...previousData,
// //       [name]: value,
// //     }));
// //   }

// //   function handlePhotoChange(event) {
// //     const file = event.target.files?.[0];

// //     if (!file) {
// //       return;
// //     }

// //     if (!file.type.startsWith("image/")) {
// //       setError("Please upload a valid image file.");
// //       return;
// //     }

// //     if (file.size > 5 * 1024 * 1024) {
// //       setError("Image size must be less than 5 MB.");
// //       return;
// //     }

// //     setFormData((previousData) => ({
// //       ...previousData,
// //       photo: file,
// //     }));

// //     setPreview(URL.createObjectURL(file));
// //     setError("");
// //   }

// //   function handleSubmit(event) {
// //     event.preventDefault();
// //     setError("");

// //     if (
// //       !formData.name.trim() ||
// //       !formData.rollNumber.trim() ||
// //       !formData.className.trim() ||
// //       !formData.division.trim() ||
// //       !formData.photo
// //     ) {
// //       setError(
// //         "Please fill in all fields and upload a photograph."
// //       );
// //       return;
// //     }

// //     const newStudent = {
// //       name: formData.name.trim(),
// //       rollNumber: formData.rollNumber.trim(),
// //       className: formData.className.trim(),
// //       division: formData.division.trim(),
// //       photoFile: formData.photo,
// //     };

// //     onAddStudent(newStudent);
// //   }

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
// //       <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
// //         {/* Header */}
// //         <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
// //           <div className="flex items-center gap-3">
// //             <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
// //               <UserPlus size={22} />
// //             </div>

// //             <div>
// //               <h2 className="text-xl font-semibold text-slate-900">
// //                 Add New Student
// //               </h2>

// //               <p className="text-sm text-slate-500">
// //                 Register a student for face recognition
// //               </p>
// //             </div>
// //           </div>

// //           <button
// //             type="button"
// //             onClick={onClose}
// //             disabled={saving}
// //             className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
// //           >
// //             <X size={20} />
// //           </button>
// //         </div>

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="space-y-6 p-6"
// //         >
// //           {/* Student Name */}
// //           <div>
// //             <label className="mb-2 block text-sm font-medium text-slate-700">
// //               Student Name
// //             </label>

// //             <input
// //               type="text"
// //               name="name"
// //               value={formData.name}
// //               onChange={handleChange}
// //               placeholder="Enter student's full name"
// //               disabled={saving}
// //               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
// //             />
// //           </div>

// //           {/* Roll Number */}
// //           <div>
// //             <label className="mb-2 block text-sm font-medium text-slate-700">
// //               Roll Number
// //             </label>

// //             <input
// //               type="text"
// //               name="rollNumber"
// //               value={formData.rollNumber}
// //               onChange={handleChange}
// //               placeholder="Example: 101"
// //               disabled={saving}
// //               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
// //             />
// //           </div>

// //           {/* Class and Division */}
// //           <div className="grid gap-4 sm:grid-cols-2">
// //             <div>
// //               <label className="mb-2 block text-sm font-medium text-slate-700">
// //                 Class
// //               </label>

// //               <input
// //                 type="text"
// //                 name="className"
// //                 value={formData.className}
// //                 onChange={handleChange}
// //                 placeholder="Example: 10"
// //                 disabled={saving}
// //                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
// //               />
// //             </div>

// //             <div>
// //               <label className="mb-2 block text-sm font-medium text-slate-700">
// //                 Division
// //               </label>

// //               <input
// //                 type="text"
// //                 name="division"
// //                 value={formData.division}
// //                 onChange={handleChange}
// //                 placeholder="Example: A"
// //                 disabled={saving}
// //                 className="w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
// //               />
// //             </div>
// //           </div>

// //           {/* Photograph Upload */}
// //           <div>
// //             <label className="mb-2 block text-sm font-medium text-slate-700">
// //               Student Photograph
// //             </label>

// //             <label
// //               className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 text-center transition ${
// //                 saving
// //                   ? "cursor-not-allowed opacity-60"
// //                   : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
// //               }`}
// //             >
// //               {preview ? (
// //                 <img
// //                   src={preview}
// //                   alt="Student preview"
// //                   className="mb-4 h-32 w-32 rounded-xl object-cover shadow-md"
// //                 />
// //               ) : (
// //                 <Upload
// //                   className="mb-3 text-slate-400"
// //                   size={32}
// //                 />
// //               )}

// //               <span className="font-medium text-slate-700">
// //                 {preview
// //                   ? "Change photograph"
// //                   : "Upload photograph"}
// //               </span>

// //               <span className="mt-1 text-sm text-slate-500">
// //                 PNG, JPG or JPEG — Maximum 5 MB
// //               </span>

// //               <input
// //                 type="file"
// //                 accept="image/png,image/jpeg,image/jpg"
// //                 onChange={handlePhotoChange}
// //                 disabled={saving}
// //                 className="hidden"
// //               />
// //             </label>
// //           </div>

// //           {/* Error Message */}
// //           {error && (
// //             <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //               {error}
// //             </div>
// //           )}

// //           {/* Buttons */}
// //           <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               disabled={saving}
// //               className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
// //             >
// //               Cancel
// //             </button>

// //             <button
// //               type="submit"
// //               disabled={saving}
// //               className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
// //             >
// //               <Save size={18} />

// //               {saving ? "Saving..." : "Register Student"}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default AddStudentForm;



// import { useState } from "react";
// import {
//   UserPlus,
//   Upload,
//   X,
//   Save,
// } from "lucide-react";

// function AddStudentForm({
//   onAddStudent,
//   onClose,
//   saving,
// }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     rollNumber: "",
//     className: "",
//     division: "",
//     photo: null,
//   });

//   const [preview, setPreview] = useState(null);
//   const [error, setError] = useState("");

//   // =========================================
//   // Handle text fields
//   // =========================================

//   function handleChange(event) {
//     const { name, value } = event.target;

//     setFormData((previousData) => ({
//       ...previousData,
//       [name]:
//         name === "division"
//           ? value.toUpperCase()
//           : value,
//     }));
//   }

//   // =========================================
//   // Handle student photo
//   // Maximum size: 20 MB
//   // =========================================

//   function handlePhotoChange(event) {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     // Check image type
//     if (!file.type.startsWith("image/")) {
//       setError("Please upload a valid image file.");
//       event.target.value = "";
//       return;
//     }

//     // Maximum file size = 20 MB
//     const MAX_FILE_SIZE = 20 * 1024 * 1024;

//     if (file.size > MAX_FILE_SIZE) {
//       setError(
//         "Image size must be less than 20 MB."
//       );

//       event.target.value = "";
//       return;
//     }

//     // Store photo
//     setFormData((previousData) => ({
//       ...previousData,
//       photo: file,
//     }));

//     // Create preview
//     setPreview(URL.createObjectURL(file));

//     // Clear previous error
//     setError("");
//   }

//   // =========================================
//   // Submit student
//   // =========================================

//   function handleSubmit(event) {
//     event.preventDefault();

//     setError("");

//     // Validate fields
//     if (
//       !formData.name.trim() ||
//       !formData.rollNumber.trim() ||
//       !formData.className.trim() ||
//       !formData.division.trim() ||
//       !formData.photo
//     ) {
//       setError(
//         "Please fill in all fields and upload a photograph."
//       );
//       return;
//     }

//     // Create student object
//     const newStudent = {
//       name: formData.name.trim(),

//       rollNumber:
//         formData.rollNumber.trim(),

//       className:
//         formData.className.trim(),

//       // Always save division in uppercase
//       division:
//         formData.division.trim().toUpperCase(),

//       photoFile:
//         formData.photo,
//     };

//     onAddStudent(newStudent);
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
//       <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

//         {/* ========================================= */}
//         {/* HEADER */}
//         {/* ========================================= */}

//         <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

//           <div className="flex items-center gap-3">

//             <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
//               <UserPlus size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-slate-900">
//                 Add New Student
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Register a student for face recognition
//               </p>
//             </div>

//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={saving}
//             className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
//           >
//             <X size={20} />
//           </button>

//         </div>

//         {/* ========================================= */}
//         {/* FORM */}
//         {/* ========================================= */}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6 p-6"
//         >

//           {/* ========================================= */}
//           {/* STUDENT NAME */}
//           {/* ========================================= */}

//           <div>

//             <label className="mb-2 block text-sm font-medium text-slate-700">
//               Student Name
//             </label>

//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter student's full name"
//               disabled={saving}
//               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//             />

//           </div>

//           {/* ========================================= */}
//           {/* ROLL NUMBER */}
//           {/* ========================================= */}

//           <div>

//             <label className="mb-2 block text-sm font-medium text-slate-700">
//               Roll Number
//             </label>

//             <input
//               type="text"
//               name="rollNumber"
//               value={formData.rollNumber}
//               onChange={handleChange}
//               placeholder="Example: 101"
//               disabled={saving}
//               className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//             />

//           </div>

//           {/* ========================================= */}
//           {/* CLASS + DIVISION */}
//           {/* ========================================= */}

//           <div className="grid gap-4 sm:grid-cols-2">

//             {/* CLASS */}

//             <div>

//               <label className="mb-2 block text-sm font-medium text-slate-700">
//                 Class
//               </label>

//               <input
//                 type="text"
//                 name="className"
//                 value={formData.className}
//                 onChange={handleChange}
//                 placeholder="Example: 10"
//                 disabled={saving}
//                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />

//             </div>

//             {/* DIVISION */}

//             <div>

//               <label className="mb-2 block text-sm font-medium text-slate-700">
//                 Division
//               </label>

//               <input
//                 type="text"
//                 name="division"
//                 value={formData.division}
//                 onChange={handleChange}
//                 placeholder="Example: A"
//                 disabled={saving}
//                 className="w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />

//             </div>

//           </div>

//           {/* ========================================= */}
//           {/* STUDENT PHOTO */}
//           {/* ========================================= */}

//           <div>

//             <label className="mb-2 block text-sm font-medium text-slate-700">
//               Student Photograph
//             </label>

//             <label
//               className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-8 text-center transition ${
//                 saving
//                   ? "cursor-not-allowed opacity-60"
//                   : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
//               }`}
//             >

//               {/* PREVIEW */}

//               {preview ? (
//                 <img
//                   src={preview}
//                   alt="Student preview"
//                   className="mb-4 h-32 w-32 rounded-xl object-cover shadow-md"
//                 />
//               ) : (
//                 <Upload
//                   className="mb-3 text-slate-400"
//                   size={32}
//                 />
//               )}

//               {/* TITLE */}

//               <span className="font-medium text-slate-700">
//                 {preview
//                   ? "Change photograph"
//                   : "Upload photograph"}
//               </span>

//               {/* SIZE INFO */}

//               <span className="mt-1 text-sm text-slate-500">
//                 PNG, JPG or JPEG — Maximum 20 MB
//               </span>

//               {/* FILE INPUT */}

//               <input
//                 type="file"
//                 accept="image/png,image/jpeg,image/jpg"
//                 onChange={handlePhotoChange}
//                 disabled={saving}
//                 className="hidden"
//               />

//             </label>

//           </div>

//           {/* ========================================= */}
//           {/* ERROR */}
//           {/* ========================================= */}

//           {error && (
//             <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* ========================================= */}
//           {/* BUTTONS */}
//           {/* ========================================= */}

//           <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={saving}
//               className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >

//               <Save size={18} />

//               {saving
//                 ? "Saving..."
//                 : "Register Student"}

//             </button>

//           </div>

//         </form>

//       </div>
//     </div>
//   );
// }

// export default AddStudentForm;




import { useState } from "react";
import {
  UserPlus,
  Upload,
  X,
  Save,
} from "lucide-react";

function AddStudentForm({
  onAddStudent,
  onClose,
  saving,
}) {
  const [formData, setFormData] =
    useState({
      name: "",
      rollNumber: "",
      className: "",
      division: "",
      photo: null,
    });

  const [preview, setPreview] =
    useState(null);

  const [error, setError] =
    useState("");

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "division"
          ? value.toUpperCase()
          : value,
    }));
  }

  function handlePhotoChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please upload a valid image file."
      );
      return;
    }

    const maxSize =
      20 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be less than 20 MB."
      );

      event.target.value = "";
      return;
    }

    setFormData((previous) => ({
      ...previous,
      photo: file,
    }));

    setPreview(
      URL.createObjectURL(file)
    );

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.rollNumber.trim() ||
      !formData.className.trim() ||
      !formData.division.trim() ||
      !formData.photo
    ) {
      setError(
        "Please fill in all fields and upload a photograph."
      );
      return;
    }

    onAddStudent({
      name: formData.name.trim(),
      rollNumber:
        formData.rollNumber.trim(),
      className:
        formData.className.trim(),
      division:
        formData.division
          .trim()
          .toUpperCase(),
      photoFile:
        formData.photo,
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 sm:p-5">
      <div className="my-auto max-h-[95dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[90dvh]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-blue-100 p-2 text-blue-600">
              <UserPlus size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
                Add New Student
              </h2>

              <p className="text-xs text-slate-500 sm:text-sm">
                Register a student for face
                recognition
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-4 sm:space-y-6 sm:p-6"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Student Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
          </div>

          {/* Roll + Class */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Roll Number
              </label>

              <input
                type="text"
                name="rollNumber"
                value={
                  formData.rollNumber
                }
                onChange={handleChange}
                placeholder="Enter roll number"
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Standard / Class
              </label>

              <select
                name="className"
                value={
                  formData.className
                }
                onChange={handleChange}
                disabled={saving}
                className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
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
                      {index + 1}
                      {index === 0
                        ? "st"
                        : index === 1
                        ? "nd"
                        : index === 2
                        ? "rd"
                        : "th"}{" "}
                      Standard
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Division */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Division
            </label>

            <select
              name="division"
              value={
                formData.division
              }
              onChange={handleChange}
              disabled={saving}
              className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
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
              ].map((division) => (
                <option
                  key={division}
                  value={division}
                >
                  Division {division}
                </option>
              ))}
            </select>
          </div>

          {/* Photo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Student Photo
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center hover:border-blue-400 hover:bg-blue-50 sm:p-8">
              {preview ? (
                <img
                  src={preview}
                  alt="Student preview"
                  className="h-32 w-32 rounded-2xl object-cover shadow-sm sm:h-40 sm:w-40"
                />
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Upload
                      size={25}
                      className="text-blue-600"
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Click to upload photo
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG or JPEG —
                    Maximum 20 MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={
                  handlePhotoChange
                }
                disabled={saving}
                className="hidden"
              />
            </label>

            {preview && (
              <p className="mt-2 text-center text-xs text-slate-400">
                Click the image area to
                change the photo.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="w-full cursor-pointer rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={18} />
                  Register Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentForm;