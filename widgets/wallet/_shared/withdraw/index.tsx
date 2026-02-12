"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { toast } from "@/components/common/toaster";
import { useInitiate2FAEmail } from "@/lib/api/2fa";
import { type WalletProps } from "@/lib/api/wallet";
import { useWithdraw } from "@/lib/api/wallet/withdraw";
import { useUserState } from "@/lib/store/account";
import { useExchangeRateStore } from "@/lib/store/misc";
import { baseWithdrawFormSchema, withdrawFormSchema } from "@/lib/validations";
import { DesktopSheetWrapper } from "@/collection/actions/desktop/_components/sheet-wrapper";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { TwoFAInput } from "./withdrawal-authentication";

import { AmountInput } from "./_components/amount-input";
import { SelectAsset } from "./_components/select-assets";
import { WithdrawalHeader } from "./_components/header";
import { RecipientAddress } from "./_components/address";
import { Password } from "./_components/password";
import { ConfirmWithdrawal } from "./_components/confirm";

type withdrawFormValues = z.infer<typeof baseWithdrawFormSchema>;

export const WithdrawalModal = ({
	isOpen,
	onChange,
	wallets,
	refetch,
}: {
	isOpen: boolean;
	onChange: (state: boolean) => void;
	wallets: WalletProps[];
	// network: string;
	refetch: () => void;
}): JSX.Element => {
	const [is2FA, _setIs2FA] = useState(false);
	const [selectedToken, setSelectedToken] = useState<WalletProps | null>(null);
	const [disabled, setDisabled] = useState(false);

	const { user } = useUserState();
	const { twoFa } = user ?? {};

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
		onChange(false);
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
					refetch();
				}, 1000);
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

	return (
		<DesktopSheetWrapper
			isOpen={isOpen}
			onOpenChange={() => {
				clearForm();
			}}
			className="container_style z-[999] gap-6"
		>
			<WithdrawalHeader clearForm={clearForm} />
			{!is2FA ? (
				<form
					className="flex flex-col gap-6 px-6 max-sm:pb-8 max-sm:pt-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
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
			) : (
				<TwoFAInput
					isLoading={withdraw.isLoading}
					onComplete={finalSubmit}
					type={twoFa?.type}
					close={() => {
						_setIs2FA(false);
					}}
				/>
			)}
		</DesktopSheetWrapper>
	);
};
