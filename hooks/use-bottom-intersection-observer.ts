import { useEffect, useState, RefObject } from "react";

interface IntersectionObserverOptions {
	threshold?: number;
	action: () => void;
}

export const useBottomIntersectionObserver = (
	targetRef: RefObject<Element>,
	{ threshold = 0.5, action }: IntersectionObserverOptions
): boolean => {
	const [isAtBottom, setIsAtBottom] = useState(false);

	useEffect(() => {
		const currentTarget = targetRef.current;
		if (!currentTarget) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setIsAtBottom(true);
				} else {
					setIsAtBottom(false);
				}
			},
			{ threshold }
		);

		observer.observe(currentTarget);

		return () => {
			if (currentTarget) observer.unobserve(currentTarget);
		};
	}, [targetRef, threshold]);

	useEffect(() => {
		if (isAtBottom) {
			action();
		}
	}, [isAtBottom, action]);

	return isAtBottom;
};
