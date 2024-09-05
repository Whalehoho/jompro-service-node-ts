import exp from 'constants';


import * as user from './user';
import * as region from './region';

export * as user from './user';
export * as region from './region';

export async function init(): Promise<void> {
    await user.main();
    await region.main();
}
