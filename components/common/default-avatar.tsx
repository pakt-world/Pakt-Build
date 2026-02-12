import Image from "next/image";

export const DefaultAvatar = ({ className }: { className?: string }): JSX.Element => {
	return (
		<Image
			src="/icons/default-avatar.svg"
			alt="default-avatar"
			loading="lazy"
			width={173}
			height={173}
			className={`${className}`}
			// className={`sm:h-[136px] sm:w-[136px] ${className}`}
		/>
	);
};
