export interface RepairBrandData {
  name: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  id?: string;
  errors?: {
    [K in keyof RepairBrandData]?: string[];
  };
}

export interface Model {
  id: string;
  name: string;
  seriesId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Series {
  id: string;
  name: string;
  brandId: string;
  models: Model[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  storeId: string;
  repairSeries: Series[];
  createdAt: Date;
  updatedAt: Date;
}
