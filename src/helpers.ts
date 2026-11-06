/**
 * Get the value of an item from an array of {key, value} objects where the object has the specified key.
 * Useful for processing custom arrtibutes and metafields.
 */
export function getValueForItemWithKey(array: {key: string, value: string}[], key: string): string | null {
    var ret = array.find(i => i.key == key)?.value ?? null;
    if (ret == null)
        console.warn(`Couldn't find a value for item with key "${key}"!`);
    return ret;
}

/**
 * Strip all non number characters and parse to float.
 */
export function stripNonNumbers(input: string | null): number | null {
    if (input == null) return null;
    return Number.parseFloat(input.replace(/\D\./g,''));
}

/**
 * Get the alphabet letter from the zero-indexed string.
 * 0>A, 1>B, 2>C, etc
 */
export function letterFromIndex(index: number): string {
    //https://stackoverflow.com/a/36129812
    return (index + 10).toString(36).toUpperCase();
}