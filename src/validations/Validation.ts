import { getDirectionsArray } from "@/helpers/MatrixHelper";
import MessagesResources from "@/resources/Messages";
import {
  Directions,
  Error,
  Matrix,
  MatrixProps,
  RoverProps,
} from "@/types/GlobalTypes";

interface ValidationReturn {
  error: Error;
}

export function Validation(
  props: RoverProps[],
  plateauSizes: MatrixProps,
  matrix: Matrix
): ValidationReturn {
  let validationReturn: ValidationReturn = {
    error: { validated: true, message: null },
  };
  if (plateauSizes.plateauSizeX <= 1 || plateauSizes.plateauSizeY <= 1)
    return (validationReturn = {
      error: {
        validated: false,
        message: MessagesResources.Error.WrongSizeOfPlateau,
      },
    });

  props.map((input) => {
    const regexLandingPosition = new RegExp(/N|S|E|W/, "g");
    const regexCartesianPoint = new RegExp(/L|R|M/, "g");
    if (!validatePositionsInLandingPositions(input.landingPosition))
      return (validationReturn = {
        error: {
          validated: false,
          message:
            MessagesResources.Error.WrongFormatWithLenghtLandingPositionStrings,
        },
      });
    if (!regexLandingPosition.test(input.landingPosition))
      return (validationReturn = {
        error: {
          validated: false,
          message: MessagesResources.Error.WrongFormatOfLandingPositions,
        },
      });
    if (!regexCartesianPoint.test(input.cartesianPoints))
      return (validationReturn = {
        error: {
          validated: false,
          message: MessagesResources.Error.WrongFormatOfCartesianPoints,
        },
      });
  });

  return validationReturn;
}

export const validateMatrixLenght = (
  matrixPositionX: number,
  matrixPositionY: number,
  newDirections: Directions
): ValidationReturn => {
  const message = MessagesResources.Error.TheresNoSpaceToWalkWithRover;

  if (newDirections.x < 0 || newDirections.y < 0) {
    return {
      error: {
        validated: false,
        message,
      },
    };
  }

  if (
    matrixPositionX <= newDirections.x ||
    matrixPositionY <= newDirections.y
  ) {
    return {
      error: {
        validated: false,
        message,
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
