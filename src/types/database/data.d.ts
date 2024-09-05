export type User = {
    accountId?: string;
    email: string;
    userName: string;
    passwordHash: string;
    profileImgUrl: string;
    profileImgDeleteUrl: string;
    age: number;
    gender: string;
}

export type Region = {
    accountId: string;
    defaultAddress?: {
        fullAddress: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    };
    addresses?: {
        fullAddress: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    }[];
}
