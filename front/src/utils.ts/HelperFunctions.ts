export function ensure<T>(argument: T | undefined | null, message: string = 'Wrong type'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}