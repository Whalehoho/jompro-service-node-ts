import exp from 'constants';


import * as user from './user';
import * as region from './region';
import * as event from './event';
import * as session from './session';
import * as footprint from './footprint';

export * as user from './user';
export * as region from './region';
export * as event from './event';
export * as session from './session';
export * as footprint from './footprint';

export async function init(): Promise<void> {
    await user.main();
    await region.main();
    await event.main();
    await session.main();
    await footprint.main();
}
