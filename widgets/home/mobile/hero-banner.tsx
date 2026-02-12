"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { AuthEnums } from "@/lib/enums";

export default function HomeHeroBanner4Mobile(): JSX.Element {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<div className="z-[2] mt-[58px] flex h-fit w-full items-center gap-2 bg-white px-5 py-4 text-title shadow-lg sm:hidden">
			<div className="flex w-full flex-col items-start gap-2">
				<h3 className="whitespace-pre text-[20px] font-bold leading-[130%]">Build on Pakt. Earn crypto.</h3>
				<p className="text-sm leading-[130%]">
					Create jobs. Find work. All transactions on-chain. Welcome to the future of trusted collaboration.
				</p>

				<div className="flex w-full items-center gap-4">
					<Button
						fullWidth
						variant="primary"
						size="xl"
						onClick={() => {
							if (isMobile) {
								// router.push(`/${AuthEnums.SIGNUP}`);
								router.push(`/?auth=signup_method`);
							} else {
								router.push(`/?auth=${AuthEnums.SIGNUP}`);
							}
						}}
					>
						Sign Up
					</Button>
				</div>
			</div>
		</div>
	);
}
