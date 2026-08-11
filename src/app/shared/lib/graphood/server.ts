import "server-only";

import type { GraphoodClient } from "./graphood-client";
import { createGraphoodClient } from "./request";

const serverTransport = createGraphoodClient({
    baseUrl: process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL,
    apiKey: process.env.GRAPHOOD_SERVER_API_KEY,
    configNames: {
        baseUrl: "NEXT_PUBLIC_GRAPHOOD_BASE_URL",
        apiKey: "GRAPHOOD_SERVER_API_KEY",
    },
});

export const graphoodServerClient: GraphoodClient = {
    request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const serverOptions = options.cache === "no-store"
            ? options
            : {
                ...options,
                next: {
                    revalidate: 60,
                    ...options.next,
                },
            };

        return serverTransport.request<T>(endpoint, serverOptions);
    },
};
