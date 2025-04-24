export interface CampaignMailboxStatisticsParams {
  campaign_id: number;
}

export interface DownloadCampaignDataParams {
  campaign_id: number;
  download_type: 'analytics' | 'leads' | 'sequence' | 'full_export';
  format: 'json' | 'csv';
  user_id?: string;
}

export interface ViewDownloadStatisticsParams {
  time_period?: 'all' | 'today' | 'week' | 'month';
  group_by?: 'type' | 'format' | 'campaign' | 'date';
} 