"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { colorFromScore, getAchievementData } from "@/lib/utils";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { Overlay } from "./overlay";
// import Elements from "./elements";
import { AchievementProps } from "@/lib/types/talents";
import { EMPTY_ACHIEVEMENTS } from "@/lib/constants";
import { Badge } from "@/components/common/badge";

interface TalentCardProps {
	id: string;
	name: string;
	title: string;
	imageUrl?: string;
	score?: string;
	skills: Array<{ name: string; color: string }>;
	achievements: AchievementProps[];
	// type: Roles;
}

const customOrder = ["review", "five-star", "referral", "squad"];

export function sortAchievements(achievements: AchievementProps[]): AchievementProps[] {
	return achievements.sort((a, b) => {
		// First, sort by custom order
		const orderA = customOrder.indexOf(a.type);
		const orderB = customOrder.indexOf(b.type);

		if (orderA !== orderB) {
			return orderA - orderB;
		}

		// If types are the same, sort by total in descending order
		return parseFloat(b.total.toString()) - parseFloat(a.total.toString());
	});
}

export const TalentCard = ({
	id,
	name,
	title,
	imageUrl,
	score,
	skills,
	achievements,
}: TalentCardProps): JSX.Element => {
	const router = useRouter();
	const colorCodes = colorFromScore(parseInt(score ?? "0", 10));

	const ACHIEVEMENT = achievements.length > 0 ? achievements : EMPTY_ACHIEVEMENTS;

	// Sort the achievements using the utility function
	const sortedAchievements = sortAchievements(ACHIEVEMENT);

	return (
		<div
			key={id}
			className="m-0 h-[300px] cursor-pointer overflow-hidden rounded-3xl border border-[#CDCFD0] p-0"
			style={{ background: colorCodes.bgColor }}
			onClick={() => router.push(`/talents/${id}`)}
		>
			<div className="relative z-0 h-full rounded-2xl">
				{/* <Elements colorCodes={colorCodes.circleColor} /> */}
				{/* <Image
					width={100}
					height={100}
					alt=""
					src="/images/sparkles.png"
					className="absolute left-0 top-0 h-full w-full"
				/> */}
				<div
					style={{
						backgroundColor: colorCodes?.circleColor,
						border: `2px solid ${colorCodes?.borderColor}`,
					}}
					className="absolute left-1/2 top-1/2 size-[350px] -translate-x-1/2 -translate-y-[60%] rounded-full border"
				/>
				<div
					style={{ backgroundColor: colorCodes?.circleColor, border: `2px solid ${colorCodes?.borderColor}` }}
					className="absolute left-1/2 top-1/2 size-[200px] -translate-x-1/2 -translate-y-[70%] rounded-full"
				/>

				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[71%]">
					<TalentProfile size="xl" score={Math.round(Number(score))} src={imageUrl} url={`/talents/${id}`} />
				</div>

				<div className="absolute bottom-0 z-20 -mb-[190px] flex h-full w-full flex-col overflow-hidden duration-200 ease-out hover:mb-[0px]">
					<div className="relative z-20">
						<Overlay />
						<div className="absolute top-[3px] mx-auto flex w-full justify-center">
							<ChevronUp className="z-[500] mx-auto -mt-[3px] text-primary" size={25} strokeWidth={1.5} />
						</div>
						<div
							className={`absolute top-[5%] h-full w-full rounded-3xl !bg-opacity-[37%] !backdrop-blur-[29px] bg-[${colorCodes?.bgColor}]`}
						>
							<div className="relative rounded-2xl border-t-0 px-5">
								<div className="flex flex-col items-start gap-2">
									<span className="my-auto line-clamp-1 pb-0 pt-3 text-2xl font-semibold capitalize text-title">
										{name}
									</span>
									<span className="line-clamp-1 text-base capitalize leading-[35px] text-body">
										{title || ""}
									</span>
									{skills?.length > 0 && (
										<div className="flex w-full items-center gap-2">
											{skills?.slice(0, 3).map(
												(
													skill: {
														name: string;
														color: string;
													},
													i: number
												) => {
													const { color, name: n } = skill;
													const s = n || skill || "";
													return (
														<div
															key={i}
															className="flex w-full items-center justify-center overflow-hidden rounded-3xl px-3 py-1"
															style={{
																backgroundColor: color || "#B2AAE9",
															}}
														>
															<span className="w-full min-w-[85px] max-w-[105px] truncate text-center capitalize">
																{s as string}
																{/* {limitString(s as string)} */}
															</span>
														</div>
													);
												}
											)}
										</div>
									)}
								</div>

								<div className="mt-4 flex flex-col gap-2">
									<h3 className="text-base font-normal text-body">Achievements</h3>
									<div className="grid grid-cols-4 gap-2">
										{sortedAchievements.map((a: AchievementProps, i: number) => {
											const achievM = getAchievementData(a.type);
											return (
												<Badge
													key={i}
													title={achievM?.title}
													value={a?.value}
													total={a?.total}
													textColor={achievM?.textColor}
													bgColor={achievM?.bgColor}
													// type={a.type}
												/>
											);
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
