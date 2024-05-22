import cron from "node-cron"
import { removeExpiredNonces } from "../middlewares/nonce"

export const nonceCRON = cron.schedule(
    "0 0 * * *", 
    removeExpiredNonces,
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    },
)
