"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import "@pakt/payment-module/dist/styles.css";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
	return <>{children}</>;
}
