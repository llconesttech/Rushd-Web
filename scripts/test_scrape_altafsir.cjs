const https = require('https');
const fs = require('fs');

// URL for Al-Wahidi, Surah 2, Ayah 6
const targetUrl = "https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=86&tSoraNo=2&tAyahNo=6&tDisplay=yes&UserProfile=0&LanguageId=2";

https.get(targetUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        fs.writeFileSync('altafsir_test.html', data);
        console.log("Saved to altafsir_test.html");
    });
}).on('error', (err) => {
    console.log("Error: " + err.message);
});
