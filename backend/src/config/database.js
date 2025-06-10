const { underscoredIf } = require("sequelize/lib/utils");

module.exports = process.env.DATABASE_URL ? {
  // Configuração para produção usando DATABASE_URL
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
} : {
  // Configuração para desenvolvimento
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'tasklist',
  port: process.env.DB_PORT || 5432,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};