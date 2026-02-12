"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { formatNumber } from "@/lib/utils";
import { type CollectionProps } from "@/lib/types/collection";

interface ApplicantHeaderProps {
	job: CollectionProps;
	realTimeRate: number;
}

export const ApplicantHeader = ({ job, realTimeRate }: ApplicantHeaderProps): JSX.Element => {
	const isFunded = job?.escrowPaid;
	const paymentFee = job?.paymentFee;
	const usdInitialValue = job?.meta?.usdInitialValue;
	const tokenAmount = useMemo(
		() => formatNumber(isFunded ? paymentFee : usdInitialValue ? usdInitialValue / realTimeRate : paymentFee),
		[isFunded, paymentFee, realTimeRate, usdInitialValue]
	);
	const dollarAmount = useMemo(
		() =>
			isFunded
				? formatNumber(realTimeRate * Number(paymentFee))
				: usdInitialValue
					? formatNumber(usdInitialValue)
					: formatNumber(realTimeRate * Number(paymentFee)),
		[isFunded, paymentFee, realTimeRate, usdInitialValue]
	);
	return (
		<div className="flex justify-between gap-4 bg-primary-gradient-light p-4 sm:rounded-xl sm:p-6">
			<div className="flex max-w-3xl grow flex-col gap-3">
				<h2 className="max-w-[750px] text-3xl font-bold text-white">{job?.name}</h2>
				<p className="max-w-[750px] text-white">{job?.description}</p>
				<div className="mt-6 flex items-center gap-4">
					<span className="flex items-center gap-2 rounded-full bg-blue-lightest px-3 py-1 text-blue-darkest">
						<Calendar size={20} />
						<span>Due: {format(new Date(job?.deliveryDate ?? ""), "MMM dd, yyyy")}</span>
					</span>
					<div className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
						<Tag size={20} />
						<span>{tokenAmount}</span>
						<div className="flex items-center justify-center gap-1">
							<Image
								className="h-[18px] w-[17.94px] rounded-full"
								src={job?.meta?.coin?.icon}
								alt={job?.meta?.coin?.name}
								width={18}
								height={18}
							/>
							<div className="text-base leading-normal tracking-tight text-[#198155]">
								{job?.meta?.coin?.symbol.toUpperCase()}
							</div>
						</div>
						<div className="text-lg font-bold leading-[27px] tracking-wide text-[#198155]">
							($
							{dollarAmount})
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
