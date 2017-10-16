function initFile({ width, height }) {
  return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${width} ${height}" enable-background="new 0 0 ${width} ${height}" xml:space="preserve">
    <g>
  `;
}

function endFile() {
  return `
    </g>
  </svg>
  `;
}

function drawTriangle(t) {
  const color = `${t.fill.toString(16)}`;
  const points = t.points.reduce((memo, p) => {
    return `${memo} ${p.x},${p.y}`;
  }, "");

  return `<polygon
    stroke-linejoin="round"
    fill="${color}"
    points="${points}"
    opacity="${t.alpha}" />`;
}

function drawTriangles(triangles) {
  return triangles.reduce((memo, t) => {
    return `${memo}
      ${drawTriangle(t)}`;
  }, "");
}

function encodeOptimizedSVGDataUri(svgString) {
  const svgWithoutWhiteSpace = svgString.replace("\n", "").replace(/\s+/g, " ");
  const uriPayload = encodeURIComponent(svgWithoutWhiteSpace) // encode URL-unsafe characters
    .replace(/%0A/g, "") // remove newlines
    .replace(/%20/g, " ") // put spaces back in
    .replace(/%3D/g, "=") // ditto equals signs
    .replace(/%3A/g, ":") // ditto colons
    .replace(/%2F/g, "/") // ditto slashes
    .replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)

  return `data:image/svg+xml,${uriPayload}`;
}

export default function SvgBuilder({ triangles, bgColor, size }) {
  let result = initFile(size);
  result += drawTriangles(triangles);
  result += endFile();

  return encodeOptimizedSVGDataUri(result);
}
