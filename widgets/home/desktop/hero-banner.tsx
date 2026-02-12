"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
// import { AuthEnums } from "@/lib/enums";

export default function HomeHeroBanner4Desktop(): JSX.Element {
	const router = useRouter();

	return (
		<div className="relative z-[2] mt-5 flex h-fit w-full items-center gap-2 !rounded-2xl border border-[#9BDCFD] bg-white p-4 text-title">
			<div className="flex w-full flex-col items-start gap-4">
				<div className="flex w-fit flex-col gap-4">
					<h3 className="text-3xl font-bold leading-normal 1xl:text-[45px] 1xl:leading-[130%]">
						Build on Pakt. Earn crypto.
					</h3>
					<p className="text-base leading-[130%] 1xl:text-xl">
						Create jobs. Find work. All transactions on-chain.
						<br /> Welcome to the future of trusted collaboration.
					</p>
				</div>

				<div className="flex items-center gap-4">
					<Button
						variant="primary"
						size="xl"
						className="h-full sm:w-max"
						onClick={() => {
							// router.push(`/?auth=${AuthEnums.SIGNUP}`);
							router.push(`/?auth=signup_method`);
						}}
					>
						Sign Up
					</Button>
					<Button
						variant="secondaryOutline"
						size="xl"
						className="h-full sm:w-max"
						onClick={() => {
							// router.push(`/?auth=${AuthEnums.LOGIN}`);
							router.push(`/?auth=signin_method`);
						}}
					>
						Login
					</Button>
				</div>
				<div className="absolute bottom-4 right-4 h-[212.98px] w-[213px] origin-bottom-right transform lg:scale-[0.8] 2xl:scale-100">
					<Image className="" src="/images/hero-pakt.png" alt="hero" fill sizes="90vw" />
				</div>
			</div>
		</div>
	);
}
