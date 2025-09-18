import { CONSTANTS } from "../constants/constants";
import { ServiceName } from "../enums";
import { WindowConfig } from "../types";

export const windowConfig: WindowConfig = {
    mousePositionFuzziness: 100,
    onFireflyMouseEnter: ({currentFirefly: f}) =>{},
    onFireflyMouseLeave: ({currentFirefly: f}) => {}
};