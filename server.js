const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_BOT = "8649706104:AAGFM_z-PTV2QZH3fhWZ2MkDROR2J-1Fcdk";

const FILE_WASAP_BLUSTER = "BQACAgUAAxbBAAMCAg2bf8YY-dRo94aHQ51qbbJ_YN4AAjcaAAL9zXFUSafdwiWwqu7BA";
const FILE_FB_BLUSTER = "BQACAgUAAxbBAAMIAg3jbh5txCoZnfJd2XLCDle-WoAA1AaAAL9zXFUP2bN1DqIAu47E";

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
    
    // Log setiap mesej masuk untuk tengok apa yang bot terima
    console.log("Mesej Diterima:", JSON.stringify(body, null, 2));

    if (body.callback_query) {
        const callbackId = body.callback_query.id;
        const chatId = body.callback_query.message.chat.id;
        const action = body.callback_query.data;

        await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/answerCallbackQuery`, { callback_query_id: callbackId });

        console.log("Butang ditekan:", action);

        if (action === "dl_wasap") {
            try {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, {
                    chat_id: chatId,
                    document: FILE_WASAP_BLUSTER,
                    caption: "Berikut adalah aplikasi WasapBluster Official yang anda minta. Sila pasang (install) pada peranti anda!\n\nUntuk trial boleh PM @blusterCS"
                });
                console.log("WasapBluster berjaya dihantar.");
            } catch (err) {
                console.error("Gagal hantar WasapBluster:", err.response ? err.response.data : err.message);
            }
        }

        if (action === "dl_fb") {
            try {
                await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendDocument`, {
                    chat_id: chatId,
                    document: FILE_FB_BLUSTER,
                    caption: "Berikut adalah aplikasi FB Bluster Official yang anda minta. Sila pasang (install) pada peranti anda!\n\nUntuk trial boleh PM @blusterCS"
                });
                console.log("FB Bluster berjaya dihantar.");
            } catch (err) {
                console.error("Gagal hantar FB Bluster:", err.response ? err.response.data : err.message);
            }
        }
    }
    res.status(200).send("OK");
});

app.listen(PORT, () => console.log(`Server aktif pada port ${PORT}`));
            
