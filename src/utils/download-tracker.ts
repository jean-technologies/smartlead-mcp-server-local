import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Interface for download tracking data
export interface DownloadRecord {
  id: string;
  timestamp: string;
  campaignId: number;
  downloadType: string;
  format: string;
  userId?: string;
  machineId: string;
  ipAddress?: string;
}

// Path to store download records
const DOWNLOAD_LOG_PATH = process.env.DOWNLOAD_LOG_PATH || path.join(os.homedir(), '.smartlead-mcp', 'downloads.json');

// Ensure directory exists
const ensureDirectoryExists = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

// Initialize the download log file if it doesn't exist
const initializeLogFile = () => {
  ensureDirectoryExists(DOWNLOAD_LOG_PATH);
  if (!fs.existsSync(DOWNLOAD_LOG_PATH)) {
    fs.writeFileSync(DOWNLOAD_LOG_PATH, JSON.stringify({ downloads: [] }, null, 2));
    console.log(`Created download tracking file at: ${DOWNLOAD_LOG_PATH}`);
  }
};

// Get a unique machine identifier
const getMachineId = (): string => {
  try {
    const os = process.platform;
    const cpus = process.env.NUMBER_OF_PROCESSORS || '';
    const username = process.env.USER || process.env.USERNAME || '';
    const hostname = process.env.HOSTNAME || '';
    
    // Create a simple hash of these values
    const combinedString = `${os}-${cpus}-${username}-${hostname}`;
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      hash = ((hash << 5) - hash) + combinedString.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16);
  } catch (e) {
    // Fallback to a random ID if we can't get system info
    return Math.random().toString(36).substring(2, 15);
  }
};

/**
 * Track a download event
 * @param campaignId The ID of the campaign being downloaded
 * @param downloadType The type of download (analytics, leads, etc.)
 * @param format The format of the download (json, csv)
 * @param userId Optional user identifier
 * @param ipAddress Optional IP address of the requester
 * @returns The unique ID of the download record
 */
export const trackDownload = (
  campaignId: number,
  downloadType: string,
  format: string,
  userId?: string,
  ipAddress?: string
): string => {
  try {
    // Initialize log file if it doesn't exist
    initializeLogFile();
    
    // Read existing records
    const data = JSON.parse(fs.readFileSync(DOWNLOAD_LOG_PATH, 'utf8'));
    
    // Create new download record
    const downloadId = uuidv4();
    const downloadRecord: DownloadRecord = {
      id: downloadId,
      timestamp: new Date().toISOString(),
      campaignId,
      downloadType,
      format,
      userId,
      machineId: getMachineId(),
      ipAddress
    };
    
    // Add to records and save
    data.downloads.push(downloadRecord);
    fs.writeFileSync(DOWNLOAD_LOG_PATH, JSON.stringify(data, null, 2));
    
    console.log(`Tracked download: ${downloadId} for campaign ${campaignId}`);
    return downloadId;
  } catch (error) {
    console.error('Failed to track download:', error);
    return '';
  }
};

/**
 * Get all download records
 * @returns Array of download records
 */
export const getDownloadRecords = (): DownloadRecord[] => {
  try {
    initializeLogFile();
    const data = JSON.parse(fs.readFileSync(DOWNLOAD_LOG_PATH, 'utf8'));
    return data.downloads || [];
  } catch (error) {
    console.error('Failed to get download records:', error);
    return [];
  }
};

/**
 * Get download statistics
 * @returns Statistics about downloads
 */
export const getDownloadStats = () => {
  const records = getDownloadRecords();
  
  // Count downloads by type
  const byType: Record<string, number> = {};
  
  // Count downloads by format
  const byFormat: Record<string, number> = {};
  
  // Count downloads by campaign
  const byCampaign: Record<number, number> = {};
  
  // Count unique users
  const uniqueUsers = new Set<string>();
  
  // Count by date (YYYY-MM-DD)
  const byDate: Record<string, number> = {};
  
  records.forEach(record => {
    // Count by type
    byType[record.downloadType] = (byType[record.downloadType] || 0) + 1;
    
    // Count by format
    byFormat[record.format] = (byFormat[record.format] || 0) + 1;
    
    // Count by campaign
    byCampaign[record.campaignId] = (byCampaign[record.campaignId] || 0) + 1;
    
    // Track unique users (either by userId or machineId)
    if (record.userId) {
      uniqueUsers.add(record.userId);
    } else {
      uniqueUsers.add(record.machineId);
    }
    
    // Count by date
    const date = record.timestamp.split('T')[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });
  
  return {
    totalDownloads: records.length,
    uniqueUsers: uniqueUsers.size,
    byType,
    byFormat,
    byCampaign,
    byDate
  };
}; 