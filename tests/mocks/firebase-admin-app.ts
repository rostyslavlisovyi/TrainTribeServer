export const apps: Array<Record<string, unknown>> = [];

export const initializeApp = () => {
  const app = {};
  apps.push(app);
  return app;
};

export const getApps = () => apps;

export const cert = () => ({}) as unknown;
