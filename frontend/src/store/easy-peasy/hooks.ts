import { createTypedHooks } from "easy-peasy";
import type { EasyPeasyStore } from ".";
const { useStoreState, useStoreActions } = createTypedHooks<EasyPeasyStore>();
export { useStoreState, useStoreActions };
