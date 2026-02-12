"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, DollarSign } from "lucide-react";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { memo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMessaging } from "@/providers/socket-provider";
import { useUnreadChats } from "@/hooks/use-unread-chats";
import { useUserState } from "@/lib/store/account";
import { NavLink } from "./_components/nav-link";
import { Brand } from "./_components/brand";
import { LogOut } from "./_components/logout";
import { LINKS } from "@/lib/constants";
import { AUTH_TOKEN_KEY, formatUsd } from "@/lib/utils";
import { useGetTotalJobCount, useGetTotalJobValue } from "@/lib/api/job";
import { useSettingState } from "@/lib/store/settings";
import { UserProfile } from "./_components/user-profile";

const DesktopSidebar = (): JSX.Element => {
	const pathname = usePathname();

	const token = getCookie(AUTH_TOKEN_KEY);

	const { user } = useUserState();
	const { settings } = useSettingState();
	const {
		_id: loggedInUser,
		firstName,
		meta,
		profileImage,
		score,
		profile,
	} = user ?? { _id: "", firstName: "", profileImage: null, profile: null };

	const { allConversations } = useMessaging();

	const { data } = useGetTotalJobCount();
	const { data: value } = useGetTotalJobValue();

	const unreadCount = useUnreadChats(allConversations, loggedInUser);
	const noProfile = pathname === "/" && (!meta?.onboarding || !profileImage?.url);

	return (
		<div
			className="relative !z-20 flex h-full shrink-0 basis-[250px] flex-col gap-6 overflow-y-auto overflow-x-hidden bg-sidebar bg-cover
				bg-center bg-no-repeat px-7 py-4 max-sm:hidden 1xl:basis-[280px]"
		>
			<Brand />
			<div className="z-[2] border-b border-line opacity-20 shadow" />

			{!token || noProfile ? (
				<div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-white bg-opacity-[10%] p-4">
					<div className="flex w-full items-start">
						<Briefcase size={24} className="h-[28px] w-[31px] text-[#9BDCFD]" />
						<div className="flex flex-col">
							<div className="ml-2 text-lg font-bold text-white">{data?.count}</div>
							<span className="ml-2 text-sm font-normal text-white text-opacity-50">
								Total Jobs created
							</span>
						</div>
					</div>
					<div className="z-[2] w-full border-b border-line opacity-20 shadow" />
					<div className="flex w-full items-start">
						<DollarSign size={24} strokeWidth={3} className="text-[#86C08F]" />
						<div className="flex flex-col">
							<div className="ml-2 text-lg font-bold text-white">{formatUsd(value?.value ?? 0)}</div>
							<span className="ml-2 text-sm font-normal text-white text-opacity-50">
								Total Value Earned
							</span>
						</div>
					</div>
				</div>
			) : (
				<div className="z-[2] flex w-full flex-col items-center">
					<UserProfile
						score={score ?? 0}
						src={profileImage?.url ?? ""}
						firstName={firstName ?? ""}
						title={profile?.bio?.title ?? ""}
					/>
				</div>
			)}

			<div className="z-[2] border-b border-line opacity-20 shadow" />

			<div className="z-[2] flex w-full flex-col gap-2.5 px-[34px]">
				{LINKS.map(({ href, icon, label }) => {
					if (!token && label === "Settings") return null;
					// Assign to empty label "" settings url to it's href
					if (href === "") {
						href = settings?.pcc_site_url ?? "";
					}
					return (
						<NavLink key={href} href={href} token={token}>
							{icon}
							<span>{label}</span>
							{label === "Messages" && unreadCount > 0 && (
								<p className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-center text-xs text-white text-opacity-80">
									{unreadCount >= 100 ? "99+" : unreadCount}
								</p>
							)}
						</NavLink>
					);
				})}
			</div>
			<div className="z-[2] mt-auto w-full px-[34px]">{token && <LogOut />}</div>
		</div>
	);
};

export default memo(DesktopSidebar);
