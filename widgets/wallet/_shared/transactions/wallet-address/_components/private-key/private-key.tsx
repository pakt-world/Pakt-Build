"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { useCopyToClipboard, useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { Copy, CopyCheck } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { useShowWalletAddressStore } from "./store";

export const PrivateKey = () => {
	const [walletAddressCopied, setWalletAddressCopied] = useState(false);
	const [copiedText, copy] = useCopyToClipboard();
	const { secretKey, setShowPrivateKeyFlow } = useShowWalletAddressStore();
	const isMobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();

	const handleCopy = (text: string) => () => {
		copy(text)
			.then(() => {
				setWalletAddressCopied(true);
			})
			.catch((error) => {
				console.error("Failed to copy!", error);
			});
	};

	// Set state back to default after 2 seconds
	useEffect(() => {
		if (copiedText) {
			const timer = setTimeout(() => {
				setWalletAddressCopied(false);
			}, 2000);
			return () => clearTimeout(timer);
		}

		return () => {};
	}, [copiedText]);

	return (
		<div className="flex w-full flex-col items-start gap-4">
			<div className="flex h-auto w-full items-center justify-between rounded-lg border border-green-lighter bg-green-lightest p-2">
				<div className="flex w-full flex-col items-start gap-4">
					<div className="relative size-full">
						<p className="break-words text-base font-medium text-title sm:text-xl sm:font-bold">
							{secretKey}
						</p>
					</div>
					<Button
						variant="secondary"
						onClick={handleCopy(secretKey)}
						className="size-fit gap-2 border-none bg-transparent p-0 font-normal disabled:text-gray-400"
					>
						{walletAddressCopied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
						{walletAddressCopied ? "Copied!" : "Copy Key"}
					</Button>
				</div>
			</div>
			<Button
				variant="primary"
				className="w-full"
				onClick={() => {
					if (isMobile) {
						router.push("/wallet");
					} else {
						setShowPrivateKeyFlow(false);
					}
				}}
			>
				Done
			</Button>
		</div>
	);
};
