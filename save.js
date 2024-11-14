const puppeteer = require('puppeteer');
const login = require('./login'); // Importa a função login de login.js

const url = "https://web.dio.me/track/cef92400-613a-4066-ac1f-650f3b29e1b2?page=1&search=&tab=forum";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  let npage = 2;
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

  // Encontrar todos os XPaths dos botões
  const xpaths = await page.evaluate(() => {
    const buttonSelector = '.sc-bwjutS';
    const buttons = document.querySelectorAll(buttonSelector); // Seleciona todos os botões
    const xpaths = [];

    // Função para gerar o XPath de um elemento
    function getElementXPath(element) {
      if (element.id !== '') {
        return 'id("' + element.id + '")';
      }
      if (element === document.body) {
        return '/html/body';
      }
      const siblings = Array.from(element.parentNode.childNodes);
      const index = siblings.indexOf(element) + 1;
      return getElementXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + index + ']';
    }

    // Gera o XPath de cada botão e armazena em um array
    buttons.forEach(button => {
      xpaths.push(getElementXPath(button));
    });

    return xpaths;
  });

  // Combina os textos dos botões e seus respectivos XPaths em um dicionário
  const buttonData = collectButtons.reduce((acc, text, index) => {
    acc[index + 1] = {
      text: text,
      xpath: xpaths[index]
    };
    return acc;
  }, {});

  console.log(buttonData);

  async function nextpage() {
    for (let key in buttonData) {
      if (buttonData[key].text === npage) {
        const xpath = buttonData[key].xpath;  // Acessando o XPath do botão com texto '1'
        console.log(xpath);
        const buttonLocator = page.locator(`xpath=${xpath}`);

        if (buttonLocator) {
          await buttonLocator.click();  // Clica no botão localizado
          npage += 1;
        }

      } else {
        console.log('Não encontrado')
      }
    }
  }



  await delay(10000);
  await browser.close();
})();
