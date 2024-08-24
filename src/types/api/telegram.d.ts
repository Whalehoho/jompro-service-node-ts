import type { Controller } from '~/api';
import type TelegramBot from 'node-telegram-bot-api';

export type RefreshToken = Controller;

export type HandleMessage = Controller<
    { message: string | null; parse_mode?: TelegramBot.ParseMode },
    never,
    // @ts-ignore
    TelegramBot.Message
>;
