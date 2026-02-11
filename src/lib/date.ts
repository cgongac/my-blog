import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { siteConfig } from "@/config/site";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(input: string | Date, tz: string = siteConfig.timezone): string {
  return dayjs(input).tz(tz).format("YYYY-MM-DD");
}

export function isValidDate(input: string): boolean {
  return dayjs(input).isValid();
}
