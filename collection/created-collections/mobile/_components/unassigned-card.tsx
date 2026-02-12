"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CollectionProps } from "@/lib/types/collection";
import { isJobApplicant } from "@/lib/actions/collection";
import { ExchangeRateRecord } from "@/lib/api/wallet";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";

interface UnAssignedJobCardProps {
	job: CollectionProps;
	rates: ExchangeRateRecord | undefined;
}

export const UnAssignedJobCard4Mobile: FC<UnAssignedJobCardProps> = ({ job, rates }) => {
	const { createdAt, collections, name, paymentFee, invite, isPrivate, meta } = job;
	const title = name;
	const applicants = collections.filter(isJobApplicant);
	const hasInvite = invite !== undefined && invite !== null;
	const creationDate = format(new Date(createdAt), "dd/M/yyyy");
	const realTimeRate = rates?.[meta?.coin?.reference ?? ""] ?? 0;

	return (
		<Link href={`/jobs/${job?._id}`} className="flex w-full grow flex-col gap-4 border border-line bg-white p-4">
			<div className="flex w-full gap-4">
				<div className="flex grow flex-col gap-4">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<span className="whitespace-nowrap text-sm leading-[21px] tracking-wide text-zinc-900">
								Created: {creationDate}
							</span>
						</div>

						<JobAmountBadge
							paymentFee={paymentFee}
							coin={meta?.coin}
							realTimeRate={realTimeRate}
							isFunded={job?.escrowPaid ?? false}
							usdInitialValue={job?.meta?.usdInitialValue}
							className="w-max text-xs"
							paymentRate={job?.rate}
						/>
					</div>
					<div className="grow text-lg leading-[27px] tracking-wide text-gray-800">{title}</div>
					<div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
						{job.tags.slice(0, 3).map((skill) => (
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

			{!isPrivate && !hasInvite && (
				<div className="inline-flex w-fit flex-row-reverse items-center">
					{applicants.length > 5 && (
						<div
							className="-ml-3 flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#D9D9D9]
								text-sm last:ml-0"
						>
							<span className="-ml-1.5">+{applicants.length - 5}</span>
						</div>
					)}

					{applicants.slice(0, 5).map((applicant, index) => {
						return (
							<div
								key={index}
								className="-ml-3 h-[30px] w-[30px] overflow-hidden rounded-full border-2 border-white bg-green-100 last:ml-0"
							>
								{applicant?.creator?.profileImage && (
									<Image
										src={applicant?.creator?.profileImage?.url ?? ""}
										alt=""
										width={30}
										height={30}
									/>
								)}
							</div>
						);
					})}
				</div>
			)}

			{hasInvite && (
				<div
					className="inline-flex w-max items-center gap-1 rounded-full border border-[#48A7F8] bg-blue-lightest px-1 py-0.5 pr-3 text-sm
						text-blue-darkest"
				>
					<div className="h-[27px] w-[27px] overflow-hidden rounded-full border border-white bg-white">
						{invite?.receiver?.profileImage && (
							<Image src={invite?.receiver?.profileImage?.url ?? ""} alt="" width={30} height={30} />
						)}
					</div>
					<span>Awaiting Talent Response</span>
				</div>
			)}
		</Link>
	);
};
