export const validateRequiredField = (
  fieldName: string,
  value: any
): boolean => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    console.error(`${fieldName} is required.`);
    return false;
  }
  return true;
};
