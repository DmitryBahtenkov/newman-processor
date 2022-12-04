const telegraf = require('telegraf');
const token = process.env.TELEGRAM_TOKEN;
const chat = process.env.TELEGRAM_CHAT;
const bot = new telegraf.Telegraf(token)

const sendMessage = async (message) => {
    try {
        await bot.telegram.sendMessage(chat, message);
    } catch (e) {
        console.error(e);
        throw {message: 'telegram error', data: e}
    }
}

module.exports = sendMessage;