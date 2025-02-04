"use server";

import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";

export async function printBarcode() {
  const barcodeData = "123456789";

  if (!barcodeData) {
    return { success: false, message: "Barcode data is required" };
  }

  try {
    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON, // Change this to PrinterTypes.STAR if you're using a Star printer
      interface: "printer:ZebraPrinter", // Replace with your printer's interface
      options: {
        timeout: 1000,
      },
      width: 48, // Adjust this value based on your printer's paper width
    });

    await printer.isPrinterConnected();

    printer.alignCenter();
    printer.printBarcode(barcodeData);
    printer.cut();

    const result = await printer.execute();
    console.log("Print result:", result);

    return { success: true, message: "Barcode printed successfully" };
  } catch (error) {
    console.error("Printing error:", error);
    return { success: false, message: "Failed to print barcode" };
  }
}
