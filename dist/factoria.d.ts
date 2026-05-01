import { Faker } from '@faker-js/faker';

export declare namespace Factoria {
	export type Attributes = Record<string, any>;
	export type Overrides<T> = Partial<{
		[P in keyof T]: Overrides<T[P]> | Builder<T[P]> | null;
	}> | ((faker: Faker) => any);
	export type StateDefinition = ((faker: Faker) => Factoria.Attributes) | Attributes;
	export interface ModelRegistry {
	}
	type RegisteredName = keyof ModelRegistry & string;
	export interface Builder<T> {
		state(...names: string[]): Builder<T>;
		count(n: 1): Builder<T>;
		count(n: number): ManyBuilder<T>;
		make(): T;
		make(overrides: Overrides<T>): T;
		make(count: number): T[];
		make(overrides: Overrides<T>, count: number): T[];
	}
	export interface ManyBuilder<T> {
		state(...names: string[]): ManyBuilder<T>;
		make(overrides?: Overrides<T>): T[];
	}
	export type Factoria = {
		<K extends RegisteredName>(name: K): Builder<ModelRegistry[K]>;
		<T>(name: string): Builder<T>;
		define<K extends RegisteredName>(name: K, handler: (faker: Faker) => Overrides<ModelRegistry[K]>, states?: Record<string, StateDefinition>): Factoria;
		define<T>(name: string, handler: (faker: Faker) => Overrides<T>, states?: Record<string, StateDefinition>): Factoria;
		seed(value?: number | number[]): Factoria;
	};
	export {};
}
declare const factory: Factoria.Factoria;

export {
	factory as default,
};

export {};
