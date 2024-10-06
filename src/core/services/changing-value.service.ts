import { ChangeType, ChangingValueMethod } from "../enums";
import { Service } from "../interfaces";
import { Firefly } from "../models";
import { ChangingValueConfig, ChangingValueKey } from "../types";
import { Utilities } from "../utilities";

export class ChangingValueService
  implements Service {

  constructor(
    private readonly key: ChangingValueKey<Firefly>,
    private readonly config: ChangingValueConfig,
  ) {
    this.config = config;
    this.key = key;
  }

  public set(firefly: Firefly) {
    firefly[this.key].value = Utilities.getValue(this.config.value);

    firefly[this.key].changeType = this.config.type

    switch (this.config.type) {
      case ChangeType.Incremental:
        firefly[this.key].maxPossible = Utilities.getValue(this.config.maxPossibleValue);
        firefly[this.key].increment = Utilities.getValue(this.config.increment);
        break;
      case ChangeType.Decremental:
        firefly[this.key].minPossible = Utilities.getValue(this.config.minPossibleValue);
        firefly[this.key].decrement = Utilities.getValue(this.config.decrement);
        break;
      case ChangeType.FlipFlop:
        firefly[this.key].maxPossible = Utilities.getValue(this.config.maxPossibleValue);
        firefly[this.key].increment = Utilities.getValue(this.config.increment);
        firefly[this.key].minPossible = Utilities.getValue(this.config.minPossibleValue);
        firefly[this.key].decrement = Utilities.getValue(this.config.decrement);
        firefly[this.key].method = this.config.startingMethod === ChangingValueMethod.Random
          ? Math.random() < .5
            ? ChangingValueMethod.Increment
            : ChangingValueMethod.Decrement
          : this.config.startingMethod;
        break
    }
  }

  public execute(firefly: Firefly): void {
    const fireflyProp = firefly[this.key];

    switch (fireflyProp.changeType) {
      case ChangeType.Incremental:
        fireflyProp.value = Math.min(
          fireflyProp.value + fireflyProp.increment,
          fireflyProp.maxPossible ?? 0
        )
        break;
      case ChangeType.Decremental:
        fireflyProp.value = Math.max(
          fireflyProp.value - fireflyProp.decrement,
          fireflyProp.minPossible ?? 0
        )
        break;
      case ChangeType.FlipFlop:
        switch (fireflyProp.method) {
          case ChangingValueMethod.Increment:
            fireflyProp.value = Math.min(
              fireflyProp.value + fireflyProp.increment,
              fireflyProp.maxPossible ?? 0
            )
            if (fireflyProp.value === fireflyProp.maxPossible) fireflyProp.method = ChangingValueMethod.Decrement
            break;
          case ChangingValueMethod.Decrement:
            fireflyProp.value = Math.max(
              fireflyProp.value - fireflyProp.decrement,
              fireflyProp.minPossible ?? 0
            )

            if (fireflyProp.value === fireflyProp.minPossible) fireflyProp.method = ChangingValueMethod.Increment
            break;
        }
        break;
      case ChangeType.ChangeCallback:
        fireflyProp.value = this.config.type === ChangeType.ChangeCallback
          ? this.config.changer(firefly)
          : fireflyProp.value
        break
      case ChangeType.NoChange:
        break;
    }
  }
}