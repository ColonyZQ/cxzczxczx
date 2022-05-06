var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user");

module.exports = {
	r: /^(canel)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            if(user.other.edit_name == true) {
                user.other.edit_name = false;
            }

            if(user.other.edit_photo == true) {
                user.other.edit_photo = false;
            }

            if(user.other.edit_info == true) {
                user.other.edit_info = false;
            }

            data({
                callbackQuery: `Отменено`,
                text: `<b><u>${user.info.name}</u></b>, сейчас ты находишься в меню.\n\n<i>Здесь ты можешь посмотреть свою анкету, оценить других пользователей, и посмотреть как другие пользователи оценили тебя.</i>`,
                photo: user.info.photo,
                keyboard: [
                    [{"text": `Анкета 👤`, callback_data: "profile"}],
                    [{"text": `Оценивать 🔎`, callback_data: "go"}],
                    [{"text": `Кто меня оценил? 📨`, callback_data: "show_the_incoming_list"}],
                    [{"text": `Помощь 📖`, callback_data: "help"},
                    {"text": `Правила 🗒`, callback_data: "rules"}],
                    [{"text": `Статистика 📊`, callback_data: "stats"}],
                    [{"text": `Обратная связь`, url: "https://t.me/darknetfox"}]
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