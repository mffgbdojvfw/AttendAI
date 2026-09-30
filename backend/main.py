



# # import os

# # import cv2
# # import numpy as np
# # import insightface
# # import requests

# # from dotenv import load_dotenv
# # from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# # from fastapi.middleware.cors import CORSMiddleware
# # from supabase import create_client, Client


# # # =========================================================
# # # ENVIRONMENT
# # # =========================================================

# # load_dotenv()

# # SUPABASE_URL = os.getenv("SUPABASE_URL")
# # SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# # if not SUPABASE_URL or not SUPABASE_KEY:
# #     raise RuntimeError(
# #         "SUPABASE_URL or SUPABASE_KEY is missing from backend/.env"
# #     )

# # supabase: Client = create_client(
# #     SUPABASE_URL,
# #     SUPABASE_KEY
# # )


# # # =========================================================
# # # FASTAPI
# # # =========================================================

# # app = FastAPI(
# #     title="AttendAI Backend",
# #     description="AI attendance backend for classroom face recognition",
# #     version="1.0.0",
# # )


# # # =========================================================
# # # CORS
# # # =========================================================

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=[
# #         "http://localhost:5173",
# #         "http://localhost:5174",
# #     ],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )


# # # =========================================================
# # # INSIGHTFACE
# # # =========================================================

# # print("Loading InsightFace model...")

# # face_app = insightface.app.FaceAnalysis(
# #     name="buffalo_l",
# #     providers=["CPUExecutionProvider"]
# # )

# # face_app.prepare(
# #     ctx_id=0,
# #     det_size=(640, 640)
# # )

# # print("InsightFace model loaded successfully!")


# # # =========================================================
# # # FACE MATCHING SETTINGS
# # # =========================================================

# # # Initial development threshold.
# # #
# # # Your current successful test:
# # #
# # # Maan Mahendrabhai Patel
# # # similarity = 0.7948
# # #
# # # So 0.60 will accept that match.
# # #
# # # We will tune this later using multiple test photos.
# # SIMILARITY_THRESHOLD = 0.60


# # # =========================================================
# # # ROOT
# # # =========================================================

# # @app.get("/")
# # def root():
# #     return {
# #         "message": "AttendAI backend is running",
# #         "status": "ok",
# #     }


# # # =========================================================
# # # HEALTH
# # # =========================================================

# # @app.get("/health")
# # def health():
# #     return {
# #         "status": "healthy",
# #         "service": "AttendAI API",
# #     }


# # # =========================================================
# # # GENERATE STUDENT FACE EMBEDDING
# # # =========================================================

# # @app.post(
# #     "/api/students/{student_id}/generate-embedding"
# # )
# # async def generate_student_embedding(
# #     student_id: str,
# #     photo_url: str = Form(...)
# # ):
# #     try:

# #         print(
# #             f"Generating face embedding for student: {student_id}"
# #         )

# #         # ---------------------------------------------
# #         # Download student photo
# #         # ---------------------------------------------

# #         response = requests.get(
# #             photo_url,
# #             timeout=30
# #         )

# #         if response.status_code != 200:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Could not download student photo."
# #             )

# #         image_bytes = response.content

# #         # ---------------------------------------------
# #         # Decode image
# #         # ---------------------------------------------

# #         image_array = np.frombuffer(
# #             image_bytes,
# #             np.uint8
# #         )

# #         image = cv2.imdecode(
# #             image_array,
# #             cv2.IMREAD_COLOR
# #         )

# #         if image is None:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Could not decode student image."
# #             )

# #         # ---------------------------------------------
# #         # Detect faces
# #         # ---------------------------------------------

# #         faces = face_app.get(image)

# #         print(
# #             f"Faces detected in student photo: {len(faces)}"
# #         )

# #         if len(faces) == 0:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="No face detected in the student photo."
# #             )

# #         if len(faces) > 1:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail=(
# #                     "Multiple faces detected. "
# #                     "Please use a photo containing only one student."
# #                 )
# #             )

# #         # ---------------------------------------------
# #         # Get embedding
# #         # ---------------------------------------------

# #         embedding = faces[0].embedding

# #         if embedding is None:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Could not generate face embedding."
# #             )

# #         embedding = embedding.astype(float).tolist()

# #         # ---------------------------------------------
# #         # Save embedding to Supabase
# #         # ---------------------------------------------

# #         result = (
# #             supabase
# #             .table("students")
# #             .update({
# #                 "face_embedding": embedding
# #             })
# #             .eq("id", student_id)
# #             .execute()
# #         )

# #         if not result.data:
# #             raise HTTPException(
# #                 status_code=404,
# #                 detail="Student not found."
# #             )

# #         print(
# #             f"Embedding saved for student: {student_id}"
# #         )

# #         return {
# #             "success": True,
# #             "message": "Face embedding generated successfully.",
# #             "student_id": student_id,
# #             "embedding_dimensions": len(embedding),
# #         }

# #     except HTTPException:
# #         raise

# #     except Exception as error:

# #         print(
# #             "Student embedding error:",
# #             error
# #         )

# #         raise HTTPException(
# #             status_code=500,
# #             detail=str(error)
# #         )


# # # =========================================================
# # # ANALYZE CLASSROOM ATTENDANCE
# # # =========================================================

# # @app.post("/api/attendance/analyze")
# # async def analyze_attendance(
# #     class_name: str = Form(...),
# #     division: str = Form(...),
# #     photo: UploadFile = File(...),
# # ):
# #     try:

# #         print(
# #             f"Analyzing attendance for "
# #             f"Class {class_name}-{division}"
# #         )

# #         # ---------------------------------------------
# #         # Read classroom image
# #         # ---------------------------------------------

# #         image_bytes = await photo.read()

# #         if not image_bytes:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Empty image received."
# #             )

# #         # ---------------------------------------------
# #         # Decode image
# #         # ---------------------------------------------

# #         image_array = np.frombuffer(
# #             image_bytes,
# #             np.uint8
# #         )

# #         image = cv2.imdecode(
# #             image_array,
# #             cv2.IMREAD_COLOR
# #         )

# #         if image is None:
# #             raise HTTPException(
# #                 status_code=400,
# #                 detail="Could not decode classroom image."
# #             )

# #         # ---------------------------------------------
# #         # Detect faces
# #         # ---------------------------------------------

# #         faces = face_app.get(image)

# #         print(
# #             f"Faces detected in classroom photo: {len(faces)}"
# #         )

# #         # ---------------------------------------------
# #         # No faces
# #         # ---------------------------------------------

# #         if len(faces) == 0:

# #             return {
# #                 "success": True,
# #                 "class_name": class_name,
# #                 "division": division,
# #                 "faces_detected": 0,
# #                 "students": [],
# #                 "unknown_faces": [],
# #                 "recognized_count": 0,
# #                 "unknown_count": 0,
# #                 "message": "No faces detected."
# #             }

# #         # ---------------------------------------------
# #         # Recognition containers
# #         # ---------------------------------------------

# #         recognized_students = []
# #         unknown_faces = []

# #         # ---------------------------------------------
# #         # Process every detected face
# #         # ---------------------------------------------

# #         for face_index, face in enumerate(faces):

# #             embedding = face.embedding

# #             # -----------------------------------------
# #             # Embedding unavailable
# #             # -----------------------------------------

# #             if embedding is None:

# #                 unknown_faces.append({
# #                     "face_index": face_index + 1,
# #                     "confidence": 0,
# #                     "bbox": face.bbox.tolist(),
# #                     "reason": (
# #                         "Embedding could not be generated."
# #                     )
# #                 })

# #                 continue

# #             embedding = embedding.astype(float)

# #             # -----------------------------------------
# #             # Search registered students
# #             # -----------------------------------------

# #             rpc_result = supabase.rpc(
# #                 "match_students_by_face",
# #                 {
# #                     "query_embedding":
# #                         str(embedding.tolist()),

# #                     "target_class":
# #                         class_name,

# #                     "target_division":
# #                         division,

# #                     "result_limit":
# #                         1,
# #                 }
# #             ).execute()

# #             matches = rpc_result.data or []

# #             # -----------------------------------------
# #             # No registered candidates
# #             # -----------------------------------------

# #             if not matches:

# #                 unknown_faces.append({
# #                     "face_index": face_index + 1,
# #                     "confidence": 0,
# #                     "bbox": face.bbox.tolist(),
# #                     "reason": (
# #                         "No registered student matched."
# #                     )
# #                 })

# #                 continue

# #             # -----------------------------------------
# #             # Best candidate
# #             # -----------------------------------------

# #             match = matches[0]

# #             similarity = float(
# #                 match["similarity"]
# #             )

# #             confidence = round(
# #                 similarity * 100,
# #                 2
# #             )

# #             bbox = face.bbox.tolist()

# #             print(
# #                 f"Face {face_index + 1}: "
# #                 f"{match['name']} "
# #                 f"similarity={similarity:.4f}"
# #             )

# #             # -----------------------------------------
# #             # Apply similarity threshold
# #             # -----------------------------------------

# #             if similarity < SIMILARITY_THRESHOLD:

# #                 unknown_faces.append({
# #                     "face_index": face_index + 1,
# #                     "confidence": confidence,
# #                     "bbox": bbox,
# #                     "reason": (
# #                         "Best registered student "
# #                         "is below similarity threshold."
# #                     ),
# #                     "best_match": {
# #                         "student_id": match["id"],
# #                         "name": match["name"],
# #                         "roll_number": match["roll_number"],
# #                         "similarity": round(
# #                             similarity,
# #                             4
# #                         )
# #                     }
# #                 })

# #                 continue

# #             # -----------------------------------------
# #             # Recognized student
# #             # -----------------------------------------

# #             recognized_students.append({
# #                 "face_index": face_index + 1,

# #                 "student_id":
# #                     match["id"],

# #                 "name":
# #                     match["name"],

# #                 "roll_number":
# #                     match["roll_number"],

# #                 "class_name":
# #                     match["class_name"],

# #                 "division":
# #                     match["division"],

# #                 "confidence":
# #                     confidence,

# #                 "similarity":
# #                     round(
# #                         similarity,
# #                         4
# #                     ),

# #                 "status":
# #                     "present",

# #                 "bbox":
# #                     bbox,
# #             })

# #         # =================================================
# #         # REMOVE DUPLICATE STUDENTS
# #         # =================================================

# #         unique_students = {}

# #         for student in recognized_students:

# #             student_id = student["student_id"]

# #             if (
# #                 student_id not in unique_students
# #                 or
# #                 student["confidence"]
# #                 >
# #                 unique_students[
# #                     student_id
# #                 ]["confidence"]
# #             ):
# #                 unique_students[
# #                     student_id
# #                 ] = student

# #         recognized_students = list(
# #             unique_students.values()
# #         )

# #         # =================================================
# #         # FINAL RESPONSE
# #         # =================================================

# #         return {
# #             "success": True,

# #             "class_name":
# #                 class_name,

# #             "division":
# #                 division,

# #             "faces_detected":
# #                 len(faces),

# #             "students":
# #                 recognized_students,

# #             "unknown_faces":
# #                 unknown_faces,

# #             "recognized_count":
# #                 len(recognized_students),

# #             "unknown_count":
# #                 len(unknown_faces),

# #             "similarity_threshold":
# #                 SIMILARITY_THRESHOLD,
# #         }

# #     except HTTPException:
# #         raise

# #     except Exception as error:

# #         print(
# #             "Attendance analysis error:",
# #             error
# #         )

# #         raise HTTPException(
# #             status_code=500,
# #             detail=str(error)
# #         )




# import os

# import cv2
# import numpy as np
# import insightface
# import requests

# from dotenv import load_dotenv
# from fastapi import (
#     FastAPI,
#     UploadFile,
#     File,
#     Form,
#     HTTPException,
#     Header,
#     Depends,
# )
# from fastapi.middleware.cors import CORSMiddleware
# from supabase import create_client, Client


# # =========================================================
# # ENVIRONMENT
# # =========================================================

# load_dotenv()

# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# if not SUPABASE_URL or not SUPABASE_KEY:
#     raise RuntimeError(
#         "SUPABASE_URL or SUPABASE_KEY is missing from backend/.env"
#     )

# supabase: Client = create_client(
#     SUPABASE_URL,
#     SUPABASE_KEY
# )


# # =========================================================
# # FASTAPI
# # =========================================================

# app = FastAPI(
#     title="AttendAI Backend",
#     description="AI attendance backend for classroom face recognition",
#     version="1.0.0",
# )


# # =========================================================
# # CORS
# # =========================================================

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://localhost:5174",
#         "https://attend-ai-rfsx.vercel.app",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # =========================================================
# # INSIGHTFACE
# # =========================================================

# print("Loading InsightFace model...")

# face_app = insightface.app.FaceAnalysis(
#     name="buffalo_l",
#     providers=["CPUExecutionProvider"]
# )

# face_app.prepare(
#     ctx_id=0,
#     det_size=(640, 640)
# )

# print("InsightFace model loaded successfully!")


# # =========================================================
# # FACE MATCHING SETTINGS
# # =========================================================

# SIMILARITY_THRESHOLD = 0.60


# # =========================================================
# # AUTHENTICATION HELPERS
# # =========================================================

# def get_access_token(
#     authorization: str | None
# ) -> str:

#     if not authorization:
#         raise HTTPException(
#             status_code=401,
#             detail="Authentication required."
#         )

#     if not authorization.lower().startswith("bearer "):
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid authorization header."
#         )

#     token = authorization.split(" ", 1)[1].strip()

#     if not token:
#         raise HTTPException(
#             status_code=401,
#             detail="Authentication token is missing."
#         )

#     return token


# def get_current_user(
#     authorization: str | None = Header(default=None)
# ):

#     token = get_access_token(authorization)

#     try:
#         user_response = supabase.auth.get_user(token)

#         user = getattr(
#             user_response,
#             "user",
#             None
#         )

#         if user is None:
#             raise HTTPException(
#                 status_code=401,
#                 detail="Invalid or expired authentication token."
#             )

#         return user

#     except HTTPException:
#         raise

#     except Exception as error:

#         print(
#             "Authentication error:",
#             error
#         )

#         raise HTTPException(
#             status_code=401,
#             detail="Invalid or expired authentication token."
#         )


# def get_teacher_school(
#     user
# ) -> str:

#     try:

#         membership_result = (
#             supabase
#             .table("school_teachers")
#             .select("school_id")
#             .eq("user_id", user.id)
#             .limit(1)
#             .execute()
#         )

#         memberships = membership_result.data or []

#         if not memberships:
#             raise HTTPException(
#                 status_code=403,
#                 detail="Your teacher account is not assigned to a school."
#             )

#         school_id = memberships[0].get("school_id")

#         if not school_id:
#             raise HTTPException(
#                 status_code=403,
#                 detail="Your teacher account has no school assigned."
#             )

#         return school_id

#     except HTTPException:
#         raise

#     except Exception as error:

#         print(
#             "School lookup error:",
#             error
#         )

#         raise HTTPException(
#             status_code=500,
#             detail="Could not determine your school."
#         )


# def get_authenticated_school(
#     user=Depends(get_current_user)
# ) -> tuple:

#     school_id = get_teacher_school(user)

#     return user, school_id


# # =========================================================
# # ROOT
# # =========================================================

# @app.get("/")
# def root():

#     return {
#         "message": "AttendAI backend is running",
#         "status": "ok",
#     }


# # =========================================================
# # HEALTH
# # =========================================================

# @app.get("/health")
# def health():

#     return {
#         "status": "healthy",
#         "service": "AttendAI API",
#     }


# # =========================================================
# # GENERATE STUDENT FACE EMBEDDING
# # =========================================================

# @app.post(
#     "/api/students/{student_id}/generate-embedding"
# )
# async def generate_student_embedding(
#     student_id: str,
#     photo_url: str = Form(...),
#     auth_data: tuple = Depends(get_authenticated_school),
# ):

#     try:

#         user, school_id = auth_data

#         print(
#             f"Generating face embedding for student: {student_id}"
#         )

#         print(
#             f"Authenticated teacher: {user.id}"
#         )

#         print(
#             f"Teacher school: {school_id}"
#         )

#         # ---------------------------------------------
#         # Verify student belongs to teacher's school
#         # ---------------------------------------------

#         student_result = (
#             supabase
#             .table("students")
#             .select("id, school_id")
#             .eq("id", student_id)
#             .eq("school_id", school_id)
#             .limit(1)
#             .execute()
#         )

#         student_rows = student_result.data or []

#         if not student_rows:

#             raise HTTPException(
#                 status_code=404,
#                 detail="Student not found in your school."
#             )

#         # ---------------------------------------------
#         # Download student photo
#         # ---------------------------------------------

#         response = requests.get(
#             photo_url,
#             timeout=30
#         )

#         if response.status_code != 200:

#             raise HTTPException(
#                 status_code=400,
#                 detail="Could not download student photo."
#             )

#         image_bytes = response.content

#         # ---------------------------------------------
#         # Decode image
#         # ---------------------------------------------

#         image_array = np.frombuffer(
#             image_bytes,
#             np.uint8
#         )

#         image = cv2.imdecode(
#             image_array,
#             cv2.IMREAD_COLOR
#         )

#         if image is None:

#             raise HTTPException(
#                 status_code=400,
#                 detail="Could not decode student image."
#             )

#         # ---------------------------------------------
#         # Detect faces
#         # ---------------------------------------------

#         faces = face_app.get(image)

#         print(
#             f"Faces detected in student photo: {len(faces)}"
#         )

#         if len(faces) == 0:

#             raise HTTPException(
#                 status_code=400,
#                 detail="No face detected in the student photo."
#             )

#         if len(faces) > 1:

#             raise HTTPException(
#                 status_code=400,
#                 detail=(
#                     "Multiple faces detected. "
#                     "Please use a photo containing only one student."
#                 )
#             )

#         # ---------------------------------------------
#         # Get embedding
#         # ---------------------------------------------

#         embedding = faces[0].embedding

#         if embedding is None:

#             raise HTTPException(
#                 status_code=400,
#                 detail="Could not generate face embedding."
#             )

#         embedding = embedding.astype(float).tolist()

#         # ---------------------------------------------
#         # Save embedding
#         # ---------------------------------------------

#         result = (
#             supabase
#             .table("students")
#             .update({
#                 "face_embedding": embedding
#             })
#             .eq("id", student_id)
#             .eq("school_id", school_id)
#             .execute()
#         )

#         if not result.data:

#             raise HTTPException(
#                 status_code=404,
#                 detail="Student not found in your school."
#             )

#         print(
#             f"Embedding saved for student: {student_id}"
#         )

#         return {
#             "success": True,
#             "message": "Face embedding generated successfully.",
#             "student_id": student_id,
#             "embedding_dimensions": len(embedding),
#         }

#     except HTTPException:
#         raise

#     except Exception as error:

#         print(
#             "Student embedding error:",
#             error
#         )

#         raise HTTPException(
#             status_code=500,
#             detail=str(error)
#         )


# # =========================================================
# # ANALYZE CLASSROOM ATTENDANCE
# # =========================================================

# @app.post("/api/attendance/analyze")
# async def analyze_attendance(
#     class_name: str = Form(...),
#     division: str = Form(...),
#     photo: UploadFile = File(...),
#     auth_data: tuple = Depends(get_authenticated_school),
# ):

#     try:

#         user, school_id = auth_data

#         print(
#             f"Analyzing attendance for "
#             f"Class {class_name}-{division}"
#         )

#         print(
#             f"Authenticated teacher: {user.id}"
#         )

#         print(
#             f"Teacher school: {school_id}"
#         )

#         # ---------------------------------------------
#         # Read classroom image
#         # ---------------------------------------------

#         image_bytes = await photo.read()

#         if not image_bytes:

#             raise HTTPException(
#                 status_code=400,
#                 detail="Empty image received."
#             )

#         # ---------------------------------------------
#         # Decode image
#         # ---------------------------------------------

#         image_array = np.frombuffer(
#             image_bytes,
#             np.uint8
#         )

#         image = cv2.imdecode(
#             image_array,
#             cv2.IMREAD_COLOR
#         )

#         if image is None:

#             raise HTTPException(
#                 status_code=400,
#                 detail="Could not decode classroom image."
#             )

#         # ---------------------------------------------
#         # Detect faces
#         # ---------------------------------------------

#         faces = face_app.get(image)

#         print(
#             f"Faces detected in classroom photo: {len(faces)}"
#         )

#         # ---------------------------------------------
#         # No faces
#         # ---------------------------------------------

#         if len(faces) == 0:

#             return {
#                 "success": True,
#                 "class_name": class_name,
#                 "division": division,
#                 "faces_detected": 0,
#                 "students": [],
#                 "unknown_faces": [],
#                 "recognized_count": 0,
#                 "unknown_count": 0,
#                 "message": "No faces detected."
#             }

#         # ---------------------------------------------
#         # Recognition containers
#         # ---------------------------------------------

#         recognized_students = []
#         unknown_faces = []

#         # ---------------------------------------------
#         # Process every detected face
#         # ---------------------------------------------

#         for face_index, face in enumerate(faces):

#             embedding = face.embedding

#             # -----------------------------------------
#             # Embedding unavailable
#             # -----------------------------------------

#             if embedding is None:

#                 unknown_faces.append({
#                     "face_index": face_index + 1,
#                     "confidence": 0,
#                     "bbox": face.bbox.tolist(),
#                     "reason": (
#                         "Embedding could not be generated."
#                     )
#                 })

#                 continue

#             embedding = embedding.astype(float)

#             # -----------------------------------------
#             # Search registered students
#             # ONLY inside teacher's school
#             # -----------------------------------------

#             rpc_result = supabase.rpc(
#                 "match_students_by_face",
#                 {
#                     "query_embedding":
#                         str(embedding.tolist()),

#                     "target_school_id":
#                         school_id,

#                     "target_class":
#                         class_name,

#                     "target_division":
#                         division,

#                     "similarity_threshold":
#                         SIMILARITY_THRESHOLD,

#                     "result_limit":
#                         1,
#                 }
#             ).execute()

#             matches = rpc_result.data or []

#             # -----------------------------------------
#             # No registered candidates
#             # -----------------------------------------

#             if not matches:

#                 unknown_faces.append({
#                     "face_index": face_index + 1,
#                     "confidence": 0,
#                     "bbox": face.bbox.tolist(),
#                     "reason": (
#                         "No registered student matched."
#                     )
#                 })

#                 continue

#             # -----------------------------------------
#             # Best candidate
#             # -----------------------------------------

#             match = matches[0]

#             similarity = float(
#                 match["similarity"]
#             )

#             confidence = round(
#                 similarity * 100,
#                 2
#             )

#             bbox = face.bbox.tolist()

#             print(
#                 f"Face {face_index + 1}: "
#                 f"{match['name']} "
#                 f"similarity={similarity:.4f}"
#             )

#             # -----------------------------------------
#             # Apply similarity threshold
#             # -----------------------------------------

#             if similarity < SIMILARITY_THRESHOLD:

#                 unknown_faces.append({
#                     "face_index": face_index + 1,
#                     "confidence": confidence,
#                     "bbox": bbox,
#                     "reason": (
#                         "Best registered student "
#                         "is below similarity threshold."
#                     ),
#                     "best_match": {
#                         "student_id": match["id"],
#                         "name": match["name"],
#                         "roll_number": match["roll_number"],
#                         "similarity": round(
#                             similarity,
#                             4
#                         )
#                     }
#                 })

#                 continue

#             # -----------------------------------------
#             # Recognized student
#             # -----------------------------------------

#             recognized_students.append({
#                 "face_index": face_index + 1,

#                 "student_id":
#                     match["id"],

#                 "name":
#                     match["name"],

#                 "roll_number":
#                     match["roll_number"],

#                 "class_name":
#                     match["class_name"],

#                 "division":
#                     match["division"],

#                 "confidence":
#                     confidence,

#                 "similarity":
#                     round(
#                         similarity,
#                         4
#                     ),

#                 "status":
#                     "present",

#                 "bbox":
#                     bbox,
#             })

#         # =================================================
#         # REMOVE DUPLICATE STUDENTS
#         # =================================================

#         unique_students = {}

#         for student in recognized_students:

#             student_id = student["student_id"]

#             if (
#                 student_id not in unique_students
#                 or
#                 student["confidence"]
#                 >
#                 unique_students[
#                     student_id
#                 ]["confidence"]
#             ):

#                 unique_students[
#                     student_id
#                 ] = student

#         recognized_students = list(
#             unique_students.values()
#         )

#         # =================================================
#         # FINAL RESPONSE
#         # =================================================

#         return {
#             "success": True,

#             "class_name":
#                 class_name,

#             "division":
#                 division,

#             "faces_detected":
#                 len(faces),

#             "students":
#                 recognized_students,

#             "unknown_faces":
#                 unknown_faces,

#             "recognized_count":
#                 len(recognized_students),

#             "unknown_count":
#                 len(unknown_faces),

#             "similarity_threshold":
#                 SIMILARITY_THRESHOLD,

#             "school_id":
#                 school_id,
#         }

#     except HTTPException:
#         raise

#     except Exception as error:

#         print(
#             "Attendance analysis error:",
#             error
#         )

#         raise HTTPException(
#             status_code=500,
#             detail=str(error)
#         )





import os

import cv2
import numpy as np
import insightface
import requests

from dotenv import load_dotenv
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
    Header,
    Depends,
)
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL or SUPABASE_KEY is missing from backend/.env"
    )

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="AttendAI Backend",
    description="AI attendance backend for classroom face recognition",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://attend-ai-rfsx.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# INSIGHTFACE
# =========================================================

print("Loading InsightFace model...")

face_app = insightface.app.FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

face_app.prepare(
    ctx_id=0,
    det_size=(640, 640)
)

print("InsightFace model loaded successfully!")


# =========================================================
# FACE MATCHING SETTINGS
# =========================================================

SIMILARITY_THRESHOLD = 0.60


# =========================================================
# AUTHENTICATION HELPERS
# =========================================================

def get_access_token(
    authorization: str | None
) -> str:

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authentication required."
        )

    if not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header."
        )

    token = authorization.split(" ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication token is missing."
        )

    return token


def get_current_user(
    authorization: str | None = Header(default=None)
):

    token = get_access_token(authorization)

    try:
        user_response = supabase.auth.get_user(token)

        user = getattr(
            user_response,
            "user",
            None
        )

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired authentication token."
            )

        return user

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Authentication error:",
            error
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token."
        )


def get_teacher_school(
    user
) -> str:

    try:

        membership_result = (
            supabase
            .table("school_teachers")
            .select("school_id")
            .eq("user_id", user.id)
            .limit(1)
            .execute()
        )

        memberships = membership_result.data or []

        if not memberships:
            raise HTTPException(
                status_code=403,
                detail="Your teacher account is not assigned to a school."
            )

        school_id = memberships[0].get("school_id")

        if not school_id:
            raise HTTPException(
                status_code=403,
                detail="Your teacher account has no school assigned."
            )

        return school_id

    except HTTPException:
        raise

    except Exception as error:

        print(
            "School lookup error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Could not determine your school."
        )


def get_authenticated_school(
    user=Depends(get_current_user)
) -> tuple:

    school_id = get_teacher_school(user)

    return user, school_id


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "AttendAI backend is running",
        "status": "ok",
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "AttendAI API",
    }


# =========================================================
# GENERATE STUDENT FACE EMBEDDING
# =========================================================

@app.post(
    "/api/students/{student_id}/generate-embedding"
)
async def generate_student_embedding(
    student_id: str,
    photo_url: str = Form(...),
    auth_data: tuple = Depends(get_authenticated_school),
):

    try:

        user, school_id = auth_data

        print(
            f"Generating face embedding for student: {student_id}"
        )

        print(
            f"Authenticated teacher: {user.id}"
        )

        print(
            f"Teacher school: {school_id}"
        )

        # ---------------------------------------------
        # Verify student belongs to teacher's school
        # ---------------------------------------------

        student_result = (
            supabase
            .table("students")
            .select("id, school_id")
            .eq("id", student_id)
            .eq("school_id", school_id)
            .limit(1)
            .execute()
        )

        student_rows = student_result.data or []

        if not student_rows:

            raise HTTPException(
                status_code=404,
                detail="Student not found in your school."
            )

        # ---------------------------------------------
        # Download student photo
        # ---------------------------------------------

        response = requests.get(
            photo_url,
            timeout=30
        )

        if response.status_code != 200:

            raise HTTPException(
                status_code=400,
                detail="Could not download student photo."
            )

        image_bytes = response.content

        # ---------------------------------------------
        # Decode image
        # ---------------------------------------------

        image_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if image is None:

            raise HTTPException(
                status_code=400,
                detail="Could not decode student image."
            )

        # ---------------------------------------------
        # Detect faces
        # ---------------------------------------------

        faces = face_app.get(image)

        print(
            f"Faces detected in student photo: {len(faces)}"
        )

        if len(faces) == 0:

            raise HTTPException(
                status_code=400,
                detail="No face detected in the student photo."
            )

        if len(faces) > 1:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Multiple faces detected. "
                    "Please use a photo containing only one student."
                )
            )

        # ---------------------------------------------
        # Get embedding
        # ---------------------------------------------

        embedding = faces[0].embedding

        if embedding is None:

            raise HTTPException(
                status_code=400,
                detail="Could not generate face embedding."
            )

        embedding = embedding.astype(float).tolist()

        # ---------------------------------------------
        # Save embedding
        # ---------------------------------------------

        result = (
            supabase
            .table("students")
            .update({
                "face_embedding": embedding
            })
            .eq("id", student_id)
            .eq("school_id", school_id)
            .execute()
        )

        if not result.data:

            raise HTTPException(
                status_code=404,
                detail="Student not found in your school."
            )

        print(
            f"Embedding saved for student: {student_id}"
        )

        return {
            "success": True,
            "message": "Face embedding generated successfully.",
            "student_id": student_id,
            "embedding_dimensions": len(embedding),
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Student embedding error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =========================================================
# ANALYZE CLASSROOM ATTENDANCE
# =========================================================

@app.post("/api/attendance/analyze")
async def analyze_attendance(
    class_name: str = Form(...),
    division: str = Form(...),
    photo: UploadFile = File(...),
    auth_data: tuple = Depends(get_authenticated_school),
):

    try:

        user, school_id = auth_data

        print(
            f"Analyzing attendance for "
            f"Class {class_name}-{division}"
        )

        print(
            f"Authenticated teacher: {user.id}"
        )

        print(
            f"Teacher school: {school_id}"
        )

        # ---------------------------------------------
        # Read classroom image
        # ---------------------------------------------

        image_bytes = await photo.read()

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Empty image received."
            )

        # ---------------------------------------------
        # Decode image
        # ---------------------------------------------

        image_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if image is None:

            raise HTTPException(
                status_code=400,
                detail="Could not decode classroom image."
            )

        # ---------------------------------------------
        # Detect faces
        # ---------------------------------------------

        faces = face_app.get(image)

        print(
            f"Faces detected in classroom photo: {len(faces)}"
        )

        # ---------------------------------------------
        # No faces
        # ---------------------------------------------

        if len(faces) == 0:

            return {
                "success": True,
                "class_name": class_name,
                "division": division,
                "faces_detected": 0,
                "students": [],
                "unknown_faces": [],
                "recognized_count": 0,
                "unknown_count": 0,
                "message": "No faces detected."
            }

        # ---------------------------------------------
        # Recognition containers
        # ---------------------------------------------

        recognized_students = []
        unknown_faces = []

        # ---------------------------------------------
        # Process every detected face
        # ---------------------------------------------

        for face_index, face in enumerate(faces):

            embedding = face.embedding

            # -----------------------------------------
            # Embedding unavailable
            # -----------------------------------------

            if embedding is None:

                unknown_faces.append({
                    "face_index": face_index + 1,
                    "confidence": 0,
                    "bbox": face.bbox.tolist(),
                    "reason": (
                        "Embedding could not be generated."
                    )
                })

                continue

            embedding = embedding.astype(float)

            # -----------------------------------------
            # Search registered students
            # ONLY inside teacher's school
            # -----------------------------------------

            rpc_result = supabase.rpc(
                "match_students_by_face",
                {
                    "query_embedding":
                        str(embedding.tolist()),

                    "target_school_id":
                        school_id,

                    "target_class":
                        class_name,

                    "target_division":
                        division,

                    "similarity_threshold":
                        SIMILARITY_THRESHOLD,

                    "result_limit":
                        1,
                }
            ).execute()

            matches = rpc_result.data or []

            # -----------------------------------------
            # No registered candidates
            # -----------------------------------------

            if not matches:

                unknown_faces.append({
                    "face_index": face_index + 1,
                    "confidence": 0,
                    "bbox": face.bbox.tolist(),
                    "reason": (
                        "No registered student matched."
                    )
                })

                continue

            # -----------------------------------------
            # Best candidate
            # -----------------------------------------

            match = matches[0]

            similarity = float(
                match["similarity"]
            )

            confidence = round(
                similarity * 100,
                2
            )

            bbox = face.bbox.tolist()

            print(
                f"Face {face_index + 1}: "
                f"{match['name']} "
                f"similarity={similarity:.4f}"
            )

            # -----------------------------------------
            # Apply similarity threshold
            # -----------------------------------------

            if similarity < SIMILARITY_THRESHOLD:

                unknown_faces.append({
                    "face_index": face_index + 1,
                    "confidence": confidence,
                    "bbox": bbox,
                    "reason": (
                        "Best registered student "
                        "is below similarity threshold."
                    ),
                    "best_match": {
                        "student_id": match["id"],
                        "name": match["name"],
                        "roll_number": match["roll_number"],
                        "similarity": round(
                            similarity,
                            4
                        )
                    }
                })

                continue

            # -----------------------------------------
            # Recognized student
            # -----------------------------------------

            recognized_students.append({
                "face_index": face_index + 1,

                "student_id":
                    match["id"],

                "name":
                    match["name"],

                "roll_number":
                    match["roll_number"],

                "class_name":
                    match["class_name"],

                "division":
                    match["division"],

                "confidence":
                    confidence,

                "similarity":
                    round(
                        similarity,
                        4
                    ),

                "status":
                    "present",

                "bbox":
                    bbox,
            })

        # =================================================
        # REMOVE DUPLICATE STUDENTS
        # =================================================

        unique_students = {}

        for student in recognized_students:

            student_id = student["student_id"]

            if (
                student_id not in unique_students
                or
                student["confidence"]
                >
                unique_students[
                    student_id
                ]["confidence"]
            ):

                unique_students[
                    student_id
                ] = student

        recognized_students = list(
            unique_students.values()
        )

        # =================================================
        # FINAL RESPONSE
        # =================================================

        return {
            "success": True,

            "class_name":
                class_name,

            "division":
                division,

            "faces_detected":
                len(faces),

            "students":
                recognized_students,

            "unknown_faces":
                unknown_faces,

            "recognized_count":
                len(recognized_students),

            "unknown_count":
                len(unknown_faces),

            "similarity_threshold":
                SIMILARITY_THRESHOLD,

            "school_id":
                school_id,
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Attendance analysis error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )