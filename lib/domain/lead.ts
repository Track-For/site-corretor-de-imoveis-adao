export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  propertyId?: string;
  source: "contact" | "property" | "sell-property";
  createdAt: string;
}

export type LeadInput = Omit<Lead, "id" | "createdAt">;
