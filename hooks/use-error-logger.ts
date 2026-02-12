import Logger from "@/lib/utils/logger";
import { useEffect } from "react";

export function useErrorLogger() {
	useEffect(() => {
		const handleError = (event: ErrorEvent) => {
			Logger.error(event.message, {
				message: event.message,
				stack: event.error?.stack || "No stack trace",
				url: window.location.href,
			});
		};

		const handlePromiseRejection = (event: PromiseRejectionEvent) => {
			Logger.error(event.reason?.message, {
				message: event.reason?.message || "Unhandled Promise Rejection",
				stack: event.reason?.stack || "No stack trace",
				url: window.location.href,
			});
		};

		window.addEventListener("error", handleError);
		window.addEventListener("unhandledrejection", handlePromiseRejection);

		return () => {
			window.removeEventListener("error", handleError);
			window.removeEventListener("unhandledrejection", handlePromiseRejection);
		};
	}, []);
}
