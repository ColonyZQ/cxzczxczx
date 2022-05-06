var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user"),
    fs = require("fs");

module.exports = {
	r: /^(top)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {

            fs.readdir(`./users/`, (err, files) => {
                data({
                    text: ``,
                    keyboard: [
                        [{"text": `⬅️ Меню`, callback_data: "menu"}]
                    ],
                    delete: true
                });
            });

            return save_user.start(chatId, user);
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}