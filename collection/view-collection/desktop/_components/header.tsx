"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { CoinProps } from "@/lib/types/collection";
import { getCookie } from "cookies-next";
import { AUTH_TOKEN_KEY } from "@/lib/utils";

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
}: JobHeaderProps): ReactElement => {
	const token = getCookie(AUTH_TOKEN_KEY);

	// Handle due date error
	const dueDateError = new Date(dueDate).toString() === "Invalid Date";
	const dueDateValue = dueDateError ? new Date() : new Date(dueDate);

	return (
		<div className="flex items-center justify-between gap-4 rounded-t-xl bg-primary-gradient-light p-4">
			<div className="flex h-full w-full max-w-2xl flex-col gap-6">
				<div className="grow pt-3">
					<h2 className="text-3xl font-medium text-white">{title}</h2>
				</div>
				<div className="mt-auto flex h-fit items-center gap-4">
					<span className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
						<Tag size={20} />
						<JobAmountBadge
							coin={meta?.coin}
							paymentFee={price}
							realTimeRate={realTimeRate}
							className="bg-transparent !p-0"
							isFunded={isFunded}
							usdInitialValue={meta?.usdInitialValue}
							paymentRate={paymentRate}
						/>
					</span>

					<span className="flex h-full items-center gap-2 rounded-full bg-blue-lightest px-3 py-1 text-blue-darkest">
						<Calendar size={20} />
						<span>Due {format(dueDateValue, "MMM dd, yyyy")}</span>
					</span>
				</div>
			</div>
			{creator?._id && (
				<div className="flex flex-col items-center gap-0 text-center">
					<TalentProfile
						src={creator?.avatar}
						size="md"
						score={creator?.score}
						url={token ? `/talents/${creator?._id}` : `/view-talent/${creator?._id}`}
					/>
					<div className="flex flex-col items-start gap-0">
						<span className="w-[170px] truncate whitespace-nowrap text-xl font-bold text-white">
							{creator?.name}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};
