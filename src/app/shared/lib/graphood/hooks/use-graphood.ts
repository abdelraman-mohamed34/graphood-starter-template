import { useQuery } from "@tanstack/react-query";
import { graphoodClient } from "../client";
import { graphoodQueryKeys } from "../query-keys";
import {
    checkGraphoodHealth,
    getDeveloperMe,
    getMemberships,
    getSubscriptionDetails,
    getTenantDetails,
    type Tenant,
} from "../services";

interface UseGraphoodOptions {
    tenantSlug: string;
    initialTenant?: Tenant;
    enabled?: boolean;
}

export function useGraphood({
    tenantSlug: requestedTenantSlug,
    initialTenant,
    enabled = true,
}: UseGraphoodOptions) {
    const healthQuery = useQuery({
        queryKey: graphoodQueryKeys.health,
        queryFn: () => checkGraphoodHealth(graphoodClient),
        refetchOnWindowFocus: true,
        refetchInterval: 300000,
    });

    const meQuery = useQuery({
        queryKey: graphoodQueryKeys.me(requestedTenantSlug),
        queryFn: () => getDeveloperMe(requestedTenantSlug, graphoodClient),
        enabled: enabled && Boolean(requestedTenantSlug),
    });

    const tenantQuery = useQuery({
        queryKey: graphoodQueryKeys.tenant(requestedTenantSlug),
        queryFn: () => getTenantDetails(requestedTenantSlug, graphoodClient),
        enabled: enabled && Boolean(requestedTenantSlug),
    });

    const membershipsQuery = useQuery({
        queryKey: graphoodQueryKeys.memberships(requestedTenantSlug),
        queryFn: () => getMemberships(requestedTenantSlug, graphoodClient),
        enabled: enabled && Boolean(requestedTenantSlug),
    });

    const subscriptionQuery = useQuery({
        queryKey: graphoodQueryKeys.subscription(requestedTenantSlug),
        queryFn: () => getSubscriptionDetails(requestedTenantSlug, graphoodClient),
        enabled: enabled && Boolean(requestedTenantSlug),
    });

    const tenantId =
        tenantQuery.data?.data.tenant.id ??
        meQuery.data?.data?.tenant.id ??
        initialTenant?.id ??
        null;

    const tenantSlug =
        tenantQuery.data?.data.tenant.slug ??
        meQuery.data?.data?.tenant.slug ??
        initialTenant?.slug ??
        requestedTenantSlug;

    const memberships = membershipsQuery.data?.data.memberships ?? [];
    const activeRoles = new Set(
        memberships
            .filter((membership) => membership.status === "ACTIVE")
            .map((membership) => membership.role),
    );
    const role = activeRoles.size === 1
        ? activeRoles.values().next().value ?? null
        : null;

    return {
        health: healthQuery.data,
        me: meQuery.data,
        tenant: tenantQuery.data,
        memberships: membershipsQuery.data,

        tenantId,
        tenantSlug,
        role,
        subscription: meQuery.data?.data?.subscription ?? null,
        capabilities: meQuery.data?.data?.capabilities ?? null,

        healthQuery,
        meQuery,
        tenantQuery,
        membershipsQuery,
        subscriptionQuery,

        queries: {
            health: healthQuery,
            me: meQuery,
            tenant: tenantQuery,
            memberships: membershipsQuery,
            subscription: subscriptionQuery,
        },

        isLoading: [
            healthQuery,
            meQuery,
            tenantQuery,
            membershipsQuery,
            subscriptionQuery,
        ].some((query) => query.isLoading),

        isFetching: [
            healthQuery,
            meQuery,
            tenantQuery,
            membershipsQuery,
            subscriptionQuery,
        ].some((query) => query.isFetching),

        isError: !tenantId && tenantQuery.isError,
    };
}
