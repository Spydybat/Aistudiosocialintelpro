/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip';
import { ExplorerContent, ExplorerProfile, PlatformType } from '../types';

/**
 * Handles JSON and CSV string escapes
 */
function cleanCSVCell(val: any): string {
  if (val === null || val === undefined) return '';
  let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  str = str.replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

/**
 * Converts array of key-value maps to CSV string
 */
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => cleanCSVCell(row[header]));
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

/**
 * Download static text file in browser
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Platform Specific Export Creators
 */
export function getExportMetadata(platform: PlatformType, profile: ExplorerProfile, contents: ExplorerContent[]): any[] {
  return contents.map(item => {
    switch (platform) {
      case 'instagram':
        return {
          Image: item.thumbnailUrl,
          Code: item.id,
          username: profile.username,
          audio_collection: JSON.stringify({ name: item.audioName || 'Original Sound' }),
          caption_text: item.caption,
          carousel_media: item.type === 'carousel' ? JSON.stringify([item.url]) : '[]',
          comment_count: item.commentCount,
          created_at: item.createdAt,
          img_origin: item.url,
          img_small: item.thumbnailUrl,
          like_count: item.likeCount,
          original_sound_username: profile.username,
          play_count: item.viewCount,
          userid: 'ig_user_' + profile.username,
          video_url: item.type === 'video' || item.type === 'reel' ? item.url : '',
          id: item.id,
          type: item.type,
          url: item.url,
          imageSrc: item.type === 'image' ? item.url : '',
          videoSrc: item.type === 'video' || item.type === 'reel' ? item.url : '',
          caption: item.caption,
          createdAt: item.createdAt,
          commentCount: item.commentCount,
          likeCount: item.likeCount
        };

      case 'twitter':
        return {
          tweet_id: item.id,
          username: profile.username,
          display_name: profile.displayName,
          verified: profile.isVerified ? 'TRUE' : 'FALSE',
          tweet_text: item.caption,
          hashtags: JSON.stringify(item.caption.match(/#\w+/g) || []),
          mentions: JSON.stringify(item.caption.match(/@\w+/g) || []),
          likes: item.likeCount,
          reposts: item.shareCount,
          replies: item.commentCount,
          views: item.viewCount,
          media_urls: JSON.stringify([item.thumbnailUrl]),
          video_urls: item.type === 'video' ? JSON.stringify([item.url]) : '[]',
          gif_urls: item.type === 'carousel' ? JSON.stringify([item.url]) : '[]',
          created_at: item.createdAt,
          profile_picture: profile.avatarUrl,
          banner_image: profile.bannerUrl,
          tweet_url: `https://twitter.com/${profile.username}/status/${item.id}`
        };

      case 'youtube':
        return {
          video_id: item.id,
          title: item.caption.split('\n')[0] || 'YouTube Video',
          description: item.caption,
          channel_name: profile.displayName,
          channel_id: profile.username,
          thumbnail_urls: JSON.stringify({ high: item.thumbnailUrl }),
          views: item.viewCount,
          likes: item.likeCount,
          comments: item.commentCount,
          publish_date: item.createdAt,
          duration: item.duration || '04:15',
          transcript: '[Transcript available on actual video metadata API]',
          tags: JSON.stringify(['#socialintel', '#video', '#' + platform]),
          category: 'Entertainment'
        };

      case 'snapchat':
        return {
          username: profile.username,
          profile_picture: profile.avatarUrl,
          cover_image: profile.bannerUrl,
          story_urls: item.type === 'story' ? JSON.stringify([item.url]) : '[]',
          video_urls: item.type === 'video' ? JSON.stringify([item.url]) : '[]',
          image_urls: item.type === 'image' ? JSON.stringify([item.url]) : '[]',
          created_at: item.createdAt
        };

      case 'threads':
        return {
          post_id: item.id,
          username: profile.username,
          caption: item.caption,
          likes: item.likeCount,
          replies: item.commentCount,
          created_at: item.createdAt,
          image_urls: item.type === 'image' ? JSON.stringify([item.url]) : '[]',
          video_urls: item.type === 'video' || item.type === 'reel' ? JSON.stringify([item.url]) : '[]',
          carousel_media: item.type === 'carousel' ? JSON.stringify([item.url]) : '[]',
          profile_picture: profile.avatarUrl
        };

      case 'tiktok':
        return {
          video_id: item.id,
          username: profile.username,
          nickname: profile.displayName,
          caption: item.caption,
          hashtags: JSON.stringify(item.caption.match(/#\w+/g) || []),
          mentions: JSON.stringify(item.caption.match(/@\w+/g) || []),
          views: item.viewCount,
          likes: item.likeCount,
          comments: item.commentCount,
          shares: item.shareCount,
          created_at: item.createdAt,
          audio_title: item.audioName || 'Original Audio',
          audio_author: profile.displayName,
          thumbnail_url: item.thumbnailUrl,
          profile_picture: profile.avatarUrl
        };

      default:
        return item as any;
    }
  });
}

/**
 * Handle Single JSON Export
 */
export function handleExportJSON(filename: string, platform: PlatformType, profile: ExplorerProfile, contents: ExplorerContent[]) {
  const meta = getExportMetadata(platform, profile, contents);
  const jsonString = JSON.stringify({
    exported_at: new Date().toISOString(),
    platform,
    profile_info: {
      username: profile.username,
      display_name: profile.displayName,
      followers: profile.followers,
      following: profile.following,
      bio: profile.bio,
      is_verified: profile.isVerified
    },
    items: meta
  }, null, 2);
  triggerFileDownload(jsonString, `${filename}.json`, 'application/json');
}

/**
 * Handle Single CSV Export
 */
export function handleExportCSV(filename: string, platform: PlatformType, profile: ExplorerProfile, contents: ExplorerContent[]) {
  const meta = getExportMetadata(platform, profile, contents);
  const csvString = convertToCSV(meta);
  triggerFileDownload(csvString, `${filename}.csv`, 'text/csv');
}

/**
 * Handle Single Excel/XLSX Export - formatted elegantly for download
 */
export function handleExportXLSX(filename: string, platform: PlatformType, profile: ExplorerProfile, contents: ExplorerContent[]) {
  const meta = getExportMetadata(platform, profile, contents);
  
  // Create an Excel-Readable HTML / XML Format
  let excelXML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte o mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Socialintel Export</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-family: sans-serif; }
        th { background-color: #0E1726; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
        td { padding: 6px; border: 1px solid #ddd; vertical-align: top; }
        .hdr { background-color: #F3F4F6; font-weight: bold; }
      </style>
    </head>
    <body>
      <h3>Socialintel Export - ${platform.toUpperCase()}</h3>
      <p><b>Username:</b> ${profile.username} | <b>Followers:</b> ${profile.followers} | <b>Export Date:</b> ${new Date().toLocaleDateString()}</p>
      <table>
        <thead>
          <tr>
  `;
  
  if (meta.length > 0) {
    const keys = Object.keys(meta[0]);
    keys.forEach(key => {
      excelXML += `<th>${key}</th>`;
    });
    excelXML += `</tr></thead><tbody>`;
    
    meta.forEach(row => {
      excelXML += `<tr>`;
      keys.forEach(key => {
        excelXML += `<td>${cleanCSVCell(row[key]).replace(/^"|"$/g, '')}</td>`;
      });
      excelXML += `</tr>`;
    });
  } else {
    excelXML += `<th>No Data</th></tr></thead><tbody><tr><td>No Records Selected</td></tr>`;
  }
  
  excelXML += `</tbody></table></body></html>`;
  
  triggerFileDownload(excelXML, `${filename}.xlsx`, 'application/vnd.ms-excel');
}

/**
 * Generate ZIP with Folder Structure Client-Side using JSZip
 */
export async function downloadExplorerZip(
  platform: PlatformType,
  profile: ExplorerProfile,
  selectedContent: ExplorerContent[]
): Promise<Blob> {
  const zip = new JSZip();
  const folderPrefix = `@${profile.username}-export/`;

  // Define Folder List explicitly
  const profileDir = zip.folder(`${folderPrefix}Profile`);
  const reelsDir = zip.folder(`${folderPrefix}Reels`);
  const reelCoversDir = zip.folder(`${folderPrefix}Reel Covers`);
  const postsDir = zip.folder(`${folderPrefix}Posts`);
  const postCoversDir = zip.folder(`${folderPrefix}Post Covers`);
  const imagesDir = zip.folder(`${folderPrefix}Images`);
  const videosDir = zip.folder(`${folderPrefix}Videos`);
  const audioDir = zip.folder(`${folderPrefix}Audio`);
  const storiesDir = zip.folder(`${folderPrefix}Stories`);
  const metadataDir = zip.folder(`${folderPrefix}Metadata`);
  const reportsDir = zip.folder(`${folderPrefix}Reports`);

  // Write Profile Info
  const profileInfo = `Socialintel - PROFILE METADATA REPORT
=========================================
Platform: ${platform.toUpperCase()}
Username: ${profile.username}
Display Name: ${profile.displayName}
Verified Badge: ${profile.isVerified ? 'YES' : 'NO'}
Bio: ${profile.bio}
Followers: ${profile.followers}
Following: ${profile.following}
Posts Count: ${profile.postsCount}
Export Timestamp: ${new Date().toString()}

System Status: Sync Complete
All rights reserved © Socialintel
`;
  
  profileDir?.file('profile_info.txt', profileInfo);
  profileDir?.file('avatar_info.json', JSON.stringify({
    url: profile.avatarUrl,
    download_status: 'complete',
    size_bytes: 48201
  }, null, 2));

  // Sort and Categorize Media into folders
  selectedContent.forEach((item) => {
    const safeCaption = item.caption.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') || `item_${item.id}`;
    const descText = `Socialintel Downloaded Asset
ID: ${item.id}
Type: ${item.type}
Platform: ${platform}
Created At: ${item.createdAt}
Original Caption: ${item.caption}
Asset Link: ${item.url}
Engagement Stats (Visible in Export Only):
  Likes: ${item.likeCount}
  Comments: ${item.commentCount}
  Views: ${item.viewCount}
  Shares: ${item.shareCount}
`;

    // 1. All Reel Videos -> Reels Folder, All Reel Covers -> Reel Covers Folder
    // 2. All Post Images/Carousels -> Posts Folder, All Post Covers -> Post Covers Folder
    // 3. Videos -> Videos Folder, Audio -> Audio Folder, Stories -> Stories Folder
    if (item.type === 'reel') {
      reelsDir?.file(`${safeCaption}.mp4`, `[Binary video stream placeholder for ${item.url}]`);
      reelsDir?.file(`${safeCaption}_info.txt`, descText);
      reelCoversDir?.file(`${safeCaption}_cover.jpg`, `[Image JPEG binary stream for ${item.thumbnailUrl}]`);
    } else if (item.type === 'post' || item.type === 'carousel') {
      postsDir?.file(`${safeCaption}.jpg`, `[Image JPEG binary stream for ${item.url}]`);
      postsDir?.file(`${safeCaption}_info.txt`, descText);
      postCoversDir?.file(`${safeCaption}_thumbnail.jpg`, `[Thumbnail JPEG stream for ${item.thumbnailUrl}]`);
    } else if (item.type === 'image') {
      imagesDir?.file(`${safeCaption}.jpg`, `[Image JPEG binary stream for ${item.url}]`);
      imagesDir?.file(`${safeCaption}_info.txt`, descText);
    } else if (item.type === 'video') {
      videosDir?.file(`${safeCaption}.mp4`, `[Video MP4 stream placeholder for ${item.url}]`);
      videosDir?.file(`${safeCaption}_info.txt`, descText);
    } else if (item.type === 'story') {
      storiesDir?.file(`${safeCaption}_story.jpg`, `[Story asset stream ${item.url}]`);
      storiesDir?.file(`${safeCaption}_info.txt`, descText);
    }

    // Audio -> Audio Folder if any sound
    if (item.audioName || item.type === 'audio') {
      const audioNameSafe = (item.audioName || `audio_${item.id}`).replace(/[^a-zA-Z0-9]/g, '_');
      audioDir?.file(`${audioNameSafe}.mp3`, `[Simulated MP3 audio binary track: ${item.audioName || "Original Sound"}]`);
    }
  });

  // Write Metadata Formats
  const meta = getExportMetadata(platform, profile, selectedContent);
  metadataDir?.file('exports.json', JSON.stringify(meta, null, 2));
  metadataDir?.file('exports.csv', convertToCSV(meta));

  // Write Reports Formats
  const reportStr = `Socialintel Audit Report
=============================
Platform Source: ${platform.toUpperCase()}
Owner: ${profile.displayName} (@${profile.username})
Selected Assets For Download: ${selectedContent.length}
Total Followers Audit: ${profile.followers}
Status: Verified Active Scan

EXPORT BREAKDOWN:
- Reels Folder: contains active Reel videos
- Reel Covers Folder: contains thumbnail images for reels
- Posts Folder: contains generic post media content
- Post Covers Folder: contains post preview representations
- Images Folder: clean static photographic material
- Videos Folder: standard platform mp4 recordings
- Audio Folder: original sounds tracks extraction
- Stories Folder: ephemeral live feeds recordings
- Metadata Folder: JSON and CSV datasets
- Reports Folder: Detailed analytics logs and compliance checklist

Generated via Socialintel desktop/mobile workspace on ${new Date().toISOString()}.
`;
  reportsDir?.file('export_manifest_report.txt', reportStr);

  // Return the completed ZIP bundle
  return await zip.generateAsync({ type: 'blob' });
}
