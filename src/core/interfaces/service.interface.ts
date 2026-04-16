import { Firefly } from "../models";

export declare interface Mutator {
  setOne (firefly: Firefly): void;
  set (): void;
  updateOne (firefly: Firefly): void;
  update ():void;
}

export declare interface Ownable {
  add (firefly: Firefly): void;
  remove (firefly: Firefly): void;
  has (firefly: Firefly): boolean;
}

export declare interface MutatorGroup {
  set (): void;
  update (): void;
}

export declare interface Loop {
  start (): void;
  stop (): void;
}