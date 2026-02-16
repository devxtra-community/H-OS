import { z } from 'zod';

export const StaffSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  role: z.string(),
  job_title: z.string(),
});

export const StaffLoginResponseSchema = z.object({
  accessToken: z.string(),
  staff: StaffSchema,
});

export type Staff = z.infer<typeof StaffSchema>;
export type StaffLoginResponse = z.infer<typeof StaffLoginResponseSchema>;
