import { setupStore } from "@/store/store";

export async function persistPurge() {
  const { persistor } = await setupStore();
  await persistor.purge();
}
