const puppeteer = require('puppeteer');
const login = require('./login'); // Importa a função login de login.js
const collectLinks = require('./collectLinks'); // Importa a função collectLinks de collectLinks.js
const like = require('./like'); // Importa a função likeLink de like.js

const url = "https://web.dio.me/track/cef92400-613a-4066-ac1f-650f3b29e1b2?page=1&search=&tab=forum";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navega até a página de login
  await page.goto('https://web.dio.me/login');

  // Chama a função login de login.js
  await login(page);

  // Navega até a página desejada após o login
  await page.goto(url);
  
  // Chama a função coleta de links
  await collectLinks(page);
  // await like(page);

  console.log("Todos os links encontrados:", links.length);  // Exibe a quantidade de links coletados

  // Fecha o navegador
  await browser.close();
})();

module.exports = { url };
