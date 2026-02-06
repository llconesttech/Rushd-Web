// Download Arabic Quran fonts
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = [
    {
        name: 'KFGQPC-Hafs-v2.ttf',
        url: 'https://raw.githubusercontent.com/nicxleo/quran_font/main/mushaf-v1.5/KFGQPCUthmanicScriptHAFS-v2.05.ttf'
    },
    {
        name: 'KFGQPC-Hafs-v1.ttf',
        url: 'https://raw.githubusercontent.com/nicxleo/quran_font/main/mushaf-v1.5/KFGQPCUthmanicScriptHAFS.ttf'
    },
    {
        name: 'QPC-Uthmani-Hafs.ttf',
        url: 'https://raw.githubusercontent.com/nicxleo/quran_font/main/mushaf-v2/page-font/ttf/QCF_P001.ttf'
    }
];

const outputDir = path.join(__dirname, '..', 'public', 'fonts');

function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(outputDir, filename);
        const file = fs.createWriteStream(filePath);

        console.log(`Downloading ${filename}...`);

        const request = https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlinkSync(filePath);
                return downloadFile(response.headers.location, filename).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(filePath);
                reject(new Error(`Failed to download ${filename}: HTTP ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                const stats = fs.statSync(filePath);
                console.log(`  ✓ ${filename} (${Math.round(stats.size / 1024)} KB)`);
                resolve();
            });
        });

        request.on('error', (err) => {
            file.close();
            fs.unlinkSync(filePath);
            reject(err);
        });

        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error(`Timeout downloading ${filename}`));
        });
    });
}

async function main() {
    console.log('Downloading Arabic Quran fonts...\n');

    for (const font of fonts) {
        try {
            await downloadFile(font.url, font.name);
        } catch (err) {
            console.error(`  ✗ ${font.name}: ${err.message}`);
        }
    }

    console.log('\nDone!');
}

main();
