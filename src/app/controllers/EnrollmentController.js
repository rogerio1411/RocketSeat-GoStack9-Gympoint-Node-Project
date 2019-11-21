import { addMonths } from 'date-fns';
import Queue from '../../lib/Queue';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import WellcomeMail from '../jobs/WellcomeMail';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      include: [{
        model: Plan,
      },
      { model: Student }],
    });
    return res.status(400).json({ enrollments });
  }

  async store(req, res) {
    const {
      student_id, plan_id, start_date,
    } = req.body;
    const enrollment = await Enrollment.findOne({
      where: { student_id },
    });
    if (enrollment) {
      res.status(400).json({ error: 'Enrolled student.' });
    }
    const student = await Student.findByPk(student_id, {
      attributes: ['name', 'email'],
    });
    if (!student) {
      res.status(400).json({ error: 'Student not found' });
    }
    const plan = await Plan.findOne({
      where: { id: plan_id },
    });
    if (!plan) {
      res.status(400).json({ error: 'Plan not found' });
    }
    const endDate = addMonths(new Date(), plan.duration);
    const totalPrice = plan.duration * plan.price;

    const newEnrollment = await Enrollment.create({
      student_id, plan_id, start_date, end_date: endDate, price: totalPrice,
    });

    await Queue.add(WellcomeMail.key, {
      newEnrollment, student, plan,
    });

    return res.json(newEnrollment);
  }

  async update(req, res) {
    const { student_id, plan_id, start_date } = req.body;
    const enrollmentUpdate = await Enrollment.findOne({
      where: { student_id },
    });
    if (!enrollmentUpdate) {
      res.status(400).json({ error: 'Enrollment not found.' });
    }

    const newPlan = await Plan.findOne({
      where: { id: plan_id },
    });
    if (!newPlan) {
      res.status(400).json({ error: 'Plan not found' });
    }
    const endDate = addMonths(new Date(), newPlan.duration);
    const totalPrice = newPlan.duration * newPlan.price;

    const enrollmentUpdated = await enrollmentUpdate.update({
      student_id, plan_id, start_date, end_date: endDate, price: totalPrice,
    });
    return res.json(enrollmentUpdated);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findOne({
      where: { id: req.params.id },
    });
    if (!enrollment) {
      res.status(400).json({ error: 'Enrollment not found.' });
    }

    await Enrollment.destroy({
      where: { id: req.params.id },
    });
    const enrollments = await Plan.findAll();
    return res.json(enrollments);
  }
}

export default new EnrollmentController();
