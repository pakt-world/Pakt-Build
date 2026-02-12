import { AchievementType, Roles } from "../enums";
import { AchievementProps, TalentCrucialData, TalentProps, TalentReview } from "../types/talents";

export const mapTalentData = (talent: TalentProps): TalentCrucialData => ({
	_id: talent._id,
	name: `${talent.firstName}`,
	title: talent?.profile?.bio?.title ?? "",
	score: talent?.score ?? "0",
	image: talent?.profileImage?.url ?? "",
	skills: (talent?.profile?.talent?.tagsIds ?? []).map((t) => ({
		name: t.name,
		color: t.color ?? "",
	})),
	achievements: talent?.achievements?.map((a) => ({
		total: a.total ?? "",
		value: a.value ?? "",
		type: a.type ?? AchievementType.EMPTY,
	})) as AchievementProps[],
	type: talent.type ?? Roles.EMPTY,
	role: talent.role ?? Roles.EMPTY,
});

export const hasFiveStarReview = (reviews: TalentReview[]): boolean => {
	const hasFiveStar = reviews.filter((r) => r.rating === 5);
	return hasFiveStar.length > 0;
};
