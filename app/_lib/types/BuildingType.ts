import { BrokerType, FeatureType, PhotoType } from ".";
export type BuildingType = {
  building_id: number;
  building_name?: string;
  building_address?: string;
  presentation_title?: string;
  presentation_sub_title?: string;
  presentation_image_url?: string;
  presentation_dark_color: number;
  presentation_has_page_background: number;
  presentation_dark_background_header: number;
  presentation_dark_background?: number;
  presentation_blueprint_image_tall: number;
  presentation_font_name: string;
  presentation_star_effect: number;
  photos?: PhotoType[];
  blueprint_images?: PhotoType[];
  features?: FeatureType[];
  facilities?: PhotoType[];
};

export type BuildingListType = {
  building_id: number;
  building_name?: string;
  presentation_title?: string;
  building_priority: number;
  building_has_site: number;
};

export type BuildingResultType = {
  broker: BrokerType;
  building: BuildingType;
  buildingList: BuildingListType[];
};
