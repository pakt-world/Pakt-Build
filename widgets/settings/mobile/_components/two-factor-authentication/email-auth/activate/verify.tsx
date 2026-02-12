"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft, Timer } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useActivate2FA, useInitialize2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { Spinner } from "@/components/common/loader";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { OtpInput } from "@/components/common/otp-input";
import { formatCountdown } from "@/lib/utils";
import { Button } from "@/components/common/button";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyActivateOTP = ({
	goToNextStep,
	goToPrevStep,
}: {
	goToNextStep: () => void;
	goToPrevStep: () => void;
}): React.JSX.Element => {
	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(true);

	const { user } = useUserState();
	const { email } = user ?? { email: "" };

	const { mutateAsync, isLoading } = useActivate2FA();
	const initiate = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		await initiate.mutateAsync({ type: TwoFactorAuthEnums.EMAIL });
		setIsResendDisabled(true);
	};

	// TODO:: move to a useCountdown timer react-hook
	useEffect(() => {
		if (isResendDisabled) {
			setCountdown(60);
			const timer = setInterval(() => {
				setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
			}, 1000);
			setTimeout(() => {
				setIsResendDisabled(false);
			}, 60000);

			return () => {
				clearInterval(timer);
			};
		}
		return () => {};
	}, [isResendDisabled]);

	const form = useForm<EmailOtpFormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<EmailOtpFormValues> = async ({ otp }) => {
		await mutateAsync({ code: otp });
		goToNextStep();
	};

	return (
		<div className="relative flex w-full flex-col items-center justify-between gap-8 overflow-y-auto pb-4 text-center">
			<div className="relative flex w-full flex-row justify-center">
				<ChevronLeft
					className="absolute left-0 top-1/2 my-auto -translate-y-1/2 cursor-pointer text-body"
					onClick={() => goToPrevStep()}
				/>
				<h3 className="font-bold text-title">Email Authentication</h3>
			</div>
			<div className="flex flex-col items-center gap-8">
				<p className="text-body">
					Enter the 6 digit code sent to <span className="text-success">{email}</span>
				</p>
				<div className="relative">
					<Controller
						name="otp"
						control={form.control}
						render={({ field: { onChange, value } }) => (
							<OtpInput value={value} onChange={onChange} numInputs={6} />
						)}
					/>
					<div className="my-2 flex justify-center text-center">
						<InputErrorMessage message={form.formState.errors.otp?.message} />
					</div>
				</div>

				<Button
					className="w-full"
					variant="primary"
					fullWidth
					onClick={() =>
						onSubmit({
							otp: form.getValues("otp"),
						})
					}
				>
					{isLoading ? <Spinner /> : "Confirm"}
				</Button>
				<p>{formatCountdown(countdown)}</p>
				<Button
					variant="outlinePrimary"
					className="!rounded-xl"
					size="md"
					disabled={isResendDisabled}
					onClick={handleInitiateOtp}
				>
					<Timer size={15} /> Resend Code
				</Button>
			</div>
		</div>
	);
};
