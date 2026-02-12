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

import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { useDeActivate2FA } from "@/lib/api/account";
import { Spinner } from "@/components/common/loader";
import { OtpInput } from "@/components/common/otp-input";
import { Button } from "@/components/common/button";
import { useRouter } from "next/navigation";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type AuthAppOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyDeactivateAuthApp = ({ goToNextStep }: { goToNextStep: () => void }): React.JSX.Element => {
	const router = useRouter();
	const { mutate, isLoading } = useDeActivate2FA();

	const form = useForm<AuthAppOtpFormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<AuthAppOtpFormValues> = async ({ otp }) => {
		mutate(
			{ code: otp },
			{
				onSuccess: () => {
					goToNextStep();
				},
			}
		);
	};

	return (
		<div className="flex size-full flex-col items-center gap-14 pb-4 text-center">
			<div className="relative flex w-full flex-row justify-center">
				<ChevronLeft
					className="absolute left-0 top-1/2 my-auto -translate-y-1/2 cursor-pointer text-body"
					onClick={() => router.push("/settings/2fa")}
				/>
				<h3 className="font-bold text-title">Authenticator App</h3>
			</div>
			<div className="flex w-full flex-col gap-4">
				<p className="mx-auto max-w-[300px] text-body">Enter the 6-digit code from your Authenticator app</p>
				<div className="relative mx-auto">
					<Controller
						name="otp"
						control={form.control}
						render={({ field: { onChange, value } }) => (
							<OtpInput value={value} onChange={onChange} numInputs={6} />
						)}
					/>
					<div className="child:!relative child:!bottom-0 my-2 flex justify-center text-center">
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
