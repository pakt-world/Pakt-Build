"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { TalentProps } from "@/lib/types/talents";
import { CollectionProps } from "@/lib/types/collection";
import { SkillBadge } from "@/components/common/skill-badge";

interface ApplicantCardProps {
	bid: number;
	message?: string;
	talent: TalentProps;
	inviteReceiverId?: string;
	job: CollectionProps;
	disableAcceptButton?: boolean;
}

export const ApplicantCard: FC<ApplicantCardProps> = ({ bid, talent, message, inviteReceiverId }) => {
	const router = useRouter();
	const { firstName, score, profileImage, profile } = talent;
	const hasBeenInvited = inviteReceiverId === talent?._id;

	return (
		<div
			className="flex w-full flex-col gap-4 border-b border-green-300 bg-white p-4 pt-2"
			onClick={() => {
				router.push(`/talents/${talent?._id}`);
			}}
			onKeyDown={() => {
				router.push(`/talents/${talent?._id}`);
			}}
			role="button"
			tabIndex={0}
		>
			<div className="flex w-full items-start justify-between">
				<div className="flex items-center gap-2">
					<TalentProfile score={score} size="sm" src={profileImage?.url} />
					<div className="relative flex flex-col items-start">
						<span className="text-lg font-bold text-title">{`${firstName}`}</span>
						<span className="text-xs leading-[18px] tracking-wide text-neutral-500">{`${firstName}`}</span>
					</div>
				</div>
				<div className="flex flex-col items-end gap-2">
					<span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
						Bid ${bid}
					</span>
					{hasBeenInvited && (
						<span className="inline-flex rounded-full border border-green-400 bg-green-50 px-3 text-sm text-green-900">
							Invited
						</span>
					)}
				</div>
			</div>
			<p className="grow text-base leading-normal tracking-tight text-gray-800">{message}</p>

			<div className="flex w-[90%] flex-nowrap items-center gap-2">
				{profile.talent.tagsIds &&
					profile.talent.tagsIds.length > 0 &&
					profile.talent.tagsIds.slice(0, 3).map((s) => <SkillBadge key={s.color + s.name} skill={s} />)}
			</div>
		</div>
	);
};
