/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, MouseEventHandler, useEffect, useId, useRef, useState } from "react";
import { arc } from "d3-shape";
import Image from "next/image";
import Link from "next/link";
import { useIsClient } from "usehooks-ts";

type Size = "sm" | "2sm" | "md" | "2md" | "minLg" | "lg" | "xl" | "2xl" | "3xl";

const SIZE_TO_PX: Record<Size, number> = {
	sm: 60,
	"2sm": 89,
	md: 110,
	"2md": 130,
	"minLg": 130,
	lg: 150,
	xl: 180,
	"2xl": 200,
	"3xl": 220,
};

interface AfroScoreProps {
	size: Size;
	score: number;
	children?: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
	disabled?: boolean;
	url?: string;
	isSidebar?: boolean;
}

const progressToColor = (progress: number): string => {
	if (progress <= 24) {
		return "#fa0832";
	}
	if (progress <= 49) {
		return "#ffbf04";
	}
	if (progress <= 79.9) {
		return "#649ff9";
	}
	return "#17a753";
};

export const AfroScore: FC<AfroScoreProps> = ({
	size,
	score,
	children,
	style,
	className,
	url = "",
	disabled,
	isSidebar,
}) => {
	const [currentScore, setCurrentScore] = useState(score);
	const isClient = useIsClient();
	const id = useId();
	const svgRef = useRef<SVGSVGElement>(null);
	const sizeInPx = SIZE_TO_PX[size];
	const thickness = sizeInPx / 11;
	const knobRadius = thickness * 1.2;
	const radius = (sizeInPx - thickness) / 2;

	const progressAngle = (currentScore / 100) * 2 * Math.PI;

	const bgArcGenerator = arc()
		.startAngle(0)
		.outerRadius(radius)
		.endAngle(2 * Math.PI)
		.innerRadius(radius - thickness);

	const progressArcGenerator = arc()
		.startAngle(0)
		.outerRadius(radius)
		.endAngle(progressAngle)
		.innerRadius(radius - thickness)
		.cornerRadius(666);

	// @ts-ignore
	const bgArcPath = bgArcGenerator();
	// @ts-expect-error Expects 1 arguments, but got 0.
	const progressArcPath = progressArcGenerator();

	// Add a knob to the progress arc
	const knobX = (radius - thickness / 2) * Math.cos(progressAngle - Math.PI / 2);
	const knobY = (radius - thickness / 2) * Math.sin(progressAngle - Math.PI / 2);

	const [knobPosition, setKnobPosition] = useState({ x: knobX, y: knobY });

	// const onDrag = (event: MouseEvent): void => {
	//     if (!svgRef.current) return;
	//     const svgRect = svgRef.current.getBoundingClientRect();

	//     const newKnobPosition = {
	//         x: event.clientX - svgRect.left - radius,
	//         y: event.clientY - svgRect.top - radius,
	//     };

	//     setKnobPosition(newKnobPosition);

	//     // Calculate the new score based on the knob position
	//     const angle = Math.atan2(newKnobPosition.y, newKnobPosition.x);
	//     const newScore = (((angle + Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 100;
	//     setScore(newScore);
	// };

	const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
		if (disabled) {
			e.preventDefault();
		}
	};

	const sizeClassMapping: { [key in Size]?: string } = {
		lg: `!-right-2 scale-95 ${isSidebar ? "scale-85" : ""}`,
		"2md": "scale-85 !-right-4",
		md: "!-right-4 scale-75",
		sm: "!-right-8 scale-[0.6]",
		xl: "!-right-2 scale-95",
		"2xl": "!right-16 scale-95",
	};

	const sizeClass = sizeClassMapping[size as Size] || "";

	useEffect(() => {
		setCurrentScore(score);
	}, [score]);

	useEffect(() => {
		setKnobPosition({ x: knobX, y: knobY });
	}, [knobX, knobY]);

	return (
		isClient && (
			<Link href={url} onClick={handleClick}>
				<div className={`relative flex items-center justify-center rounded-full ${className}`} style={style}>
					{currentScore === 0 && (
						<div
							className={`absolute right-0 top-[30%] !z-20 flex h-[26px] w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center
							rounded-lg bg-gradient-to-r from-emerald-600 to-teal-400 text-white ${sizeClass}`}
						>
							<span className="text-center text-xs leading-[18px] tracking-wide text-white">New</span>
						</div>
					)}
					<div
						style={{
							height: radius * 2,
							width: radius * 2,
							borderRadius: "666",
							overflow: "hidden",
							position: "absolute",
						}}
					>
						{children}
					</div>
					<svg
						ref={svgRef}
						width={sizeInPx + knobRadius}
						height={sizeInPx + knobRadius}
						viewBox={`0 0 ${sizeInPx + knobRadius} ${sizeInPx + knobRadius}`}
						style={{
							transform: "rotate(180deg)",
						}}
					>
						<style type="text/css">
							{`
            .progress-gradient {
              background-image: conic-gradient(
                from 0deg at 50% 50%,
                #fc2533,
                #fc2533,
                #ffc005,
                #ffc005,
                #ffc005,
                #649ff9,
                #649ff9,
                #649ff9,
                #04a82a,
                #04a82a
              );
            }

          `}
						</style>

						<g transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}>
							<clipPath id={id}>
								<path
									d={progressArcPath}
									transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
								/>
							</clipPath>
							<path d={bgArcPath} fill="#E3E5E5" />
						</g>
						<foreignObject
							x="0"
							y="0"
							width={sizeInPx + knobRadius}
							height={sizeInPx + knobRadius}
							clipPath={`url(#${id})`}
						>
							<div
								className="progress-gradient"
								style={{
									width: sizeInPx + knobRadius,
									height: sizeInPx + knobRadius,
									borderRadius: 999,
								}}
							/>
						</foreignObject>

						{/* KNOB */}
						{score !== 0 && (
							<g className="cursor-grab">
								<circle
									style={{
										display: score === 0 ? "none" : "block",
									}}
									// onMouseDown={(e) => {
									//   e.preventDefault();
									//   Logger.info('mouse down');
									//   window.addEventListener('mousemove', onDrag);
									//   window.addEventListener('mouseup', () => {
									//     window.removeEventListener('mousemove', onDrag);
									//   });
									// }}
									cx={knobPosition.x}
									cy={knobPosition.y}
									r={knobRadius * 1.2}
									fill={progressToColor(score)}
									transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
								/>
								<text
									className="select-none"
									style={{
										display: score === 0 ? "none" : "block",
									}}
									x={knobPosition.x + (sizeInPx + knobRadius) / 2}
									y={knobPosition.y + (sizeInPx + knobRadius) / 2}
									dy=".3em"
									textAnchor="middle"
									fill="white"
									fontWeight={700}
									transform={`rotate(180, ${knobPosition.x + (sizeInPx + knobRadius) / 2}, ${
										knobPosition.y + (sizeInPx + knobRadius) / 2
									})`}
									fontSize={Math.round(sizeInPx / 8)}
								>
									{`${Math.round(score)}`}
								</text>
							</g>
						)}
					</svg>
				</div>
			</Link>
		)
	);
};

type AfroProfileProps = Omit<AfroScoreProps, "children"> & {
	src?: string;
};

export const TalentProfile: FC<AfroProfileProps> = ({
	size,
	score,
	src,
	url,
	style,
	className,
	disabled,
	isSidebar,
}) => {
	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		e.currentTarget.src = "/images/no-user.png?v=2";
	};

	return (
		<AfroScore
			score={score}
			size={size}
			disabled={disabled}
			style={style}
			url={url}
			className={className}
			isSidebar={isSidebar}
		>
			{!url && !src ? (
				<Image
					src="/images/no-user.png?v=2"
					alt="empty"
					fill
					className="origin-center scale-[0.85] transform rounded-full"
					style={{ objectFit: "cover" }}
				/>
			) : (
				<Image
					src={src || "/images/no-user.png?v=2"}
					alt="avatar"
					fill
					className="origin-center scale-[0.85] transform rounded-full"
					style={{ objectFit: "cover" }}
					onError={handleImageError}
				/>
			)}
		</AfroScore>
	);
};
