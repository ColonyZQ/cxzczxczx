var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user"),
    fs = require("fs"),
    generator = require('generate-password');

module.exports = {
	r: /^(.*)$/i,
    d: /^(\/start ?(.*)?)$/i,
	f: function (msg, chatId, args, files, data) {
        fs.access(`./users/${chatId}.json`, function(error) {
            if (error) {
                return
            } else {
                get_user.start(chatId, (user) => {
                    user.other.last_activity = new Date();
                    
                    if(user.other.edit_name == true && args) {
                        if(args[1] < 5) {
                            return data({
                                text: `<b>⚠️ Ошибка ⚠️</b>\n<i>Минимальная длина имени - 2 символа</i>`,
                                keyboard: [[{"text": `Отмена ❌`, callback_data: "canel"}]]
                            });
                        }
                        if(args[1].length > 30) {
                            return data({
                                text: `<b>⚠️ Ошибка ⚠️</b>\n<i>Максимальная длина имени - 35 символов</i>`,
                                keyboard: [[{"text": `Отмена ❌`, callback_data: "canel"}]]
                            });
                        }

                        user.other.edit_name = false;

                        args[1] = args[1].replace(/&/g, `&amp;`);
                        args[1] = args[1].replace(/</g, `&lt;`);
                        args[1] = args[1].replace(/>/g, `&gt;`);

                        user.info.name = args[1];

                        if(user.info.photo == ``) {
                            user.other.edit_photo = true;
                            data({
                                text: `<b>Имя успешно изменено ✅</b>\n\n📷 Теперь давай разберёмся с фотографией, которую будут оценивать другие люди.\n<i>💡 Отправь фотографию</i>`
                            });
                        } else {
                            data({
                                text: `<b>Имя успешно изменено ✅</b>`,
                                keyboard: [[{"text": `Анкета 👤`, callback_data: "profile"}]]
                            });
                        }
                        return save_user.start(chatId, user);
                    }

                    if(user.other.edit_info == true && args) {
                        user.other.edit_info = false;

                        args[1] = args[1].replace(/&/g, `&amp;`);
                        args[1] = args[1].replace(/</g, `&lt;`);
                        args[1] = args[1].replace(/>/g, `&gt;`);

                        user.info.info = args[1];
                        data({
                            text: `<b>Описание успешно изменено ✅</b>`,
                            keyboard: [[{"text": `Анкета 👤`, callback_data: "profile"}]]
                        });
                        return save_user.start(chatId, user);
                    }
                    

                    if(user.other.edit_photo == true) {
                        if(files.length == 0) return data({
                            text: `<b>⚠️ Ошибка ⚠️</b>\n<i>Фотография не найдена</i>`,
                            keyboard: [[{"text": `Отмена ❌`, callback_data: "canel"}]]
                        });
                        if(files.length > 1) return data({
                            text: `<b>⚠️ Ошибка ⚠️</b>\n<i>Отправь одну фотографию</i>`,
                            keyboard: [[{"text": `Отмена ❌`, callback_data: "canel"}]]
                        });
                        if(files.length == 1 && files[0].type == "photo") {
                            user.info.photo = files[0].media;
                            user.evaluations.incoming = [];
                            user.evaluations.new_incoming = [];
                            user.evaluations.average_score.sum_of_ratings = 0;
                            user.evaluations.average_score.total_ratings = 0;

                            if(user.other.block == true) {
                                user.other.block = false;

                                data({
                                    text: `<b>Твою анкету снова видят другие пользователи.</b>`
                                });
                            }

                            data({
                                text: `<b>Новая фотография установлена  ✅</b>`,
                                keyboard: [[{"text": `Анкета 👤`, callback_data: "profile"}]]
                            });
                        }
                        return save_user.start(chatId, user);
                    }
                });
            }
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}

function validateURL(textval) {
    var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(textval);
}