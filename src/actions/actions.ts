"use server";

type AddressData = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export async function generateLabelData(
  addressData: AddressData
): Promise<string> {
  // This is a placeholder function. In a real-world scenario, you would
  // generate the actual label data here, possibly using a third-party API
  // or a more complex label generation logic.
  const { name, address, city, state, zip } = addressData;
  return `
      ${name}
      ${address}
      ${city}, ${state} ${zip}
    `.trim();
}

export async function prepareLabelData(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;

  const labelData = await generateLabelData({
    name,
    address,
    city,
    state,
    zip,
  });
  return labelData;
}
