import exp from 'constants';


import * as user from './user';
import * as region from './region';
import * as event from './event';
import * as eventInstance from './eventInstance';

export * as user from './user';
export * as region from './region';
export * as event from './event';
export * as eventInstance from './eventInstance';

export async function init(): Promise<void> {
    await user.main();
    await region.main();
    await event.main();
    await eventInstance.main();
}
