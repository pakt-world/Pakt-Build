"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import SignUpForm from "./_components/signup-form";

export default function SignUpPage(): JSX.Element {
	return (
		<div className="z-[2] flex w-full items-center sm:mx-auto sm:size-full">
			<div className="flex size-full flex-col items-center justify-center gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h3 className="font-sans text-2xl font-bold text-title sm:text-3xl sm:text-white">
						Create Your Account
					</h3>
					<p className="w-[392px] text-center text-base font-medium leading-normal tracking-tight text-body sm:text-white">
						Connect with world-class builders
					</p>
				</div>
				<SignUpForm />
			</div>
		</div>
	);
}
