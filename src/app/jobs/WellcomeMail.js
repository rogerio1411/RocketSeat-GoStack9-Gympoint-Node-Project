
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WellcomeMail {
  get key() {
    return 'WellcomeMail';
  }

  async handle({ data }) {
    const { newEnrollment, student, plan } = data;
    console.log('newEnrollment', newEnrollment, 'student', student, 'plan', plan);
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem vindo!',
      template: 'wellcome',
      context: {
        student: student.name,
        plan: plan.title,
        date_start: format(parseISO(newEnrollment.start_date), "'dia' dd 'de' MMMM", {
          locale: pt,
        }),
        date_end: format(parseISO(newEnrollment.end_date), "'dia' dd 'de' MMMM", {
          locale: pt,
        }),
        price: newEnrollment.price,
      },
    });
  }
}

export default new WellcomeMail();
