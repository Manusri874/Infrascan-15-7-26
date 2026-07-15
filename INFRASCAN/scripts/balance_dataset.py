import os
import random

def balance_dataset(images_path, labels_path, remove_ratio=0.7):
    label_files = os.listdir(labels_path)

    non_pothole_files = []

    # Step 1: Identify non-pothole (empty label files)
    for file in label_files:
        file_path = os.path.join(labels_path, file)

        with open(file_path, "r") as f:
            content = f.read().strip()

        if content == "":
            non_pothole_files.append(file)

    print(f"Total non-pothole images: {len(non_pothole_files)}")

    # Step 2: Select 70% randomly to delete
    num_to_remove = int(len(non_pothole_files) * remove_ratio)
    files_to_remove = random.sample(non_pothole_files, num_to_remove)

    # Step 3: Delete selected files
    for file in files_to_remove:
        label_file = os.path.join(labels_path, file)
        image_file = os.path.join(images_path, file.replace(".txt", ".jpg"))

        # Delete label
        if os.path.exists(label_file):
            os.remove(label_file)

        # Delete image
        if os.path.exists(image_file):
            os.remove(image_file)

    print(f"Deleted {num_to_remove} non-pothole images")


# 🔥 APPLY TO TRAIN, VAL, TEST
base_path = "../datasets/pothole_data"

for split in ["train", "val", "test"]:
    print(f"\nProcessing {split}...")
    images_path = os.path.join(base_path, split, "images")
    labels_path = os.path.join(base_path, split, "labels")

    balance_dataset(images_path, labels_path, remove_ratio=0.7)

print("\n✅ Dataset balanced successfully!")