"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { CoinProps } from "@/lib/types/collection";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import Link from "next/link";

interface BountyAmountProps {
	price: number;
	realTimeRate: number;
	meta: {
		coin: CoinProps;
		usdInitialValue: number;
	};
	isFunded: boolean;
	paymentRate: string;
}

const JobAmount = ({ price, realTimeRate, paymentRate, meta, isFunded }: BountyAmountProps): JSX.Element => (
	<div className="flex w-fit items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
		<JobAmountBadge
			coin={meta?.coin}
			paymentFee={price}
			realTimeRate={realTimeRate}
			className="bg-transparent !p-0 text-sm"
			isFunded={isFunded}
			usdInitialValue={meta?.usdInitialValue}
			paymentRate={paymentRate}
		/>
	</div>
);

const JobDueDate = ({ dueDate }: { dueDate: string }): JSX.Element => {
	const dueDateError = new Date(dueDate).toString() === "Invalid Date";
	const dueDateValue = dueDateError ? new Date() : new Date(dueDate);

	return (
		<div className="flex w-fit items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-base text-blue-darkest">
			<div className="flex h-7 w-fit items-center gap-2 rounded-full bg-[#C9F0FF] text-base text-blue-darkest">
				<Calendar size={20} />
				<span className="whitespace-pre text-base">{format(dueDateValue, "MMM dd, yyyy")}</span>
			</div>
		</div>
	);
};

interface JobHeaderProps {
	title: string;
	price: number;
	dueDate: string;
	creator?: {
		_id: string;
		name: string;
		score: number;
		avatar?: string;
		title: string;
	};
	meta: {
		coin: CoinProps;
		usdInitialValue: number;
	};
	realTimeRate: number;
	isFunded: boolean;
	paymentRate: string;
}

export const JobHeader = ({
	title,
	price,
	dueDate,
	creator,
	meta,
	realTimeRate,
	isFunded,
	paymentRate,
}: JobHeaderProps): JSX.Element => {
	const token = getCookie(AUTH_TOKEN_KEY);

	// Handle due date error
	const dueDateError = new Date(dueDate).toString() === "Invalid Date";
	const dueDateValue = dueDateError ? new Date() : new Date(dueDate);
	return (
		<div className="flex w-full flex-col items-start gap-2.5 bg-primary-gradient-light px-4 py-[18px]">
			<h2 className="text-lg font-bold leading-[27px] tracking-wide text-neutral-50">{title}</h2>

			<div className="flex w-full items-center gap-4">
				<JobAmount
					price={price}
					realTimeRate={realTimeRate}
					isFunded={isFunded}
					meta={meta}
					paymentRate={paymentRate}
				/>
				<JobDueDate dueDate={dueDateValue.toString()} />
			</div>

			{creator?._id && (
				<Link
					className="flex items-center gap-1"
					href={token ? `/talents/${creator?._id}` : `/view-talent/${creator?._id}`}
				>
					<div
						style={{
							backgroundImage: `url(${creator?.avatar})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							width: "31px", // Adjust the size as needed
							height: "31px", // Adjust the size as needed
							borderRadius: "50%",
						}}
					/>
					<span className="text-base font-bold leading-normal tracking-wide text-white">{creator?.name}</span>
				</Link>
			)}
		</div>
	);
};
