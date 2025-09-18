import { ServiceName } from "../enums";
import { WindowConfig } from "../types";

export const windowConfig: WindowConfig = {
    mousePositionFuzziness: 100,
    onFireflyMouseOver: ({currentFirefly: f}) => {
        f.size.value = 10
    },
    onFireflyMouseLeave: ({currentFirefly: f}) => {
        f.size.nextValueFn = ({currentFirefly}) => {
            return currentFirefly.size.value + .1 ;
        }
    }
};