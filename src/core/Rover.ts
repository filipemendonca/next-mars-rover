import { getCartesianPoints } from "@/helpers/MatrixHelper";
import { Directions, Matrix, RoverProps } from "@/types/GlobalTypes";
import { extractDirections, initMappingPlateau } from "./PlateauConfigurations";
import {
  refreshRoverPositionIntoPlateau,
  roverWalk,
} from "./MovementConfigurations";

let directions: Directions;
let plateau: Matrix;

export const initRover = ({
  landingPosition,
  cartesianPoints,
  plateauSizeX,
  plateauSizeY,
}: RoverProps): Directions => {
  const roverWalkCommandsArray = getCartesianPoints(cartesianPoints);

  if (plateauSizeX && plateauSizeY)
    plateau = initMappingPlateau({ plateauSizeX, plateauSizeY });

  directions = extractDirections(landingPosition);

  const matrix = refreshRoverPositionIntoPlateau({
    directions,
    plateauMatrix: plateau,
  });

  for (let i = 0; i <= roverWalkCommandsArray.length; i++) {
    const command = roverWalkCommandsArray[i];
    directions = roverWalk(command, directions, matrix);
    if (directions.error !== null && !directions.error?.validated) break;
  }

  return directions;
};
