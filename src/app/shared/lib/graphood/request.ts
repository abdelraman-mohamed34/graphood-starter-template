import type { GraphoodClient } from './graphood-client';

interface GraphoodRequestConfig {
    baseUrl: string | undefined;
    apiKey: string | undefined;
    configNames: {
        baseUrl: string;
        apiKey: string;
    };
}

function requireConfig(value: string | undefined, name: string): string {
    if (!value) {
        throw new Error(`Missing required Graphood configuration: ${name}`);
    }

    return value;
}

function getErrorMessage(body: unknown): string | undefined {
    if (typeof body !== 'object' || body === null || !('error' in body)) {
        return undefined;
    }

    const error = body.error;

    if (typeof error === 'string') {
        return error;
    }

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
    ) {
        return error.message;
    }

    return undefined;
}

function buildUrl(baseUrl: string, endpoint: string): string {
    return `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
}

export function createGraphoodClient({
    baseUrl,
    apiKey,
    configNames,
}: GraphoodRequestConfig): GraphoodClient {
    return {
        async request<T>(
            endpoint: string,
            options: RequestInit = {},
        ): Promise<T> {
            const resolvedBaseUrl = requireConfig(baseUrl, configNames.baseUrl);
            const resolvedApiKey = requireConfig(apiKey, configNames.apiKey);
            const { headers, ...requestOptions } = options;
            const requestHeaders = new Headers(headers);

            if (!requestHeaders.has('Content-Type')) {
                requestHeaders.set('Content-Type', 'application/json');
            }

            requestHeaders.set('Authorization', `Bearer ${resolvedApiKey}`);

            const response = await fetch(buildUrl(resolvedBaseUrl, endpoint), {
                ...requestOptions,
                headers: requestHeaders,
            });

            if (!response.ok) {
                const errorBody: unknown = await response.json().catch(() => null);
                const apiMessage = getErrorMessage(errorBody);

                throw new Error(
                    apiMessage ??
                    `Graphood API error: ${response.status} ${response.statusText}`,
                );
            }

            try {
                return await response.json() as T;
            } catch (error) {
                throw new Error(
                    `Graphood API returned invalid JSON for ${endpoint}`,
                    { cause: error },
                );
            }
        },
    };
}
