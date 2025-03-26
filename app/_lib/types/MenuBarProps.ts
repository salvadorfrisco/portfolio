import { BuildingListType } from "./BuildingType";

export type MenuBarProps = {
  buildingId: number;
  buildingName: string;
  buildingList: BuildingListType[];
  phoneNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  footer?: boolean;
};
