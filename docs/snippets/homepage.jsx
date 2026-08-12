export const HomeAssetShowcase = () => {
	const pictumApiBaseUrl =
		typeof window !== "undefined" &&
		["localhost", "127.0.0.1"].includes(window.location.hostname)
			? "https://pictum.test/v1"
			: "https://pictum.dev/v1";

	return (
		<section aria-label="Live Pictum asset previews" className="not-prose mt-8">
			<ul className="m-0 grid list-none grid-cols-1 gap-3 p-0">
				<li>
					<a
						href="/guides/icons"
						className="grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-950/10 bg-white text-zinc-950 no-underline shadow-sm transition-colors duration-150 hover:border-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:border-violet-500 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-zinc-950"
					>
						<span className="flex min-w-0 flex-col justify-center p-4 sm:p-6">
							<span className="block text-base font-bold tracking-tight sm:text-lg">
								Icons
							</span>
							<span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm">
								330,000+ ready to use
							</span>
						</span>
						<span className="grid min-h-32 place-items-center border-l border-zinc-950/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-800/60 sm:p-4">
							<span
								className="flex -space-x-5 sm:-space-x-7"
								aria-hidden="true"
							>
								<span
									className="grid size-12 place-items-center [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white sm:size-20 sm:ring-4"
									style={{ transform: "rotate(-12deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/icons/lucide:circle-check.svg`}
										alt=""
										width="48"
										height="48"
										decoding="async"
										className="block size-6 sm:size-9"
									/>
								</span>
								<span
									className="grid size-12 place-items-center [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white sm:size-20 sm:ring-4"
									style={{ transform: "rotate(7deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/icons/tabler:sparkles.svg`}
										alt=""
										width="48"
										height="48"
										decoding="async"
										className="block size-6 sm:size-9"
									/>
								</span>
								<span
									className="grid size-12 place-items-center [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white sm:size-20 sm:ring-4"
									style={{ transform: "rotate(-6deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/icons/lucide:zap.svg`}
										alt=""
										width="48"
										height="48"
										decoding="async"
										className="block size-6 sm:size-9"
									/>
								</span>
								<span
									className="grid size-12 place-items-center [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white sm:size-20 sm:ring-4"
									style={{ transform: "rotate(11deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/icons/lucide:heart.svg`}
										alt=""
										width="48"
										height="48"
										decoding="async"
										className="block size-6 sm:size-9"
									/>
								</span>
							</span>
						</span>
					</a>
				</li>

				<li>
					<a
						href="/guides/avatars"
						className="grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-950/10 bg-white text-zinc-950 no-underline shadow-sm transition-colors duration-150 hover:border-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:border-violet-500 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-zinc-950"
					>
						<span className="flex min-w-0 flex-col justify-center p-4 sm:p-6">
							<span className="block text-base font-bold tracking-tight sm:text-lg">
								Avatars
							</span>
							<span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm">
								Deterministic from a seed
							</span>
						</span>
						<span className="grid min-h-32 place-items-center border-l border-zinc-950/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-800/60 sm:p-4">
							<span
								className="flex -space-x-5 sm:-space-x-7"
								aria-hidden="true"
							>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(8deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/avatar.svg?seed=ada-lovelace&variant=identicon`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 sm:size-20"
									/>
								</span>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(-12deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/avatar.svg?seed=grace-hopper&variant=gradient`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 sm:size-20"
									/>
								</span>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(5deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/avatar.svg?seed=katherine-johnson`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 sm:size-20"
									/>
								</span>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(-8deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/avatar.webp?seed=homepage-portrait&variant=portrait&gender=female&size=128`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 object-cover sm:size-20"
									/>
								</span>
							</span>
						</span>
					</a>
				</li>

				<li>
					<a
						href="/guides/qr-codes"
						className="grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-950/10 bg-white text-zinc-950 no-underline shadow-sm transition-colors duration-150 hover:border-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:border-violet-500 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-zinc-950"
					>
						<span className="flex min-w-0 flex-col justify-center p-4 sm:p-6">
							<span className="block text-base font-bold tracking-tight sm:text-lg">
								QR codes
							</span>
							<span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm">
								Any text or URL
							</span>
						</span>
						<span className="grid min-h-32 place-items-center border-l border-zinc-950/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-800/60 sm:p-4">
							<span
								className="flex -space-x-5 sm:-space-x-7"
								aria-hidden="true"
							>
								<span
									className="grid size-12 place-items-center overflow-hidden [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white dark:border-white/10 dark:ring-zinc-900 sm:size-20 sm:ring-4"
									style={{ transform: "rotate(-8deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/qrcode.svg?data=aHR0cHM6Ly9waWN0dW0uZGV2&foreground=%234c1d95ff&background=%23ede9feff`}
										alt=""
										width="256"
										height="256"
										decoding="async"
										className="block size-full"
									/>
								</span>
								<span
									className="grid size-12 place-items-center overflow-hidden [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white dark:border-white/10 dark:ring-zinc-900 sm:size-20 sm:ring-4"
									style={{ transform: "rotate(11deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/qrcode.svg?data=aGVsbG8%3D&foreground=%23155e75ff&background=%23cffafeff`}
										alt=""
										width="256"
										height="256"
										decoding="async"
										className="block size-full"
									/>
								</span>
								<span
									className="grid size-12 place-items-center overflow-hidden [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white dark:border-white/10 dark:ring-zinc-900 sm:size-20 sm:ring-4"
									style={{ transform: "rotate(-5deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/qrcode.svg?data=cGljdHVt&foreground=%2392400eff&background=%23fef3c7ff`}
										alt=""
										width="256"
										height="256"
										decoding="async"
										className="block size-full"
									/>
								</span>
								<span
									className="grid size-12 place-items-center overflow-hidden [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-white ring-2 ring-white dark:border-white/10 dark:ring-zinc-900 sm:size-20 sm:ring-4"
									style={{ transform: "rotate(7deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/qrcode.svg?data=V2VsY29tZQ%3D%3D&foreground=%239d174dff&background=%23fce7f3ff`}
										alt=""
										width="256"
										height="256"
										decoding="async"
										className="block size-full"
									/>
								</span>
							</span>
						</span>
					</a>
				</li>

				<li>
					<a
						href="/guides/placeholders"
						className="grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-950/10 bg-white text-zinc-950 no-underline shadow-sm transition-colors duration-150 hover:border-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:border-violet-500 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-zinc-950"
					>
						<span className="flex min-w-0 flex-col justify-center p-4 sm:p-6">
							<span className="block text-base font-bold tracking-tight sm:text-lg">
								Placeholders
							</span>
							<span className="mt-1 block text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm">
								Any size, text, or color
							</span>
						</span>
						<span className="grid min-h-32 place-items-center border-l border-zinc-950/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-800/60 sm:p-4">
							<span
								className="flex -space-x-5 sm:-space-x-7"
								aria-hidden="true"
							>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(7deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/placeholder.svg?size=128&background=%23ede9fe&color=%234c1d95&text=128`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 object-cover sm:size-20"
									/>
								</span>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(-11deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/placeholder.svg?size=128&background=%23cffafe&color=%23155e75&text=1%3A1`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 object-cover sm:size-20"
									/>
								</span>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(5deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/placeholder.svg?size=128&background=%23fef3c7&color=%2392400e&text=Soon`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 object-cover sm:size-20"
									/>
								</span>
								<span
									className="overflow-hidden [corner-shape:squircle] rounded-3xl ring-2 ring-white dark:ring-zinc-900 sm:ring-4"
									style={{ transform: "rotate(-7deg)" }}
								>
									<img
										src={`${pictumApiBaseUrl}/placeholder.svg?size=128&background=%23fce7f3&color=%239d174d&text=Live`}
										alt=""
										width="128"
										height="128"
										decoding="async"
										className="block size-12 object-cover sm:size-20"
									/>
								</span>
							</span>
						</span>
					</a>
				</li>
			</ul>
		</section>
	);
};
