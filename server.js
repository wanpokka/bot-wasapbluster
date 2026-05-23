const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";

// ID FAIL
const FILE_WASAP_BLUSTER = "BQACAgUAAxkBAANBahBBVWgPsr9wxflGS5lj6Uj7wmkAAuwfAAKvwIBUEO_QLK2pENE7BA";
const FILE_FB_BLUSTER = "BQACAgUAAxkBAANAahBBVZwLHMKxw6boQXS1zOJNFu0AAusfAAKvwIBUglgn-gVguCQ7BA";

// GROUP/CHANNEL ID
const GROUP_1_ID = "@blustermarketingtools"; 
const GROUP_3_ID = "@marketingtoolsmy";

const LINK_GROUP_1 = "https://t.me/blustermarketingtools";
const LINK_GROUP_2 = "https://t.me/+7jhlh_mNQoRiYjM1";
const LINK_GROUP_3 = "https://t.me/marketingtoolsmy";

const PORT = process.env.PORT || 3000;

// FUNGSI ANTI-SLEEP
setInterval(() => {
    axios.get(`https://bot-wasapbluster.onrender.com/`).catch(() => {});
}, 300000); 

async function checkDahJoin(userId, groupId) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${TOKEN_BOT}/getChatMember`, {
            params: { chat_id: groupId, user_id: userId }
        });
        const status = res.data.result.status;
        return ["member", "administrator", "creator"].includes(status);
    } catch (error) { return false; }
}

app.post('/telegram_bot', async (req, res) => {
    const body = req.body;
    res.sendStatus(200);

    if (body.message?.document) {
        console.log("FILE ID DITERIMA: ", body.message.document.file_id);
    }
    
    if (body.message && body.message.text) {
        const chatId = body.message.chat.id;
        const userId = body.message.from.id;
        const text = body.message.text;

        if (text === "/start" || text === "/download") {
            const join1 = await checkDahJoin(userId, GROUP_1_ID);
            const join3 = await checkDahJoin(userId, GROUP_3_ID);

            if (join1 && join3) {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: chatId,
                    text: "Terima kasih kerana melengkapkan syarat! Sila pilih fail untuk dimuat turun 👇",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📥 Muat Turun WasapBluster APK", callback_data: "dl_wasap" }],
                            [{ text: "📥 Muat Turun FB Bluster APK", callback_data: "dl_fb" }]
                        ]
                    }
                });
            } else {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: chatId,
                    text: "Sila join link di bawah terlebih dahulu untuk membuka akses muat turun! 🚫",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Group 💬", url: LINK_GROUP_1 }],
                            [{ text: "Backup 📢", url: LINK_GROUP_2 }],
                            [{ text: "Channel 📢", url: LINK_GROUP_3 }],
                            [{ text: "🔄 Sudah Join? Klik Sini Untuk Semak", callback_data: "recheck" }]
                        ]
                    }
                });
            }
        }
    }

    if (body.callback_query) {
        const callbackId = body.callback_query.id;
        const chatId = body.callback_query.message.chat.id;
        const userId = body.callback_query.from.id;
        const action = body.callback_query.data;

        await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/answerCallbackQuery`, { callback_query_id: callbackId });

        if (action === "recheck") {
            const join1 = await checkDahJoin(userId, GROUP_1_ID);
            const join3 = await checkDahJoin(userId, GROUP_3_ID);

            if (join1 && join3) {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: chatId,
                    text: "Tahniah! Anda telah join semua group & channel. Sila pilih fail untuk dimuat turun:",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📥 Muat Turun WasapBluster APK", callback_data: "dl_wasap" }],
                            [{ text: "📥 Muat Turun FB Bluster APK", callback_data: "dl_fb" }]
                        ]
                    }
                });
            } else {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: chatId,
                    text: "❌ Anda belum join group & channel yang ditetapkan. Sila semak semula."
                });
            }
        }

        if (action === "dl_wasap") {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, {
                chat_id: chatId,
                document: FILE_WASAP_BLUSTER,
                caption: "Berikut adalah aplikasi Wasap Bluster Official yang anda minta. Sila pasang (install) pada peranti anda. Allow permission yang diperlukan. TQ!\n\nUntuk trial boleh PM @blusterCS"
            });
        }

        if (action === "dl_fb") {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, {
                chat_id: chatId,
                document: FILE_FB_BLUSTER,
                caption: "Berikut adalah aplikasi FB Bluster Official yang anda minta. Sila pasang (install) pada peranti anda. Allow permission yang diperlukan. TQ!\n\nUntuk trial boleh PM @blusterCS"
            });
        }
    }

    res.status(200).send("OK");
});

// Bahagian yang diubah supaya cron-job tak error
app.get('/', (req, res) => res.sendStatus(200));

app.listen(PORT, () => console.log(`Server Force Join running on port ${PORT}...`));
