import Image from "next/image";

interface BadgeProps {
	title?: string;
	value?: string;
	total?: string;
	textColor?: string;
	bgColor?: string;
	// type?: string;
}

export const Badge = ({
	title = "",
	value = "",
	total = "0",
	textColor = "",
	bgColor = "",
	// type = "",
}: BadgeProps): JSX.Element => {
	const lockedBadge = title === "Referral" || title === "Squad";

	return (
		<div
			className="flex w-full flex-col justify-center rounded-lg border py-1 text-center text-base"
			style={{
				color: textColor,
				background: bgColor,
				borderColor: textColor,
			}}
		>
			{lockedBadge ? (
				<Image src="/images/lock.png" height={50} width={50} alt="locked" className="mx-auto" />
			) : (
				<div className="mx-auto flex flex-col">
					<p className="border-b" style={{ borderColor: textColor }}>
						{value}
					</p>
					<p>{total}</p>
				</div>
			)}
			<p className="text-xs 1xl:text-sm">{!lockedBadge && title}</p>
		</div>
	);
};
