// Script para executar comandos SQL no Supabase
// Necessário ter as variáveis de ambiente SUPABASE_URL e SUPABASE_KEY configuradas
// ou passar como argumentos na linha de comando

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Obter argumentos da linha de comando
const args = process.argv.slice(2);
const sqlFilePath = args[0];
const supabaseUrl = args[1] || process.env.SUPABASE_URL;
const supabaseKey = args[2] || process.env.SUPABASE_KEY;

if (!sqlFilePath) {
  console.error('Uso: node execute-sql.js <caminho-do-arquivo-sql> [supabase-url] [supabase-key]');
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: SUPABASE_URL e SUPABASE_KEY são necessários.');
  console.error('Defina como variáveis de ambiente ou passe como argumentos.');
  process.exit(1);
}

// Inicializar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSqlFile() {
  try {
    // Ler arquivo SQL
    const sqlContent = fs.readFileSync(path.resolve(sqlFilePath), 'utf8');
    
    // Dividir em comandos individuais (separados por ;)
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`Executando ${sqlCommands.length} comandos SQL...`);
    
    // Executar cada comando
    for (let i = 0; i < sqlCommands.length; i++) {
      const cmd = sqlCommands[i];
      console.log(`\nExecutando comando ${i + 1}/${sqlCommands.length}:`);
      console.log(cmd);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: cmd });
        
        if (error) {
          console.error(`Erro ao executar comando ${i + 1}:`, error);
        } else {
          console.log(`Comando ${i + 1} executado com sucesso.`);
        }
      } catch (err) {
        console.error(`Erro ao executar comando ${i + 1}:`, err.message);
      }
    }
    
    console.log('\nExecução concluída.');
  } catch (err) {
    console.error('Erro ao ler ou executar o arquivo SQL:', err);
  }
}

executeSqlFile();
