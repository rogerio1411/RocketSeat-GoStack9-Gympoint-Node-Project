import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();
    res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      stature: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fail in validation form.' });
    }
    const studentExists = await Student.findOne({ where: { email: req.body.email } });

    if (studentExists) {
      req.studentId = studentExists.id;
      return res.status(400).json({ error: 'Student exists.' });
    }

    const student = await Student.create(req.body);

    return res.json({ student });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      stature: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Form validation fails.' });
    }
    const student = await Student.findOne({ where: { email: req.body.email } });

    if (!student) {
      res.status(400).json({ error: 'Sorry, student not found.' });
    }

    const {
      name, email, age, weight, stature,
    } = req.body;
    const studentUpdated = await student.update({
      name, email, age, weight, stature,
    });

    return res.json(studentUpdated);
  }
}

export default new StudentController();
