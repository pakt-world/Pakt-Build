"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useIsClient } from "usehooks-ts";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AuthEnums } from "@/lib/enums";
import { Button } from "@/components/common/button";

export default function MobileOnboardingHeader(): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const isClient = useIsClient();

	if (isClient) {
		return (
			<div
				className="fixed left-0 top-0 !z-50 block h-[70px] w-full shrink-0 overflow-hidden bg-mobile-header bg-cover bg-center bg-no-repeat
					sm:hidden"
			>
				<div
					className={`${pathname === `/${AuthEnums.ONBOARDING}` ? "justify-center" : "justify-between"} flex h-full w-full items-center p-4`}
				>
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
		);
	}
	return <></>;
}
