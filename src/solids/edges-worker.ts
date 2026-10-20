// The setup worker (R9): receives a package v2 blob, decodes it, tessellates the shapes and finds their edges, and
// posts the arrays back. Bundle this file as its own module worker; src/solids/setup.ts `setupInWorker` talks to it.
import { setupForWorker } from "./setup";

interface WorkerScope {
  onmessage: ((e: MessageEvent<ArrayBuffer>) => void) | null;
  postMessage(message: unknown, transfer: ArrayBuffer[]): void;
}
const scope = self as unknown as WorkerScope;

scope.onmessage = (e) => {
  void setupForWorker(new Uint8Array(e.data)).then(({ result, transfer }) => scope.postMessage(result, transfer));
};
