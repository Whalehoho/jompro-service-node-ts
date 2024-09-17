import cron from 'node-schedule';
import pg from '@/services/database/service';

cron.scheduleJob('*/5 * * * *', async function () { // Every 5 minutes
    await pg.raw(`
        UPDATE session 
        SET status = 'closed' 
        WHERE status = 'active' 
        AND start_time + (duration * INTERVAL '1 second') <= NOW();
    `);
});

// cron.scheduleJob('* * * * *', async function () { // Every 1 minutes
//     await pg.raw(`
//         UPDATE session 
//         SET status = 'closed' 
//         WHERE status = 'active' 
//         AND start_time + (duration * INTERVAL '1 second') <= NOW();
//     `);
// });