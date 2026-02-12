"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, DollarSign } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
// import { AuthEnums } from "@/lib/enums";
import { useGetTotalJobCount, useGetTotalJobValue } from "@/lib/api/job";
import { formatNumberWithCommas } from "@/lib/utils";

export default function HomeMobileHeader(): JSX.Element {
	const router = useRouter();

	const { data } = useGetTotalJobCount();
	const { data: value } = useGetTotalJobValue();

	return (
		<div
			className="fixed left-0 top-0 !z-[999] block h-[calc(70px+58px)] w-full shrink-0 overflow-hidden bg-mobile-header bg-cover
				bg-center bg-no-repeat sm:hidden"
		>
			<div className="flex h-[70px] w-full items-center justify-between p-4">
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
				<Button
					variant="lightBlue"
					size="sm"
					className="sm:w-max"
					onClick={() => {
						// router.push(`/${AuthEnums.LOGIN}`);
						router.push(`/?auth=signin_method`);
					}}
				>
					Login
				</Button>
			</div>
			<div
				className="flex h-[58px] w-full items-center justify-between divide-x divide-green-lighter overflow-hidden border-y
					border-green-lighter bg-white"
			>
				<div className="flex w-full items-center p-2">
					<Briefcase size={24} className="h-[28px] w-[31px] text-[#9BDCFD]" />
					<div className="flex flex-col">
						<span className="ml-2 text-sm font-normal text-title text-opacity-50">Total Jobs created</span>
						<div className="ml-2 text-lg font-bold text-title">{data?.count}</div>
					</div>
				</div>
				<div className="flex w-full items-center p-2">
					<DollarSign size={35} className="size-[35px] text-[#86C08F]" />
					<div className="flex flex-col">
						<span className="ml-2 text-sm font-normal text-title text-opacity-50">Total Value Earned</span>
						<div className="ml-2 text-lg font-bold text-title">
							{formatNumberWithCommas(value?.value ?? 0)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
