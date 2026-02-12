"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobs } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { JobList } from "./_components/job-list";
import { CollectionCategory } from "@/lib/enums";
import { sortArrayLatestFirstByDate } from "@/lib/utils";
import { useExchangeRateStore } from "@/lib/store/misc";
import { provideUnassignedJobs } from "@/lib/actions/collection";
import { PageEmpty } from "@/components/common/page-empty";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";

const InviteTalent = ({
	talentId,
	setIsOpen,
}: {
	talentId: string;
	setIsOpen: (isOpen: boolean) => void;
}): JSX.Element | null => {
	const jobsData = useGetJobs({ category: CollectionCategory.CREATED, limit: 50 });
	const { data: rates } = useExchangeRateStore();

	if (jobsData.isError) return <PageError />;

	if (jobsData.isLoading) return <PageLoading color="#3055B3" />;

	const jobs = jobsData.data.data;
	const unassignedJobs = provideUnassignedJobs(jobs);
	const sortedJobs = sortArrayLatestFirstByDate(unassignedJobs);

	if (unassignedJobs.length === 0)
		return (
			<div className="flex h-full flex-col sm:gap-2">
				<div className="bg-dark-bg p-4 text-white">
					<button
						className="flex items-center gap-2"
						onClick={() => {
							setIsOpen(false);
						}}
						type="button"
					>
						<ChevronLeft size={24} strokeWidth={2} />
						<h2 className="text-2xl font-bold">Invite Talent</h2>
					</button>
				</div>
				<PageEmpty label="Your Created Jobs Will Appear Here" className="max-sm:h-full" />
			</div>
		);

	return <JobList jobs={sortedJobs} talentId={talentId} setIsOpen={setIsOpen} rates={rates} />;
};

interface Props {
	isOpen: boolean;
	talentId: string;
	setIsOpen: (isOpen: boolean) => void;
}

export const InviteTalent4Desktop = ({ isOpen, setIsOpen, talentId }: Props): JSX.Element | null => {
	return (
		<DesktopSheetWrapper
			isOpen={isOpen}
			onOpenChange={() => {
				setIsOpen(false);
			}}
		>
			<InviteTalent talentId={talentId} setIsOpen={setIsOpen} />
		</DesktopSheetWrapper>
	);
};
