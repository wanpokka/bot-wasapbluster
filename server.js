const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";

// PASTIKAN ID NI BERBEZA ANTARA WASAP DAN FB
// Kalau ID ni sama, bot akan error/tak hantar apa-apa
const FILE_WASAP_BLUSTER = "BQACAgUAAxkBAANPAheZOKAMfugGP3udrtQkai04G3hOAahoAAIUIU1UOZlP7H0vEvY7BA"; 
const FILE_FB_BLUSTER = "BQACAgUAAxkBAANPAheZOKAMfugGP3udrtQkai04G3hOAahoAAIUIU1UOZlP7H0vEvY7BA"; 

const GROUP_1_ID = "@blustermarketingtools"; 
const GROUP_3_ID = "@marketingtoolsmy";

const PORT = process.env.PORT || 3000;

async function checkDahJoin(userId, groupId) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${TOKEN_BOT}/getChatMember`, {
            params: { chat_id: groupId, user_id: userId },
            timeout: 3000 
        });
        return ["member", "administrator", "creator"].includes(res.data.result.status);
    } catch (e) { return false; }
}

app.post('/telegram_bot', async (req, res) => {
    const body = req.body;
    res.sendStatus(200); // Kena hantar cepat-cepat

    if (body.message?.document) {
        console.log("FILE ID DITERIMA: ", body.message.document.file_id);
    }

    if (body.message?.text === "/start" || body.message?.text === "/download") {
        const [join1, join3] = await Promise.all([checkDahJoin(body.message.from.id, GROUP_1_ID), checkDahJoin(body.message.from.id, GROUP_3_ID)]);
        
        if (join1 && join3) {
            axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                chat_id: body.message.chat.id,
                text: "Pilih fail:",
                reply_markup: { inline_keyboard: [[{ text: "📥 WasapBluster", callback_data: "dl_wasap" }], [{ text: "📥 FB Bluster", callback_data: "dl_fb" }]] }
            });
        }
    }

    if (body.callback_query) {
        const { id, message, data } = body.callback_query;
        axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/answerCallbackQuery`, { callback_query_id: id });

        if (data === "dl_wasap" || data === "dl_fb") {
            const fileId = (data === "dl_wasap") ? FILE_WASAP_BLUSTER : FILE_FB_BLUSTER;
            
            try {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, {
                    chat_id: message.chat.id,
                    document: fileId
                });
            } catch (err) {
                console.log("Error hantar fail:", err.response?.data?.description);
                axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: message.chat.id,
                    text: "❌ Fail gagal dihantar. Sila hubungi admin."
                });
            }
        }
    }
});

app.get('/', (req, res) => res.send("Bot Aktif!"));
app.listen(PORT);
