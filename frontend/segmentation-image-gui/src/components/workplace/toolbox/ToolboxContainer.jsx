import axios from "axios";
import { useCanvasContext } from "../../../hooks/useCanvasContext";
import CustomBtn from "../../CustomBtn";
import CustomZoom from "../../CustomZoom";
import BtnBrush from "./BtnBrush";
import BtnEraser from "./BtnEraser";
import BtnFill from "./BtnFill";
import BtnMove from "./BtnMove";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import BtnGreen from "../../Share/BtnGreen";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ToolboxContainer = () => {
  const {
    canvasRef,
    bgCanvasRef,
    moveSelected,
    brushSelected,
    brushSize,
    fillSelected,
    eraserSelected,
    eraserSize,
    scale,
    handleMove,
    handleBrush,
    handleBrushSize,
    handleEraser,
    handleEraserSize,
    handleFill,
    handleZoomChange,
    handleClearCanvas,
  } = useCanvasContext();

  const { user } = useAuthContext();
  const { id } = useParams();

  const handleSaveAnnotation = async () => {
    const dataURL = canvasRef.current.toDataURL("image/png", 1.0);
    try {
      const res = await axios.patch(
        `http://localhost:3700/api/boardRoute/${id}`,
        { annotationImage: dataURL },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success("Save successfully.");
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred (FE).");
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    const imageCanvas = bgCanvasRef.current;
    const canvasCanvas = canvasRef.current;

    const imageDataUrl = imageCanvas.toDataURL("image/png");
    const canvasDataUrl = canvasCanvas.toDataURL("image/png");

    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = imageCanvas.width;
    combinedCanvas.height = imageCanvas.height;
    const ctx = combinedCanvas.getContext("2d");
    ctx.drawImage(imageCanvas, 0, 0);
    ctx.drawImage(canvasCanvas, 0, 0);
    const combinedDataUrl = combinedCanvas.toDataURL("image/png");

    // Add images to zip
    zip.file("image.png", imageDataUrl.split(",")[1], { base64: true });
    zip.file("label.png", canvasDataUrl.split(",")[1], { base64: true });
    zip.file("combined.png", combinedDataUrl.split(",")[1], { base64: true });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "canvas.zip");
  };

  return (
    <div className="flex justify-between border-y border-black px-4 py-2">
      <div className="flex gap-2 w-full items-center">
        <BtnMove moveSelected={moveSelected} handleMove={handleMove} />
        <BtnBrush
          brushSize={brushSize}
          brushSelected={brushSelected}
          handleBrush={handleBrush}
          handleBrushSize={handleBrushSize}
        />
        <BtnFill onClick={handleFill} isClick={fillSelected} />
        <BtnEraser
          eraserSelected={eraserSelected}
          eraserSize={eraserSize}
          handleEraser={handleEraser}
          handleEraserSize={handleEraserSize}
        />
        <CustomZoom value={scale} onChange={handleZoomChange} />
        <CustomBtn
          icon={"fa-solid fa-trash"}
          title="Eraser all"
          onClick={handleClearCanvas}
        />
      </div>
      <div className="flex gap-2 items-center">
        <BtnGreen text="Download" onClick={handleDownload} />
        <BtnGreen text="Save" onClick={handleSaveAnnotation} width="min-w-20" />
      </div>
    </div>
  );
};

export default ToolboxContainer;
