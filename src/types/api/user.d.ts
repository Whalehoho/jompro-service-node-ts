import type { Controller } from '~/api';
import { User } from '~/database/data';

export type All = Controller<{ data: User[] | undefined }>;

export type GetByEmail = Controller<{ data?: User }, { userEmail: string }>;

export type GetByAccountId = Controller<{ data?: User }, { userId: string }>;

export type Update = Controller<{ data: string }, never, User>;

export type Remove = Controller<{ data: string }, { userEmail: string }>;

export type UpdateProfileImg = Controller<{ data: string }, { userEmail: string, userProfileImgUrl: string, userProfileImgDeleteUrl: string }>;

export type UpdateProfile = Controller<
    { data: string },
    never,
    {
        userId: string;
        userName: string;
        userEmail: string;
        oldPassword: string;
        newPassword: string;
        userAge: number;
        userGender: string;
    }
>;

export type GetProfileUrlbyAccountId = Controller<{ data: string | undefined }, { userId: string }>;

export type VerifyUserFace = Controller<{ data: string }, never, { userId: string, imgURL: string }>;
