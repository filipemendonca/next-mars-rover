import { Matrix } from "@/types/GlobalTypes";

interface MatrixDimensions {
  x: number;
  y: number;
}

export const getDirectionsArray = (landingPosition: string) =>
  landingPosition.includes(" ")
    ? landingPosition.split(" ")
    : landingPosition.split("");

export const getCartesianPoints = (cartesianPoint: string) =>
  cartesianPoint.includes(" ")
    ? cartesianPoint.split(" ")
    : cartesianPoint.split("");

export const getMatrixLenght = (plateauMatrix: Matrix): MatrixDimensions => {
  return {
    x: plateauMatrix.length,
    y: plateauMatrix[0].length,
  };
};
