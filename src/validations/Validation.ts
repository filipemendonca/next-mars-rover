import { getDirectionsArray } from "@/helpers/MatrixHelper";
import { Directions, Error } from "@/types/GlobalTypes";

interface Props {
  landingPosition: string;
  cartesianPoints: string;
  plateauSizeX: number;
  plateauSizeY: number;
}

interface ValidationReturn {
  error: Error;
}

export function Validation({
  landingPosition,
  cartesianPoints,
  plateauSizeX,
  plateauSizeY,
}: Props): ValidationReturn {
  const regexLandingPosition = new RegExp(/N|S|E|W/, "g");
  const regexCartesianPoint = new RegExp(/L|R|M/, "g");

  if (!validatePositionsInLandingPositions(landingPosition))
    return {
      error: {
        validated: false,
        message:
          "Landing positions must start with 2 numbers which correspond with points X and Y respectively. And must have a letter which correspond a orientation.",
      },
    };
  if (!regexLandingPosition.test(landingPosition))
    return {
      error: {
        validated: false,
        message:
          "Landing position must have a values like numbers between 0 to 9 and letters like N S E W.",
      },
    };
  if (plateauSizeX <= 0 || plateauSizeY <= 0)
    return {
      error: {
        validated: false,
        message: "Plateau must have sizes bigger than 0.",
      },
    };
  if (!regexCartesianPoint.test(cartesianPoints))
    return {
      error: {
        validated: false,
        message:
          "Cartesian points must have letters like L and R. And M for walk.",
      },
    };

  return {
    error: { validated: true, message: null },
  };
}

export const validateMatrixLenght = (
  matrixPositionX: number,
  matrixPositionY: number,
  newDirections: Directions
): ValidationReturn => {
  if (
    matrixPositionX <= newDirections.x ||
    matrixPositionY <= newDirections.y
  ) {
    return {
      error: {
        validated: false,
        message:
          "There's no space to walk with rover. This rover costs a billion of dollars. You don't wanna to walk that into a hole, right?",
      },
    };
  }
  return {
    error: { validated: true, message: null },
  };
};

const validatePositionsInLandingPositions = (
  landingPosition: string
): boolean => {
  const regexNumber = new RegExp(/[0-9]/, "g");
  const pos = getDirectionsArray(landingPosition);

  if (pos.length < 3 || pos.length > 3) return false;
  if (!regexNumber.test(pos[0]) && !regexNumber.test(pos[1])) return false;

  return true;
};
