import type { PictumOptions } from "pictum";
import { getContext, setContext } from "svelte";
import type { MaybeGetter, ReactiveValue } from "./types.js";

type PictumOptionsGetter = () => PictumOptions;

const PICTUM_CONTEXT = Symbol("PictumOptions");
const defaultOptions: PictumOptionsGetter = () => ({});

export function providePictumOptions(
	options: () => PictumOptions | undefined,
): void {
	const inherited =
		getContext<PictumOptionsGetter>(PICTUM_CONTEXT) ?? defaultOptions;
	setContext(PICTUM_CONTEXT, () => mergePictumOptions(inherited(), options()));
}

export function usePictumOptions(
	options?: MaybeGetter<PictumOptions | undefined>,
): ReactiveValue<PictumOptions> {
	const inherited =
		getContext<PictumOptionsGetter>(PICTUM_CONTEXT) ?? defaultOptions;
	const value = $derived.by(() =>
		mergePictumOptions(inherited(), readMaybeGetter(options)),
	);

	return {
		get current() {
			return value;
		},
	};
}

export function readMaybeGetter<Value>(
	value: MaybeGetter<Value> | undefined,
): Value | undefined {
	return typeof value === "function" ? (value as () => Value)() : value;
}

function mergePictumOptions(
	inherited: PictumOptions,
	overrides?: PictumOptions,
): PictumOptions {
	const baseUrl = overrides?.baseUrl ?? inherited.baseUrl;
	return baseUrl === undefined ? {} : { baseUrl };
}
