"use client";

import { getAllCustomers } from "@/actions/customers";
import { getUsers } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddCustomerModal } from "./add-customer-modal";
import { createOrder } from "@/actions/order";
import { RepairStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

type Customer = {
  name: string;
  id: string;
  phone: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  calculateCommition: string | null;
  storeId: string;
};

export default function Cart() {
  const {
    order,
    removeService,
    updateService,
    removeOrder,
    clearOrder,
    updateOrderDetails,
  } = useCartStore(); // Assuming `updateService` is available in your store

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const customers = await getAllCustomers();
      const users = await getUsers();
      setCustomers(customers ?? []);
      setUsers(users ?? []);
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    serviceId: string,
    field: string
  ) => {
    updateService(serviceId, { [field]: e.target.value });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    serviceId: string
  ) => {
    updateService(serviceId, { status: e.target.value as RepairStatus });
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    serviceId: string
  ) => {
    updateService(serviceId, { dueDate: e.target.value });
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCustomerId = e.target.value;
    const selectedCustomer = customers.find(
      (customer) => customer.id === selectedCustomerId
    );

    if (selectedCustomer) {
      updateOrderDetails({
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
          email: selectedCustomer.email || "",
        },
      });
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find((user) => user.id === selectedUserId);

    if (selectedUser) {
      updateOrderDetails({
        userId: selectedUser.id,
      });
    }
  };

  const router = useRouter();

  const handleSubmit = async () => {
    console.log(order);
    const res = await createOrder(order);
    if (res?.success) {
      clearOrder();
      router.push("/123/dashboard");
    }
  };

  return (
    <div className="p-4 lg:p-10 flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-[70%] ">
        <div className="p-4 rounded-lg bg-card text-card-foreground">
          <div className="flex items-center text-xs font-semibold gap-1 my-2">
            <p className="w-[25%] text-center">Repair Device</p>
            <p className="w-[15%] text-center">IMEI</p>
            <p className="w-[15%] text-center">Password</p>
            <p className="w-[15%] text-center">Due Date</p>
            <p className="w-[15%] text-center">Repair Status</p>
            <p className="w-[15%] text-center">Price</p>
            <p className="">Actions</p>
          </div>
          {order?.orderServices.map((item, index) => (
            <div key={index} className="flex items-center text-xs gap-1 my-2">
              <p className="w-[25%] text-center text-primary">
                {item.repairServiceType} - {item.name}
              </p>
              <p className="w-[15%] text-center">
                <Input
                  placeholder="IMEI/SN"
                  value={item.imei || ""}
                  onChange={(e) => handleInputChange(e, item.serviceId, "imei")}
                />
              </p>
              <p className="w-[15%] text-center">
                <Input
                  placeholder="Password"
                  value={item.password || ""}
                  onChange={(e) =>
                    handleInputChange(e, item.serviceId, "password")
                  }
                />
              </p>
              <p className="w-[15%] text-center">
                <input
                  type="date"
                  value={item.dueDate || ""}
                  className="bg-background p-3 rounded-md ring-1 ring-white text-foreground"
                  onChange={(e) => handleDateChange(e, item.serviceId)}
                />
              </p>
              <p className="w-[15%] text-center">
                <select
                  value={item.status || ""}
                  onChange={(e) => handleSelectChange(e, item.serviceId)}
                  className="bg-background p-3 rounded-md ring-1 ring-white"
                >
                  <option value="">Select Status</option>
                  <option value="WAITING_FOR_PARTS">Waiting for Parts</option>
                  <option value="WORKING_ON_IT">Working on it</option>
                  <option value="PENDING">Pending</option>
                  <option value="FIXED">Fixed</option>
                  <option value="PICKED_UP">Picked Up</option>
                </select>
              </p>
              <p className="w-[15%] text-center">${item.price || "0.0"}</p>
              <p
                className="hover:bg-white transition-all duration-300 p-2 rounded-md"
                onClick={() => removeService(item.serviceId)}
              >
                <Trash2 className="text-destructive size-4 cursor-pointer" />
              </p>
            </div>
          ))}
        </div>
        {/* <div className="my-4 p-4 rounded-lg bg-card text-card-foreground">
           TODO: 
          <p>Payment</p>
        </div> */}
      </div>
      <div className="w-full lg:w-[30%]">
        <div className="p-4 rounded-lg bg-card text-card-foreground">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="">Add Customer</label>
            <select
              name="customer"
              id="customer"
              className="p-2 bg-background ring-1 ring-white rounded-md"
              value={order?.customer?.id || ""}
              onChange={handleCustomerChange}
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <AddCustomerModal />
          </div>
        </div>
        <div className="my-4 p-4 rounded-lg bg-card text-card-foreground">
          <Label>Order Notes</Label>
          <Input
            onChange={(e) => updateOrderDetails({ orderNotes: e.target.value })}
            value={order?.orderNotes || ""}
            placeholder="Order Notes"
          />
        </div>
        <div className="my-4 p-4 rounded-lg bg-card text-card-foreground">
          <Label>Add tags</Label>
          <Input
            onChange={(e) => updateOrderDetails({ tags: [e.target.value] })}
            value={order?.tags || ""}
            placeholder="Add Tags"
          />
        </div>
        <div className="my-4 p-4 rounded-lg bg-card text-card-foreground">
          <Label>Repair Notes</Label>
          <Input
            onChange={(e) =>
              updateOrderDetails({ repairNotes: e.target.value })
            }
            value={order?.repairNotes || ""}
            placeholder="Repair Notes"
          />
        </div>
        <div className="p-4 rounded-lg bg-card text-card-foreground">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="">Assign Tech</label>
            <select
              name=""
              id=""
              value={order?.userId || ""}
              onChange={handleUserChange}
              className="p-2 bg-background ring-1 ring-white rounded-md"
            >
              <option value="">Select Tech</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="my-4 p-4 rounded-lg bg-card text-card-foreground">
          <Button
            onClick={() => clearOrder()}
            className="w-full"
            variant={"destructive"}
          >
            Clear Cart
          </Button>
          <Button className="w-full" variant={"link"}>
            Add Repair Device
          </Button>
          <Button onClick={handleSubmit} className="w-full">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
