export const QrCodePreviewer = () => {
	const pictumApiBaseUrl =
		typeof window !== "undefined" &&
		["localhost", "127.0.0.1"].includes(window.location.hostname)
			? "https://pictum.test/v1"
			: "https://pictum.dev/v1";
	const qrCodeEndpoint = `${pictumApiBaseUrl}/qrcode.svg`;
	const initialValue = "https://pictum.dev";
	const defaultForeground = "#000000";
	const defaultBackground = "#ffffff";
	const colorPattern = /^#[0-9a-f]{6}$/i;
	const isValidColor = (color) => colorPattern.test(color);
	const [value, setValue] = useState(initialValue);
	const [foreground, setForeground] = useState(defaultForeground);
	const [background, setBackground] = useState(defaultBackground);
	const [debouncedInputs, setDebouncedInputs] = useState({
		value: initialValue,
		foreground: defaultForeground,
		background: defaultBackground,
	});
	const [quietZone, setQuietZone] = useState(true);
	const [imageState, setImageState] = useState("loading");
	const [showSpinner, setShowSpinner] = useState(false);
	const [copied, setCopied] = useState(false);

	const valueBytes = new TextEncoder().encode(value);
	const valueByteLength = valueBytes.length;
	const validValue = valueByteLength >= 1 && valueByteLength <= 512;
	const validForeground = isValidColor(foreground);
	const validBackground = isValidColor(background);
	const debouncedBytes = new TextEncoder().encode(debouncedInputs.value);
	const validDebouncedValue =
		debouncedBytes.length >= 1 && debouncedBytes.length <= 512;
	const validDebouncedForeground = isValidColor(debouncedInputs.foreground);
	const validDebouncedBackground = isValidColor(debouncedInputs.background);
	const encodedValue = validValue
		? btoa(String.fromCharCode(...valueBytes))
		: "";
	const encodedDebouncedValue = validDebouncedValue
		? btoa(String.fromCharCode(...debouncedBytes))
		: "";
	const buildQrCodeUrl = (
		encodedData,
		selectedForeground,
		selectedBackground,
	) => {
		const query = new URLSearchParams();
		query.set("data", encodedData);
		if (!quietZone) query.set("quiet_zone", "0");
		if (selectedForeground.toLowerCase() !== defaultForeground) {
			query.set("foreground", selectedForeground);
		}
		query.set("background", selectedBackground);

		return `${qrCodeEndpoint}?${query.toString()}`;
	};
	const url =
		validValue && validForeground && validBackground
			? buildQrCodeUrl(encodedValue, foreground, background)
			: "";
	const previewUrl =
		validValue &&
		validForeground &&
		validBackground &&
		validDebouncedValue &&
		validDebouncedForeground &&
		validDebouncedBackground
			? buildQrCodeUrl(
					encodedDebouncedValue,
					debouncedInputs.foreground,
					debouncedInputs.background,
				)
			: "";
	const validationMessage =
		valueByteLength === 0
			? "Enter a value."
			: valueByteLength > 512
				? `Value is ${valueByteLength} bytes; the maximum is 512.`
				: "";
	const previewValidationMessage = !validValue
		? "Valid value required"
		: !validForeground || !validBackground
			? "Valid colors required"
			: "Updating preview";
	const urlValidationMessage = !validValue
		? "Enter a valid value to generate a URL"
		: "Enter valid colors to generate a URL";

	useEffect(() => {
		const timeout = setTimeout(
			() => setDebouncedInputs({ value, foreground, background }),
			300,
		);
		return () => clearTimeout(timeout);
	}, [value, foreground, background]);

	useEffect(() => {
		setImageState(previewUrl ? "loading" : "idle");
		setCopied(false);
	}, [previewUrl]);

	useEffect(() => {
		setShowSpinner(false);
		if (imageState !== "loading" || !previewUrl) return;

		const timeout = setTimeout(() => setShowSpinner(true), 300);
		return () => clearTimeout(timeout);
	}, [imageState, previewUrl]);

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
			<form
				className="grid content-center gap-5 p-6"
				onSubmit={(event) => event.preventDefault()}
				aria-label="QR code preview controls"
			>
				<div>
					<p className="mb-1 mt-0 text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
						Live preview
					</p>
					<p className="m-0 text-xl font-bold tracking-tight">
						Build a QR code
					</p>
				</div>

				<label className="grid gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
					<span>Value</span>
					<input
						type="text"
						value={value}
						onChange={(event) => setValue(event.target.value)}
						aria-invalid={!validValue}
						aria-describedby={!validValue ? "qr-value-error" : undefined}
						className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
							validValue
								? "border-zinc-950/10 dark:border-white/10"
								: "border-red-600 dark:border-red-400"
						}`}
						spellCheck="false"
					/>
					{!validValue && (
						<p
							id="qr-value-error"
							className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
							role="alert"
						>
							{validationMessage}
						</p>
					)}
				</label>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<label htmlFor="qr-foreground">Foreground</label>
						<span className="relative block">
							<input
								id="qr-foreground"
								type="text"
								value={foreground}
								onChange={(event) => setForeground(event.target.value)}
								aria-invalid={!validForeground}
								aria-describedby={
									!validForeground ? "qr-foreground-error" : undefined
								}
								className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 pr-12 font-mono text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
									validForeground
										? "border-zinc-950/10 dark:border-white/10"
										: "border-red-600 dark:border-red-400"
								}`}
								spellCheck="false"
							/>
							<span className="absolute inset-y-0 right-2 flex items-center">
								<input
									type="color"
									value={validForeground ? foreground : "#000000"}
									onChange={(event) => setForeground(event.target.value)}
									aria-label="Choose foreground color"
									className="h-6 w-6 cursor-pointer rounded border border-zinc-950/20 bg-transparent p-0 dark:border-white/20"
								/>
							</span>
						</span>
						{!validForeground && (
							<p
								id="qr-foreground-error"
								className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
								role="alert"
							>
								Use #rrggbb.
							</p>
						)}
					</div>

					<div className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<label htmlFor="qr-background">Background</label>
						<span className="relative block">
							<input
								id="qr-background"
								type="text"
								value={background}
								onChange={(event) => setBackground(event.target.value)}
								aria-invalid={!validBackground}
								aria-describedby={
									!validBackground ? "qr-background-error" : undefined
								}
								className={`w-full rounded-lg border bg-zinc-50 px-3 py-2.5 pr-12 font-mono text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 dark:bg-zinc-800 dark:text-zinc-100 ${
									validBackground
										? "border-zinc-950/10 dark:border-white/10"
										: "border-red-600 dark:border-red-400"
								}`}
								spellCheck="false"
							/>
							<span className="absolute inset-y-0 right-2 flex items-center">
								<input
									type="color"
									value={validBackground ? background : "#ffffff"}
									onChange={(event) => setBackground(event.target.value)}
									aria-label="Choose background color"
									className="h-6 w-6 cursor-pointer rounded border border-zinc-950/20 bg-transparent p-0 dark:border-white/20"
								/>
							</span>
						</span>
						{!validBackground && (
							<p
								id="qr-background-error"
								className="m-0 text-xs font-normal text-red-600 dark:text-red-400"
								role="alert"
							>
								Use #rrggbb.
							</p>
						)}
					</div>
				</div>

				<label className="flex items-start gap-3 rounded-lg border border-zinc-950/10 bg-zinc-50 px-3 py-3 text-zinc-800 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
					<input
						type="checkbox"
						checked={quietZone}
						onChange={(event) => setQuietZone(event.target.checked)}
						className="mt-0.5 h-4 w-4 accent-violet-700"
					/>
					<span className="grid gap-0.5">
						<span className="text-xs font-semibold">Quiet zone</span>
						<span className="text-xs text-zinc-600 dark:text-zinc-300">
							Include clear space around the QR modules.
						</span>
					</span>
				</label>
			</form>

			<div className="flex items-center justify-center border-t border-zinc-950/10 bg-zinc-50 px-6 py-8 dark:border-white/10 dark:bg-zinc-950/40 md:border-l md:border-t-0">
				<div
					className="overflow-hidden relative grid h-44 w-44 place-items-center rounded-lg border border-zinc-950/10 bg-white dark:border-white/10 sm:h-52 sm:w-52"
					aria-busy={imageState === "loading"}
					style={{
						backgroundImage:
							"conic-gradient(rgba(113, 113, 122, 0.12) 25%, transparent 0 50%, rgba(113, 113, 122, 0.12) 0 75%, transparent 0)",
						backgroundSize: "12px 12px",
					}}
				>
					{previewUrl ? (
						<img
							key={previewUrl}
							src={previewUrl}
							alt={`QR code preview for ${debouncedInputs.value}`}
							onLoad={() => setImageState("loaded")}
							onError={() => setImageState("error")}
							className={`block h-full w-full object-contain transition-opacity ${
								imageState === "loaded" ? "opacity-100" : "opacity-0"
							}`}
						/>
					) : (
						<span className="text-center text-xs text-zinc-600 dark:text-zinc-300">
							{previewValidationMessage}
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
					{url || urlValidationMessage}
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
