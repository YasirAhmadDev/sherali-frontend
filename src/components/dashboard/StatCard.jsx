import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import Card from "@/components/common/Card";
import { formatNumber } from "@/utils/formatters";

const TONES = {
  green: "bg-green-500/15 text-green-600 dark:text-green-400",
  red: "bg-red-500/15 text-red-600 dark:text-red-400",
  yellow: "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400",
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
};

// goodWhen: which direction is "good news"?
//   "down"    -> fewer is better (accidents, injuries, deaths)
//   "neutral" -> just informational (locations)
function Change({ change, goodWhen }) {
  if (change === null || change === undefined) {
    return <p className="mt-1 text-xs text-subtle">No comparison yet</p>;
  }

  const isZero = change === 0;
  const isUp = change > 0;
  const Icon = isZero ? Minus : isUp ? ArrowUp : ArrowDown;

  let color = "text-accent";
  if (isZero) color = "text-muted";
  else if (goodWhen === "down") color = isUp ? "text-red-500" : "text-green-600 dark:text-green-400";

  return (
    <div className="mt-1">
      <p className={`flex items-center gap-1 text-xs font-medium ${color}`}>
        <Icon size={13} />
        {Math.abs(change)}%
      </p>
      <p className="text-xs text-subtle">vs. last month</p>
    </div>
  );
}

export default function StatCard({ icon: Icon, label, value, change, tone = "green", goodWhen = "down" }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 ${TONES[tone]}`}>
          <Icon size={24} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted">{label}</p>
          <p className="text-2xl font-bold text-fg sm:text-3xl">{formatNumber(value)}</p>
          <Change change={change} goodWhen={goodWhen} />
        </div>
      </div>
    </Card>
  );
}