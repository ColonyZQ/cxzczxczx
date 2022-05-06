var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user");

module.exports = {
	r: /^(warn (.*))$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(args[2], (user) => {

            if(user.info.info != ``) {
                if(user.info.status_info == true) {
                    var description = `\n<b>💭 Описание:</b> <i>${user.info.info}</i>`;
                }
            }


            data({
                text: `<b>❌ Новая жалоба ❌</b>\n\n<b>Имя:</b> <i>${user.info.name}</i>${description ? description : ``}\n[ID: <code>${user.other.id}</code>]\n<b>💬 Предупреждений:</b> <i>${user.other.warning}</i>`,
                photo: user.info.photo,
                keyboard: [
                    [{"text": `Отклонить 🎈`, callback_data: `reject ${args[2]}`}],
                    [{"text": `Предупредить 🛡`, callback_data: `alert ${args[2]}`}],
                    [{"text": `Заблокировать ✂️`, callback_data: `block ${args[2]}`}],
                    [{"text": `⬅️ Меню`, callback_data: "menu delete"}]
                ],
                chatId: 343783264
            })
            
            data({
                callbackQuery: `Жалоба отправлена`
            })

            return save_user.start(args[2], user); 
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}
