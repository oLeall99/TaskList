const { underscoredIf } = require("sequelize/lib/utils");

module.exports = process.env.DB_HOST ? {
  // Configuração manual para Docker/produção usando variáveis individuais
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  logging: console.log,
} : process.env.DATABASE_URL ? {
  // Configuração para produção usando DATABASE_URL (fallback)
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
  logging: console.log,
} : {
  // Configuração para desenvolvimento local
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'admin',
  database: 'tasklist',
  port: 5432,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};