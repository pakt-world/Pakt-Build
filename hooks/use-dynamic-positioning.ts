import { useEffect, useRef, useState } from "react";
import { create } from "zustand";

interface UseDynamicPositionProps {
	offset?: number; // Optional offset to add/subtract from the measured height
	dimension?: "height" | "width"; // Choose whether to measure height or width
}

export const useDynamicPosition = <T extends HTMLDivElement>({
	offset = 0,
	dimension = "height",
}: UseDynamicPositionProps = {}) => {
	const ref = useRef<T>(null); // Reference to the DOM element
	const [size, setSize] = useState<number>(0); // State to store the measured size

	useEffect(() => {
		const updateSize = () => {
			if (ref.current) {
				const measuredSize = dimension === "height" ? ref.current.offsetHeight : ref.current.offsetWidth;
				setSize(measuredSize + offset); // Apply the offset
			}
		};

		updateSize();

		// Listen to resize events for dynamic updates
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, [dimension, offset]);

	return { ref, size }; // Return the ref and size
};

interface PositionStore {
	measuredSize: number;
	setMeasuredSize: (size: number) => void;
}

export const usePositionStore = create<PositionStore>((set) => ({
	measuredSize: 0,
	setMeasuredSize: (size) => set({ measuredSize: size }),
}));

// How to use

// Notify the store of the measured size
// useEffect(() => {
// 	setMeasuredSize(size);
// }, [size, setMeasuredSize]);
