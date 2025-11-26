// import { FireflyApp } from "./core";
// import { Color, FireflyCanvas } from "./core/models";

import p5 from "p5";

const body = document.body;

// const canvas = new FireflyCanvas({
//   color: new Color({
//     alpha: 1,
//     hue: 0,
//     lightness: 0.1,
//     saturation: 0
//   }),
//   height: innerHeight,
//   width: innerWidth,
//   hostElement: body,
// })

if (true) {

    // const canvasElement = document.createElement('canvas');
    // canvasElement.innerHTML = 'Your Browser doesn\'t support HTML Canvas :(';
    // canvasElement.classList.add('canvas')
    // body?.appendChild(canvasElement)


    const createSketch = ( m: 'webgl' | 'p2d') => (p: p5) => {
      let a = 1;
      
      p.setup = () => {
        p.createCanvas(400, 400, m);
      };

      p.draw = () => {
        a++;
        p.background(200);
        p.ellipse(0, 0, a, a);
      };
    };

    new p5(createSketch('p2d'), body);
    new p5(createSketch('webgl'), body);
    

    // _p5.setup()
    

    

  // const app = new FireflyApp(canvas, window);

  // app.run()
}