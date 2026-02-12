"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { SortApplicationsBy, SortApplicationsScoresBy } from "@/lib/enums";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { DynamicInput, DynamicMobileSearch, InputType, Option } from "@/components/common/dynamic-mobile-filter";
// import Logger from "@/lib/utils/logger";

const SORTBY_OPTIONS: Option[] = [
	{
		label: "Highest to lowest",
		value: SortApplicationsScoresBy.HIGHEST_TO_LOWEST,
	},
	{
		label: "Lowest to highest",
		value: SortApplicationsScoresBy.LOWEST_TO_HIGHEST,
	},
];

interface Props {
	scoreSort: Option;
	setScoreSort: (value: Option) => void;
	setSortBy: (value: SortApplicationsBy) => void;
	bidSort: Option;
	setBidSort: (value: Option) => void;
	// ==== //
	skillFilters: string[];
	setSkillFilters: (value: string[]) => void;
	job: {
		tagsData: string[];
	};
}

export const MobileApplicantFilter = ({
	scoreSort,
	setScoreSort,
	setSortBy,
	bidSort,
	setBidSort,
	// ===== //
	skillFilters,
	setSkillFilters,
	job,
}: Props): JSX.Element => {
	const { showFilterApplicants, setShowFilterApplicants } = useMobileContext();

	const [localScoreSortQuery, setLocalScoreSortQuery] = useState<Option>(scoreSort);
	const [localBidSortQuery, setLocalBidSortQuery] = useState<Option>(bidSort);
	const [localSkillQuery, setLocalSkillQuery] = useState<string[]>(skillFilters);

	const inputs: DynamicInput[][] = [
		[
			{
				id: "buildscore",
				type: InputType.Select,
				label: "Buildscore",
				placeholder: "Select score filter",
				value: localScoreSortQuery,
				onChange: (value: string | number | Option) => {
					setLocalScoreSortQuery(value as Option);
					setSortBy(SortApplicationsBy.SCORE);
				},
				options: SORTBY_OPTIONS,
			},
		],
		[
			{
				id: "bid",
				type: InputType.Select,
				label: "Bid",
				placeholder: "Select bid filter",
				value: localBidSortQuery,
				onChange: (value: string | number | Option) => {
					setLocalBidSortQuery(value as Option);
					setSortBy(SortApplicationsBy.BID);
				},
				options: SORTBY_OPTIONS,
			},
		],
		[
			{
				id: "bid",
				type: InputType.Radio,
				label: "Preferred Skills",
				value: localSkillQuery,
				onChange: (value: string | number | Option) => {
					if (localSkillQuery.includes(value as string)) {
						setLocalSkillQuery(localSkillQuery.filter((skill) => skill !== value));
					} else {
						setLocalSkillQuery([...localSkillQuery, value as string]);
					}
				},
				options: job.tagsData.map((tag) => tag.toLowerCase()),
			},
		],
	];

	// Logger.info("Filters", { localScoreSortQuery, localBidSortQuery, localSkillQuery });

	// Perform Filter
	const handleFilter = (closeModal?: boolean) => {
		setScoreSort(localScoreSortQuery);
		setBidSort(localBidSortQuery);
		setSkillFilters(localSkillQuery);
		if (closeModal !== false) setShowFilterApplicants(false);
	};

	return (
		<DynamicMobileSearch
			inputs={inputs}
			onSubmit={handleFilter}
			isModalOpen={showFilterApplicants}
			toggleModal={setShowFilterApplicants}
			top="top-[113px]"
			bottom="bottom-[64px]"
			trigger={
				<div className="flex w-[94px] items-center justify-center gap-2 rounded-[10px] border border-neutral-500 px-4 py-2">
					<span className="text-center text-sm font-bold leading-normal tracking-wide text-neutral-500">
						Filter
					</span>
					<SlidersHorizontal className="text-neutral-500" />
				</div>
			}
			buttonLabel="Apply Filter"
		/>
	);
};
