import type { GraphoodClient } from '../graphood-client';

export interface GraphoodMembership {
    id: string;
    role: string;
    permissions: string[];
    status: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    joinedAt: string;
    createdAt: string;
}

export interface MembershipsResponse {
    success: boolean;
    data: {
        memberships: GraphoodMembership[];
    };
}

export async function getMemberships(
    tenantSlug: string,
    client: GraphoodClient,
): Promise<MembershipsResponse> {

    return client.request<MembershipsResponse>(
        `/api/developer/v1/memberships?tenantSlug=${encodeURIComponent(tenantSlug)}`
    );
}
