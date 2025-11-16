import { JitterConfig } from "../types";
import { Utilities } from "../utilities";

export const jitterConfig: JitterConfig = {
    jitterX: Utilities.range(1, 12),
    jitterY: Utilities.range(1, 12),
}