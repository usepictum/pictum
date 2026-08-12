export const AvatarVariantGallery = () => {
	const pictumApiBaseUrl =
		typeof window !== "undefined" &&
		["localhost", "127.0.0.1"].includes(window.location.hostname)
			? "https://pictum.test/v1"
			: "https://pictum.dev/v1";
	const variants = [
		{
			name: "Portrait",
			description: "A photographic portrait selected from the catalog",
			src: `${pictumApiBaseUrl}/avatar.webp?seed=ada-lovelace&variant=portrait`,
			alt: "Portrait avatar generated for the seed ada-lovelace",
		},
		{
			name: "Monogram",
			description: "One or two letters on a seeded color background",
			src: `${pictumApiBaseUrl}/avatar.svg?seed=ada-lovelace`,
			alt: "Monogram avatar generated for the seed ada-lovelace",
		},
		{
			name: "Gradient",
			description: "A seeded multi-color gradient with directional glow",
			src: `${pictumApiBaseUrl}/avatar.svg?seed=ada-lovelace&variant=gradient`,
			alt: "Gradient avatar generated for the seed ada-lovelace",
		},
		{
			name: "Identicon",
			description: "A symmetric 5x5 geometric pattern",
			src: `${pictumApiBaseUrl}/avatar.svg?seed=ada-lovelace&variant=identicon`,
			alt: "Identicon avatar generated for the seed ada-lovelace",
		},
	];

	return (
		<ul
			aria-label="Avatar variant gallery"
			className="not-prose m-0 grid list-none grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-950/5 bg-zinc-950/5 p-0 dark:border-white/10 dark:bg-white/10 md:grid-cols-4"
		>
			{variants.map((variant) => (
				<li
					key={variant.name}
					className="min-w-0 bg-white p-3 dark:bg-zinc-900 sm:p-4"
				>
					<figure className="m-0">
						<div className="overflow-hidden [corner-shape:squircle] rounded-3xl border border-zinc-950/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/40">
							<img
								src={variant.src}
								alt={variant.alt}
								width="256"
								height="256"
								loading="lazy"
								className="block aspect-square h-auto w-full object-cover"
							/>
						</div>
						<figcaption>
							<p className="mb-0 mt-3 text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
								{variant.name}
							</p>
							<p className="mb-0 mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-300">
								{variant.description}
							</p>
						</figcaption>
					</figure>
				</li>
			))}
		</ul>
	);
};
