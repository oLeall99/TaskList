/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      desc: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      user_id:{
        type: Sequelize.INTEGER,
        references: {model: 'users', key: 'id'},
        onUpdate:  'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
  });

  },

  async down (queryInterface) {
    return queryInterface.dropTable('tasks');
  }
};
