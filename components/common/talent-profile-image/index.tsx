/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import Link from "next/link";
import { FC, MouseEventHandler, useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { KnobCircle } from "./knob-circle";
import { Size } from "./types";

interface AfroScoreProps {
	size: Size;
	score: number;
	disabled?: boolean;
	url?: string;
}

type AfroProfileProps = Omit<AfroScoreProps, "children"> & {
	src?: string;
};

export const TalentProfile: FC<AfroProfileProps> = ({ size, score, src, url, disabled }) => {
	const [_score, _setScore] = useState(score);
	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		e.currentTarget.src = "/images/no-user.png?v=2";
	};

	const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		if (disabled) {
			e.preventDefault();
		}
	};

	useEffect(() => {
		if (score) _setScore(score);
	}, [score]);

	return (
		<div className="relative">
			<KnobCircle size={size} score={_score} disableDrag>
				<Link href={`${url}`} onClick={handleClick} className="relative block size-full cursor-pointer">
					{!url && !src ? (
						<Image
							src="/images/no-user.png?v=2"
							alt="empty"
							fill
							className="origin-center transform rounded-full"
							style={{ objectFit: "cover" }}
							onError={handleImageError}
							sizes="90vw"
							// placeholder="blur"
							// blurDataURL={blurDataURL}
						/>
					) : (
						<Image
							src={src || "/images/no-user.png?v=2"}
							alt="avatar"
							fill
							className="origin-center transform rounded-full"
							style={{ objectFit: "cover" }}
							onError={handleImageError}
							sizes="90vw"
							// placeholder="blur"
							// blurDataURL={blurDataURL}
						/>
					)}
				</Link>
			</KnobCircle>
		</div>
	);
};
