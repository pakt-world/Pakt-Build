/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { ACHIEVEMENT_STYLES, type AchievementSettingProps } from "./types";
import { cn } from "@/lib/utils";

export const AchievementBar = ({ achievement }: { achievement: AchievementSettingProps }): JSX.Element => {
	const styles = ACHIEVEMENT_STYLES[achievement.type];
	const percentage = (achievement.value / achievement.maxValue) * 100;

	const lockedBadge = styles.title === "Referrals" || styles.title === "Squad";

	return (
		<div className="flex w-full flex-col items-center gap-2">
			<div
				className={cn("w-full flex-1 rounded-3xl p-2 sm:w-[100px]", {
					"flex items-center justify-center ": lockedBadge,
				})}
				style={{
					border: `2px solid ${styles.borderColor}`,
					backgroundColor: styles.outerBackgroundColor,
				}}
			>
				{lockedBadge ? (
					<div
						className="flex flex-col items-center justify-between gap-2 rounded-3xl p-3"
						style={{
							color: styles.textColor,
							backgroundColor: styles.innerBackgroundColor,
						}}
					>
						<Image src="/images/lock.png" className="w-full" height={100} width={100} alt="locked" />
					</div>
				) : (
					<div
						className="flex flex-col items-center justify-between gap-2 rounded-3xl p-3"
						style={{
							color: styles.textColor,
							backgroundColor: styles.innerBackgroundColor,
						}}
					>
						<span className="sm:text-2xl">
							{achievement.value}/{achievement.maxValue}
						</span>

						<div
							className="h-5 w-full overflow-hidden rounded-full"
							style={{ backgroundColor: styles.barColor }}
						>
							<div
								className="h-full rounded-full"
								style={{
									width: `${percentage}%`,
									backgroundColor: styles.barIndicatorColor,
								}}
							/>
						</div>
					</div>
				)}
			</div>
			{!lockedBadge ? (
				<span className="text-xs text-body sm:text-lg">{styles.title}</span>
			) : (
				<span className="h-7 text-xs text-white sm:text-lg" />
			)}
		</div>
	);
};
