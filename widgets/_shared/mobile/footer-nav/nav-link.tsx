"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { usePathname, useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { AuthEnums } from "@/lib/enums";

interface Props {
	href: string;
	label: string;
	unreadCount: number;
	icon?: React.ReactNode;
	token: string;
	setNavHeightStatus: (value: boolean) => void;
}

export const MobileNavLink: FC<Props> = ({ href, label, icon, unreadCount, token, setNavHeightStatus }) => {
	const pathname = usePathname();
	const router = useRouter();
	const parentPath = pathname.split("/")[1];
	const isActive = (parentPath && href.startsWith(`/${parentPath}`)) || (pathname === "/" && href === "/dashboard");

	// Simple inline validation to avoid href issues
	if (!href.startsWith("/") && !href.startsWith("https")) {
		// console.error("Invalid href provided:", href);
		return <></>; // Optionally, render nothing or handle invalid href differently
	}

	return (
		<Button
			size="lg"
			fullWidth
			className={`group flex h-[40px] w-[48px] items-center justify-center gap-1.5 rounded-lg px-0 text-base font-normal text-white
				duration-200 hover:bg-transparent ${isActive ? "!rounded-[100px] !bg-white !bg-opacity-10" : ""} `}
			onClick={() => {
				if (!token && href !== "/dashboard") {
					router.push(`/${AuthEnums.SIGNUP}`);
				} else {
					router.push(href);
					setNavHeightStatus(false);
				}
			}}
		>
			{icon}
			{label === "Messages" && unreadCount > 0 && (
				<p className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-center text-xs text-white text-opacity-80">
					{unreadCount >= 100 ? "99+" : unreadCount}
				</p>
			)}
		</Button>
	);
};
