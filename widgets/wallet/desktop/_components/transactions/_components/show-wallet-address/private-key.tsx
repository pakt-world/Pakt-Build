"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { PrivateKeyFlow } from "@/widgets/wallet/_shared/transactions/wallet-address/_components/private-key";

interface ShowPrivateKeyModalProps {
	isOpen?: boolean;
	setIsOpen?: (value: boolean) => void;
	callback?: () => void;
	noTrigger?: boolean;
}

export const ShowPrivateKeyModal = ({ isOpen = false, setIsOpen, callback, noTrigger }: ShowPrivateKeyModalProps) => {
	const isMobile = useMediaQuery("(max-width: 640px)");

	const router = useRouter();
	return (
		<>
			{!noTrigger && (
				<Button
					variant="secondaryOutline"
					className="w-fit gap-2 max-sm:border-none max-sm:bg-transparent max-sm:p-0"
					onClick={() => {
						if (isMobile) {
							router.push("/wallet/wallet-address");
						} else {
							setIsOpen?.(true);
							callback && callback();
						}
					}}
				>
					Show Private Key <ArrowRight className="size-4" />
				</Button>
			)}
			<Modal
				isOpen={isOpen}
				onOpenChange={() => {
					setIsOpen?.(false);
				}}
				className="sm:!max-w-[570px]"
				// disableClickOutside
			>
				<PrivateKeyFlow />
			</Modal>
		</>
	);
};
