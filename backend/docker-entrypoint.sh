#!/bin/sh
set -e

echo "🐳 Starting TaskList Backend..."

# Função para aguardar o banco de dados
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    
    # Extrair informações da DATABASE_URL se disponível
    if [ -n "$DATABASE_URL" ]; then
        echo "📊 Using DATABASE_URL for connection"
        
        # Aguardar conexão usando pg_isready (se possível) ou timeout
        timeout=60
        while [ $timeout -gt 0 ]; do
            if yarn sequelize-cli db:migrate --env production 2>/dev/null; then
                echo "✅ Database is ready and migrations completed!"
                return 0
            fi
            
            echo "⏳ Database not ready yet, waiting... ($timeout seconds left)"
            timeout=$((timeout - 1))
            sleep 1
        done
        
        echo "❌ Database connection timeout!"
        exit 1
    else
        echo "⚠️  No DATABASE_URL found, skipping database wait"
    fi
}

# Aguardar banco de dados e executar migrações
if [ "$1" = "yarn" ] && [ "$2" = "start" ]; then
    wait_for_db
fi

# Executar comando passado como argumento
exec "$@" 