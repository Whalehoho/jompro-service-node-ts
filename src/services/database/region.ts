import { Region } from '~/database/data';
import pg from './service';
import { toCamel } from '@/util';

const f: Record<keyof Region, string> = {
    accountId: 'account_id',
    defaultAddress: 'default_address',
    addresses: 'addresses',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('region'))) {
        await pg.schema.createTable('region', function (table) {
            table.string('account_id').primary();
            table.jsonb('default_address');
            table.jsonb('addresses').notNullable();
        });
    }
}

export async function all(): Promise<Region[] | undefined> {
    return pg('region').select(allFields);
}

export async function getByAccountId(accountId: string): Promise<Region | undefined> {
    return pg('region').select(allFields).where('account_id', '=', accountId).first();
}

export async function update(region: Region): Promise<Region> {
    const query = pg('region').insert({
        account_id: region.accountId,
        default_address: region.defaultAddress,
        addresses: region.addresses,
    }).onConflict('account_id').merge().returning('*');
    
    return (await query).pop();
}

export async function remove(accountId: string): Promise<void> {
    await pg('region').where('account_id', '=', accountId).del();
}

export async function updateDefault(region: Region): Promise<Region> {
    const query = pg('region').where('account_id', '=', region.accountId).update({
        default_address: region.defaultAddress,
    }).returning('*');
    
    return (await query).pop();
}

export async function addAddress(accountId: string, address: { fullAddress: string, city: string, region: string, lat: number, lng: number }): Promise<void> {
    const result = await pg('region')
        .where('account_id', '=', accountId)
        .update({
            addresses: pg.raw(`
                jsonb_set(
                    COALESCE(addresses, '[]'::jsonb), 
                    '{999999}', 
                    '${JSON.stringify(address)}'::jsonb, 
                    true
                )
            `)
        });

    if (result === 0) {
        await pg('region').insert({
            account_id: accountId,
            addresses: JSON.stringify([address]),
        });
    }
}



export async function removeAddress(accountId: string, address: { fullAddress: string, city: string, region: string, lat: number, lng: number }): Promise<void> {
    await pg('region').where('account_id', '=', accountId).update({ addresses: pg.raw(`array_remove(addresses, '${JSON.stringify(address)}'::jsonb)`) });
}

export async function main(): Promise<void> {
    await create();
}

