"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { toast } from "@/components/common/toaster";
import { useGetWalletDetails, type WalletProps } from "@/lib/api/wallet";
import { useWithdraw } from "@/lib/api/wallet/withdraw";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useExchangeRateStore } from "@/lib/store/misc";
import { withdrawFormSchema, baseWithdrawFormSchema } from "@/lib/validations";
import { useInitiate2FAEmail } from "@/lib/api/2fa";
import { Modal } from "@/components/common/headless-modal";
import { TwoFAInputModal } from "./2fa-input";
import { WithdrawalHeader } from "@/widgets/wallet/_shared/withdraw/_components/header";
import { SelectAsset } from "@/widgets/wallet/_shared/withdraw/_components/select-assets";
import { AmountInput } from "@/widgets/wallet/_shared/withdraw/_components/amount-input";
import { RecipientAddress } from "@/widgets/wallet/_shared/withdraw/_components/address";
import { Password } from "@/widgets/wallet/_shared/withdraw/_components/password";
import { ConfirmWithdrawal } from "@/widgets/wallet/_shared/withdraw/_components/confirm";

type withdrawFormValues = z.infer<typeof baseWithdrawFormSchema>;

export default function WalletWithdrawalPage(): JSX.Element {
	const [is2FA, _setIs2FA] = useState(false);
	const [selectedToken, setSelectedToken] = useState<WalletProps | null>(null);
	const [disabled, setDisabled] = useState(false);

	const isSmallerScreen = useMediaQuery("(max-width: 640px)");
	const router = useRouter();

	const { user } = useUserState();
	const { twoFa } = user ?? { twoFa: { status: false, type: "" } };

	const { data: walletData, refetch: refetchWalletData } = useGetWalletDetails({});

	const wallets: WalletProps[] = useMemo(() => walletData?.wallets ?? [], [walletData]);

	const withdraw = useWithdraw();
	const { mutateAsync, isLoading: is2FAEmailInitiateLoading } = useInitiate2FAEmail();

	const handleInitiateOtp = async (): Promise<void> => {
		try {
			await mutateAsync();
			// This line will only be reached if mutateAsync succeeds
			_setIs2FA(true);
		} catch (error) {
			// Handle any errors that occur during the mutation
			toast.error(`Error initiating OTP: ${error as string}`);
		}
	};

	const { data: rates } = useExchangeRateStore();

	const coinRate =
		selectedToken?.id && rates?.[selectedToken.id.toLowerCase()] !== undefined
			? rates[selectedToken.id.toLowerCase()]
			: 0;

	const form = useForm<withdrawFormValues>({
		resolver: zodResolver(withdrawFormSchema(selectedToken?.amount || 0)),
		mode: "all",
	});

	const clearForm = (): void => {
		form.reset({
			coin: "",
			amount: 0,
			address: "",
			password: "",
			confirm: false,
		});
		setSelectedToken(null);
		router.back();
		_setIs2FA(false);
	};

	const finalSubmit = (otp?: string): void => {
		const values = form.getValues();
		const payload = {
			address: values.address,
			amount: Number(values.amount),
			coin: values.coin,
			password: values.password,
			otp,
		};
		withdraw.mutate(payload, {
			onSuccess: () => {
				clearForm();
				setTimeout(() => {
					refetchWalletData();
				}, 2000);
			},
		});
	};

	const onSubmit: SubmitHandler<withdrawFormValues> = async (): Promise<void> => {
		if (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.AUTHENTICATOR) {
			_setIs2FA(true);
			return;
		}
		if (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.EMAIL) {
			await handleInitiateOtp();
			return;
		}

		finalSubmit();
	};

	if (isSmallerScreen) {
		return (
			<div className="flex w-full flex-col items-center justify-center overflow-y-auto pb-[80px]">
				<WithdrawalHeader className="!fixed !top-[70px]" clearForm={clearForm} />
				<form className="mt-4 flex flex-col gap-6 px-4 pt-[70px]" onSubmit={form.handleSubmit(onSubmit)}>
					<SelectAsset
						selectedToken={selectedToken}
						setSelectedToken={setSelectedToken}
						wallets={wallets}
						form={form}
					/>

					<AmountInput
						form={form}
						coinRate={coinRate}
						selectedToken={selectedToken}
						disabled={disabled}
						setDisabled={setDisabled}
					/>

					<RecipientAddress form={form} />

					<Password form={form} />

					<ConfirmWithdrawal form={form} />

					<Button
						disabled={withdraw.isLoading || !form.formState.isValid || disabled}
						fullWidth
						variant="primary"
					>
						{withdraw.isLoading || is2FAEmailInitiateLoading ? <Spinner /> : "Withdraw Funds"}
					</Button>
				</form>
				<Modal isOpen={is2FA} closeModal={() => _setIs2FA(false)}>
					<TwoFAInputModal
						isLoading={withdraw.isLoading}
						onComplete={finalSubmit}
						type={twoFa?.type}
						close={() => {
							_setIs2FA(false);
						}}
					/>
				</Modal>
			</div>
		);
	}
	return <></>;
}
