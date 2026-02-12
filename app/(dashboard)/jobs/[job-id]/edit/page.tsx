"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useIsClient, useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { EditJobForm } from "@/collection/edit-collection";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import ScrollToTopOnRouteChange from "@/components/common/scroll-to-top-on-route-change";

interface Props {
	params: {
		"job-id": string;
	};
}

export default function EditJobPage({ params }: Props): React.JSX.Element {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const isClient = useIsClient();

	const router = useRouter();
	const jobId = params["job-id"];
	const jobQuery = useGetJobById({ jobId });
	const { data: job, isError, isLoading } = jobQuery;

	if (isError) return <PageError className="absolute inset-0" />;
	if (!isClient || isLoading) return <PageLoading className="absolute inset-0" color="#3055B3" />;

	if (isMobile) {
		return (
			<ScrollToTopOnRouteChange>
				<div className="relative flex w-full flex-col overflow-y-auto pb-[64px]">
					<MobileBreadcrumb
						items={[
							{
								label: job?.name,
								link: `/jobs/${job?._id}`,
							},
							{
								label: "Edit Job",
								active: true,
								action: () => {
									router.push(`/jobs/${job?._id}/edit`);
								},
							},
						]}
						className="!fixed top-[70px] !bg-[#0E1319]"
					/>
					<EditJobForm job={job} />
				</div>
			</ScrollToTopOnRouteChange>
		);
	}

	return <EditJobForm job={job} />;
}
