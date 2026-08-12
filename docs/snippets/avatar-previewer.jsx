export const AvatarPreviewer = () => {
	const pictumApiBaseUrl =
		typeof window !== "undefined" &&
		["localhost", "127.0.0.1"].includes(window.location.hostname)
			? "https://pictum.test/v1"
			: "https://pictum.dev/v1";
	const [seed, setSeed] = useState("ada-lovelace");
	const [debouncedSeed, setDebouncedSeed] = useState("ada-lovelace");
	const [variant, setVariant] = useState("portrait");
	const [gender, setGender] = useState("any");
	const [imageState, setImageState] = useState("loading");
	const [showSpinner, setShowSpinner] = useState(false);
	const [copied, setCopied] = useState(false);

	const portrait = variant === "portrait";
	const slug = seed
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+/, "")
		.slice(0, 128)
		.replace(/-+$/, "");
	const validSeed = slug.length > 0;
	const validDebouncedSeed = debouncedSeed.length > 0;
	const format = portrait ? "webp" : "svg";
	const query = new URLSearchParams({ seed: debouncedSeed });
	if (variant !== "monogram") query.set("variant", variant);
	if (portrait && gender !== "any") query.set("gender", gender);
	const url =
		validSeed && validDebouncedSeed
			? `${pictumApiBaseUrl}/avatar.${format}?${query}`
			: "";

	useEffect(() => {
		const timeout = setTimeout(() => setDebouncedSeed(slug), 300);
		return () => clearTimeout(timeout);
	}, [slug]);

	useEffect(() => {
		setImageState(url ? "loading" : "idle");
		setCopied(false);
	}, [url]);

	useEffect(() => {
		setShowSpinner(false);
		if (imageState !== "loading" || !url) return;

		const timeout = setTimeout(() => setShowSpinner(true), 300);
		return () => clearTimeout(timeout);
	}, [imageState, url]);

	useEffect(() => {
		if (!copied) return;

		const timeout = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timeout);
	}, [copied]);

	const copyUrl = () => {
		if (!url) return;
		navigator.clipboard
			.writeText(url)
			.then(() => setCopied(true))
			.catch(() => setCopied(false));
	};

	return (
		<div className="not-prose grid overflow-hidden rounded-2xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900 md:grid-cols-2">
			<div className="grid content-center gap-4 p-6">
				<div>
					<p className="mb-1 mt-0 text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
						Live preview
					</p>
					<p className="m-0 text-xl font-bold tracking-tight">
						Build an avatar
					</p>
				</div>

				<label className="grid gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
					<span>Seed</span>
					<input
						value={seed}
						onChange={(event) => setSeed(event.target.value)}
						aria-invalid={!validSeed}
						aria-describedby={!validSeed ? "avatar-seed-error" : undefined}
						className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
							validSeed
								? "border-zinc-950/10 dark:border-white/10"
								: "border-red-600 dark:border-red-400"
						}`}
						spellCheck="false"
					/>
					{!validSeed && (
						<p
							id="avatar-seed-error"
							className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
						>
							Enter at least one letter or number.
						</p>
					)}
				</label>

				<div className={portrait ? "grid grid-cols-2 gap-4" : "grid"}>
					<label className="grid gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<span>Variant</span>
						<select
							value={variant}
							onChange={(event) => setVariant(event.target.value)}
							className="w-full rounded-lg border border-zinc-950/10 bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
						>
							<option value="identicon">Identicon</option>
							<option value="gradient">Gradient</option>
							<option value="monogram">Monogram</option>
							<option value="portrait">Portrait</option>
						</select>
					</label>

					{portrait && (
						<label className="grid gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
							<span>Gender</span>
							<select
								value={gender}
								onChange={(event) => setGender(event.target.value)}
								className="w-full rounded-lg border border-zinc-950/10 bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
							>
								<option value="any">Any</option>
								<option value="female">Female</option>
								<option value="male">Male</option>
							</select>
						</label>
					)}
				</div>
			</div>

			<div className="flex items-center justify-center border-t border-zinc-950/10 bg-zinc-50 px-6 py-8 dark:border-white/10 dark:bg-zinc-950/40 md:border-l md:border-t-0">
				<div className="relative grid h-40 w-40 place-items-center rounded-3xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900 sm:h-52 sm:w-52">
					{url ? (
						<img
							key={url}
							src={url}
							alt={`Preview of the ${variant} avatar for ${debouncedSeed}`}
							onLoad={() => setImageState("loaded")}
							onError={() => setImageState("error")}
							className={`block h-full w-full rounded-3xl object-cover transition-opacity ${
								imageState === "loaded" ? "opacity-100" : "opacity-0"
							}`}
						/>
					) : (
						<span className="text-xs text-zinc-600 dark:text-zinc-300">
							Valid seed required
						</span>
					)}
					{showSpinner && imageState === "loading" && (
						<span
							aria-hidden="true"
							className="absolute h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-700 dark:border-violet-900 dark:border-t-violet-300"
						/>
					)}
					{imageState === "error" && (
						<span
							className="absolute inset-0 m-auto grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
							role="img"
							aria-label="Preview could not be loaded."
							title="Preview could not be loaded."
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-6 w-6"
								aria-hidden="true"
							>
								<circle cx="12" cy="12" r="9" />
								<path d="M12 8v5" />
								<path d="M12 16h.01" />
							</svg>
						</span>
					)}
				</div>
			</div>

			<div className="col-span-full grid border-t border-zinc-950/10 bg-zinc-50/70 dark:border-white/10 dark:bg-zinc-900 sm:flex sm:items-stretch">
				<code
					className="min-w-0 flex-1 whitespace-normal break-all px-4 py-3 text-xs leading-5 text-zinc-800 dark:text-zinc-200"
					aria-live="polite"
				>
					{url || "Enter a valid seed to generate a URL"}
				</code>
				<button
					type="button"
					onClick={copyUrl}
					disabled={!url}
					className="border-t border-zinc-950/10 bg-transparent px-4 py-3 text-xs font-bold text-violet-700 disabled:cursor-not-allowed disabled:text-zinc-400 dark:border-white/10 dark:text-violet-300 sm:border-l sm:border-t-0"
				>
					{copied ? "Copied" : "Copy URL"}
				</button>
			</div>
		</div>
	);
};
