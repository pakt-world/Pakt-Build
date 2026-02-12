import Image from "next/image";
import React from "react";

export const BrandLoader = () => {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-product-bg">
			<div className="relative flex h-32 w-32 items-center justify-center max-sm:scale-[0.8]">
				<div className="absolute h-full w-full animate-spin rounded-full border border-transparent border-t-blue-darkest" />
				<div className="relative flex h-28 w-28 items-center justify-center">
					<div className="animate-spin2 absolute h-full w-full rounded-full border border-transparent border-t-primary-lighter" />
					<div className="relative flex h-28 w-28 items-center justify-center">
						<div className="animate-spin3 absolute h-full w-full rounded-full border border-transparent border-t-blue-darkest" />
						<div className="relative flex h-32 w-32 items-center justify-center">
							<div className="animate-spin4 absolute h-full w-full rounded-full border border-transparent border-t-primary-lighter" />
							<div className="relative flex h-28 w-28 items-center justify-center">
								<div className="animate-spin5 absolute h-full w-full rounded-full border border-transparent border-t-blue-darkest" />
								<div className="relative flex h-28 w-28 items-center justify-center">
									<div className="animate-spin6 absolute h-full w-full rounded-full border border-transparent border-t-primary-lighter" />
									<Image src="/images/pakt-logo.png" alt="Pakt Logo" width={57} height={49} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
