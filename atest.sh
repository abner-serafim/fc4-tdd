#!/usr/bin/env bash

# Verifica se o diretório home do usuário existe
if [[ ! -d "$HOME" ]]; then
  echo "ERRO: Diretório home do usuário não encontrado." >&2
  exit 1
fi

# Diretório de instalação do NVM
export NVM_DIR="$HOME/.nvm"

# Verifica se o NVM está instalado
if [[ ! -d "$NVM_DIR" ]]; then
  echo "ERRO: NVM não encontrado em $NVM_DIR. Instale o NVM antes de executar este script." >&2
  exit 1
fi

# Carrega o NVM
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

export VERSIONNODEAGORA=22

# Tenta usar o Node.js versão $VERSIONNODEAGORA
nvm use $VERSIONNODEAGORA

# Verifica a versão do Node.js
node_version=$(node -v)
if [[ $node_version =~ ^v$VERSIONNODEAGORA\..* ]]; then
  echo "Node.js v$VERSIONNODEAGORA encontrado. Iniciando o servidor..."
  npm run test
else
  echo "ERRO: A versão do Node.js não é v$VERSIONNODEAGORA. Versão encontrada: $node_version" >&2
  exit 1
fi
