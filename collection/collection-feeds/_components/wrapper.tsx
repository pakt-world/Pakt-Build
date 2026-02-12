"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode, type ReactElement } from "react";
import { Briefcase, Gavel } from "lucide-react";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AUTH_TOKEN_KEY, formatDateHandler } from "@/lib/utils";
import { BookmarkCollection } from "@/collection/_shared/bookmark-collection";
// import { useDismissFeed } from "@/lib/api/dashboard";

dayjs.extend(relativeTime);

export const FeedCardWrapper = ({
	children,
	borderColor,
	iconColor,
	bgColor,
	isPaymentReleased,
	isIssueResolution,
	createdAt,
	feedId,
	refetchFeeds,
	dismissible: _d,
	bookmark,
	bookmarkable = true,
	bookmarkStyles,
	dueDate,
	collectionAmount,
}: {
	children: ReactNode;
	borderColor: string;
	iconColor: string;
	bgColor: string;
	isPaymentReleased?: boolean;
	isIssueResolution?: boolean;
	createdAt: string;
	feedId: string;
	dismissible?: boolean;
	refetchFeeds: () => void;
	bookmark: { onBookmarksTab: boolean; isBookmarked: boolean; bookmarkId: string };
	bookmarkable?: boolean;
	bookmarkStyles?: string;
	dueDate?: string;
	collectionAmount?: JSX.Element;
}): ReactElement => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const token = getCookie(AUTH_TOKEN_KEY);
	const { isBookmarked, bookmarkId, onBookmarksTab: _ob } = bookmark;

	// const useDismissFeedByID = (callback: () => void) => {
	// 	const dismissFeed = useDismissFeed();
	// 	return (id: string): void => {
	// 		dismissFeed.mutate(id, {
	// 			onSuccess: () => {
	// 				void callback?.();
	// 			},
	// 		});
	// 	};
	// };

	// const dismissByID = useDismissFeedByID(refetchFeeds);

	// Time from X with dayjs
	const timeFromNow = dayjs(createdAt).fromNow();

	return (
		<div
			className="border-border-blue-lighter group relative z-10 flex h-fit w-full origin-center transform justify-between gap-4
				overflow-hidden border-y transition duration-200 will-change-transform hover:scale-[1.01] max-sm:px-[21px] max-sm:py-4
				sm:min-h-[174px] sm:rounded-2xl sm:border-2 sm:p-4"
			style={{
				borderColor,
				backgroundColor: bgColor,
			}}
		>
			<div className="flex h-full w-full sm:w-[calc(100%-120px)]">{children}</div>
			<div className="flex h-[calc(100%-16px)] flex-col items-end justify-between max-sm:absolute max-sm:right-5 max-sm:top-4 sm:h-auto">
				<div className="flex flex-col items-end gap-2">
					{isMobile && collectionAmount}
					<p className="whitespace-pre text-xs font-medium text-title">
						{/* {formatDateHandler(createdAt ?? "DD MMM, YYYY hh:mm A")} */}
						{dueDate ? `Due: ${formatDateHandler(dueDate, "DD MMM, YYYY")}` : timeFromNow}
					</p>
					{/* {token && dismissible && !onBookmarksTab && (
						<X
							size={20}
							className="cursor-pointer"
							onClick={() => {
								dismissByID(feedId);
							}}
						/>
					)} */}
				</div>
				{token && bookmarkable && (
					<div
						className={`relative -right-1 bottom-4 flex size-fit sm:-right-[2px] sm:bottom-2.5 ${bookmarkStyles}`}
					>
						<BookmarkCollection
							size={24}
							isBookmarked={isBookmarked}
							type="feed"
							bookmarkId={isBookmarked ? bookmarkId : feedId}
							callback={refetchFeeds}
						/>
					</div>
				)}
			</div>
			{!isMobile &&
				(isPaymentReleased ? (
					<div className="absolute right-[40px] top-[50px] -z-[1] translate-x-1/3">
						<svg
							width="79"
							height="118"
							viewBox="0 0 79 118"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M35.3681 122.369C34.4617 122.369 33.6912 122.051 33.0567 121.417C32.4222 120.782 32.1049 120.012 32.1049 119.105V109.588C25.3973 108.953 19.7321 107.367 15.1093 104.829C10.4865 102.2 6.99675 99.0732 4.64003 95.4475C2.2833 91.7311 1.01429 87.8788 0.833008 83.8905C0.833008 83.0747 1.10494 82.3949 1.6488 81.851C2.2833 81.3071 3.00845 81.0352 3.82424 81.0352H15.9251C17.0128 81.0352 17.8739 81.3071 18.5084 81.851C19.143 82.3042 19.6415 82.8934 20.0041 83.6185C20.6386 85.3408 21.681 87.063 23.1313 88.7852C24.6722 90.4168 26.8023 91.7764 29.5216 92.8642C32.2409 93.9519 35.64 94.4957 39.719 94.4957C46.2453 94.4957 51.0947 93.408 54.2672 91.2326C57.4397 89.0571 59.026 86.1112 59.026 82.3949C59.026 79.7662 58.1649 77.6814 56.4427 76.1405C54.8111 74.5089 52.1824 73.0586 48.5567 71.7896C44.931 70.43 40.1722 69.025 34.2804 67.5747C27.5728 65.9431 21.9076 63.9943 17.2848 61.7282C12.662 59.3715 9.17219 56.4256 6.81546 52.8905C4.54938 49.3554 3.41634 44.8685 3.41634 39.4299C3.41634 32.4504 5.95435 26.5133 11.0304 21.6185C16.1064 16.7238 23.1313 13.7326 32.1049 12.6449V3.26328C32.1049 2.35685 32.4222 1.58638 33.0567 0.951872C33.6912 0.317372 34.4617 0.00012207 35.3681 0.00012207H43.662C44.5684 0.00012207 45.3389 0.317372 45.9734 0.951872C46.6079 1.58638 46.9251 2.35685 46.9251 3.26328V12.9168C53.0889 13.8232 58.2555 15.6361 62.4251 18.3554C66.5947 21.0747 69.7672 24.2019 71.9427 27.737C74.1181 31.1814 75.2511 34.5352 75.3418 37.7984C75.3418 38.5235 75.0699 39.2033 74.526 39.8378C74.0728 40.3817 73.393 40.6536 72.4865 40.6536H59.8418C59.026 40.6536 58.2555 40.4723 57.5304 40.1098C56.8052 39.7472 56.2161 39.0674 55.7628 38.0703C55.3096 35.2604 53.5874 32.8583 50.5962 30.8642C47.6049 28.87 43.7073 27.8729 38.9032 27.8729C34.0084 27.8729 30.0655 28.7794 27.0742 30.5922C24.1737 32.4051 22.7234 35.215 22.7234 39.0221C22.7234 41.5601 23.4485 43.6902 24.8988 45.4124C26.3491 47.044 28.7058 48.4943 31.969 49.7633C35.3228 51.0323 39.7643 52.3919 45.2935 53.8422C52.9982 55.5644 59.2526 57.5586 64.0567 59.8247C68.9514 62.0908 72.5318 64.9914 74.7979 68.5264C77.1547 71.9709 78.333 76.3671 78.333 81.715C78.333 86.9723 77.0187 91.5952 74.39 95.5835C71.852 99.4811 68.2263 102.654 63.5128 105.101C58.7994 107.458 53.2701 108.999 46.9251 109.724V119.105C46.9251 120.012 46.6079 120.782 45.9734 121.417C45.3389 122.051 44.5684 122.369 43.662 122.369H35.3681Z"
								fill="#529E31"
								fill-opacity="0.2"
							/>
						</svg>
					</div>
				) : isIssueResolution ? (
					<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
						<Gavel size={200} color={iconColor} />
					</div>
				) : (
					<div className="absolute right-[26px] top-[84px] -z-[1] translate-x-1/3">
						<Briefcase size={200} color={iconColor ?? "#C9F0FF"} />
					</div>
				))}
		</div>
	);
};
