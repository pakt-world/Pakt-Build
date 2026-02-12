"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { Socials } from "./_components/socials";

export const Bio = ({
	body,
	profileLinks,
	// tab,
}: {
	body: string;
	profileLinks:
		| {
				website?: string;
				x?: string;
				tiktok?: string;
				instagram?: string;
				github?: string;
		  }
		| undefined;
	// tab: boolean;
}): JSX.Element => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [showBio, setShowBio] = useState<boolean>(false);

	const lines = body.split("\n");

	const bodyLines = lines.map((line, index) => (
		<p key={index} className="text-title">
			{line}
			{line === "" && <br />} {/* To handle empty lines */}
		</p>
	));

	return (
		<div
			className={cn(
				`flex w-full grow flex-col border border-b border-[#6EC2FB] bg-white p-4 max-sm:px-4 max-sm:py-0 sm:gap-3 sm:rounded-2xl
				sm:bg-blue-lightest/20`,
				{
					"bg-[#C9F0FF33]": showBio,
				}
			)}
		>
			<div className="flex w-full items-center justify-between">
				<button
					className="!m-0 flex w-full items-center justify-between !p-0 leading-normal max-sm:!h-[64px]"
					onClick={() => {
						setShowBio(!showBio);
					}}
				>
					<h3 className="text-left text-base font-bold text-title sm:text-2xl sm:font-medium">
						{isMobile ? "About" : "Bio"}
					</h3>
					<ChevronRight
						className={`h-6 w-6 text-body transition-transform sm:hidden ${showBio ? "rotate-90 transform" : ""}`}
					/>
				</button>
				{!isMobile && <Socials profileLinks={profileLinks} />}
			</div>
			<div
				className={`flex flex-wrap gap-2 overflow-hidden transition-all max-sm:flex-col ${showBio ? "mt-4 h-fit pb-4" : "h-0"} sm:mt-0
					sm:h-fit`}
			>
				{bodyLines}
				{isMobile && <Socials profileLinks={profileLinks} className="mt-4" />}
			</div>
		</div>
	);
};
