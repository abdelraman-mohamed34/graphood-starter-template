import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const hostHeader =
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
        request.headers.get("host") ||
        "";

    if (
        url.pathname.startsWith("/_next") ||
        url.pathname.startsWith("/api") ||
        url.pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const hostname = hostHeader.replace(/^\[|\](:\d+)?$/g, "").split(":")[0].toLowerCase();
    const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost")
        .replace(/^https?:\/\//, "")
        .split(":")[0]
        .toLowerCase();

    let tenantSlug = hostname;

    if (hostname === rootDomain || hostname === "127.0.0.1" || hostname === "::1") {
        tenantSlug = process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG || "sandbox";
    } else if (hostname.endsWith(`.${rootDomain}`)) {
        tenantSlug = hostname.slice(0, -(rootDomain.length + 1));
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
