import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const student_id = req.params.id;

    const checkins = await Checkin.findAll({
      where: { student_id },
    });
    if (!checkins) {
      res.status(400).json({ error: 'Checkins not found' });
    }
    res.status(400).json(checkins);
  }

  async store(req, res) {
    const student_id = req.params.id;

    const current_day = new Date();

    const last7days = subDays(current_day, 7);

    const { count } = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [last7days, current_day],
        },
      },
    });
    /**
     * Sequelize findAnCountAll count starts from 0 (zero)
     */
    if (count === 4) {
      res.status(400).json({ error: 'Ops, you can only have five access in seven days period' });
    }
    const checkin = await Checkin.create({ student_id });
    res.json(checkin);
  }
}

export default new CheckinController();
