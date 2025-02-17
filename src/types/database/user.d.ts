export type Data = {
    uuid: string;
    userEmail: string;
    role: string;
    telegram_id: number | null;
    subscriptions: string;
};

export type User = {
    uuid: string;
    userEmail: string;
    role: string;
    telegramId: number | null;
    subscriptions: string;
};

export type TelegramUser = User & { telegramId: number };
