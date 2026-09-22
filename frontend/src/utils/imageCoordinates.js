export const normalizeBox = (box) => {
  if (!box) {
    return null;
  }

  if (Array.isArray(box)) {
    const [ymin, xmin, ymax, xmax] = box;

    return {
      xmin: Number(xmin),
      ymin: Number(ymin),
      xmax: Number(xmax),
      ymax: Number(ymax),
    };
  }

  return {
    xmin: Number(box.xmin ?? 0),
    ymin: Number(box.ymin ?? 0),
    xmax: Number(box.xmax ?? 0),
    ymax: Number(box.ymax ?? 0),
  };
};

export const getBoxStyle = (box, imageWidth, imageHeight) => {
  const normalized = normalizeBox(box);

  if (!normalized || !imageWidth || !imageHeight) {
    return null;
  }

  const isNormalized =
    normalized.xmin >= 0 &&
    normalized.xmin <= 1 &&
    normalized.xmax >= 0 &&
    normalized.xmax <= 1 &&
    normalized.ymin >= 0 &&
    normalized.ymin <= 1 &&
    normalized.ymax >= 0 &&
    normalized.ymax <= 1;

  const left = isNormalized ? normalized.xmin * imageWidth : normalized.xmin;

  const top = isNormalized ? normalized.ymin * imageHeight : normalized.ymin;

  const width = isNormalized
    ? (normalized.xmax - normalized.xmin) * imageWidth
    : normalized.xmax - normalized.xmin;

  const height = isNormalized
    ? (normalized.ymax - normalized.ymin) * imageHeight
    : normalized.ymax - normalized.ymin;

  return {
    left: Math.max(0, left),
    top: Math.max(0, top),
    width: Math.max(0, width),
    height: Math.max(0, height),
  };
};
