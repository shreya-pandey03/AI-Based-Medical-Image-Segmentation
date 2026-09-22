import { useEffect, useRef, useState } from "react";

import ViewerToolbar from "./ViewerToolbar";
import DetectionOverlay from "./DetectionOverlay";
import useViewerStore from "../../stores/viewerStore";

const MedicalImageViewer = ({
  imageUrl,
  regions = [],
}) => {
  const imageRef = useRef(null);

  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  const {
    zoom,
    showOverlay,
    selectedRegion,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleOverlay,
    selectRegion,
  } = useViewerStore();

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] =
    useState(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setPosition({
      x: 0,
      y: 0,
    });
  }, [imageUrl]);

  const handleImageLoad = () => {
    if (!imageRef.current) {
      return;
    }

    setImageSize({
      width: imageRef.current.naturalWidth,
      height: imageRef.current.naturalHeight,
    });
  };

  const handleMouseDown = (event) => {
    if (zoom <= 1) {
      return;
    }

    setIsDragging(true);

    dragStart.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging) {
      return;
    }

    setPosition({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    resetZoom();

    setPosition({
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="space-y-3">
      <ViewerToolbar
        zoom={zoom}
        showOverlay={showOverlay}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={handleReset}
        onToggleOverlay={toggleOverlay}
      />

      <div
        className={`relative flex h-[650px] items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-black ${
          zoom > 1
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Medical scan"
            onLoad={handleImageLoad}
            draggable={false}
            className="block max-h-[620px] max-w-[900px] object-contain"
          />

          {showOverlay &&
            imageSize.width > 0 &&
            imageSize.height > 0 && (
              <DetectionOverlay
                regions={regions}
                imageWidth={imageSize.width}
                imageHeight={imageSize.height}
                selectedRegion={selectedRegion}
                onSelectRegion={selectRegion}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default MedicalImageViewer;