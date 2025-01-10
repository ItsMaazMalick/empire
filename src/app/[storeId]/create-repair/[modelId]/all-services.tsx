"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { DisplayRepairServicesModal } from "./display-repair-services-modal";
import { useCartStore } from "@/store";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  repairService: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
  };
};

export function AllServices({ services }: any) {
  const { addServices, updateOrderDetails, order } = useCartStore();

  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const router = useRouter();

  const handleAddService = (serviceType: any, repairService: any) => {
    const existingServiceIndex = selectedServices.findIndex(
      (service) => service.repairService.id === repairService.id
    );

    if (existingServiceIndex >= 0) {
      setSelectedServices((prev) =>
        prev.filter((_, index) => index !== existingServiceIndex)
      );
    } else {
      const newService: Service = {
        id: serviceType.id,
        name: serviceType.name,
        repairService: {
          id: repairService.id,
          name: repairService.name,
          price: repairService.price,
          quantity: 1,
          stock: repairService.stock,
        },
      };
      setSelectedServices((prev) => [...prev, newService]);
    }
  };

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((service) =>
        service.repairService.id === serviceId
          ? {
              ...service,
              repairService: { ...service.repairService, quantity },
            }
          : service
      )
    );
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.filter((service) => service.repairService.id !== serviceId)
    );
  };

  const handleAddToCart = () => {
    const orderServices = selectedServices.map((service) => ({
      name: service.repairService.name,
      quantity: service.repairService.quantity,
      imei: "",
      repairStatus: "PENDING" as const,
      repairServiceType: service.name,
      serviceId: service.repairService.id,
      price: service.repairService.price,
      type: "REPAIR",
    }));

    addServices(orderServices);
    setSelectedServices([]);
    router.push("/123/cart");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-[80%] p-4 grid grid-cols-3 gap-4 text-sm max-h-[calc(100vh-152px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full">
        {services?.repairServiceType.map((type: any) => (
          <DisplayRepairServicesModal
            key={type.id}
            serviceType={type}
            onSelectService={(repairService) =>
              handleAddService(type, repairService)
            }
            selectedServices={selectedServices.map(
              (service) => service.repairService.id
            )}
          >
            <div className="p-4 bg-card text-card-foreground rounded-md hover:scale-105 transition-all duration-300">
              <p className="text-md font-semibold">{type.name}</p>
              <p>
                $
                {Math.min(
                  ...type.repairServices.map((service: any) => service.price)
                ).toFixed(2)}{" "}
                - $
                {Math.max(
                  ...type.repairServices.map((service: any) => service.price)
                ).toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-green-400">
                  {type.repairServices.reduce(
                    (total: number, service: any) => total + service.stock,
                    0
                  )}{" "}
                  in stock
                </p>
                <p>for {type.repairServices.length} items</p>
              </div>
            </div>
          </DisplayRepairServicesModal>
        ))}
      </div>
      <div className="w-full lg:w-[20%] bg-card p-4 flex flex-col gap-4 max-h-[calc(100vh-152px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full text-xs">
        {selectedServices.map((service) => (
          <div
            key={service.repairService.id}
            className="flex flex-col gap-2 bg-primary/20 p-2 rounded-md"
          >
            <div>
              <p className="font-semibold text-primary">{service.name}</p>
              <p>{service.repairService.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <Input
                type="number"
                placeholder="Quantity"
                value={service.repairService.quantity}
                onChange={(e) =>
                  handleQuantityChange(
                    service.repairService.id,
                    parseInt(e.target.value) || 1
                  )
                }
                min={1}
                max={service.repairService.stock}
                className="w-20"
              />
              <p>
                $
                {(
                  service.repairService.price * service.repairService.quantity
                ).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveService(service.repairService.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {selectedServices.length > 0 && (
          <div className="mt-4 mx-auto">
            <Button onClick={handleAddToCart}>Add repair to order</Button>
          </div>
        )}
      </div>
    </div>
  );
}
