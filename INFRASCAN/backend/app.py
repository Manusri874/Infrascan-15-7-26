# from flask import Flask, request, send_file
# from flask_cors import CORS
# from ultralytics import YOLO
# import os

# app = Flask(__name__)
# CORS(app)   # ✅ THIS LINE FIXES CORS

# # Load your model
# model = YOLO(r"D:\MNS major project\pave-pilot-pro\INFRASCAN\runs\detect\pothole_v2\weights\best.pt")

# UPLOAD_FOLDER = "uploads"
# OUTPUT_FOLDER = "outputs"

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# @app.route("/detect", methods=["POST"])
# def detect():
#     if "image" not in request.files:
#         return {"error": "No image uploaded"}, 400

#     file = request.files["image"]

#     input_path = os.path.join(UPLOAD_FOLDER, file.filename)
#     file.save(input_path)

#     # 🔥 MATCH STREAMLIT SETTINGS
#     results = model.predict(
#         source=input_path,
#         conf=0.03,     # SAME as streamlit
#         iou=0.4,       # SAME as streamlit
#         imgsz=416      # SAME as streamlit
#     )

#     output_path = os.path.join(OUTPUT_FOLDER, file.filename)
#     results[0].save(filename=output_path)

#     # DEBUG (optional)
#     print("Detections:", results[0].boxes)

#     return send_file(output_path, mimetype='image/jpeg')

# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)

model = None

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def get_model():
    global model
    if model is None:
        print("Loading YOLO model...")
        model = YOLO(r"D:\MNS major project\pave-pilot-pro\INFRASCAN\runs\detect\pothole_v2\weights\best.pt")
        print("Model loaded!")
    return model

@app.route("/")
def home():
    return jsonify({"status": "Backend running"})

@app.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    file = request.files["image"]

    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(input_path)

    model = get_model()

    results = model.predict(
        source=input_path,
        conf=0.03,
        iou=0.4,
        imgsz=416
    )

    output_path = os.path.join(OUTPUT_FOLDER, file.filename)
    results[0].save(filename=output_path)

    print("Detection complete")

    return send_file(output_path, mimetype="image/jpeg")

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host="0.0.0.0", port=5000, debug=True)