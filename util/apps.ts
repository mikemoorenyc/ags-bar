// @ts-ignore
import AstalApps from "gi://AstalApps?version=0.1";
// @ts-ignore
import AstalHyprland from "gi://AstalHyprland?version=0.1";
const appInfoCache = new Map<string, AstalApps.Application | null>();
const MAX_CACHE_SIZE = 50;


