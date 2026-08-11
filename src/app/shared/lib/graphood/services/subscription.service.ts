import type { GraphoodClient } from "../graphood-client";
import type {
    GraphoodCapabilities,
    GraphoodSubscription,
} from "./me.service";

export interface SubscriptionInfo {
    success: boolean;
    data: {
        subscription: GraphoodSubscription;
        capabilities: GraphoodCapabilities;
    };
}

export async function getSubscriptionDetails(
    tenantSlug: string,
    client: GraphoodClient,
): Promise<SubscriptionInfo> {
    return client.request<SubscriptionInfo>(
        `/api/developer/v1/subscription?tenantSlug=${encodeURIComponent(tenantSlug)}`
    );
}
