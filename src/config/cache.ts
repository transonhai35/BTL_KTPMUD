export const cacheConfig = {
    ttl: Number(process.env.CACHE_TTL || 3600*1000),
    max: Number(process.env.CACHE_MAX || 100000),
    prefix: process.env.CACHE_PREFIX || ''
};
