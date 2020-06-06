import { join } from 'path';

export function getOsEnv(key: string): string {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
}

export function getOsEnvOptional(key: string): string | undefined {
  return process.env[key];
}

export function getPath(path: string): string {
  return join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js');
}

export function getPaths(paths: string[]): string[] {
  return paths.map(p => getPath(p));
}

export function getOsPath(key: string): string {
  return getPath(getOsEnv(key));
}

export function getOsPaths(key: string): string[] {
  return getPaths(getOsEnvArray(key));
}

export function getOsEnvArray(key: string, delimiter: string = ','): string[] {
  const arr = (process.env[key] && process.env[key].split(delimiter)) || [];
  if (arr.length === 0) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return arr;
}

export function toNumber(value: string): number {
  return parseInt(value, 10);
}

export function toBool(value: string): boolean {
  return value === 'true';
}

export function normalizePort(port: string): number | string | boolean {
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    // named pipe
    return port;
  }
  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }
  return false;
}
