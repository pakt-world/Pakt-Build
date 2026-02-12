"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ReactNode, type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AuthEnums } from "@/lib/enums";

interface Props {
	href: string;
	children: ReactNode;
	token?: string;
}

export const NavLink: FC<Props> = ({ href, children, token }) => {
	const pathname = usePathname();
	const parentPath = pathname.split("/")[1];
	const isActive = (parentPath && href.startsWith(`/${parentPath}`)) || (pathname === "/" && href === "/dashboard");

	// Simple inline validation to avoid href issues
	if (!href.startsWith("/") && !href.startsWith("https")) {
		// console.error("Invalid href provided:", href);
		return <></>; // Optionally, render nothing or handle invalid href differently
	}

	if (href.startsWith("https")) {
		return (
			<Link
				href={href}
				target="_blank"
				className={`flex max-w-full items-center !justify-start gap-4 rounded-lg p-2 text-sm font-bold text-white ease-in-out hover:bg-white
					hover:!bg-opacity-20 xl:min-w-[120px] ${isActive ? "bg-white bg-opacity-20" : ""} `}
			>
				{children}
			</Link>
		);
	}

	return (
		<Link
			className={`!flex !h-fit w-full max-w-full items-center !justify-start gap-4 rounded-lg !p-2 text-sm font-bold text-white
				ease-in-out hover:bg-white hover:!bg-opacity-20 ${isActive ? "bg-white bg-opacity-20" : ""} `}
			href={!token && href !== "/dashboard" ? `/?auth=${AuthEnums.SIGNUP}` : href}
		>
			{children}
		</Link>
	);
};
