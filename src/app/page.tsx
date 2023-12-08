"use client";
import { initRover } from "@/core/Rover";
import { Directions } from "@/types/GlobalTypes";
import { Validation } from "@/validations/Validation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Messages } from "primereact/messages";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

let directions: Directions;

export default function Home() {
  const toast = useRef<Toast>(null);
  const msgs = useRef<Messages>(null);

  const errorHandlingToast = (errorMessage: string | null) => {
    toast.current?.show({
      severity: "error",
      summary: "Hey wait!",
      detail: errorMessage ?? null,
    });
  };

  const messageErrorHandling = (messageError: string | null) => {
    msgs.current?.show({
      sticky: true,
      severity: "error",
      summary: `Wait! Don't do that!`,
      detail: messageError ?? null,
    });
  };

  const [visible, setVisible] = useState<boolean>(false);
  const [landingPosition, setLandingPosition] = useState("");
  const [cartesianPoints, setCartesianPoints] = useState("");
  const [plateauSizeX, setPlateauSizeX] = useState<number>(0);
  const [plateauSizeY, setPlateauSizeY] = useState<number>(0);

  const onClick = () => {
    const validation = Validation({
      landingPosition,
      cartesianPoints,
      plateauSizeX,
      plateauSizeY,
    });

    if (!validation.error.validated) {
      errorHandlingToast(validation.error.message);
      return;
    }

    directions = initRover({
      landingPosition,
      cartesianPoints,
      plateauSizeX,
      plateauSizeY,
    });

    if (directions.error && !directions.error?.validated) {
      messageErrorHandling(directions.error?.message);
      return;
    }

    setVisible(true);
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <Card title="Javascript Mars Rover">
        <Messages ref={msgs} />
        <div className="flex align-items-center justify-content-start">
          <div className="card flex justify-content-center">
            <InputText
              value={landingPosition}
              maxLength={5}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLandingPosition(e.target.value)
              }
              placeholder="Landing positions"
            />
          </div>
          <br />
          <div className="card flex justify-content-center">
            <InputText
              value={cartesianPoints}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCartesianPoints(e.target.value)
              }
              placeholder="Cartesian Points"
            />
          </div>
          <br />
          <div className="card flex justify-content-center">
            <InputText
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
              value={plateauSizeY?.toString()}
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPlateauSizeY(+e.target.value)
              }
              placeholder="Plateau Size Y"
            />
          </div>
        </div>
        <br />
        <div className="card flex justify-content-center">
          <Button label="Submit" onClick={onClick} />
        </div>
      </Card>
      <Dialog
        header="Results"
        visible={visible}
        style={{ width: "25vw" }}
        onHide={() => setVisible(false)}
      >
        <p className="m-0">Landing position: {landingPosition}</p>
        <p className="m-0">Instructions: {cartesianPoints}</p>
        <p className="m-0">
          Final Position: {directions?.x} {directions?.y}{" "}
          {directions?.orientation}
        </p>
      </Dialog>
    </div>
  );
}
