import exp from 'constants';

export * as user from './user';

import * as user from './user';

export async function init(): Promise<void> {
    await user.main();
}
