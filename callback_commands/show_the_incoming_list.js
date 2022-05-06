var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user");

module.exports = {
	r: /^(show_the_incoming_list?( (.*))?)$/i,
	f: function (msg, chatId, args, data) {

        if(args[2] == " delete") {
            delete_data = true;
        } else {
            delete_data = false;
        }

        get_user.start(chatId, (user) => {
            if(user.evaluations.new_incoming.length != 0) {
                get_user.start(user.evaluations.new_incoming[0].id, (user_2) => {

                    if(user_2 == 404 || user_2.info.name == `404` || user_2.info.photo == `AgACAgIAAxkBAAIs7WJhKCr_WGas1oTrC_bG5oRx9Zv-AAIKujEbxKQJS9MYSn8GdBGvAQADAgADcwADJAQ`) {
                        user.evaluations.new_incoming.splice(0, 1);
                        save_user.start(chatId, user);
                        if(user.evaluations.new_incoming.length <= 0) {
                            return data({
                                text: `<b>🍿 Новых оценок не найдено.</b>`,
                                keyboard: [
                                    [{"text": `⬅️ Меню`, callback_data: "menu"}]
                                ],
                                delete: delete_data,
                                delete_key: true
                            });
                        }
                    }

                    data({
                        text: `👨‍🦰 Пользователь <i><a href="tg://user?id=${user_2.other.id}">${user_2.info.name}</a></i> оценил твою фотография на ${user.evaluations.new_incoming[0].estimation}/10 ⭐️`,
                        photo: user_2.info.photo,
                        keyboard: [
                            [{"text": `Дальше ➡️`, callback_data: "show_the_incoming_list"}],
                            [{"text": `⬅️ Меню`, callback_data: "menu delete"}]
                        ],
                        delete: delete_data,
                        delete_key: true
                    });
                    user.evaluations.new_incoming.splice(0, 1);
                    save_user.start(chatId, user);
                });
            } else return data({
                text: `<b>🍿 Новых оценок не найдено.</b>`,
                keyboard: [
                    [{"text": `⬅️ Меню`, callback_data: "menu"}]
                ],
                delete: delete_data,
                delete_key: true
            });
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}