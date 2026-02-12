import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthEnums } from "./lib/enums";

// Dynamically generate excluded routes for both cases
const excludedRoutes = Object.values(AuthEnums).flatMap((route) => [`/${route}`, `/?auth=${route}`]);

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();

	// Bypass middleware for excluded routes
	if (excludedRoutes.some((route) => url.pathname.startsWith(route))) {
		return NextResponse.next();
	}

	// Continue to the requested route
	return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
	matcher: [],
	runtime: "nodejs", // ✅ Force Node.js runtime
};
