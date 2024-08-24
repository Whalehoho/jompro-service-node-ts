import type { Controller } from '~/api';
import { User } from '~/database/data';

export type Create = Controller<{ data: string }, never, { email: string, password: string, userName: string}>;

export type Login = Controller<{ data: string }, { email: string, password: string }>;
