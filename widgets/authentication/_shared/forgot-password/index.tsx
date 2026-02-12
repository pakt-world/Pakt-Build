/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import ForgotPasswordForm from "@/widgets/authentication/_shared/forgot-password/_components/forgot-password-form";

export default function ForgotPasswordPage(): JSX.Element {
	return (
		<Container className="z-[2] flex size-full max-w-2xl flex-col items-center justify-center gap-6 max-sm:p-0">
			<div className="flex flex-col items-center gap-2 text-center">
				<h3 className="font-sans text-2xl font-bold text-title sm:text-3xl sm:text-white">Forgot Password</h3>
				<p className="max-w-md font-sans text-base leading-normal tracking-tight text-body sm:text-white">
					Enter the email you used to create your account so we can send you instructions on how to reset your
					password.
				</p>
			</div>
			<ForgotPasswordForm />
		</Container>
	);
}
