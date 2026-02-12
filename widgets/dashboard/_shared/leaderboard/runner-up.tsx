"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY, truncate } from "@/lib/utils";
import { TalentProfile } from "@/components/common/talent-profile-image";

interface LeaderBoardItemProps {
	_id: string | number;
	name: string;
	score: number;
	avatar?: string;
	place?: string;
	isUpdated?: boolean;
	previousPosition?: number;
	currentPosition?: number;
}

export const RunnerUp = ({
	talent,
	desktop,
	onAnimationEnd,
	style,
	className,
}: {
	desktop?: boolean;
	onAnimationEnd?: () => void;
	talent: LeaderBoardItemProps;
	style?: Record<string, string | number>;
	className?: string;
}): JSX.Element => {
	const router = useRouter();
	const token = getCookie(AUTH_TOKEN_KEY);
	return desktop ? (
		<div onAnimationEnd={onAnimationEnd} style={style} className={`cursor-pointer ${className}`}>
			<div onClick={() => router.push(`/talents/${talent?._id}`)} className="relative block w-full">
				{talent.place === "1th" ? (
					<div className="relative h-[61px] rounded-2xl bg-l1 sm:w-[247px]" />
				) : talent.place === "2th" ? (
					<div className="relative h-[61px] rounded-2xl bg-l2 sm:w-[247px]" />
				) : talent.place === "3th" ? (
					<div className="relative h-[61px] rounded-2xl bg-l3 sm:w-[247px]" />
				) : (
					<div className="relative h-[61px] rounded-2xl border border-[#E1DEED] bg-[#F4F4FD] sm:w-[247px]" />
				)}
				<div className="absolute inset-0 flex items-center gap-2 p-3 pl-1">
					<TalentProfile
						src={talent?.avatar ?? ""}
						score={Math.round(talent?.score)}
						size="sm"
						url={token ? `/talents/${talent?._id}` : `/view-talent/${talent?._id}`}
					/>

					<div className="grow">
						<span
							className={`text-base font-semibold ${
								talent?.place === "1th" || talent?.place === "2th" || talent.place === "3th"
									? "text-green-lightest"
									: "text-title"
								}`}
						>
							{truncate(talent.name, 15)}
						</span>
						<div className="flex items-center justify-between gap-2">
							<span
								className={`text-sm font-normal text-title ${
									talent?.place === "1th" || talent?.place === "2th" || talent?.place === "3th"
										? "text-white"
										: "text-title"
									}`}
							>
								Buildscore: {Math.round(talent?.score)}
							</span>
							{talent.place === "1th" ? (
								<Image src="/icons/medal-1.png" width={28} height={28} alt="" />
							) : talent.place === "2th" ? (
								<Image src="/icons/medal-2.png" width={28} height={28} alt="" />
							) : talent.place === "3th" ? (
								<Image src="/icons/medal-3.png" width={28} height={28} alt="" />
							) : (
								<span className="text-sm text-body">{talent?.place}</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div
			role="button"
			tabIndex={0}
			onClick={() => {
				router.push(token ? `/talents/${talent._id}` : `/view-talent/${talent._id}`);
			}}
			className="relative flex h-[67px] items-center justify-center rounded-2xl bg-primary"
		>
			<div className="flex w-full items-center gap-2 p-3 pl-1">
				<TalentProfile
					src={talent.avatar ?? ""}
					score={Math.round(talent.score)}
					size="sm"
					url={`talents/${talent._id}`}
				/>
				<div className="grow">
					<span className="text-base text-[#ECFCE5]">{truncate(talent.name, 15)}</span>
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm text-[#F2F4F5]">Afroscore: {Math.round(talent.score)}</span>
						<span className="text-sm text-[#CDCFD0]">{talent.place}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
