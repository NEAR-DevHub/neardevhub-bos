const HashMap = {
  isEqual: (input1, input2) =>
    JSON.stringify(HashMap.toOrdered(input1)) ===
    JSON.stringify(HashMap.toOrdered(input2)),

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
