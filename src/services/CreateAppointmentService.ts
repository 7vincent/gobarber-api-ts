import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const appoitmentDate = startOfHour(date);
    const findAppointmentsEqual = await appointmentsRepository.findByDate(
      appoitmentDate
    );

    if (findAppointmentsEqual) {
      throw new AppError('erro, agendamento mesmo horario!');
    }
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appoitmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
