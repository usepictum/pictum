import {
	type AvatarOptions,
	avatar,
	type IconOptions,
	icon,
	type PictumAsset,
	type PlaceholderOptions,
	placeholder,
	type QrCodeOptions,
	qrCode,
} from "pictum";
import { readMaybeGetter, usePictumOptions } from "../provider.svelte.js";
import type { MaybeGetter, ReactiveValue } from "../types.js";

export function useAvatar(
	seed: MaybeGetter<string>,
	options?: MaybeGetter<AvatarOptions | undefined>,
): ReactiveValue<PictumAsset> {
	const pictumOptions = usePictumOptions(options);
	const asset = $derived.by(() =>
		avatar(readMaybeGetter(seed) as string, {
			...(readMaybeGetter(options) ?? {}),
			...pictumOptions.current,
		}),
	);

	return reactiveValue(() => asset);
}

export function useIcon(
	name: MaybeGetter<string>,
	options?: MaybeGetter<IconOptions | undefined>,
): ReactiveValue<PictumAsset> {
	const pictumOptions = usePictumOptions(options);
	const asset = $derived.by(() =>
		icon(readMaybeGetter(name) as string, pictumOptions.current),
	);

	return reactiveValue(() => asset);
}

export function usePlaceholder(
	options: MaybeGetter<PlaceholderOptions>,
): ReactiveValue<PictumAsset> {
	const pictumOptions = usePictumOptions(options);
	const asset = $derived.by(() =>
		placeholder({
			...(readMaybeGetter(options) as PlaceholderOptions),
			...pictumOptions.current,
		} as PlaceholderOptions),
	);

	return reactiveValue(() => asset);
}

export function useQrCode(
	value: MaybeGetter<string>,
	options?: MaybeGetter<QrCodeOptions | undefined>,
): ReactiveValue<PictumAsset> {
	const pictumOptions = usePictumOptions(options);
	const asset = $derived.by(() =>
		qrCode(readMaybeGetter(value) as string, {
			...(readMaybeGetter(options) ?? {}),
			...pictumOptions.current,
		}),
	);

	return reactiveValue(() => asset);
}

function reactiveValue<Value>(getValue: () => Value): ReactiveValue<Value> {
	return {
		get current() {
			return getValue();
		},
	};
}
