"use client";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
// Correct import with named export
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";

export function PrintProduct({ buttonTitle, product }: any) {
  const componentRef = useRef<HTMLDivElement>(null);

  const printFunction = useReactToPrint({
    documentTitle: "Print Document",
    contentRef: componentRef,
  });

  const handlePrint = () => {
    if (printFunction) {
      printFunction();
    }
  };

  return (
    <div>
      <Button onClick={handlePrint} variant={"outline"} className="w-full">
        <Printer className="" /> {buttonTitle}
      </Button>

      <div className="hidden">
        <div ref={componentRef} className="w-[330px] h-[113px] p-3">
          {/* Content to be printed */}
          <div className="w-full flex items-center">
            <div className="flex-1">
              <p className="">Name</p>
              <p className="">Network</p>
              <p className="">Storage</p>
              <p className="">Price</p>
            </div>
            <div className="flex-1">
              <p>{product.title}</p>
              <p>{product.network}</p>
              <p>{product.storage}</p>
              <p>${product.price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
