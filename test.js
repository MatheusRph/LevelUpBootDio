const puppeteer = require('puppeteer');
const login = require('./login'); // Importa a função login de login.js
const {
  DelegatedLocator
} = require('puppeteer-core');

const url = "https://web.dio.me/track/cef92400-613a-4066-ac1f-650f3b29e1b2?page=1&search=&tab=forum";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  // Defina a URL
  await page.goto('https://web.dio.me/login');


  await login(page);
  // Navega para a URL
  await page.goto(url);
  // Aguarda a navegação
  await page.waitForNavigation();

  // Seletor da div
  let div = ".sc-bwjutS"; // Adicionei o ponto para indicar que é uma classe CSS

  let npage = 1;

  const buttons = await page.$$(div);

  // if (buttons.length > 0) {
  //   for (let button of buttons) {
  //     const buttonText = await page.evaluate(button => button.textContent.trim(), button);
  //     console.log('Texto do botão:', buttonText); // Extrai o texto do botão
  //   }
  // }

  // // Função para coletar links de uma página
  // const collectButtons = await page.evaluate(() => {
  //   // Seletor para os botões com a classe 'sc-bwjutS'
  //   const buttonSelector = '.sc-bwjutS'; 

  //   // Coleta todos os botões com a classe específica
  //   const buttons = document.querySelectorAll(buttonSelector);

  //   // Mapeia os botões e extrai o texto de cada um
  //   return Array.from(buttons).map(button => {
  //     return button.textContent.trim(); // Extrai o texto do botão (ex: '1', '2', etc.)
  //   });
  // });

  // Coleta todos os botões com a classe 'sc-bwjutS' e extrai o texto de cada um
  const collectButtons = await page.evaluate((desiredText) => {
    const buttonSelector = '.sc-bwjutS'; // Seletor para os botões
    const buttons = document.querySelectorAll(buttonSelector);

    // Mapeia os botões e encontra o botão que corresponde ao texto desejado
    const matchingButton = Array.from(buttons).find(button => button.textContent.trim() === desiredText);

    if (matchingButton) {
      matchingButton.click(); // Clica no botão que corresponde ao texto
      return true; // Retorna 'true' caso tenha clicado no botão
    }

    return false; // Retorna 'false' caso nenhum botão tenha sido encontrado
  });

  if (collectButtons) {
    console.log(`Botão com texto "${desiredText}" clicado!`);
  } else {
    console.log(`Nenhum botão com o texto "${desiredText}" foi encontrado.`);
  }

  collectButtons(npage);
  delay(10000);

  // Exibe os textos dos botões no console
  console.log(collectButtons);

  // Espera o botão ser visível e retorna o elemento
  let searchButton = await page.waitForSelector(div, {
    visible: true,
  });

  // Certifica-se de que o botão está disponível e então clica nele
  if (searchButton) {
    await searchButton.click();
    console.log('Deu bom!');
  }
  await delay(2000);

  await browser.close();
})();