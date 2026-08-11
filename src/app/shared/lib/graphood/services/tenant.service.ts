import type { GraphoodClient } from "../graphood-client";

export interface Tenant {
    id: string;
    slug: string;
    name: string;
    status: string;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    timezone?: string | null;
    branding?: {
        logoUrl?: string | null;
        primaryColor?: string | null;
    };
}

export interface TenantInfo {
    success: boolean;
    data: {
        tenant: Tenant;
    };
}

export async function getTenantDetails(
    tenantSlug: string,
    client: GraphoodClient,
): Promise<TenantInfo> {
    return client.request<TenantInfo>(
        `/api/developer/v1/tenant?tenantSlug=${encodeURIComponent(tenantSlug)}`
    );
}
