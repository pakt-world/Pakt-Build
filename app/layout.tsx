/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import "./styles.css";
import "pakt-ui/styles.css";

import localFont from "next/font/local";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import Script from "next/script";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Providers } from "@/providers";

export const metadata: Metadata = {
	title: "Find work, earn crypto. Create jobs, pay in crypto.",
	description: "All transactions on-chain. Welcome to the future of trusted collaboration.",
};

interface Props {
	children: ReactNode;
}

/* istanbul ignore next */
const circularStd = localFont({
	src: [
		{
			path: "../fonts/CircularStd-Book.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../fonts/CircularStd-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../fonts/CircularStd-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--circular-std-font",
});

export default function RootLayout({ children }: Props): JSX.Element {
	return (
		<html lang="en" suppressHydrationWarning className="scrollbar-hide">
			<Script
				type="module"
				src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/zoomies.js"
				defer
				rel="preload"
				crossOrigin="anonymous"
			/>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, height=device-height, maximum-scale=1, user-scalable=no, interactive-widget=overlays-content, viewport-fit=cover, shrink-to-fit=no"
				/>
			</head>

			<body className={`${circularStd.variable} scrollbar-hide font-sans antialiased `}>
				<Providers>
					<Toaster position="top-right" gutter={8} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
