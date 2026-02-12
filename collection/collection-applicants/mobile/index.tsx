"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import { UseInfiniteQueryResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageError } from "@/components/common/page-error";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { MobileApplicantFilter } from "./misc/filter";
import { CollectionProps } from "@/lib/types/collection";
import { GetJobsResponse } from "@/lib/api/job";
import { ApiError } from "@/lib/axios";
import { SortApplicationsBy } from "@/lib/enums";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { sortApplicantsHandler } from "@/lib/actions/collection";
import { useFlattenedData } from "@/hooks/use-flattened-data";
import { provideInvitedApplication, removeInvitedFromApplicants } from "@/lib/actions/collection";
import { CollectionApplicantsDetails } from "./misc/collection-details";
import { Applied4Mobile } from "./tabs/applied";
import { Option } from "@/components/common/dynamic-mobile-filter";

interface Props {
	job: CollectionProps;
	jobApplications: UseInfiniteQueryResult<GetJobsResponse, ApiError>;
	jobAcceptedInvites: UseInfiniteQueryResult<GetJobsResponse, ApiError>;
	realTimeRate: number;
}

export const CollectionApplicantView4Mobile = ({ job, jobApplications, realTimeRate }: Props): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [scoreSort, setScoreSort] = useState<Option>({ label: "", value: "" });
	const [sortBy, setSortBy] = useState<SortApplicationsBy>(SortApplicationsBy.SCORE);
	const [bidSort, setBidSort] = useState<Option>({ label: "", value: "" });
	// ==== //
	const [skillFilters, setSkillFilters] = useState<string[]>([]);
	const [displayedApplicants, setDisplayedApplicants] = useState<CollectionProps[]>([]);
	const totalApplicantsRef = useRef<CollectionProps[]>([]);

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;
	const {
		data: applications,
		refetch: refetchApplications,
		failureReason,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = jobApplications;

	const applicationData = useMemo(
		() => ({
			...applications,
			pages: applications?.pages?.map((page) => page.data) ?? [],
		}),
		[applications]
	);
	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: applicationData,
		refetch: refetchApplications,
		error: error?.response?.data.message ?? "",
	});

	const tooManyReq =
		failureReason?.response?.data.message === "Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	// Invites
	useEffect(() => {
		const filteredApplicants = currentData
			.filter((applicant) => {
				if (skillFilters.length === 0) return true;
				return applicant.creator.profile.talent.tags
					.map((skill) => skill.toLowerCase())
					.some((skill) => skillFilters.includes(skill.toLowerCase()));
			})
			.sort((a, b) => {
				const bidSortResult = sortApplicantsHandler(a, b, (value) => value.paymentFee, bidSort);
				const scoreSortResult = sortApplicantsHandler(a, b, (value) => value.creator.score, scoreSort);

				if (sortBy === SortApplicationsBy.BID) return bidSortResult;
				if (sortBy === SortApplicationsBy.SCORE) return scoreSortResult;
				return 0;
			});
		totalApplicantsRef.current = filteredApplicants;
		setDisplayedApplicants(filteredApplicants);
	}, [currentData, scoreSort, bidSort, skillFilters, sortBy]);

	const { flattenedData } = useFlattenedData<CollectionProps>(jobApplications);

	// Invited applicants
	const invitedApplicants = provideInvitedApplication(flattenedData, job);
	// const invitedCount = invitedApplicants.length;

	// Applied applicants
	// Remove invited applicants from the list
	const applicants = removeInvitedFromApplicants(displayedApplicants, invitedApplicants);
	// const appliedCount = applicants.length;

	if (isError && !tooManyReq) return <PageError className="!h-full" />;

	const topOffset = ref.current?.offsetHeight ? `${ref.current.offsetHeight + 113}px` : "0px";

	return (
		<div className="flex flex-col">
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: `/jobs/${job?._id}`,
					},
					{ label: "Job Applicants", active: true },
				]}
				className="!fixed top-[70px] !bg-[#0E1319]"
			/>
			<CollectionApplicantsDetails
				ref={ref}
				meta={job?.meta}
				realTimeRate={realTimeRate}
				name={job?.name}
				dueDate={job?.deliveryDate ?? ""}
				price={job?.paymentFee ?? 0}
				isFunded={job?.escrowPaid ?? false}
				paymentRate={job?.rate ?? 0}
			/>
			<div
				className={`fixed !z-10 inline-flex h-[76px] w-full items-center justify-between border-b border-green-300 bg-white px-[21px] py-4
					will-change-[top]`}
				style={{ top: topOffset }}
			>
				<div className="inline-flex flex-col items-start justify-center gap-0.5">
					<div className="text-base font-bold leading-normal tracking-wide text-neutral-800">
						All Applicants
					</div>
					<span className="text-xs leading-[18px] tracking-wide text-neutral-500">
						Click on an applicant to view Profile
					</span>
				</div>
				<MobileApplicantFilter
					scoreSort={scoreSort}
					setScoreSort={setScoreSort}
					setSortBy={setSortBy}
					bidSort={bidSort}
					setBidSort={setBidSort}
					skillFilters={skillFilters}
					setSkillFilters={setSkillFilters}
					job={job}
				/>
			</div>
			<Applied4Mobile
				job={job}
				jobApplications={applicants}
				skillFilters={skillFilters}
				ref={observerTarget}
				isFetchingNextPage={isFetchingNextPage}
				tooManyReq={tooManyReq}
			/>
		</div>
	);
};
