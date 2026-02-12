"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo, useRef, useState } from "react";
import { UseInfiniteQueryResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CollectionProps } from "@/lib/types/collection";
import { SortApplicationsBy } from "@/lib/enums";
import { ApiError } from "@/lib/axios";
import { GetJobsResponse } from "@/lib/api/job";
import { ApplicantHeader } from "./misc/header";
import { ApplicantFilter, Option } from "./misc/filter";
import { Applied } from "./tabs/applied";
import { useFlattenedData } from "@/hooks/use-flattened-data";
import { provideInvitedApplication, removeInvitedFromApplicants } from "@/lib/actions/collection";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { sortApplicantsHandler } from "@/lib/actions/collection";
import { PageError } from "@/components/common/page-error";

interface Props {
	job: CollectionProps;
	jobApplications: UseInfiniteQueryResult<GetJobsResponse, ApiError>;
	jobAcceptedInvites: UseInfiniteQueryResult<GetJobsResponse, ApiError>;
	realTimeRate: number;
}

export const DesktopApplicantView = ({ job, jobApplications, realTimeRate }: Props): JSX.Element => {
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

	if (isError && !tooManyReq) return <PageError className="h-[60vh] rounded-2xl" />;

	return (
		<div className="flex h-full flex-col gap-6 xl:px-4 2xl:px-8">
			<ApplicantHeader job={job} realTimeRate={realTimeRate} />

			<div className="flex w-full grow gap-6 overflow-hidden">
				<ApplicantFilter
					bidSort={bidSort}
					setBidSort={setBidSort}
					setSortBy={setSortBy}
					scoreSort={scoreSort}
					setScoreSort={setScoreSort}
					skillFilters={skillFilters}
					setSkillFilters={setSkillFilters}
					job={job}
				/>
				<div className="relative -left-2 -top-2 flex flex-1 basis-0 overflow-y-auto">
					<Applied
						job={job}
						jobApplications={applicants}
						skillFilters={skillFilters}
						ref={observerTarget}
						isFetchingNextPage={isFetchingNextPage}
						tooManyReq={tooManyReq}
					/>
				</div>
			</div>
		</div>
	);
};
