import { getDirectionsArray } from "@/helpers/MatrixHelper";
import { Directions } from "@/types/GlobalTypes";

interface PlateauProps {
  plateauSizeX: number;
  plateauSizeY: number;
}

export const initMappingPlateau = ({
  plateauSizeX,
  plateauSizeY,
}: PlateauProps): Array<string[]> =>
  Array(plateauSizeX)
    .fill(null)
    .map(() => Array(plateauSizeY).fill(""));

export const extractDirections = (landingPosition: string): Directions => {
  const directionsArray = getDirectionsArray(landingPosition);

  return {
    x: +directionsArray[0],
    y: +directionsArray[1],
    orientation: directionsArray[2],
    error: null,
  };
};
