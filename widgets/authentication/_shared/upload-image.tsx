"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UploadProfileImage } from "@/components/common/upload-profile-image";

export function UploadImage({ isOnboarding }: { isOnboarding?: boolean }): JSX.Element {
	return <UploadProfileImage isOnboarding={isOnboarding} />;
}
