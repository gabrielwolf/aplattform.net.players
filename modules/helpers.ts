export const secondsToReadableTime = (seconds: number): string => {
  const date = new Date(0, 0, 0, 0, 0, 0, 0)
  date.setSeconds(seconds)
  let readableTime: string = date.toISOString()
  readableTime = seconds > 3600
      ? readableTime.substr(11, 8)
      : readableTime.substr(14, 5)
  readableTime = readableTime.substr(0, 1) === '0' ? readableTime.substring(1) : readableTime
  return readableTime
};
