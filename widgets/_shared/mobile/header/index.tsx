"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UserBalance } from "@/components/common/user-balance";
import { useUserState } from "@/lib/store/account";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { Button } from "@/components/common/button";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { userKycIsApproved } from "@/lib/utils";
import { KycVerificationStatus } from "@/lib/enums";

export const MobileHeader = (): JSX.Element | null => {
	const router = useRouter();
	const pathname = usePathname();

	const [expand, setExpand] = useState(false);

	const { user } = useUserState();
	const { firstName, profileImage, profileCompleteness, kycStatus, score } = user ?? {};
	const { setShowLeaderBoard, isAtTop } = useMobileContext();

	const profileScore = profileCompleteness ?? 0;
	const profileCompleted = profileScore > 70;
	const userHasDoneKyc = userKycIsApproved(kycStatus ?? KycVerificationStatus.EMPTY);

	const isDashboardPage = pathname === "/" || pathname === "/dashboard";
	const shouldShowFullHeader = isAtTop && profileCompleted && isDashboardPage;
	const shouldScale = shouldShowFullHeader && userHasDoneKyc;

	if (!firstName) return null;

	if (pathname.startsWith("/messages/")) return null;

	return (
		<div
			className="transition-height fixed left-0 top-0 !z-50 max-h-[calc(70px+78px)] min-h-[70px] w-full shrink-0 overflow-hidden
				duration-300"
		>
			<div className="relative !z-[2] flex !h-[70px] w-full items-center justify-between bg-mobile-header bg-cover bg-center bg-no-repeat px-5">
				<div
					className={`z-[5] transition-transform duration-300 ease-in-out will-change-auto
						${shouldScale ? "absolute left-2 translate-x-1/2 translate-y-1/2 scale-[1.8]" : "left-0 scale-100"}`}
				>
					<TalentProfile size="sm" score={score || 0} src={profileImage?.url} url="/profile" />
				</div>
				<div />
				<Link
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer duration-300"
					href="/dashboard"
				>
					<div className="relative m-0 h-[33.06px] w-[125px] p-0">
						<Image
							src="/images/mobile-logo.png"
							alt="pakt.build"
							fill
							sizes="90vw"
							priority
							className="cursor-pointer"
						/>
					</div>
				</Link>
				<div
					className="relative flex cursor-pointer items-center rounded-2xl border border-green-lighter bg-[#ffffff] px-2 py-1"
					onClick={() => {
						setExpand(!expand);
						router.push("/wallet");
					}}
					onKeyDown={() => {
						setExpand(!expand);
					}}
					role="button"
					tabIndex={0}
					aria-label="expand"
				>
					<UserBalance />
				</div>
			</div>
			<div
				className={`transition-height -webkit-transition-height -moz-transition-height -o-transition-height relative z-[1] flex w-full
					items-center overflow-hidden bg-blue-lightest/50 px-5 duration-300 ease-in-out will-change-auto
					${shouldScale ? "h-[78px]" : "h-0"}`}
			>
				<div className="z-20 flex w-full items-center justify-between gap-2">
					<Button
						className="flex h-[38px] w-[240px] justify-end rounded-[10px] border border-primary bg-white"
						onClick={() => {
							setShowLeaderBoard(true);
						}}
					>
						<div className="flex items-center gap-1">
							<span className="text-sm text-primary">View Leaderboard</span>
							<ChevronRight className="h-4 w-4 text-primary" />
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
};
