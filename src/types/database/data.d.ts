export type Footprint = {
    userId: string;
    loggedAt: number;
    action: "login" | "logout" | "signup" | "create channel" |
                "create event" | "cancel event" | 
                "create session" | "cancel session" | "request to join";
}

export type User = {
    userId?: string;
    userEmail: string;
    userName: string;
    userPasswordHash: string;
    userProfileImgUrl: string;
    userProfileImgDeleteUrl: string;
    userAge: number;
    userGender: string;
}

export type Region = {
    userId: string;
    userDefaultAddress?: {
        fullAddress: string;
        state: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    };
    userAddresses?: {
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
    channelPrivacy: "public" | "private";
    ownerId: string;
    category: string;
    createdAt?: number;
};

export type Subscription = {
    subscriptionId?: string;
    subscriberId: string;
    channelId: string;
    subscriptionStatus: "pending" | "subscribed";
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
    eventStatus: "active" | "cancelled" | "closed";
    startTime: number;
    eventDuration: number;
    eventLocation: {
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
    userId: string;
    rsvpStatus: "pending" | "approved";
}

export type Chat = {
    chatId?: string;
    channelId: string;
    senderId: string;
    message: string;
    type: "text" | "image" | "event";
    sentAt?: number;
}
