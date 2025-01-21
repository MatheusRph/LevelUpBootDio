const puppeteer = require('puppeteer');
const collectLinks = require('./collectLinks'); // Importa a função collectLinks de collectLinks.js

// Função delay para criar espera entre as interações
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para clicar nos botões de voto
async function clickVoteButtons(page) {
    try {
        // Aguarda até que os botões estejam disponíveis na página
        await page.waitForSelector('.fa-chevron-up', { timeout: 100000 });
    
        // Seleciona todos os botões que têm o ícone 'fa-chevron-up'
        const buttons = await page.$$('.fa-chevron-up');
        
        if (buttons.length === 0) {
            console.log("Nenhum botão encontrado com o ícone de votação.");
            return false; // Retorna false caso não tenha encontrado os botões
        }
    
        // Itera sobre todos os botões encontrados e clica no botão pai
        for (let i = 0; i < buttons.length; i++) {
            console.log(`Clicando no botão ${i + 1}...`);
            const button = await buttons[i].evaluateHandle(el => el.closest('button')); // Localiza o botão pai

            try {
                // Clica no botão pai e aguarda a interação ser concluída
                await button.click();
                console.log(`Botão ${i + 1} clicado com sucesso.`);
                await delay(500); // Delay entre os cliques para evitar problemas
            } catch (error) {
                console.error(`Erro ao clicar no botão ${i + 1}:`, error);
            }
        }
        return true; // Retorna true após processar todos os botões
    } catch (error) {
        console.error("Erro ao tentar clicar nos botões de votação:", error);
        return false; // Retorna false em caso de erro
    }
}

// Função para curtir um link
async function like(page) {
    // Habilita a interceptação de requisições de rede
    await page.setRequestInterception(true);

    // Intercepta as requisições e bloqueia imagens, vídeos, fontes e estilos
    page.on('request', (request) => {
        const resourceType = request.resourceType();
        if (['image', 'media', 'font', 'stylesheet'].includes(resourceType)) {
            request.abort(); // Bloqueia as requisições de imagens, vídeos, fontes e estilos
        } else {
            request.continue(); // Continua com os outros tipos de requisições
        }
    });

    // Coleta os links de todas as páginas usando a função importada
    const linksForum = await collectLinks(page);
    console.log(`Links coletados: ${linksForum.length}`);
    console.log(linksForum);

    let curtidas = 0; // Contador de curtidas

    // Para cada link encontrado, acessa o link e faz alguma ação (exemplo: curtir)
    for (let i = 0; i < linksForum.length; i++) {
        const link = linksForum[i];
        console.log(`Acessando link: ${i + 1}`);

        await page.goto(link, { timeout: 100000 }); // Aumenta o tempo de espera para 100 segundos
        await delay(5000);

        // Chama a função para clicar nos botões de voto
        const sucesso = await clickVoteButtons(page);

        // Verifica se foi bem-sucedido
        if (sucesso) {
            console.log(`Link ${i + 1} curtido: ${link}`);
            curtidas++; // Incrementa o contador de curtidas
        } else {
            console.log(`Link ${i + 1} não curtido: ${link}`);
        }

        // Delay entre os links
        await delay(5000);
    }

    // Exibe o total de curtidas ao final
    console.log(`Total de curtidas: ${curtidas}`);

    // Fecha a página ao final
    await page.close();
}

// Exporta a função like
module.exports = like;
