import { type KycVerificationStatus, type Roles } from "../enums";
import { type AchievementProps } from "./talents";

interface ProfileImageProps {
	name?: string;
	bucket?: string;
	size?: string;
	type?: string;
	url?: string;
	_id?: string;
}

interface ContactProps {
	city?: string;
	state?: string;
	phone?: string;
	address?: string;
	country?: string;
}

interface MemberProps {
	availability?: string;
	tags?: string[];
	tagsIds?: Array<{ name: string; color: string }>;
	about?: string;
}

interface ProfileProps {
	contact?: ContactProps;
	bio?: {
		title: string;
		description: string;
	};
	talent: MemberProps;
}

interface MetaProps {
	profileLinks?: {
		website?: string;
		x?: string;
		tiktok?: string;
		instagram?: string;
		github?: string;
	};
	onboarding?: boolean;
	acceptedTerms?: boolean;
}

export interface AccountProps {
	_id: string;
	firstName?: string;
	lastName?: string;
	type?: Roles;
	profile?: ProfileProps;
	score?: number;
	profileCompleteness?: number;
	email?: string | undefined;
	profileImage?: ProfileImageProps;
	twoFa?: {
		status?: boolean;
		type?: string;
	};
	achievements?: AchievementProps[];
	// VerifyEmailResponse
	token?: string;
	expiresIn?: number;
	kyc?: boolean;
	kycStatus?: KycVerificationStatus;
	isVerified?: boolean;
	timeZone?: string;
	meta?: MetaProps;
	isPrivate?: boolean;
}

export interface UpdateUserDataProps {
	firstName: string;
	title: string;
	bio: string;
	location: string;
	country: string;
	avatar: string;
	kycVerified: boolean;
	tags: string[];
	isPrivate: boolean;
	email: string;
	website: string;
	x: string;
	tiktok: string;
	instagram: string;
	github: string;
}
