/* eslint-disable */
const https = require('https');
const fs = require('fs');

// URL for Al-Wahidi, Surah 2, Ayah 6 (example)
// tTafsirNo=1 is Al-Wahidi? The search result said tMadhNo=86&tTafsirNo=1
// Let's try Surah 2 (Al-Baqarah) Ayah 6.
const url = "https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=86&tSoraNo=2&tAyahNo=6&tDisplay=yes&UserProfile=0&LanguageId=2";
// Note: Search said tMadhNo=86&tTafsirNo=1. Let's try that combination.
// Actually, let's try a known URL structure from the search result:
// https://www.altafsir.com/Tafasir.asp?tMadhNo=86&tTafsirNo=1&tSoraNo=1&tAyahNo=1&tDisplay=yes&UserProfile=0&LanguageId=2

const targetUrl = "https://www.altafsir.com/Tafasir.asp?tMadhNo=86&tTafsirNo=1&tSoraNo=2&tAyahNo=6&tDisplay=yes&UserProfile=0&LanguageId=2";

https.get(targetUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        // Save to file to inspect
        fs.writeFileSync('altafsir_test.html', data);
        console.log("Saved to altafsir_test.html");
    });
}).on('error', (err) => {
    console.log("Error: " + err.message);
});

