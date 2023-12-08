"use client";
import { refreshRoverPositionIntoPlateau } from "@/core/MovementConfigurations";
import {
  extractDirections,
  initMappingPlateau,
} from "@/core/PlateauConfigurations";
import { initRover } from "@/core/Rover";
import { getCartesianPoints } from "@/helpers/MatrixHelper";
import { Directions, Matrix, RoverProps } from "@/types/GlobalTypes";
import { Validation } from "@/validations/Validation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Messages } from "primereact/messages";
import { Toast } from "primereact/toast";
import { ChangeEvent, useRef, useState } from "react";

let directions: Directions[] = [];
let matrix: Matrix;

export default function Home() {
  //#region Messages and Toasts declarations
  const toast = useRef<Toast>(null);
  const msgs = useRef<Messages>(null);
  //#endregion

  //#region useStates declarations
  const [visible, setVisible] = useState<boolean>(false);
  const [hasNoError, setHasNoError] = useState<boolean>(true);
  const [plateauSizeX, setPlateauSizeX] = useState<number>(0);
  const [plateauSizeY, setPlateauSizeY] = useState<number>(0);

  const [inputs, setInputs] = useState<RoverProps[]>([
    {
      landingPosition: "",
      cartesianPoints: "",
    },
  ]);
  //#endregion

  //#region Clear and start directions and matrix (plateau)
  const cleanDirectionsAndMatrix = () => {
    directions = [];
    matrix = [];
    setHasNoError(true);
  };

  const startMatrix = () => {
    if (plateauSizeX && plateauSizeY)
      matrix = initMappingPlateau({
        plateauSizeX,
        plateauSizeY,
      });
  };
  //#endregion

  //#region Error functions
  const errorHandlingToast = (errorMessage: string | null) => {
    toast.current?.show({
      severity: "error",
      summary: "Hey wait!",
      detail: errorMessage ?? null,
    });
  };

  const messageErrorHandling = (messageError: string | null | undefined) => {
    msgs.current?.show({
      sticky: true,
      severity: "error",
      summary: `Wait! Don't do that!`,
      detail: messageError ?? null,
    });
  };
  //#endregion

  //#region OnChange input method
  const handleFormChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let data = [...inputs];
    data[index][event.target.name] = event.target.value;
    setInputs(data);
  };
  //#endregion

  //#region Add more and remove rover fields function
  const addFields = () => {
    let newFields: RoverProps = {
      landingPosition: "",
      cartesianPoints: "",
    };
    setInputs([...inputs, newFields]);
  };

  const removeFields = (index: number) => {
    const customInput = inputs[index];
    setInputs(inputs.filter((x) => x !== customInput));
  };
  //#endregion

  //#region Principal function when we click on submit button
  const onClick = () => {
    cleanDirectionsAndMatrix();
    startMatrix();

    const validation = Validation(
      inputs,
      { plateauSizeX, plateauSizeY },
      matrix
    );

    if (!validation.error.validated) {
      errorHandlingToast(validation.error.message);
      return;
    }

    inputs.forEach((input, index) => {
      directions.push(extractDirections(input.landingPosition));

      refreshRoverPositionIntoPlateau({
        directions: directions[index],
        plateauMatrix: matrix,
      });

      initRover(
        getCartesianPoints(input.cartesianPoints),
        matrix,
        directions[index]
      );

      if (directions[index].error && !directions[index].error?.validated) {
        messageErrorHandling(directions[index].error?.message);
        setHasNoError(false);
      }
    });

    if (!hasNoError) setVisible(true);
  };
  //#endregion

  return (
    <div className="flex align-items-center justify-content-center">
      <Toast ref={toast} />
      <Card title="Javascript Mars Rover">
        <Messages ref={msgs} />
        <div className="card flex justify-content-center">
          <Button label="Add rover" onClick={addFields} />
        </div>
        <div className="flex align-items-center justify-content-center">
          <h5>Plateau Sizes</h5>
          <div className="card flex justify-content-center">
            <InputText
              name="plateauSizeX"
              value={plateauSizeX?.toString()}
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPlateauSizeX(+e.target.value)
              }
              placeholder="Plateau Size X"
            />
          </div>
          <br />
          <div className="card flex justify-content-center">
            <InputText
              name="plateauSizeY"
              value={plateauSizeY?.toString()}
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPlateauSizeY(+e.target.value)
              }
              placeholder="Plateau Size Y"
            />
          </div>
          <br />

          {inputs.map((input, index) => {
            return (
              <div key={index}>
                <h5>Rover: {index}</h5>
                <div className="card flex justify-content-center">
                  <InputText
                    name="landingPosition"
                    value={input.landingPosition}
                    maxLength={5}
                    onChange={(event) => handleFormChange(index, event)}
                    placeholder="Landing positions"
                  />
                </div>
                <br />
                <div className="card flex justify-content-center">
                  <InputText
                    name="cartesianPoints"
                    value={input.cartesianPoints}
                    onChange={(event) => handleFormChange(index, event)}
                    placeholder="Cartesian Points"
                  />
                </div>
                <br />
                <button onClick={() => removeFields(index)}>Remove</button>
              </div>
            );
          })}
        </div>
        <br />
        <div className="card flex justify-content-center">
          <Button label="Submit" onClick={onClick} />
        </div>
      </Card>
      <Dialog
        header="Results"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        {inputs.map((input, index) => {
          return (
            <div key={index}>
              <p>
                <strong>Rover: {index}</strong>
              </p>
              <p className="m-0">Landing position: {input.landingPosition}</p>
              <p className="m-0">Instructions: {input.cartesianPoints}</p>
              <p className="m-0">
                Final Position: {directions[index]?.x} {directions[index]?.y}{" "}
                {directions[index]?.orientation}
              </p>
              <Divider />
            </div>
          );
        })}
      </Dialog>
    </div>
  );
}
