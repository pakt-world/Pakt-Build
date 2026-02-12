"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { ChevronLeft, Copy, CopyCheck } from "lucide-react";
import { useCopyToClipboard } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useAuthApp2FAState } from "@/lib/store/security";
import { Button } from "@/components/common/button";

export const ScanAuthApp = ({
	goToNextStep,
	goToPrevStep,
}: {
	goToNextStep: () => void;
	goToPrevStep: () => void;
}): React.JSX.Element => {
	const { secret, qrCode } = useAuthApp2FAState();
	const [value, copy] = useCopyToClipboard();
	return (
		<div className="flex size-full flex-col items-center gap-8 pb-4 text-center">
			<div className="relative flex w-full flex-row justify-center">
				<ChevronLeft
					className="absolute left-0 top-1/2 my-auto -translate-y-1/2 cursor-pointer text-body"
					onClick={() => goToPrevStep()}
				/>
				<h3 className="font-bold text-title">Authenticator App</h3>
			</div>
			<p className="text-body">Scan this QR in your Authenticator application</p>
			<Image src={qrCode || ""} width={200} height={200} alt="" />
			<div className="flex flex-col gap-2">
				<p className="!text-body">Or copy this key</p>
				<div className="flex items-center gap-[30px]">
					<p className="text-sm font-bold leading-[21px] tracking-tight text-neutral-600">{secret}</p>
					<Button
						className="!px-4 !py-2"
						onClick={async () => copy(secret)}
						type="button"
						variant="secondary"
					>
						{value !== null ? <CopyCheck size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
					</Button>
				</div>
			</div>
			<Button variant="primary" size="md" className="mt-auto w-full" onClick={goToNextStep} fullWidth>
				Next
			</Button>
		</div>
	);
};
