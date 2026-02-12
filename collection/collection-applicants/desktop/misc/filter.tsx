/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RadioGroup } from "@/components/common/radio-group";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { SortApplicationsBy, SortApplicationsScoresBy } from "@/lib/enums";

export interface Option {
	label: string;
	value: string;
}

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

interface ApplicantFilterProps {
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

export const ApplicantFilter = ({
	setSkillFilters,
	skillFilters,
	setSortBy,
	setScoreSort,
	bidSort,
	setBidSort,
	scoreSort,
	job,
}: ApplicantFilterProps): JSX.Element => {
	const onChange = (value: string) => {
		if (skillFilters.includes(value)) {
			setSkillFilters(skillFilters.filter((skill) => skill !== value));
		} else {
			setSkillFilters([...skillFilters, value]);
		}
	};

	return (
		<div className="border-primary-light flex h-fit shrink-0 grow-0 basis-[300px] flex-col gap-4 rounded-2xl border bg-white p-4">
			<div className="w-full">
				<p className="pb-2 text-title">Buildscore</p>
				<SelectDropdown
					options={SORTBY_OPTIONS}
					value={scoreSort}
					onChange={(value: Option) => {
						setSortBy(SortApplicationsBy.SCORE);
						setScoreSort(value);
					}}
					placeholder="Select Category"
					triggerClassName="h-10 w-full sm:text-base"
					className="sm:w-full"
				/>
			</div>
			<div className="w-full">
				<p className="pb-2 text-title">Bid</p>
				<SelectDropdown
					options={SORTBY_OPTIONS}
					value={bidSort}
					onChange={(value: Option) => {
						setSortBy(SortApplicationsBy.BID);
						setBidSort(value);
					}}
					placeholder="Select Category"
					triggerClassName="h-10 w-full sm:text-base"
					className="sm:w-full"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-title">Preferred Skills</span>

				<div className="flex flex-col gap-2">
					<RadioGroup
						options={job?.tagsData?.map((tag) => tag.toLowerCase()) as string[]}
						onChange={(value: string) => onChange(value)}
						className="gap-4"
						value={skillFilters}
					/>
				</div>
			</div>
		</div>
	);
};
