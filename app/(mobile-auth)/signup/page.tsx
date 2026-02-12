"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import SignUpPage from "@/widgets/authentication/_shared/signup";

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
		<div className="relative flex h-screen w-full flex-col gap-4 overflow-x-hidden overflow-y-scroll p-4 pb-[70px]">
			<SignUpPage />
		</div>
	);
};

export default Page;
