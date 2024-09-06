import React, { useEffect, useState } from "react";
import { Col, Stack, Form } from "react-bootstrap";

function FontSizeSlider() {
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    // This will update the global CSS for .reading-passage p elements
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `p { font-size: ${fontSize}px !important; }`;

    document.head.appendChild(styleTag);

    // Cleanup on component unmount or fontSize change
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [fontSize]);

  return (
    <Stack direction="horizontal" className="">
      <div className="mt-0">Zoom:</div>
      <div className="mx-3">
        <Form.Range
          className="pt-2"
          min={10} // set minimum font size
          max={30} // set maximum font size
          defaultValue={16} // set a default font size
          onChange={(e) => setFontSize(e.target.value)}
        />
      </div>
    </Stack>
  );
}

export default FontSizeSlider;
