"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ReactElement } from "react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_METHOD } from "@/lib/constants";
import { AuthEnums } from "@/lib/enums";
import { useGetParams } from "@/hooks/use-get-params";

interface MethodWrapperProps {
	icon: ReactElement;
	method: string;
	onClick: () => void;
	isLogin: boolean;
}
const MethodWrapper = ({ icon, method, onClick, isLogin }: MethodWrapperProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex h-14 w-full items-center justify-center gap-4 overflow-hidden rounded-[10px] border-2 border-slate-200
				bg-white p-4"
		>
			<div data-svg-wrapper className="relative">
				{icon}
			</div>
			<div className="text-base font-medium leading-normal text-slate-800">
				{isLogin ? "Log in" : "Sign up"} with {method}
			</div>
		</button>
	);
};

interface AuthOptionsProps {
	instruction: string;
	google: () => void;
	github: () => void;
	email: () => void;
}

export const AuthOptions = ({ instruction, google, github, email }: AuthOptionsProps) => {
	const auth = useGetParams("auth");
	const isMobile = useMediaQuery("(max-width: 640px)");
	const isLogin = auth === "signin_method";
	return (
		<div className="flex w-full flex-col items-center justify-center gap-4 rounded-3xl bg-white p-6">
			<h3 className="text-xl leading-[30px] tracking-tight text-[#1f2739]">{instruction}</h3>
			{AUTH_METHOD.map((method) => {
				const actions = () => {
					switch (method.method) {
						case "Google":
							// TODO: Implement Google authentication
							google();
							break;
						case "Github":
							// TODO: Implement Github authentication
							github();
							break;
						case "Email":
							email();
							// TODO: Implement email verification
							break;
						default:
							break;
					}
				};
				return (
					<MethodWrapper
						key={method.method}
						icon={method.icon}
						method={method.method}
						onClick={actions}
						isLogin={isLogin}
					/>
				);
			})}
			<div className="inline-flex h-5 items-start justify-center gap-1">
				<div className="text-sm font-medium leading-tight text-[#1f2739]">
					{isLogin ? "Don't have an account?" : "Already have an account?"}
				</div>
				<Link
					href={
						isLogin
							? isMobile
								? `/${AuthEnums.SIGNUP}`
								: `/?auth=${AuthEnums.SIGNUP}`
							: isMobile
								? `/${AuthEnums.LOGIN}`
								: `/?auth=${AuthEnums.LOGIN}`
					}
					className="text-sm font-bold leading-tight text-[#3055b3]"
				>
					{isLogin ? "Sign up" : "Login"}
				</Link>
			</div>
		</div>
	);
};

interface AuthMethodProps {
	title: string;
	description: string;
	instruction: string;
	google: () => void;
	github: () => void;
	email: () => void;
}

export const AuthMethod = ({ title, description, instruction, google, github, email }: AuthMethodProps) => {
	return (
		<div className="z-[2] flex w-full items-center sm:mx-auto sm:size-full">
			<div className="flex size-full flex-col items-center justify-center gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h3 className="font-sans text-2xl font-bold text-title sm:text-3xl sm:text-white">{title}</h3>
					<p className="w-[392px] text-center text-base font-medium leading-normal tracking-tight text-body sm:text-white">
						{description}
					</p>
				</div>
				<AuthOptions instruction={instruction} google={google} github={github} email={email} />
			</div>
		</div>
	);
};
