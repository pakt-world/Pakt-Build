"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { ShowPrivateKeyModal } from "./private-key";
import { WalletAddress } from "@/widgets/wallet/_shared/transactions/wallet-address";
import { WalletAddressHeader } from "@/widgets/wallet/_shared/transactions/wallet-address/_components/header";
import { useShowWalletAddressStore } from "@/widgets/wallet/_shared/transactions/wallet-address/_components/private-key/store";

export const ShowWalletAddress = () => {
	const { showWalletAddress, setShowWalletAddress, showPrivateKeyFlow, setShowPrivateKeyFlow } =
		useShowWalletAddressStore();
	const isMobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();

	return (
		<div>
			<Button
				variant="secondaryOutline"
				className="w-fit max-sm:h-fit max-sm:border-none max-sm:bg-transparent max-sm:p-0"
				onClick={() => {
					if (isMobile) {
						router.push("/wallet/address");
					} else {
						setShowWalletAddress(true);
					}
				}}
			>
				Show Wallet Address
			</Button>
			<Modal
				isOpen={showWalletAddress}
				onOpenChange={() => {
					setShowWalletAddress(false);
				}}
				className="sm:!max-w-[570px]"
				// disableClickOutside
			>
				<WalletAddress
					header={
						<WalletAddressHeader
							title="Your Wallet"
							close={() => {
								setShowWalletAddress(false);
							}}
						/>
					}
					callback={() => {
						setShowWalletAddress(false);
					}}
				/>
			</Modal>
			<ShowPrivateKeyModal isOpen={showPrivateKeyFlow} setIsOpen={setShowPrivateKeyFlow} noTrigger />
		</div>
	);
};
