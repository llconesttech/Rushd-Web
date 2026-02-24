/* eslint-env node */
/* eslint-disable no-undef, no-unused-vars */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reciters Configuration (Synced with src/data/reciters.js)
const reciters = [
    {
        id: 'mishary_rashid',
        name: 'Mishary Rashid Alafasy',
        subfolder: 'Alafasy_64kbps', // EveryAyah folder name
    },
    {
        id: 'abdulbaset',
        name: 'AbdulBaset AbdulSamad',
        subfolder: 'Abdul_Basit_Murattal_64kbps',
    },
    {
        id: 'abdulbaset_mujawwad',
        name: 'AbdulBaset AbdulSamad (Mujawwad)',
        subfolder: 'Abdul_Basit_Mujawwad_128kbps',
    },
    {
        id: 'minshawi_mujawwad',
        name: 'Mohamed Siddiq Al-Minshawi (Mujawwad)',
        subfolder: 'Minshawy_Mujawwad_192kbps',
    },
    {
        id: 'hudhaify',
        name: 'Ali Al-Hudhaify',
        subfolder: 'Hudhaify_64kbps',
    },
    {
        id: 'sudais',
        name: 'Abdur-Rahman as-Sudais',
        subfolder: 'Abdurrahmaan_As-Sudais_64kbps',
    },
    {
        id: 'shuraim',
        name: 'Saud Al-Shuraim',
        subfolder: 'Saood_ash-Shuraym_64kbps',
    },
    {
        id: 'ghamadi',
        name: 'Saad Al-Ghamdi',
        subfolder: 'Ghamadi_40kbps',
    },
    {
        id: 'husary',
        name: 'Mahmoud Khalil Al-Husary',
        subfolder: 'Husary_64kbps',
    },
    {
        id: 'maher',
        name: 'Maher Al Muaiqly',
        subfolder: 'MaherAlMuaiqly_128kbps',
    },
    {
        id: 'yasser_dosari',
        name: 'Yasser Al-Dosari',
        subfolder: 'Yasser_Ad-Dussary_128kbps',
    },
    {
        id: 'juhany',
        name: 'Abdullah Awad al-Juhany',
        subfolder: 'Abdullah_Juhany_128kbps',
    },
    {
        id: 'baleela',
        name: 'Bandar Baleela',
        subfolder: 'Bandar_Baleela_64kbps',
    }
];

// Ayah counts for all 114 surahs
const ayahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
    123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
    34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
    54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
    60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
    14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
    28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
    15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
    11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
    5, 4, 5, 6
];

const BASE_URL = 'https://everyayah.com/data';
const PUBLIC_AUDIO_DIR = path.join(__dirname, '../public/audio');

// Pad number with leading zeros (e.g. 1 -> 001)
const pad = (num, size = 3) => {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
};

// Download a single file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                fs.unlink(dest, () => { }); // Delete failed file
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

// Main download function
const startDownload = async () => {
    // Ensure base audio directory exists
    if (!fs.existsSync(PUBLIC_AUDIO_DIR)) {
        fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
    }

    console.log(`Starting download for ${reciters.length} reciters...`);

    for (const reciter of reciters) {
        const reciterDir = path.join(PUBLIC_AUDIO_DIR, reciter.id);
        if (!fs.existsSync(reciterDir)) {
            fs.mkdirSync(reciterDir, { recursive: true });
        }

        console.log(`\nProcessing ${reciter.name} (${reciter.id})...`);

        for (let s = 0; s < 114; s++) {
            const surahNum = s + 1;
            const count = ayahCounts[s];

            for (let a = 1; a <= count; a++) {
                // Update progress on the same line
                process.stdout.write(`\rSurah ${pad(surahNum)}: Downloading ayah ${a}/${count}`);

                // Filename format: 001001.mp3 (Standard EveryAyah format)
                const fileName = `${pad(surahNum)}${pad(a)}.mp3`;
                const destPath = path.join(reciterDir, fileName);
                const url = `${BASE_URL}/${reciter.subfolder}/${fileName}`;

                if (fs.existsSync(destPath)) {
                    // Skip existing
                    continue;
                }

                try {
                    await downloadFile(url, destPath);
                } catch (err) {
                    process.stdout.write(`\nError downloading ${fileName}: ${err.message}\n`);
                }
            }
            // Finalize line
            process.stdout.write(`\rSurah ${pad(surahNum)}: Done (${count} ayahs)          \n`);
        }
    }
    console.log('\nAll downloads completed.');
};

startDownload();

