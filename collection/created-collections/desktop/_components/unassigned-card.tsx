"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { CollectionProps } from "@/lib/types/collection";
import { isJobApplicant } from "@/lib/actions/collection";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { Button } from "@/components/common/button";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

interface UnAssignedJobCardProps {
	job: CollectionProps;
	rates: ExchangeRateRecord | undefined;
}

export const UnAssignedJobCard: FC<UnAssignedJobCardProps> = ({ job, rates }) => {
	const router = useRouter();

	const { createdAt, _id, collections, tagsData, name, paymentFee, invite, isPrivate } = job;

	const id = _id;
	const title = name;
	const skills = tagsData.join(", ");
	const applicants = collections.filter(isJobApplicant);
	const hasInvite = invite !== undefined && invite !== null;
	const creationDate = format(new Date(createdAt), "dd MMM yyyy");

	const realTimeRate = rates?.[job.meta?.coin?.reference ?? ""] ?? 0;
	return (
		<div
			className="flex w-full grow cursor-pointer flex-col gap-4 rounded-3xl border border-line bg-white p-4 transition duration-200
				hover:scale-[1.01] active:scale-[0.99]"
		>
			<div className="flex w-full gap-4">
				<div className="flex grow flex-col gap-4">
					<div className="flex items-center justify-between gap-2">
						<span className="text-lg text-body">Created: {creationDate}</span>
						<JobAmountBadge
							coin={job?.meta?.coin}
							paymentFee={paymentFee}
							realTimeRate={realTimeRate}
							isFunded={job?.escrowPaid ?? false}
							usdInitialValue={job?.meta?.usdInitialValue}
							paymentRate={job?.rate}
						/>
					</div>
					<div className="line-clamp-2 grow break-words text-2xl text-title">{title}</div>
					<div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
						{job?.tags.slice(0, 3).map((skill) => (
							<span
								key={skill?.name}
								className="min-w-[50px] whitespace-nowrap rounded-full bg-slate-100 px-4 py-0.5 text-sm capitalize text-title last:!max-w-[106px]
									last:!truncate 2xl:last:!max-w-[166px]"
								style={{ background: skill?.color }}
							>
								{skill?.name}
							</span>
						))}
					</div>
				</div>
			</div>
			<div className="mt-auto flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					{!hasInvite && isPrivate && (
						<Button
							size="md"
							variant="secondaryOutline"
							onClick={() => {
								router.push(`/talents${skills ? `?skills=${skills}` : ""}`);
							}}
						>
							Find Talent
						</Button>
					)}

					{/* {!hasInvite && !isPrivate && ( */}
					{!isPrivate && applicants.length > 0 && (
						<Button
							size="md"
							variant="secondaryOutline"
							onClick={() => {
								router.push(`/jobs/${id}/applicants`);
							}}
						>
							View Applicants
						</Button>
					)}

					<Button
						size="md"
						variant="outlinePrimary"
						onClick={() => {
							router.push(`/jobs/${id}`);
						}}
					>
						Job Details
					</Button>
				</div>

				{!isPrivate && !hasInvite && (
					<div className="inline-flex w-fit flex-row-reverse items-center">
						{applicants.length > 5 && (
							<div
								className="-ml-3 flex h-[36.18px] w-[36.18px] items-center justify-center overflow-hidden rounded-full border-2 border-white
									bg-[#D9D9D9] text-sm last:ml-0"
							>
								<span className="-ml-1.5">+{applicants.length - 5}</span>
							</div>
						)}

						{applicants.slice(0, 5).map((applicant, index) => {
							return (
								<div
									key={index}
									className="-ml-3 h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-white bg-green-100 last:ml-0"
								>
									{/* {applicant.creator.profileImage && (
											<Image
												src={applicant.creator.profileImage?.url ?? ""}
												alt=""
												width={30}
												height={30}
											/>
										)} */}
									{applicant?.creator?.profileImage && (
										<div
											style={{
												backgroundImage: `url(${applicant?.creator?.profileImage?.url})`,
												backgroundSize: "cover",
												backgroundPosition: "center",

												height: "40px",
												width: "40px",
											}}
										/>
									)}
								</div>
							);
						})}
					</div>
				)}

				{hasInvite && (
					<div
						className="inline-flex items-center gap-1 rounded-full border border-[#48A7F8] bg-blue-lightest px-1 py-0.5 pr-3 text-sm
							text-blue-darkest"
					>
						{invite?.receiver?.profileImage && (
							<div
								style={{
									backgroundImage: `url(${invite?.receiver?.profileImage?.url})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									border: "2px solid white",
									height: "40px",
									width: "40px",
									borderRadius: "50%",
								}}
							/>
						)}

						<span>Awaiting Talent Response</span>
					</div>
				)}
			</div>
		</div>
	);
};
