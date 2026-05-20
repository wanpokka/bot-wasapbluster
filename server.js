const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";
const PORT = process.env.PORT || 3000;

app.post('/telegram_bot', async (req, res) => {
    const body = req.body;
    
    // Kalau hang hantar fail dokumen/apk, dia akan masuk sini
    if (body.message && body.message.document) {
        const fileId Baru = body.message.document.file_id;
        const fileName = body.message.document.file_name;
        
        console.log("=========================================");
        console.log("BERJAYA JUMPA FILE ID BARU!!! 🔥");
        console.log("Nama Fail:", fileName);
        console.log("FILE_ID HANG:", fileIdBaru);
        console.log("=========================================");
    }
    
    res.status(200).send("OK");
});

app.listen(PORT, () => console.log(`Server pencari ID berjalan...`));
