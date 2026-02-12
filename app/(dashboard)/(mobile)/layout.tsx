"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
	return <div className="flex w-full flex-col">{children}</div>;
}
