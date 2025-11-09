const { execSync } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

function getCommitHash() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.error('Não foi possível obter o hash do commit. Verifique se este projeto é um repositório Git.');
    process.exit(1);
  }
}

function main() {
  const commitHash = getCommitHash();
  const payload = {
    commitHash,
    generatedAt: new Date().toISOString(),
  };

  const targetPath = resolve(__dirname, '..', 'commit-info.json');
  writeFileSync(targetPath, JSON.stringify(payload, null, 2));

  console.log(`Arquivo commit-info.json atualizado com hash ${commitHash}`);
}

main();

