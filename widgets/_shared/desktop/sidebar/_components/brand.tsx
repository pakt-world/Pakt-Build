"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";

export const Brand = (): JSX.Element => {
	return (
		<div className="relative z-[2] mx-auto flex h-[41px] w-full origin-center scale-[0.85] items-center gap-2">
			<Image src="/images/pakt-build.png" alt="Logo" sizes="90vw" fill />
		</div>
	);
};
