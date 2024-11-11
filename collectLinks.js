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

async function clickPageButton(page) {
  // Seleciona todos os botões que contêm números
  const buttons = await page.$$('.sc-bwjutS'); // Usa $$ do Puppeteer, que é equivalente ao querySelectorAll

  // Filtra os botões que contêm apenas números
  const numericButtons = await page.evaluate((buttons) => {
    // Verifica se a lista de botões não está vazia
    if (!buttons || buttons.length === 0) return [];

    return buttons.filter(button => {
      // Verifica se o button tem textContent e se ele é um número válido
      const text = button.textContent?.trim();
      return text && /^[0-9]+$/.test(text);  // Verifica se é um número inteiro
    }).map(button => button.textContent.trim());  // Coleta os números
  }, buttons);

  // if (numericButtons.length === 0) {
  //   console.log("Nenhum botão numérico encontrado.");
  //   return;
  // }

  // Ordena os botões numericamente
  numericButtons.sort((a, b) => parseInt(a) - parseInt(b));

  // Clica nos botões na ordem crescente
  for (let index = 0; index < numericButtons.length; index++) {
    const button = buttons[index];
    setTimeout(() => {
      button.click();
    }, index * 500);  // Delay de 500ms entre os cliques
  }
}


// Função principal para coletar links de todas as páginas
async function collectLinks(page) {
  let allLinks = [];
  let numpage = 1;  // Começa na primeira página

  while (true) {
    // Aguarda o carregamento da estrutura da classe `sc-entYTK eIIsMU`
    await page.waitForSelector('.sc-entYTK.eIIsMU', { timeout: 5000 });

    // Coleta links da página atual
    const links = await collectPageLinks(page);
    allLinks = [...allLinks, ...links];

    // Verifica o número da última página disponível
    const lastPageButton = await getLastPageNumber(page);
    console.log(`Última página encontrada: ${lastPageButton}`);

    // Se o número da página atual for maior ou igual ao número da última página, termina o loop
    if (numpage >= lastPageButton) {
      console.log("Não há mais páginas para coletar.");
      break;
    }

    // Chama a função que clica nos botões de página na ordem crescente
    await clickPageButton(page);

    // Aguarda até que os links da próxima página sejam carregados
    await page.waitForSelector('.sc-entYTK.eIIsMU', { timeout: 5000 });

    // Atualiza o número da página
    numpage++;
  }

  return allLinks;
}

module.exports = collectLinks;
