import { getGithubUserContribution } from "@philipxlima/github-user-contribution";
import { userContributionToGrid } from "./userContributionToGrid";
import { getBestRoute } from "@philipxlima/solver/getBestRoute";
import { snake4 } from "@philipxlima/types/__fixtures__/snake";
import { getPathToPose } from "@philipxlima/solver/getPathToPose";
import type { DrawOptions as DrawOptions } from "@philipxlima/svg-creator";
import type { AnimationOptions } from "@philipxlima/gif-creator";

export const generateContributionSnake = async (
  userName: string,
  outputs: ({
    format: "svg" | "gif";
    drawOptions: DrawOptions;
    animationOptions: AnimationOptions;
  } | null)[],
  options: { githubToken: string }
) => {
  console.log("🎣 fetching github user contribution");
  const cells = await getGithubUserContribution(userName, options);

  const grid = userContributionToGrid(cells);
  const snake = snake4;

  console.log("📡 computing best route");
  const chain = getBestRoute(grid, snake)!;
  chain.push(...getPathToPose(chain.slice(-1)[0], snake)!);

  return Promise.all(
    outputs.map(async (out, i) => {
      if (!out) return;
      const { format, drawOptions, animationOptions } = out;
      switch (format) {
        case "svg": {
          console.log(`🖌 creating svg (outputs[${i}])`);
          const { createSvg } = await import("@philipxlima/svg-creator");
          return createSvg(grid, cells, chain, drawOptions, animationOptions);
        }
        case "gif": {
          console.log(`📹 creating gif (outputs[${i}])`);
          const { createGif } = await import("@philipxlima/gif-creator");
          return await createGif(
            grid,
            cells,
            chain,
            drawOptions,
            animationOptions
          );
        }
      }
    })
  );
};
