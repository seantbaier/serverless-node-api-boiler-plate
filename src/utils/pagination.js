export default function getSkipValue(req) {
  const safeReq = req || {};

  const { query: { skip: customSkip = "0" } = {}, skip = 0 } = safeReq;

  return skip || Math.max(parseInt(customSkip, 10), 0);
}
