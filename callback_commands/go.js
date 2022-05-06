const { setTimeout } = require("timers");
var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user"),
    fs = require("fs");

module.exports = {
	r: /^(go)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            fs.readdir(`./users/`, (err, files) => {
                get_random_user();

                function delete_user_list(files, file) {
                    files.splice(files.indexOf(`${file}.json`), 1);
                    return get_random_user();
                }

                function get_random_user() {
                    if(files.length == 0) return data({
                        text: `<b>😳 Фотографии закончились.</b>\n\n<i>💡 Если у тебя стоит поиск по полу, попробуй изменить данный параметр, и оценить фотографии другого пола.</i>`,
                        keyboard: [
                            [{"text": `⬅️ Меню`, callback_data: `menu`}]
                        ],
                        delete_key: true,
                    });


                    var file = randArray(files);
                    file = file.replace(/.json/ig, "");

                    if(file == chatId) {
                        return delete_user_list(files, file);
                    };
                    get_user.start(file, (user_2) => {
                        if(user_2.other.block == true || user_2.info.name == "404" && user_2.info.photo == `AgACAgIAAxkBAAIs7WJhKCr_WGas1oTrC_bG5oRx9Zv-AAIKujEbxKQJS9MYSn8GdBGvAQADAgADcwADJAQ`) {
                            return delete_user_list(files, file);
                        };
                        if(user_2.info.photo == `none` || user_2.info.photo == `` || user_2.info.name == ``) {
                            return delete_user_list(files, file);
                        }

                        if(user_2.evaluations.incoming.some(a => a.id == chatId)) {
                            return delete_user_list(files, file);
                        }

                        if(user_2.info.info != `` && user_2.info.status_info == true) {
                            if(user.info.status_info == true) {
                                var text_plus = `\n<b><u>💭 Описание:</u></b> ${user_2.info.info}`
                            }
                        }

                        if((user.settings_gender.gender_of_the_partner != 0 && user.settings_gender.gender_of_the_partner == user_2.settings_gender.my_gender) || user.settings_gender.gender_of_the_partner == 0) {
                            data({
                                text: `<b><u>🦩 Имя пользователя:</u></b>  <i><a href="tg://user?id=${user_2.other.id}">${user_2.info.name}</a></i>${text_plus ? text_plus : ``}`,
                                photo: user_2.info.photo,
                                keyboard: [
                                    [{"text": `1`, callback_data: `estimation ${user_2.other.id}:1`},
                                    {"text": `2`, callback_data: `estimation ${user_2.other.id}:2`},
                                    {"text": `3`, callback_data: `estimation ${user_2.other.id}:3`},
                                    {"text": `4`, callback_data: `estimation ${user_2.other.id}:4`},
                                    {"text": `5`, callback_data: `estimation ${user_2.other.id}:5`}],
                                    [{"text": `6`, callback_data: `estimation ${user_2.other.id}:6`},
                                    {"text": `7`, callback_data: `estimation ${user_2.other.id}:7`},
                                    {"text": `8`, callback_data: `estimation ${user_2.other.id}:8`},
                                    {"text": `9`, callback_data: `estimation ${user_2.other.id}:9`},
                                    {"text": `10`, callback_data: `estimation ${user_2.other.id}:10`}],
                                    [{"text": `Пожаловаться ⚠️`, callback_data: `warn ${user_2.other.id}`}],
                                    [{"text": `⬅️ Меню`, callback_data: `menu delete`}]
                                ],
                                delete: true
                            });
                            return save_user.start(chatId, user);
                        } else {
                            return delete_user_list(files, file);
                        }
                    });
                }
            });
        });
	},
	desc: "",
	rights: 0,
	type: "all"
}

function randArray(array){
    var rand = Math.random()*array.length | 0;
    var rValue = array[rand];
    return rValue;
}