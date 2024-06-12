const DataRequest = {
  /**
   * Requests all the data from non-empty pages of the paginated API.
   *
   * **Notice: currently expected to work only with array responses.**
   *
   * @param {object} parameters
   * 	Request parameters including the number of page to start with,
   * 	and an accumulated response buffer, if it exists.
   *
   * @param {array | null | undefined} parameters.buffer
   * @param {number} parameters.startWith
   *
   * @param {(pageNumber: number) => array} requestByNumber
   *
   * @returns {array} The final accumulated response.
   */
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
