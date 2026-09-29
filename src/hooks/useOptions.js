import { useTranslation } from "react-i18next";

import { buildOptions } from "@/utils/constants";

// const roleOptions = useOptions(ROLE_VALUES, "roles");
// -> [{ value: "admin", label: "Admin" }, ...] in the current language
export const useOptions = (values, namespace) => {
  const { t } = useTranslation();
  return buildOptions(values, namespace, t);
};