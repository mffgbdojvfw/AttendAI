import insightface
import cv2

print("Loading face recognition model...")

app = insightface.app.FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(ctx_id=0, det_size=(640, 640))

print("Model loaded successfully!")

image = cv2.imread("test_images/student.jpg")

if image is None:
    print("ERROR: Could not read the image.")
    exit()

faces = app.get(image)

print(f"Faces detected: {len(faces)}")

for i, face in enumerate(faces):
    embedding = face.embedding

    print(f"\nFace {i + 1}")
    print("Embedding dimensions:", len(embedding))
    print("First 5 values:", embedding[:5])