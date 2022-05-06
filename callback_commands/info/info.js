var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(get_edit_info)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            user.other.edit_name = false;
            user.other.edit_photo = false;
            user.other.edit_info = true;

            data({
                text: `<b>⚙️ Отправь мне готовое описание своей анкеты.</b>\n<i>Рекомендуем указать возраст, город, интересы.</i>`,
                keyboard: [
                    [{"text": `⬅️ Меню`, callback_data: "canel"}]
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