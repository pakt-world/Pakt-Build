"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY, USER_KEY } from "@/lib/utils";
import { MessagingProvider } from "@/providers/socket-provider";
import { useLogoutConfirmationStore } from "@/lib/store/misc";
import SessionTimeoutAlert from "@/components/dialogs/session-timeout-alert";
import LogoutConfirmation from "@/components/dialogs/logout-confirmation";
import KycModal from "@/components/dialogs/kyc/modal";
import { useUserState } from "@/lib/store/account";
import { BrandLoader } from "@/components/common/brand-loader";
import { useSetToken } from "@/hooks/use-set-token";
import { useGetAccount } from "@/lib/api/account";
import { useLoginChecks } from "@/hooks/use-login-checks";

// Auth Modals
import ScrollToTopOnRouteChange from "@/components/common/scroll-to-top-on-route-change";
import OnboardingDialog from "@/widgets/authentication/desktop/onboarding";
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout";
import { AuthEnums } from "@/lib/enums";
import { MobileLeaderBoard } from "@/widgets/dashboard/mobile/leaderboard";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { useGetSetting } from "@/lib/api/setting";
import { clearStoredJobOnLogout } from "@/hooks/use-view-mode-redirect";
import MobileOnboardingHeader from "@/widgets/_shared/mobile/onboarding-header";
import Sidebar from "@/widgets/_shared/desktop/sidebar";
import { MobileHeader } from "@/widgets/_shared/mobile/header";
import { BottomNav } from "@/widgets/_shared/mobile/footer-nav";
import { JobActions } from "@/widgets/_shared/mobile/create-and-search-for-job";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
	const isClient = useIsClient();
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const { clearStore, setUser, user } = useUserState();
	const [isTokenReady, setIsTokenReady] = useState(false);

	const token = getCookie(AUTH_TOKEN_KEY);
	const userCookie = getCookie(USER_KEY) as string;

	const router = useRouter();
	const pathname = usePathname();

	const queryClient = useQueryClient();

	const { showLeaderBoard, setShowLeaderBoard } = useMobileContext();

	// === Logout confirmation === //
	const { setShowLogoutConfirmation } = useLogoutConfirmationStore();

	// === Inactivity Timeout === //
	const { getRemainingTime, isTimeoutModalOpen, showLogoutConfirmation, notLoggingOut, stayActive } =
		useInactivityTimeout();

	// === Logout === //
	const Logout = async (): Promise<void> => {
		setShowLogoutConfirmation(false);
		setUser(null);
		clearStore();
		deleteCookie(AUTH_TOKEN_KEY);
		deleteCookie(USER_KEY);
		clearStoredJobOnLogout();

		queryClient.clear();
		queryClient.removeQueries();
		queryClient.getMutationCache().clear();

		// Invalidate and refetch feed queries to reload the public feed
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["get-dashboard-timeline_1_10"] }),
			queryClient.refetchQueries({ queryKey: ["get-dashboard-timeline_1_10"], type: "active" }),
		]);
		router.push("/");
	};

	// Set the token asynchronously and mark as ready
	useSetToken({ token, setIsTokenSet: setIsTokenReady });

	// === Get Account === //
	const { isFetched: accountFetched, isFetching: accountFetching } = useGetAccount({
		enable: Boolean(token),
	});

	// === Get System Settings === //
	const { isFetched: settingsFetched, isFetching: settingsFetching } = useGetSetting({
		enable: Boolean(token),
	});

	// Determine if the hook should be enabled
	const enableRedirects = isTokenReady && accountFetched && Boolean(user);

	// Use the custom hook to handle redirects
	useLoginChecks(enableRedirects, userCookie);

	// Show loading indicator if fetching data
	if (!accountFetched && accountFetching && !settingsFetched && settingsFetching) {
		return <BrandLoader />;
	}

	if (!isClient || !user?._id) {
		return <BrandLoader />;
	}

	if (pathname === `/${AuthEnums.TERMS_AND_CONDITIONS}` || pathname === `/${AuthEnums.ONBOARDING}`) {
		return (
			<div className="w-full">
				<MobileOnboardingHeader />
				<main className="relative z-[2] mt-[70px] w-full bg-blue-lightest/30 px-4 sm:hidden">{children}</main>
			</div>
		);
	}

	return (
		<MessagingProvider>
			<>
				{isDesktop ? (
					<div className="flex size-full">
						<Sidebar />
						<div className="relative z-[2] w-full max-sm:flex max-sm:flex-col sm:h-full">
							<div className="absolute inset-0 !z-[1] size-full bg-product-bg bg-cover bg-center object-cover" />
							<main className="relative !z-20 w-full flex-1 sm:size-full sm:pt-5">{children}</main>
						</div>
						{/* == Sign Up == */}
						<OnboardingDialog />
					</div>
				) : (
					<ScrollToTopOnRouteChange>
						<div className={`w-full ${!pathname.startsWith("/messages/") && "h-full"}`}>
							<div className="absolute inset-0 !z-[1] size-full bg-product-bg bg-cover bg-center object-cover" />
							<MobileHeader />
							<main
								className={`relative z-[2] w-full flex-1 ${!pathname.startsWith("/messages/") && "!top-[70px] bottom-[64px] h-[calc(100%-134px)]"}`}
							>
								{children}
							</main>
							<BottomNav />
							<JobActions />
							{pathname === "/dashboard" && (
								<MobileLeaderBoard
									setLeaderboardView={setShowLeaderBoard}
									leaderboardView={showLeaderBoard}
								/>
							)}
						</div>
					</ScrollToTopOnRouteChange>
				)}
				{/* Modals */}
				<SessionTimeoutAlert
					isTimeoutModalOpen={isTimeoutModalOpen}
					getRemainingTime={getRemainingTime}
					stayActive={stayActive}
					Logout={Logout}
				/>
				<LogoutConfirmation
					showLogoutConfirmation={showLogoutConfirmation}
					stayActive={notLoggingOut}
					Logout={Logout}
				/>
				<KycModal />
			</>
		</MessagingProvider>
	);
}
