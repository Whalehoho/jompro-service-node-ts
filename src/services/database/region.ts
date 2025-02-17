import { Region } from '~/database/data';
import pg from './service';
import { toCamel } from '@/util';

const f: Record<keyof Region, string> = {
    userId: 'user_id',
    userDefaultAddress: 'user_default_address',
    userAddresses: 'user_addresses',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('USER_REGION_T'))) {
        await pg.schema.createTable('USER_REGION_T', function (table) {
            table.string('user_id').primary();
            table.jsonb('user_default_address');
            table.jsonb('user_addresses').notNullable();
        });
    }
}

export async function all(): Promise<Region[] | undefined> {
    return pg('USER_REGION_T').select(allFields);
}

export async function getByAccountId(userId: string): Promise<Region | undefined> {
    return pg('USER_REGION_T').select(allFields).where('user_id', '=', userId).first();
}

export async function update(region: Region): Promise<Region> {
    const query = pg('USER_REGION_T').insert({
        user_id: region.userId,
        user_default_address: region.userDefaultAddress,
        user_addresses: region.userAddresses,
    }).onConflict('user_id').merge().returning('*');
    
    return (await query).pop();
}

export async function remove(userId: string): Promise<void> {
    await pg('USER_REGION_T').where('user_id', '=', userId).del();
}

export async function updateDefault(region: Region): Promise<Region> {
    console.log('Update Default Region', region);
    const query = pg('USER_REGION_T').where('user_id', '=', region.userId).update({
        user_default_address: `${JSON.stringify(region.userDefaultAddress)}`,
    }).returning('*');
    
    return (await query).pop();
}

export async function addAddress(userId: string, address: { fullAddress: string, state: string, city: string, region: string, lat: number, lng: number }): Promise<string> {
    try {
        // Use pg driver to handle escaping and JSON formatting
        const result = await pg('USER_REGION_T')
            .where('user_id', '=', userId)
            .update({
                user_addresses: pg.raw(`
                    COALESCE(user_addresses, '[]'::jsonb) || ?::jsonb
                `, [JSON.stringify(address)]) // Safely format the address as a JSON object
            });

        if (result === 0) {
            // Insert the new address as an array into the jsonb column
            const insertResult = await pg('USER_REGION_T').insert({
                user_id: userId,
                user_addresses: JSON.stringify([address]), // Correctly format array of addresses for jsonb column
            });

            if (insertResult) {
                return 'success';
            } else {
                return 'failure';
            }
        }

        return 'success';
    } catch (error) {
        console.error('Error adding address:', error);
        return 'failure';
    }
}





export async function removeAddress(userId: string, address: { fullAddress: string, state: string, city: string, region: string, lat: number, lng: number }): Promise<void> {
    const addressToRemove = JSON.stringify(address).replace(/'/g, "''"); // Escape single quotes if necessary

    await pg.raw(`
      UPDATE "USER_REGION_T"
      SET user_addresses = (
        SELECT jsonb_agg(addr)
        FROM jsonb_array_elements(user_addresses) AS addr
        WHERE addr != '${addressToRemove}'::jsonb
      )
      WHERE user_id = ?;
    `, [userId]);
}


export async function main(): Promise<void> {
    await create();
}

