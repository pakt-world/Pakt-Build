import Logger from "@/lib/utils/logger";
import { useEffect } from "react";

export const useScrollDetector = () => {
	useEffect(() => {
		const handleScroll = (event: Event) => {
			const target = event.target as HTMLElement | Document;

			if (target === document || target === document.documentElement || target === document.body) {
				Logger.info("Body is scrolling");
			} else {
				Logger.info(`Container is scrolling:`, target);
			}
		};

		// Add event listener for both the document and its containers
		document.addEventListener("scroll", handleScroll, { capture: true });

		return () => {
			document.removeEventListener("scroll", handleScroll, { capture: true });
		};
	}, []);
};
