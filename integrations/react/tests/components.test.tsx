import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
	Avatar,
	Icon,
	PictumProvider,
	Placeholder,
	QrCode,
	useAvatar,
} from "../src";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("components", () => {
	test("renders an inline icon without caller suspense and caches its canonical SVG", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path stroke="currentColor" d="M1 1h22"/></svg>',
				),
			);
		vi.stubGlobal("fetch", fetchMock);

		const screen = await render(
			<>
				<Icon
					name="lucide:test-icon"
					aria-label="Test icon"
					className="icon"
					options={{ baseUrl: "https://icons.example.com/v1" }}
				/>
				<Icon
					name="lucide:test-icon"
					aria-label="Second test icon"
					options={{ baseUrl: "https://icons.example.com/v1" }}
				/>
			</>,
		);

		await vi.waitFor(() => {
			expect(screen.container.querySelectorAll("svg path")).toHaveLength(2);
		});

		const svg = screen.container.querySelector("svg");
		expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
		expect(svg).toHaveAttribute("aria-label", "Test icon");
		expect(svg).toHaveClass("icon");
		expect(svg?.querySelector("path")).toHaveAttribute(
			"stroke",
			"currentColor",
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	test("uses provider options and lets components override them", async () => {
		const screen = await render(
			<PictumProvider options={{ baseUrl: "https://staging.example.com/v1" }}>
				<Avatar seed="ada-lovelace" alt="Ada" />
				<QrCode
					value="hello"
					alt="Hello"
					options={{ baseUrl: "https://preview.example.com/v1" }}
				/>
			</PictumProvider>,
		);

		expect(screen.getByAltText("Ada")).toHaveAttribute(
			"src",
			"https://staging.example.com/v1/avatar.svg?seed=ada-lovelace",
		);
		expect(screen.getByAltText("Hello")).toHaveAttribute(
			"src",
			"https://preview.example.com/v1/qrcode.svg?data=aGVsbG8%3D",
		);
	});

	test("merges provider and hook options with hook options taking precedence", async () => {
		function HookExample() {
			const inherited = useAvatar("ada-lovelace");
			const overridden = useAvatar("grace-hopper", {
				baseUrl: "https://preview.example.com/v1",
				format: "webp",
			});

			return (
				<>
					<span data-testid="inherited">{inherited.url}</span>
					<span data-testid="overridden">{overridden.url}</span>
				</>
			);
		}

		const screen = await render(
			<PictumProvider options={{ baseUrl: "https://staging.example.com/v1" }}>
				<HookExample />
			</PictumProvider>,
		);

		expect(screen.getByTestId("inherited")).toHaveTextContent(
			"https://staging.example.com/v1/avatar.svg?seed=ada-lovelace",
		);
		expect(screen.getByTestId("overridden")).toHaveTextContent(
			"https://preview.example.com/v1/avatar.webp?seed=grace-hopper",
		);
	});

	test("renders an unfiltered portrait for the any gender", async () => {
		const screen = await render(
			<Avatar
				seed="customer-123"
				variant="portrait"
				gender="any"
				alt="Customer"
			/>,
		);

		expect(screen.getByAltText("Customer")).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/avatar.webp?seed=customer-123&variant=portrait",
		);
	});

	test("requests a portrait source size without forwarding it to the image", async () => {
		const screen = await render(
			<Avatar
				seed="customer-456"
				variant="portrait"
				size={256}
				width={96}
				height={128}
				alt="Sized customer"
			/>,
		);

		const image = screen.getByAltText("Sized customer");
		expect(image).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/avatar.webp?seed=customer-456&variant=portrait&size=256",
		);
		expect(image).toHaveAttribute("width", "96");
		expect(image).toHaveAttribute("height", "128");
		expect(image).not.toHaveAttribute("size");
	});

	test("forwards QR code options without leaking DOM attributes", async () => {
		const screen = await render(
			<QrCode
				value="hello"
				quietZone={false}
				foreground="#11223344"
				background="#aabbccdd"
				alt="Custom QR code"
			/>,
		);

		const image = screen.getByAltText("Custom QR code");
		expect(image).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/qrcode.svg?data=aGVsbG8%3D&quiet_zone=0&foreground=%2311223344&background=%23aabbccdd",
		);
		expect(image).not.toHaveAttribute("quietzone");
		expect(image).not.toHaveAttribute("foreground");
		expect(image).not.toHaveAttribute("background");
	});

	test("sets placeholder logical image dimensions", async () => {
		const screen = await render(
			<Placeholder
				width={640}
				height={360}
				format="webp"
				density={3}
				text="Coming soon"
				alt="Coming soon"
			/>,
		);

		const image = screen.getByAltText("Coming soon");
		expect(image).toHaveAttribute("width", "640");
		expect(image).toHaveAttribute("height", "360");
		expect(image).toHaveAttribute(
			"src",
			"https://pictum.dev/v1/placeholder.webp?width=640&height=360&density=3&text=Coming+soon",
		);
	});
});
