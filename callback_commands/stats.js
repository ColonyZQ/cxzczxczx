var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user"),
    fs = require("fs");

module.exports = {
	r: /^(stats)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            var Date1 = new Date (2022, 3, 20),
            Date2 = new Date(),
            Days = Math.floor((Date2.getTime() - Date1.getTime())/(1000*60*60*24));

            fs.readdir(`./users/`, (err, files) => {
                data({
                    text: `<u>Статистика по боту</u>
<b>🔥 Активные пользователи:</b> ${files.length}
<b>🍪 Дата старта:</b> 19 апреля 2022г. | ${Days} 📅`,
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