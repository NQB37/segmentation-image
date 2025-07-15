import { useState } from "react";
import BtnSegment from "./BtnSegment";
import BtnVisible from "../BtnVisible";
import * as tf from "@tensorflow/tfjs";
import { useCanvasContext } from "../../../hooks/useCanvasContext";

const SegmentContainer = () => {
  const [model, setModel] = useState(null);
  const { bgCanvasRef, maskCanvasRef, maskToggle, handleMaskToggle } =
    useCanvasContext();
  const handleSegment = async () => {
    if (!model) {
      try {
        const loadedModel = await tf.loadLayersModel("/unet/model.json");
        setModel(loadedModel);
        runSegment(loadedModel);
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    } else {
      runSegment(model);
    }
  };
  const runSegment = async (model) => {};
  return (
    <div>
      <div className="px-4 py-2 flex justify-between border-y border-black">
        <div className="font-bold">Segmentation</div>
        <div className="flex gap-3">
          {/* <BtnVisible state={maskToggle} onClick={handleMaskToggle} /> */}
          <BtnVisible />
          <BtnSegment onClick={handleSegment} />
        </div>
      </div>
    </div>
  );
};

export default SegmentContainer;
