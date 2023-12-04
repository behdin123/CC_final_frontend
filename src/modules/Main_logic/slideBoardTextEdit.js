

// function to update the Font size of selected text
function applyStyleToSelection(action, callback) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    let range = selection.getRangeAt(0);
    range = trimRangeWhitespace(range);
    const selectedText = range.toString();
    if (!selectedText) return; // Do nothing if no text is selected
  
    let spanToStyle;
  
    // Check if the selected text is in a span
    let parentNode = range.commonAncestorContainer;
    if (parentNode.nodeType !== Node.ELEMENT_NODE) {
      parentNode = parentNode.parentNode;
    }
  
    if (
      parentNode.nodeName === "SPAN" && range.toString() === parentNode.textContent
    ) {
      // Use existing span if it only covers the selected area
      spanToStyle = parentNode;
    } else {
      // Or, create new span around the selected text
      spanToStyle = document.createElement("span");
      spanToStyle.textContent = selectedText;
      range.deleteContents();
      range.insertNode(spanToStyle);
    }
  
    // Calculate and apply the new font size
    const currentFontSize = parseInt(
      window.getComputedStyle(spanToStyle, null).fontSize
    );
    const newFontSize =
      action === "increase"
        ? currentFontSize + 1
        : Math.max(12, currentFontSize - 1);
    spanToStyle.style.fontSize = `${newFontSize}px`;
  
    // Update the selection
    const newRange = document.createRange();
    newRange.selectNodeContents(spanToStyle);
    selection.removeAllRanges();
    selection.addRange(newRange);
  
    if (typeof callback === 'function') {
        callback();
    }
  }
  
  // function to update the text style (bold, italic, underline) of selected text
  function applyStyle(styleType, callback) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    let range = selection.getRangeAt(0);
    range = trimRangeWhitespace(range);
    if (range.collapsed) return; // No text selected
  
    let styleProperty, styleValue;
    switch (styleType) {
      case "bold":
        styleProperty = "fontWeight";
        styleValue = "bold";
        break;
      case "italic":
        styleProperty = "fontStyle";
        styleValue = "italic";
        break;
      case "underline":
        styleProperty = "textDecoration";
        styleValue = "underline";
        break;
      default:
        return;
    }
  
    const selectedContent = range.extractContents();
    const spans = selectedContent.querySelectorAll("span");
    let isStyleApplied = false;
  
    spans.forEach((span) => {
      if (span.style[styleProperty] === styleValue) {
        span.style[styleProperty] = "";
        if (!span.style.cssText.trim()) {
          unwrapElement(span);
        }
        isStyleApplied = true;
      }
    });
  
    if (!isStyleApplied) {
      const newSpan = document.createElement("span");
      newSpan.style[styleProperty] = styleValue;
      newSpan.appendChild(selectedContent);
      range.insertNode(newSpan);
    } else {
      range.insertNode(selectedContent);
    }
  
    // Update the the chosen text the keep the selected area selected
    selection.removeAllRanges();
    selection.addRange(range);
  
    if (typeof callback === 'function') {
        callback();
    }
  }



  // click handlers font size
  function increaseFontSize(callback) {
    applyStyleToSelection("increase", callback);
  }
  
  function decreaseFontSize(callback) {
    applyStyleToSelection("decrease", callback);
  }
  
  // click handlers text style
  function applyBold(callback) {
    applyStyle("bold", callback);
  }
  
  function applyItalic(callback) {
    applyStyle("italic", callback);
  }
  
  function applyUnderline(callback) {
    applyStyle("underline", callback);
  }
  

  // function to remove any text style (bold, italic, underline) of selected text
  function applyPlainText(callback) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    let range = selection.getRangeAt(0);
    range = trimRangeWhitespace(range);
    if (range.collapsed) return; // No text selected
  
    // Extracts the selected content
    const selectedContent = range.extractContents();
  
    // Find spans and replace them with their contents
    const spans = selectedContent.querySelectorAll("span");
    spans.forEach((span) => unwrapElement(span));
  
    // Inserts the modified content back into the document
    range.insertNode(selectedContent);
  
    // Update the selection to focus on the changed area
    const newRange = document.createRange();
    newRange.selectNodeContents(range.commonAncestorContainer);
    selection.removeAllRanges();
    selection.addRange(newRange);
  
    if (typeof callback === 'function') {
        callback();
    }
  }
  
  // function to make sure that the selected text is only text and now white space is selected
  function trimRangeWhitespace(range) {
    let startContainer = range.startContainer;
    let endContainer = range.endContainer;
    let startOffset = range.startOffset;
    let endOffset = range.endOffset;
  
    // Trim start
    if (startContainer.nodeType === Node.TEXT_NODE) {
      while (
        startOffset < startContainer.textContent.length &&
        startContainer.textContent[startOffset].match(/\s/)
      ) {
        startOffset++;
      }
    }
  
    // Trim end
    if (endContainer.nodeType === Node.TEXT_NODE) {
      while (
        endOffset > 0 &&
        endContainer.textContent[endOffset - 1].match(/\s/)
      ) {
        endOffset--;
      }
    }
  
    // Update range
    const newRange = document.createRange();
    newRange.setStart(startContainer, startOffset);
    newRange.setEnd(endContainer, endOffset);
    return newRange;
  }
  
  // function to unwrap span and div elements in (inner.html)
  function unwrapElement(el) {
    const parent = el.parentNode;
    while (el.firstChild) {
      parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
    parent.normalize(); // Merge text nodes
  }
  

  
  // function to remove empty span and div elements in (inner.html)
  function removeEmptyElements(element) {
    const elements = element.querySelectorAll("span, div");
    elements.forEach((el) => {
      // Checks if the element is a span or div with no direct text content
      if (!el.textContent.trim()) {
        unwrapElement(el);
      } else if (el.tagName === "SPAN" && !el.style.cssText.trim()) {
        // Checks if all child elements in the selected area are spans with no text or style
        let allChildrenAreEmptySpans = Array.from(el.children).every(
          (child) =>
            child.tagName === "SPAN" &&
            !child.textContent.trim() &&
            !child.style.cssText.trim()
        );
  
        if (allChildrenAreEmptySpans) {
          unwrapElement(el);
        }
      }
    });
  }



  export {
    increaseFontSize,
    decreaseFontSize,
    applyBold,
    applyItalic,
    applyUnderline,
    applyPlainText,
    removeEmptyElements,
  };