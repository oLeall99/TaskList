# 🚀 Opções de Deploy Gratuito - Resumo Rápido

## 🥇 **RECOMENDADO: Railway**
- **Link**: https://railway.app
- **Vantagens**: Mais simples, PostgreSQL incluso, auto-deploy
- **Passos**: 
  1. Login com GitHub
  2. New Project → Deploy from GitHub repo
  3. Selecionar `TaskList`
  4. Configurar variáveis de ambiente
- **Limite**: 512MB RAM, 100GB bandwidth/mês

## 🥈 **ALTERNATIVA: Fly.io**
- **Link**: https://fly.io
- **Vantagens**: Ótimo para Docker, CLI simples
- **Instalação**: `curl -L https://fly.io/install.sh | sh`
- **Passos**:
  ```bash
  flyctl auth login
  flyctl launch
  flyctl deploy
  ```

## 🥉 **ALTERNATIVA: Render**
- **Link**: https://render.com
- **Vantagens**: Interface simples, PostgreSQL gratuito
- **Passos**:
  1. Connect GitHub
  2. New → Web Service
  3. Selecionar repositório
  4. Configurar Docker

## 🔧 **EM CASO DE PROBLEMAS:**

### Railway não detecta Docker?
- Verifique se `railway.json` está na raiz
- Certifique-se que Dockerfiles estão corretos

### Erro de build?
- Check logs na aba "Deployments"
- Verifique variáveis de ambiente

### Aplicação não conecta?
- Aguarde 2-3 minutos após deploy
- Verifique se DATABASE_URL está configurada

## 🌐 **RESULTADO FINAL:**
Após deploy bem-sucedido:
- **Frontend**: https://seu-app.railway.app
- **Backend**: https://seu-api.railway.app  
- **Swagger**: https://seu-api.railway.app/docs

---

⚡ **TEMPO ESTIMADO DE DEPLOY**: 5-10 minutos
🎯 **RECOMENDAÇÃO**: Comece com Railway, é mais simples! 