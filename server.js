const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";

// GANTI ID DI BAWAH INI DENGAN ID YANG HANG DAPAT DARI LOG TADI
const FILE_WASAP_BLUSTER = "MASUKKAN_ID_WASAP_DI_SINI"; 
const FILE_FB_BLUSTER = "MASUKKAN_ID_FB_DI_SINI"; 

const GROUP_1_ID = "@blustermarketingtools"; 
const GROUP_3_ID = "@marketingtoolsmy";

const LINK_GROUP_1 = "https://t.me/blustermarketingtools";
const LINK_GROUP_3 = "https://t.me/marketingtoolsmy";

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
    res.sendStatus(200);

    if (body.message?.text === "/start" || body.message?.text === "/download") {
        const [join1, join3] = await Promise.all([checkDahJoin(body.message.from.id, GROUP_1_ID), checkDahJoin(body.message.from.id, GROUP_3_ID)]);
        
        if (join1 && join3) {
            axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                chat_id: body.message.chat.id,
                text: "Terima kasih! Sila pilih fail:",
                reply_markup: { inline_keyboard: [[{ text: "📥 WasapBluster", callback_data: "dl_wasap" }], [{ text: "📥 FB Bluster", callback_data: "dl_fb" }]] }
            });
        }
    }

    if (body.callback_query) {
        const { id, message, data } = body.callback_query;
        axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/answerCallbackQuery`, { callback_query_id: id });

        if (data === "dl_wasap") {
            axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, { chat_id: message.chat.id, document: FILE_WASAP_BLUSTER });
        } else if (data === "dl_fb") {
            axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, { chat_id: message.chat.id, document: FILE_FB_BLUSTER });
        }
    }
});

app.get('/', (req, res) => res.send("Bot Aktif!"));
app.listen(PORT);
