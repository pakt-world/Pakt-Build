"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { useGetActiveJobsInfinitely } from "@/lib/api/job";
import { useGetInvites } from "@/lib/api/invites";
import { CollectionStatus, KycVerificationStatus } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { sortArrayLatestFirstByDate, userKycIsApproved } from "@/lib/utils";
import { ParseFeedView } from "@/collection/collection-feeds";
import { filterInvites, getActiveJobs } from "@/lib/actions/collection";
import { ActiveCollection } from "@/collection/collection-feeds/feed-cards/active-collection";
import { getDeliverableCounts, getUpdatedAt, getUserInfo } from "@/lib/actions/dashboard";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { useExchangeRateStore } from "@/lib/store/misc";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { Feeds } from "../_shared/tabs/feeds";
import { ActiveJobs } from "../_shared/tabs/active-jobs";
import { Invites } from "../_shared/tabs/invites";
import { FeedsBookmark } from "../_shared/tabs/bookmarked";

export const DashboardTabs4Mobile = (): JSX.Element => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const pathname = usePathname();

	const [activeBountiesCount, setActiveBountiesCount] = useState<string>("0");
	const [bookmarkCount, setBookmarkCount] = useState<string>("0");
	const [invitesCount, setInvitesCount] = useState<string>("0");

	const { user } = useUserState();
	const { _id: loggedInUser, profileCompleteness, kycStatus } = user || { _id: "" };

	const profileCompleted = (profileCompleteness as number) > 70;
	const userHasDoneKyc = userKycIsApproved(kycStatus ?? KycVerificationStatus.EMPTY);

	const { data: rates } = useExchangeRateStore();

	const { isAtTop } = useMobileContext();

	// ======= Active Jobs Start ======= //

	let prevPage = 0;
	let currentPage = 1;

	const {
		data: activeJobs,
		refetch: refetchJobs,
		isLoading,
		failureReason,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetActiveJobsInfinitely({
		limit: 50,
		enable: pathname === "/dashboard",
		status: [
			CollectionStatus.PENDING,
			CollectionStatus.ONGOING,
			CollectionStatus.CANCEL_REQUESTED,
			CollectionStatus.WAITING,
			CollectionStatus.PAYMENT_REQUESTED,
		],
	});

	const jobsData = useMemo(
		() => ({
			...activeJobs,
			pages: activeJobs?.pages?.map((page) => page.data) ?? [],
		}),
		[activeJobs]
	);

	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: jobsData,
		refetch: refetchJobs,
		error: failureReason?.response?.data.message ?? "",
	});

	const activeJobsData = getActiveJobs(currentData);
	const aj = sortArrayLatestFirstByDate(activeJobsData);

	const tooManyReq4ActiveJobs =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	const activeJobList = useMemo(
		() =>
			(aj || []).map((job, i) => {
				const deliverableCountPercentage = getDeliverableCounts(job.collections);
				const clientHasReviewed = job.ratings?.some((review) => review.owner._id === job.creator._id);
				const updatedAt = getUpdatedAt(job.collections);
				return (
					<ActiveCollection
						key={i}
						id={job?._id}
						progress={deliverableCountPercentage}
						creator={getUserInfo(job?.creator)}
						talent={getUserInfo(job?.owner)}
						description={job?.description}
						title={job?.name}
						isCreator={job?.creator._id === loggedInUser}
						jobProgress={job?.progress}
						tab={isDesktop}
						jobStatus={job?.status}
						clientHasReviewed={clientHasReviewed ?? false}
						updatedAt={updatedAt?.toString() ?? ""}
					/>
				);
			}),
		[aj, loggedInUser, isDesktop]
	);

	// ======= Active Jobs End ======= //

	// ======= Bookmarked Jobs Start ======= //

	const {
		data: bookmarkData,
		isFetched: isFetchedBookmark,
		isFetching: isFetchingBookmark,
		refetch,
		isError: isErrorBookmark,
	} = useGetBookmarks({ page: 1, limit: 10, filter: { type: "feed" }, enable: pathname === "/dashboard" });

	const bookmarks = useMemo(
		() =>
			(bookmarkData?.data ?? []).map((feed, index) =>
				ParseFeedView(
					{
						...feed.feed,
						bookmarkId: feed?._id,
						isBookmarked: true,
					},
					loggedInUser,
					index,
					refetch,
					rates,
					true
				)
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[bookmarkData?.data]
	);
	// Remove null
	const bookmarksFiltered = bookmarks.filter((bookmark) => bookmark !== null);

	// ======= Bookmarked Jobs End ======= //

	// ======= Job Invites Start ======= //

	const invitesQuery = useGetInvites({ filter: { status: "pending" }, enable: pathname === "/dashboard" });
	const i = invitesQuery.data?.data ?? [];
	const invites = filterInvites(i, loggedInUser);

	// ======= Job Invites End ======= //

	useEffect(() => {
		setActiveBountiesCount(activeJobList.length.toString());
		setBookmarkCount(bookmarksFiltered?.length.toString());
		setInvitesCount(invites?.length.toString() ?? "0");
	}, [bookmarksFiltered?.length, invites?.length, activeJobList?.length]);

	const Label4ActiveBounties = `Active Jobs (${Number(activeBountiesCount) >= 10 ? "10+" : activeBountiesCount})`;
	const Label4Invites = `Invites (${Number(invitesCount) >= 10 ? "10+" : invitesCount})`;
	const Label4Bookmarks = isDesktop
		? `Bookmarks (${Number(bookmarkCount) >= 10 ? "10+" : bookmarkCount})`
		: "Bookmarks";

	const shouldHideTabList = !userHasDoneKyc || !profileCompleted;

	const tabListTopPosition = shouldHideTabList
		? "relative"
		: isAtTop
			? "max-sm:top-[148px] fixed"
			: "max-sm:top-[70px] fixed";
	const tabContentMarginTop = "";
	// const tabMarginTop = "";
	const tabMarginTop =
		isAtTop && !shouldHideTabList
			? "max-sm:mt-[64px]" // "max-sm:mt-[64px]" 64px is the height of the tab list
			: "max-sm:mt-0";

	return (
		<div className="!z-[3] w-full">
			<Tabs
				tabs={[
					{
						label: <span className="flex items-center gap-1 whitespace-pre">Your Feed</span>,
						value: "feed",
						content: <Feeds rates={rates} />,
					},
					{
						label: <span className="flex items-center gap-1 whitespace-pre">{Label4ActiveBounties}</span>,
						value: "active",
						content: (
							<ActiveJobs
								activeJobList={activeJobList}
								isFetchingNextPage={isFetchingNextPage}
								isLoading={isLoading}
								ref={observerTarget}
								isError={isError}
								tooManyReq={tooManyReq4ActiveJobs}
							/>
						),
					},
					{
						label: <span className="flex items-center gap-1 whitespace-pre">{Label4Invites}</span>,
						value: "invites",
						content: (
							<Invites
								isLoading={invitesQuery.isLoading}
								isError={invitesQuery.isError}
								invites={invites}
								rates={rates}
							/>
						),
					},
					{
						label: <span className="flex items-center gap-1 whitespace-pre">{Label4Bookmarks}</span>,
						value: "bookmarks",
						content: (
							<FeedsBookmark
								isFetched={isFetchedBookmark}
								isFetching={isFetchingBookmark}
								isError={isErrorBookmark}
								bookmarks={bookmarksFiltered}
							/>
						),
					},
				]}
				className={`${tabMarginTop} -webkit-transition-all -moz-transition-all -o-transition-all z-[5] transition-all duration-300
					ease-in-out`}
				tabListClassName={`transition-all !border-y-0 !border-x-0 !border-2 !text-sm !border-b !gap-4 duration-300 ease-in-out -webkit-transition-all -moz-transition-all -o-transition-all !z-50 px-2 flex !justify-start ${tabListTopPosition}`}
				tabContentContainerClassName={`${tabContentMarginTop} transition-all duration-300 ease-in-out -webkit-transition-all -moz-transition-all -o-transition-all`}
			/>
		</div>
	);
};
