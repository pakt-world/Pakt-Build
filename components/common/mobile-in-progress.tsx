"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export const MobileInProgress = (): JSX.Element => {
	return (
		<div className="relative flex h-full w-full">
			<div className="bg-default fixed inset-0 h-full w-full bg-cover bg-center bg-no-repeat object-cover" />
			<div className="fixed inset-0 bg-[url(/images/bg.webp)] bg-cover bg-center bg-no-repeat object-cover" />
			<div className="relative flex h-screen w-full flex-col items-center justify-around px-8 py-12">
				<div className="relative flex w-full flex-col items-center justify-center gap-6">
					<Image src="/images/pakt-build.png" alt="pakt.build" width={203} height={58} />
					<div className="relative flex w-full flex-col items-center justify-center gap-6">
						<p className="text-center text-base leading-[30px] text-white">
							pakt.build is currently <br /> a desktop-based platform.
						</p>
						<p className="text-center text-base leading-[30px] text-white">
							Pakt is building the mobile version
							<br /> as we speak.
						</p>
					</div>
				</div>
				<Link href="http://pakt.world" target="_blank">
					<Image src="/images/pakt.png" alt="Pakt" width={100} height={39.42} />
				</Link>
			</div>
		</div>
	);
};
