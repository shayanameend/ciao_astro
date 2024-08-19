/**
 * @module
 * The opiniated @usesvelte/core package is a collection of wraper functions to easily manage svelte applications
 */

import { onMount, onDestroy } from "svelte";

/**
 * The Ref type represents a exposed value of reactive proxy object under the hood.
 */
export type Ref<T> = { value: T };

/**
 * The Store type is a representation of what properties and methods should be implemented to be utilized as a store.
 */
export type Store<T> = {
	value: T | undefined;
	get(): T;
	set(newValue: T): void;
	listen(listener: (value: T, oldValue: T) => void): () => void;
	subscribe(listener: (value: T, oldValue?: T | undefined) => void): () => void;
	off(): void;
	lc: number;
};

/**
 * The useMount function schedules a callback to run as soon as the component has been mounted to the DOM.
 *
 * ```ts
 * useMount(() => {
 *  console.log("Component Mounted")
 * })
 * ```
 *
 * @param fn The callback function to run as soon as the component has been mounted to the DOM.
 */
export function useMount(fn: () => void): void {
	onMount(fn);
}

/**
 * The useEffect function schedules a callback to run as soon as the component has been mounted to the DOM and whenever dependent state changes.
 *
 * ```ts
 * useEffect(() => {
 *  console.log("Component Mounted or Dependent State Updated")
 * })
 * ```
 *
 * @param fn The callback function to run as soon as the component has been mounted to the DOM and whenever dependent state changes.
 * @param options Allows to control the behaviour.
 * @param forcedDependencies Allows to run effect forcefully.
 */
export function useEffect(
	fn: () => void,
	options: {
		pre?: boolean;
		// biome-ignore lint/suspicious/noExplicitAny: <any value can cause update>
		deps?: Ref<any>[];
	} = { pre: false, deps: [] },
): void {
	if (options.pre) {
		$effect.pre(() => {
			fn();

			if (options.deps) {
				for (const item of options.deps) {
					item.value;
				}
			}
		});
	} else {
		useMount(() => {
			$effect.pre(() => {
				fn();

				if (options.deps) {
					for (const item of options.deps) {
						item.value;
					}
				}
			});
		});
	}
}

/**
 * The useUnmount function schedules a callback to run as soon as the component has been unmounted from the DOM.
 *
 * ```ts
 * useUnmount(() => {
 *  console.log("Component Unmounted")
 * })
 * ```
 *
 * @param fn The callback function to run as soon as the component has been unmounted from the DOM.
 */
export function useUnmount(fn: () => void): void {
	onDestroy(fn);
}

/**
 * The useRef function returns value as a reactive proxy object.
 *
 * ```ts
 * const count = useRef(0, (value) => {
 *  console.log("Count Updated: ", value)
 * })
 *
 * console.log("Count: ", count.value)
 * ```
 *
 * @param item The initial value.
 * @param listener The callback function to run as soon as the component has been mounted to the DOM and whenever value changes.
 * @returns The reactive proxy object containing value.
 */
export function useRef<T>(
	item: T,
	listener?: (currentValue: Readonly<T>) => void,
): Ref<T> {
	const reference = $state({ value: item }) as Ref<T>;

	if (listener) {
		useEffect(() => {
			listener(reference.value);
		});
	}

	return reference;
}

/**
 * The useComputed function returns a reactive proxy object which also updates when the given function's utilized reactive proxy objects updates.
 *
 * ```ts
 * const count = useRef(0, (value) => {
 *  console.log("Count Updated: ", value)
 * })
 * const dbCount = useComputed(() => count.value * 2, (value) => {
 *  console.log("Double Count Updated: ", value)
 * })
 *
 * console.log("Count: ", count.value)
 * console.log("Double Count: ", dbCount.value)
 * ```
 *
 * @param fn The callback function for initial source.
 * @param listener The callback function to run as soon as the component has been mounted to the DOM and whenever state changes.
 * @returns The reactive proxy object containing value.
 */
export function useComputed<T>(
	fn: () => T,
	listener?: (currentValue: Readonly<T>) => void,
): Ref<T> {
	const reference = $state({ value: fn() }) as Ref<T>;

	useEffect(() => {
		reference.value = fn();

		if (listener) {
			listener(reference.value);
		}
	});

	return reference;
}

/**
 * The useStore function returns a reactive proxy object of the store.
 *
 * ```ts
 * const store = useRef(themeStore, (newValue, oldValue) => {
 *  console.log("Theme Updated: ", oldValue, newValue)
 * })
 *
 * console.log("Theme: ", store.value)
 * ```
 * @param store The store.
 * @param listener The callback function to run as soon as the component has been mounted to the DOM and whenever store changes.
 * @returns The reactive proxy object containing value.
 */
export function useStore<T>(
	store: Store<T>,
	listener?: (
		newValue: Readonly<T>,
		oldValue?: Readonly<T> | undefined,
	) => void,
): Ref<T> {
	const reference = $state({ value: store.value }) as Ref<T>;

	useEffect(() => {
		store.set(reference.value);
	});

	store.listen((newValue) => {
		reference.value = newValue;
	});

	if (listener) {
		store.subscribe(listener);
	}

	return reference;
}
