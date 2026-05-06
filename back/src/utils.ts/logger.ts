function format(msg: unknown, ...args: unknown[]): string {
  const msgStr = typeof msg === 'string' ? msg : JSON.stringify(msg);
  return args.length
    ? `${msgStr} ${args.map(a => JSON.stringify(a)).join(' ')}`
    : msgStr;
}

const logger = {
  info: (msg: unknown, ...args: unknown[]) => {
    process.stdout.write(format(msg, ...args) + '\n');
  },
  warn: (msg: unknown, ...args: unknown[]) => {
    process.stdout.write(format(msg, ...args) + '\n');
  },
  error: (msg: unknown, ...args: unknown[]) => {
    process.stderr.write(format(msg, ...args) + '\n');
  },
  debug: (msg: unknown, ...args: unknown[]) => {
    process.stdout.write(format(msg, ...args) + '\n');
  },
};

export default logger;
