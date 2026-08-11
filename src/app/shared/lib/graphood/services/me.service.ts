import type { GraphoodClient } from "../graphood-client";

export interface GraphoodSubscription {
    plan: string;
    status: string;
    licenseType: string;
    billingInterval: string;
}

export interface GraphoodCapabilities {
    api: boolean;
    reports: boolean;
    wordAssistant: boolean;
}

export interface DeveloperMeResponse {
    success: boolean;
    data?: {
        system: {
            id: string;
            name: string;
            slug: string;
            description: string;
            tags: string[];
            icon_url: string | null;
            is_public: boolean;
        };
        tenant: {
            id: string;
            slug: string;
        };
        subscription: GraphoodSubscription;
        capabilities: GraphoodCapabilities;
    };
}

export async function getDeveloperMe(
    tenantSlug: string,
    client: GraphoodClient,
): Promise<DeveloperMeResponse> {
    return client.request<DeveloperMeResponse>(
        `/api/developer/v1/me?tenantSlug=${encodeURIComponent(tenantSlug)}`
    );
}
