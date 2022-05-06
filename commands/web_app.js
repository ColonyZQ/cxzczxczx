fs = require("fs"),

module.exports = {
	r: /^\/web$/i,
	f: function (msg, chatId, args, files, data) {
        console.log(`123`)
        data({
            text: `Тест WebApp бота!`,
            keyboard: [
                [{"text": `Открыть`,
                    web_app: {url: "https://atom-alive-stool.glitch.me/"}
                }]
            ],
            delete: true
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}