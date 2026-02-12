"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import { OpenJobCard4Mobile } from "../_components/open-card";
import { CollectionProps } from "@/lib/types/collection";
import { ExchangeRateRecord } from "@/lib/api/wallet";

interface AllJobsProps {
	jobs: CollectionProps[];
	onRefresh?: () => void;
	loading?: boolean;
	rates: ExchangeRateRecord | undefined;
	loggedInUser: string;
	isFetchingNextPage: boolean;
	tooManyReq: boolean;
}

export const AllJobs4Mobile = (props: AllJobsProps): JSX.Element => {
	const { jobs, onRefresh, loading, rates, loggedInUser, isFetchingNextPage, tooManyReq } = props;

	if (loading) return <PageLoading className="h-[calc(100vh-200px)]" color="#3055B3" />;
	if (!jobs.length) return <PageEmpty label="No open job yet." className="h-[calc(100vh-200px)]" />;

	return (
		<div
			className={`scrollbar-hide relative mt-[64px] flex w-full flex-1 flex-col overflow-y-auto ${jobs.length > 3 && "mb-[64px]"}`}
		>
			{jobs.map((job: CollectionProps) => {
				return (
					<OpenJobCard4Mobile
						key={job?._id}
						job={job}
						onRefresh={onRefresh}
						bookmarkId={job?._id}
						isBookmarked={job?.isBookmarked}
						rates={rates}
						loggedInUser={loggedInUser}
					/>
				);
			})}
			{tooManyReq ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white shadow-md">
						Too Many Requests. Please try again later.
					</span>
				</div>
			) : isFetchingNextPage ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<Loader size={25} className="animate-spin text-center text-body" />
				</div>
			) : null}
		</div>
	);
};
