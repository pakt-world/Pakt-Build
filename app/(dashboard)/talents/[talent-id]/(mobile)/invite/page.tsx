"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageError } from "@/components/common/page-error";
import { useGetJobs } from "@/lib/api/job";
import { CollectionCategory } from "@/lib/enums";
import { JobList } from "@/widgets/talents/view-profile/_shared/header/mobile/invite/_components/job-list";
import { useExchangeRateStore } from "@/lib/store/misc";
import { sortArrayLatestFirstByDate } from "@/lib/utils";
import { PageEmpty } from "@/components/common/page-empty";
import { provideUnassignedJobs } from "@/lib/actions/collection";
import { BrandLoader } from "@/components/common/brand-loader";

interface Props {
	params: {
		"talent-id": string;
	};
}

export default function InviteMemberToJobPage({ params }: Props): JSX.Element {
	const talentId = params["talent-id"];

	const router = useRouter();

	const tab = useMediaQuery("(min-width: 640px)");

	const { data: rates } = useExchangeRateStore();
	const jobsData = useGetJobs({
		category: CollectionCategory.CREATED,
		limit: 50,
	});

	useEffect(() => {
		if (tab && talentId) {
			// Redirect to the desktop version of the page
			router.push(`/talents/${talentId}`);
		}
	}, [router, tab, talentId]);

	if (jobsData.isError) return <PageError />;

	if (jobsData.isLoading) return <BrandLoader />;

	const jobs = jobsData.data.data;
	const sortedJobs = provideUnassignedJobs(jobs);
	const unassignedJobs = sortArrayLatestFirstByDate(sortedJobs);

	if (unassignedJobs.length === 0)
		return (
			<div className="flex h-full flex-col sm:gap-2">
				<div className="border-y border-green-lighter bg-white p-4 text-title">
					<button
						className="flex items-center gap-2"
						onClick={() => {
							router.back();
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

	return <JobList jobs={unassignedJobs} talentId={talentId} rates={rates} />;
}
