var fs=require('fs');const Discord=require('discord.js');const Bot=new Discord.Client();var config=JSON.parse(fs.readFileSync('configs.json','utf8'));var XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest;var commands_list=JSON.parse(fs.readFileSync('commands.json','utf8'));var server={"name":"","id":""}
function log(t){console.log("[INFO] "+t)}
Bot.login(process.env.BOT_TOKEN);Bot.on('ready',()=>{Bot.user.setActivity(';help | ;info',{type:"STREAMING"});log('Bot started successful')});Bot.on('message',async(message)=>{server.name=message.guild.name;server.id=message.guild.id;if(!config[server.id]){config[server.id]=new Object;config[server.id].prefix=";";config[server.id].botchannel="*";fs.writeFileSync('configs.json',JSON.stringify(config));message.channel.send("Похоже, этого бота ранее не было на вашем сервере. Были установлены параметры по умолчанию. Для помощи - ;help")}
var prefix=config[server.id].prefix;var channel=config[server.id].botchannel;var msg=message.content.slice(prefix.length).split(' ')[0];var args=message.content.slice(prefix.length).split(' ');if(message.author.bot||!message.guild||!message.content.startsWith(prefix))return!1;if(String(message.channel.id)!=channel&&channel!="*"){message.reply("Вы пишите не в том текстовом канале. Лучше перейдите в <#"+channel+">");return!1}
switch(msg){case "help":if(args.splice(1)[0]){var cmd=commands_list[message.content.slice(prefix.length).split(' ').splice(1)[0]];message.channel.send("`"+cmd.usage.replace('p%',prefix)+": "+cmd.description+"\nНапример: "+cmd.example.replace('p%',prefix)+"`")}else{var reply="`Список всех возможных команд бота:\n";for(var i in commands_list){reply+=commands_list[i].usage.replace('p%',prefix)+": "+commands_list[i].description+"\n"}
message.channel.send(reply+"`")}
break;case "info":message.channel.send("Бот создан PHP-Мастером.\nТакже вы можете посетить сайт создателя ( http://www.flomaster.ga/ ).");break;case "online":var req=new XMLHttpRequest();req.open('GET','https://api.vime.world/online/staff',!1);req.send();if(req.status==200)
var data=JSON.parse(req.responseText);var onln=new Discord.RichEmbed().setColor("#00bfff").setTitle('Модераторы онлайн').setFooter('Всего модераторов онлайн: '+data.length);for(var i=0;i<data.length;i++){onln.addField("["+data[i].rank+"] "+data[i].username,data[i].online.message)}
message.channel.send(onln);break;case "streams":var req=new XMLHttpRequest();var strms=new Discord.RichEmbed().setColor("#00bfff").setTitle('Список стримов');req.open('GET','https://api.vime.world/online/streams',!1);req.send();if(req.status==200)
var data=JSON.parse(req.responseText);for(var i=0;i<data.length;i++){strms.addField(data[i].title,data[i].url,!0).setFooter('Всего стримов: '+data.length)}
message.channel.send(strms);break;case "players":var req=new XMLHttpRequest();var streams='';req.open('GET','https://api.vime.world/online',!1);req.send();if(req.status==200)
var data=JSON.parse(req.responseText);var s=data.separated;var online=new Discord.RichEmbed().setTitle("Всего игроков онлайн: "+data.total,".",!0).setColor("#00bfff").addField("BedWars",s.bw,!0).addField("SkyWars",s.sw,!0).addField("Annihilation",s.ann,!0).addField("BuildBattle",s.bb,!0).addField("GunGame",s.gg,!0).addField("MobWars",s.mw,!0).addField("KitPVP",s.kpvp,!0).addField("DeathRun",s.dr,!0).addField("BlockParty",s.bp,!0).addField("HungerGames",s.hg,!0).setFooter("Игроков в лобби: "+s.lobby);message.channel.send(online);break;case "test":const variants=["Бот работает, всё хорошо :ok_hand: !","Что ты пишешь, я работаю.",":skull: , ха, шутка. Всё хорошо","**ERROR №505 BAD GATEWAY**, ха я опять пошутил.","Эта команда работает, прикиньте!","Хромосомы мутятся, бот работает стабильно и хорошо","로봇 은 잘 작동합니다!","Я всегда возвращаюсь"];const rand=Math.round(Math.random()*variants.length);message.channel.send(variants[rand]);break;case "stats":args[1]=args.splice(1).join(' ');var req=new XMLHttpRequest();req.open('GET','http://api.vime.world/user/name/'+args[1],!1);req.send();if(req.status==200)
var data=JSON.parse(req.responseText)[0];if(!data){message.channel.send("Игрок не найден :(");return!1}
var req=new XMLHttpRequest();req.open('GET','http://api.vime.world/user/'+data.id+'/session',!1);req.send();if(req.status==200)
var data1=JSON.parse(req.responseText);var stats=new Discord.RichEmbed().setTitle('Информация об игроке '+data.username).setColor('#00bfff').addField('Ранг:',data.rank).addField('Уровень:',data.level).addField('Гильдия:',data.guild?"Состоит в гильдии "+data.guild.name:"Не состоит в гильдии").addField('Время игры:',"Сыграно около "+Math.round(data.playedSeconds/60/60/24)+" дней").addField('Активность:',data1.online.value?"Игрок онлайн. "+data1.online.message:data1.online.message).setThumbnail('https://skin.vimeworld.ru/body/'+data.username+'.png',!0);message.channel.send(stats);break;case "guild":args[1]=args.splice(1).join(' ');var req=new XMLHttpRequest();req.open('GET','http://api.vime.world/guild/get?name='+encodeURIComponent(args[1]),!1);req.send();if(req.status==200)
var data=JSON.parse(req.responseText);if(data.error){var emb=new Discord.RichEmbed().setTitle('Произошла ошибка при получении данных с сервера').addField('Номер ошибки',data.error.error_code).addField('Текст ошибки',data.error.error_msg);return message.channel.send(emb)}for(i in data.members){if(data.members[i].status=='LEADER'){var leader="[`"+data.members[i].user.rank+"`] `"+data.members[i].user.username+"`"}}
var guild=new Discord.RichEmbed().setTitle('Информация о гильдии '+data.name).setColor('#00bfff').addField('Уровень:',data.level).addField('Тег:',data.tag?data.tag:"Отсутствует").addField('Цвет тега:',data.tag?data.color:"Тег отсутствует").addField('Лидер',leader).setFooter('Игроков в гильдии: '+data.members.length);message.channel.send(guild);break;case "leaderboard":args[1]=args.splice(1).join(' ');var req=new XMLHttpRequest();req.open('GET','http://api.vime.world/leaderboard/list',!1);req.send();if(req.status==200)
var data=JSON.parse(req.responseText);for(i in data){if(args[1]==data[i].type){break}else if(i==data.length-1){message.channel.send("Неизвестное название");return!1}}
var req=new XMLHttpRequest();req.open('GET','http://api.vime.world/leaderboard/get/'+args[1]+"?size=10",!1);req.send();if(req.status==200)
var data=JSON.parse(req.responseText);var rs="";if(args[1]=="guild"){for(i in data.records){rs+="`"+data.records[i].name+"`, "}}
else if(args[1]=="user"){for(i in data.records){rs+="`"+data.records[i].username+"`, "}}
else{for(i in data.records){rs+="`"+data.records[i].user.username+"`, "}}
message.channel.send(args[1]!="guild"?("Топ 10 лучших игроков"+(args[1]!="user"?" "+args[1]:"")+":\n"+rs):("Топ 10 лучших гильдий:\n"+rs));break;case "prefix":if(!message.member.hasPermission("ADMINISTRATOR")&&message.author.id!=396921754536247306)return message.reply("У вас недостаточно прав для совершения этого действия!");if(!args[1]){message.reply("Префиксом бота в данный момент является \""+prefix+"\"");return!1}
switch(args[1]){case "set":config[server.id].prefix=args[2];prefix=config[server.id].prefix;fs.writeFileSync('configs.json',JSON.stringify(config));message.channel.send("Префикс бота для сервера "+server.name+" ["+server.id+"] был успешно изменён на \""+args[2]+"\"");break;case "remove":config[server.id].prefix="";prefix=config[server.id].prefix;fs.writeFileSync('configs.json',JSON.stringify(config));message.channel.send("Префикс бота был успешно сброшен");break}
break;case "channel":if(!message.member.hasPermission("ADMINISTRATOR")&&message.author.id!=396921754536247306)return message.reply("У вас недостаточно прав для совершения этого действия!");if(args[1]=="*"){config[server.id].botchannel="*"}else{config[server.id].botchannel=message.mentions.channels.first().id}
channel=config[server.id].botchannel;fs.writeFileSync('configs.json',JSON.stringify(config));message.channel.send("Канал бота для сервера "+server.name+" ["+server.id+"] был успешно изменён на \""+args[1]+"\"")}})