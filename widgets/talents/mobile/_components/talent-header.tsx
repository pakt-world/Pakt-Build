"use client";

import { DynamicInput, DynamicMobileSearch, InputType, Option } from "@/components/common/dynamic-mobile-filter";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { useMobileContext } from "@/providers/mobile-context-provider";

interface MemberSearchProps {
	searchQuery: string;
	skillsQuery: string;
	minimumScoreQuery: string | number;
	maximumScoreQuery: string | number;
	setSearchQuery: (value: string) => void;
	setSkillsQuery: (value: string) => void;
	setMinimumScoreQuery: (value: string | number) => void;
	setMaximumScoreQuery: (value: string | number) => void;
}

export const TalentHeader = ({
	searchQuery,
	skillsQuery,
	minimumScoreQuery,
	maximumScoreQuery,
	setSearchQuery,
	setSkillsQuery,
	setMinimumScoreQuery,
	setMaximumScoreQuery,
}: MemberSearchProps): JSX.Element => {
	const { showTalentSearch, setShowTalentSearch } = useMobileContext();

	const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
	const [localSkillsQuery, setLocalSkillsQuery] = useState<string>(skillsQuery);
	const [localMinimumScoreQuery, setLocalMinimumScoreQuery] = useState(minimumScoreQuery);
	const [localMaximumScoreQuery, setLocalMaximumScoreQuery] = useState(maximumScoreQuery);

	const inputs: DynamicInput[][] = [
		[
			{
				id: "keyword",
				type: InputType.Text,
				label: "Keyword",
				placeholder: "Name, Category, etc.",
				value: localSearchQuery,
				onChange: (value: string | number | Option) => setLocalSearchQuery(value as string),
			},
		],
		[
			{
				id: "skill",
				type: InputType.Text,
				label: "Skill",
				placeholder: "Java, Solidity, etc.",
				value: localSkillsQuery,
				onChange: (value: string | number | Option) => setLocalSkillsQuery(value as string),
			},
		],
		[
			{
				id: "min",
				type: InputType.Numeric,
				label: "Buildscore",
				placeholder: "From:",
				value: localMinimumScoreQuery,
				onChange: (value: string | number | Option) => setLocalMinimumScoreQuery(value as string),
			},
			{
				id: "max",
				type: InputType.Numeric,
				placeholder: "To:",
				value: localMaximumScoreQuery,
				onChange: (value: string | number | Option) => setLocalMaximumScoreQuery(value as string),
			},
		],
	];

	// Perform search
	const handleSearch = (closeModal?: boolean) => {
		setSearchQuery(localSearchQuery);
		setSkillsQuery(localSkillsQuery);
		setMinimumScoreQuery(localMinimumScoreQuery);
		setMaximumScoreQuery(localMaximumScoreQuery);
		if (closeModal !== false) setShowTalentSearch(false);
	};

	return (
		<div
			className="fixed top-[70px] z-40 inline-flex h-[63px] w-full items-center justify-between !border-b !border-t border-green-lighter
				bg-white px-[21px] py-4"
		>
			<h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-title">Talents</h3>
			<DynamicMobileSearch
				inputs={inputs}
				onSubmit={handleSearch}
				isModalOpen={showTalentSearch}
				toggleModal={setShowTalentSearch}
				top="top-[70px] "
				bottom="bottom-[64px]"
			/>
		</div>
	);
};
