
import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
// import Mail from '../../lib/Mail';
import HelpOrderMail from '../jobs/HelpOrderMail';

class HelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const student_id = req.params.id;
    const student = await Student.findByPk(student_id);

    /**
     * All Help Orders from a student
     */
    if (student) {
      const noAnswereds = await HelpOrder.findAll({
        where: { student_id },
        include: [{
          model: Student,
          as: 'student',
          attibutes: ['name', 'email'],
        }],
        limit: 20,
        offset: (page - 1) * 20,
      });

      return res.json(noAnswereds);
    }
    /**
     * All Help Orders without answers
     */
    const noAnswereds = await HelpOrder.findAll({
      where: { answer: null },
      include: [{
        model: Student,
        as: 'student',
        attibutes: ['name', 'email'],
      }],
      limit: 20,
      offset: (page - 1) * 20,
    });
    if (noAnswereds) {
      return res.json(noAnswereds);
    }
    /**
     * If not found
     */
    return res.status(400).json({ error: 'All questions answereds.' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Form validation fails' });
    }

    const student_id = req.params.id;
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student no enrollment' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrder.findOne({
      where: { student_id, question },
    });

    if (helpOrder) {
      return res.status(400).json({ error: 'Your question alredy exists.' });
    }

    const newHelpOrder = await HelpOrder.create({ student_id, question });

    return res.json(newHelpOrder);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    const helpOrder = await HelpOrder.findByPk(req.params.id, {
      include: [{
        model: Student,
        as: 'student',
        attibutes: ['name', 'email'],
      }],
    });
    if (!helpOrder) {
      res.status(400).json({ error: 'The Help Order you want answer, no exists.' });
    }

    if (helpOrder.answer) {
      res.status(400).json({ error: 'The Help Order already answered' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Answer text is invalid, verify!' });
    }

    const { answer } = req.body;

    const answer_at = new Date();

    const answering = await helpOrder.update({
      answer,
      answer_at,
    });

    await Queue.add(HelpOrderMail.key, {
      answering,
    });

    return res.json(answering);
  }
}

export default new HelpOrderController();
