export type Data = {
    uuid: string;
    email: string;
    role: string;
    telegram_id: number | null;
    subscriptions: string;
};

export type User = {
    uuid: string;
    email: string;
    role: string;
    telegramId: number | null;
    subscriptions: string;
};

export type TelegramUser = User & { telegramId: number };
