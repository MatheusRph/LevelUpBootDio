const puppeteer = require('puppeteer');
const credentials = require('./cred.json'); // Importa as credenciais do arquivo JSON

// Função de login
async function login(page) {
  await page.waitForSelector('#username'); // Aguarda o campo de e-mail (id 'username')
  await page.type('#username', credentials.email); // Preenche o e-mail do JSON
  await page.type('#password', credentials.senha); // Preenche a senha (id 'password')
  await page.click('button[type="submit"]'); // Clica no botão de login
  await page.waitForNavigation(); // Aguarda a navegação após o login
}

module.exports = login; // Exporta a função de login
