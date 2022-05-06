var get_user = require("../functions/get_user"),
    save_user = require("../functions/save_user");

module.exports = {
	r: /^(profile)$/i,
	f: function (msg, chatId, args, data) {
        get_user.start(chatId, (user) => {
            var gender_list = {
                0: `<b>не указано 🤷</b>`,
                1: `<b>мужской 🧑🏻</b>`,
                2: `<b>женский 👩🏻</b>`,
            }

            if(user.info.name == `404` && user.info.photo == `AgACAgIAAxkBAAIs7WJhKCr_WGas1oTrC_bG5oRx9Zv-AAIKujEbxKQJS9MYSn8GdBGvAQADAgADcwADJAQ`) {
                var text_plus = `\n\n<b><u>⚠️ Твоя анкета снята с показа. ⚠️</u></b>\n<i>Измени имя и фотографию, чтоб твой аккаунт смогли оценить. </i>`
            }
            if(user.other.block == true) {
                var text_plus = `\n\n<b><u>⚠️ Твоя анкета снята с показа.⚠️</u></b>\n<i>Измени фотографию, если хочешь, чтоб твой аккаунт смогли оценить.</i>`
            }

            var text_key_1 = `Скрыть 🟥`,
            callback_data_key_1 = `off_info`;


            if(user.info.info != ``) {
                if(user.info.status_info == true) {
                    var description = `\n<b>💭 Описание:</b> <i>${user.info.info}</i>`,
                    text_key_1 = ` Скрыть описание 🟥`,
                    callback_data_key_1 = `off_info`;
                } else {
                    var description = `\n🟥 Описание скрыто.`,
                    text_key_1 = ` Показать описание 🟩`,
                    callback_data_key_1 = `on_info`;
                }
            }


            data({
                text: `<b><u>💎 Твоя анкета 💎</u></b>\n<b>☘️ Имя:</b> <i>${user.info.name}</i>${description ? description : ``}\n
<b>⭐️ Средняя оценка твоей анкеты:</b> <i>${!user.evaluations.average_score.sum_of_ratings/user.evaluations.average_score.total_ratings == 0 ? (user.evaluations.average_score.sum_of_ratings/user.evaluations.average_score.total_ratings).toFixed(2) : 0}/10 (👥 ${user.evaluations.average_score.total_ratings})</i>

<b>Твой пол:</b> <i>${gender_list[user.settings_gender.my_gender]}</i>
<b>Пол который ты оцениваешь:</b> <i>${gender_list[user.settings_gender.gender_of_the_partner]}</i>${text_plus ? text_plus : ``}`,
                photo: user.info.photo,
                keyboard: [
                    [{"text": `Изменить имя 🍪`, callback_data: "get_edit_name"},
                    {"text": `Изменить фото 🖼`, callback_data: "get_edit_photo"}],
                    [{"text": `Выбор пола 🧬`, callback_data: "get_edit_gender"}],
                    [{"text": `Изменить описание 🦋`, callback_data: `get_edit_info`},
                    {"text": `${text_key_1}`, callback_data: `${callback_data_key_1}`}],
                    [{"text": `⬅️ Меню`, callback_data: "menu"}]
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