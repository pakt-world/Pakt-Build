"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ChevronRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AchievementBar } from "./bar";
import { type AchievementType } from "./types";
import { AchievementProps } from "@/lib/types/talents";

export const Achievements = ({ achievements = [] }: { achievements: AchievementProps[] }): JSX.Element => {
	const [showAchievements, setShowAchievements] = useState(false);

	achievements.sort((a, b) => Number(b.total) - Number(a.total));
	return (
		<div
			className="flex h-fit w-full flex-col items-center justify-center border-b bg-white px-4 sm:items-center sm:gap-4 sm:rounded-2xl
				sm:border sm:border-blue-darkest sm:bg-secondary sm:px-6 sm:py-4"
		>
			<button
				className="!m-0 flex w-full items-center justify-between !p-0 max-sm:!h-[64px] sm:justify-center"
				onClick={() => {
					setShowAchievements(!showAchievements);
				}}
			>
				<h3 className="text-center text-base font-bold text-title sm:text-2xl">Achievements</h3>
				<ChevronRight
					className={`h-6 w-6 text-body transition-transform sm:hidden ${showAchievements ? "rotate-90 transform" : ""}`}
				/>
			</button>
			<div
				className={`grid w-full grid-cols-4 gap-2 overflow-hidden transition-all ${showAchievements ? "mt-4 h-fit pb-4" : "h-0"} sm:mt-0
					sm:h-fit`}
			>
				{achievements.length > 0 &&
					achievements.map(({ total, type, value }) => {
						return (
							<AchievementBar
								key={type}
								achievement={{
									minValue: 0,
									value: Math.floor(Number(value)),
									maxValue: Number(total),
									type: type as AchievementType,
								}}
							/>
						);
					})}

				{achievements.length === 0 && (
					<>
						<AchievementBar
							achievement={{
								type: "review",
								maxValue: 60,
								minValue: 0,
								value: 0,
							}}
						/>
						<AchievementBar
							achievement={{
								type: "referral",
								maxValue: 20,
								minValue: 0,
								value: 0,
							}}
						/>
						<AchievementBar
							achievement={{
								type: "five-star",
								maxValue: 10,
								minValue: 0,
								value: 0,
							}}
						/>
						<AchievementBar
							achievement={{
								type: "squad",
								maxValue: 10,
								minValue: 0,
								value: 0,
							}}
						/>
					</>
				)}
			</div>
		</div>
	);
};
