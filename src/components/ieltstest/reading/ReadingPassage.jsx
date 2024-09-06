import React from "react";
import parse from "html-react-parser";

const ReadingPassage = ({ section, fontSize }) => {
  if (!section || !section.passage) {
    return null;
  }

  const toggleHighlight = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (selectedText.length === 0) return;

    const parentElement = range.commonAncestorContainer.parentElement;

    if (parentElement && parentElement.className === "highlighted-text") {
      // Remove highlight by replacing the highlighted span with its inner contents
      while (parentElement.firstChild) {
        parentElement.parentNode.insertBefore(
          parentElement.firstChild,
          parentElement
        );
      }
      parentElement.parentNode.removeChild(parentElement);
    } else {
      // Add highlight
      const span = document.createElement("span");
      span.className = "highlighted-text";
      range.surroundContents(span);
    }

    selection.removeAllRanges();
  };

  // Inline styles
  const passageStyles = {
    //fontSize: 20 || "16px", // Dynamically set font size
    lineHeight: "1.5",
    color: "black",
  };

  const highlightedTextStyles = {
    backgroundColor: "#b0e0e6", // Highlight color
  };

  const imageStyles = {
    width: "100%",
    height: "auto",
  };

  return (
    <div
      style={{ color: "black" }} // General text color (if needed for other parts)
      onMouseUp={toggleHighlight}
      onTouchEnd={toggleHighlight}
    >
      {/* Apply dynamic styles directly to the parsed content */}
      <div style={passageStyles}>{parse(section.passage)}</div>
    </div>
  );
};

export default ReadingPassage;
