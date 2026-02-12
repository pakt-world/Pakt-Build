import { AccountProps } from "@/lib/types/account";
import { CollectionProps } from "@/lib/types/collection";

export interface DataFeedResponse {
	closed: boolean;
	createdAt: string;
	updatedAt?: string;
	creator: AccountProps;
	data: CollectionProps;
	description: string;
	isBookmarked?: boolean;
	bookmarkId?: string;
	isPublic?: boolean;
	issue?: string;
	owner: AccountProps;
	owners?: AccountProps[];
	title: string;
	type: string;
	meta?: {
		value: number;
		isMarked: boolean;
		rating: number;
		amount: number;
		usdValue: number;
	};
	_id: string;
}
