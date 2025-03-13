"use client";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
// Correct import with named export
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";

export function PrintLabel({ buttonTitle, storeId, baseUrl, order }: any) {
  const componentRef = useRef<HTMLDivElement>(null);

  // Full URL for QR code (can handle long data)
  const fullUrl = `${baseUrl}/${storeId}/orders/${order?.id}`;

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
      <Button onClick={handlePrint} variant={"secondary"} className="w-full">
        <Printer className="mr-2" /> {buttonTitle}
      </Button>

      <div className="hidden">
        <div ref={componentRef} className="w-[330px] h-[113px] p-3 ">
          {/* Content to be printed */}
          <div className="w-full flex items-center">
            <div className="flex-1">
              {/* <p className="text-[8px]">Customer Name</p> */}
              <p className="text-[10px] font-semibold ml-2">
                Name : {order?.customer?.name}
              </p>
              {/* <p className="text-[8px]">Contact</p> */}
              <p className="text-[10px] font-semibold ml-2">
                Contact : {order?.customer?.phone}
              </p>
              {/* <p className="text-[8px]">Price</p> */}
              <p className="text-[10px] font-semibold ml-2">
                Price : ${order?.price}
              </p>
              {order?.orderItems.length > 0 && (
                <p className="text-[10px] font-semibold ml-2">
                  Service :&nbsp;
                  {order.orderItems
                    .map((item: any, index: number) => {
                      const serviceName =
                        item.orderService.repairServiceType.name;
                      const firstLetters = serviceName
                        .split(" ") // Split the name into words
                        .map((word: string) => word[0].toUpperCase()) // Get the first letter of each word
                        .join(""); // Join the letters into a single string

                      return firstLetters; // Display the first letters
                    })
                    .join(" / ")}
                </p>
              )}
              {order?.orderProducts.length > 0 && (
                <p className="text-[10px] font-semibold ml-2">
                  Name :&nbsp;
                  {order.orderProducts
                    .map((item: any, index: number) => {
                      const mobileName = item.orderProduct.title;

                      return mobileName; // Display the first letters
                    })
                    .join(" / ")}
                </p>
              )}
              <p className="text-[10px] font-semibold ml-2">
                Date : {format(order?.updatedAt, "dd-MMM-yy")}
              </p>
            </div>
            <div className="flex-1 flex justify-end items-center ">
              <QRCodeSVG value={fullUrl} size={80} level="M" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
