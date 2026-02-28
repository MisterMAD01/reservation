from PIL import Image
import os

input_path = r'C:\Users\MisterMAD\.gemini\antigravity\brain\6ecedf34-a942-48db-8682-cc5f0f6000d9\banking_rich_menu_booking_1772263553061.png'
output_path = r'C:\Users\MisterMAD\.gemini\antigravity\brain\6ecedf34-a942-48db-8682-cc5f0f6000d9\banking_rich_menu_1040.png'

if os.path.exists(input_path):
    with Image.open(input_path) as img:
        resized_img = img.resize((1040, 1040), Image.Resampling.LANCZOS)
        resized_img.save(output_path)
        print(f"Image resized and saved to {output_path}")
else:
    print("Input image not found.")
