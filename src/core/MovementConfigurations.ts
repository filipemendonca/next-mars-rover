import { getMatrixLenght } from "@/helpers/MatrixHelper";
import { Directions, Matrix } from "@/types/GlobalTypes";
import { validateMatrixLenght } from "@/validations/Validation";

interface Props {
  directions: Directions;
  plateauMatrix: Matrix;
}

const orientationForLeftCommand: { [key: string]: string } = {
  N: "W",
  S: "E",
  E: "N",
  W: "S",
};

const orientationForRightCommand: { [key: string]: string } = {
  N: "E",
  S: "W",
  E: "S",
  W: "N",
};

export const defineOrientationByCommand = (
  command: string,
  orientation: string
) => {
  if (command == "L") return orientationForLeftCommand[orientation];
  else return orientationForRightCommand[orientation];
};

export const refreshRoverPositionIntoPlateau = ({
  directions,
  plateauMatrix,
}: Props): Matrix => {
  plateauMatrix[directions.x][directions.y] = directions.orientation;
  return plateauMatrix;
};

export const changeOrientationThroughPlateau = (directions: Directions) => {
  switch (directions.orientation) {
    case "N":
      directions.y++;
      break;
    case "S":
      directions.y--;
      break;
    case "E":
      directions.x++;
      break;
    case "W":
      directions.x--;
      break;
  }
};

export const roverWalk = (
  command: string,
  directions: Directions,
  plateauMatrix: Matrix
): Directions => {
  const matrixLenght = getMatrixLenght(plateauMatrix);

  switch (command) {
    case "L":
      directions.orientation = defineOrientationByCommand(
        "L",
        directions.orientation
      );
      break;
    case "R":
      directions.orientation = defineOrientationByCommand(
        "R",
        directions.orientation
      );
      break;
    case "M":
      changeOrientationThroughPlateau(directions);

      var validateLenght = validateMatrixLenght(
        matrixLenght.x,
        matrixLenght.y,
        directions
      );

      if (!validateLenght.error.validated) {
        directions.error = validateLenght.error;
        return directions;
      }

      refreshRoverPositionIntoPlateau({ directions, plateauMatrix });
      break;
  }

  return directions;
};
