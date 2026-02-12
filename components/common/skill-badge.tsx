"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useWindowSize } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TagsID } from "@/lib/types/talents";
import { BountyTagProps } from "@/lib/types/collection";

export const SkillBadge = ({
	skill,
	className,
}: {
	skill: TagsID | BountyTagProps;
	className?: string;
}): JSX.Element => {
	const size = useWindowSize();
	const threshold = size.width > 1024 ? 16 : 12;
	const isLongText = skill.name.length >= threshold;
	return (
		<div
			className={`${isLongText ? "max-2xl:!truncate" : ""} relative overflow-hidden whitespace-nowrap rounded-full bg-slate-100 px-4 py-1
				text-[10px] capitalize max-2xl:max-w-[120px] max-sm:text-xs min-[1440px]:text-[14px] ${className}`}
			style={{
				background: skill.color,
			}}
		>
			{skill.name}
		</div>
	);
};
