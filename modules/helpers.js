export function secondsToReadableTime (seconds) {
  let time = new Date(null)
  time.setSeconds(seconds)
  time = time.toISOString()
  time = (seconds > 3600)
    ? time.substr(11, 8)
    : time.substr(14, 5)
  time = (time.substr(0, 1) === '0') ? time.substring(1) : time
  return String(time)
}
