"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { colorFromScore, titleCase } from "@/lib/utils";
import { TalentProfile } from "@/components/common/talent-profile-image";

interface TalentBoxProps {
	id: string;
	name: string;
	title: string;
	imageUrl?: string;
	score?: string;
	skills: Array<{ name: string; color: string }>;
}

export const TalentCard = ({ id, name, title, imageUrl, score, skills }: TalentBoxProps): JSX.Element => {
	const colorCodes = colorFromScore(parseInt(score ?? "0", 10));

	return (
		<Link
			key={id}
			className="z-10 m-0 flex w-full items-start gap-4 p-4"
			style={{
				background: colorCodes.bgColor,
				borderBottom: `1px solid ${colorCodes.borderColor}`,
			}}
			href={`/talents/${id}`}
		>
			<TalentProfile size="md" score={Math.round(Number(score))} src={imageUrl} url={`/talents/${id}`} />

			<div className="flex w-max flex-col items-start justify-between gap-4">
				<div className="flex flex-col items-start justify-start">
					<p className="line-clamp-1 text-lg font-bold leading-[27px] tracking-[0.75px] text-[#1F2739]">
						{name}
					</p>
					<span className="line-clamp-1 text-base leading-normal tracking-tight text-black">
						{titleCase(title)}
					</span>
				</div>

				{skills?.length > 0 && (
					<div className="flex w-full flex-wrap items-center gap-2 xs:flex-nowrap">
						{skills?.slice(0, 2).map(
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
										className="flex w-full items-center justify-center gap-2 overflow-hidden rounded-3xl px-2 py-1 text-center"
										style={{
											backgroundColor: color || "#B2AAE9",
										}}
									>
										<span className="w-full min-w-[80px] max-w-[90px] truncate text-center text-[14px] capitalize leading-[18px] tracking-[-0.25px]">
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
		</Link>
	);
};
