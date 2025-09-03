const nameToColorMap = new Map();
const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
];
const paletteRange = ["300", "400", "500", "600"];

export default function getColorForGenreName(genreName, rangeRequired = true) {
  genreName = genreName.toLowerCase();
  if (nameToColorMap.has(genreName))
    return rangeRequired
      ? nameToColorMap.get(genreName)
      : nameToColorMap.get(genreName).slice(0, -4);

  const newColor = generateColor();
  nameToColorMap.set(genreName, newColor);

  return rangeRequired ? newColor : newColor.slice(0, -4);
}

function generateColor() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomPalette =
    paletteRange[Math.floor(Math.random() * paletteRange.length)];

  return `${randomColor}.${randomPalette}`;
}

export function getGradientColorsForGenreName(genreName) {
  let initialColor = getColorForGenreName(genreName);
  const colorPart = initialColor.slice(0, -4);
  const palletePart = Number(initialColor.slice(-3));
  let gradientColor;

  if (palletePart <= 400) {
    gradientColor = `${colorPart}.600`;
    [initialColor, gradientColor] = [gradientColor, initialColor];
  } else {
    gradientColor = `${colorPart}.300`;
  }
  return { initialColor, gradientColor };
}
