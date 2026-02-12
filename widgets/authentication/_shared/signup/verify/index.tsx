"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import SignUpVerificationForm from "./_components/verification-form";

export default function SignUpVerificationPage(): JSX.Element {
	return (
		<div className="z-[2] flex size-full flex-col items-center justify-center gap-6 sm:mx-auto">
			<div className="flex flex-col items-center gap-2 text-center">
				<h3 className="font-sans text-2xl font-bold text-title sm:text-3xl sm:text-white">Verify Email</h3>
				<p className="font-sans text-base text-body sm:text-white">
					A code has been sent to your email address.
					<br /> Enter it to verify your email.
				</p>
			</div>
			<SignUpVerificationForm />
		</div>
	);
}
