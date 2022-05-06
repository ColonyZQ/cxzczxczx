var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(get_edit_photo)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            user.other.edit_name = false;
            user.other.edit_photo = true;

            data({
                text: `<b><u>⚠️ Ты точно хочешь поменять фотографию? ⚠️</u></b>\n<i>При смене фотографии, твоя оценка обнулится.</i>\n\n<i>⚙️ Если ты уверен, отправляй новую фотографию.</i>`,
                keyboard: [
                    [{"text": `⬅️ Меню`, callback_data: "canel"}]
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