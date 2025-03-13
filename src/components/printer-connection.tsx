"use client";

import { useReactToPrint } from "react-to-print";
import { Fragment, useRef } from "react";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";

export function PrintLabel({ order }: any) {
  console.log(order);
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
      <Button onClick={handlePrint} variant={"secondary"} className="w-full">
        <Printer /> Print last order receipt
      </Button>

      <div className="hidden">
        <div
          ref={componentRef}
          className="w-[340px] h-[113px] p-2 text-sm flex items-center"
        >
          {/* Content to be printed */}
          <div className="flex-1 font-semibold">
            <p>Customer Name</p>
            <p>Contact</p>
            {order.orderItems?.map((item: any, index: number) => (
              <Fragment key={index}>
                <p>Service / Qty</p>
              </Fragment>
            ))}
            {order.orderProducts?.map((item: any, index: number) => (
              <Fragment key={index}>
                <p>Name / Qty</p>
              </Fragment>
            ))}

            <p>Price</p>
          </div>
          <div className="flex-1">
            <p>{order.customer.name}</p>
            <p>{order.customer.phone}</p>
            {order.orderItems?.map((item: any, index: number) => (
              <Fragment key={index}>
                <p>
                  {item.orderService.repairServiceType.name} / {item.quantity}
                </p>
              </Fragment>
            ))}
            {order.orderProducts?.map((item: any, index: number) => (
              <Fragment key={index}>
                <p>
                  {item.orderProduct.title} / {item.quantity}
                </p>
              </Fragment>
            ))}

            <p>${order.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
