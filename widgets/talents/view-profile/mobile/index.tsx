"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Achievements } from "@/widgets/talents/view-profile/_shared/achievements";
import { Reviews } from "@/widgets/talents/view-profile/_shared/reviews";
import { Bio } from "@/widgets/talents/view-profile/_shared/bio";
import { ProfileLinks } from "@/lib/types/talents";
import { AchievementType } from "@/lib/enums";
import { MobileProfileHeader } from "../_shared/header/mobile";
import { ReactElement } from "react";

interface ViewProfile4MobileProps {
	breadcrumb: ReactElement;
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

const ViewProfile4Mobile = ({
	breadcrumb,
	profileHeaderData,
	profileBioData,
	profileAchievementsData,
	profileReviewsData,
}: ViewProfile4MobileProps) => {
	return (
		<div className="relative flex size-full flex-col">
			{breadcrumb}
			<div className="mt-[43px] w-full flex-1 pb-16">
				<MobileProfileHeader
					_id={profileHeaderData._id}
					name={profileHeaderData.name}
					position={profileHeaderData.position}
					score={profileHeaderData.score}
					skills={profileHeaderData.skills}
					profileImage={profileHeaderData.profileImage}
					isOwnProfile={profileHeaderData.isOwnProfile}
				/>

				<Bio body={profileBioData.body} profileLinks={profileBioData.profileLinks} />
				<Achievements achievements={profileAchievementsData.achievements} />

				<div className="grid h-auto w-full grid-cols-1">
					<Reviews reviews={profileReviewsData.reviews} loading={profileReviewsData.loading} />
				</div>
			</div>
		</div>
	);
};

export default ViewProfile4Mobile;
