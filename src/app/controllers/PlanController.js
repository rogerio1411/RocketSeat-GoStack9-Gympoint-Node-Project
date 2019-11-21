import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({ attributes: ['id', 'title', 'duration', 'price'] });

    return res.status(400).json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().integer().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fail in validation form' });
    }

    const planExists = await Plan.findOne({
      where: { duration: req.body.duration },
    });
    if (planExists) {
      res.status(400).json({ error: 'Plan exists, verify.' });
    }
    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fail in validation form' });
    }

    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      res.status(400).json({ error: 'Update error, Plan not found' });
    }

    const { title, duration, price } = req.body;

    const planUpdated = await plan.update({
      title,
      duration,
      price,
    });
    return res.json(planUpdated);
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      res.status(400).json({ error: 'Plan not found to delete.' });
    }
    await Plan.destroy({
      where: { id: req.params.id },
    });
    const plans = await Plan.findAll();
    return res.json(plans);
  }
}

export default new PlanController();
