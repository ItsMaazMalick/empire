// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";

// // We'll detect these dynamically
// type DymoDevice = {
//   vendorId: number;
//   productId: number;
//   name: string;
// };

// export function PrinterConnection() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [device, setDevice] = useState<USBDevice | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [dymoDevices, setDymoDevices] = useState<DymoDevice[]>([]);
//   const labelData = "123456789";

//   // Function to detect DYMO printers
//   const detectDymoPrinters = async () => {
//     try {
//       const devices = await navigator.usb.getDevices();
//       const dymoDevices = devices.filter((device) => {
//         // Log device information to find DYMO printers
//         console.log("Found USB device:", {
//           vendorId: device.vendorId.toString(16),
//           productId: device.productId.toString(16),
//           manufacturerName: device.manufacturerName,
//           productName: device.productName,
//         });

//         // Return true if it's a DYMO device
//         return device.manufacturerName?.toLowerCase().includes("dymo");
//       });

//       const formattedDevices = dymoDevices.map((device) => ({
//         vendorId: device.vendorId,
//         productId: device.productId,
//         name: device.productName || "Unknown DYMO Printer",
//       }));

//       setDymoDevices(formattedDevices);
//       console.log("DYMO printers found:", formattedDevices);
//     } catch (err) {
//       console.error("Error detecting printers:", err);
//       setError(
//         "Failed to detect printers. Please ensure USB access is allowed."
//       );
//     }
//   };

//   // Call detection on component mount
//   useEffect(() => {
//     detectDymoPrinters();
//   }, []); // Added dependency array to fix the lint warning

//   const connectPrinter = async () => {
//     try {
//       // Request access to any USB device first to see what's available

//       const device = await navigator.usb.requestDevice({
//         filters: [
//           { vendorId: 0x922, productId: 0x28 }, // DYMO printer's Vendor ID and Product ID
//         ],
//       });

//       console.log("Selected device:", {
//         vendorId: device.vendorId.toString(16),
//         productId: device.productId.toString(16),
//         manufacturerName: device.manufacturerName,
//         productName: device.productName,
//       });

//       await device.open();

//       // Get the first configuration
//       if (device.configuration === null) {
//         await device.selectConfiguration(1);
//       }

//       // Claim the first interface
//       await device.claimInterface(0);

//       setDevice(device);
//       setIsConnected(true);
//       setError(null);

//       // Store the device details for future reference
//       const dymoDevice = {
//         vendorId: device.vendorId,
//         productId: device.productId,
//         name: device.productName || "Unknown DYMO Printer",
//       };
//       setDymoDevices([dymoDevice]);
//     } catch (err) {
//       console.error("Error connecting to printer:", err);
//       setError(
//         "Failed to connect to printer. Please make sure it's connected via USB and try again."
//       );
//     }
//   };

//   const printLabel = async () => {
//     if (!device || !labelData) {
//       setError("Printer not connected or no label data available");
//       return;
//     }

//     try {
//       // Convert label data to bytes
//       const encoder = new TextEncoder();
//       const data = encoder.encode(labelData);

//       // Find the first "out" endpoint
//       const configuration = device.configurations[0];
//       const interface_ = configuration.interfaces[0];
//       const alternate = interface_.alternates[0];
//       const endpoint = alternate.endpoints.find(
//         (e: { direction: string }) => e.direction === "out"
//       );

//       if (!endpoint) {
//         throw new Error("No output endpoint found");
//       }

//       // Send the data
//       await device.transferOut(endpoint.endpointNumber, data);
//       console.log("Data sent to printer");
//     } catch (err) {
//       console.error("Error printing label:", err);
//       setError(
//         "Failed to print label. Please check printer connection and try again."
//       );
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="space-y-4">
//         <Button
//           onClick={connectPrinter}
//           disabled={isConnected}
//           className="w-full"
//         >
//           {isConnected ? "Printer Connected" : "Connect DYMO Printer"}
//         </Button>

//         <Button
//           onClick={printLabel}
//           disabled={!isConnected || !labelData}
//           className="w-full"
//         >
//           Print Label
//         </Button>

//         <Button
//           onClick={detectDymoPrinters}
//           variant="outline"
//           className="w-full"
//         >
//           Detect DYMO Printers
//         </Button>
//       </div>

//       {dymoDevices.length > 0 && (
//         <div className="text-sm space-y-2">
//           <h3 className="font-medium">Detected DYMO Printers:</h3>
//           {dymoDevices.map((dymo, index) => (
//             <div key={index} className="text-muted-foreground">
//               {dymo.name} (VID: 0x{dymo.vendorId.toString(16)}, PID: 0x
//               {dymo.productId.toString(16)})
//             </div>
//           ))}
//         </div>
//       )}

//       {isConnected && device && (
//         <div className="text-sm text-muted-foreground">
//           Connected to: {device.productName || "Unknown Printer"}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have custom button component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming custom alert component

export function PrinterConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<USBDevice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectPrinter = async () => {
    try {
      // Check if WebUSB is supported and available in the browser
      if (!navigator.usb) {
        setError("WebUSB is not supported by your browser");
        return;
      }

      // Request access to the DYMO printer using vendorId and productId
      const selectedDevice = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x922, productId: 0x28 }], // DYMO Printer Vendor and Product ID
      });

      console.log("Selected device:", selectedDevice);

      // Open the device and set up communication
      await selectedDevice.open();
      if (selectedDevice.configuration === null) {
        await selectedDevice.selectConfiguration(1);
      }

      await selectedDevice.claimInterface(0); // Claim interface for communication

      setDevice(selectedDevice);
      setIsConnected(true);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error connecting to printer:", err);
      setError(
        "Failed to connect to the printer. Make sure the device is connected via USB."
      );
    }
  };

  useEffect(() => {
    // Ensure this is only run client-side (browser environment)
    if (typeof window !== "undefined") {
      // Browser-side code here
    }
  }, []);

  const handleClick = async () => {
    const res = await fetch("https://empire-shop.vercel.app/api/print");
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={connectPrinter}
        disabled={isConnected}
        className="w-full"
      >
        {isConnected ? "Printer Connected" : "Connect DYMO Printer"}
      </Button>

      <button onClick={handleClick}>Test</button>

      {isConnected && device && (
        <div className="text-sm text-muted-foreground">
          Connected to: {device.productName || "Unknown Printer"}
        </div>
      )}
    </div>
  );
}
