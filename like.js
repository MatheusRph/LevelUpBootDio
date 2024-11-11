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
        await page.waitForSelector('.btn.btn-link i.fa-chevron-up', { timeout: 10000 });
    
        // Seleciona todos os botões que têm o ícone 'fa-chevron-up'
        const buttons = await page.$$('button.btn.btn-link i.fa-chevron-up');
        
        if (buttons.length === 0) {
            console.log("Nenhum botão encontrado com o ícone de votação.");
            return false; // Retorna false caso não tenha encontrado os botões
        }
    
        // Itera sobre todos os botões encontrados e clica no botão pai
        for (const icon of buttons) {
            const button = await icon.evaluateHandle(el => el.closest('button'));
            try {
                // Clica no botão e aguarda a interação ser concluída
                await button.click();
                return true;
            } catch (error) {
                console.error("Erro ao clicar no botão:", error);
                return false; // Retorna false se houve erro ao clicar
            }
        }
        return true; // Retorna true caso tenha clicado com sucesso
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
        if (resourceType === 'image' || resourceType === 'media' || resourceType === 'font' || resourceType === 'stylesheet') {
            request.abort(); // Bloqueia as requisições de imagens, vídeos, fontes e estilos
        } else {
            request.continue(); // Continua com os outros tipos de requisições
        }
    });

    // Coleta os links de todas as páginas usando a função importada
    const linksForum = await collectLinks(page);
    console.log(`Links coletados: ${linksForum.length}`);

    let curtidas = 0; // Contador de curtidas

    // Para cada link encontrado, acessa o link e faz alguma ação (exemplo: curtir)
    for (let i = 0; i < linksForum.length; i++) {
        const link = linksForum[i];
        console.log(`Acessando link: ${i + 1}`);

        await page.goto(link, { timeout: 100000 }); // Aumenta o tempo de espera para 100 segundos
        await page.waitForSelector('.btn.btn-link i.fa-chevron-up', { timeout: 10000 }); // Aguarda o carregamento da página

        // Chama a função para clicar nos botões de voto
        const sucesso = await clickVoteButtons(page);

        // Verifica se foi bem-sucedido
        if (sucesso) {
            console.log(`Link ${i + 1} Curtido ${link}`);
            curtidas++; // Incrementa o contador de curtidas
        } else {
            console.log(`Link ${i + 1} Não curtido`);
        }

        // Delay entre os links
        await page.waitForTimeout(500); // Espera 0.5 segundos
    }

    // Exibe o total de curtidas ao final
    console.log(`Total de curtidas: ${curtidas}`);

    // Fecha a página ao final
    await page.close();
}

// Exporta a função like
module.exports = like;
