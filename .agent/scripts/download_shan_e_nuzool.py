import requests
import json
import os
import time

# Configuration
BASE_URL = "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/en-asbab-al-nuzul-by-al-wahidi"
OUTPUT_DIR = "public/data/quran/v2/shan-e-nuzool"
OUTPUT_FILE = "en-al-wahidi.json"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

all_data = {}

print("Starting download of Asbab al-Nuzul (Al-Wahidi)...")

for surah_num in range(1, 115):
    url = f"{BASE_URL}/{surah_num}.json"
    print(f"Fetching Surah {surah_num}...", end="", flush=True)
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            # The structure from spa5k is typically { "ayahs": [ { "ayah": 1, "text": "..." } ] }
            # We want to store it keyed by ayah number effectively, or just keep the structure
            all_data[str(surah_num)] = data
            print(" Done.")
        else:
            print(f" Failed (Status: {response.status_code}) - Might not have Shan-e-Nuzool for this Surah.")
            # Some Surahs might not have Asbab al-Nuzul, which is expected.
            all_data[str(surah_num)] = {"ayahs": []} 
            
    except Exception as e:
        print(f" Error: {e}")
        
    # Be nice to the server
    time.sleep(0.1)

# Save combined file
output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, separators=(',', ':'))

print(f"\nCompleted. Data saved to {output_path}")
