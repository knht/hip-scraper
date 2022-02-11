const server = require('http').createServer();
const io = require('socket.io')(server);
const puppeteer = require('puppeteer');
const CREDS = require('./constants/creds');

const wsClients = [];
const alreadyBroadcasted = [];
const topics = [
    'Computergrafik',
    'IT-Sicherheit',
    'Softwaretechnik 2',
    'Datenbanksysteme',
    'Datenbanksysteme Praktikum'
];

const checkAndNotify = async (page) => {
    setInterval(async () => {
        await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

        topics.forEach(async (courseTopic) => {
            const found = await page.evaluate((ct) => window.find(ct), courseTopic);
            
            if (found && !alreadyBroadcasted.includes(courseTopic)) {
                console.log(`Topic "${courseTopic}" found in HIP! Broadcasting status over WS ...`);
                
                wsClients.forEach((wsClient) => {
                    wsClient.emit('newHipEntry', { course: courseTopic });
                });

                alreadyBroadcasted.push(courseTopic);
            } else {
                console.log(`Topic "${courseTopic}" couldn't be found in HIP yet OR was already processed! Discarding ...`)
            }
        });
    }, 1000 * 60 * 5);
};

const runner = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://hip.reutlingen-university.de', { waitUntil: 'networkidle0' });
    await page.type('#asdf', CREDS.username);
    await page.type('#fdsa', CREDS.password);

    await Promise.all([
        page.click('[id="loginForm:login"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await Promise.all([
        page.click('.divcontent > #makronavigation > .menue > .submenuCss > .auflistung'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await Promise.all([
        page.click('form > .mikronavi_list > .liste > li:nth-child(3) > .auflistung'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await Promise.all([
        page.click('.content > form > .treelist > .treelist > .regular'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await Promise.all([
        page.click('.treelist > .treelist > .treelist > a > img'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await checkAndNotify(page);
};

(() => {
    runner();

    io.on('connection', (client) => {
        wsClients.push(client);
        console.log('New client connected');
    });

    server.listen(28785);
})();
