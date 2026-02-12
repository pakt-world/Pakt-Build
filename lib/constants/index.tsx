/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { LayoutDashboard, Users, LayoutList, Wallet, MessageSquare, Settings } from "lucide-react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AchievementType, FeedType } from "../enums";
import { AchievementProps, EmptyAchievementProps } from "../types/talents";

export const AUTH_METHOD = [
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M23.52 12.2729C23.52 11.422 23.4436 10.6038 23.3018 9.81836H12V14.4602H18.4582C18.18 15.9602 17.3345 17.2311 16.0636 18.082V21.0929H19.9418C22.2109 19.0038 23.52 15.9274 23.52 12.2729Z"
					fill="#4285F4"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12 23.9998C15.24 23.9998 17.9564 22.9252 19.9418 21.0925L16.0636 18.0816C14.9891 18.8016 13.6145 19.2271 12 19.2271C8.87455 19.2271 6.22909 17.1161 5.28546 14.2798H1.27637V17.3889C3.25091 21.3107 7.30909 23.9998 12 23.9998Z"
					fill="#34A853"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M5.28545 14.2799C5.04545 13.5599 4.90909 12.7908 4.90909 11.9999C4.90909 11.209 5.04545 10.4399 5.28545 9.71993V6.61084H1.27636C0.463636 8.23084 0 10.0636 0 11.9999C0 13.9363 0.463636 15.769 1.27636 17.389L5.28545 14.2799Z"
					fill="#FBBC05"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12 4.77273C13.7618 4.77273 15.3436 5.37818 16.5873 6.56727L20.0291 3.12545C17.9509 1.18909 15.2345 0 12 0C7.30909 0 3.25091 2.68909 1.27637 6.61091L5.28546 9.72C6.22909 6.88364 8.87455 4.77273 12 4.77273Z"
					fill="#EA4335"
				/>
			</svg>
		),
		method: "Google",
	},
	// {
	// 	icon: (
	// 		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	// 			<g clip-path="url(#clip0_13532_3235)">
	// 				<path
	// 					fill-rule="evenodd"
	// 					clip-rule="evenodd"
	// 					d="M11.9642 0C5.34833 0 0 5.5 0 12.3042C0 17.7432 3.42686 22.3472 8.18082 23.9767C8.77518 24.0992 8.9929 23.712 8.9929 23.3862C8.9929 23.101 8.97331 22.1232 8.97331 21.1045C5.64514 21.838 4.95208 19.6378 4.95208 19.6378C4.41722 18.2118 3.62473 17.8452 3.62473 17.8452C2.53543 17.0915 3.70408 17.0915 3.70408 17.0915C4.91241 17.173 5.54645 18.3545 5.54645 18.3545C6.61592 20.2285 8.33926 19.699 9.03257 19.373C9.13151 18.5785 9.44865 18.0285 9.78539 17.723C7.13094 17.4377 4.33812 16.3785 4.33812 11.6523C4.33812 10.3078 4.81322 9.20775 5.56604 8.35225C5.44727 8.04675 5.03118 6.7835 5.68506 5.09275C5.68506 5.09275 6.69527 4.76675 8.97306 6.35575C9.94827 6.08642 10.954 5.9494 11.9642 5.94825C12.9744 5.94825 14.0042 6.091 14.9552 6.35575C17.2332 4.76675 18.2434 5.09275 18.2434 5.09275C18.8973 6.7835 18.481 8.04675 18.3622 8.35225C19.1349 9.20775 19.5904 10.3078 19.5904 11.6523C19.5904 16.3785 16.7976 17.4172 14.1233 17.723C14.5592 18.11 14.9353 18.8433 14.9353 20.0045C14.9353 21.6545 14.9158 22.9788 14.9158 23.386C14.9158 23.712 15.1337 24.0992 15.7278 23.977C20.4818 22.347 23.9087 17.7432 23.9087 12.3042C23.9282 5.5 18.5603 0 11.9642 0Z"
	// 					fill="#24292F"
	// 				/>
	// 			</g>
	// 			<defs>
	// 				<clipPath id="clip0_13532_3235">
	// 					<rect width="24" height="24" fill="white" />
	// 				</clipPath>
	// 			</defs>
	// 		</svg>
	// 	),
	// 	method: "Github",
	// },
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M4 5C3.45228 5 3 5.45228 3 6V18C3 18.5477 3.45228 19 4 19H20C20.5477 19 21 18.5477 21 18V6C21 5.45228 20.5477 5 20 5H4ZM1 6C1 4.34772 2.34772 3 4 3H20C21.6523 3 23 4.34772 23 6V18C23 19.6523 21.6523 21 20 21H4C2.34772 21 1 19.6523 1 18V6Z"
					fill="black"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M1.18085 5.42662C1.49757 4.97417 2.1211 4.86414 2.57355 5.18085L12.0001 11.7794L21.4266 5.18085C21.8791 4.86414 22.5026 4.97417 22.8193 5.42662C23.136 5.87907 23.026 6.5026 22.5735 6.81932L12.5735 13.8193C12.2292 14.0603 11.7709 14.0603 11.4266 13.8193L1.42662 6.81932C0.974174 6.5026 0.864139 5.87907 1.18085 5.42662Z"
					fill="black"
				/>
			</svg>
		),
		method: "Email",
	},
];

export const SETTING_CONSTANTS = {
	ALLOW_SIGN_ON_INVITE_ONLY: "allow_sign_on_invite_only",
};

export const emptyAchievementStyle: EmptyAchievementProps[] = [
	{
		id: AchievementType.REVIEW,
		title: "Review",
		total: "60",
		textColor: "#A05E03",
		bgColor: "#FFEFD7",
	},
	{
		id: AchievementType.FIVE_STAR,
		title: "5 Star Jobs",
		total: "10",
		textColor: "#198155",
		bgColor: "#ECFCE5",
	},
	{
		id: AchievementType.REFERRAL,
		title: "Referral",
		total: "20",
		textColor: "#0065D0",
		bgColor: "#C9F0FF",
	},
	{
		id: AchievementType.SQUAD,
		title: "Squad",
		total: "10",
		textColor: "#D3180C",
		bgColor: "#FFE5E5",
	},
];

export const EMPTY_ACHIEVEMENTS: AchievementProps[] = [
	{
		_id: "",
		owner: "",
		type: AchievementType.REVIEW,
		total: "60",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},
	{
		_id: "",
		owner: "",
		type: AchievementType.FIVE_STAR,
		total: "10",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},
	{
		_id: "",
		owner: "",
		type: AchievementType.REFERRAL,
		total: "20",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},

	{
		_id: "",
		owner: "",
		type: AchievementType.SQUAD,
		total: "10",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},
];

const randomNumber = Math.floor(Math.random() * 1000000);

export const CREATE_JOB_TEMPLATE = {
	title: `Edge Case Test Analysis Bot - ${randomNumber}`,
	budget: 300,
	due: new Date(new Date().setDate(new Date().getDate() + 14)),
	firstSkill: "React",
	secondSkill: "Node",
	thirdSkill: "TypeScript",
	description: "Job Creation Test Analysis steps",
	deliverables: [
		"Create a Job",
		"Complete the Job Deliverables",
		"Submit the Job",
		"Review a Talent",
		"Complete the Job",
	],
	category: "engineering",
	visibility: "public",
	coin: {
		_id: "66f19ae3d06462bd20202884",
		name: "USDC",
		symbol: "USDC",
		icon: "https://chainsite-storage.s3.amazonaws.com/icons/usdc.svg",
		reference: "usdc",
		contractAddress: "0x5425890298aed601595a70AB815c96711a31Bc65",
		decimal: "6",
		isToken: true,
		rpcChainId: "43113",
		active: true,
		createdAt: "2024-09-23T16:44:19.669Z",
		updatedAt: "2024-09-23T16:44:19.669Z",
		__v: 0,
	},
};
// defaultValues: {
// 			title: CREATE_JOB_TEMPLATE.title, //+
// 			budget: CREATE_JOB_TEMPLATE.budget, //+
// 			due: CREATE_JOB_TEMPLATE.due, //+
// 			firstSkill: CREATE_JOB_TEMPLATE.firstSkill, //+
// 			secondSkill: CREATE_JOB_TEMPLATE.secondSkill, //+
// 			thirdSkill: CREATE_JOB_TEMPLATE.thirdSkill, //+
// 			description: CREATE_JOB_TEMPLATE.description, //+
// 			deliverables: CREATE_JOB_TEMPLATE.deliverables, //+
// 			category: {
// 				value: CREATE_JOB_TEMPLATE.category,
// 				label: sentenceCase(CREATE_JOB_TEMPLATE.category),
// 			},
// 			visibility: {
// 				value: CREATE_JOB_TEMPLATE.visibility,
// 				label: sentenceCase(CREATE_JOB_TEMPLATE.visibility),
// 			},
// 			coin: CREATE_JOB_TEMPLATE.coin, //+
// 		},

export const LINKS = [
	{
		href: "/dashboard",
		icon: <LayoutDashboard size={20} />,
		label: "Dashboard",
	},
	{
		href: "/jobs",
		icon: <LayoutList size={20} />,
		label: "Jobs",
	},
	{
		href: "/talents",
		icon: <Users size={20} />,
		label: "Talents",
	},
	{
		href: "/wallet",
		icon: <Wallet size={20} />,
		label: "Wallet",
	},
	{
		href: "/messages",
		icon: <MessageSquare size={20} />,
		label: "Messages",
	},
	{
		href: "",
		icon: <Image src="/images/pakt-logo.png" alt="pakt" width={20} height={20} />,
		label: "Pakt.world",
	},
	{
		href: "/settings",
		icon: <Settings size={20} />,
		label: "Settings",
	},
];

export interface ILeaderboard {
	_id: number | string;
	name: string;
	image: string;
	score: number;
	position: number;
	isUpdated?: boolean;
	prevIndex?: number;
	currentIndex?: number;
	previousPosition?: number;
}

export const HOMEPAGE_LEADERBOARD: ILeaderboard[] = [
	{
		_id: 1,
		name: "Jeremiah Olayiwola",
		image: "/images/leaderboard/8.png",
		score: 100,
		position: 1,
	},
	{
		_id: 2,
		name: "Joshua Akinsuyi",
		image: "/images/leaderboard/6.png",
		score: 70,
		position: 2,
	},
	{
		_id: 3,
		name: "Paul Taiwo",
		image: "/images/leaderboard/9.png",
		score: 60,
		position: 3,
	},
	{
		_id: 4,
		name: "Bob Brown",
		image: "/images/leaderboard/4.png",
		score: 85,
		position: 4,
	},
	{
		_id: 5,
		name: "Charlie Davis",
		image: "/images/leaderboard/5.png",
		score: 80,
		position: 5,
	},
	{
		_id: 6,
		name: "Diana Evans",
		image: "/images/leaderboard/2.png",
		score: 75,
		position: 6,
	},
	{
		_id: 7,
		name: "Frank Green",
		image: "/images/leaderboard/7.png",
		score: 70,
		position: 7,
	},
	{
		_id: 8,
		name: "Grace Harris",
		image: "/images/leaderboard/1.png",
		score: 65,
		position: 8,
	},
	{
		_id: 9,
		name: "Henry Lee",
		image: "/images/leaderboard/3.png",
		score: 60,
		position: 9,
	},
	{
		_id: 10,
		name: "Ivy Martinez",
		image: "/images/leaderboard/10.png",
		score: 55,
		position: 10,
	},
];

export const ACTIVE_FEED_TYPES = [
	FeedType.JOB_DELIVERABLE_UPDATE,
	FeedType.JOB_APPLICATION_SUBMITTED,
	FeedType.JOB_CANCELLED,
	FeedType.JOB_COMPLETION,
	FeedType.JOB_INVITATION_ACCEPTED,
	FeedType.JOB_INVITATION_DECLINED,
	FeedType.JOB_INVITATION_RECEIVED,
	FeedType.PUBLIC_JOB_CREATED,
	FeedType.PUBLIC_JOB_FILLED,
	FeedType.JOB_PAYMENT_RELEASED,
].join(",");
