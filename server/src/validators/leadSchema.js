import { z } from 'zod';
import { SERVICES } from '../models/Lead.js';

export const leadSchema = z.object({
  name: z
    .string({ required_error: 'Please enter your full name.' })
    .trim()
    .min(2, 'Please enter your full name.')
    .max(100, 'Name is too long.'),
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.')
    .max(254, 'Email is too long.'),
  phone: z
    .string({ required_error: 'Please enter your phone or WhatsApp number.' })
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, 'Please enter a valid phone or WhatsApp number.'),
  service: z.enum(SERVICES, { errorMap: () => ({ message: 'Please choose a service.' }) }),
  message: z
    .string({ required_error: 'Please tell us a little about your work.' })
    .trim()
    .min(10, 'Please tell us a little more (at least 10 characters).')
    .max(2000, 'Message is too long (2000 characters maximum).'),
});
