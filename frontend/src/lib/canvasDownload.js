const getBase64ImageData = (canvas) => (
    canvas.toDataURL('image/png').split(',')[1]
);

export const getCanvasZipEntries = ({
    imageCanvas,
    annotationCanvas,
    maskCanvas,
    combinedCanvas,
}) => [
    { name: 'image.png', data: getBase64ImageData(imageCanvas) },
    { name: 'label.png', data: getBase64ImageData(annotationCanvas) },
    { name: 'segmentation.png', data: getBase64ImageData(maskCanvas) },
    { name: 'combined.png', data: getBase64ImageData(combinedCanvas) },
];

export const addCanvasZipEntries = (zip, entries) => {
    entries.forEach(({ name, data }) => {
        zip.file(name, data, { base64: true });
    });
};
