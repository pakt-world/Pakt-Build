"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import HomeHeroBanner4Desktop from "@/widgets/home/desktop/hero-banner";
import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import LeaderBoard from "@/widgets/dashboard/desktop/leaderboard";

import SignupMethodDialog from "@/widgets/authentication/desktop/signup/_components/signup-method-dialog";
import SignUpDialog from "@/widgets/authentication/desktop/signup";
import VerifySignUpDialog from "@/widgets/authentication/desktop/signup/verify";

import SigninMethodDialog from "@/widgets/authentication/desktop/login/_components/login-method-dialog";
import LogInDialog from "@/widgets/authentication/desktop/login";
import VerifyLoginDialog from "@/widgets/authentication/desktop/login/verify";

import ForgotPasswordDialog from "@/widgets/authentication/desktop/forgot-password";
import VerifyEmailDialog from "@/widgets/authentication/desktop/forgot-password/verify";
import ResetPasswordDialog from "@/widgets/authentication/desktop/forgot-password/reset";

import DesktopSidebar from "@/widgets/_shared/desktop/sidebar";

const DesktopHomeLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex size-full">
			<div className="absolute inset-0 !z-[1] size-full bg-product-bg bg-cover bg-center bg-no-repeat object-cover" />
			<DesktopSidebar />

			<main className="relative !z-20 size-full flex-1 sm:px-4 sm:pt-5 xl:px-4 2xl:px-8">
				<div className="flex size-full justify-start transition-all ease-in-out 2xl:gap-6">
					<div className="relative flex size-full grow flex-col max-sm:overflow-hidden sm:gap-6">
						<HomeHeroBanner4Desktop />
						{children}
					</div>
					<div
						className="z-20 hidden h-full w-full shrink-0 flex-grow basis-[278px] flex-col items-center justify-start overflow-y-auto pt-5
							sm:flex"
					>
						<div className="scrollbar-hide flex w-full origin-top-right transform flex-col items-center gap-2 xl:scale-90 2xl:scale-100">
							<LeaderBoard />
							<PoweredByPakt />
						</div>
					</div>
				</div>
			</main>
			{/* == Sign Up == */}
			<SignupMethodDialog />
			<SignUpDialog />
			<VerifySignUpDialog />
			{/* == Login == */}
			<SigninMethodDialog />
			<LogInDialog />
			<VerifyLoginDialog />
			{/* == Forgot Password == */}
			<ForgotPasswordDialog />
			<VerifyEmailDialog />
			<ResetPasswordDialog />
		</div>
	);
};

export default DesktopHomeLayout;
