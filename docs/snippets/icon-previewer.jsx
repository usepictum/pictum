export const IconPreviewer = () => {
	const pictumApiBaseUrl =
		typeof window !== "undefined" &&
		["localhost", "127.0.0.1"].includes(window.location.hostname)
			? "https://pictum.test/v1"
			: "https://pictum.dev/v1";
	const collectionsUrl = `${pictumApiBaseUrl}/icons.json`;
	const iconUrl = (identifier) => `${pictumApiBaseUrl}/icons/${identifier}.svg`;
	const iconPartPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	const [collectionsState, setCollectionsState] = useState({
		options: [],
		status: "loading",
	});
	const [prefix, setPrefix] = useState("lucide");
	const [name, setName] = useState("circle-check");
	const [previewIdentifier, setPreviewIdentifier] = useState("");
	const [imageState, setImageState] = useState({
		url: "",
		status: "loading",
	});
	const [spinnerUrl, setSpinnerUrl] = useState("");
	const copyAttempt = useRef(0);
	const [copyState, setCopyState] = useState({
		attempt: 0,
		url: "",
		status: "idle",
	});

	const prefixAvailable =
		collectionsState.status === "loaded" &&
		collectionsState.options.some((option) => option.value === prefix);
	const validName = iconPartPattern.test(name);
	const selectedIdentifier =
		prefixAvailable && validName ? `${prefix}:${name}` : "";
	const previewUrl =
		selectedIdentifier && previewIdentifier ? iconUrl(previewIdentifier) : "";
	const currentUrl = previewUrl;
	const previewPending =
		selectedIdentifier !== "" && previewIdentifier !== selectedIdentifier;
	const catalogPending = collectionsState.status === "loading";
	const previewState = !previewUrl
		? "idle"
		: imageState.url === previewUrl
			? imageState.status
			: "loading";
	const canCopy =
		selectedIdentifier !== "" &&
		!previewPending &&
		previewState === "loaded" &&
		currentUrl !== "";
	const copied = copyState.url === currentUrl && copyState.status === "copied";
	const copyFailed =
		copyState.url === currentUrl && copyState.status === "failed";
	const copying =
		copyState.url === currentUrl && copyState.status === "copying";
	const collectionMessage =
		collectionsState.status === "loading"
			? "Loading collections..."
			: collectionsState.status === "error"
				? "Collections could not be loaded."
				: collectionsState.status === "empty"
					? "No icon collections are available."
					: "";
	const nameError =
		name === ""
			? "Enter an icon name."
			: validName
				? ""
				: "Use lowercase kebab-case, such as arrow-left.";
	const previewMessage =
		collectionsState.status === "loading"
			? "Loading icon collections"
			: collectionsState.status === "error"
				? "Collections unavailable"
				: collectionsState.status === "empty"
					? "No collections available"
					: nameError
						? "Valid icon name required"
						: previewPending
							? "Updating preview"
							: "Select an icon";

	useEffect(() => {
		const controller = new AbortController();

		const loadCollections = async () => {
			setCollectionsState({ options: [], status: "loading" });

			try {
				const response = await fetch(collectionsUrl, {
					headers: { Accept: "application/json" },
					signal: controller.signal,
				});
				if (!response.ok) throw new Error("Collection request failed.");

				const payload = await response.json();
				if (
					payload === null ||
					typeof payload !== "object" ||
					Array.isArray(payload)
				) {
					throw new Error("Collection response was invalid.");
				}

				const options = Object.entries(payload)
					.filter(([value]) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
					.map(([value, metadata]) => {
						const collectionName =
							metadata !== null &&
							typeof metadata === "object" &&
							!Array.isArray(metadata) &&
							typeof metadata.name === "string" &&
							metadata.name.trim()
								? metadata.name.trim()
								: "";
						const firstSample =
							metadata !== null &&
							typeof metadata === "object" &&
							!Array.isArray(metadata) &&
							Array.isArray(metadata.samples)
								? metadata.samples.find(
										(sample) =>
											typeof sample === "string" &&
											iconPartPattern.test(sample),
									) || ""
								: "";

						return {
							firstSample,
							label: collectionName ? `${collectionName} (${value})` : value,
							value,
						};
					})
					.sort((left, right) => left.value.localeCompare(right.value));

				if (controller.signal.aborted) return;
				if (options.length === 0) {
					setCollectionsState({ options: [], status: "empty" });
					setPrefix("");
					return;
				}

				setCollectionsState({ options, status: "loaded" });
				const initialOption =
					options.find((option) => option.value === "lucide") || options[0];
				setPrefix(initialOption.value);
				setName(initialOption.firstSample);
			} catch {
				if (controller.signal.aborted) return;
				setCollectionsState({ options: [], status: "error" });
				setPrefix("");
			}
		};

		void loadCollections();
		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (!selectedIdentifier) {
			setPreviewIdentifier("");
			return;
		}

		const timeout = setTimeout(
			() => setPreviewIdentifier(selectedIdentifier),
			300,
		);
		return () => clearTimeout(timeout);
	}, [selectedIdentifier]);

	useEffect(() => {
		setSpinnerUrl("");
		if (previewState !== "loading" || !previewUrl) return;

		const timeout = setTimeout(() => setSpinnerUrl(previewUrl), 300);
		return () => clearTimeout(timeout);
	}, [previewState, previewUrl]);

	useEffect(() => {
		if (copyState.status !== "copied" && copyState.status !== "failed") return;

		const timeout = setTimeout(() => {
			if (copyAttempt.current !== copyState.attempt) return;
			setCopyState({
				attempt: copyState.attempt,
				url: "",
				status: "idle",
			});
		}, 2000);
		return () => clearTimeout(timeout);
	}, [copyState.attempt, copyState.status]);

	const invalidateCopy = () => {
		const attempt = ++copyAttempt.current;
		setCopyState({ attempt, url: "", status: "idle" });
	};
	const changePrefix = (event) => {
		invalidateCopy();
		const nextPrefix = event.target.value;
		const nextOption = collectionsState.options.find(
			(option) => option.value === nextPrefix,
		);
		setPrefix(nextPrefix);
		setName(nextOption?.firstSample || "");
	};
	const changeName = (event) => {
		invalidateCopy();
		setName(event.target.value);
	};
	const copyUrl = () => {
		if (!canCopy) return;
		const urlToCopy = currentUrl;
		const attempt = ++copyAttempt.current;
		setCopyState({ attempt, url: urlToCopy, status: "copying" });

		navigator.clipboard
			.writeText(urlToCopy)
			.then(() => {
				if (copyAttempt.current !== attempt) return;
				setCopyState({ attempt, url: urlToCopy, status: "copied" });
			})
			.catch(() => {
				if (copyAttempt.current !== attempt) return;
				setCopyState({ attempt, url: urlToCopy, status: "failed" });
			});
	};

	return (
		<div className="not-prose grid overflow-hidden rounded-2xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900 md:grid-cols-2 ">
			<form
				className="grid content-center gap-5 p-6"
				onSubmit={(event) => event.preventDefault()}
				aria-label="Icon preview controls"
			>
				<div>
					<p className="mb-1 mt-0 text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
						Live preview
					</p>
					<p className="m-0 text-xl font-bold tracking-tight">Build an icon</p>
				</div>

				<div className="grid gap-4">
					<label className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<span>Prefix</span>
						<select
							value={prefix}
							onChange={changePrefix}
							disabled={collectionsState.status !== "loaded"}
							aria-describedby={
								collectionMessage ? "icon-collection-status" : undefined
							}
							className="w-full min-w-0 rounded-lg border border-zinc-950/10 bg-zinc-50 px-3 py-2.5 text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 disabled:cursor-not-allowed disabled:text-zinc-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:disabled:text-zinc-400"
						>
							<option value="">Select a prefix</option>
							{collectionsState.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						{collectionMessage && (
							<span
								id="icon-collection-status"
								className={`text-xs font-normal ${
									collectionsState.status === "error"
										? "text-red-600 dark:text-red-400"
										: "text-zinc-600 dark:text-zinc-300"
								}`}
								role={collectionsState.status === "error" ? "alert" : "status"}
							>
								{collectionMessage}
							</span>
						)}
					</label>

					<label className="grid content-start gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
						<span>Name</span>
						<input
							type="text"
							value={name}
							onChange={changeName}
							disabled={!prefixAvailable}
							aria-invalid={!validName}
							aria-describedby={nameError ? "icon-name-error" : undefined}
							className={`w-full min-w-0 rounded-lg border bg-zinc-50 px-3 py-2.5 font-mono text-sm font-normal text-zinc-950 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-600/20 disabled:cursor-not-allowed disabled:text-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 dark:disabled:text-zinc-400 ${
								validName
									? "border-zinc-950/10 dark:border-white/10"
									: "border-red-600 dark:border-red-400"
							}`}
							spellCheck="false"
							autoComplete="off"
						/>
						{nameError && (
							<span
								id="icon-name-error"
								className="text-xs font-normal text-red-600 dark:text-red-400"
								role="alert"
							>
								{nameError}
							</span>
						)}
					</label>
				</div>
			</form>

			<div className="flex min-h-72 items-center justify-center border-t border-zinc-950/10 bg-zinc-50 px-6 py-8 dark:border-white/10 dark:bg-zinc-950/40 md:border-l md:border-t-0">
				<div
					className="relative grid h-52 w-full max-w-sm place-items-center rounded-xl border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900"
					aria-busy={
						catalogPending || previewPending || previewState === "loading"
					}
				>
					{previewUrl ? (
						<img
							key={previewUrl}
							src={previewUrl}
							alt={`Preview of the ${previewIdentifier} icon`}
							width="32"
							height="32"
							onLoad={() =>
								setImageState({ url: previewUrl, status: "loaded" })
							}
							onError={() =>
								setImageState({ url: previewUrl, status: "error" })
							}
							className={`block h-8 w-8 object-contain transition-opacity ${
								previewState === "loaded" ? "opacity-100" : "opacity-0"
							}`}
						/>
					) : (
						<span className="px-4 text-center text-xs text-zinc-600 dark:text-zinc-300">
							{previewMessage}
						</span>
					)}
					{spinnerUrl === previewUrl && previewState === "loading" && (
						<span
							aria-hidden="true"
							className="absolute h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-700 dark:border-violet-900 dark:border-t-violet-300"
						/>
					)}
					{previewState === "error" && (
						<div
							className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-red-600 dark:text-red-300"
							role="alert"
						>
							<span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 dark:bg-red-950">
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
							<span className="text-xs font-semibold">
								Icon could not be loaded
							</span>
						</div>
					)}
				</div>
			</div>

			<div className="col-span-full grid border-t border-zinc-950/10 bg-zinc-50/70 dark:border-white/10 dark:bg-zinc-900 sm:flex sm:items-stretch">
				<code
					className="min-w-0 flex-1 whitespace-normal break-all px-4 py-3 text-xs leading-5 text-zinc-800 dark:text-zinc-200"
					aria-live="polite"
				>
					{catalogPending
						? "Loading icon catalog..."
						: previewPending
							? "Updating preview..."
							: currentUrl ||
								(nameError
									? "Enter a valid icon name to generate a URL"
									: "Select an icon to generate a URL")}
				</code>
				<button
					type="button"
					onClick={copyUrl}
					disabled={!canCopy || copying}
					className="border-t border-zinc-950/10 bg-transparent px-4 py-3 text-xs font-bold text-violet-700 disabled:cursor-not-allowed disabled:text-zinc-400 dark:border-white/10 dark:text-violet-300 sm:border-l sm:border-t-0"
				>
					{catalogPending
						? "Loading"
						: previewPending || previewState === "loading"
							? "Updating"
							: previewState === "error" || nameError
								? "Unavailable"
								: copied
									? "Copied"
									: copyFailed
										? "Copy failed"
										: copying
											? "Copying"
											: "Copy URL"}
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
