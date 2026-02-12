"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { usePublicExchangeRate } from "@/lib/api/wallet";
import { BrandLoader } from "@/components/common/brand-loader";
import MobileOnboardingHeader from "@/widgets/_shared/mobile/onboarding-header";
import DesktopSidebar from "@/widgets/_shared/desktop/sidebar";
import { BottomNav } from "@/widgets/_shared/mobile/footer-nav";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const isMobile = useMediaQuery("(max-width: 640px)");

	// === Get Public Exchange Rate === //
	const { isFetched: rateFetched, isFetching: rateFetching } = usePublicExchangeRate({
		enable: true,
	});

	// Show loading indicator if fetching data
	if (!rateFetched && rateFetching) {
		return <BrandLoader />;
	}

	if (isMobile) {
		return (
			<div className="flex w-full">
				<div className="relative flex w-full flex-col sm:h-full">
					<div className="absolute inset-0 !z-[1] size-full bg-product-bg bg-cover bg-center bg-no-repeat object-cover" />
					<MobileOnboardingHeader />
					<main className={"relative z-[2] mt-[70px] w-full"}>{children}</main>
					<BottomNav />
				</div>
			</div>
		);
	}

	if (isDesktop) {
		return (
			<div className="flex size-full">
				<DesktopSidebar />
				<div className="relative size-full">
					<div className="absolute inset-0 !z-[1] size-full bg-product-bg bg-cover bg-center bg-no-repeat object-cover" />
					<main className={"relative !z-20 w-full pt-5"}>{children}</main>
				</div>
			</div>
		);
	}

	return <></>;
}
