const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";
const FILE_ID_APP = "BQACAgUAAxbBAAMCAg2bF8YV-dRo94aHQ51qbBj_YN4AAjcaAAL9zXFUSaFdwLblwqU7BA";

// Render perlukan port dinamik, dia tak boleh fix port 3000 sahaja
const PORT = process.env.PORT || 3000;

app.post('/telegram_bot', async (req, res) => {
    const body = req.body;
    
    if (body.message && body.message.text) {
        const chatId = body.message.chat.id;
        const text = body.message.text;

        if (text === "/start" || text === "/download") {
            const urlHantar = `https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`;
            try {
                await axios.post(urlHantar, {
                    chat_id: chatId,
                    document: FILE_ID_APP,
                    caption: "Nah, ni app WasapBluster Official yang hang minta. Sila install!"
                });
                console.log("File berjaya dihantar ke:", chatId);
            } catch (error) {
                console.error("Error hantar file:", error.response ? error.response.data : error.message);
            }
        }
    }
    res.status(200).send("OK");
});

app.get('/', (req, res) => {
    res.send("Server Bot WasapBluster Berjalan Lancar!");
});

app.listen(PORT, () => console.log(`Server bot running kat port ${PORT}...`));
