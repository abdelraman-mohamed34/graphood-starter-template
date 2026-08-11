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
  description: "Multi-tenant E-Commerce Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const subdomain = host.split(".")[0];
  const tenantSlug = process.env.NODE_ENV === "development" ? "sandbox" : subdomain;

  const queryClient = getQueryClient();

  const [tenantData] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: graphoodQueryKeys.tenant(tenantSlug),
      queryFn: () =>
        getTenantDetails(tenantSlug, graphoodServerClient),
    }),

    queryClient.prefetchQuery({
      queryKey: graphoodQueryKeys.health,
      queryFn: () =>
        checkGraphoodHealth(graphoodServerClient),
    }),

    queryClient.prefetchQuery({
      queryKey: graphoodQueryKeys.memberships(tenantSlug),
      queryFn: () =>
        getMemberships(tenantSlug, graphoodServerClient),
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);
  const tenant = tenantData.data.tenant;

  const isValidTenant =
    tenantData.success &&
    tenant.status === "ACTIVE";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {isValidTenant ? (
          <Providers
            dehydratedState={dehydratedState}
          >
            {children}
          </Providers>
        ) : (
          <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 text-slate-800">
            <div className="text-center dir-rtl">
              <h1 className="text-6xl font-extrabold text-slate-900">
                404
              </h1>

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
