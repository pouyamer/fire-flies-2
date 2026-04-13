import { FireflyApp } from "./core";

const app = new FireflyApp({
  canvas: {
    height: innerHeight,
    width: innerWidth,
    hostElement: document.querySelector("body"),
  },
});

app.run()

