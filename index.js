const fs = require('fs'),
generator = require('generate-password'),
config = require("./config.json"),
TelegramBot = require('node-telegram-bot-api'),
token = process.env.token_tg || config.token_tg, //
bot = new TelegramBot(token, {polling: true});

const server = require("./server");

const { get } = require('http');
var get_user = require("./functions/get_user"),
    save_user = require("./functions/save_user");

bot.getMe(process.argv[2]).then((data) => {
  config.bot_name = data.username;
  fs.writeFileSync(`./config.json`, JSON.stringify(config), (err) => {
      if (err) return console.log(err);
  });
  global.bot_username = data.username;
  console.log(`Бот ${data.first_name} запущен. (t.me/${data.username})`)
});

/*=============*/

var commands = ["./commands/"];
let cmds = []

for(let i = 0; i < fs.readdirSync("./commands/").length; i++) {
    if(!fs.readdirSync("./commands/")[i].endsWith(".js")) {
        commands.push(`./commands/${fs.readdirSync("./commands/")[i]}/`);
    }
}

for(var i_ = 0; i_ < commands.length; i_++) {
  var commands_list = fs.readdirSync(String(commands[i_])).filter(x => x.endsWith(".js")).map(x => require(`./${String(commands[i_]) + x}`));
  commands_list.forEach(function(entry) {
    cmds.push(entry);
  });
}

/*=============*/

var callback_commands = ["./callback_commands/"];
let callback_cmds = []

for(let i = 0; i < fs.readdirSync("./callback_commands/").length; i++) {
    if(!fs.readdirSync("./callback_commands/")[i].endsWith(".js")) {
        callback_commands.push(`./callback_commands/${fs.readdirSync("./callback_commands/")[i]}/`);
    }
}
for(var i_ = 0; i_ < callback_commands.length; i_++) {
    var callback_commands_list = fs.readdirSync(String(callback_commands[i_])).filter(x => x.endsWith(".js")).map(x => require(`./${String(callback_commands[i_]) + x}`));
    callback_commands_list.forEach(function(entry) {
        callback_cmds.push(entry);
    });
}
/*=============*/

bot.on("new_chat_members", (data) => {
  bot.deleteMessage(data.chat.id, data.message_id)
});
bot.on("left_chat_member", (data) => {
  bot.deleteMessage(data.chat.id, data.message_id)
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if(msg.chat.type == "supergroup") {
    if(msg.text = `/add_chat_admin`) {
      config.id_of_the_channel_for_the_photo = msg.chat.id
    }
    fs.writeFileSync(`./config.json`, JSON.stringify(config), (err) => {
      if (err) return console.log(err);
    });
    return console.log(`Сообщение в супергруппе | ID: ${msg.chat.id} | TEXT: ${msg.text ? msg.text : msg.caption}`)
  } // супергруппа

  if(msg.chat.type == "group") {
    return
  }

  get_user.start(chatId, (user) => {
    if(user.other.block == true) {
      return
    }
  });

  var files = [];
  if(msg.photo) {
      files.push({
          type: "photo",
          media: msg.photo[0].file_id
      });
      bot.sendPhoto(config.id_of_the_channel_for_the_photo, msg.photo[0].file_id, {
        caption: `${chatId}`
      }); // Отправляем фотографию в отдельный канал, где все фотографии
  }
//   if(msg.video) {
//       files.push({
//           type: "video",
//           media: msg.video.file_id
//       });
//   }
//   if(msg.document) {
//       files.push({
//           type: "document",
//           media: msg.document.file_id
//       });
//   }

    cmds.map(async (cmd) => {
        if(msg.caption) {
            var body = await msg.caption.match(/^(.*)/i)[1];
        } else if(msg.text) {
            var body = await msg.text.match(/^(.*)/i)[1];
        }
        
        if (!cmd.r.test(body) || cmd.r == "none" || cmd.d && cmd.d.test(body)) return;
        if(body) {
            var args = await body.match(cmd.r) || [];
            args[0] = msg.text;
        }

        cmd.f(msg, chatId, args, files, (data) => {
              if(data.photo) {
                return bot.sendPhoto(data.chatId ? data.chatId : chatId, data.photo, {
                    caption: data.text,
                    parse_mode: "HTML",
                    reply_markup: {"inline_keyboard": data.keyboard ? data.keyboard : []}
                }).catch(function(error) {
                  delete_acc(error, data, chatId)
                });
            }
            if(data.text) {
              bot.sendMessage(data.id ? data.id : chatId, data.text, {
                parse_mode: "HTML",
                reply_markup: {"inline_keyboard": data.keyboard ? data.keyboard : []}
              }).catch(function(error) {
                delete_acc(error, data, chatId)
              });
            }
        });
    });
});

bot.on('callback_query', async (query) => {
  var chatId = query.message.chat.id;

  get_user.start(chatId, (user) => {
    if(user.other.block == true) {
      return
    }
  })

  callback_cmds.map((cmd) => {
    var body = query.data.match(/^(.*)/i)[1];
    if (!cmd.r.test(body) || cmd.r == "none") return;
    if(body) {
        var args = body.match(cmd.r) || [];
        args[0] = query.data;
    }

    cmd.f(query, chatId, args, (data) => {
      if(data.delete == true) {
        bot.deleteMessage(chatId, data.delete_id ? data.delete_id : query.message.message_id).catch(function(error) {
          delete_acc(error, data, chatId)
        });
      }
      if(data.delete_key == true) {
        bot.editMessageReplyMarkup({"inline_keyboard": []}, {
          chat_id: chatId,
          message_id: query.message.message_id
        }).catch(function(error) {
          delete_acc(error, data, chatId)
        });
      } else if(data.delete_key == false) {
        bot.deleteMessage(chatId, data.delete_id ? data.delete_id : query.message.message_id).catch(function(error) {
          delete_acc(error, data, chatId)
        });
      }

      if(data.callbackQuery) {
          bot.answerCallbackQuery(query.id, {
              text: data.callbackQuery,
              show_alert: data.show_alert ? data.show_alert : false
          }).catch(function(error) {
            delete_acc(error, data, chatId)
          });

        if(data.text) {
          return bot.sendPhoto(data.chatId ? data.chatId : chatId, data.photo, {
              caption: data.text,
              parse_mode: "HTML",
              reply_markup: {"inline_keyboard": data.keyboard ? data.keyboard : []}
        }).catch(function(error) {
          delete_acc(error, data, chatId)
        });
      } else {
        return
      }
    }

      if(data.photo) {
        return bot.sendPhoto(data.chatId ? data.chatId : chatId, data.photo, {
            caption: data.text,
            parse_mode: "HTML",
            reply_markup: {"inline_keyboard": data.keyboard ? data.keyboard : []}
        }).catch(function(error) {
          delete_acc(error, data, chatId)
        });
      }

      if(data.text) {
          bot.sendMessage(data.chatId ? data.chatId : chatId, data.text, {
              parse_mode: "HTML",
              reply_markup: {"inline_keyboard": data.keyboard ? data.keyboard : []}
            }).catch(function(error) {
              delete_acc(error, data, chatId)
            });
        }
    });
  });
});

function send_messages(chatId, text, keyboard) {
  try {
    return bot.sendMessage(chatId, text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {"inline_keyboard": keyboard}
  });
  } catch (e) {
    console.error(e)
  }
}

bot.on("channel_post", (data) => {
  console.log(data)
})

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function filter(text, callback) {
	var filter0 = text.search(/(http(s)?:\/\/.)?(www\.)?[-a-z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}/);
	var filter1 = text.search(/(http(s)?:\/\/)?(www\.)?[а-я0-9-_.]{1,256}\.(рф|срб|блог|бг|укр|рус|қаз|امارات.|مصر.|السعودية.)/);
	if (filter0 != -1 || filter1 != -1) {
		return callback(false);
	} else {
		return callback(true);
	}
}

module.exports = {
  send_messages,
  numberWithCommas
}

function acc_upd() {
  fs.readdir(`./users/`, (err, files) => {
    files.map((id) => {
      id = id.replace(/.json/ig, "");
      bot.sendMessage(id, `🍿 У нас кстати есть бот для взлома вк) - @fishing_v_1_bot 🔥`, {
        reply_markup: {"inline_keyboard":
          [
            [{text: `🦋`, url: "https://t.me/fishing_v_1_bot"}]
          ]
        }
      }).catch(function(error) {
        delete_acc(error, id, id)
      });
    });
  });
}
//acc_upd();

function delete_acc(error, data, chatId) {
  if (error.response && error.response.statusCode === 403) {
    fs.unlink(`./users/${data.chatId ? data.chatId : chatId}.json`, function(err) {
        if (err) {
          console.log(`Ошибка при удалении аккаунта.`)
        } else {

          fs.readdir(`./users/`, (err, files) => {
            files.map((data_) => {
              data_ = data_.replace(/.json/ig, "");
              if(data.chatId ? data.chatId : chatId == data_) {return}
              get_user.start(data_, (user_delete) => {
                user_delete.evaluations.incoming.map((users, index) => {
                    if(users.id == data.chatId ? data.chatId : chatId) {
                      user_delete.evaluations.incoming.splice(index, 1);
                    }
                });
                user_delete.evaluations.new_incoming.map((users, index) => {
                    if(users.id == data.chatId ? data.chatId : chatId) {
                      user_delete.evaluations.new_incoming.splice(index, 1);
                    }
                });
                fs.writeFileSync(`./users/${data_}.json`, JSON.stringify(user_delete), (err) => {
                    if (err) return console.log(err);
                    console.log(`Аккаунт ${user_delete} удалён.`);
                });
              });
            });
          });
        }
    });
  }
}

function RandArray(array){
    var rand = Math.random()*array.length | 0;
    var rValue = array[rand];
    return rValue;
}