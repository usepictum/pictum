import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, describe, expect, test, vi } from "vitest";
import pictum from "../src";
import { Avatar, Icon, Placeholder, QrCode } from "../src/components";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("integration", () => {
	test("configures global Pictum options through Vite", async () => {
		const integration = pictum({
			baseUrl: "https://staging.example.com/pictum/v1",
		});
		const updateConfig = vi.fn();
		const hook = integration.hooks["astro:config:setup"];

		if (hook === undefined) {
			throw new Error("Missing Astro config setup hook.");
		}

		await hook({ updateConfig } as never);

		expect(integration.name).toBe("@pictum/astro");
		expect(updateConfig).toHaveBeenCalledWith({
			vite: {
				define: {
					__PICTUM_ASTRO_OPTIONS__:
						'{"baseUrl":"https://staging.example.com/pictum/v1"}',
				},
			},
		});
	});
});

describe("components", () => {
	test("renders an inline icon and caches its canonical SVG", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path stroke="currentColor" d="M1 1h22"/></svg>',
				),
			);
		vi.stubGlobal("fetch", fetchMock);
		const container = await AstroContainer.create();
		const props = {
			name: "lucide:astro-test-icon",
			"aria-label": "Test icon",
			class: "icon",
			options: { baseUrl: "https://icons.example.com/v1" },
		};

		const [first, second] = await Promise.all([
			container.renderToString(Icon, { props }),
			container.renderToString(Icon, { props }),
		]);

		expect(first).toContain('viewBox="0 0 24 24"');
		expect(first).toContain('aria-label="Test icon"');
		expect(first).toContain('class="icon"');
		expect(first).toContain('stroke="currentColor"');
		expect(second).toContain("<path");
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	test("evicts failed icon requests from the cache", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))
			.mockResolvedValueOnce(
				new Response('<svg viewBox="0 0 16 16"><path d="M1 1h14"/></svg>'),
			);
		vi.stubGlobal("fetch", fetchMock);
		const container = await AstroContainer.create();
		const props = {
			name: "lucide:astro-retry-icon",
			options: { baseUrl: "https://retry.example.com/v1" },
		};

		await expect(container.renderToString(Icon, { props })).rejects.toThrow();
		const result = await container.renderToString(Icon, { props });

		expect(result).toContain('viewBox="0 0 16 16"');
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	test("renders image assets with component options and native attributes", async () => {
		const container = await AstroContainer.create();
		const avatar = await container.renderToString(Avatar, {
			props: {
				seed: "ada-lovelace",
				variant: "gradient",
				format: "webp",
				alt: "Ada Lovelace",
				loading: "lazy",
				class: "avatar",
				options: { baseUrl: "https://assets.example.com/v1" },
			},
		});
		const qrCode = await container.renderToString(QrCode, {
			props: {
				value: "hello",
				quietZone: false,
				foreground: "#11223344",
				background: "#aabbccdd",
				alt: "Hello",
				options: { baseUrl: "https://assets.example.com/v1" },
			},
		});
		const portraitAvatar = await container.renderToString(Avatar, {
			props: {
				seed: "customer-123",
				variant: "portrait",
				gender: "any",
				alt: "Customer",
			},
		});

		expect(avatar).toContain(
			'src="https://assets.example.com/v1/avatar.webp?seed=ada-lovelace&amp;variant=gradient"',
		);
		expect(avatar).toContain('alt="Ada Lovelace"');
		expect(avatar).toContain('loading="lazy"');
		expect(avatar).toContain('class="avatar"');
		expect(qrCode).toContain(
			'src="https://assets.example.com/v1/qrcode.svg?data=aGVsbG8%3D&amp;quiet_zone=0&amp;foreground=%2311223344&amp;background=%23aabbccdd"',
		);
		expect(qrCode).not.toMatch(/<img[^>]*\sforeground=/);
		expect(qrCode).not.toMatch(/<img[^>]*\sbackground=/);
		expect(portraitAvatar).toContain(
			'src="https://pictum.dev/v1/avatar.webp?seed=customer-123&amp;variant=portrait"',
		);
	});

	test("uses avatar source size without forwarding it to the image", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(Avatar, {
			props: {
				seed: "customer-256",
				variant: "portrait",
				size: 256,
				alt: "Sized customer",
			},
		});

		expect(result).toContain(
			'src="https://pictum.dev/v1/avatar.webp?seed=customer-256&amp;variant=portrait&amp;size=256"',
		);
		expect(result).not.toMatch(/<img[^>]*\ssize=/);
	});

	test("sets placeholder logical image dimensions", async () => {
		const container = await AstroContainer.create();
		const result = await container.renderToString(Placeholder, {
			props: {
				width: 640,
				height: 360,
				format: "webp",
				density: 3,
				text: "Coming soon",
				alt: "Coming soon",
			},
		});

		expect(result).toContain('width="640"');
		expect(result).toContain('height="360"');
		expect(result).toContain(
			'src="https://pictum.dev/v1/placeholder.webp?width=640&amp;height=360&amp;density=3&amp;text=Coming+soon"',
		);
	});
});
