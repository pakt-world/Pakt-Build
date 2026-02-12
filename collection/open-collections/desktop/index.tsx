"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { useGetJobsInfinitely } from "@/lib/api/job";
import { createQueryStrings2 } from "@/lib/utils";
import { AllJobs } from "./all";
import { SavedJobs } from "./saved";
import { OpenHeader } from "./_components/header";
import { CollectionCategory, CollectionStatus } from "@/lib/enums";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { CollectionProps } from "@/lib/types/collection";
import { sortArrayLatestFirstByDate } from "@/lib/utils";
import { useExchangeRateStore } from "@/lib/store/misc";
import { jobWithCoin } from "@/lib/actions/collection";

export const OpenJobs4Desktop = (): JSX.Element | null => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { data: rates } = useExchangeRateStore();

	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const [skillsQuery, setSkillsQuery] = useState(searchParams.get("tags") ?? "");
	const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

	//  ===== Payment Fee
	const [minimumPriceQuery, setMinimumPriceQuery] = useState(searchParams.get("range")?.split(",")[0] ?? "");
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[1] ?? ""
	);
	const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);
	//  ===== Payment Fee

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	useEffect(() => {
		const queries = createQueryStrings2({
			...(debouncedSearchQuery && { search: debouncedSearchQuery }),
			...(debouncedSkillsQuery && { tags: debouncedSkillsQuery }),
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
		debouncedSkillsQuery,
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
		limit: 20,
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
	// const ijp = isJobPaid(currentData);
	const bwc = jobWithCoin(currentData);
	const jobs = sortArrayLatestFirstByDate(bwc);

	const tooManyReq =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	return (
		<div className="relative flex h-full w-full flex-col gap-6">
			<OpenHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				skillsQuery={skillsQuery}
				setSkillsQuery={setSkillsQuery}
				minimumPriceQuery={minimumPriceQuery}
				setMinimumPriceQuery={setMinimumPriceQuery}
				maximumPriceQuery={maximumPriceQuery}
				setMaximumPriceQuery={setMaximumPriceQuery}
			/>

			<Tabs
				urlKey="open-jobs"
				tabs={[
					{
						label: "All",
						value: "all",
						content: (
							<AllJobs
								jobs={jobs}
								onRefresh={refetchJobs}
								loading={isLoading}
								isFetchingNextPage={isFetchingNextPage}
								ref={observerTarget}
								tooManyReq={tooManyReq}
								isError={isError}
								rates={rates}
							/>
						),
					},
					{
						label: "Saved",
						value: "saved",
						content: <SavedJobs rates={rates} />,
					},
				]}
				className="flex h-full w-full flex-col gap-4 overflow-auto"
				tabContentContainerClassName="!mt-0"
			/>
		</div>
	);
};
