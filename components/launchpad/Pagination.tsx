"use client";

import { Meta } from "@/types/Response";
import { Button } from "../ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

export default function Pagination({ meta }: { meta: Meta }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageUrl = (page: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", page.toString());
    return `${pathname}?${query.toString()}`;
  };

  if (meta.last_page === 1) return null;

  return (
    <div className="flex items-center justify-end space-x-2 py-8">
      <div className="flex-1 text-sm text-muted-foreground">
        Show {meta.from ?? 0} to {meta.to ?? 0} of {meta.total} entries
      </div>
      <div className="space-x-2">
        <div className="flex items-center space-x-2">
          {meta.current_page !== 1 && (
            <>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                asChild
              >
                <Link href={pageUrl(1)}>
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" asChild>
                <Link href={pageUrl(meta.current_page - 1)}>
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
            (page) => (
              <Button
                variant={page === meta.current_page ? "default" : "outline"}
                className="h-8 w-8 p-0"
                key={page}
                asChild
              >
                {page === meta.current_page ? (
                  <span>{page}</span>
                ) : (
                  <Link href={pageUrl(page)}>
                    <span className="sr-only">Go to page {page}</span>
                    {page}
                  </Link>
                )}
              </Button>
            )
          )}
          {meta.current_page !== meta.last_page && (
            <>
              <Button variant="outline" className="h-8 w-8 p-0" asChild>
                <Link href={pageUrl(meta.current_page + 1)}>
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                asChild
              >
                <Link href={pageUrl(meta.last_page)}>
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
