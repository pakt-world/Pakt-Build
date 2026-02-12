/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	poweredByHeader: false, // Remove X-Powered-By header from response headers for security reasons
	productionBrowserSourceMaps: true, // Enable production-ready source maps for better debugging experience
	experimental: {
		swcPlugins: [["swc-plugin-coverage-instrument", {}]],
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.externals.push({
				bufferutil: "bufferutil",
				"utf-8-validate": "utf-8-validate",
			});
		}

		if (config.cache) {
			config.cache = Object.freeze({
				type: "memory",
			});
		}
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.amazonaws.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "*.cloudfront.net",
				port: "",
			},
			{
				protocol: "https",
				hostname: "*.chain.site",
				port: "",
			},
			{
				protocol: "https",
				hostname: "*.kapt.xyz",
				port: "",
			},
			{
				protocol: "https",
				hostname: "chainsite-storage",
				port: "",
			},
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "chainsite-dev-storage",
				port: "",
			},
		],
	},
	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Content-Security-Policy",
						value: "frame-ancestors 'none'",
					},
					{
						key: "X-Powered-By",
						value: "N/A",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Cache-Control",
						value: "public, s-maxage=86400, stale-while-revalidate=3600",
					},
				],
			},
		];
	},
};

export default nextConfig;
