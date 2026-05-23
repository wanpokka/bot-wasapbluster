const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";

// ID YANG ANDA BERIKAN
const FILE_WASAP_BLUSTER = "BQACAgUAAxkBAANBahBBVWgPsr9wxflGS5lj6Uj7wmkAAuwfAAKvwIBUEO_QLK2pENE7BA";
const FILE_FB_BLUSTER = "BQACAgUAAxkBAANAahBBVZwLHMKxw6boQXS1zOJNFu0AAusfAAKvwIBUglgn-gVguCQ7BA";

const GROUP_1_ID = "@blustermarketingtools"; 
const GROUP_3_ID = "@marketingtoolsmy";

const LINK_GROUP_1 = "https://t.me/blustermarketingtools";
const LINK_GROUP_2 = "https://t.me/+7jhlh_mNQoRiYjM1";
const LINK_GROUP_3 = "https://t.me/marketingtoolsmy";

const PORT = process.env.PORT || 3000;

async function checkDahJoin(userId, groupId) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${TOKEN_BOT}/getChatMember`, {
            params: { chat_id: groupId, user_id: userId }
        });
        return ["member", "administrator", "creator"].includes(res.data.result.status);
    } catch (error) {
        return false;
    }
}

app.post('/telegram_bot', async (req, res) => {
    const body = req.body;
    res.sendStatus(200);

    if (body.message?.text === "/start" || body.message?.text === "/download") {
        const userId = body.message.from.id;
        const [join1, join3] = await Promise.all([checkDahJoin(userId, GROUP_1_ID), checkDahJoin(userId, GROUP_3_ID)]);
        
        if (join1 && join3) {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                chat_id: body.message.chat.id,
                text: "Terima kasih! Sila pilih fail untuk dimuat turun 👇",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📥 Muat Turun WasapBluster APK", callback_data: "dl_wasap" }],
                        [{ text: "📥 Muat Turun FB Bluster APK", callback_data: "dl_fb" }]
                    ]
                }
            });
        } else {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                chat_id: body.message.chat.id,
                text: "Sila sertai saluran untuk akses muat turun:",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Group 💬", url: LINK_GROUP_1 }],
                        [{ text: "Channel 📢", url: LINK_GROUP_3 }],
                        [{ text: "🔄 Semak", callback_data: "recheck" }]
                    ]
                }
            });
        }
    }

    if (body.callback_query) {
        const { id, message, data } = body.callback_query;
        await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/answerCallbackQuery`, { callback_query_id: id });

        if (data === "dl_wasap") {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, { 
                chat_id: message.chat.id, 
                document: FILE_WASAP_BLUSTER,
                caption: "WasapBluster Official. Untuk trial boleh PM @blusterCS"
            });
        } else if (data === "dl_fb") {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, { 
                chat_id: message.chat.id, 
                document: FILE_FB_BLUSTER,
                caption: "FB Bluster Official. Untuk trial boleh PM @blusterCS"
            });
        }
    }
});

app.get('/', (req, res) => res.send("Bot Aktif!"));
app.listen(PORT);
