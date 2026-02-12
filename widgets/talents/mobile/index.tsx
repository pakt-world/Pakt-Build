"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { createQueryStrings2 } from "@/lib/utils";
import { useGetTalentInfinitely } from "@/lib/api";
import { TalentHeader } from "./_components/talent-header";
import { TalentList } from "./_components/talent-list";
import { TalentProps } from "@/lib/types/talents";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { mapTalentData } from "@/lib/actions/talent";

export const TalentsMobileView = (): JSX.Element => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const [skillsQuery, setSkillsQuery] = useState(searchParams.get("skills") ?? "");
	const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

	const [minimumScoreQuery, setMinimumScoreQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[0] ?? ""
	);
	const debouncedMinimumPriceQuery = useDebounce(minimumScoreQuery, 300);

	const [maximumScoreQuery, setMaximumScoreQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[1] ?? ""
	);
	const debouncedMaximumPriceQuery = useDebounce(maximumScoreQuery, 300);

	const prevPageRef = useRef(0);
	const currentPageRef = useRef(1);

	useEffect(() => {
		const queries = createQueryStrings2({
			...(debouncedSkillsQuery && {
				skills: debouncedSkillsQuery,
			}),
			...(debouncedSearchQuery && {
				search: debouncedSearchQuery,
			}),
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
	const skillQ = queryParams.get("skills") ?? "";
	const rangeQ = queryParams.get("range") ?? "";

	const {
		data: talentPagesData,
		refetch: talentRefetch,
		// isFetched,
		// isFetching,
		isLoading,
		// isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTalentInfinitely({
		limit: 12,
		filter: {
			...(searchQ && { search: searchQ }),
			...(skillQ && { tags: skillQ }),
			...(rangeQ && { range: rangeQ }),
			profileCompletenessMin: 70,
			profileCompletenessMax: 101,
			owner: true,
			sortBy: "score",
			orderBy: "desc",
			isPrivate: false,
		},
	});

	const talentData = useMemo(
		() => ({
			...talentPagesData,
			pages: talentPagesData?.pages?.map((page) => page.data) ?? [],
		}),
		[talentPagesData]
	);

	const { observerTarget, currentData } = useInfiniteScroll<TalentProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage: currentPageRef.current,
		prevPage: prevPageRef.current,
		data: talentData,
		refetch: talentRefetch,
		error: error?.response?.data.message ?? "",
	});
	const newData = currentData.map(mapTalentData);

	return (
		<div className="relative flex w-full flex-col overflow-y-auto">
			<TalentHeader
				searchQuery={searchQuery}
				skillsQuery={skillsQuery}
				minimumScoreQuery={minimumScoreQuery}
				maximumScoreQuery={maximumScoreQuery}
				setSearchQuery={setSearchQuery}
				setSkillsQuery={setSkillsQuery}
				setMinimumScoreQuery={setMinimumScoreQuery}
				setMaximumScoreQuery={setMaximumScoreQuery}
			/>
			<TalentList isLoading={isLoading} talents={newData} isFetchingNextPage={isFetchingNextPage} />
			<div ref={observerTarget} style={{ height: "1px", background: "transparent" }} />
		</div>
	);
};
