import Image from "next/image";
import Link from "next/link";
import React from "react";

export const PoweredByPakt = ({ className }: { className?: string }) => {
	return (
		<Link
			href="https://pakt.world"
			target="_blank"
			className={`flex cursor-pointer items-center text-title ${className}`}
		>
			<p className="text-base">Powered by</p> <Image width={92} height={36} alt="Pakt" src="/images/pakt.png" />
		</Link>
	);
};
