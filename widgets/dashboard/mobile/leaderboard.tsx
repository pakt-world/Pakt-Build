"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { memo, useMemo, useRef } from "react";
import { useOnClickOutside, useIsClient } from "usehooks-ts";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { RunnerUp } from "../_shared/leaderboard/runner-up";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { useGetLeaderBoard } from "@/lib/api/dashboard";

const ITEM_HEIGHT = 67; // Each contestant box height
const ITEM_MARGIN = 8; // Margin between each contestant box

interface Props {
	leaderboardView: boolean;
	setLeaderboardView: (value: boolean) => void;
}

export const MobileLeaderBoard = ({ leaderboardView, setLeaderboardView }: Props): JSX.Element => {
	const token = getCookie(AUTH_TOKEN_KEY);
	const isClient = useIsClient();

	const {
		data: leaderboardData,
		isFetched,
		isFetching,
	} = useGetLeaderBoard({
		// role: Roles.RECIPIENT,
		isLoggedIn: !!token,
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

	const ref = useRef(null);

	const handleClickOutside = (): void => {
		setLeaderboardView(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	return (
		<>
			{/* Overlay */}
			<div
				className={`fixed inset-0 bg-black bg-opacity-50 transition-all ease-in-out
					${leaderboardView ? "!z-[999] opacity-100" : "!z-0 opacity-0"}`}
				onClick={() => {
					setLeaderboardView(false);
				}}
			/>
			<div
				className={` fixed !z-[9999] flex h-[530px] w-full shrink-0 flex-col gap-2 rounded-t-2xl rounded-tl-3xl rounded-tr-3xl bg-product-bg
					py-2 transition-all ease-in-out sm:hidden ${leaderboardView ? "bottom-0" : "-bottom-[110%]"}`}
				ref={ref}
			>
				<div className="flex w-full flex-col items-center justify-center gap-2">
					<div
						className="size-fit"
						onClick={(e) => {
							e.stopPropagation();
							setLeaderboardView(false);
						}}
						onKeyDown={() => {
							setLeaderboardView(false);
						}}
						role="button"
						tabIndex={0}
						aria-label="close"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="24" height="24" rx="8" fill="black" fill-opacity="0.2" />
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
								fill="#1F2739"
							/>
						</svg>
					</div>
					<div className="flex w-full items-center justify-between px-4">
						<h3 className="text-center text-[22px] font-bold leading-[33px] tracking-wide text-title">
							Leaderboard
						</h3>
						{token && (
							<div className="h-fit rounded-2xl border border-[#6EC2FB] bg-[#C9F0FF] px-2 text-black">
								<p className="text-sm leading-[21px] tracking-wide text-black">
									Your Position: {leaderboardData?.position ?? 0}/{leaderboardData?.total ?? 0}
								</p>
							</div>
						)}
					</div>
				</div>
				{isClient || !(!isFetched && isFetching) ? (
					<div className="scrollbar-hide relative flex flex-col overflow-y-scroll px-3 text-white">
						{talents.map((talent, index) => {
							return (
								<RunnerUp
									key={talent._id}
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
									className="w-full transition-all duration-500 ease-out"
								/>
							);
						})}
					</div>
				) : (
					<Spinner className="!text-title" />
				)}
			</div>
		</>
	);
};

export default memo(MobileLeaderBoard);
