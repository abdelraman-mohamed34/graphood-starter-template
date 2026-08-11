import type { GraphoodClient } from "../graphood-client";

export interface HealthCheckResponse {
    success: boolean;
    data: {
        status: string;
        version: string;
        timestamp: string;
        latencyMs: number;
        checks: {
            api: string;
            database: string;
        };
    };
}

export async function checkGraphoodHealth(
    client: GraphoodClient,
): Promise<HealthCheckResponse> {
    return client.request<HealthCheckResponse>(
        "/api/developer/v1/health",
        {
            cache: "no-store",
        }
    );
}
