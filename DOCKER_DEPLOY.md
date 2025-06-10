# 🐳 Deploy com Docker - TaskList

Guia completo para fazer deploy da aplicação TaskList usando Docker.

## 🚀 Opções de Deploy

### **Plataformas Recomendadas:**
- ✅ **Railway** (Mais fácil para Docker)
- ✅ **DigitalOcean App Platform** 
- ✅ **Heroku** (com Container Registry)
- ✅ **AWS/GCP/Azure** (Container Services)
- ✅ **VPS próprio** (Docker Compose)

## 🛠️ Deploy Local (Desenvolvimento)

### **1. Pré-requisitos:**
- Docker e Docker Compose instalados
- Git

### **2. Executar aplicação completa:**
```bash
# Clonar repositório
git clone https://github.com/oLeall99/TaskList.git
cd TaskList

# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### **3. URLs Locais:**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:10000
- **API Docs**: http://localhost:10000/docs
- **Health Check**: http://localhost:10000/health

### **4. Parar serviços:**
```bash
docker-compose down
```

## 🚁 Deploy no Railway (Recomendado)

### **1. Configurar Railway:**
1. Acesse [railway.app](https://railway.app)
2. Conecte seu GitHub
3. **New Project** → **Deploy from GitHub repo**

### **2. Deploy do Backend:**
1. **Add Service** → **GitHub Repo**
2. Selecione seu repositório
3. **Configure Service**:
   - **Root Directory**: `backend`
   - **Builder**: Docker
   - **Dockerfile Path**: `backend/Dockerfile`

### **3. Adicionar PostgreSQL:**
1. **Add Service** → **Database** → **PostgreSQL**
2. Railway criará automaticamente

### **4. Configurar Variáveis (Backend):**
```bash
NODE_ENV=production
JWT_SECRET=sua-chave-super-secreta-aqui
FRONTEND_URL=https://seu-frontend.railway.app
# DATABASE_URL será configurado automaticamente
```

### **5. Deploy do Frontend:**
1. **Add Service** → **GitHub Repo**
2. **Configure Service**:
   - **Root Directory**: `frontend`
   - **Builder**: Docker
   - **Dockerfile Path**: `frontend/Dockerfile`

### **6. Configurar Variáveis (Frontend):**
```bash
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
```

## 🌊 Deploy no DigitalOcean

### **1. App Platform:**
1. Acesse [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. **Create App** → **GitHub**
3. Selecione seu repositório

### **2. Configurar Backend:**
```yaml
# .do/app.yaml
name: tasklist
services:
- name: backend
  source_dir: /backend
  github:
    repo: seu-usuario/TaskList
    branch: main
  dockerfile_path: backend/Dockerfile
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: sua-chave-secreta
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}

- name: frontend
  source_dir: /frontend
  github:
    repo: seu-usuario/TaskList
    branch: main
  dockerfile_path: frontend/Dockerfile
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_API_URL
    value: ${backend.PUBLIC_URL}

databases:
- name: db
  engine: PG
  version: "15"
```

## 🔧 Deploy em VPS (Docker Compose)

### **1. Preparar VPS:**
```bash
# Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **2. Clonar e configurar:**
```bash
# Clonar repositório
git clone https://github.com/oLeall99/TaskList.git
cd TaskList

# Criar arquivo de produção
cp docker-compose.yml docker-compose.prod.yml
```

### **3. Editar configurações:**
```yaml
# docker-compose.prod.yml
services:
  backend:
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://tasklist_user:SENHA_FORTE@database:5432/tasklist
      JWT_SECRET: CHAVE_JWT_SUPER_SECRETA
      FRONTEND_URL: https://seu-dominio.com
  
  frontend:
    environment:
      NEXT_PUBLIC_API_URL: https://api.seu-dominio.com
```

### **4. Subir em produção:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Configurações de Segurança

### **Variáveis Obrigatórias:**
```bash
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=chave-jwt-super-secreta-aleatoria
FRONTEND_URL=https://seu-frontend-url

# Frontend  
NEXT_PUBLIC_API_URL=https://seu-backend-url
```

### **Gerar JWT Secret seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📋 Comandos Úteis

### **Build manual:**
```bash
# Backend
docker build -t tasklist-backend ./backend

# Frontend
docker build -t tasklist-frontend ./frontend
```

### **Logs:**
```bash
# Ver logs dos containers
docker-compose logs -f

# Logs específicos
docker-compose logs backend
docker-compose logs frontend
```

### **Reiniciar serviços:**
```bash
docker-compose restart backend
docker-compose restart frontend
```

### **Acessar container:**
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 🚨 Troubleshooting

### **Container não inicia:**
```bash
# Ver logs detalhados
docker-compose logs backend

# Verificar status
docker-compose ps
```

### **Banco não conecta:**
```bash
# Verificar se banco está rodando
docker-compose ps database

# Testar conexão
docker-compose exec database psql -U tasklist_user -d tasklist -c "SELECT 1;"
```

### **Problemas de build:**
```bash
# Rebuild sem cache
docker-compose build --no-cache

# Limpar containers antigos
docker system prune -a
```

---

## 🎉 Resultado Final

Após o deploy, você terá:
- ✅ **Backend containerizado** com auto-migração
- ✅ **Frontend otimizado** com Next.js standalone
- ✅ **Banco PostgreSQL** integrado
- ✅ **HTTPS automático** (na maioria das plataformas)
- ✅ **Escalabilidade** fácil

**Muito mais confiável que deploy tradicional!** 🚀 