"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMobileContext } from "@/providers/mobile-context-provider";
import HomeMobileHeader from "@/widgets/home/mobile/sub-header";
import { BottomNav } from "@/widgets/_shared/mobile/footer-nav";
import SignupMethodSlide from "@/widgets/authentication/mobile/_components/signup-method-slide";
import SigninMethodSlide from "@/widgets/authentication/mobile/_components/signin-method-slide";

const MobileHomeLayout = ({ children }: { children: ReactNode }) => {
	const { isAtTop } = useMobileContext();

	const marginTopClass = !isAtTop ? "max-sm:mt-0" : "max-sm:mt-[70px]";
	return (
		<div className="size-full">
			<div className="absolute inset-0 !z-[1] size-full bg-product-bg bg-cover bg-center bg-no-repeat object-cover" />
			<main className="relative !z-20 size-full flex-1 sm:px-4 sm:pt-5 xl:px-4 2xl:px-8">
				<div className={`flex size-full justify-start transition-all ease-in-out 2xl:gap-6 ${marginTopClass}`}>
					<HomeMobileHeader />
					{children}
					<BottomNav />
					{/* Slides */}
					<SigninMethodSlide />
					<SignupMethodSlide />
				</div>
			</main>
		</div>
	);
};

export default MobileHomeLayout;
