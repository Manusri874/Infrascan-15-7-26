import streamlit as st
from PIL import Image
import os
import time

# -------------------------------
# CONFIG
# -------------------------------
st.set_page_config(page_title="INFRASCAN", layout="centered")

MODEL_PATH = "../runs/detect/pothole_v2/weights/best.pt"

# -------------------------------
# THEME TOGGLE
# -------------------------------
theme = st.radio("🌗 Choose Theme", ["🌙 Dark", "☀️ Light"], horizontal=True)

# -------------------------------
# DARK THEME (FIXED + NEON STYLE)
# -------------------------------
if "Dark" in theme:
    st.markdown("""
        <style>
        .stApp {
            background: radial-gradient(circle at center, #0f2027, #203a43, #2c5364);
            color: #00ffcc;
        }

        /* Title */
        h1 {
            text-align: center;
            color: #00ffff;
            text-shadow: 0px 0px 20px #00ffff;
        }

        /* Subtitle */
        h4 {
            text-align: center;
            color: #90ee90;
        }

        /* Button */
        div.stButton > button {
            background-color: #00ffcc;
            color: black;
            font-weight: bold;
            border-radius: 10px;
            border: none;
        }

        div.stButton > button:hover {
            background-color: #00cc99;
            color: white;
        }

        /* 🔥 RADIO BUTTON FIX */
        div[role="radiogroup"] label {
            color: #ffff66 !important;
            font-weight: bold !important;
        }

        div[role="radiogroup"] * {
            color: #ffff66 !important;
        }

        /* File uploader */
        .stFileUploader label {
            color: #ffff66 !important;
        }

        </style>
    """, unsafe_allow_html=True)

# -------------------------------
# LIGHT THEME
# -------------------------------
else:
    st.markdown("""
        <style>
        .stApp {
            background: linear-gradient(to right, #e0eafc, #cfdef3);
            color: black;
        }

        h1 {
            text-align: center;
            color: #007acc;
        }

        h4 {
            text-align: center;
            color: #333;
        }

        div.stButton > button {
            background-color: #007acc;
            color: white;
            border-radius: 10px;
        }

        div.stButton > button:hover {
            background-color: #005f99;
        }

        </style>
    """, unsafe_allow_html=True)

# -------------------------------
# TITLE
# -------------------------------
st.markdown("<h1>INFRASCAN</h1>", unsafe_allow_html=True)
st.markdown("<h4>Smart Pothole Detection System</h4>", unsafe_allow_html=True)

# -------------------------------
# FILE UPLOAD
# -------------------------------
uploaded_file = st.file_uploader("📤 Upload a road image", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    image = Image.open(uploaded_file).convert("RGB")

    st.image(image, caption="📷 Uploaded Image", width=500)

    if st.button("🚀 Detect Potholes"):

        filename = uploaded_file.name.replace(" ", "_")
        input_path = filename

        image.save(input_path, quality=100)

        # -------------------------------
        # RUN YOLO (IMPROVED)
        # -------------------------------
        with st.spinner("🔍 Detecting potholes..."):
            time.sleep(1)

            os.system(
                f'yolo detect predict model="{MODEL_PATH}" source="{input_path}" imgsz=416 conf=0.03 iou=0.4'
            )

        # -------------------------------
        # FIND OUTPUT
        # -------------------------------
        base_dir = "runs/detect"

        try:
            folders = [f for f in os.listdir(base_dir) if f.startswith("predict")]
            folders.sort(key=lambda x: os.path.getmtime(os.path.join(base_dir, x)), reverse=True)

            if folders:
                latest_folder = folders[0]
                result_path = os.path.join(base_dir, latest_folder, filename)

                if os.path.exists(result_path):
                    result_image = Image.open(result_path)

                    st.success("✅ Detection Complete!")
                    st.image(result_image, caption="🚧 Detected Potholes", width=500)
                else:
                    st.error(f"❌ Output not found: {filename}")
            else:
                st.error("❌ No prediction folders found")

        except Exception as e:
            st.error(f"❌ Error: {e}")

# -------------------------------
# FOOTER
# -------------------------------
st.markdown("---")
st.markdown(
    "<p style='text-align:center; color:gray;'>Built for Smart City Infrastructure 🚀</p>",
    unsafe_allow_html=True
)