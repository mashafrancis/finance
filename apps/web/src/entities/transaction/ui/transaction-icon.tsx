import { ArrowDownRight, ArrowUpRight, ArrowsClockwise } from "@phosphor-icons/react";
import type { TransactionType } from "../types/transaction-type";

export function TransactionIcon({ type }: { type: TransactionType }) {
  switch (type) {
    case "income":
      return <ArrowUpRight className="h-4 w-4" />;
    case "transfer":
      return <ArrowsClockwise className="h-4 w-4" weight="bold" />;
    default:
      return <ArrowDownRight className="h-4 w-4" />;
  }
}
