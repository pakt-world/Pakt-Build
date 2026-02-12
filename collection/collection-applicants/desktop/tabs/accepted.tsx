/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { type CollectionProps } from "@/lib/types/collection";

import { ApplicantCard } from "../misc/card";

interface AcceptedApplicantProps {
	jobAcceptedInvites: CollectionProps[];
	job: CollectionProps;
}

export const Accepted = ({ job, jobAcceptedInvites }: AcceptedApplicantProps): JSX.Element => {
	return (
		<div className="flex h-full grow flex-col gap-4 overflow-y-auto">
			{jobAcceptedInvites?.length > 0 ? (
				<div className="flex flex-col gap-4 overflow-y-auto">
					{jobAcceptedInvites?.map((applicant) => {
						return (
							<ApplicantCard
								key={applicant?.creator?._id}
								talent={applicant?.creator}
								message={applicant?.description}
								bid={applicant?.paymentFee}
								job={job}
								inviteReceiverId={job?.invite?.receiver._id}
								// applicationId={applicant._id}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty className="h-[60vh] rounded-2xl" label="No accepted applicants yet" />
			)}
		</div>
	);
};
