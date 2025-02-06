import { User } from '~/database/data';
import pg from './service';
import { toCamel, toDate } from '@/util';

const f: Record<keyof User, string> = {
    accountId: 'account_id',
    email: 'email',
    userName: 'user_name',
    passwordHash: 'password_hash',
    profileImgUrl: 'profile_img_url',
    profileImgDeleteUrl: 'profile_img_delete_url',
    age: 'age',
    gender: 'gender',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('user'))) {
        await pg.schema.createTable('user', function (table) {
            table.bigIncrements('account_id').primary();
            table.string('email').notNullable().unique();
            table.string('user_name').notNullable();
            table.string('password_hash').notNullable();
            table.string('profile_img_url').nullable();
            table.string('profile_img_delete_url').nullable();
            table.integer('age').nullable();
            table.string('gender').nullable();
        });
        await pg.raw("ALTER SEQUENCE user_account_id_seq RESTART WITH 758");
    }
}

export async function all(): Promise<User[] | undefined> {
    return pg('user').select(allFields);
}

export async function getByEmail(email: string): Promise<User | undefined> {
    return pg('user').select(allFields).where('email', '=', email).first();
}

export async function getByAccountId(accountId: string): Promise<User | undefined> {
    return pg('user').select(allFields).where('account_id', '=', accountId).first();
}

export async function getProfileUrlbyAccountId(accountId: string): Promise<string | undefined> {
    return pg('user').select('profile_img_url').where('account_id', '=', accountId).first();
}

export async function update(user: User): Promise<User> {
    const query = pg('user').insert({
        account_id: user.accountId,
        email: user.email,
        user_name: user.userName,
        password_hash: user.passwordHash,
        profile_img_url: user.profileImgUrl,
        profile_img_delete_url: user.profileImgDeleteUrl,
        age: user.age,
        gender: user.gender,
    }).onConflict('account_id').merge().returning('*');
    
    return (await query).pop();
}

export async function insert(user: User): Promise<string> {
    
    const existingUser = await pg('user').select('email').where('email', '=', user.email).first();
    if (existingUser) {
        return 'email already exists';
    }
    const query = pg('user').insert({
        email: user.email,
        password_hash: user.passwordHash,
        user_name: user.userName
    }).returning('*');
    await query;
    return 'signup successful';
}

export async function remove(email: string): Promise<void> {
    await pg('user').delete().where('email', '=', email);
}

export async function main(): Promise<void> {
    await create();
}