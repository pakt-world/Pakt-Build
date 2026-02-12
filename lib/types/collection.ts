import {
	type JobCategory,
	type Bucket,
	type CollectionInviteStatus,
	type CollectionStatus,
	type CollectionTypes,
	type PayoutStatus,
	type Roles,
	type SocketStatus,
	type TagType,
} from "@/lib/enums";

import { type TalentProps } from "./talents";
import { AccountProps } from "./account";
import { DataFeedResponse } from "../api/dashboard/types";

export interface Bio {
	title: Roles;
	description: string;
}

export interface Contact {
	state: string;
	city: string;
	country: string;
}

export interface CreatorTagsIDsProps {
	_id: string;
	name: string;
	categories: unknown[];
	isParent: boolean;
	type: TagType;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	entryCount?: number;
	key?: string;
	color: string;
}
export interface BountyTagProps {
	_id: string;
	name: string;
	color: string;
	type: TagType;
}

export interface CreatorTalent {
	tags: string[];
	tagsIds: CreatorTagsIDsProps[];
}

export interface BountyCreatorProfileProps {
	contact: Contact;
	bio: Bio;
	talent: CreatorTalent;
}

export interface ProfileImage {
	_id: string;
	name: string;
	type: string;
	size: string;
	bucket?: Bucket;
	url: string;
}

export interface Socket {
	id: string;
	status: SocketStatus;
}

interface Invite {
	_id: string;
	sender: TalentProps;
	receiver: TalentProps;
	data: string;
	parentData: string;
	status: CollectionInviteStatus;
	emailToken: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	acceptedAt?: Date;
}

interface Rating {
	_id: string;
	review: string;
	rating: number;
	createdAt: string;
	updatedAt: string;
	owner: TalentProps;
	receiver: TalentProps;
}

export interface MetaProps {
	coin: CoinProps;
	usdInitialValue: number;
	completedAt?: string; // Date string
	[other: string]: unknown;
}

export interface CollectionProps {
	_id: string;
	creator: TalentProps;
	name: string;
	category: JobCategory;
	description: string;
	equity: string;
	parent: CollectionProps;
	collections: CollectionProps[]; // Recursive - Empty on aware instance
	type: CollectionTypes;
	owners: unknown[] | string[];
	invites: unknown[] | Invite[];
	attachments: unknown[];
	attachmentData: unknown[];
	tagsData: string[];
	tags: BountyTagProps[] | CreatorTagsIDsProps[];
	status: CollectionStatus;
	inviteAccepted: boolean;
	payoutStatus: PayoutStatus;
	feePayoutStatus: PayoutStatus;
	paktFeePayoutStatus: PayoutStatus;
	isPrivate: boolean;
	ratings?: Rating[];
	recipientCompletedJob: boolean;
	score: number;
	progress: number;
	isDeleted: boolean;
	payoutTransactions: unknown[];
	failedPayoutCount: number;
	failedFeePayoutCount: number;
	failedPaktFeePayoutCount: number;
	isParentFunded: boolean;
	__v: number;
	createdAt: string; // Date string
	issue?: string;
	updatedAt: Date;
	paymentFee: number;
	deliveryDate?: string; // Date string
	meta: MetaProps;
	invite?: Invite;
	owner?: TalentProps;
	wallet?: string;
	chainId?: string;
	charges?: string;
	expectedAmount?: string;
	feePercentage?: string;
	paktCharges?: string;
	paktFeePercentage?: string;
	paymentAddress?: string;
	rate: string;
	usdExpectedAmount?: string;
	usdExpectedFee?: string;
	escrowPaid?: boolean;
	isBookmarked?: boolean;
	bookmarkId?: string;
	releaseFundAmount?: string;
}

export interface CoinProps {
	active: boolean;
	createdAt: string;
	decimal: string;
	icon: string;
	isToken: boolean;
	name: string;
	reference: string;
	rpcChainId: string;
	symbol: string;
	updatedAt: string;
	__v: number;
	_id: string;
}

export interface SavedCollectionProps {
	_id: string;
	type: string;
	owner?: AccountProps;
	data: CollectionProps;
	feed: DataFeedResponse;
}
