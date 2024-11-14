const puppeteer = require('puppeteer');
const login = require('./login'); // Importa a função login de login.js

const url = "https://web.dio.me/track/cef92400-613a-4066-ac1f-650f3b29e1b2?page=1&search=&tab=forum";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://web.dio.me/login');
  await login(page); // Executa a função de login
  
  await page.goto(url);
  await page.waitForNavigation(); // Aguarda a navegação após o login
  await delay(10000);
  // Aguarda o seletor da classe dos botões
  await page.waitForSelector('.sc-bwjutS');

  await page.$$('.sc-bwjutS');

  // Coleta o texto de todos os botões usando o evaluate
  const collectButtons = await page.evaluate(() => {
    const buttonSelector = '.sc-bwjutS';
    const buttons = document.querySelectorAll(buttonSelector);
    
    // Retorna o texto de cada botão
    return Array.from(buttons, button => button.textContent.trim());
  });

  console.log(collectButtons); // Verifica os valores no console
  await browser.close();
})();
