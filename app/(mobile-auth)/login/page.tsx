"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import LoginForm from "@/widgets/authentication/_shared/login/_components/login-form";

const Page = () => {
	const isMediumScreen = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	useEffect(() => {
		if (isMediumScreen) {
			// Redirect to mobile  page
			router.push("/");
		}
	}, [isMediumScreen, router]);

	return (
		<div className="flex w-full flex-col gap-4 p-4">
			<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h3 className="font-sans text-2xl font-bold text-title sm:text-3xl sm:text-white">
						Login to your account
					</h3>
					<p className="font-sans text-base leading-normal tracking-tight text-body sm:text-white">
						Collaborate with world-class builders
					</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
};

export default Page;
