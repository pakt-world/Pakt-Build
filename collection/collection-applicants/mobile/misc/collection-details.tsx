"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { forwardRef } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { CoinProps } from "@/lib/types/collection";

interface Props {
	meta: {
		coin: CoinProps;
		usdInitialValue: number;
	};
	price: number;
	realTimeRate: number;
	dueDate: string;
	name: string;
	isFunded: boolean;
	paymentRate: string;
}

export const CollectionApplicantsDetails = forwardRef<HTMLDivElement, Props>(
	({ meta, price, realTimeRate, dueDate, name, isFunded, paymentRate }: Props, ref) => {
		return (
			<div
				ref={ref}
				className="fixed top-[113px] !z-10 flex min-h-[150px] w-full justify-between gap-4 bg-primary-gradient-light p-4 py-6"
			>
				<div className="flex max-w-3xl grow flex-col gap-3">
					<h2 className="h-full items-center text-lg font-bold leading-[27px] tracking-wide text-neutral-50">
						{name}
					</h2>
					<div className="mt-auto flex items-center gap-4">
						<span className="flex w-fit items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
							<JobAmountBadge
								coin={meta?.coin}
								paymentFee={price}
								realTimeRate={realTimeRate}
								className="bg-transparent !p-0 text-sm"
								isFunded={isFunded}
								usdInitialValue={meta?.usdInitialValue}
								paymentRate={paymentRate}
							/>
						</span>

						<span className="flex h-full w-fit items-center gap-2 rounded-full bg-blue-lightest px-3 py-1 text-blue-darkest">
							<Calendar size={20} />
							<span className="whitespace-pre text-sm">{format(dueDate, "MMM dd, yyyy")}</span>
						</span>
					</div>
				</div>
			</div>
		);
	}
);

CollectionApplicantsDetails.displayName = "CollectionApplicantsDetails";
