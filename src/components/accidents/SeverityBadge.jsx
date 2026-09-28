import Badge from "@/components/common/Badge";
import { SEVERITIES } from "@/utils/constants";
import { labelFor } from "@/utils/formatters";

const COLORS = { low: "green", medium: "yellow", high: "red" };

export default function SeverityBadge({ severity }) {
  if (!severity) return null;
  return <Badge color={COLORS[severity]}>{labelFor(SEVERITIES, severity)}</Badge>;
}