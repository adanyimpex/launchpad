"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import useWeb3Client from "@/hooks/useWeb3Client";
import SwitchNetworkButton from "./SwitchNetworkButton";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import ClientOnly from "../ClientOnly";
import useLaunchpadActions from "@/hooks/useLaunchpadActions";
import { Loader2Icon } from "lucide-react";
import { formatUnits } from "viem";
import ContributorsListModal from "./ContributorsListModal";
import ChangeTimeModal from "./ChangeTimeModal";
import { useLaunchpadStore } from "@/store/launchpadStore";

export default function OwnerZone() {
  const {
    saleStatus,
    launchpad,
    computed: { status },
  } = useLaunchpadStore();
  const [openContributorsList, setOpenContributorsList] = useState(false);
  const [openChangeTime, setOpenChangeTime] = useState(false);
  const [saleBalance, setSaleBalance] = useState(0);

  const { address } = useAccount();
  const { chain } = useWeb3Client();
  const {
    isLoading,
    finalize,
    cancel,
    withdrawCancelledTokens,
    fetchTokenBalance,
  } = useLaunchpadActions();

  const isCorrectChain = useMemo(
    () => chain?.id === launchpad.blockchain.id,
    [chain, launchpad]
  );

  const isStarted = useMemo(
    () => dayjs().isAfter(dayjs(launchpad.start_time)),
    [launchpad]
  );

  const canFinalize = useMemo(() => {
    return (
      !saleStatus.isFinilized && !saleStatus.isCancelled && status === "ended"
    );
  }, [status, saleStatus]);

  const fetchSaleBalance = async () => {
    const balance = await fetchTokenBalance(
      launchpad.token,
      launchpad.sale_contract_address
    );

    setSaleBalance(+formatUnits(balance, launchpad.token.decimals));
  };

  const withdraw = async () => {
    const { hash } = await withdrawCancelledTokens();
    if (hash) setSaleBalance(0);
  };

  useEffect(() => {
    if (status === "canceled") {
      fetchSaleBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  return (
    <ClientOnly>
      {address === launchpad.contract_owner_address && (
        <Card>
          <CardHeader>
            <CardTitle>Owner Zone</CardTitle>
          </CardHeader>
          <CardContent>
            {isCorrectChain ? (
              <div className="space-y-3">
                <div className="bg-[#C9E1FA] text-[#0f1729] rounded-lg border border-[#9CC6F1] py-2 px-4 text-sm">
                  <p>
                    To make sure there will be no issues during the presale
                    time, please do not send tokens to wallets before you
                    finalize the presale pool.
                  </p>
                </div>
                <div className="bg-[#C9E1FA] text-[#0f1729] rounded-lg border border-[#9CC6F1] py-2 px-4 text-sm">
                  <p>Pool Fee: 5% raised only</p>
                </div>
                <Button
                  className="w-full"
                  variant={"outline"}
                  disabled={!isStarted}
                  onClick={() => setOpenContributorsList(true)}
                >
                  List of Contributors
                </Button>
                <Button
                  className="w-full"
                  variant={"outline"}
                  // disabled={status !== "upcoming"}
                  disabled
                  onClick={() => setOpenChangeTime(true)}
                >
                  Pool Start/End Time Settings
                </Button>
                <Button
                  className="w-full"
                  disabled={!canFinalize || isLoading}
                  onClick={() => finalize()}
                >
                  {isLoading && (
                    <Loader2Icon className="animate-spin mr-2 h-5 w-5" />
                  )}
                  Finalize
                </Button>
                {!["ended", "canceled"].includes(status) && (
                  <Button
                    className="w-full"
                    variant={"outline"}
                    onClick={() => cancel()}
                  >
                    {isLoading && (
                      <Loader2Icon className="animate-spin mr-2 h-5 w-5" />
                    )}
                    Cancel
                  </Button>
                )}
                {status === "canceled" && saleBalance > 0 && (
                  <Button
                    className="w-full"
                    variant={"outline"}
                    onClick={() => withdraw()}
                  >
                    {isLoading && (
                      <Loader2Icon className="animate-spin mr-2 h-5 w-5" />
                    )}
                    Withdraw canceled tokens
                  </Button>
                )}
              </div>
            ) : (
              <SwitchNetworkButton chainId={launchpad.blockchain.id} />
            )}
          </CardContent>
        </Card>
      )}
      <ContributorsListModal
        open={openContributorsList}
        onOpenChange={setOpenContributorsList}
      />
      <ChangeTimeModal
        open={openChangeTime}
        onOpenChange={setOpenChangeTime}
        onClose={() => setOpenChangeTime(false)}
      />
    </ClientOnly>
  );
}
