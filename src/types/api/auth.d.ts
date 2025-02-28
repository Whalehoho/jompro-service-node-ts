import type { Controller } from '~/api';
import { User } from '~/database/data';

export type Create = Controller<{ data: string }, never, { userEmail: string, password: string, userName: string}>;

export type Login = Controller<{ data: string }, { userEmail: string, password: string }>;

export type RequestPasswordReset = Controller<{ data: string }, never, { userEmail: string }>;

export type VerifyPasswordResetCode = Controller<{ data: string }, never, { email: string, code: string }>;

export type ResetPassword = Controller<{ data: string }, never, { email: string, password: string }>;