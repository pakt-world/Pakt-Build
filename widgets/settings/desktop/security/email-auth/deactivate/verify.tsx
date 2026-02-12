"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { XCircleIcon } from "lucide-react";
import { useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeActivate2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { useEmail2FAState, useMscState } from "@/lib/store/security";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { OtpInput } from "@/components/common/otp-input";
import { Button } from "@/components/common/button";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyDeactivateOTP = ({ goToNextSlide, isActive }: SlideItemProps): React.JSX.Element => {
	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useDeActivate2FA();
	const { user } = useUserState();
	const { email } = user ?? { email: "" };

	const { setIsInput6DigitCode } = useMscState();

	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<EmailOtpFormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<EmailOtpFormValues> = async ({ otp }) => {
		await mutateAsync({ code: otp });
		goToNextSlide?.();
	};

	useEffect(() => {
		if (isActive) {
			setIsInput6DigitCode?.(true);
		} else {
			setIsInput6DigitCode?.(false);
		}
	}, [isActive, setIsInput6DigitCode]);

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<h3 className="text-title">Email</h3>
				<XCircleIcon className="my-auto cursor-pointer text-body" onClick={closeModal} />
			</div>
			<div className="flex w-full shrink-0 flex-col items-center gap-8">
				<p className="text-title">
					Enter the 6 digit code sent to <span className="text-success">{email}</span>
				</p>

				<form className="flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="relative">
						<Controller
							name="otp"
							control={control}
							render={({ field: { onChange, value } }) => (
								<OtpInput value={value} onChange={onChange} numInputs={6} />
							)}
						/>
						<InputErrorMessage message={errors.otp?.message} />
					</div>

					<Button variant="primary" size="md" className="mt-auto" fullWidth>
						{isLoading ? <Spinner /> : "Deactivate"}
					</Button>
				</form>
			</div>
		</div>
	);
};
