import type { PictumOptions } from "pictum";
import { createContext, type ReactNode, useContext } from "react";

const PictumContext = createContext<PictumOptions>({});

export interface PictumProviderProps {
	children?: ReactNode;
	options?: PictumOptions;
}

export function PictumProvider({ children, options }: PictumProviderProps) {
	const inherited = useContext(PictumContext);
	const value = mergePictumOptions(inherited, options);

	return (
		<PictumContext.Provider value={value}>{children}</PictumContext.Provider>
	);
}

export function usePictumOptions(options?: PictumOptions): PictumOptions {
	return mergePictumOptions(useContext(PictumContext), options);
}

function mergePictumOptions(
	inherited: PictumOptions,
	overrides?: PictumOptions,
): PictumOptions {
	const baseUrl = overrides?.baseUrl ?? inherited.baseUrl;
	return baseUrl === undefined ? {} : { baseUrl };
}
