import app from "./app";
import { exec } from 'child_process';

const PORT = process.env.PORT || 10000;

// Executar migrações automaticamente em produção
if (process.env.NODE_ENV === 'production') {
  console.log('🔧 Running database migrations...');
  exec('sequelize-cli db:migrate', { env: { ...process.env, NODE_ENV: 'production' } }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Migration error:', error);
    } else {
      console.log('✅ Migrations completed');
      console.log(stdout);
    }
    if (stderr) {
      console.log('Migration warnings:', stderr);
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
