export type TrailingSlashMode = "never" | "always" | "preserve";

export interface AIRequestInfo {
  url: URL;
  botName: string | null;
  botVendor: string | null;
  acceptHeader: string;
  pathname: string;
  cacheStatus: "hit" | "miss";
  tokens: number;
}

export interface MissInfo {
  url: URL;
  botName: string | null;
  pathname: string;
  acceptHeader: string;
}
