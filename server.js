const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";

// FAIL ID YANG SEPADAN DENGAN BOT
const FILE_WASAP_BLUSTER = "BQACAgUAAxbBAAMCAg2bf8YY-dRo94aHQ51qbbJ_YN4AAjcaAAL9zXFUSafdwiWwqu7BA";
const FILE_FB_BLUSTER = "BQACAgUAAxbBAAMIAg3jbh5txCoZnfJd2XLCDle-WoAA1AaAAL9zXFUP2bN1DqIAu47E";

// USERNAME GROUP PUBLIC UNTUK SEMAKAN SISTEM
const GROUP_1_ID = "@blustermarketingtools"; 
const GROUP_3_ID = "@marketingtoolsmy";

// 3 LINK GROUP YANG AKAN DIPAPARKAN KEPADA PELANGGAN
const LINK_GROUP_1 = "https://t.me/blustermarketingtools";
const LINK_GROUP_2 = "https://t.me/+7jhlh_mNQoRiYjM1";
const LINK_GROUP_3 = "https://t.me/marketingtoolsmy";

const PORT = process.env.PORT || 3000;

// Fungsi menyemak status keahlian kumpulan
async function checkDahJoin(userId, groupId) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${TOKEN_BOT}/getChatMember`, {
            params: { chat_id: groupId, user_id: userId }
        });
        const status = res.data.result.status;
        return ["member", "administrator", "creator"].includes(status);
    } catch (error) {
        console.error(`Gagal menyemak kumpulan ${groupId}:`, error.message);
        return false;
    }
}

app.post('/telegram_bot', async (req, res) => {
    const body = req.body;
    
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
                            [{ text: "📦 Muat Turun WasapBluster APK", callback_data: "dl_wasap" }],
                            [{ text: "🚀 Muat Turun FB Bluster APK", callback_data: "dl_fb" }]
                        ]
                    }
                });
            } else {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: chatId,
                    text: "Sila sertai (join) 3 Group/Channel Rasmi kami di bawah terlebih dahulu untuk membuka akses muat turun! 🛑",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Kumpulan 1 👥", url: LINK_GROUP_1 }],
                            [{ text: "Kumpulan 2 👥", url: LINK_GROUP_2 }],
                            [{ text: "Kumpulan 3 👥", url: LINK_GROUP_3 }],
                            [{ text: "🔄 Sudah Sertai? Klik Sini Untuk Semak", callback_data: "recheck" }]
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
                    text: "Tahniah! Anda telah menyertai semua kumpulan. Sila pilih fail untuk dimuat turun:",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "📦 Muat Turun WasapBluster APK", callback_data: "dl_wasap" }],
                            [{ text: "🚀 Muat Turun FB Bluster APK", callback_data: "dl_fb" }]
                        ]
                    }
                });
            } else {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
                    chat_id: chatId,
                    text: "❌ Anda belum menyertai semua kumpulan yang ditetapkan. Sila semak semula."
                });
            }
        }

        if (action === "dl_wasap") {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, {
                chat_id: chatId,
                document: FILE_WASAP_BLUSTER,
                caption: "Berikut adalah aplikasi WasapBluster Official yang anda minta. Sila pasang (install) pada peranti anda!"
            });
        }

        if (action === "dl_fb") {
            await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, {
                chat_id: chatId,
                document: FILE_FB_BLUSTER,
                caption: "Berikut adalah aplikasi FB Bluster Official yang anda minta. Sila pasang (install) pada peranti anda!"
            });
        }
    }

    res.status(200).send("OK");
});

app.listen(PORT, () => console.log(`Server Force Join running...`));
