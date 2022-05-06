var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(block (.*))$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(args[2], (user) => {
            data({
                text: `<b>⚠️ Сообщение от администрации ⚠️</b>\n<i>На твой аккаунт поступила жалоба, при проверке аккаунта администрацией, факт нарушения правил был действительно обнаружен, и <u>нам пришлось заблокировать твой аккаунт на постоянной основе.</u></i>`,
                chatId: args[2]
            });
            user.info.photo = `AgACAgIAAxkBAAIs7WJhKCr_WGas1oTrC_bG5oRx9Zv-AAIKujEbxKQJS9MYSn8GdBGvAQADAgADcwADJAQ`;
            user.info.name = `404`;
            user.evaluations.incoming = [];
            user.evaluations.new_incoming = [];
            user.evaluations.average_score.sum_of_ratings = 0;
            user.evaluations.average_score.total_ratings = 0;
            user.other.block = true;
            
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
