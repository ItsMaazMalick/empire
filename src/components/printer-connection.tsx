"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type PrinterConnectionProps = {
  labelData: string;
};

export function PrinterConnection({ labelData }: PrinterConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [printer, setPrinter] = useState<BluetoothDevice | null>(null);

  const connectPrinter = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "QR380A-241Z-6FED" }],
        optionalServices: ["8A20C750-1C94-BE41-411D-51A55570E680"],
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService(
        "8A20C750-1C94-BE41-411D-51A55570E680"
      );

      if (service) {
        setIsConnected(true);
        setPrinter(device);
        console.log("Connected to printer");
      }
    } catch (error) {
      console.error("Error connecting to printer:", error);
    }
  };

  const printLabel = async () => {
    if (!printer || !labelData) {
      console.error("Printer not connected or no label data");
      return;
    }

    try {
      const server = await printer.gatt?.connect();
      const service = await server?.getPrimaryService(
        "000018f0-0000-1000-8000-00805f9b34fb"
      );
      const characteristic = await service?.getCharacteristic(
        "00002af1-0000-1000-8000-00805f9b34fb"
      );

      if (characteristic) {
        // This is a simplified example. You'd need to format the labelData
        // according to the printer's specific command language.
        const encoder = new TextEncoder();
        const labelBytes = encoder.encode(labelData);
        await characteristic.writeValue(labelBytes);
        console.log("Label sent to printer");
      }
    } catch (error) {
      console.error("Error printing label:", error);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <Button onClick={connectPrinter} disabled={isConnected}>
        {isConnected ? "Printer Connected" : "Connect Printer"}
      </Button>
      <Button onClick={printLabel} disabled={!isConnected || !labelData}>
        Print Label
      </Button>
    </div>
  );
}
