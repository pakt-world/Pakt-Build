/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { type CollectionProps } from "@/lib/types/collection";

import { ApplicantCard } from "../misc/card";

interface InvitedApplicantProps {
	invitedApplicants: CollectionProps[];
	job: CollectionProps;
}

export const Invited4Mobile = ({ invitedApplicants, job }: InvitedApplicantProps): JSX.Element => {
	return (
		<div className="flex h-full grow flex-col gap-4 overflow-y-auto">
			{invitedApplicants?.length > 0 ? (
				<div className="flex flex-col gap-4 overflow-y-auto">
					{invitedApplicants?.map((applicant) => {
						return (
							<ApplicantCard
								key={applicant?.creator?._id}
								talent={applicant?.creator}
								message={applicant?.description}
								bid={applicant?.paymentFee}
								disableAcceptButton
								job={job}
								// applicationId={applicant._id}
								// invited={job.invite?.receiver._id === applicant.creator._id}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty className="!h-full" label="No Invited Applicants" />
			)}
		</div>
	);
};
