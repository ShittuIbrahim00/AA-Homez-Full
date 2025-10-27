export interface DashboardStats {
  totalProperties: number;
  agents: number;
  pendingInspections: number;
  transactions: number;
}

export interface PropertyCounts {
  available: number;
  sold: number;
  pending: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label?: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  tension?: number;
}

export interface SalesData {
  labels: string[];
  datasets: SalesDataset[];
}

export interface SalesDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
}

export interface PropertyStatusData {
  labels: string[];
  datasets: PropertyStatusDataset[];
}

export interface PropertyStatusDataset {
  data: number[];
  backgroundColor: string[];
}

export interface PropertyTypeData {
  labels: string[];
  datasets: PropertyTypeDataset[];
}

export interface PropertyTypeDataset {
  data: number[];
  backgroundColor: string[];
}

export interface StatusLineData {
  labels: string[];
  datasets: StatusLineDataset[];
}

export interface StatusLineDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
}