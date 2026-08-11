import 'client-only';

import { createGraphoodClient } from './request';

export const graphoodClient = createGraphoodClient({
    baseUrl: process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL,
    apiKey: process.env.NEXT_PUBLIC_GRAPHOOD_API_KEY,
    configNames: {
        baseUrl: 'NEXT_PUBLIC_GRAPHOOD_BASE_URL',
        apiKey: 'NEXT_PUBLIC_GRAPHOOD_API_KEY',
    },
});