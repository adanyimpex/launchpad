/* eslint-disable react-hooks/exhaustive-deps */
import { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../DataTable";
import { TooltipContainer } from "../ui/tooltip";
import LoadingBlock from "../LoadingBlock";
import { RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Contributor = {
  wallet_address: string;
  amount: string;
};

const columns: ColumnDef<Contributor>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "wallet_address",
    header: "Address",
    cell: ({ row }) => (
      <TooltipContainer title={row.original.wallet_address}>
        <span className="block truncate lg:w-48 w-32">
          {row.original.wallet_address}
        </span>
      </TooltipContainer>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    accessorFn: (row) => row.amount.toLocaleString(),
  },
];

export default function ContributorsListModal(props: DialogProps) {
  const params = useParams();

  const contributor = useQuery<Contributor[]>({
    queryKey: [`/v1/launchpad/${params.address}/contributors`],
  });

  return (
    <Dialog {...props}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="">
          <div className="flex items-center flex-wrap gap-4">
            <DialogTitle>Contributors</DialogTitle>
            <Button variant={"ghost"} className="p-0 h-auto">
              <RefreshCwIcon
                className={cn("h-4 w-4", {
                  "animate-spin": contributor.isFetching,
                })}
                onClick={() => contributor.refetch()}
              />
            </Button>
          </div>
        </DialogHeader>
        {contributor.isLoading && <LoadingBlock />}
        {contributor.data ? (
          <DataTable columns={columns} data={contributor.data} />
        ) : (
          <p className="py-6 text-center text-xl">No Data</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
