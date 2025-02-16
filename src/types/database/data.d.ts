export type Footprint = {
    accountId: string;
    loggedAt: number;
    action: "login" | "logout" | "signup" | "create channel" |
                "create event" | "cancel event" | 
                "create session" | "cancel session" | "request to join";
}

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
        state: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    };
    addresses?: {
        fullAddress: string;
        state: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    }[];
}

export type Channel = {
    channelId?: string;
    channelName: string;
    channelDesc: string;
    privacy: "public" | "private";
    ownerId: string;
    category: string;
    createdAt?: number;
};

export type Subscription = {
    subscriptionId?: string;
    subscriberId: string;
    channelId: string;
    status: "pending" | "subscribed";
    subscribedAt?: number;
    unSubscribedAt?: number;
};

export type Event = { // This is the transitional type, which actually is the session, as now we use channel instead of event
    eventId?: string;
    channelId: string;
    eventName: string;
    eventAbout: string;
    category: string;
    organizerId: string;
    createdAt?: number;
    status: "active" | "cancelled" | "closed";
    startTime: number;
    duration: number;
    location: {
        fullAddress: string;
        state: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    };
    maxParticipants: number;
    genderRestriction: "none" | "male" | "female";
    ageRestriction: {
        min: number;
        max: number;
    };
    autoApprove: boolean;
}

export type RSVP = {
    rsvpId?: string;
    eventId: string;
    accountId: string;
    status: "pending" | "approved";
}

export type Chat = {
    chatId?: string;
    channelId: string;
    senderId: string;
    message: string;
    type: "text" | "image" | "event";
    sentAt?: number;
}
