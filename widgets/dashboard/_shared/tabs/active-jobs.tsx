"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";
import { Loader } from "lucide-react";
import { forwardRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";

interface ActiveBountiesProps {
	activeJobList: JSX.Element[];
	tooManyReq: boolean;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	isError: boolean;
}

export const ActiveJobs = forwardRef<HTMLDivElement, ActiveBountiesProps>(
	({ activeJobList, tooManyReq, isFetchingNextPage, isLoading, isError }, ref): JSX.Element => {
		const tab = useMediaQuery("(min-width: 650px)");

		if (isError) return <PageError className="h-[85vh] rounded-2xl" />;

		if (isLoading) return <PageLoading className="bg-transparent sm:h-[65vh]" color="#3055B3" />;

		if (isError) return <PageError className="h-[50vh] bg-transparent sm:h-[65vh]" />;

		if (activeJobList?.length === 0)
			return (
				<PageEmpty className="h-[50vh] bg-transparent sm:h-[65vh]" label="Your active jobs will appear here." />
			);

		return tab ? (
			<div className="flex h-full min-h-[60vh] w-full flex-col">
				<div className="flex w-full flex-col bg-transparent max-sm:p-4 sm:gap-5 sm:px-4 sm:pt-1">
					{activeJobList}
				</div>

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
				<div ref={ref} className="!h-4 !w-full" />
			</div>
		) : (
			<div className="h-[70vh] w-full overflow-y-auto overflow-x-hidden pb-20">{activeJobList}</div>
		);
	}
);

ActiveJobs.displayName = "ActiveJobs";
