import os

def clean_labels(label_folder):
    for file in os.listdir(label_folder):
        file_path = os.path.join(label_folder, file)

        # Skip non-txt files (safety)
        if not file.endswith(".txt"):
            continue

        with open(file_path, "r") as f:
            lines = f.readlines()

        new_lines = []

        for line in lines:
            parts = line.strip().split()
            
            # Skip empty lines
            if len(parts) == 0:
                continue

            class_id = int(parts[0])

            # ✅ Keep ONLY pothole (class 4 in RDD2022)
            if class_id == 4:
                parts[0] = "0"  # Convert to single class (pothole)
                new_lines.append(" ".join(parts))

        # Overwrite file (even if empty)
        with open(file_path, "w") as f:
            f.write("\n".join(new_lines))


# Apply to all splits
base_path = "../datasets/pothole_data"

for split in ["train", "val", "test"]:
    label_path = os.path.join(base_path, split, "labels")
    
    if os.path.exists(label_path):
        clean_labels(label_path)
    else:
        print(f"⚠️ Folder not found: {label_path}")

print("✅ Dataset cleaned: Only potholes (class 4) retained")