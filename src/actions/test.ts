"use server";

import { prisma } from "@/lib/prisma";

export async function createTestModels() {
  try {
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

    const models = ['Tab E 9.6" (2015)', 'Tab E 8.0" (2016)'];

    // Use for...of loop to handle async/await properly
    for (const modelName of models) {
      // Create the repair model first
      const model = await prisma.repairModel.create({
        data: {
          name: modelName, // Use the model name here
          seriesId: "679656f8d3fc6bc736fa8924",
        },
      });

      // Prepare data for bulk insert of service types
      const serviceTypesData = serviceCategories.map((category) => ({
        name: category.name,
        repairModelId: model.id,
      }));

      // Create service types in bulk
      await prisma.repairServiceType.createMany({
        data: serviceTypesData,
      });

      // Retrieve service type ids from the database
      const serviceTypes = await prisma.repairServiceType.findMany({
        where: { repairModelId: model.id },
        select: { id: true, name: true },
      });

      // Create a mapping of service types by name to id
      const serviceTypeIdsMap = new Map<string, string>();
      serviceTypes.forEach((type: any) => {
        serviceTypeIdsMap.set(type.name, type.id.toString()); // Ensure id is a string
      });

      // Map services to their respective service types using the ids
      const servicesData = serviceCategories.flatMap((category) => {
        return category.services.map((serviceName) => {
          const serviceTypeId = serviceTypeIdsMap.get(category.name);
          if (!serviceTypeId) {
            throw new Error(`Service type for ${category.name} not found`);
          }

          return {
            name: serviceName,
            repairServiceTypeId: serviceTypeId, // Ensure it's a string
          };
        });
      });

      // Create services in bulk
      await prisma.repairService.createMany({
        data: servicesData,
      });
      console.log(modelName);
    }

    // If the transaction completes successfully
    return {
      success: true,
      message: "Model added successfully",
    };
  } catch (error) {
    console.error(error); // log error for debugging
    return {
      success: false,
      message: "Failed to add model. Please try again.",
    };
  }
}
