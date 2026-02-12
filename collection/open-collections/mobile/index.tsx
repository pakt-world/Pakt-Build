"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageError } from "@/components/common/page-error";
import { useGetJobsInfinitely } from "@/lib/api/job";
import { createQueryStrings2, sortArrayLatestFirstByDate } from "@/lib/utils";
import { CollectionCategory, CollectionStatus } from "@/lib/enums";
import { CollectionProps } from "@/lib/types/collection";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { jobWithCoin } from "@/lib/actions/collection";
import { useExchangeRateStore } from "@/lib/store/misc";
import { AllJobs4Mobile } from "./tabs/all";
import { SavedJobs4Mobile } from "./tabs/saved";
import { useUserState } from "@/lib/store/account";
import { OpenJobHeader4Mobile } from "./_components/header";

export const OpenJobs4Mobile = (): JSX.Element | null => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { user } = useUserState();
	const { _id: loggedInUserId } = user ?? { _id: "" };

	const { data: rates } = useExchangeRateStore();
	const [activeTab, setActiveTab] = useState<string>("all");
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	// const [skillsQuery, setSkillsQuery] = useState(searchParams.get("tags") ?? "");
	// const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

	const [minimumPriceQuery, setMinimumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[0] ?? ""
	);
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[1] ?? ""
	);
	const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

	useEffect(() => {
		const queries = createQueryStrings2({
			...(debouncedSearchQuery && { search: debouncedSearchQuery }),
			...(debouncedMinimumPriceQuery &&
				debouncedMaximumPriceQuery && {
					range: `${debouncedMinimumPriceQuery},${debouncedMaximumPriceQuery}`,
				}),
		});

		router.push(`${pathname}?${queries}`);
	}, [
		router,
		pathname,
		debouncedSearchQuery,
		// debouncedSkillsQuery,
		debouncedMinimumPriceQuery,
		debouncedMaximumPriceQuery,
	]);

	const queryParams = new URLSearchParams(searchParams);
	const searchQ = queryParams.get("search") ?? "";
	const tagsQ = queryParams.get("tags") ?? "";
	const rangeQ = queryParams.get("range") ?? "";

	// Remove the spaces in skills query before passing it to the endpoint
	const skillsQueryNoSpace = tagsQ
		.split(",")
		.map((skill) => skill.trim())
		.join(",");

	const {
		data: jobsPagesData,
		refetch: refetchJobs,
		failureReason,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetJobsInfinitely({
		limit: 30,
		category: CollectionCategory.OPEN,
		status: CollectionStatus.PENDING,
		filter: {
			...(searchQ && { search: searchQ }),
			...(tagsQ && { tags: skillsQueryNoSpace }),
			...(rangeQ && { range: rangeQ }),
		},
	});

	const jobsData = useMemo(
		() => ({
			...jobsPagesData,
			pages: jobsPagesData?.pages?.map((page) => page.data) ?? [],
		}),
		[jobsPagesData]
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
		error: error?.response?.data.message as string,
	});

	const bwc = jobWithCoin(currentData);
	const jobs = sortArrayLatestFirstByDate(bwc);

	const tooManyReq =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	if (isError && !tooManyReq) return <PageError className="h-full rounded-2xl border border-red-200 bg-red-50" />;

	return (
		<div className="relative mt-[61px] flex w-full flex-col overflow-y-auto">
			<OpenJobHeader4Mobile
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				minimumPriceQuery={minimumPriceQuery}
				setMinimumPriceQuery={setMinimumPriceQuery}
				maximumPriceQuery={maximumPriceQuery}
				setMaximumPriceQuery={setMaximumPriceQuery}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			{activeTab === "all" && (
				<AllJobs4Mobile
					jobs={jobs}
					onRefresh={refetchJobs}
					loading={isLoading}
					rates={rates}
					loggedInUser={loggedInUserId}
					isFetchingNextPage={isFetchingNextPage}
					tooManyReq={tooManyReq}
				/>
			)}
			{activeTab === "saved" && <SavedJobs4Mobile rates={rates} loggedInUser={loggedInUserId} />}
			<div ref={observerTarget} style={{ height: "1px", background: "transparent" }} />
		</div>
	);
};
