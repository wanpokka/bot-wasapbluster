const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";
// ID yang hang dapat dari log tadi
const FILE_WASAP_BLUSTER = "BQACAgUAAxkBAANPAheZOKAMfugGP3udrtQkai04G3hOAahoAAIUIU1UOZlP7H0vE50"; 
const FILE_FB_BLUSTER = "BQACAgUAAxkBAANPAheZOKAMfugGP3udrtQkai04G3hOAahoAAIUIU1UOZlP7H0vE50"; 

const GROUP_1_ID = "@blustermarketingtools"; 
const GROUP_3_ID = "@marketingtoolsmy";

const LINK_GROUP_1 = "https://t.me/blustermarketingtools";
const LINK_GROUP_2 = "https://t.me/+7jhlh_mNQoRiYjM1";
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
    
    // Log untuk pancing ID (boleh kekal)
    if (body.message && body.message.document) {
        console.log("FILE ID TERBARU: ", body.message.document.file_id);
    }

    if (!body.message && !body.callback_query) return res.sendStatus(200);
    res.sendStatus(200);

    if (body.message?.text === "/start" || body.message?.text === "/download") {
        const chatId = body.message.chat.id;
        const userId = body.message.from.id;
        const [join1, join3] = await Promise.all([
            checkDahJoin(userId, GROUP_1_ID),
            checkDahJoin(userId, GROUP_3_ID)
        ]);

        if (join1 && join3) {
            axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                chat_id: chatId,
                text: "Terima kasih! Sila pilih fail untuk dimuat turun:",
                reply_markup: { inline_keyboard: [[{ text: "📥 WasapBluster", callback_data: "dl_wasap" }], [{ text: "📥 FB Bluster", callback_data: "dl_fb" }]] }
            });
        } else {
            axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                chat_id: chatId,
                text: "Sila join link di bawah untuk akses muat turun: 🚫",
                reply_markup: { inline_keyboard: [[{ text: "Group 💬", url: LINK_GROUP_1 }], [{ text: "Backup 📢", url: LINK_GROUP_2 }], [{ text: "Channel 📢", url: LINK_GROUP_3 }], [{ text: "🔄 Semak", callback_data: "recheck" }]] }
            });
        }
    }

    if (body.callback_query) {
        const { id, from, message, data } = body.callback_query;
        axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/answerCallbackQuery`, { callback_query_id: id });

        if (data === "recheck") {
            const [j1, j3] = await Promise.all([checkDahJoin(from.id, GROUP_1_ID), checkDahJoin(from.id, GROUP_3_ID)]);
            if (j1 && j3) {
                axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: message.chat.id,
                    text: "Mantap! Sila pilih fail:",
                    reply_markup: { inline_keyboard: [[{ text: "📥 WasapBluster", callback_data: "dl_wasap" }], [{ text: "📥 FB Bluster", callback_data: "dl_fb" }]] }
                });
            } else {
                axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, { chat_id: message.chat.id, text: "❌ Belum join semua link lagi." });
            }
        }

        if (data === "dl_wasap") axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, { chat_id: message.chat.id, document: FILE_WASAP_BLUSTER, caption: "Wasap Bluster Official. Untuk trial boleh PM @blusterCS" });
        if (data === "dl_fb") axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, { chat_id: message.chat.id, document: FILE_FB_BLUSTER, caption: "FB Bluster Official. Untuk trial boleh PM @blusterCS" });
    }
});

// Endpoint untuk elak Render tidur (Ping setiap 5 minit)
app.get('/', (req, res) => res.send("Bot Aktif!"));

// Ping diri sendiri setiap 5 minit untuk elak bot 'tidur'
setInterval(async () => {
    try {
        await axios.get(`https://bot-wasapbluster.onrender.com/`);
        console.log("Bot masih segar! (Ping berjaya)");
    } catch (err) {
        console.error("Error masa ping:", err.message);
    }
}, 300000); // 300,000ms = 5 minit

app.listen(PORT);
