"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo } from "react";
import { Loader } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { FeedSkeleton } from "@/components/common/skeletons/feed-skeleton";
import { ScrollContentWithObserver, TabContentWrapper } from "./_components/tab-contents-wrapper";
import { ParseFeedView } from "@/collection/collection-feeds";
import { useFeeds } from "@/hooks/use-feeds";
import { useMobileContext } from "@/providers/mobile-context-provider";
import ScrollToTopOnRouteChange from "@/components/common/scroll-to-top-on-route-change";
import HomeHeroBanner4Mobile from "@/widgets/home/mobile/hero-banner";
import Logger from "@/lib/utils/logger";

export const Feeds = ({ rates }: { rates: ExchangeRateRecord | undefined }): JSX.Element => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const pathname = usePathname();
	const { setIsAtTop } = useMobileContext();

	const { user } = useUserState();
	const { _id: loggedInUser } = user || { _id: "" };

	let currentPage = 1;
	const { currentData, isLoading, isError, isFetchingNextPage, handleBottomReach, refetchFeeds } =
		useFeeds(currentPage);

	// === Parse feeds
	const timelineFeeds = useMemo(
		() => (currentData || []).map((feed, index) => ParseFeedView(feed, loggedInUser, index, refetchFeeds, rates)),
		[currentData, loggedInUser, rates, refetchFeeds]
	);

	// Reset Scroll
	useEffect(() => {
		if (isMobile) setIsAtTop(true);
	}, [isMobile, setIsAtTop]);

	// Add Shimmer effect if all necessary data are not ready
	if (isLoading && currentData.length === 0 && rates !== undefined) {
		return (
			<TabContentWrapper>
				<FeedSkeleton />
			</TabContentWrapper>
		);
	}

	// Show error state if there is an error
	if (isError) {
		return <PageError className="bg-transparent max-sm:h-[35vh] sm:!h-[65vh]" />;
	}
	// Show empty state if no data is available
	if (currentData.length === 0 && rates !== undefined) {
		return <PageEmpty className="bg-transparent max-sm:h-[35vh] sm:!h-[65vh]" />;
	}

	return (
		<ScrollToTopOnRouteChange>
			<ScrollContentWithObserver
				onBottomReach={handleBottomReach}
				className="border-b-0"
				onTopReach={() => {
					Logger.info("Reached the top!");
				}}
				onScrollPastThreshold={() => Logger.info("Scrolled past threshold!")}
			>
				{isMobile && pathname !== "/dashboard" && <HomeHeroBanner4Mobile />}
				{timelineFeeds}
				{isFetchingNextPage && (
					<div className="mx-auto flex w-full flex-row items-center justify-center text-center max-sm:my-4">
						<Loader size={25} className="animate-spin text-center text-black" />
					</div>
				)}
			</ScrollContentWithObserver>
		</ScrollToTopOnRouteChange>
	);
};
