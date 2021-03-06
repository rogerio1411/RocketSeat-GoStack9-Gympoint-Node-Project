
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('help_orders', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: Sequelize.INTEGER,
      references: { model: 'students', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    },
    question: {
      type: Sequelize.STRING(1234),
      allowNull: false,
    },
    answer: {
      type: Sequelize.STRING(1234),
      allowNull: true,
    },
    answer_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('help_orders'),
};
