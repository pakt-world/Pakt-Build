"use client";

import { useIsClient } from "usehooks-ts";
import { memo, useMemo } from "react";
import { getCookie } from "cookies-next";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetLeaderBoard } from "@/lib/api/dashboard";
import { Spinner } from "@/components/common/loader";
import { RunnerUp } from "../_shared/leaderboard/runner-up";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

const ITEM_HEIGHT = 61; // Each contestant box height
const ITEM_MARGIN = 8; // Margin between each contestant box

const LeaderBoard = (): JSX.Element => {
	const token = getCookie(AUTH_TOKEN_KEY);
	const isClient = useIsClient();
	const {
		data: leaderboardData,
		isFetched,
		isFetching,
	} = useGetLeaderBoard({
		isLoggedIn: !!token,
		// role: Roles.RECIPIENT,
		limit: 10,
		profileCompletenessMin: 70,
		sortBy: "score",
		orderBy: "desc",
		scoreMin: 1,
	});
	const talents = useMemo(
		() =>
			(leaderboardData?.data ?? []).map((leader, i) => ({
				_id: leader?._id,
				name: `${leader?.firstName}`,
				image: leader?.profileImage?.url ?? "",
				score: leader?.score ?? 0,
				position: i + 1, // Add the position property
			})),
		[leaderboardData]
	);

	return (
		<div
			className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-primary-lighter
				!bg-leaderboard py-2 shadow backdrop-blur-lg"
		>
			<div className="text-center text-xl font-bold text-title">Leaderboard</div>
			{token && (
				<div className="h-fit rounded-2xl border border-[#6EC2FB] bg-[#C9F0FF] px-2 text-black">
					<p className="text-sm leading-[21px] tracking-wide text-black">
						Your Position: {leaderboardData?.position ?? 0}/{leaderboardData?.total ?? 0}
					</p>
				</div>
			)}
			{isClient || !(!isFetched && isFetching) ? (
				<div
					style={{ height: (ITEM_HEIGHT + ITEM_MARGIN) * talents.length + "px" }} // Adjusts to fit all contestants
					className="scrollbar-hide relative flex w-full flex-col items-center overflow-hidden px-4 text-white"
				>
					{talents.map((talent, index) => {
						return (
							<RunnerUp
								key={talent?._id}
								desktop
								talent={{
									_id: talent?._id,
									name: talent?.name,
									score: talent?.score,
									place: `${index + 1}th`,
									avatar: talent?.image,
								}}
								style={{
									height: ITEM_HEIGHT + "px",
									marginBottom: ITEM_MARGIN + "px", // Add space between items
								}}
								className="transition-all duration-500 ease-out"
							/>
						);
					})}
				</div>
			) : (
				<Spinner className="!text-title" />
			)}
		</div>
	);
};

export default memo(LeaderBoard);
