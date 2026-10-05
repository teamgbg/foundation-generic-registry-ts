/**
 * @system generic-registry
 * @status handwritten
 */

import type { RegistryStats } from "./types.ts";

interface ManagedRegistry {
	readonly name: string;
	readonly size: number;
	enabled: boolean;
	keys(): string[];
	get(key: string): unknown;
}

const registries = new Map<string, ManagedRegistry>();

export const genericRegistryIndex = {
	register(registry: ManagedRegistry): void {
		if (registries.has(registry.name)) {
			throw new Error(
				`[generic-registry] duplicate registry name: "${registry.name}"`,
			);
		}
		registries.set(registry.name, registry);
	},

	get(name: string): ManagedRegistry | undefined {
		return registries.get(name);
	},

	getAll(): RegistryStats[] {
		return [...registries.values()].map((r) => ({
			name: r.name,
			size: r.size,
			enabled: r.enabled,
			keys: r.keys(),
		}));
	},

	disable(name: string): void {
		const entry = registries.get(name);
		if (entry) entry.enabled = false;
	},

	enable(name: string): void {
		const entry = registries.get(name);
		if (entry) entry.enabled = true;
	},

	isEnabled(name: string): boolean {
		return registries.get(name)?.enabled ?? true;
	},
};
