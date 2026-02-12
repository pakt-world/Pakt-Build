"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { WalletAddressHeader } from "@/widgets/wallet/_shared/transactions/wallet-address/_components/header";
import { WalletAddress } from "@/widgets/wallet/_shared/transactions/wallet-address";

export default function WalletAddressPage(): JSX.Element {
	const router = useRouter();
	return (
		<div className="relative flex w-full flex-col overflow-y-auto bg-[#E5F6FF]/70 pb-[64px]">
			<WalletAddressHeader
				title={
					<div className="flex items-center gap-4">
						<ChevronLeft
							className="h-6 w-6 cursor-pointer text-black"
							onClick={() => {
								router.push("/wallet");
							}}
						/>
						Wallet Address
					</div>
				}
				className="!fixed top-[70px] h-[54px] w-full border-y border-green-lighter bg-white px-4 py-2"
			/>
			<div className="mt-[54px] w-full p-4">
				<WalletAddress />
			</div>
		</div>
	);
}
