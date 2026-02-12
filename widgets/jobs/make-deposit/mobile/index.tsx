"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { memo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PaymentDetails } from "../_shared/details";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
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

const MakeDeposit4Mobile = ({
	jobId,
	talentId,
	paymentToken,
	paymentCoin,
	contractAddress,
	tokenDecimal,
	job,
	mutation,
	isLoading,
	isFetched,
	isError,
	paymentMethods,
	config,
}: Props) => {
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodType.CRYPTO);

	return (
		<div className="w-full pb-[68px]">
			<MobileBreadcrumb
				items={[
					{
						label: "Talent",
						link: `/talents/${talentId}`,
					},
					{
						label: "Make Deposit",
						active: true,
					},
				]}
				className="fixed top-[70px] !bg-[#0E1319]"
			/>

			<div className="mb-6 flex flex-col gap-2 px-4 pt-4">
				<h2 className="text-2xl font-bold">Escrow Payment</h2>
				<p className="text-sm text-body">
					Before an invitation is sent to a talent, a client is required to deposit payment into a secure
					non-custodial escrow wallet. The payment safely lives on the blockchain and cannot be accessed by
					pakt.build, nor Pakt, nor any third party.
				</p>
			</div>

			<div className="mb-6 flex flex-col gap-2 px-4">
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
	);
};

export default memo(MakeDeposit4Mobile);
