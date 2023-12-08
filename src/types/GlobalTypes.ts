export type Error = {
  validated: boolean;
  message: string | null;
};

export type Matrix = Array<string[]>;

export type MatrixProps = {
  plateauSizeX: number;
  plateauSizeY: number;
};

export type Directions = {
  x: number;
  y: number;
  orientation: string;
  error: Error | null;
};

export type RoverProps = {
  landingPosition: string;
  cartesianPoints: string;
};
