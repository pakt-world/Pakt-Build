/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { TelegramBotEvent } from "../enums";
import { useSettingState } from "../store/settings";
import { SystemSettings } from "./setting";

interface botPayload {
	event: TelegramBotEvent;
	data: {
		title: string;
		amount: string;
		dueDate: string | undefined;
		category: string;
		preferredSkills: string[];
		description: string;
		jobLink: string;
	};
}

interface TelegramBotResponse {}

async function postTelegramBot(params: botPayload): Promise<TelegramBotResponse> {
	const { settings } = useSettingState.getState();
	const { telegram_bot_api_url, telegram_bot_api_key } = settings as SystemSettings;
	const res = await axios.post(`${telegram_bot_api_url}/webhook`, params, {
		headers: {
			"x-api-key": telegram_bot_api_key,
		},
	});
	return res.data;
}

export function useTelegramBot(): UseMutationResult<unknown, ApiError, botPayload, unknown> {
	return useMutation({
		mutationFn: postTelegramBot,
		mutationKey: ["telegram-bot-notification"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
