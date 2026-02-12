"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeActivate2FA } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { Spinner } from "@/components/common/loader";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { OtpInput } from "@/components/common/otp-input";
import { Button } from "@/components/common/button";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyDeactivateOTP = ({
	goToNextStep,
	goToPrevStep,
}: {
	goToNextStep: () => void;
	goToPrevStep: () => void;
}): React.JSX.Element => {
	const { mutateAsync, isLoading } = useDeActivate2FA();
	const { user } = useUserState();
	const { email } = user ?? { email: "" };

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
			<div className="flex w-full flex-col items-center gap-8">
				<p className="text-title">
					Enter the 6 digit code sent to <span className="text-success">{email}</span>
				</p>

				<div className="flex flex-col items-center gap-8">
					<div className="relative">
						<Controller
							name="otp"
							control={form.control}
							render={({ field: { onChange, value } }) => (
								<OtpInput value={value} onChange={onChange} numInputs={6} />
							)}
						/>
						<InputErrorMessage message={form.formState.errors.otp?.message} />
					</div>
				</div>
			</div>
			<Button
				variant="primary"
				size="md"
				className="mt-auto"
				fullWidth
				onClick={() =>
					onSubmit({
						otp: form.getValues("otp"),
					})
				}
			>
				{isLoading ? <Spinner /> : "Deactivate"}
			</Button>
		</div>
	);
};
