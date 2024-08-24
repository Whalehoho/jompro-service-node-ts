export type User = {
    accountId?: string;
    email: string;
    userName: string;
    passwordHash: string;
    profileImgUrl: string;
    profileImgDeleteUrl: string;
    age: number;
    gender: string;
    savedAddresses: Record<string, string>;
}