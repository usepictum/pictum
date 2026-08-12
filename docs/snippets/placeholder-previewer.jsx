export const PlaceholderPreviewer = () => {
	const pictumApiBaseUrl =
		typeof window !== "undefined" &&
		["localhost", "127.0.0.1"].includes(window.location.hostname)
			? "https://pictum.test/v1"
			: "https://pictum.dev/v1";
	const initialControls = {
		text: "Coming soon",
		width: "640",
		height: "360",
		background: "#f1eef8",
		color: "#6d28d9",
	};
	const colorPattern = /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i;
	const parseDimension = (value) => {
		if (!/^\d+$/.test(value)) return null;

		const dimension = Number(value);
		return Number.isInteger(dimension) && dimension >= 16 && dimension <= 4096
			? dimension
			: null;
	};
	const canEncode = (value) => {
		try {
			encodeURIComponent(value);
			return true;
		} catch {
			return false;
		}
	};
	const buildPlaceholderUrl = ({ width, height, background, color, text }) => {
		const query = new URLSearchParams({
			width: String(width),
			height: String(height),
			background,
			color,
			text,
		});

		return `${pictumApiBaseUrl}/placeholder.svg?${query}`;
	};
	const [controls, setControls] = useState(initialControls);
	const [previewControls, setPreviewControls] = useState({
		...initialControls,
		width: Number(initialControls.width),
		height: Number(initialControls.height),
	});
	const [imageState, setImageState] = useState({
		url: "",
		status: "loading",
	});
	const [showSpinner, setShowSpinner] = useState(false);
	const [copiedUrl, setCopiedUrl] = useState("");
	const [failedUrl, setFailedUrl] = useState("");

	const width = parseDimension(controls.width);
	const height = parseDimension(controls.height);
	const validWidth = width !== null;
	const validHeight = height !== null;
	const validArea =
		validWidth && validHeight ? width * height <= 4194304 : true;
	const textLength = [...controls.text].length;
	const validTextEncoding = canEncode(controls.text);
	const validText = textLength <= 64 && validTextEncoding;
	const validBackground = colorPattern.test(controls.background);
	const validColor = colorPattern.test(controls.color);
	const validControls =
		validWidth &&
		validHeight &&
		validArea &&
		validText &&
		validBackground &&
		validColor;
	const previewUrl = previewControls
		? buildPlaceholderUrl(previewControls)
		: "";
	const currentUrl = previewUrl;
	const previewState = !previewUrl
		? "idle"
		: imageState.url === previewUrl
			? imageState.status
			: "loading";
	const copied = currentUrl !== "" && copiedUrl === currentUrl;
	const copyFailed = currentUrl !== "" && failedUrl === currentUrl;
	const updateControl = (name) => (event) => {
		setControls((current) => ({ ...current, [name]: event.target.value }));
	};
	const widthDescription = [
		!validWidth && "placeholder-width-error",
		!validArea && "placeholder-area-error",
	]
		.filter(Boolean)
		.join(" ");
	const heightDescription = [
		!validHeight && "placeholder-height-error",
		!validArea && "placeholder-area-error",
	]
		.filter(Boolean)
		.join(" ");

	useEffect(() => {
		if (!validControls) {
			setPreviewControls(null);
			return;
		}

		const timeout = setTimeout(
			() => setPreviewControls({ ...controls, width, height }),
			300,
		);
		return () => clearTimeout(timeout);
	}, [controls, height, validControls, width]);

	useEffect(() => {
		setShowSpinner(false);
		if (previewState !== "loading" || !previewUrl) return;

		const timeout = setTimeout(() => setShowSpinner(true), 300);
		return () => clearTimeout(timeout);
	}, [previewState, previewUrl]);

	useEffect(() => {
		if (!copiedUrl) return;

		const timeout = setTimeout(() => setCopiedUrl(""), 2000);
		return () => clearTimeout(timeout);
	}, [copiedUrl]);

	useEffect(() => {
		if (!failedUrl) return;

		const timeout = setTimeout(() => setFailedUrl(""), 2000);
		return () => clearTimeout(timeout);
	}, [failedUrl]);

	const copyUrl = () => {
		if (!currentUrl) return;
		const urlToCopy = currentUrl;
		setFailedUrl("");

		navigator.clipboard
			.writeText(urlToCopy)
			.then(() => {
				setCopiedUrl(urlToCopy);
				setFailedUrl("");
			})
			.catch(() => {
				setCopiedUrl("");
				setFailedUrl(urlToCopy);
			});
	};

	return (
		<div className="not-prose grid overflow-hidden rounded-2xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900 md:grid-cols-2">
			<form
				className="grid content-center gap-4 p-6"
				onSubmit={(event) => event.preventDefault()}
				aria-label="Placeholder preview controls"
			>
				<div>
					<p className="mb-1 mt-0 text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
						Live preview
					</p>
					<p className="m-0 text-xl font-bold tracking-tight">
						Build a placeholder
					</p>
				</div>

				<label className="grid gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
					<span>Text</span>
					<input
						type="text"
						value={controls.text}
						onChange={updateControl("text")}
						aria-invalid={!validText}
						aria-describedby={!validText ? "placeholder-text-error" : undefined}
						className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
							validText
								? "border-zinc-950/10 dark:border-white/10"
								: "border-red-600 dark:border-red-400"
						}`}
					/>
					{!validText && (
						<p
							id="placeholder-text-error"
							className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
							role="alert"
						>
							{validTextEncoding
								? `Text is ${textLength} characters; the maximum is 64.`
								: "Text contains invalid Unicode."}
						</p>
					)}
				</label>

				<div className="grid grid-cols-2 gap-4">
					<label className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<span>Width</span>
						<input
							type="number"
							min="16"
							max="4096"
							step="1"
							value={controls.width}
							onChange={updateControl("width")}
							aria-invalid={!validWidth || !validArea}
							aria-describedby={widthDescription || undefined}
							className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
								validWidth && validArea
									? "border-zinc-950/10 dark:border-white/10"
									: "border-red-600 dark:border-red-400"
							}`}
						/>
						{!validWidth && (
							<p
								id="placeholder-width-error"
								className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
								role="alert"
							>
								Use an integer from 16 to 4096.
							</p>
						)}
					</label>

					<label className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<span>Height</span>
						<input
							type="number"
							min="16"
							max="4096"
							step="1"
							value={controls.height}
							onChange={updateControl("height")}
							aria-invalid={!validHeight || !validArea}
							aria-describedby={heightDescription || undefined}
							className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
								validHeight && validArea
									? "border-zinc-950/10 dark:border-white/10"
									: "border-red-600 dark:border-red-400"
							}`}
						/>
						{!validHeight && (
							<p
								id="placeholder-height-error"
								className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
								role="alert"
							>
								Use an integer from 16 to 4096.
							</p>
						)}
					</label>
				</div>

				{!validArea && (
					<p
						id="placeholder-area-error"
						className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
						role="alert"
					>
						Width multiplied by height cannot exceed 4,194,304 pixels.
					</p>
				)}

				<div className="grid grid-cols-2 gap-4">
					<label className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<span>Background</span>
						<input
							type="text"
							value={controls.background}
							onChange={updateControl("background")}
							aria-invalid={!validBackground}
							aria-describedby={
								!validBackground ? "placeholder-background-error" : undefined
							}
							className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 font-mono text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
								validBackground
									? "border-zinc-950/10 dark:border-white/10"
									: "border-red-600 dark:border-red-400"
							}`}
							spellCheck="false"
						/>
						{!validBackground && (
							<p
								id="placeholder-background-error"
								className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
								role="alert"
							>
								Use #rrggbb or #rrggbbaa.
							</p>
						)}
					</label>

					<label className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<span>Color</span>
						<input
							type="text"
							value={controls.color}
							onChange={updateControl("color")}
							aria-invalid={!validColor}
							aria-describedby={
								!validColor ? "placeholder-color-error" : undefined
							}
							className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 font-mono text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
								validColor
									? "border-zinc-950/10 dark:border-white/10"
									: "border-red-600 dark:border-red-400"
							}`}
							spellCheck="false"
						/>
						{!validColor && (
							<p
								id="placeholder-color-error"
								className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
								role="alert"
							>
								Use #rrggbb or #rrggbbaa.
							</p>
						)}
					</label>
				</div>
			</form>

			<div className="flex min-h-80 items-center justify-center border-t border-zinc-950/10 bg-zinc-50 px-6 py-8 dark:border-white/10 dark:bg-zinc-950/40 md:border-l md:border-t-0">
				<div
					className="relative flex h-72 w-full max-w-md items-center justify-center"
					aria-busy={previewState === "loading"}
				>
					{previewUrl ? (
						<img
							key={previewUrl}
							src={previewUrl}
							alt={`Preview of a ${previewControls.width} by ${previewControls.height} placeholder`}
							width={previewControls.width}
							height={previewControls.height}
							onLoad={() =>
								setImageState({ url: previewUrl, status: "loaded" })
							}
							onError={() =>
								setImageState({ url: previewUrl, status: "error" })
							}
							className={`block h-auto w-auto max-h-72 max-w-full rounded-xl border border-zinc-950/10 object-contain transition-opacity dark:border-white/10 ${
								previewState === "loaded" ? "opacity-100" : "opacity-0"
							}`}
						/>
					) : (
						<span className="text-center text-xs text-zinc-600 dark:text-zinc-300">
							Valid controls required
						</span>
					)}
					{showSpinner && previewState === "loading" && (
						<span
							aria-hidden="true"
							className="absolute h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-700 dark:border-violet-900 dark:border-t-violet-300"
						/>
					)}
					{previewState === "error" && (
						<span
							className="absolute inset-0 m-auto grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
							role="alert"
							title="Preview could not be loaded."
						>
							<span className="sr-only">Preview could not be loaded.</span>
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
				<code className="min-w-0 flex-1 whitespace-normal break-all px-4 py-3 text-xs leading-5 text-zinc-800 dark:text-zinc-200">
					{currentUrl || "Enter valid controls to generate a URL"}
				</code>
				<button
					type="button"
					onClick={copyUrl}
					disabled={!currentUrl}
					className="border-t border-zinc-950/10 bg-transparent px-4 py-3 text-xs font-bold text-violet-700 disabled:cursor-not-allowed disabled:text-zinc-400 dark:border-white/10 dark:text-violet-300 sm:border-l sm:border-t-0"
				>
					{copied ? "Copied" : copyFailed ? "Copy failed" : "Copy URL"}
				</button>
				<span className="sr-only" aria-live="polite">
					{copied
						? "URL copied."
						: copyFailed
							? "URL could not be copied."
							: ""}
				</span>
			</div>
		</div>
	);
};
