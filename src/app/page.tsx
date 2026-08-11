'use client'

import { useGraphood } from "./shared/lib/graphood/hooks/use-graphood";

export default function Home() {
  const { tenant, me, subscription, memberships, health, isLoading } = useGraphood({ tenantSlug: "sandbox" })

  return (
    <main className=''>
      Graphood Starter Template
    </main>
  );
}