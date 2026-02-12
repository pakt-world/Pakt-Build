"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CollectionInviteFilled, CollectionInviteFilledProps } from "./collection-invite-filled";
import { CollectionInvitePending, CollectionInvitePendingProps } from "./collection-invite-pending";
import { CollectionInviteResponse, CollectionInviteResponseProps } from "./collection-invite-response";
import { CollectionInviteType } from "./enum";

type JobFeedCardProps = CollectionInviteFilledProps | CollectionInvitePendingProps | CollectionInviteResponseProps;

export const JobFeedCard = (props: JobFeedCardProps): ReactElement => {
	const { type } = props;

	if (type === CollectionInviteType.COLLECTION_INVITE_FILLED) {
		return <CollectionInviteFilled {...props} />;
	}

	if (type === CollectionInviteType.COLLECTION_INVITE_PENDING) {
		return <CollectionInvitePending {...props} />;
	}

	if (type === CollectionInviteType.COLLECTION_INVITE_RESPONSE) {
		return <CollectionInviteResponse {...props} />;
	}

	return <div />;
};
