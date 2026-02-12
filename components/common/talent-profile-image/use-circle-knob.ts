import { useState, useCallback, useRef } from "react";

interface UseCircleKnobProps {
	size: number; // Diameter of the circle in pixels
	initialPercentage?: number; // Initial knob position (1-100%)
	disableDrag?: boolean; // Disable dragging
}

interface Position {
	x: number;
	y: number;
}

export const useCircleKnob = ({ size, initialPercentage = 0, disableDrag = false }: UseCircleKnobProps) => {
	const [percentage, setPercentage] = useState(initialPercentage);
	const containerRef = useRef<HTMLDivElement>(null);
	const initialAngleRef = useRef<number | null>(null);

	const borderSize = size * 0.08; // Border size (8% of circle diameter)
	// Calculate knob position based on percentage
	const calculatePosition = useCallback(
		(percentage: number): Position => {
			const angle = (percentage / 100) * 360 + 90; // Convert percentage to angle
			const radians = (Math.PI / 180) * angle; // Convert angle to radians
			const radius = size / 2 - borderSize / 2; // Adjust for border thickness

			const x = radius * Math.cos(radians) + size / 2;
			const y = radius * Math.sin(radians) + size / 2;
			return { x, y };
		},
		[borderSize, size]
	);

	const handleStart = useCallback(
		(event: React.MouseEvent | React.TouchEvent) => {
			if (disableDrag || !containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const clientX =
				"touches" in event && event.touches && event.touches[0]
					? event.touches[0].clientX
					: (event as React.MouseEvent).clientX;
			const clientY =
				"touches" in event && event.touches && event.touches[0]
					? event.touches[0].clientY
					: (event as React.MouseEvent).clientY;
			const dx = clientX - centerX;
			const dy = clientY - centerY;

			// Calculate initial angle
			initialAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
		},
		[disableDrag]
	);

	// Handle knob dragging
	const handleDrag = useCallback(
		(event: React.MouseEvent<Element> | React.TouchEvent<Element>) => {
			if (disableDrag || !containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const clientX =
				"touches" in event && event.touches && event.touches[0]
					? event.touches[0].clientX
					: (event as React.MouseEvent).clientX;
			const clientY =
				"touches" in event && event.touches && event.touches[0]
					? event.touches[0].clientY
					: (event as React.MouseEvent).clientY;

			const dx = clientX - centerX;
			const dy = clientY - centerY;

			// Calculate current angle
			let currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);

			// If we have an initial angle, calculate the difference
			if (initialAngleRef.current !== null) {
				let angleDiff = currentAngle - initialAngleRef.current;

				// Normalize the angle difference to be between -180 and 180 degrees
				if (angleDiff > 180) {
					angleDiff -= 360;
				} else if (angleDiff < -180) {
					angleDiff += 360;
				}

				// Calculate new percentage based on angle difference
				const newPercentage = Math.min(100, Math.max(0, percentage + (angleDiff / 360) * 100));

				setPercentage(newPercentage);
			}

			// Update initial angle for next drag
			initialAngleRef.current = currentAngle;
		},
		[disableDrag, percentage]
	);

	const handleEnd = useCallback(() => {
		if (disableDrag) return;
		initialAngleRef.current = null;
	}, [disableDrag]);

	const position = calculatePosition(percentage);

	return { position, percentage, handleStart, handleDrag, handleEnd, containerRef };
};
