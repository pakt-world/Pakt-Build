import { connectors, chains, wagmi } from "@pakt/payment-module";
import { ENVS } from ".";

const { walletConnect } = connectors;
const { avalanche, avalancheFuji } = chains;
const { http, createConfig } = wagmi;

const transports = {
	[avalanche.id]: http(),
	[avalancheFuji.id]: http(),
};

const wagmiConfig = (projectId: string) => {
	if (!projectId) return null;

	return createConfig({
		chains: ENVS.isProduction ? [avalanche] : [avalancheFuji],
		connectors: [
			walletConnect({
				customStoragePrefix: "pakt-j",
				projectId: String(projectId),
				relayUrl: "wss://relay.walletconnect.org",
			}),
		],
		multiInjectedProviderDiscovery: true,
		transports,
	});
};

export default wagmiConfig;
