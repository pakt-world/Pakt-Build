import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthEnums } from "@/lib/enums";

// Dynamically generate excluded routes for both cases
const excludedRoutes = Object.values(AuthEnums).flatMap((route) => [`/${route}`]);

export const useBodyOverflow = () => {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname === "/dashboard" || pathname === "/" || excludedRoutes.includes(pathname)) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		// Cleanup function to reset overflow when component unmounts
		return () => {
			document.body.style.overflow = "";
		};
	}, [pathname]);
};
