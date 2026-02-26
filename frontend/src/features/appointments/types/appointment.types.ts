export type Slot = string;

export interface BookAppointmentPayload {
  doctorId: string;
  appointmentTime: string;
  durationMinutes?: number;
}
