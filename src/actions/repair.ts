"use server";

import { session } from "@/constants/data";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/repair-brand";
import { revalidatePath } from "next/cache";

export async function createRepairBrand(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const brandName = formData.get("name") as string;
    if (!brandName) {
      return {
        success: false,
        message: "Brand name is required",
      };
    }

    await prisma.repairBrand.create({
      data: {
        name: brandName,
        storeId: session.user.storeId,
      },
    });
    revalidatePath(`/${session.user.storeId}/edit-repair`);
    return {
      success: true,
      message: "Brand added successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to add brand. Please try again.",
    };
  }
}

export async function createRepairSeries(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const seriesName = formData.get("name") as string;
    const brandId = formData.get("brandId") as string;
    if (!seriesName || !brandId) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    await prisma.repairSeries.create({
      data: {
        name: seriesName,
        brandId: brandId,
      },
    });
    revalidatePath(`/${session.user.storeId}/edit-repair`);
    return {
      success: true,
      message: "Series added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add series. Please try again.",
    };
  }
}

export async function createRepairModel(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const modelName = formData.get("name") as string;
    const seriesId = formData.get("seriesId") as string;

    if (!modelName || !seriesId) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Define service categories and their respective services
    const serviceCategories = [
      {
        name: "LCD Screen",
        services: [
          "Incell",
          "Hard Oled",
          "Soft Oled",
          "Refurbished",
          "Genuine (OEM)",
        ],
      },
      {
        name: "Charging Port",
        services: [
          "Charging port Pin - soldering required",
          "Charging port Flex",
          "Charging port Board",
        ],
      },
      {
        name: "Battery",
        services: ["Replacement battery", "Genuine (OEM) Battery"],
      },
      {
        name: "Back Glass",
        services: ["Black", "White", "Red", "Blue", "Pink", "Yellow"],
      },
      {
        name: "Housing",
        services: ["Black", "White", "Red", "Blue", "Pink", "Yellow"],
      },
      {
        name: "Cameras",
        services: ["Rear Camera", "Front Camera"],
      },
      {
        name: "Speakers",
        services: ["Load Speaker", "Ear Speaker"],
      },
      {
        name: "Antenas",
        services: [
          "Antenna Cable Connector To Antenna Board",
          "Antenna Signal Flex Cable",
          "Antenna Connecting Cable",
          "WiFi Antenna Flex Cable",
          "GPS Antenna Flex Cable",
          "Bluetooth Antenna Flex Cable",
          "5G Antenna Flex Cable",
        ],
      },
      {
        name: "Flex Cable",
        services: [
          "Flash Flex Cable",
          "Wireless Coil",
          "Proximity Light Sensor",
        ],
      },
      {
        name: "Camera Lens",
        services: [], // No services defined, adjust as needed
      },
      {
        name: "Mother Board Service",
        services: ["No Power", "Water Damage"],
      },
      {
        name: "Unlock & Service",
        services: ["Hard Reset", "Data Transfer", "Carrier Unlock"],
      },
      {
        name: "Buttons",
        services: [
          "Power Button",
          "Volume Button",
          "Home Button",
          "Hard Button",
        ],
      },
    ];

    const model = await prisma.repairModel.create({
      data: {
        name: modelName,
        seriesId: seriesId,
      },
    });

    // Perform all the operations in a transaction
    const transactionOps = serviceCategories.map(async (category) => {
      return prisma.$transaction(async () => {
        const serviceType = await prisma.repairServiceType.create({
          data: {
            name: category.name,
            repairModelId: model.id,
          },
        });

        return Promise.all(
          category.services.map((serviceName) =>
            prisma.repairService.create({
              data: {
                name: serviceName,
                repairServiceTypeId: serviceType.id,
              },
            })
          )
        );
      });
    });

    await Promise.all(transactionOps);

    // If the transaction completes successfully
    revalidatePath(`/${session.user.storeId}/edit-repair`);
    return {
      success: true,
      message: "Model added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add model. Please try again.",
    };
  }
}

export async function getAllRepairBrandswithSeriesModal() {
  try {
    const brands = await prisma.repairBrand.findMany({
      where: {
        storeId: session.user.storeId,
      },
      include: {
        repairSeries: {
          include: {
            models: true,
          },
        },
      },
    });
    return brands;
  } catch (error) {
    return null;
  }
}

export async function getRepairServicesByModelId(modelId: string) {
  try {
    const services = await prisma.repairModel.findUnique({
      where: { id: modelId },
      include: {
        repairServiceType: {
          include: {
            repairServices: true,
          },
        },
        series: {
          include: {
            brand: true,
          },
        },
      },
    });
    return services;
  } catch (error) {
    return null;
  }
}

export async function updateRepairPrice(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const modelId = formData.get("modelId") as string;
    const stock = Number(formData.get("stock"));
    const cost = Number(formData.get("cost"));
    const price = Number(formData.get("price"));
    const name = formData.get("name") as string;

    if (!modelId || !name) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    await prisma.repairService.update({
      where: { id: modelId },
      data: {
        name: name,
        cost: cost,
        price: price,
        stock: stock,
      },
    });
    revalidatePath(
      `/${session.user.storeId}/create-repair/${modelId}/edit-prices`
    );
    return {
      success: true,
      message: "Price updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update price. Please try again.",
    };
  }
}
