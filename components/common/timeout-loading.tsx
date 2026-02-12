"use client";

import { ReactNode, useEffect, useState } from "react";

export default function TimedDefault({ children, defaultContent }: { children: ReactNode; defaultContent: ReactNode }) {
	const [showDefault, setShowDefault] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowDefault(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	if (showDefault) {
		return defaultContent;
	}

	return children;
}
