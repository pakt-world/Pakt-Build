"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import { Briefcase, ChevronRight, Settings } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { TalentProfile } from "@/components/common/talent-profile-image";

interface Props {
	_id?: string;
	name: string;
	position: string;
	score: number;
	skills: Array<{
		name: string;
		backgroundColor: string;
	}>;
	profileImage?: string;
	isOwnProfile?: boolean;
}

export const MobileProfileHeader: FC<Props> = ({ _id, name, position, score, skills, isOwnProfile, profileImage }) => {
	const [showSkills, setShowSkills] = useState(false);

	return (
		<>
			<div className="relative flex w-full gap-6 border border-blue-lighter bg-white px-5 py-2">
				<TalentProfile src={profileImage} score={score} size="md" url={_id ? `/talents/${_id}` : ""} disabled />
				<div className="grid grow grid-cols-1 gap-5">
					<div className="flex w-full flex-row justify-between gap-2">
						<div className="flex w-full flex-row flex-wrap items-center justify-between gap-2">
							<div className="line-clamp-1 flex w-full flex-col gap-1">
								<h1 className="truncate text-xl font-bold text-title">{name}</h1>
								<div className="flex items-center gap-2 capitalize text-body">
									<Briefcase size={24} />
									<span className="text-base">{position}</span>
								</div>
							</div>

							{!isOwnProfile ? (
								<div className="flex w-full items-center gap-3">
									<Button variant="primary" asChild size="md">
										<Link href={`/talents/${_id}/invite`} className="">
											Invite to Job
										</Link>
									</Button>
									<Button asChild variant="outlinePrimary" className="!w-max !bg-transparent">
										<Link href={`/messages?userId=${_id}`}>
											<svg
												width="16"
												height="16"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M3.33325 2.66665C3.15644 2.66665 2.98687 2.73688 2.86185 2.86191C2.73682 2.98693 2.66659 3.1565 2.66659 3.33331V12.3905L4.19518 10.8619C4.32021 10.7369 4.48977 10.6666 4.66659 10.6666H12.6666C12.8434 10.6666 13.013 10.5964 13.138 10.4714C13.263 10.3464 13.3333 10.1768 13.3333 9.99998V3.33331C13.3333 3.1565 13.263 2.98693 13.138 2.86191C13.013 2.73688 12.8434 2.66665 12.6666 2.66665H3.33325ZM1.91904 1.9191C2.29411 1.54403 2.80282 1.33331 3.33325 1.33331H12.6666C13.197 1.33331 13.7057 1.54403 14.0808 1.9191C14.4559 2.29417 14.6666 2.80288 14.6666 3.33331V9.99998C14.6666 10.5304 14.4559 11.0391 14.0808 11.4142C13.7057 11.7893 13.197 12 12.6666 12H4.94273L2.47132 14.4714C2.28066 14.6621 1.99391 14.7191 1.7448 14.6159C1.49568 14.5127 1.33325 14.2696 1.33325 14V3.33331C1.33325 2.80288 1.54397 2.29417 1.91904 1.9191Z"
													fill="#008D6C"
												/>
											</svg>
										</Link>
									</Button>
								</div>
							) : (
								<div className="flex w-full flex-row items-center">
									<Button asChild variant="outlinePrimary">
										<Link href="/settings" className="flex flex-row gap-2">
											<Settings size={24} />
											Account Settings
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="flex h-fit w-full flex-wrap border-b border-gray-200 bg-white px-4">
				<button
					className="!m-0 flex w-full items-center justify-between !p-0 max-sm:h-[64px]"
					onClick={() => {
						setShowSkills(!showSkills);
					}}
				>
					<h4 className="w-fit text-base font-bold leading-[27px] tracking-wide text-neutral-950">Skills</h4>
					<ChevronRight
						className={`h-6 w-6 text-body transition-transform ${showSkills ? "rotate-90 transform" : ""}`}
					/>
				</button>

				<div
					className={`flex flex-wrap gap-2 overflow-hidden transition-all ${showSkills ? "mt-4 h-fit pb-4" : "h-0"}`}
				>
					{[...skills].map((skill, i) => (
						<span
							key={i}
							className="rounded-full bg-white px-6 py-1.5 text-sm font-medium capitalize text-[#090A0A]"
							style={{
								backgroundColor: skill.backgroundColor,
							}}
						>
							{skill.name}
						</span>
					))}
				</div>
			</div>
		</>
	);
};
