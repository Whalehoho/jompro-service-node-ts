export default async function loader(): Promise<void> {
    
    await (await import('@/services/database')).init();
    await import('@/api');
    await import('@/jobs/status');
}
