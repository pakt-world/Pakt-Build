"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useState, useRef } from "react";
import { useDebounce } from "usehooks-ts";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetTalentInfinitely } from "@/lib/api";
import { createQueryStrings2 } from "@/lib/utils";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { mapTalentData } from "@/lib/actions/talent";
import { TalentProps } from "@/lib/types/talents";
import { TalentHeader } from "./_components/talent-header";
import { TalentList } from "./_components/talent-list";

export const TalentsDesktopView = (): JSX.Element => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const [skillsQuery, setSkillsQuery] = useState(searchParams.get("skills") ?? "");
	const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

	const [minimumPriceQuery, setMinimumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[0] ?? ""
	);
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[1] ?? ""
	);
	const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

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
	// Remove the spaces in skills query before passing it to the endpoint
	const skillsQueryNoSpace = skillQ
		.split(",")
		.map((skill) => skill.trim())
		.join(",");

	const {
		data: talentPagesData,
		refetch: talentRefetch,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTalentInfinitely({
		limit: 12,
		filter: {
			...(searchQ && { search: searchQ }),
			...(skillQ && { tags: skillsQueryNoSpace }),
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
		<div className="relative flex h-full w-full flex-col gap-6 overflow-auto xl:px-4 2xl:px-8">
			<TalentHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				skillsQuery={skillsQuery}
				setSkillsQuery={setSkillsQuery}
				minimumPriceQuery={minimumPriceQuery}
				setMinimumPriceQuery={setMinimumPriceQuery}
				maximumPriceQuery={maximumPriceQuery}
				setMaximumPriceQuery={setMaximumPriceQuery}
			/>
			<TalentList
				isLoading={isLoading}
				talents={newData}
				isFetchingNextPage={isFetchingNextPage}
				ref={observerTarget}
			/>
		</div>
	);
};
