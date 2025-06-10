const { underscoredIf } = require("sequelize/lib/utils");

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'tasklist',
  port: process.env.DB_PORT || 5432,
  // Para Railway e outros serviços que fornecem DATABASE_URL
  use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : null,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
};