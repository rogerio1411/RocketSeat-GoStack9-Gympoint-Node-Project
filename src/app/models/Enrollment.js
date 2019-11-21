import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        price: Sequelize.REAL,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });// A enrollment belongsTo Student
    this.belongsTo(models.Plan, { foreignKey: 'plan_id' });
  }
}

export default Enrollment;
