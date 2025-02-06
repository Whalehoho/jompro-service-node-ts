import type { Controller } from '~/api';
import { User } from '~/database/data';

export type All = Controller<{ data: User[] | undefined }>;

export type GetByEmail = Controller<{ data?: User }, { email: string }>;

export type GetByAccountId = Controller<{ data?: User }, { accountId: string }>;

export type Update = Controller<{ data: string }, never, User>;

export type Remove = Controller<{ data: string }, { email: string }>;

export type UpdateProfileImg = Controller<{ data: string }, { email: string, profileImgUrl: string, profileImgDeleteUrl: string }>;

export type UpdateProfile = Controller<
    { data: string },
    never,
    {
        accountId: string;
        userName: string;
        email: string;
        oldPassword: string;
        newPassword: string;
        age: number;
        gender: string;
    }
>;

export type GetProfileUrlbyAccountId = Controller<{ data: string | undefined }, { accountId: string }>;
