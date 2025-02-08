import exp from 'constants';


import * as user from './user';
import * as region from './region';
import * as channel from './channel';
import * as subscription from './subscription';
import * as event from './event';
import * as rsvp from './rsvp';
import * as footprint from './footprint';
import * as chat from './chat';

export * as user from './user';
export * as region from './region';
export * as channel from './channel';
export * as subscription from './subscription';
export * as event from './event';
export * as rsvp from './rsvp';
export * as footprint from './footprint';
export * as chat from './chat';

export async function init(): Promise<void> {
    await user.main();
    await region.main();
    await channel.main();
    await subscription.main();
    await event.main();
    await rsvp.main();
    await footprint.main();
    await chat.main();
}
