var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(get_edit_name)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            user.other.edit_name = true;
            user.other.edit_photo = false;

            data({
                text: `<b>⚙️ Отправь мне своё новое имя, которое будет отображаться в анкете:</b>`,
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