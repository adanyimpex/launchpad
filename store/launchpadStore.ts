import { Launchpad } from "@/types/Launchpad";
import dayjs from "dayjs";
import { create } from "zustand";

interface ContributorDetails {
  amount: number;
  isClaimed: boolean;
  isRefunded: boolean;
}

interface SaleStatus {
  isCancelled?: boolean;
  isFinilized?: boolean;
}

type LaunchpadStoreState = {
  launchpad: Launchpad;
  isSaleStarted: boolean;
  totalTokensSold: number;
  totalContributors: number;
  balances: Record<string, number>;
  contributorDetails: ContributorDetails;
  saleStatus: SaleStatus;
  computed: {
    status: "upcoming" | "live" | "filled" | "canceled" | "ended" | "success";
  };
};

const initialState: LaunchpadStoreState = {
  launchpad: {} as Launchpad,
  isSaleStarted: false,
  totalTokensSold: 0,
  totalContributors: 0,
  balances: {},
  contributorDetails: {
    amount: 0,
    isClaimed: false,
    isRefunded: false,
  },
  saleStatus: {
    isCancelled: false,
    isFinilized: false,
  },
  computed: {
    status: "upcoming",
  },
};

const calculateStatus = (state: LaunchpadStoreState) => {
  if (state.saleStatus.isFinilized) {
    return "ended";
  } else if (state.saleStatus.isCancelled) {
    return "canceled";
  } else if (
    dayjs().isAfter(dayjs(state.launchpad.start_time)) &&
    dayjs().isBefore(dayjs(state.launchpad.end_time))
  ) {
    if (state.launchpad.hardcap <= Math.round(state.totalTokensSold)) {
      return "filled";
    } else return "live";
  } else if (dayjs().isAfter(dayjs(state.launchpad.end_time))) {
    return "ended";
  } else {
    return "upcoming";
  }
};
const useLaunchpadStore = create<LaunchpadStoreState>()((set, get) => ({
  ...initialState,
  computed: {
    get status() {
      return calculateStatus(get());
    },
  },
}));

export { useLaunchpadStore };
