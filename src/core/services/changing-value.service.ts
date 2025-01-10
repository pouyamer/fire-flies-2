import { FireflyApp } from "../app";
import { ChangeType, ChangingValueMethod, ServiceName } from "../enums";
import { Service } from "../interfaces";
import { ChangingNumericalValueItem, Firefly, FireflyCanvas } from "../models";
import { ChangingValueConfig, ChangingValueKey, PossibleValue } from "../types";
import { Utilities } from "../utilities";

export class ChangingValueService
  implements Service {

  name;

  constructor(
    private readonly key: ChangingValueKey<Firefly>,
    private readonly canvas: FireflyCanvas,
    private readonly fireflies: Firefly[],
    private readonly config: ChangingValueConfig,
    name: ServiceName,
    private readonly app: FireflyApp,
  ) {
    this.name = name;
  }

    // the inner get value sets args for Utilities.getNumericValue in valueGenerator mode
    private getValue(firefly: Firefly, value: PossibleValue<number>) {
      if (
        Utilities.isRange(value) ||
        typeof value === "number" ||
        Array.isArray(value)
      ) {
        return Utilities.getNumericValue(value);
      }
      else {
        return Utilities.getNumericValue(value({
          currentFirefly: firefly,
          canvas: this.canvas,
          fireflies: this.fireflies,
          app: this.app
        }));
      }
    }

  public setOnSingleFirefly(firefly: Firefly) {
    if (!firefly.activeServices?.some(service => service.name === this.name)) {
      firefly.activeServices?.push(this)
    }
    
    firefly[this.key].value = this.getValue(
      firefly,
      this.config.value
    );

    firefly[this.key].changeType = this.config.type

    switch (this.config.type) {
      case ChangeType.Incremental:
        firefly[this.key].maxPossible = this.getValue(
          firefly,
          this.config.maxPossibleValue
        );

        firefly[this.key].increment = this.getValue(
          firefly,
          this.config.increment
        );

        break;
      case ChangeType.Decremental:
        firefly[this.key].minPossible = this.getValue(
          firefly,
          this.config.minPossibleValue
        );

        firefly[this.key].decrement = this.getValue(
          firefly,
          this.config.decrement
        );

        break;
        
      case ChangeType.FlipFlop:
        firefly[this.key].maxPossible = this.getValue(
          firefly,
          this.config.maxPossibleValue
        );

        firefly[this.key].increment = this.getValue(
          firefly,
          this.config.increment
        );

        firefly[this.key].minPossible = this.getValue(
          firefly,
          this.config.minPossibleValue
        );

        firefly[this.key].decrement = this.getValue(
          firefly,
          this.config.decrement
        );

        firefly[this.key].method = this.config.startingMethod === ChangingValueMethod.Random
          ? Math.random() < .5
            ? ChangingValueMethod.Increment
            : ChangingValueMethod.Decrement
          : this.config.startingMethod;
        break
    }
  }

  public setOnEveryFirefly(): void {
    for(let ff of this.fireflies) {
      this.setOnSingleFirefly(ff)
    }
  }

  private executeOnMaxCallBack(
    firefly: Firefly,
    fireflyProp: ChangingNumericalValueItem,
  ): void {
    if (
      fireflyProp.value === fireflyProp.maxPossible &&
      (
        this.config.type === ChangeType.Incremental ||
        this.config.type === ChangeType.FlipFlop
      ) &&
      this.config.onMaxReached
    ) {
      this.config.onMaxReached(
        firefly,
        this.canvas,
        this.fireflies,
        this.app
      )
    }
  }

  private executeOnMinCallBack(
    firefly: Firefly,
    fireflyProp: ChangingNumericalValueItem,
  ): void {
    if (
      fireflyProp.value === fireflyProp.minPossible && (
        this.config.type === ChangeType.Decremental ||
        this.config.type === ChangeType.FlipFlop
      )  &&
      this.config.onMinReached
    ) {
      this.config.onMinReached(
        firefly,
        this.canvas,
        this.fireflies,
        this.app
      )
    }
  }

  public onFramePassForSingleFirefly(firefly: Firefly): void {
    const fireflyProp = firefly[this.key];

    const serviceExists = !!firefly.activeServices.find(
      s => s.name === this.name
    )

    if (serviceExists) {
      switch (fireflyProp.changeType) {
        case ChangeType.Incremental:
          fireflyProp.value = Math.min(
            fireflyProp.value + fireflyProp.increment,
            fireflyProp.maxPossible ?? 0
          )
  
          this.executeOnMaxCallBack(
            firefly,
            fireflyProp,
          )
          
          break;
        case ChangeType.Decremental:
          fireflyProp.value = Math.max(
            fireflyProp.value - fireflyProp.decrement,
            fireflyProp.minPossible ?? 0
          )
  
          this.executeOnMinCallBack(
            firefly,
            fireflyProp,
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
              
              this.executeOnMaxCallBack(
                firefly,
                fireflyProp,
              )
  
              this.executeOnMinCallBack(
                firefly,
                fireflyProp,
              )
              break;
          }
          break;
        case ChangeType.NoChange:
          break;
      }
    }


  }

  public onFramePass(): void {
    for (let ff of this.fireflies) {
      this.onFramePassForSingleFirefly(ff)
    }
  }
}