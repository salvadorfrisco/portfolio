import { execSync } from "child_process";

// Captura a mensagem passada por argumento
const message = process.argv[2] || "Commit padrão";

// Função para executar comandos no terminal
const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Erro ao executar: ${command}\n`, error);
    process.exit(1);
  }
};

// Executa os comandos Git
runCommand("git add .");
runCommand(`git commit -m "${message}"`);
runCommand("git push");
runCommand("git push hostinger");
