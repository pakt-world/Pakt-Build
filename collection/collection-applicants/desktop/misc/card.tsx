"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { Button } from "@/components/common/button";
import { TalentProps } from "@/lib/types/talents";
import { CollectionProps } from "@/lib/types/collection";
import { titleCase } from "@/lib/utils";

interface ApplicantCardProps {
	bid: number;
	message?: string;
	talent: TalentProps;
	inviteReceiverId?: string;
	invited?: boolean;
	job: CollectionProps;
}

export const ApplicantCard: FC<ApplicantCardProps> = ({ bid, talent, message, invited }) => {
	const router = useRouter();

	const { firstName, score, profileImage, profile } = talent;
	const talentId = talent._id;

	return (
		<div
			className="flex w-full cursor-pointer flex-col gap-3 rounded-2xl border border-line bg-white p-4 transition duration-200
				hover:scale-[1.01] active:scale-[0.99]"
		>
			<div className="flex w-full gap-4">
				<TalentProfile score={score} size="md" src={profileImage?.url} />
				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<span className="text-lg font-bold text-title">{`${firstName}`}</span>

							{invited && (
								<span className="inline-flex rounded-full border border-green-400 bg-green-50 px-3 text-sm text-green-900">
									Invited
								</span>
							)}
						</div>

						<span className="bg-amount_badge/40 inline-flex rounded-full px-3 text-base text-title">
							Bid ${bid}
						</span>
					</div>
					<div className="grow text-lg text-body">{message}</div>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex flex-wrap gap-2">
					{profile.talent.tagsIds &&
						profile.talent.tagsIds.length > 0 &&
						profile.talent.tagsIds.slice(0, 3).map((s) => (
							<span
								key={s?.color + s?.name}
								style={{ background: s?.color }}
								className="grow whitespace-nowrap rounded-full bg-green-100 px-4 py-0.5 text-[#090A0A]"
							>
								{titleCase(s?.name)}
							</span>
						))}
				</div>
				<div className="flex items-center gap-2">
					<Button size="md" type="button" variant="outlinePrimary" asChild>
						<Link href={`/messages?userId=${talentId}`} passHref>
							Message
						</Link>
					</Button>
					<Button
						size="md"
						type="button"
						variant="secondaryOutline"
						className="min-w-[100px]"
						onClick={() => {
							router.push(`/talents/${talentId}`);
						}}
					>
						View Profile
					</Button>
				</div>
			</div>
		</div>
	);
};
