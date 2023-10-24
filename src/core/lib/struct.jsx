/**
 * Deeply updates an object's field based on the given path and transformation function.
 *
 * @param {Object} target - The target object to update.
 * @param {Array} path - The path to the field to update.
 * @param {Function} transform - The transformation function to apply.
 * @returns {Object} - The updated object.
 */
const deepFieldUpdate = (target, path, transform) => {
  if (path.length === 0) {
    return transform(target);
  }

  const [nextNodeKey, ...remainingPath] = path;

  return {
    ...target,
    [nextNodeKey]: deepFieldUpdate(
      target[nextNodeKey] ?? {},
      remainingPath,
      transform
    ),
  };
};

/**
 * Checks if two inputs (objects or arrays) are deeply equal.
 *
 * @param {Object|Array} input1 - The first input.
 * @param {Object|Array} input2 - The second input.
 * @returns {boolean} - True if the inputs are deeply equal, false otherwise.
 */
const isEqual = (input1, input2) => {
  const input1Str = JSON.stringify(input1);
  const input2Str = JSON.stringify(input2);
  return input1Str === input2Str;
};

/**
 * Creates a new object with sorted keys based on the input object.
 *
 * @param {Object} input - The input object.
 * @returns {Object} - A new object with sorted keys.
 */
const toOrdered = (input) => {
  if (typeof input !== "object" || input === null) {
    return {};
  }

  return Object.keys(input)
    .sort()
    .reduce((output, key) => ({ ...output, [key]: input[key] }), {});
};

/**
 * Picks specified keys from an object and returns a new object with those keys.
 *
 * @param {Object} sourceObject - The source object to pick keys from.
 * @param {Array} keysToPick - An array of keys to pick.
 * @returns {Object} - A new object containing the selected keys.
 */
const pick = (sourceObject, keysToPick) => {
  if (typeof sourceObject !== "object" || sourceObject === null) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(sourceObject).filter(([key, _]) => keysToPick.includes(key))
  );
};

/**
 * Checks if the input matches the expected type.
 *
 * @param {Object} input - The input to check.
 * @returns {boolean} - True if the input is an object and not an array or null, false otherwise.
 */
const typeMatch = (input) =>
  input !== null && typeof input === "object" && !Array.isArray(input);

return { deepFieldUpdate, isEqual, pick, toOrdered, typeMatch };
