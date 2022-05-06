var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(get_edit_gender)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            user.other.edit_name = false;
            user.other.edit_photo = true;

            data({
                text: `<b>Выбери свой пол.</b>`,
                keyboard: [
                    [{"text": `Мужской 🧑🏻`, callback_data: "get_gender 1:1"},
                    {"text": `Женский 👩🏻`, callback_data: "get_gender 1:2"}],
                    [{"text": `Не указывать 🧸`, callback_data: "get_gender 1:0"}],
                    [{"text": `⬅️ Меню`, callback_data: "canel"}],
                ],
                delete: true
            });
            return save_user.start(chatId, user); 
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}