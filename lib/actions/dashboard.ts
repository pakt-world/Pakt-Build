import { CollectionTypes } from "../enums";
import { CollectionProps } from "../types/collection";
import { TalentProps } from "../types/talents";

// Active Jobs Tab
export const getDeliverableCounts = (collections: CollectionProps[]) => {
	const deliverableTotal = collections.filter((f) => f.type === CollectionTypes.DELIVERABLE).length;
	const deliverableTotalCompleted = collections.filter(
		(f) => f.type === CollectionTypes.DELIVERABLE && f.progress === 100
	).length;
	const currentProgress = parseInt(String((deliverableTotalCompleted * 100) / deliverableTotal), 10);
	return {
		total: deliverableTotal,
		progress: Math.floor(currentProgress),
	};
};

export const getUpdatedAt = (collections: CollectionProps[]) => {
	return collections
		.filter((f) => f.type === CollectionTypes.DELIVERABLE)
		.map((f) => f.updatedAt)
		.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
};

export const getUserInfo = (user: TalentProps | undefined) => ({
	_id: user?._id || "",
	name: `${user?.firstName || ""}`,
	avatar: user?.profileImage?.url || "",
	score: user?.score || 0,
	title: user?.profile?.bio?.title || "",
});
// Active Jobs Tab
