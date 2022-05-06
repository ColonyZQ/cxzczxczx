var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(on_info)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            user.info.status_info = true;

            data({
                text: `<b>⚙️ Описание твоей анкеты опять показывается.</b>\n<i>Ты можешь выключить отображения описания в любой момент.</i>`,
                keyboard: [
                    [{"text": `Скрыть описание 🟥`, callback_data: "off_info"}],
                    [{"text": `Изменить описание 🦋`, callback_data: `get_edit_info`}],
                    [{"text": `Анкета 👤`, callback_data: "profile"}]
                ],
                delete: true
            })
            return save_user.start(chatId, user); 
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}