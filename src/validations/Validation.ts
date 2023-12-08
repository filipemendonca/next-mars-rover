import { getDirectionsArray } from "@/helpers/MatrixHelper";
import MessagesResources from "@/resources/Messages";
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
          MessagesResources.Error.WrongFormatWithLenghtLandingPositionStrings,
      },
    };
  if (!regexLandingPosition.test(landingPosition))
    return {
      error: {
        validated: false,
        message: MessagesResources.Error.WrongFormatOfLandingPositions,
      },
    };
  if (plateauSizeX <= 0 || plateauSizeY <= 0)
    return {
      error: {
        validated: false,
        message: MessagesResources.Error.WrongSizeOfPlateau,
      },
    };
  if (!regexCartesianPoint.test(cartesianPoints))
    return {
      error: {
        validated: false,
        message: MessagesResources.Error.WrongFormatOfCartesianPoints,
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
  debugger;
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
