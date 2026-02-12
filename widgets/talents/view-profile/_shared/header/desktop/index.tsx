"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { Briefcase, Edit } from "lucide-react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY, getAvatarColor } from "@/lib/utils";
import { TalentProfile } from "@/components/common/talent-profile-image";
import { InviteTalent4Desktop } from "./invite";
import { Button } from "@/components/common/button";
import { AuthEnums } from "@/lib/enums";

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
	disabled?: boolean;
}

export const ProfileHeader = ({ _id, name, position, score, skills, isOwnProfile, profileImage, disabled }: Props) => {
	const router = useRouter();
	const borderColor = getAvatarColor(score);
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const token = getCookie(AUTH_TOKEN_KEY);

	return (
		<>
			<InviteTalent4Desktop isOpen={isModalOpen} setIsOpen={setIsModalOpen} talentId={_id ?? ""} />

			<div
				className="relative grid h-full w-full gap-6 rounded-2xl bg-white p-5"
				style={{
					// Responsive grid
					gridTemplateColumns: "auto 1fr",
					gridTemplateRows: "auto",
				}}
			>
				<div className="absolute -left-1 top-1/2 h-[1px] w-full" style={{ backgroundColor: borderColor }} />

				<TalentProfile
					src={profileImage}
					score={score}
					size="xl"
					url={_id ? `/talents/${_id}` : ""}
					disabled={disabled}
				/>

				<div className="grid grid-cols-1 grid-rows-2 gap-4">
					<div className="grid w-full grid-cols-2 grid-rows-1 items-center justify-between gap-2">
						<div className="flex flex-col gap-1">
							<h1 className="truncate text-3xl font-bold text-title">{name}</h1>
							<div className="flex items-center gap-2 capitalize text-body">
								<Briefcase size={24} />
								<span className="text-lg">{position}</span>
							</div>
						</div>

						{!isOwnProfile ? (
							<div className="flex h-fit w-full items-center justify-end gap-3">
								{token ? (
									<Button
										// fullWidth
										variant="secondaryOutline"
										className="border border-primary"
										size="lg"
										asChild
									>
										<Link href={`/messages?userId=${_id}`}>Message</Link>
									</Button>
								) : (
									<Button
										variant="secondaryOutline"
										className="border border-primary"
										size="lg"
										onClick={() => {
											router.push(`/?auth=${AuthEnums.SIGNUP}`);
										}}
									>
										Message
									</Button>
								)}
								{token && (
									<Button
										// fullWidth
										variant="primary"
										size="lg"
										onClick={() => {
											if (token) {
												setIsModalOpen(true);
											} else {
												router.push(`/?auth=${AuthEnums.SIGNUP}`);
											}
										}}
									>
										Invite to Job
									</Button>
								)}
							</div>
						) : (
							<div className="ml-auto flex w-full max-w-fit flex-row items-center justify-end">
								<Button fullWidth variant="secondaryOutline" asChild size="lg">
									<Link href="/settings" className="flex flex-row gap-2">
										<Edit size={24} />
										Edit Profile
									</Link>
								</Button>
							</div>
						)}
					</div>

					<div className="flex h-fit flex-wrap gap-2">
						{skills.map((skill, i) => (
							<span
								key={i}
								className="rounded-full bg-white px-6 py-1.5 text-sm font-medium capitalize text-[#090A0A]"
								style={{
									backgroundColor: skill.backgroundColor || "#B2AAE9",
								}}
							>
								{skill.name}
							</span>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
