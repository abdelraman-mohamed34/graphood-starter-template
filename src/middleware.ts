import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostHeader = request.headers.get("host") || "";

    if (
        url.pathname.startsWith("/_next") ||
        url.pathname.startsWith("/api") ||
        url.pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const hostname = hostHeader.split(":")[0];
    const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    let tenantSlug = hostname;

    if (hostname !== ROOT_DOMAIN && hostname.endsWith(`.${ROOT_DOMAIN}`)) {
        tenantSlug = hostname.replace(`.${ROOT_DOMAIN}`, "");
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-slug", tenantSlug);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};