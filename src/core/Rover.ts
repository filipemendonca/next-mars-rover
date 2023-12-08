import { Directions, Matrix } from "@/types/GlobalTypes";
import { roverWalk } from "./MovementConfigurations";

let directions: Directions;

export const initRover = (
  cartesianPointsArray: string[],
  matrix: Matrix,
  model: Directions
): Directions => {
  for (let i = 0; i <= cartesianPointsArray.length; i++) {
    const command = cartesianPointsArray[i];
    directions = roverWalk(command, model, matrix);
    if (directions.error !== null && !directions.error?.validated) break;
  }

  return directions;
};
