import { z } from 'zod';

export const PatientSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  isActive: z.boolean(),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  patient: PatientSchema,
});

export type Patient = z.infer<typeof PatientSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
