"use client";

import { Button } from "@/components/common/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}): JSX.Element {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<h2 className="text-2xl font-bold text-title">Something went wrong!</h2>
			<p className="text-base font-normal text-body">{error.message}</p>
			<Button
				type="button"
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => {
						reset();
					}
				}
				variant="primary"
				className="mt-4"
			>
				Try again
			</Button>
		</div>
	);
}
