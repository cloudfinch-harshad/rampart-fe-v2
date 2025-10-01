export interface LocationItem {
  id: string | null;
  name: string | null;
}

export interface LocationData {
  country: LocationItem | null;
  state: LocationItem | null;
  city: LocationItem | null;
  fromDate?: string;
  toDate?: string;
}
