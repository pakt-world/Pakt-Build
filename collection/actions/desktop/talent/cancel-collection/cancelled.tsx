"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import warning from "@/lottiefiles/warning.json";
import { Button } from "@/components/common/button";
import Lottie from "@/components/common/lottie";

export const CollectionHasBeenCancelled = ({ closeModal }: { closeModal: () => void }) => {
	const router = useRouter();
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 bg-red-50 text-body">
			<div className="flex w-[200px] items-center justify-center">
				<Lottie animationData={warning} />
			</div>
			<span>This Job has been cancelled</span>
			<div className="w-full max-w-[200px]">
				<Button
					fullWidth
					size="lg"
					variant="primary"
					onClick={() => {
						closeModal();
						setTimeout(() => {
							router.push("/dashboard");
						}, 1000);
					}}
				>
					Go To Dashboard
				</Button>
			</div>
		</div>
	);
};
