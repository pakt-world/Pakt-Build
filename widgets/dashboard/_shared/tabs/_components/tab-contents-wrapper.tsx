"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";

import { useBottomIntersectionObserver } from "@/hooks/use-bottom-intersection-observer";
import { useMobileContext } from "@/providers/mobile-context-provider";

interface TabContentsWrapperProps {
	children: ReactNode;
	className?: string;
	onScroll?: () => void;
}

export const TabContentWrapper = forwardRef<HTMLDivElement, TabContentsWrapperProps>(
	({ children, className, onScroll }, ref): JSX.Element => {
		return (
			<div
				ref={ref}
				onScroll={onScroll} // Detect scroll within this container
				style={{ touchAction: "pan-y" }} // Enable touch scrolling
				className={`scrollbar-hide smooth relative h-full w-full overflow-x-hidden pb-16 sm:pl-4 sm:pr-4 sm:pt-1 sm:shadow [&:last]:mb-0
					[&>*]:mb-0 sm:[&>*]:mb-4 ${className}`}
			>
				{children}
			</div>
		);
	}
);

TabContentWrapper.displayName = "TabContentWrapper";

export const ScrollContentWithObserver = ({
	onTopReach,
	onScrollPastThreshold,
	onBottomReach,
	children,
	className,
	threshold = 100, // Default scroll threshold to trigger onScrollPastThreshold
}: {
	onTopReach: () => void;
	onScrollPastThreshold: () => void;
	onBottomReach: () => void;
	children: React.ReactNode;
	className?: string;
	threshold?: number; // Default scroll threshold to trigger onScrollPastThreshold
}): JSX.Element => {
	const bottomRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [hasReachedBottom, setHasReachedBottom] = useState(false);
	const [hasReachedTop, setHasReachedTop] = useState(false);
	const { setIsAtTop, isScrolling, setIsScrolling } = useMobileContext();

	const isAtBottom = useBottomIntersectionObserver(bottomRef, {
		threshold: 0.1,
		action: () => {
			// Trigger only if it hasn't already been called and user has scrolled
			if (!hasReachedBottom) {
				onBottomReach();
				setHasReachedBottom(true); // Set flag to true after the action is triggered
			}
		},
	});

	// Reset flag when the user scrolls away from the bottom
	const handleScroll = () => {
		const scrollTop = containerRef.current?.scrollTop || 0;

		// Start detecting scrolling
		if (!isScrolling) {
			setIsScrolling(true);
		}

		// Clear the previous timeout
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}

		// Set a new timeout to detect when scrolling stops
		scrollTimeoutRef.current = setTimeout(() => {
			setIsScrolling(false);
		}, 200); // Adjust the timeout duration as needed

		// Check if the user is at the top of the container
		if (scrollTop === 0 && !hasReachedTop) {
			setHasReachedTop(true);
			onTopReach();
		} else if (scrollTop !== 0 && hasReachedTop) {
			setHasReachedTop(false);
		}

		// Check if the user has scrolled past the threshold
		if (scrollTop > threshold) {
			setIsAtTop(false);
			onScrollPastThreshold(); // Trigger if user scrolls past the threshold
		} else {
			setIsAtTop(true);
		}

		if (!isAtBottom && hasReachedBottom) {
			setHasReachedBottom(false); // Allow triggering on reaching bottom again
		}
	};

	useEffect(() => {
		return () => {
			// Clean up the timeout on component unmount
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, []);

	return (
		<TabContentWrapper onScroll={handleScroll} className={className} ref={containerRef}>
			{children}
			{/* Target element for bottom intersection */}
			<div ref={bottomRef} className="h-1" />
		</TabContentWrapper>
	);
};
