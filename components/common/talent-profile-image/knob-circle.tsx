"use client";

import { Size, SizeMap } from "./types";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCircleKnob } from "./use-circle-knob";

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

const universalSizeVariants: SizeMap = {
	xs: 46, // Smallest size (e.g., Feed, Jobs, Job update on mobile)
	sm: 54, // Small size (e.g., Navbar, Leaderboard)
	md: 102, // Medium size (e.g., Dashboard Uncollapsed)
	lg: 142, // Large size (e.g., Sidebar, Applicants)
	xl: 193, // Extra large size (e.g., Talent listing, Talent Details)
};

interface SizeConfig {
	circleSize: number; // Diameter of the circle
	knobSize: number; // Diameter of the knob
	fontSize: number; // Font size for the knob text
	scale: number;
}

const SIZE_TO_CONFIG: Record<Size, SizeConfig> = {
	xs: {
		circleSize: universalSizeVariants.xs,
		knobSize: universalSizeVariants.xs * 0.3,
		fontSize: universalSizeVariants.xs * 0.2,
		scale: 1,
	},
	sm: {
		circleSize: universalSizeVariants.sm,
		knobSize: universalSizeVariants.sm * 0.3,
		fontSize: universalSizeVariants.sm * 0.2,
		scale: 1,
	},
	md: {
		circleSize: universalSizeVariants.md,
		knobSize: universalSizeVariants.md * 0.3,
		fontSize: universalSizeVariants.md * 0.2,
		scale: 1,
	},
	lg: {
		circleSize: universalSizeVariants.lg,
		knobSize: universalSizeVariants.lg * 0.3,
		fontSize: universalSizeVariants.lg * 0.2,
		scale: 0.8,
	},
	xl: {
		circleSize: universalSizeVariants.xl,
		knobSize: universalSizeVariants.xl * 0.3,
		fontSize: universalSizeVariants.xl * 0.2,
		scale: 0.8,
	},
};

interface KnobCircleProps {
	size: Size;
	score: number;
	children?: React.ReactNode;
	disableDrag?: boolean;
}

export const KnobCircle: React.FC<KnobCircleProps> = ({ size, children, score, disableDrag }) => {
	const { circleSize, knobSize, fontSize, scale } = SIZE_TO_CONFIG[size];
	const { position, percentage, handleStart, handleDrag, handleEnd, containerRef } = useCircleKnob({
		size: circleSize,
		initialPercentage: score,
		disableDrag,
	});

	const gradientAngle = (percentage / 100) * 360;

	const sizeClassMapping: { [key in Size]?: string } = {
		xs: "h-3 w-6 -translate-x-1/2 -translate-y-1/2 -right-4 top-3 text-[8px] rounded-[4px]",
		sm: "h-4 w-6 -translate-x-1/2 -translate-y-1/2 -right-4 top-4 text-[8px] rounded-[4px]",
		md: "h-[24px] w-10 -translate-x-1/2 -translate-y-1/2 -right-5 top-5 text-[10px] rounded-lg",
		lg: "h-[26px] w-11 -translate-x-1/2 -translate-y-1/2 -right-4 top-6 text-xs rounded-lg",
		xl: "h-[28px] w-14 -translate-x-1/2 -translate-y-1/2 -right-4 top-8 text-sm rounded-lg",
	};

	const sizeClass = sizeClassMapping[size as Size] || "";

	return (
		<div
			ref={containerRef}
			style={{
				position: "relative",
				width: circleSize,
				height: circleSize,
				borderRadius: "50%",
				backgroundImage: `conic-gradient(
				  from 180deg at 50% 50%,
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
				  )`,
				padding: circleSize * 0.1,
				boxSizing: "border-box",
				top: 0,
				left: 0,
			}}
		>
			{score === 0 && (
				<div
					className={`absolute !z-20 flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-400 text-white ${sizeClass}`}
				>
					<span className="text-center tracking-wide text-white">New</span>
				</div>
			)}
			<div
				style={{
					width: "100%",
					height: "100%",
					backgroundImage: `conic-gradient(
                      from 180deg at 50% 50%,
                      transparent ${gradientAngle}deg,
                      #E3E5E5 ${gradientAngle}deg
                    )`,
					borderRadius: "50%",
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					padding: circleSize * 0.1,
					margin: 0,
				}}
			/>
			{/* Inner circle */}
			<div
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: "#fff",
					borderRadius: "50%",
					position: "relative",
					top: 0.5,
				}}
			>
				{children}
			</div>
			{/* Knob */}
			<div
				className="knob_transform"
				onMouseDown={(e) => {
					e.preventDefault(); // Prevent text selection
					handleStart(e);
				}}
				onTouchStart={handleStart}
				onMouseMove={(e) => e.buttons === 1 && handleDrag(e)} // Drag when mouse is pressed
				onTouchMove={handleDrag}
				onMouseUp={handleEnd}
				onTouchEnd={handleEnd}
				style={{
					position: "absolute",
					width: knobSize,
					height: knobSize,
					backgroundColor: progressToColor(percentage),
					borderRadius: "50%",
					transform: `translate(-50%, -50%) scale(${scale})`,
					left: position.x,
					top: position.y,
					cursor: "pointer",
					display: score === 0 ? "none" : "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<p
					style={{
						fontSize,
					}}
					className="text-center font-bold text-white"
				>
					{`${Math.round(percentage)}`}
				</p>
			</div>
			{/* </div> */}
		</div>
	);
};
