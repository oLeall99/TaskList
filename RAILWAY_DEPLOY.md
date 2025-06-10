# 🚀 Deploy no Railway - Guia Completo

## ✅ Pré-requisitos
- [x] Código no GitHub (https://github.com/oLeall99/TaskList)
- [x] Docker funcionando localmente
- [x] Conta no Railway (gratuita)

## 🎯 Passo a Passo

### **1. Criar Conta no Railway**
1. Acesse: https://railway.app
2. Clique em "Login with GitHub"
3. Autorize o Railway a acessar seus repositórios

### **2. Criar Novo Projeto**
1. No dashboard, clique em "New Project"
2. Selecione "Deploy from GitHub repo" 
3. Escolha o repositório `TaskList`
4. Railway vai detectar automaticamente os Dockerfiles

### **3. Configurar Serviços**

#### **🗄️ Database (PostgreSQL)**
1. Clique em "Add Service" → "Database" → "PostgreSQL"
2. Railway criará automaticamente um banco PostgreSQL
3. Anote as credenciais que serão geradas

#### **⚙️ Backend API**
1. Railway detectará o `backend/Dockerfile`
2. Configure as variáveis de ambiente:
   ```
   NODE_ENV=production
   JWT_SECRET=seu-jwt-secret-super-seguro-aqui
   PORT=10000
   FRONTEND_URL=https://seu-frontend.railway.app
   
   # Database (Railway fornecerá automaticamente)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   DB_HOST=${{Postgres.PGHOST}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_PORT=${{Postgres.PGPORT}}
   ```

#### **🎨 Frontend Next.js**
1. Railway detectará o `frontend/Dockerfile`
2. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
   ```

### **4. Deploy Automático**
1. Railway fará o deploy automaticamente
2. Cada serviço receberá uma URL única:
   - Backend: `https://tasklist-backend-xxx.railway.app`
   - Frontend: `https://tasklist-frontend-xxx.railway.app`

### **5. Configurar Domínios**
1. No dashboard de cada serviço
2. Vá em "Settings" → "Domains"
3. Clique em "Generate Domain" para URLs amigáveis

## 🔧 Solução de Problemas

### **Erro de Build**
- Verifique se os Dockerfiles estão corretos
- Check logs na aba "Deployments"

### **Erro de Conexão Database**
- Verifique se as variáveis `${{Postgres.XXX}}` estão configuradas
- Database pode demorar alguns minutos para inicializar

### **CORS Issues**
- Certifique-se que `FRONTEND_URL` no backend aponta para URL do frontend
- Verifique `NEXT_PUBLIC_API_URL` no frontend

## 💰 Limites da Conta Gratuita
- **CPU**: 512MB RAM, 1 vCPU
- **Bandwidth**: 100GB/mês
- **Builds**: 500 horas/mês
- **Databases**: 1GB storage

## 🌐 URLs Finais
Após deploy bem-sucedido, você terá:
- **App**: https://seu-app.railway.app
- **API**: https://seu-api.railway.app
- **Docs**: https://seu-api.railway.app/docs

---

## 🚀 Deploy Alternativo: Usando Railway CLI

### **Instalar Railway CLI**
```bash
npm install -g @railway/cli
```

### **Login e Deploy**
```bash
railway login
railway link
railway up
```

### **Configurar Environment**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=seu-jwt-secret
# ... outras variáveis
```

---

✅ **Sucesso!** Sua aplicação estará online e acessível globalmente! 