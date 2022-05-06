var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(reject (.*))$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(args[2], (user) => {
            data({
                text: `<b>⚠️ Сообщение от администрации ⚠️</b>\n<i>На твой аккаунт поступила жалоба, при проверке аккаунта администрацией, факт нарушения правил обнаружен не был.</i>`,
                keyboard: [
                    [{"text": `⬅️ Меню`, callback_data: "menu delete"}]
                ],
                chatId: args[2]
            });
            data({
                text: `Готово.`,
                keyboard: [
                    [{"text": `⬅️ Меню`, callback_data: "menu delete"}]
                ],
                delete_key: true,
            });
            return save_user.start(args[2], user); 
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}
