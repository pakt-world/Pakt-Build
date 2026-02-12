"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useWindowSize } from "usehooks-ts";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";

interface Props {
	score: number;
	src: string;
	firstName: string;
	title: string;
}

export const UserProfile = ({ score, src, firstName, title }: Props): JSX.Element | boolean => {
	const size = useWindowSize();
	const pathname = usePathname();

	const s = size.width > 650 ? "lg" : "md";

	return (
		<div className="flex flex-col items-center">
			<TalentProfile score={score} src={src} url="/profile" size={s} />

			<div className="flex flex-col gap-0 text-center">
				<span className="text-lg font-bold leading-[27px] tracking-wide text-white">
					{pathname === "/" ? "Your Name" : firstName}
				</span>
				<span className="text-sm capitalize leading-[21px] tracking-wide text-white/90">
					{pathname === "/" ? "Pakt Builder" : title}
				</span>
			</div>
		</div>
	);
};
