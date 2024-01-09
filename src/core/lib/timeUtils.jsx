function getRelativeTime(timestamp) {
  const currentTimestamp = new Date().getTime();
  const targetTimestamp = new Date(timestamp).getTime();

  const differenceInMilliseconds = currentTimestamp - targetTimestamp;
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );
  const differenceInHours = Math.floor(
    (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (differenceInDays > 0) {
    return `${differenceInDays} ${differenceInDays === 1 ? "day" : "days"} ago`;
  } else if (differenceInHours > 0) {
    return `${differenceInHours} ${
      differenceInHours === 1 ? "hour" : "hours"
    } ago`;
  } else {
    return "Less than an hour ago";
  }
}

return { getRelativeTime };
