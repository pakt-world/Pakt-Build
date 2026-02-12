/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, LayoutDashboard, Menu, MessageSquare, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { MobileNavLink } from "./nav-link";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { useMessaging } from "@/providers/socket-provider";
import { useUserState } from "@/lib/store/account";
import { useUnreadChats } from "@/hooks/use-unread-chats";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { LogOut } from "../../desktop/sidebar/_components/logout";
import { AuthEnums } from "@/lib/enums";

const NavLink = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: <LayoutDashboard />,
	},
	{
		href: "/jobs?open-jobs=all",
		label: "Jobs",
		icon: <Briefcase />,
	},
	{
		href: "/talents",
		label: "Talents",
		icon: <Users />,
	},
	{
		href: "/messages",
		label: "Messaging",
		icon: <MessageSquare />,
	},
];

export const BottomNav = (): JSX.Element | null => {
	const pathname = usePathname();
	const { allConversations } = useMessaging();

	const token = getCookie(AUTH_TOKEN_KEY);

	const { user } = useUserState();
	const { _id: loggedInUser } = user ?? { _id: "" };

	const unreadCount = useUnreadChats(allConversations, loggedInUser);
	const { isScrolling, isAtTop, isTouching } = useMobileContext();
	const footerDelay = 500; // Simulate slower response
	const [footerVisible, setFooterVisible] = useState(true);
	const [navHeightStatus, setNavHeightStatus] = useState(false);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (!isScrolling) {
			// Show the footer after the delay when scrolling stops
			timeout = setTimeout(() => {
				setFooterVisible(true);
			}, footerDelay);
		} else if (isScrolling || isTouching) {
			// Hide the footer immediately when scrolling starts
			setFooterVisible(false);
		}

		return () => clearTimeout(timeout);
	}, [isScrolling, footerDelay, isTouching]);

	if (!token) return null;
	if (
		(token && pathname === `/${AuthEnums.TERMS_AND_CONDITIONS}`) ||
		pathname === `/${AuthEnums.ONBOARDING}` ||
		pathname.includes("/messages/")
	)
		return null;

	return (
		<nav
			className={`fixed bottom-0 left-0 !z-50 flex w-full flex-col overflow-hidden rounded-tl-3xl rounded-tr-3xl px-[21px] py-3
				transition-all ease-in-out will-change-auto sm:hidden
				${footerVisible || isAtTop ? "bg-dark-bg bg-cover opacity-100" : "opacity-0"} ${navHeightStatus ? "h-42" : "h-16"}`}
		>
			<div className="flex w-full items-center justify-between pb-4">
				{NavLink.map((link) => {
					return (
						<MobileNavLink
							unreadCount={unreadCount}
							key={link.label}
							href={link.href}
							label={link.label}
							icon={link.icon}
							token={token as string}
							setNavHeightStatus={setNavHeightStatus}
						/>
					);
				})}
				<Button
					size="lg"
					fullWidth
					onClick={(e) => {
						e.stopPropagation();
						setNavHeightStatus((prev) => !prev);
					}}
					className={`group flex h-[40px] w-[48px] touch-manipulation items-center justify-center gap-1.5 rounded-lg px-1 text-white
						duration-200 [&:hover]:bg-transparent ${navHeightStatus ? "!rounded-[100px] !bg-white !bg-opacity-10" : ""} `}
				>
					{navHeightStatus ? <X /> : <Menu />}
				</Button>
			</div>

			<div className="flex w-full items-center justify-between border-t border-white/10 pt-2 will-change-auto">
				<Link href="https://pakt.world" target="_blank" className="flex h-10 items-center">
					<div className="relative h-[35px] w-[142.44px]">
						<Image
							className="border border-[blue]"
							src="/images/pakt-world.png"
							alt="Logo"
							sizes="90vw"
							fill
						/>
					</div>
				</Link>
				{pathname !== "/" && navHeightStatus && (
					<LogOut
						className="flex w-fit touch-manipulation items-center justify-center !text-red-500"
						setNavHeightStatus={setNavHeightStatus}
					/>
				)}
			</div>
		</nav>
	);
};
