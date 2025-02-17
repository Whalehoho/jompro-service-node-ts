import { User } from '~/database/data';
import pg from './service';
import { toCamel, toDate } from '@/util';

const f: Record<keyof User, string> = {
    userId: 'user_id',
    userEmail: 'user_email',
    userName: 'user_name',
    userPasswordHash: 'user_password_hash',
    userProfileImgUrl: 'user_profile_img_url',
    userProfileImgDeleteUrl: 'user_profile_img_delete_url',
    userAge: 'user_age',
    userGender: 'user_gender',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('USER_T'))) {
        await pg.schema.createTable('USER_T', function (table) {
            table.bigIncrements('user_id').primary();
            table.string('user_email').notNullable().unique();
            table.string('user_name').notNullable();
            table.string('user_password_hash').notNullable();
            table.string('user_profile_img_url').nullable();
            table.string('user_profile_img_delete_url').nullable();
            table.integer('user_age').nullable();
            table.string('user_gender').nullable();
        });
        await pg.raw("ALTER SEQUENCE user_usr_id_seq RESTART WITH 758");
    }
}

export async function all(): Promise<User[] | undefined> {
    return pg('USER_T').select(allFields);
}

export async function getByEmail(userEmail: string): Promise<User | undefined> {
    return pg('USER_T').select(allFields).where('user_email', '=', userEmail).first();
}

export async function getByAccountId(userId: string): Promise<User | undefined> {
    return pg('USER_T').select(allFields).where('user_id', '=', userId).first();
}

export async function getProfileUrlbyAccountId(userId: string): Promise<string | undefined> {
    return pg('USER_T').select('user_profile_img_url').where('user_id', '=', userId).first();
}

export async function update(user: User): Promise<User> {
    const query = pg('USER_T').insert({
        user_id: user.userId,
        user_email: user.userEmail,
        user_name: user.userName,
        user_password_hash: user.userPasswordHash,
        user_profile_img_url: user.userProfileImgUrl,
        user_profile_img_delete_url: user.userProfileImgDeleteUrl,
        user_age: user.userAge,
        user_gender: user.userGender,
    }).onConflict('user_id').merge().returning('*');
    
    return (await query).pop();
}

export async function insert(user: User): Promise<string> {
    
    const existingUser = await pg('USER_T').select('user_email').where('user_email', '=', user.userEmail).first();
    if (existingUser) {
        return 'email already exists';
    }
    const query = pg('USER_T').insert({
        user_email: user.userEmail,
        user_password_hash: user.userPasswordHash,
        user_name: user.userName
    }).returning('*');
    await query;
    return 'signup successful';
}

export async function remove(userEmail: string): Promise<void> {
    await pg('USER_T').delete().where('user_email', '=', userEmail);
}

export async function main(): Promise<void> {
    await create();
}