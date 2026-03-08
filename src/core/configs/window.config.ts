import { WindowConfig } from "../types";
import { Utilities } from "../utilities";

export const windowConfig: WindowConfig = {
    mousePositionFuzziness: 60,
    onFireflyMouseEnter: ({firefly}) =>{
        // const coinToss: boolean = Math.random() < .5;
        firefly.hue.set(40)
        firefly.size.set(v => 30)
        if (!firefly.rotation.nextValueFn) {
            const additiveRotation =  Utilities.getRandomNumberBetween(
                Utilities.range(.04)
            );

            firefly.rotation.nextValueFn = ({current}) => current +additiveRotation
        }
        firefly.lightness.set(55)

        if (!firefly.speedY.nextValueFn) {
            firefly.speedY.nextValueFn = ({ current }) => current + Math.random() / 10
        }
        // firefly.size.set(v => v * 1.002)
        // firefly.speedX.set(v =>  coinToss ? v + 1 : v - 1)
        // firefly.speedX.resetIteration();
    },
    onFireflyMouseLeave: () => {}
};