"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetTalentReviewById } from "@/lib/api";
import { useUserState } from "@/lib/store/account";
import { PageLoading } from "@/components/common/page-loading";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { AchievementProps } from "@/lib/types/talents";

import ViewProfile4Desktop from "@/widgets/talents/view-profile/desktop";
import ViewProfile4Mobile from "@/widgets/talents/view-profile/mobile";

export default function ProfilePage(): JSX.Element | null {
	const router = useRouter();

	const { user } = useUserState();
	const { _id, meta } = user ?? { _id: "" };

	const talentId = String(_id);
	const { data: talentReviews, isLoading, refetch: FetchTalent } = useGetTalentReviewById(talentId, "1", "30", true);

	const tab = useMediaQuery("(min-width: 640px)");

	useEffect(() => {
		if (talentId) {
			void FetchTalent();
		} else router.back();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const talent = useMemo(
		() => ({
			id: user?._id ?? "",
			name: `${user?.firstName}`,
			position: user?.profile?.bio?.title ?? "",
			image: user?.profileImage?.url ?? "",
			bio: user?.profile?.bio?.description ?? "",
			score: user?.score ?? 0,
			achievements: (user?.achievements ?? []).map((a) => ({
				...a,
				title: a.type,
				type: a.type,
				total: a.total,
				value: a.value,
			})) as AchievementProps[],
			skills:
				(user?.profile?.talent?.tagsIds ?? []).map((t) => ({
					name: t.name,
					backgroundColor: t.color,
				})) || [],
		}),
		[user]
	);

	if (isLoading) return <PageLoading color="#3055B3" />;
	const reviews = talentReviews?.data ?? [];

	const profileHeaderData = {
		name: talent.name,
		position: talent.position,
		score: talent.score as number,
		skills: talent.skills,
		profileImage: talent.image,
		isOwnProfile: true,
	};

	const profileBioData = {
		body: talent.bio ?? "",
		profileLinks: meta?.profileLinks,
	};

	const profileAchievementsData = {
		achievements: talent.achievements?.map((a) => ({
			...a,
			type: a.type,
			title: a.type,
			total: a.total,
			value: a.value,
		})),
	};

	const profileReviewsData = {
		reviews:
			reviews?.slice().map((a) => ({
				title: a.data.name,
				body: a.review,
				rating: a.rating,
				date: a.createdAt ?? "",
				user: {
					_id: a.owner._id ?? "",
					afroScore: a.owner.score,
					name: a.owner.firstName ?? "",
					title: a.owner?.profile?.bio?.title ?? "",
					avatar: a.owner.profileImage?.url ?? "",
				},
			})) ?? [],
		loading: isLoading,
	};

	return tab ? (
		<ViewProfile4Desktop
			profileHeaderData={profileHeaderData}
			profileBioData={profileBioData}
			profileAchievementsData={profileAchievementsData}
			profileReviewsData={profileReviewsData}
		/>
	) : (
		<ViewProfile4Mobile
			breadcrumb={
				<MobileBreadcrumb
					items={[
						{ label: "Talents", link: "/talents" },
						{ label: "My Profile", active: true },
					]}
					className="!fixed top-[70px] !z-50"
				/>
			}
			profileHeaderData={profileHeaderData}
			profileBioData={profileBioData}
			profileAchievementsData={profileAchievementsData}
			profileReviewsData={profileReviewsData}
		/>
	);
}
