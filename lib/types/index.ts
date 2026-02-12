import { type AccountProps } from "./account";
import { type CollectionProps } from "./collection";

export interface Review {
	_id: string;
	data: CollectionProps;
	owner: AccountProps;
	rating: number;
	receiver: AccountProps;
	review: string;
	createdAt?: string;
	updatedAt?: string;
}

// Referrals

interface ReferedUserProps {
	_id: string;
	firstName: string;
	lastName: string;
	type: "recipient";
	profile: AccountProps;
	isPrivate: boolean;
	score: number;
	profileCompleteness: number;
	profileImage: ProfileImage;
}

interface UserContact {
	state: string;
	city: string;
	country: string;
}

interface UserBio {
	title: string;
	description: string;
}

interface UserTalent {
	tags: string[];
	tagsIds: string[];
}

interface ReferredUserProfileProps {
	contact: UserContact;
	bio: UserBio;
	talent: UserTalent;
}

interface ProfileImage {
	_id: string;
	name: string;
	type: string;
	size: string;
	url: string;
}

interface Referral {
	_id: string;
	firstName: string;
	lastName: string;
	type: "recipient";
	profile: ReferredUserProfileProps;
	isPrivate: boolean;
	score: number;
	profileCompleteness: number;
	profileImage: ProfileImage;
}

export interface ReferredUser {
	_id: string;
	referralId: string;
	userId: ReferedUserProps;
	referral: Referral;
	completedGig: boolean;
	status: boolean;
	createdAt: string;
	updatedAt: string;
}

export type IAny = any;
