"use client";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "./ui/button";

export function PrintLabel() {
  const componentRef = useRef<HTMLDivElement>(null);

  const printFunction = useReactToPrint({
    // The correct property is 'documentTitle', not 'content'
    documentTitle: "Print Document",
    // Use contentRef to specify the component to print
    contentRef: componentRef,
  });

  const handlePrint = () => {
    if (printFunction) {
      printFunction();
    }
  };

  return (
    <div>
      <Button onClick={handlePrint}>Print this section</Button>

      <div ref={componentRef}>
        {/* Content to be printed */}
        <h1>This will be printed</h1>
        <p>All content in this div will appear in the printout</p>
      </div>
    </div>
  );
}
