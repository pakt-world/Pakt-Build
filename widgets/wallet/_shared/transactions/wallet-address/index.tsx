"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ReactNode, useEffect, useState } from "react";
import { useCopyToClipboard, useMediaQuery } from "usehooks-ts";
import { ArrowRight, Copy, CopyCheck } from "lucide-react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { useShowWalletAddressStore } from "./_components/private-key/store";
import Logger from "@/lib/utils/logger";
import { useWalletState } from "@/lib/store/wallet";

interface WalletAddressProps {
	header?: ReactNode;
	callback?: () => void;
}

export const WalletAddress = ({ header, callback }: WalletAddressProps) => {
	const [walletAddressCopied, setWalletAddressCopied] = useState(false);
	const [copiedText, copy] = useCopyToClipboard();
	const isMobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();
	const { setShowPrivateKeyFlow } = useShowWalletAddressStore();

	const { wallet } = useWalletState();
	const walletAddress = wallet.wallets[0]?.address || "";
	Logger.info("walletData", { walletAddress });

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
		<div className="flex flex-col gap-4 rounded-lg border border-[#9BDCFD] bg-white p-4">
			{header}
			<div className="flex w-full flex-col items-center gap-4 sm:flex-row">
				<div className="flex w-full flex-col items-start gap-4 sm:w-[65%]">
					<div className="flex w-full flex-col items-start rounded-lg border border-green-lighter bg-green-lightest p-4">
						<span
							style={{
								wordBreak: "break-word",
							}}
							className="text-xl font-medium text-black sm:font-bold"
						>
							{walletAddress}
						</span>
						<Button
							variant="secondaryOutline"
							onClick={handleCopy(walletAddress)}
							className="size-fit gap-2 border-none px-0 pb-0"
						>
							{walletAddressCopied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
							{walletAddressCopied ? "Copied!" : "Copy Address"}
						</Button>
					</div>
					<Button
						variant="secondaryOutline"
						className="w-fit gap-2 max-sm:hidden max-sm:border-none max-sm:bg-transparent max-sm:p-0"
						onClick={() => {
							if (isMobile) {
								router.push("/wallet/address/private-key");
							} else {
								setShowPrivateKeyFlow(true);
								callback && callback();
							}
						}}
					>
						Show Private Key <ArrowRight className="size-4" />
					</Button>
				</div>
				<div
					className="flex h-[182px] w-full flex-col items-start rounded-2xl border border-blue-lighter bg-[#EAF9FF] px-5 py-4 sm:h-full
						sm:w-[35%]"
				>
					<div
						style={{
							height: "100%",
							margin: "0 auto",
							maxWidth: "100%",
							width: "100%",
						}}
					>
						<QRCode
							style={{ height: "100%", maxWidth: "100%", width: "100%" }}
							value={walletAddress}
							// size={256}
							// viewBox={`0 0 256 256`}
						/>
					</div>
				</div>
				<Button
					variant="secondaryOutline"
					className="w-fit gap-2 max-sm:bg-transparent sm:hidden"
					onClick={() => {
						if (isMobile) {
							router.push("/wallet/address/private-key");
						} else {
							setShowPrivateKeyFlow(true);
							callback && callback();
						}
					}}
				>
					Show Private Key <ArrowRight className="size-4" />
				</Button>
			</div>
		</div>
	);
};
