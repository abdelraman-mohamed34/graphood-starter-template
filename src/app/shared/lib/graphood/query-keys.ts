export const graphoodQueryKeys = {
    health: ['graphood', 'health'] as const,
    me: (tenantSlug: string) => ['graphood', 'me', tenantSlug] as const,
    tenant: (tenantSlug: string) => ['graphood', 'tenant', tenantSlug] as const,
    memberships: (tenantSlug: string) =>
        ['graphood', 'memberships', tenantSlug] as const,
    subscription: (tenantSlug: string) =>
        ['graphood', 'subscription', tenantSlug] as const,
};
