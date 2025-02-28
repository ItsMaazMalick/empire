// pages/api/print.js
import { NextRequest, NextResponse } from "next/server";
import usb from "usb";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Find the DYMO printer
    const device = usb.findByIds(0x922, 0x28);
    if (!device) {
      return NextResponse.json({ message: "DYMO printer not found" });
    }

    // Open and configure the device
    device.open();
    device.__claimInterface(0);

    // Send data to the printer (example: sending print data)
    const data = Buffer.from("Your Label Data");

    // Send the data to the printer (this step depends on your printer's communication protocol)
    device.controlTransfer(
      0x21,
      0x09,
      0x200,
      0,
      data,
      (err: any, buffer: any) => {
        if (err) {
          return NextResponse.json({
            message: "Error sending data to printer",
          });
        }

        // If successful, return a response
        return NextResponse.json({ message: "Label printed successfully" });
      }
    );
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: "Internal Server Error" });
  }
}
