const local = "http://localhost:8888/";

const production = "https://getdrunk.onrender.com";

export const serverBaseUrl: string = production;

export function getGameServerUrl(gameName: string): string {
  return `${serverBaseUrl}${gameName}`;
}
