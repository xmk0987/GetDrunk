export const serverBaseUrl: string = "http://localhost:8888/";

export function getGameServerUrl(gameName: string): string {
  return `${serverBaseUrl}${gameName}`;
}
