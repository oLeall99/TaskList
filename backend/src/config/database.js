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
  logging: console.log, // Habilitar logs para debug
} : (process.env.DB_HOST && process.env.NODE_ENV === 'production') ? {
  // Configuração manual para produção (fallback)
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
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