import type { Controller } from '~/api';
import { Region } from '~/database/data';

export type All = Controller<{ data: Region[] | undefined }>;

export type GetByAccountId = Controller<{ data?: Region }, { accountId: string }>;

export type Update = Controller<{ data: string }, never, Region>;

export type Remove = Controller<{ data: string }, { accountId: string }>;

export type updateDefault = Controller<{ data: string }, never, Region>;

export type addAddress = Controller<
  { data: string },
  { accountId: string },
  { addressData: { fullAddress: string; state: string; city: string; region: string; lat: number; lng: number } }
>;

export type removeAddress = Controller<
  { data: string },
  { accountId: string },
  { addressData: { fullAddress: string; state: string; city: string; region: string; lat: number; lng: number } }
>;
