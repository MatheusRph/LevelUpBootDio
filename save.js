const puppeteer = require('puppeteer');

const url = "https://web.dio.me/track/cef92400-613a-4066-ac1f-650f3b29e1b2?page=1&search=&tab=forum";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function nextpages(page, npage) {

  console.log('Ok');

  await delay(5000);
  // Aguarda o seletor da classe dos botões
  await page.waitForSelector('.sc-bwjutS');

  await page.$$('.sc-bwjutS');

  console.log('Ok2');

  await delay(750);

  // Coleta o texto de todos os botões usando o evaluate
  const collectButtons = await page.evaluate(() => {
    const buttonSelector = '.sc-bwjutS';
    const buttons = document.querySelectorAll(buttonSelector);

    console.log('Ok3');
    // Retorna o texto de cada botão
    return Array.from(buttons, button => button.textContent.trim());

  });

  await delay(750);
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
    console.log('Ok4');
    return xpaths;
  });

  await delay(750);

  // Combina os textos dos botões e seus respectivos XPaths em um dicionário
  const buttonData = collectButtons.reduce((acc, text, index) => {
    acc[index + 1] = {
      text: text,
      xpath: xpaths[index]
    };
    console.log('Ok5');
    return acc;
  }, {});

  await delay(750);

  console.log(buttonData);

  // Interage com o botão da página correta
  for (let key in buttonData) {
    if (buttonData[key].text === String(npage)) {
      const xpath = buttonData[key].xpath;  // Acessando o XPath do botão correspondente
      console.log(`Clicando no botão da página: ${npage}`);
      await page.click(`xpath=${xpath}`);  // Clica no botão usando o XPath
      await delay(3000);
      console.log('Ok6');
      return;
    }
  }

  await delay(750);
};

module.exports = nextpages;