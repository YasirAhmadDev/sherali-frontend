// Removes empty values so they are not sent to the API: { from: "", page: 1 } -> { page: 1 }
export const cleanParams = (object) =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => value !== "" && value != null));