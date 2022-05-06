var get_user = require("../../functions/get_user"),
    save_user = require("../../functions/save_user"),
    fs = require("fs"),
    generator = require('generate-password');

module.exports = {
	r: /^\/start$/i,
	f: function (msg, chatId, args, files, data) {
        fs.access(`./users/${chatId}.json`, function(error) {
            if (error) {
                fs.open(`./users/${chatId}.json`, 'w', (err) => {
                    var file = {
                        info: {
                            name: ``, //Имя
                            photo: ``, //Фотография
                            info: ``, //Описание
                            status_info: false //Отоброжение описания
                        },
                        evaluations: {
                            incoming: [], //Оценки меня
                            new_incoming: [],
                            outgoing: [], //Мои оценки
                            average_score: {
                                sum_of_ratings: 0, //суммарное число
                                total_ratings: 0 //всего оценок
                            }
                        },
                        settings_gender: {
                            my_gender: 0, //Мой пол
                            gender_of_the_partner: 0, //Пол человека которого оцениваю я
                        },
                        other: {
                            id: chatId, //ID чата
                            edit_name: true, //Смена имени
                            edit_photo: false, //Смена фотографии
                            edit_info: false, //Смена города
                            past_message: 0, //Последнее сообщение
                            code_pay: generator.generate({length: 10, numbers: false}), //Код для оплаты чего либо
                            last_activity: new Date(), //Последняя активность
                            block: false,
                            warning: 0,
                            ban: false
                        }
                    }

                    fs.writeFile(`./users/${chatId}.json`, JSON.stringify(file), function writeJSON(err) {});
                    return data({
                        text: `👻 Приветствуем тебя в боте, в котором ты сможешь узнать на сколько оценят твою внешность от 1 до 10, и оценить других.\n\n<b>🦋 Для начала давай разберёмся с твоим именем</b>\n<i>💡 Отправь своё имя</i>`
                    });
                })
            } else {
                get_user.start(chatId, (user) => {
                    data({
                        text: `<b><u>${user.info.name}</u></b>, сейчас ты находишься в меню.\n\n<i>Здесь ты можешь посмотреть свою анкету, оценить других пользователей, и посмотреть как другие пользователи оценили тебя.</i>`,
                        photo: user.info.photo,
                        keyboard: [
                            [{"text": `Анкета 👤`, callback_data: "profile"}],
                            [{"text": `Оценивать 🔎`, callback_data: "go"}],
                            [{"text": `Кто меня оценил? 📨`, callback_data: "show_the_incoming_list"}]
                        ],
                        delete: true
                    })
                    return save_user.start(chatId, user);
                });
            }
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}