import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { answering } = data;

    await Mail.sendMail({
      to: `${answering.student.name} <${answering.student.email}>`,
      subject: 'Solicitação de auxílio atendida',
      template: 'helpOrder',
      context: {
        student: answering.student.name,
        question: answering.question,
        answer: answering.answer,
        answerDate: format(parseISO(answering.answer_at), "'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt }),
      },
    });
  }
}

export default new HelpOrderMail();
