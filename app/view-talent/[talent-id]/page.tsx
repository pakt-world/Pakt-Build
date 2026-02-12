"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useParams } from "next/navigation";
import { useMediaQuery, useIsClient } from "usehooks-ts";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { useGetTalentById, useGetTalentReviewById } from "@/lib/api";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import ViewProfile4Desktop from "@/widgets/talents/view-profile/desktop";
import ViewProfile4Mobile from "@/widgets/talents/view-profile/mobile";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

export default function TalentDetailsPage(): JSX.Element {
	const params = useParams();
	const talentId = String(params["talent-id"]);
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();
	const token = !!getCookie(AUTH_TOKEN_KEY);

	const talentData = useGetTalentById(talentId, !!token, true);
	const reviewData = useGetTalentReviewById(talentId, "1", "30", !!token, true);

	if (
		talentData.isLoading ||
		reviewData.isLoading ||
		(!talentData.isFetched && talentData.isFetching) ||
		(!reviewData.isFetched && reviewData.isFetching) ||
		!isClient
	)
		return <PageLoading color="#3055B3" />;

	if (talentData.isError || reviewData.isError) return <PageError />;

	const { talent } = talentData.data;
	const reviews = reviewData.data ?? [];

	const profileHeaderData = {
		_id: talent._id,
		name: `${talent.firstName}`,
		position: talent?.profile?.bio?.title ?? "",
		score: talent.score as number,
		skills:
			talent?.profile?.talent?.tagsIds?.map((t) => ({
				name: t.name,
				backgroundColor: t.color ?? "",
			})) ?? [],
		profileImage: talent.profileImage?.url,
		isOwnProfile: false,
	};

	const profileBioData = {
		body: talent.profile?.bio?.description ?? "",
		profileLinks: talent.meta?.profileLinks,
	};

	const profileAchievementsData = {
		achievements: talentData.data.talent.achievements?.map((a) => ({
			...a,
			type: a.type,
			title: a.type,
			total: a.total,
			value: a.value,
		})),
	};

	const profileReviewsData = {
		reviews:
			reviews?.data.slice().map((a) => ({
				title: a.data.name,
				body: a.review,
				rating: a.rating,
				date: a.createdAt ?? "",
				user: {
					_id: a.owner?._id,
					afroScore: a.owner?.score,
					name: `${a.owner?.firstName}`,
					title: a.owner?.profile?.bio?.title ?? "",
					avatar: a.owner?.profileImage?.url ?? "",
				},
			})) ?? [],
		loading: false,
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
						{
							label: "Talents",
							link: "/signup",
						},
						{ label: "Talent Details", active: true },
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
