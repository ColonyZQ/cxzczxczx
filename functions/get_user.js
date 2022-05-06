const fs = require("fs"),
generator = require('generate-password');


function createUSER(id, callback) {
    var file = {
        info: {
            name: `404`, //Имя
            photo: `AgACAgIAAxkBAAIs7WJhKCr_WGas1oTrC_bG5oRx9Zv-AAIKujEbxKQJS9MYSn8GdBGvAQADAgADcwADJAQ`, //Фотография
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
            id: id, //ID чата
            edit_name: true, //Смена имени
            edit_photo: false,//Смена фотографии
            edit_info: false, //Смена города
            past_message: 0, //Последнее сообщение
            code_pay: generator.generate({length: 10, numbers: false}), //Код для оплаты чего либо
            last_activity: new Date(), //Последняя активность
            block: false,
            warning: 0,
            ban: false
        }
    }
    fs.writeFile(`./users/${id}.json`, JSON.stringify(file), function writeJSON(err) {
        return start(id, callback);
    });
}


function receiving_a_message(id, callback, error) {
    if(error) {
        createUSER(id, callback);
    } else {
        try {
            callback(JSON.parse(fs.readFileSync(`./users/${id}.json`, 'utf8')));
        } catch (err) {
            if(err) {
                console.log(`Ошибка в get_users [0]| ${id}`)
                console.log(err)
                createUSER(id, callback);
            }
        }
    }
}

function start(id, callback) {
    fs.access(`./users/${id}.json`, function(error) {
        if (!error) {
            receiving_a_message(id, callback);
        } else {
            console.log(`Ошибка в get_users  [1]| ${id}`)
            console.log(error);
            receiving_a_message(id, callback, error);
        }
    });
    
}

module.exports = {
    start
}