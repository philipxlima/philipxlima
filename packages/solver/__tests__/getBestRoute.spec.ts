import { getBestRoute } from "../getBestRoute";
import { Color, createEmptyGrid, setColor } from "@philipxlima/types/grid";
import { createSnakeFromCells, snakeToCells } from "@philipxlima/types/snake";
import * as grids from "@philipxlima/types/__fixtures__/grid";
import { snake3 } from "@philipxlima/types/__fixtures__/snake";

it("should find best route", () => {
  const philipxlima0 = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];

  const grid = createEmptyGrid(5, 5);
  setColor(grid, 3, 3, 1 as Color);

  const chain = getBestRoute(grid, createSnakeFromCells(philipxlima0))!;

  expect(snakeToCells(chain[1])[1]).toEqual({ x: 0, y: 0 });

  expect(snakeToCells(chain[chain.length - 1])[0]).toEqual({ x: 3, y: 3 });
});

for (const [gridName, grid] of Object.entries(grids))
  it(`should find a solution for ${gridName}`, () => {
    getBestRoute(grid, snake3);
  });
