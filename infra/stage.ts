export const domain = (() => {
  if ($app.stage === "production") return "opencode.ai"
  if ($app.stage === "dev") return "dev.opencode.ai"
  return `${$app.stage}.dev.opencode.ai`
})()

const CLOUDFLARE_ZONE_ID = new sst.Secret("CLOUDFLARE_ZONE_ID")
export const zoneID = CLOUDFLARE_ZONE_ID.value

new cloudflare.RegionalHostname("RegionalHostname", {
  hostname: domain,
  regionKey: "us",
  zoneId: zoneID,
})
