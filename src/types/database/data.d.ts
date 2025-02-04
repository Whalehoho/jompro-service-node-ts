export type Footprint = {
    accountId: string;
    loggedAt: number;
    action: "login" | "logout" | "signup" | 
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

export type Channel = {
    channelId: string;
    channelName: string;
    channelDesc: string;
    privacy: "public" | "private";
    ownerId: string;
    category: string;
    createdAt?: number;
};

export type Subscription = {
    subscriptionId: string;
    subscriberId: string;
    channelId: string;
    status: "subscribed" | "pending" | "rejected" | "unsubscribed";
    subscribedAt?: number;
    unSubscribedAt?: number;
};

export type Event = {
    eventId?: string;
    hostId: string;
    coHosts?: string[];
    subscribers?: string[];
    category: string;
    eventName: string;
    eventDesc: string;
    pattern: "one-time" | "regular";
    createdAt?: number;
    status: "active" | "cancelled" | "closed";
}

export type Session = {
    eventId: string;
    sessionId?: string;
    sessionName: string;
    sessionDesc: string;
    category: string;
    organizerId: string; // could be host or co-host
    createdAt?: number;
    status: "active" | "cancelled" | "closed";
    startTime: number;
    duration: number;
    location: {
        fullAddress: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    };
    maxParticipants: number;
    participants?: {
        participantId: string;
        status: "pending" | "confirmed" | "declined";
    }[];
    genderRestriction: "none" | "male" | "female";
    ageRestriction: {
        min: number;
        max: number;
    };
    autoApprove: boolean;
}