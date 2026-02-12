"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { CryptoPaymentModal, FiatPaymentModal } from "@pakt/payment-module";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useConfirmJobPayment, useInviteTalentToJob, type PostJobPaymentDetailsResponse } from "@/lib/api/job";
import { cn } from "@/lib/utils";
import { PageLoading } from "@/components/common/page-loading";
import { MobileSheetWrapper } from "@/components/common/mobile-sheet-wrapper";
import { CollectionProps } from "@/lib/types/collection";
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { PaymentMethodType } from "@/lib/enums";
import { ConfigContextType } from "@pakt/payment-module/dist/types/types";

interface PaymentDetailsProps {
	jobId: string;
	job: CollectionProps;
	coin: string;
	coinImage: string;
	paymentDetails?: PostJobPaymentDetailsResponse;
	isLoading: boolean;
	isError: boolean;
	errMsg?: string;
	contractAddress?: string;
	tokenDecimal: number;
	paymentMethod: PaymentMethodType;
	talentId: string;
	config: ConfigContextType;
}

export const PaymentDetails = ({
	coin,
	coinImage,
	jobId,
	isLoading,
	isError,
	errMsg,
	paymentDetails,
	job,
	contractAddress,
	tokenDecimal,
	paymentMethod,
	talentId,
	config,
}: PaymentDetailsProps): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const router = useRouter();
	const confirmPayment = useConfirmJobPayment();
	const inviteTalent = useInviteTalentToJob({ talentId, job });

	const confirmValuePayment = (): void => {
		confirmPayment.mutate(
			{ jobId, type: paymentMethod, delay: 6000 },
			{
				onSuccess: () => {
					if (talentId !== "") {
						inviteTalent.mutate(
							{
								jobId,
								talentId,
							},
							{
								onSuccess: () => {
									// closeModel();
									router.push(`/dashboard`);
								},
							}
						);
					}
				},
				onError: () => {
					// setShowReconfirmButton(true);
					// setDisableButtonOnClick(false);
				},
			}
		);
	};

	const onSuccessResponse = () => {
		return confirmValuePayment();
	};
	const isConfirmPaymentLoading = confirmPayment.isLoading || inviteTalent.isLoading;

	if (isLoading)
		return (
			<div className="flex max-h-[400px] w-full items-center justify-center border border-line bg-slate-50 sm:rounded-xl sm:shadow">
				<PageLoading color="#3055B3" />
			</div>
		);

	if (isError || paymentDetails == null || job == null)
		return (
			<div className="flex max-h-[400px] w-full items-center justify-center rounded-xl border border-red-100 bg-red-50">
				<div className="flex flex-col items-center gap-2 text-red-500">
					<AlertCircle size={45} strokeWidth={2} />
					<span>{errMsg ?? "Something went wrong. Please try again later."}</span>
				</div>
			</div>
		);

	const depositAddress = paymentDetails.address;

	return (
		<div className="flex w-full flex-col sm:gap-6">
			<div
				className={cn(
					`flex flex-col gap-4 border-[#4CD471] bg-[#F7FFE533] p-4 text-black max-sm:border-b-2 max-sm:border-t-2 sm:rounded-[20px]
					sm:border-2`
				)}
			>
				<h2 className="text-lg font-bold">Payment Details</h2>

				<div className="flex flex-col gap-6 text-base 2xl:text-lg">
					<div className="flex items-center justify-between">
						<span className="text-body">Amount</span>
						<span className="flex gap-1">
							{paymentDetails?.collectionAmount}{" "}
							{!coinImage ? (
								<div className="h-[18px] w-[18px] animate-pulse rounded-md bg-gray-300" />
							) : (
								<div className="flex items-center gap-1">
									<Image
										src={coinImage}
										alt="Payment Token"
										width={18}
										height={18}
										className="rounded-full"
									/>
									<span className="">{coin.toUpperCase()}</span>
								</div>
							)}{" "}
							($
							{paymentDetails?.usdAmount})
						</span>
					</div>
					{/* <div className="flex items-center justify-between">
						<span>Talent Receives</span>
						<span>${paymentDetails?.collectionAmount}</span>
					</div> */}
					<div className="flex items-center justify-between">
						<span className="text-body">Community Fee ({paymentDetails?.feePercentage}%)</span>
						<span>
							{paymentDetails?.expectedFee} {coin.toUpperCase()} ($
							{paymentDetails?.usdFee.toFixed(2)})
						</span>
					</div>
					<div className="flex items-center justify-between font-bold">
						<span>Total</span>
						<span>
							{paymentDetails?.amountToPay} {coin.toUpperCase()} ($
							{(Number(paymentDetails?.usdAmount) + Number(paymentDetails?.usdFee)).toFixed(2)})
						</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center gap-4 border border-line bg-input-bg p-6 sm:rounded-2xl">
				{paymentMethod === PaymentMethodType.CRYPTO && (
					<div className="flex items-center gap-4">
						<Image
							src="/icons/w-1.png"
							alt="Coinbase"
							width={50}
							height={50}
							className="h-[34px] w-[34px] rounded-full border border-gray-200 sm:h-[50px] sm:w-[50px]"
						/>
						<Image
							src="/icons/w-2.png"
							alt="Coinbase"
							width={50}
							height={50}
							className="h-[34px] w-[34px] rounded-full border border-gray-200 sm:h-[50px] sm:w-[50px]"
						/>
						<Image
							src="/icons/w-3.png"
							alt="Coinbase"
							width={50}
							height={50}
							className="h-[34px] w-[34px] rounded-full border border-gray-200 sm:h-[50px] sm:w-[50px]"
						/>
						<Image
							src="/icons/w-4.png"
							alt="Coinbase"
							width={50}
							height={50}
							className="h-[34px] w-[34px] rounded-full border border-gray-200 sm:h-[50px] sm:w-[50px]"
						/>
						<Image
							src="/icons/w-5.png"
							alt="Coinbase"
							width={50}
							height={50}
							className="h-[34px] w-[34px] rounded-full border border-gray-200 sm:h-[50px] sm:w-[50px]"
						/>
					</div>
				)}
				{paymentMethod === PaymentMethodType.STRIPE && (
					<div className="flex items-center gap-4">
						<Image
							src="/images/stripe.png"
							alt="Stripe"
							width={147.13}
							height={61.27}
							className="h-[38.73px] w-[93.02px] sm:h-[61.27px] sm:w-[147.13px]"
						/>
					</div>
				)}
				<p className="text-body max-sm:text-center">
					{paymentMethod === "crypto"
						? "Connect your wallet of choice or pay with a deposit address."
						: "You will be redirected to our payment partner to complete payment."}
				</p>
			</div>

			{isDesktop ? (
				<>
					{paymentMethod === "crypto" ? (
						<CryptoPaymentModal
							isOpen={isOpen}
							closeModal={() => setIsOpen(false)}
							collectionId={jobId}
							amount={paymentDetails?.amountToPay}
							chainId={Number(paymentDetails?.chainId)}
							coin={coin}
							depositAddress={depositAddress}
							tokenDecimal={tokenDecimal}
							contractAddress={contractAddress}
							onSuccessResponse={onSuccessResponse}
							isLoading={isConfirmPaymentLoading}
							config={config}
						/>
					) : (
						<FiatPaymentModal
							isOpen={isOpen}
							closeModal={() => setIsOpen(false)}
							collectionId={jobId}
							chain="avalanche"
							onFinishResponse={onSuccessResponse}
							isLoading={isConfirmPaymentLoading}
							config={config}
						/>
					)}
				</>
			) : (
				<MobileSheetWrapper
					isOpen={isOpen}
					className="!bottom-0 !top-[70px] m-0 !h-[calc(100dvh-70px)] overflow-hidden p-0"
				>
					{paymentMethod === "crypto" ? (
						<CryptoPaymentModal
							isOpen={isOpen}
							closeModal={() => setIsOpen(false)}
							collectionId={jobId}
							amount={paymentDetails?.amountToPay}
							chainId={Number(paymentDetails?.chainId)}
							coin={coin}
							depositAddress={depositAddress}
							tokenDecimal={tokenDecimal}
							contractAddress={contractAddress}
							onSuccessResponse={onSuccessResponse}
							isLoading={isConfirmPaymentLoading}
							config={config}
						/>
					) : (
						<FiatPaymentModal
							isOpen={isOpen}
							closeModal={() => setIsOpen(false)}
							collectionId={jobId}
							chain="avalanche"
							onFinishResponse={onSuccessResponse}
							isLoading={isConfirmPaymentLoading}
							config={config}
						/>
					)}
				</MobileSheetWrapper>
			)}
			<div className="mt-8 w-full max-sm:px-4 sm:h-full">
				<Button
					variant="primary"
					fullWidth
					onClick={() => {
						setIsOpen(true);
					}}
					className="flex items-center justify-center gap-2 text-center"
				>
					{isConfirmPaymentLoading ? "Confirming Payment... " : "Make Deposit"}
					{isConfirmPaymentLoading && <Spinner size={20} className="!size-fit" />}
				</Button>
			</div>
		</div>
	);
};
