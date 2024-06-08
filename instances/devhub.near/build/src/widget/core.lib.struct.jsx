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
const isEqual = (input1, input2) => {
  const input1Str = JSON.stringify(input1);
  const input2Str = JSON.stringify(input2);
  return input1Str === input2Str;
};
const toOrdered = (input) => {
  if (typeof input !== "object" || input === null) {
    return {};
  }
  return Object.keys(input)
    .sort()
    .reduce((output, key) => ({ ...output, [key]: input[key] }), {});
};
const pick = (sourceObject, keysToPick) => {
  if (typeof sourceObject !== "object" || sourceObject === null) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(sourceObject).filter(([key, _]) => keysToPick.includes(key))
  );
};
const typeMatch = (input) =>
  input !== null && typeof input === "object" && !Array.isArray(input);
const defaultFieldUpdate = ({
  input,
  lastKnownValue,
  params: { arrayDelimiter },
}) => {
  switch (typeof input) {
    case "boolean":
      return input;
    case "object": {
      if (Array.isArray(input) && typeof lastKnownValue === "string") {
        return input.join(arrayDelimiter ?? ",");
      } else {
        return Array.isArray(lastKnownValue)
          ? [...lastKnownValue, ...input]
          : { ...lastKnownValue, ...input };
      }
    }
    case "string":
      return Array.isArray(lastKnownValue)
        ? input.split(arrayDelimiter ?? ",").map((string) => string.trim())
        : input;
    default: {
      if ((input ?? null) === null) {
        switch (typeof lastKnownValue) {
          case "boolean":
            return !lastKnownValue;
          default:
            return lastKnownValue;
        }
      } else return input;
    }
  }
};
return {
  deepFieldUpdate,
  isEqual,
  pick,
  toOrdered,
  typeMatch,
  defaultFieldUpdate,
};
