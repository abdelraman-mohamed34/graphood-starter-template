import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { dehydrate } from "@tanstack/react-query";

import "./globals.css";

import Providers from "./shared/lib/providers/providers";
import { getQueryClient } from "./shared/lib/react-query/get-query-client";
import {
  checkGraphoodHealth,
  getMemberships,
  getTenantDetails,
} from "./shared/lib/graphood/services";
import { graphoodServerClient } from "./shared/lib/graphood/server";
import { graphoodQueryKeys } from "./shared/lib/graphood/query-keys";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graphood Market",
  description: "Multi-tenant Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();

  const tenantSlug = headersList.get("x-tenant-slug") || "";
  const demoTenantSlug = process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG || "sandbox";

  const queryClient = getQueryClient();

  let tenantData = null;
  let resolvedTenantSlug = tenantSlug;
  let isDemoMode = false;

  try {
    tenantData = await queryClient.fetchQuery({
      queryKey: graphoodQueryKeys.tenant(tenantSlug),
      queryFn: () => getTenantDetails(tenantSlug, graphoodServerClient),
    });
  } catch {
    console.warn(`[Tenant Resolution] "${tenantSlug}" was not found; using demo tenant.`);

    try {
      resolvedTenantSlug = demoTenantSlug;
      isDemoMode = true;
      tenantData = await queryClient.fetchQuery({
        queryKey: graphoodQueryKeys.tenant(demoTenantSlug),
        queryFn: () => getTenantDetails(demoTenantSlug, graphoodServerClient),
      });
    } catch (demoError) {
      console.error("[Demo Tenant Resolution Error]:", demoError);
    }
  }

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: graphoodQueryKeys.health,
      queryFn: () => checkGraphoodHealth(graphoodServerClient),
    }),
    queryClient.prefetchQuery({
      queryKey: graphoodQueryKeys.memberships(resolvedTenantSlug),
      queryFn: () => getMemberships(resolvedTenantSlug, graphoodServerClient),
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  const tenant = tenantData?.data.tenant;

  const isValidTenant = Boolean(
    tenantData?.success &&
    tenant?.id &&
    tenant?.status === "ACTIVE"
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {isValidTenant ? (
          <Providers dehydratedState={dehydratedState} tenantSlug={resolvedTenantSlug}>
            {isDemoMode && (
              <div
                role="status"
                dir="rtl"
                className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-950"
              >
                أنت الآن في البيئة التجريبية لأن المتجر «{tenantSlug}» غير موجود.
              </div>
            )}
            {children}
          </Providers>
        ) : (
          <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 text-slate-800">
            <div className="text-center dir-rtl">
              <h1 className="text-6xl font-extrabold text-slate-900">404</h1>
              <p className="mt-4 text-xl font-medium">
                المتجر غير موجود أو غير مفعل حالياً.
              </p>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
