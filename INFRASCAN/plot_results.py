import pandas as pd
import matplotlib.pyplot as plt
import os

# -------------------------------
# CHANGE THIS PATH (IMPORTANT)
# -------------------------------
RESULTS_PATH = "runs/detect/pothole_v2/results.csv"

# -------------------------------
# LOAD DATA
# -------------------------------
if not os.path.exists(RESULTS_PATH):
    print("❌ results.csv not found. Check training path.")
    exit()

df = pd.read_csv(RESULTS_PATH)

# -------------------------------
# SET FONT (clean look)
# -------------------------------
plt.rcParams["font.family"] = "DejaVu Sans"

# -------------------------------
# 1. LOSS CURVES
# -------------------------------
plt.figure()
plt.plot(df["epoch"], df["train/box_loss"], label="Box Loss")
plt.plot(df["epoch"], df["train/cls_loss"], label="Class Loss")
plt.plot(df["epoch"], df["train/dfl_loss"], label="DFL Loss")

plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.title("Training Loss Curve")
plt.legend()
plt.grid()

plt.savefig("loss_curve.png")
plt.show()

# -------------------------------
# 2. mAP CURVE
# -------------------------------
plt.figure()
plt.plot(df["epoch"], df["metrics/mAP50(B)"], label="mAP@50")
plt.plot(df["epoch"], df["metrics/mAP50-95(B)"], label="mAP@50-95")

plt.xlabel("Epochs")
plt.ylabel("Accuracy")
plt.title("Model Accuracy (mAP)")
plt.legend()
plt.grid()

plt.savefig("map_curve.png")
plt.show()

# -------------------------------
# 3. PRECISION & RECALL
# -------------------------------
plt.figure()
plt.plot(df["epoch"], df["metrics/precision(B)"], label="Precision")
plt.plot(df["epoch"], df["metrics/recall(B)"], label="Recall")

plt.xlabel("Epochs")
plt.ylabel("Score")
plt.title("Precision vs Recall")
plt.legend()
plt.grid()

plt.savefig("precision_recall.png")
plt.show()

print("✅ Graphs saved successfully!")