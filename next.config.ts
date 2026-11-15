import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Autorise le serveur de dev à être ouvert depuis un téléphone sur le réseau local
	allowedDevOrigins: ["192.168.*.*"],
	images: {
		remotePatterns: [],
	},
};

export default nextConfig;
