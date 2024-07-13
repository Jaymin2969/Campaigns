export type CampaignType = 'Cost per Order' | 'Cost per Click' | 'Buy One Get One';

export interface Schedule {
  weekdays: string[];
  startTime: string;
  endTime: string;
}

export interface Campaign {
  id: string;
  type: CampaignType;
  startDate: string;
  endDate: string;
  schedule: Schedule[];
}
