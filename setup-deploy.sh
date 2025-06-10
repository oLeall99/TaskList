#!/bin/bash

echo "🚀 Preparando projeto TaskList para deploy..."

# Criar arquivos .env se não existirem
echo "📝 Criando arquivos de configuração..."

# Backend env
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Arquivo backend/.env criado!"
else
    echo "⚠️  Arquivo backend/.env já existe"
fi

# Frontend env
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/env.example frontend/.env.local
    echo "✅ Arquivo frontend/.env.local criado!"
else
    echo "⚠️  Arquivo frontend/.env.local já existe"
fi

echo ""
echo "🔧 Próximos passos:"
echo "1. Configure suas variáveis de ambiente nos arquivos criados"
echo "2. Suba o projeto para o GitHub"
echo "3. Siga o guia em DEPLOY_GUIDE.md"
echo ""
echo "📚 Leia o DEPLOY_GUIDE.md para instruções completas de deploy!"
echo ""
echo "🎉 Preparação concluída!" 