var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(rules)$/i,
	f: function (msg, chatId, args, data) {
        data({
            text: `<b><u>❌ За что можно получить бан? 👇</u></b>\n\n💣 Не оригинальное фото (мемы, картинки с интернета, и т.д)\n🔞 Фото содержащие 18+ (эротика, насилие, кровь и т.п )\n🗣 Фото содержащие матерные слова, высказывания, разжигание международный розни\n🐒 Попрошайничество, номера карт на фото\n🐁 Реклама всего чего угодно, сайтов, каналов, групп и т.д`,
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
