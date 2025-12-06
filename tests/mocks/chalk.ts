const passthrough = (...args: unknown[]) =>
  args
    .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
    .join(" ");

const chalkMock = {
  red: passthrough,
  green: passthrough,
  yellow: passthrough,
  blue: passthrough,
  magenta: passthrough,
  cyan: passthrough
};

export default chalkMock;
export const red = passthrough;
export const green = passthrough;
export const yellow = passthrough;
export const blue = passthrough;
export const magenta = passthrough;
export const cyan = passthrough;
