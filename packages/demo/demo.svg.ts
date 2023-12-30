import "./menu";
import { getBestRoute } from "@philipxlima/solver/getBestRoute";
import { createSvg } from "@philipxlima/svg-creator";
import { grid, snake } from "./sample";
import { drawOptions } from "./canvas";
import { getPathToPose } from "@philipxlima/solver/getPathToPose";
import type { AnimationOptions } from "@philipxlima/gif-creator";

const chain = getBestRoute(grid, snake);
chain.push(...getPathToPose(chain.slice(-1)[0], snake)!);

(async () => {
  const svg = await createSvg(grid, null, chain, drawOptions, {
    frameDuration: 200,
  } as AnimationOptions);

  const container = document.createElement("div");
  container.innerHTML = svg;
  document.body.appendChild(container);
})();
