"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { usePathname } from "next/navigation";
import { LogOut as LogoutIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useLogoutConfirmationStore } from "@/lib/store/misc";
import { Button } from "@/components/common/button";

export const LogOut = ({
	noLabel,
	className = "",
	setNavHeightStatus,
}: {
	noLabel?: boolean;
	className?: string;
	setNavHeightStatus?: (value: boolean) => void;
}): JSX.Element => {
	const { setShowLogoutConfirmation } = useLogoutConfirmationStore();
	const pathname = usePathname();
	const isMobile = useMediaQuery("(max-width: 640px)");

	return (
		<Button
			onClick={() => {
				if (pathname !== "/") setShowLogoutConfirmation(true);
				if (isMobile) setNavHeightStatus?.(false);
			}}
			className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-normal text-white duration-200 sm:min-w-[150px]
				sm:justify-start sm:[&:hover]:bg-white sm:[&:hover]:!bg-opacity-20 ${className} `}
			type="button"
		>
			<LogoutIcon size={20} />
			{!noLabel && <span className="">Logout</span>}
		</Button>
	);
};
