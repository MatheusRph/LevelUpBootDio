const { url } = require('./app.js');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para coletar links de uma página
async function collectPageLinks(page) {
  const links = await page.evaluate(() => {
    const containers = document.querySelectorAll('.sc-entYTK.eIIsMU');
    return Array.from(containers).map(container => {
      const topicLinkElement = container.querySelector('.topic-link');
      return topicLinkElement ? topicLinkElement.href : null;
    }).filter(link => link !== null);  // Filtra para remover valores nulos
  });

  return links;
}

// Função para verificar o número da última página
async function getLastPageNumber(page) {
  const lastPageButton = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.sc-bwjutS'));
    const lastButton = buttons[buttons.length - 1];  // Último botão de página
    return lastButton ? parseInt(lastButton.textContent.trim()) : null;
  });

  return lastPageButton;
}

async function collectPagesLinks(page) {
  let allLinks = [];

  // Navega para a URL inicial
  await page.goto(url);
  await page.waitForSelector('body', { timeout: 100000 });

  await delay(1000);


  console.log('Obtendo número de páginas forum');
  // Obtém o número da última página
  const lastPageButton = await getLastPageNumber(page);
  await delay(2000);
  // Modifica a URL para remover os parâmetros após "?"
  const modifiedUrl = url.replace(/\?.*/, '');

  console.log(`Número de páginas forum obtido: ${lastPageButton}`);
  console.log(`Iniciando coleta de links:`, lastPageButton*10);
  await delay(5000);

  // Loop de páginas, começando da página 1
  for (let x = 1; x <= lastPageButton; x++) {
    // Navega para a URL da página atual
    await page.goto(`${modifiedUrl}?page=${x}&search=&tab=forum`);

    // Coleta os links da página atual
    const links = await collectPageLinks(page);
    allLinks = [...allLinks, ...links];  // Adiciona os links encontrados à lista total
    console.log(modifiedUrl);
    console.log(allLinks);
    await delay(2000);
  }

  console.log('Links coletados');
  await delay(5000);

  // Retorna todos os links coletados
  return allLinks;
}

// Exporta a função coletora de links
module.exports = collectPagesLinks;
