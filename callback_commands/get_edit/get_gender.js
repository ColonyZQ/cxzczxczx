var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(get_gender (.*):(.*))$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            user.other.edit_name = false;
            user.other.edit_photo = false;

            if(args[2] == 1) {
                user.settings_gender.my_gender = args[3];
                data({
                    text: `<b>Готово!\n\nВыбери пол который <u>ты</u> хочешь оценивать.</b>`,
                    keyboard: [
                        [{"text": `Мужской 🧑🏻`, callback_data: "get_gender 2:1"},
                        {"text": `Женский 👩🏻`, callback_data: "get_gender 2:2"}],
                        [{"text": `Не указывать 🧸`, callback_data: "get_gender 2:0"}],
                        [{"text": `⬅️ Меню`, callback_data: "canel"}],
                    ],
                    delete: true
                });
            }
            if(args[2] == 2) {
                user.settings_gender.gender_of_the_partner = args[3];
                data({
                    text: `<b>Готово!</b>`,
                    keyboard: [
                        [{"text": `Анкета 👤`, callback_data: "profile"}]
                    ],
                    delete: true
                });
            }

            return save_user.start(chatId, user); 
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}