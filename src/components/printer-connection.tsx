"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Printer, RefreshCw } from "lucide-react";

// Define types for DYMO devices
type DymoDevice = {
  vendorId: number;
  productId: number;
  name: string;
  device: USBDevice;
};

export function PrinterConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentDevice, setCurrentDevice] = useState<USBDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dymoDevices, setDymoDevices] = useState<DymoDevice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // DYMO LabelWriter 550 has vendorId 0x0922 (2338) and productId 0x0028 (40)
  const DYMO_VENDOR_ID = 0x0922;

  // Function to detect DYMO printers that are already authorized
  const detectAuthorizedPrinters = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // This only returns devices the user has already granted permission to
      const devices = await navigator.usb.getDevices();

      const dymoDevices = devices.filter(
        (device) =>
          device.vendorId === DYMO_VENDOR_ID ||
          (device.manufacturerName &&
            device.manufacturerName.toLowerCase().includes("dymo"))
      );

      const formattedDevices = dymoDevices.map((device) => ({
        vendorId: device.vendorId,
        productId: device.productId,
        name: device.productName || "Unknown DYMO Printer",
        device: device,
      }));

      setDymoDevices(formattedDevices);

      if (formattedDevices.length > 0) {
        console.log("Already authorized DYMO printers:", formattedDevices);
      } else {
        console.log("No previously authorized DYMO printers found");
      }
    } catch (err) {
      console.error("Error detecting printers:", err);
      setError(
        "Failed to detect printers. Please ensure USB access is allowed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Call detection on component mount
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.usb) {
      detectAuthorizedPrinters();
    }
  }, []); // Added empty dependency array to fix the issue

  const requestPrinterAccess = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Request a new device - this will prompt the user for permission
      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: DYMO_VENDOR_ID }, // Filter for any DYMO device
        ],
      });

      console.log("Selected device:", device);

      try {
        // Attempt to open the USB device and handle it
        await device.open();

        // Handle configuration if necessary
        if (device.configuration === null) {
          await device.selectConfiguration(1);
        }

        await device.claimInterface(0);
        setCurrentDevice(device);
        setIsConnected(true);

        // Handle success
        setError(null);
      } catch (openError: unknown) {
        console.error("Error opening device:", openError);

        // Check if the error is an instance of Error and has the 'name' property
        if (openError instanceof Error && openError.name === "SecurityError") {
          setError(
            "Security Error: The browser denied access to the device. " +
              "This may be because the site is not secure (HTTPS) or the USB device requires special permissions. " +
              "Try using Chrome and ensure you're on an HTTPS connection."
          );
        } else if (openError instanceof Error) {
          setError(`Failed to open the printer: ${openError.message}`);
        } else {
          setError("An unknown error occurred while opening the device.");
        }
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error requesting device:", err);
      setError("No printer was selected or access was denied.");
      setIsLoading(false);
    }
  };

  const connectToDevice = async (device: USBDevice): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Device might already be open
      if (!device.opened) {
        await device.open();
      }

      // Select configuration if needed
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }

      // Claim the interface
      await device.claimInterface(0);

      setCurrentDevice(device);
      setIsConnected(true);
      console.log("Successfully connected to device:", device.productName);
    } catch (err) {
      console.error("Error connecting to device:", err);
      setError(`Failed to connect to ${device.productName || "printer"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectPrinter = async (): Promise<void> => {
    if (!currentDevice) return;

    try {
      await currentDevice.close();
      setCurrentDevice(null);
      setIsConnected(false);
    } catch (err) {
      console.error("Error disconnecting printer:", err);
      setError(`Failed to disconnect`);
    }
  };

  // Check if WebUSB is supported
  const isWebUSBSupported: boolean =
    typeof navigator !== "undefined" && !!navigator.usb;

  if (!isWebUSBSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>WebUSB Not Supported</AlertTitle>
        <AlertDescription>
          Your browser doesn&apos;t support WebUSB. Please use Chrome or Edge on
          desktop.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Button
          onClick={requestPrinterAccess}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Printer className="mr-2 h-4 w-4" />
              Connect DYMO Printer
            </>
          )}
        </Button>

        <Button
          onClick={detectAuthorizedPrinters}
          variant="outline"
          disabled={isLoading}
          className="w-full"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh Authorized Printers
        </Button>
      </div>

      {dymoDevices.length > 0 && (
        <div className="space-y-2 border rounded-md p-4">
          <h3 className="font-medium">Authorized DYMO Printers:</h3>
          <div className="space-y-2">
            {dymoDevices.map((dymo, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm">
                  {dymo.name}
                  <span className="text-xs text-muted-foreground ml-2">
                    (VID: 0x{dymo.vendorId.toString(16)}, PID: 0x
                    {dymo.productId.toString(16)})
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={
                    isLoading ||
                    (isConnected &&
                      currentDevice?.serialNumber === dymo.device.serialNumber)
                  }
                  onClick={() => connectToDevice(dymo.device)}
                >
                  {isConnected &&
                  currentDevice?.serialNumber === dymo.device.serialNumber
                    ? "Connected"
                    : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isConnected && currentDevice && (
        <div className="border rounded-md p-4 bg-green-50 dark:bg-green-950">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-300">
                Connected to Printer
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                {currentDevice.productName || "Unknown Printer"}
                {currentDevice.serialNumber &&
                  ` (S/N: ${currentDevice.serialNumber})`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectPrinter}>
              Disconnect
            </Button>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-4">
        <p>
          Note: WebUSB requires HTTPS in production environments. For local
          development, you may need to enable the &quot;Experimental Web
          Platform features&quot; flag in Chrome.
        </p>
      </div>
    </div>
  );
}
