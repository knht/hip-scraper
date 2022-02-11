const io = require('socket.io-client');
const Eris = require('eris');
const config = require('./constants/config');


(async () => {
    const bot = new Eris(config.token, { intents: 32767 });
    const socket = io('ws://localhost:28785');

    bot.on('ready', () => {
        console.log('Successfully ready');
    })

    socket.on('connect', () => {
        console.log('Successfully connected to HIP Scraper');
    });

    socket.on('newHipEntry', (courseObject) => {
        bot.createMessage(config.channel, {
            content: `@everyone **${courseObject.course}** ist nun bewertet auf HIP!`,
            allowedMentions: {
                everyone: true
            }
        });
        console.log(courseObject);
    });

    bot.connect();
})();

