import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface RepairServiceType {
  id: string;
  name: string;
  repairServices: RepairService[];
}

type RepairService = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

interface DisplayRepairServicesModalProps {
  serviceType: RepairServiceType;
  children: React.ReactNode;
  onSelectService: (repairService: RepairService) => void;
  selectedServices: string[];
}

export function DisplayRepairServicesModal({
  children,
  serviceType,
  onSelectService,
  selectedServices,
}: DisplayRepairServicesModalProps) {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (service: RepairService) => {
    onSelectService(service);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form>
          <DialogHeader>
            <DialogTitle className="mb-4">{serviceType.name}</DialogTitle>
          </DialogHeader>
          <div className="">
            {serviceType.repairServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center bg-primary/20 p-1 rounded-md my-1"
              >
                <p className="w-[50%]">{service.name}</p>
                <p className="w-[20%]">{service.stock}&nbsp;stock</p>
                <p className="w-[20%]">${service.price}</p>
                <input
                  className="w-[10%]"
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleCheckboxChange(service)}
                />
              </div>
            ))}
          </div>
          <DialogFooter></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
