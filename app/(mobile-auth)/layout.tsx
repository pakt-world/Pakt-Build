"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, type ReactNode } from "react";
import { useIsClient } from "usehooks-ts";
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useViewportHeight } from "@/hooks/use-viewport-height";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { BrandLoader } from "@/components/common/brand-loader";
import { AuthEnums } from "@/lib/enums";
import { Button } from "@/components/common/button";

export default function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const isClient = useIsClient();
	const token = getCookie(AUTH_TOKEN_KEY);

	useViewportHeight();

	useEffect(() => {
		if (
			token &&
			pathname !== `/?auth=${AuthEnums.VERIFY_SIGNUP_SUCCESS}` &&
			pathname !== `/${AuthEnums.ONBOARDING}`
		) {
			router.push("/dashboard");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, pathname]);

	if (isClient) {
		return (
			<div className="flex h-full w-full bg-blue-lightest/20">
				<main className="relative mt-[70px] flex w-full flex-col overflow-hidden">
					<div
						className="fixed left-0 top-0 !z-[999] block h-[70px] w-full shrink-0 overflow-hidden bg-mobile-header bg-cover bg-center
							bg-no-repeat sm:hidden"
					>
						<div className="flex h-full w-full items-center justify-between p-4">
							<Link className="relative m-0 h-[25.81px] w-[142.16px] p-0" href="/">
								<Image
									src="/images/pakt-build.png"
									alt="pakt.build"
									fill
									className="cursor-pointer"
									sizes="90vw"
									priority
								/>
							</Link>
							{pathname !== `/${AuthEnums.ONBOARDING}` && pathname !== `/${AuthEnums.LOGIN}` && (
								<Button
									variant="lightBlue"
									size="sm"
									className="sm:w-max"
									onClick={() => {
										router.push(`/${AuthEnums.LOGIN}`);
									}}
								>
									Login
								</Button>
							)}

							{pathname === `/${AuthEnums.LOGIN}` && (
								<Button
									variant="lightBlue"
									size="sm"
									className="sm:w-max"
									onClick={() => {
										router.push(`/${AuthEnums.SIGNUP}`);
									}}
								>
									Signup
								</Button>
							)}
						</div>
					</div>
					{children}
				</main>
			</div>
		);
	}

	return <BrandLoader />;
}
