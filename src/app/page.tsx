'use client';

import { useGraphood } from "./shared/lib/graphood/hooks/use-graphood";
import { useTenantSlug } from "./shared/lib/providers/providers";

export default function Home() {
  const rawTenantSlug = useTenantSlug();
  const tenantSlug = rawTenantSlug ?? "";
  const { tenant, me, subscription, memberships, health, isLoading } = useGraphood({ tenantSlug: tenantSlug });
  console.log(tenant)

  return (
    <main className="">
      Welcome {tenant?.data.tenant.name}
    </main>
  );
}