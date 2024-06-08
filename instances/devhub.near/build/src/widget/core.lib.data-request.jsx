const DataRequest = {
  paginated: (requestByNumber, { buffer, startWith }) => {
    const startPageNumber = startWith ?? 1,
      accumulatedResponse = buffer ?? [];
    const latestResponse = requestByNumber(startPageNumber) ?? [];
    if (latestResponse.length === 0) {
      return accumulatedResponse;
    } else {
      return DataRequest.paginated(requestByNumber, {
        buffer: [...accumulatedResponse, ...latestResponse],
        startWith: startPageNumber + 1,
      });
    }
  },
};
return { DataRequest };
