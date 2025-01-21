const puppeteer = require('puppeteer');

const url = "https://web.dio.me/track/cef92400-613a-4066-ac1f-650f3b29e1b2?page=1&search=&tab=forum";


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function nextpages(page, npage) {
  console.log('Ok');

  await delay(1000);
  
  // Aguarda o seletor da classe dos botões
  await page.waitForSelector(".sc-ddcbSj");

  console.log('Ok2');
  await delay(1000);

  // Coleta o texto e o XPath de todos os botões ao mesmo tempo
  const buttonData = await page.evaluate(() => {
    const buttonSelector = ".sc-ddcbSj";
    const buttons = document.querySelectorAll(buttonSelector);

    // Função para gerar o XPath de um elemento
    function getElementXPath(element) {
      if (element.id) {
        return `//*[@id="${element.id}"]`;
      }
      if (element === document.body) {
        return '/html/body';
      }

      let index = 1;
      const siblings = Array.from(element.parentNode.children);
      for (let sibling of siblings) {
        if (sibling === element) break;
        if (sibling.tagName === element.tagName) index++;
      }

      return getElementXPath(element.parentNode) + `/${element.tagName.toLowerCase()}[${index}]`;
    }

    // Gera o texto e o XPath de cada botão e armazena como um objeto
    return Array.from(buttons, button => ({
      text: button.textContent.trim(),
      xpath: getElementXPath(button)
    }));
  });

  await delay(1000);

  console.log(buttonData);

  // Interage com o botão da página correta
  for (let button of buttonData) {
    if (button.text === String(npage)) {
      const xpath = button.xpath;  // Acessando o XPath do botão correspondente
      console.log(`Clicando no botão da página: ${npage}`);
      await page.click(`xpath=${xpath}`);  // Clica no botão usando o XPath
      await delay(1000);
      console.log('Ok6');
      return;
    }
  }

  await delay(1000);
};

module.exports = nextpages;
