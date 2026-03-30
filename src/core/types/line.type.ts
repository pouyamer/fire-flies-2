import { FireflyConnectorLine, InteractiveLine, SimpleLine } from "../models";

export type Line = FireflyConnectorLine | InteractiveLine | SimpleLine;

export type LineTypeName = "FireflyConnectorLine" | "InteractiveLine" | "SimpleLine"
