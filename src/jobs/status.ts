import cron from 'node-schedule';
import pg from '@/services/database/service';
import { addEvent, getRecommendations } from '@/services/event_recommender';

cron.scheduleJob('*/5 * * * *', async function () { // Every 5 minutes
    await pg.raw(`
        UPDATE "EVENT_T" 
        SET event_status = 'closed' 
        WHERE event_status = 'active' 
        AND start_time + make_interval(secs := event_duration) <= NOW();
    `);
});

// cron.scheduleJob('* * * * *', async function () { // Every 1 minutes
//     await pg.raw(`
//         UPDATE "EVENT_T"
//         SET event_status = 'closed' 
//         WHERE event_status = 'active' 
//         AND start_time + (event_duration * INTERVAL '1 second') <= NOW();
//     `);
// });