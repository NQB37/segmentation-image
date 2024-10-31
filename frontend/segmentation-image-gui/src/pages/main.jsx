import { useEffect, useRef, useState } from 'react';
import CustomBtn from '../components/CustomBtn';
import CustomZoom from '../components/CustomZoom';
import * as fabric from 'fabric';

const MainPage = () => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const [brushSelected, setBrushSelected] = useState(false);
    const [eraserSelected, setEraserSelected] = useState(false);

    useEffect(() => {
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            height: 800,
            width: 1200,
        });
        setCanvas(newCanvas);
        return () => {
            newCanvas.dispose();
        };
    }, []);

    const handleUpload = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            canvas.clear();
            let imgUrl = e.target.result;
            let imgElement = document.createElement('img');
            imgElement.src = imgUrl;
            imgElement.onload = () => {
                let img = new fabric.Image(imgElement);
                img.set({
                    left: 0,
                    top: 0,
                });
                img.erasable = true;
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
                setIsUploaded(true);
            };
        };
    };

    const handleBrush = () => {
        setBrushSelected(true);
        setEraserSelected(false);
        if (canvas) {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = 'black';
            canvas.freeDrawingBrush.width = 5;
        }
    };

    const handleEraser = () => {
        setBrushSelected(false);
        setEraserSelected(true);
        if (canvas) {
            canvas.isDrawingMode = true;
            fabric.PencilBrush.prototype.globalCompositeOperation =
                'destination-out';
            canvas.renderAll();
        }
    };

    return (
        <div>
            <div className="flex flex-col h-screen">
                <div className="flex justify-between border border-black p-2">
                    {/* tool box */}
                    <div className="flex gap-2 w-full items-center">
                        <CustomBtn
                            icon={'fa-solid fa-paintbrush'}
                            onClick={handleBrush}
                            isActive={brushSelected}
                        />
                        <CustomBtn
                            icon={'fa-solid fa-eraser'}
                            onClick={handleEraser}
                            isActive={eraserSelected}
                        />
                        <CustomZoom />
                        <CustomBtn
                            icon={'fa-solid fa-play'}
                            onClick={() => {}}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <div>
                            <label className="">
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={isUploaded}
                                    className="hidden"
                                />
                                <p
                                    className={`px-4 py-2 rounded ${
                                        isUploaded
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-400 hover:bg-green-600 cursor-pointer'
                                    }  `}
                                >
                                    Upload
                                </p>
                            </label>
                        </div>

                        <button className="px-4 py-2 bg-green-400 rounded hover:bg-green-600">
                            Login
                        </button>
                    </div>
                </div>
                <div className="flex grow">
                    {/* canvas */}
                    <div className="w-5/6">
                        <div className="size-full flex items-center justify-center">
                            <canvas
                                ref={canvasRef}
                                className="w-[1200px] h-[800px] border border-black"
                            />
                        </div>
                    </div>
                    {/* labels/users */}
                    <div className="w-1/6 border-l border-black"></div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
