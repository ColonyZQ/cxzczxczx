var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(alert (.*))$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(args[2], (user) => {
            data({
                text: `<b>⚠️ Сообщение от администрации ⚠️</b>\n<i>На твой аккаунт поступила жалоба, при проверке аккаунта администрацией, факт нарушения правил был действительно обнаружен.\nСейчас тебе повезло, и ты получил предупреждение. В дальнейшем за нарушение правил, ты можешь получить блокировку.</i>\n\n<u>🔒 Имя и фотография были сброшены.</u>\n<b>🪧 Ознакомься с правилами, кнопка на правила находится ниже.</b>`,
                keyboard: [
                    [{"text": `Правила 📚`, callback_data: `rules`}],
                    [{"text": `⬅️ Меню`, callback_data: "menu  delete"}]
                ],
                chatId: args[2]
            });

            user.info.photo = `AgACAgIAAxkBAAIs7WJhKCr_WGas1oTrC_bG5oRx9Zv-AAIKujEbxKQJS9MYSn8GdBGvAQADAgADcwADJAQ`;
            user.info.name = `404`;
            user.evaluations.incoming = [];
            user.evaluations.new_incoming = [];
            user.evaluations.average_score.sum_of_ratings = 0;
            user.evaluations.average_score.total_ratings = 0;
            user.other.warning += 1;

            data({
                text: `Готово.`,
                keyboard: [
                    [{"text": `⬅️ Меню`, callback_data: "menu delete"}]
                ],
                delete_key: true
            });
            return save_user.start(args[2], user); 
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}
