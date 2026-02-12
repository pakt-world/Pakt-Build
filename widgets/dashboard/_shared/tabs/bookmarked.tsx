"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type JSXElementConstructor, type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { TabContentWrapper } from "./_components/tab-contents-wrapper";

interface FetchedBookmarkProps {
	isFetched: boolean;
	isFetching: boolean;
	isError: boolean;
	bookmarks: Array<ReactElement<unknown, string | JSXElementConstructor<unknown>> | null | undefined>;
}

export const FeedsBookmark = ({ isFetched, isFetching, isError, bookmarks }: FetchedBookmarkProps): JSX.Element => {
	const tab = useMediaQuery("(min-width: 650px)");
	if (!isFetched && isFetching)
		return <PageLoading className="h-[50vh] bg-transparent sm:h-[65vh]" color="#ffffff" />;
	if (isError) return <PageError className="h-[50vh] bg-transparent sm:h-[65vh]" />;
	if (bookmarks.length === 0)
		return (
			<PageEmpty
				className="h-[50vh] bg-transparent sm:h-[65vh]"
				label="Bookmarked notifications will appear here"
			/>
		);

	return tab ? (
		<div className="w-full overflow-y-auto bg-transparent max-sm:p-4 sm:px-4 sm:pt-1">
			<div className="flex w-full flex-col sm:gap-5">{bookmarks}</div>
		</div>
	) : (
		<TabContentWrapper>{bookmarks}</TabContentWrapper>
	);
};
