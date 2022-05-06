var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user");

module.exports = {
	r: /^(menu?( (.*))?)$/i,
	f: function (msg, chatId, args, data) {
        if(args[2] == " delete") {
            delete_key = true;
        } else {
            delete_key = false;
        }
        get_user.start(chatId, (user) => {
            data({
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
                delete_key: delete_key
            })
            return save_user.start(chatId, user);
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}