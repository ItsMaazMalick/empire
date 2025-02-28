"use client";

import { useState } from "react";
import { prepareLabelData } from "@/actions/actions";
import { PrinterConnection } from "@/components/printer-connection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PrintPage() {
  const [labelData, setLabelData] = useState("");

  async function handleSubmit(formData: FormData) {
    const data = await prepareLabelData(formData);
    setLabelData(data);
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shipping Label Printer</h1>
      <form action={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Name" required />
        <Input name="address" placeholder="Address" required />
        <Input name="city" placeholder="City" required />
        <Input name="state" placeholder="State" required />
        <Input name="zip" placeholder="ZIP Code" required />
        <Button type="submit">Generate Label</Button>
      </form>
      {labelData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Label:</h2>
          <pre className="bg-gray-100 p-4 rounded">{labelData}</pre>
        </div>
      )}
      <PrinterConnection />
    </main>
  );
}
