fs = require("fs"),

module.exports = {
	r: /^\/rules$/i,
	f: function (msg, chatId, args, files, data) {
        data({
            text: `<b><u>❌ За что можно получить бан? 👇</u></b>\n\n🔞 Фото содержащие 18+ ( насилие, кровь и т.п ) [Эротика исключение]\n🗣 Фото содержащие матерные слова, высказывания, разжигание международный розни\n🐒 Попрошайничество, номера карт на фото\n🐁 Реклама всего чего угодно, сайтов, каналов, групп и т.д`,
            keyboard: [
                [{"text": `Помощь 📖`, callback_data: "help"}],
                [{"text": `⬅️ Меню`, callback_data: "menu"}]
            ],
            delete: true
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}