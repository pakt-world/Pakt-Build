"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Achievements } from "@/widgets/talents/view-profile/_shared/achievements";
import { Reviews } from "@/widgets/talents/view-profile/_shared/reviews";
import { ProfileHeader } from "@/widgets/talents/view-profile/_shared/header/desktop";
import { Bio } from "@/widgets/talents/view-profile/_shared/bio";
import { ProfileLinks } from "@/lib/types/talents";
import { AchievementType } from "@/lib/enums";

interface ViewProfile4DesktopProps {
	profileHeaderData: {
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
	};
	profileBioData: {
		body: string;
		profileLinks: ProfileLinks | undefined;
	};
	profileAchievementsData: {
		achievements: Array<{
			_id: string;
			owner: string;
			type: AchievementType;
			title: AchievementType;
			total: string;
			value: string;
			createdAt: string; // Date type
			updatedAt: string; // Date type
			__v: number;
		}>;
	};
	profileReviewsData: {
		reviews: Array<{
			title: string;
			body: string;
			rating: number;
			date: string; // Date type
			user: {
				_id: string;
				afroScore: number | undefined;
				name: string;
				title: string;
				avatar: string;
			};
		}>;
		loading: boolean;
	};
}

const ViewProfile4Desktop = ({
	profileHeaderData,
	profileBioData,
	profileAchievementsData,
	profileReviewsData,
}: ViewProfile4DesktopProps) => {
	return (
		<div className="scrollbar-hide grid-row-1 grid w-full grid-cols-1 px-4 2xl:px-8">
			<div className="relative grid w-full grid-rows-[auto_auto_auto] gap-4 overflow-hidden">
				<ProfileHeader
					_id={profileHeaderData._id}
					name={profileHeaderData.name}
					position={profileHeaderData.position}
					score={profileHeaderData.score}
					skills={profileHeaderData.skills}
					profileImage={profileHeaderData.profileImage}
					isOwnProfile={profileHeaderData.isOwnProfile}
				/>
				<div className="grid size-full grid-cols-[1fr_480px] items-stretch gap-4">
					<Bio body={profileBioData.body} profileLinks={profileBioData.profileLinks} />
					<Achievements achievements={profileAchievementsData.achievements} />
				</div>

				<div className="grid size-full grid-cols-1">
					<Reviews reviews={profileReviewsData.reviews} loading={profileReviewsData.loading} />
				</div>
			</div>
		</div>
	);
};

export default ViewProfile4Desktop;
