import {
  createSnakeFromCells,
  nextSnake,
  snakeToCells,
  snakeWillSelfCollide,
} from "../snake";

it("should convert to point", () => {
  const philipxlima0 = [
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ];

  expect(snakeToCells(createSnakeFromCells(philipxlima0))).toEqual(philipxlima0);
});

it("should return next snake", () => {
  const philipxlima0 = [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ];

  const philipxlima1 = [
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ];

  expect(snakeToCells(nextSnake(createSnakeFromCells(philipxlima0), 1, 0))).toEqual(
    philipxlima1
  );
});

it("should test snake collision", () => {
  const philipxlima0 = [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ];

  expect(snakeWillSelfCollide(createSnakeFromCells(philipxlima0), 1, 0)).toBe(false);
  expect(snakeWillSelfCollide(createSnakeFromCells(philipxlima0), 0, -1)).toBe(true);
});
