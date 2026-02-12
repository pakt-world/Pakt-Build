/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
// import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMobileContext } from "@/providers/mobile-context-provider";
import { DynamicInput, DynamicMobileSearch, InputType, type Option } from "@/components/common/dynamic-mobile-filter";

interface OpenHeaderProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	minimumPriceQuery: string | number;
	setMinimumPriceQuery: (value: string | number) => void;
	maximumPriceQuery: string | number;
	setMaximumPriceQuery: (value: string | number) => void;
	activeTab: string;
	setActiveTab: (value: string) => void;
}

interface TabProps {
	label: string;
	value: string;
}
const TABS: TabProps[] = [
	{
		label: "All",
		value: "all",
	},
	{
		label: "Saved",
		value: "saved",
	},
];

export const OpenJobHeader4Mobile = ({
	searchQuery,
	setSearchQuery,
	minimumPriceQuery,
	setMinimumPriceQuery,
	maximumPriceQuery,
	setMaximumPriceQuery,
	activeTab,
	setActiveTab,
}: OpenHeaderProps): JSX.Element => {
	// const router = useRouter();
	// const searchParams = useSearchParams();
	// const activeTab = searchParams.get("open-jobs");

	const { showOpenJobs, setShowOpenJobs } = useMobileContext();

	const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
	// const [localSkillsQuery, setLocalSkillsQuery] = useState(skillsQuery);
	const [localMinimumPriceQuery, setLocalMinimumPriceQuery] = useState(minimumPriceQuery);
	const [localMaximumPriceQuery, setLocalMaximumPriceQuery] = useState(maximumPriceQuery);

	const inputs: DynamicInput[][] = [
		[
			{
				id: "keyword",
				type: InputType.Text,
				label: "Search",
				placeholder: "Search name, skill, category, etc.",
				value: localSearchQuery,
				onChange: (value: string | number | Option) => setLocalSearchQuery(value as string),
			},
		],
		[
			{
				id: "min",
				type: InputType.Numeric,
				label: "Job Price",
				placeholder: "Price (min)",
				value: localMinimumPriceQuery,
				onChange: (value: string | number | Option) => setLocalMinimumPriceQuery(value as number),
			},
			{
				id: "max",
				type: InputType.Numeric,
				placeholder: "Price (max)",
				value: localMaximumPriceQuery,
				onChange: (value: string | number | Option) => setLocalMaximumPriceQuery(value as number),
			},
		],
	];

	// Perform search
	const handleSearch = (closeModal?: boolean) => {
		setSearchQuery(localSearchQuery);
		// setSkillsQuery(localSkillsQuery);
		setMinimumPriceQuery(localMinimumPriceQuery);
		setMaximumPriceQuery(localMaximumPriceQuery);
		if (closeModal !== false) setShowOpenJobs(false);
	};

	return (
		<div
			className="fixed top-[131px] !z-40 flex h-[64px] w-full items-center justify-between gap-4 border-b border-t border-green-lighter
				bg-white px-5"
		>
			{TABS.map((tab) => (
				<button
					key={tab.value}
					value={tab.value}
					className={`hover:text-gray border-b-2 border-transparent px-2 py-5 text-center text-sm font-bold text-title transition-all
					duration-200 disabled:cursor-not-allowed sm:px-8 sm:py-2 ${activeTab === tab.value ? " !border-green-lighter" : ""}`}
					onClick={() => {
						setActiveTab(tab.value);
					}}
				>
					{tab.label}
				</button>
			))}
			<DynamicMobileSearch
				inputs={inputs}
				onSubmit={handleSearch}
				isModalOpen={showOpenJobs}
				toggleModal={setShowOpenJobs}
				top="top-[70px] "
				bottom="bottom-[64px]"
			/>
		</div>
	);
};
