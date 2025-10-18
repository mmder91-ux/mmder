
export enum Player {
  Black = 'B',
  White = 'W',
}

export enum CellState {
  Empty = 'E',
  Black = 'B',
  White = 'W',
}

export type BoardState = CellState[][];

export type Move = {
  row: number;
  col: number;
};

export type Scores = {
  [Player.Black]: number;
  [Player.White]: number;
};
