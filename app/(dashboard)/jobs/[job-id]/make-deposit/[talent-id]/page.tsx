"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PostJobPaymentDetailsResponse, useGetJobById, usePostJobPaymentDetails } from "@/lib/api/job";
import { type PaymentCoinsProps, useGetPaymentCoins } from "@/lib/api/wallet";
import MakeDeposit4Mobile from "@/widgets/jobs/make-deposit/mobile";
import MakeDeposit4Desktop from "@/widgets/jobs/make-deposit/desktop";
import type { CollectionProps } from "@/lib/types/collection";
import { PaymentMethodType } from "@/lib/enums";
import { defaultTheme } from "@/lib/utils";
import { ConfigContextType } from "@pakt/payment-module/dist/types/types";
import wagmiConfig from "@/config/wagmi";
import { useSettingState } from "@/lib/store/settings";
import { Config } from "wagmi";

interface Props {
	params: {
		"job-id": string;
		"talent-id": string;
	};
}

const METHOD: { label: string; value: PaymentMethodType }[] = [
	{ label: "Pay with Crypto", value: PaymentMethodType.CRYPTO },
	{ label: "Pay with Stripe", value: PaymentMethodType.STRIPE },
];

export default function MakeDepositPage({ params }: Props): JSX.Element {
	const isClient = useIsClient();
	const isMobile = useMediaQuery("(max-width: 620px)");

	const [paymentCoin, setPaymentCoin] = useState<string>();
	const [contractAddress, setContractAddress] = useState<string>("");
	const [tokenDecimal, setTokenDecimal] = useState<number>(6);
	const [paymentResponse, setPaymentResponse] = useState<PostJobPaymentDetailsResponse>();

	const jobId = params["job-id"];
	const talentId = params["talent-id"];

	const { data: job, isLoading, isFetched, isError } = useGetJobById({ jobId });
	const mutation = usePostJobPaymentDetails();

	const { data: paymentCoinsData, isLoading: paymentCoinsLoading } = useGetPaymentCoins({
		enable: isClient ? true : false,
	});

	const getCoinIcon = (coin: PaymentCoinsProps | undefined): string => coin?.icon ?? "";
	const selectedPaymentMethod = useMemo(
		() =>
			paymentCoinsLoading ? undefined : paymentCoinsData?.find((coin) => coin.symbol === job?.meta.coin?.symbol),
		[paymentCoinsData, paymentCoinsLoading, job]
	);

	useEffect(() => {
		if (job) {
			setPaymentCoin(job?.meta.coin?.symbol);
		}
	}, [job]);

	useEffect(() => {
		if (selectedPaymentMethod) {
			setPaymentCoin(selectedPaymentMethod?.symbol);
			mutation.mutate(
				{
					jobId,
					coin: selectedPaymentMethod?.reference,
					usdValue: job?.meta.usdInitialValue || 0,
				},
				{
					onSuccess: async (data) => setPaymentResponse(data),
				}
			);
			setContractAddress(selectedPaymentMethod?.contractAddress ?? "");
			setTokenDecimal(Number(selectedPaymentMethod?.decimal));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPaymentMethod]);

	const paymentToken = getCoinIcon(selectedPaymentMethod);

	const paymentMethods = useMemo(() => {
		const availableMethods = paymentResponse?.paymentMethods ?? [];
		return METHOD.filter((m) => availableMethods.includes(m.value));
	}, [paymentResponse]);

	const { settings } = useSettingState();
	const walletConnectId = String(settings?.wallet_connect_id);
	const stripeKey = String(settings?.stripe_public_key);

	const wagmiConfigProps = useMemo(() => wagmiConfig(walletConnectId), [walletConnectId]);

	const config: ConfigContextType = {
		theme: { ...defaultTheme },
		cryptoConfig: {
			wagmiConfig: wagmiConfigProps as Config,
		},
		stripeConfig: {
			publicKey: stripeKey,
			clientSecret: "",
			theme: "dark",
		},
	};

	if (isMobile) {
		return (
			<MakeDeposit4Mobile
				jobId={jobId}
				talentId={talentId}
				paymentToken={paymentToken}
				paymentCoin={paymentCoin}
				contractAddress={contractAddress}
				tokenDecimal={tokenDecimal}
				job={job as CollectionProps}
				mutation={mutation}
				isLoading={isLoading}
				isFetched={isFetched}
				isError={isError}
				paymentMethods={paymentMethods}
				config={config}
			/>
		);
	}

	return (
		<MakeDeposit4Desktop
			jobId={jobId}
			talentId={talentId}
			paymentToken={paymentToken}
			paymentCoin={paymentCoin}
			contractAddress={contractAddress}
			tokenDecimal={tokenDecimal}
			job={job as CollectionProps}
			mutation={mutation}
			isLoading={isLoading}
			isFetched={isFetched}
			isError={isError}
			paymentMethods={paymentMethods}
			config={config}
		/>
	);
}
