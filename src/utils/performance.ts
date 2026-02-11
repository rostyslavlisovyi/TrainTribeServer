const NS_PER_MS = 1e6;

export type Timer = () => number;

export function createTimer(): Timer {
  const start = process.hrtime.bigint();
  return () => Number(process.hrtime.bigint() - start) / NS_PER_MS;
}

const coldStartStart = process.hrtime.bigint();
let coldStartLogged = false;

interface PerformanceMetrics {
  totalMs: number;
  moduleSetupMs: number;
  dbConnectionMs: number;
  timestamp?: string;
}

export function logInitializationMetrics(payload: PerformanceMetrics): void {
  const basePayload = {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString()
  };

  if (!coldStartLogged) {
    const coldStartMs =
      Number(process.hrtime.bigint() - coldStartStart) / NS_PER_MS;
    coldStartLogged = true;
    console.log(
      JSON.stringify({
        event: "app_initialization",
        coldStartMs,
        ...basePayload
      })
    );
    return;
  }

  console.log(
    JSON.stringify({
      event: "app_initialization",
      ...basePayload
    })
  );
}
