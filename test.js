const puppeteer = require('puppeteer');
const login = require('./login'); // Importa a função login de login.js

const url = "https://web.dio.me/track/cef92400-613a-4066-ac1f-650f3b29e1b2?page=1&search=&tab=forum";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

(async () => {

const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // Defina a URL
  await page.goto('https://web.dio.me/login');
  

  await login(page);
  // Navega para a URL
  await page.goto(url);
  await page.waitForNavigation(); // Aguarda a navegação após o login

  // Seleciona todos os botões que têm o valor numérico específico no innerHTML
  const buttons = await page.$$('button.sc-bwjutS');

  // Filtra botões com innerHTML específico e salva para clicar depois
  const targetButtons = [];
  for (let button of buttons) {
    const innerHTML = await page.evaluate(el => el.innerHTML, button);
    if (['1', '2', '43'].includes(innerHTML)) {
      targetButtons.push(button); // Armazena o botão na lista
    }
  }

  await delay(4000);

  console.log(targetButtons);

//   // Exemplo: Clicar em cada botão armazenado (1, 2, e 43)
//   for (let button of targetButtons) {
//     await button.click();
//     console.log('Botão clicado');
//     await page.waitForNavigation(); // Aguarda a navegação após o login
//   }

  // Fecha o navegador
  await browser.close();
})();
