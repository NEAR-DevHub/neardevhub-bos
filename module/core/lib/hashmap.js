const HashMap = {
  isDefined: (input) =>
    input !== null && typeof input === "object" && !Array.isArray(input),

  isEqual: (input1, input2) =>
    HashMap.isDefined(input1) && HashMap.isDefined(input2)
      ? JSON.stringify(HashMap.toOrdered(input1)) ===
        JSON.stringify(HashMap.toOrdered(input2))
      : false,

  toOrdered: (input) =>
    Object.keys(input)
      .sort()
      .reduce((output, key) => ({ ...output, [key]: input[key] }), {}),

  pick: (object, subsetKeys) =>
    Object.fromEntries(
      Object.entries(object ?? {}).filter(([key, _]) =>
        subsetKeys.includes(key)
      )
    ),
};
