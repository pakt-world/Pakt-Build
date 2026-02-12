"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PaymentDetails } from "../_shared/details";
import { CollectionProps } from "@/lib/types/collection";
import { PaymentMethodTab } from "../_shared/tab";
import { PaymentMethodType } from "@/lib/enums";
import { ConfigContextType } from "@pakt/payment-module/dist/types/types";

interface Props {
	jobId: string;
	talentId: string;
	paymentToken: string;
	paymentCoin: string | undefined;
	contractAddress: string;
	tokenDecimal: number;
	job: CollectionProps;
	mutation: any;
	isLoading: boolean;
	isFetched: boolean;
	isError: boolean;
	paymentMethods: { label: string; value: PaymentMethodType }[];
	config: ConfigContextType;
}

const MakeDeposit4Desktop = ({
	jobId,
	paymentToken,
	paymentCoin,
	contractAddress,
	tokenDecimal,
	job,
	mutation,
	isLoading,
	isFetched,
	isError,
	talentId,
	paymentMethods,
	config,
}: Props) => {
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodType.CRYPTO);

	return (
		<div className="flex h-full flex-col gap-6 overflow-y-auto px-4 max-sm:w-full 2xl:px-8">
			<div className="block">
				<Link className="flex items-center gap-1 text-title" href={`/jobs/${jobId}`}>
					<ChevronLeft size={24} strokeWidth={2} className="cursor-pointer" />
					<span className="text-2xl font-medium">Make Deposit</span>
				</Link>
			</div>
			<div className="flex h-full pb-4">
				<div
					className="flex h-fit w-full max-w-full transform flex-col gap-6 bg-white sm:max-w-3xl sm:origin-top-left sm:scale-90
						sm:rounded-3xl sm:border sm:border-line sm:p-6 sm:shadow"
				>
					<div className="flex flex-col gap-2">
						<h2 className="text-2xl font-bold">Escrow Payment</h2>
						<p className="text-lg text-body">
							Before an invitation is sent to a talent, a client is required to deposit payment into a
							secure non-custodial escrow wallet. The payment safely lives on the blockchain and cannot be
							accessed by pakt.build, nor Pakt, nor any third party.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-bold">Choose a Payment Method</h2>
						{/* Check boxes */}
						<PaymentMethodTab
							paymentMethods={paymentMethods}
							paymentMethod={paymentMethod}
							setPaymentMethod={setPaymentMethod}
						/>
					</div>

					{paymentCoin && (
						<PaymentDetails
							jobId={jobId}
							coin={paymentCoin}
							coinImage={paymentToken}
							paymentDetails={mutation.data}
							isLoading={mutation.isLoading || (!isFetched && isLoading)}
							isError={mutation.isError || isError}
							errMsg={mutation.error?.message}
							contractAddress={contractAddress}
							tokenDecimal={tokenDecimal}
							job={job}
							paymentMethod={paymentMethod}
							talentId={talentId}
							config={config}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default MakeDeposit4Desktop;
