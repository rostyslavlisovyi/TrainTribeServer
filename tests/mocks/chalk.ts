const passthrough = (text?: string) => text ?? "";

const chalkProxy = new Proxy(passthrough, {
  get: () => passthrough
});

export default chalkProxy;
