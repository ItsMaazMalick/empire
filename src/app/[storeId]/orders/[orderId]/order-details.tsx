"use client";

import { HelpCircle, Mail, MessageSquare, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Fragment } from "react";
import { UpdateServiceModal } from "./update-service-modal";

type Props = {
  order: any;
};

export function OrderDetails({ order }: Props) {
  return (
    <div className="space-y-6">
      {/* Repair Details */}
      <div className="bg-[#1A2337] rounded-lg border border-gray-700">
        {order.orderItems && order.orderItems.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-700">
                <TableHead>Name</TableHead>
                <TableHead>IMEI/SN</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead className="flex items-center gap-2">
                  Repair status
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current repair status</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item: any) => (
                <Fragment key={item.id}>
                  <TableRow className="border-gray-700">
                    <TableCell className="text-blue-400">
                      {item.orderService.repairServiceType.repairModel.name}
                    </TableCell>
                    <TableCell>{item.imei}</TableCell>
                    <TableCell>{item.password}</TableCell>
                    <TableCell>
                      {item.dueDate
                        ? new Date(item.dueDate).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <UpdateServiceModal item={item} />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      ${item.orderService.price.toFixed(2)}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-gray-600"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={5} className="text-gray-400">
                      {item.orderService.repairServiceType.name} -{" "}
                      {item.orderService.name}
                    </TableCell>
                    <TableCell>${item.orderService.price.toFixed(2)}</TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
        {order.orderProducts && order.orderProducts.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-700">
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderProducts.map((item: any) => (
                <TableRow key={item.id} className="border-gray-700">
                  <TableCell className="text-blue-400">
                    {item.orderProduct.title}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    ${(item.orderProduct.price * item.quantity).toFixed(2)}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-gray-600"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Payment Details */}
      <div className="bg-[#1A2337] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Payment</h2>
          <span className="px-2 py-0.5 text-sm bg-green-500/20 text-green-500 rounded-full">
            {order.orderStatus}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${order.price.toFixed(2)}</span>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-gray-600">
                Print thermal receipt
              </Button>
              <Button variant="outline" className="border-gray-600">
                Print Letter Receipt
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="border-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                Send as Email
              </Button>
              <Button variant="outline" className="border-gray-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send as Text
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
