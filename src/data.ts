/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExplorerContent, ExplorerProfile, PlatformType } from './types';

export const SAMPLE_PROFILES: Record<PlatformType, Record<string, ExplorerProfile>> = {
  instagram: {
    'travel_explorers': {
      username: 'travel_explorers',
      displayName: 'Travel Explorers • Adventure',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=250&fit=crop',
      bio: '🗺️ Group of explorers documenting the world\'s hidden paradises. | 🚀 Daily travel ideas & guides. | Business: contact@travelexp.com',
      followers: '2.4M',
      following: '182',
      isVerified: true,
      postsCount: 1420
    },
    'nature_hq': {
      username: 'nature_hq',
      displayName: 'Nature HQ 🌿',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=800&h=250&fit=crop',
      bio: '📸 Curating the absolute best landscape photography on Earth. | Tap link to submit your shots! | 🌱 Eco advocacy partner.',
      followers: '850K',
      following: '490',
      isVerified: false,
      postsCount: 512
    }
  },
  twitter: {
    'tech_guru': {
      username: 'tech_guru',
      displayName: 'Alex Rivers • TechGuru',
      avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=250&fit=crop',
      bio: '💻 Code creator, open-source evangelist, hardware nerd. Talking startup tech and engineering scales. Newsletter: guru.tech/subscribe',
      followers: '128.5K',
      following: '512',
      isVerified: true,
      postsCount: 16840
    },
    'crypto_news': {
      username: 'crypto_news',
      displayName: 'CryptoIntel Official',
      avatarUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=250&fit=crop',
      bio: '⚡ Your leading independent source for global decentralized finance, web3 metrics, and chain intelligence reports. Non-custodial research.',
      followers: '640.2K',
      following: '450',
      isVerified: true,
      postsCount: 2240
    }
  },
  youtube: {
    'science_simplified': {
      username: 'uc_science_simpl',
      displayName: 'Science Simplified',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=250&fit=crop',
      bio: '🧬 Making complex physics, quantum chemistry, and space explorations easy to visualize! | Uploads twice weekly. | Join our Discord channel.',
      followers: '4.8M',
      following: '12',
      isVerified: true,
      postsCount: 384
    }
  },
  snapchat: {
    'daily_vibe': {
      username: 'daily_vibe',
      displayName: 'DailyVibe Story',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=250&fit=crop',
      bio: '💅 Lifestyle daily creator. Snippets of NYC routine, brunch review, behind the scenes, skincare updates. Add for daily quick vibes! 📱',
      followers: '302K',
      following: '23',
      isVerified: true,
      postsCount: 4122
    }
  },
  threads: {
    'coder_threads': {
      username: 'coder_threads',
      displayName: 'Coder Threads',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=250&fit=crop',
      bio: '⌨️ Short bite-sized software architectural tips, terminal setups, and software engineering humor. Direct messages open for collabs.',
      followers: '44K',
      following: '190',
      isVerified: false,
      postsCount: 180
    }
  },
  tiktok: {
    'dance_beats': {
      username: 'dance_beats',
      displayName: 'DanceBeats Inc.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
      bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=250&fit=crop',
      bio: '🔥 Grooving to modern trending auditory compilations. | Tutorials posted on Friday. | Use our official sound underneath!',
      followers: '5.2M',
      following: '80',
      isVerified: true,
      postsCount: 520
    }
  }
};

export const SAMPLE_CONTENTS: Record<PlatformType, Record<string, ExplorerContent[]>> = {
  instagram: {
    'travel_explorers': [
      {
        id: 'ig_post_101',
        type: 'reel',
        caption: 'Uncovering the turquoise lagoons of Maldives! 🏝️ This secret spot is located at South Ari Atoll. Best time to visit is December to April. #maldives #travelinspo #reels #explore',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-maldives-resort-aerial-view-32431-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg',
        audioName: 'Island Acoustic Melodies - Original Sound',
        duration: '0:30',
        createdAt: '2026-06-15 14:32:10',
        commentCount: 4212,
        likeCount: 98124,
        viewCount: 450122,
        shareCount: 12051,
        postId: 'ig_post_101_id',
        userId: 'ig_user_travel_explorers'
      },
      {
        id: 'ig_post_102',
        type: 'post',
        caption: 'Stunning sunsets in the Swiss Alps 🏔️ Frame of absolute peace at Grindelwald. Golden hours like this explain why mountains hold so much allure. Which peaks are on your bucket lists?',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
        createdAt: '2026-06-12 18:05:44',
        commentCount: 890,
        likeCount: 45112,
        viewCount: 120000,
        shareCount: 2200,
        postId: 'ig_post_102_id',
        userId: 'ig_user_travel_explorers'
      },
      {
        id: 'ig_post_103',
        type: 'carousel',
        caption: 'Exploring Tokyo by night 🌌 Swipe left to see the neon streets, hidden alley bars, and the view from Shibuya sky. Tokyo never sleeps. #japan #tokyo #carousel #nightphotography',
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        createdAt: '2026-06-10 09:12:00',
        commentCount: 1420,
        likeCount: 61002,
        viewCount: 180000,
        shareCount: 5410,
        postId: 'ig_post_103_id',
        userId: 'ig_user_travel_explorers'
      },
      {
        id: 'ig_post_104',
        type: 'story',
        caption: 'Pack your bags! New expedition starting in 3 hours 🎒 Guess the continent in the link below! 🗺️',
        url: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&h=1200&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&h=600&fit=crop',
        createdAt: '2026-06-18 06:15:00',
        commentCount: 382,
        likeCount: 12090,
        viewCount: 30040,
        shareCount: 890,
        postId: 'ig_post_104_id',
        userId: 'ig_user_travel_explorers'
      }
    ],
    'nature_hq': [
      {
        id: 'ig_post_201',
        type: 'post',
        caption: 'Misty Redwood Forests in Northern California 🌲 Walking among these giants feels like stepping into a prehistoric epoch. Preservation of these reserves is vital. Take only pictures, leave only footprints.',
        url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop',
        createdAt: '2026-06-14 07:11:32',
        commentCount: 220,
        likeCount: 18910,
        viewCount: 51000,
        shareCount: 1420,
        postId: 'ig_post_201_id',
        userId: 'ig_user_nature_hq'
      },
      {
        id: 'ig_post_202',
        type: 'reel',
        caption: 'A majestic bald eagle gliding over mirror lakes 🦅 Captured at Kenai Fjords National Park, Alaska. What an incredible display of focus and posture. #alaska #naturelovers #eagle #reels',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-forest-and-mountain-lake-2804-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1398263139643-72300b214902?w=400&h=300&fit=crop',
        audioName: 'Eagle Wings Theme Acoustic',
        duration: '0:15',
        createdAt: '2026-06-11 11:45:00',
        commentCount: 540,
        likeCount: 29014,
        viewCount: 110200,
        shareCount: 4210,
        postId: 'ig_post_202_id',
        userId: 'ig_user_nature_hq'
      }
    ]
  },
  twitter: {
    'tech_guru': [
      {
        id: 'tw_post_101',
        type: 'post',
        caption: 'TypeScript 5.8 is officially compiling super cool features natively. The type-stripping support in Node.js 23/24 is a monumental step for running backend apps cleanly without over-configuring compilation workflows. Here is my layout setup below: 👇',
        url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
        createdAt: '2026-06-17 10:20:01',
        commentCount: 189,
        likeCount: 3410,
        viewCount: 48900,
        shareCount: 521,
        postId: 'tw_post_101_id',
        userId: 'tw_user_tech_guru'
      },
      {
        id: 'tw_post_102',
        type: 'video',
        caption: 'Inside my minimal desk setup for 2026. Custom split ortholinear keyboard, 32-inch e-paper display, and zero desk clutter. Makes 10-hour coding sprints feel like physical therapy. Let me know what you think!',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-glowing-light-keyboard-41315-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&h=300&fit=crop',
        audioName: 'Cyber Lofi Focus Playlist',
        duration: '1:02',
        createdAt: '2026-06-15 15:45:30',
        commentCount: 450,
        likeCount: 10450,
        viewCount: 189000,
        shareCount: 1940
      }
    ],
    'crypto_news': [
      {
        id: 'tw_post_201',
        type: 'post',
        caption: 'MARKET UPDATE: Decentralized stablecoin volume has reached a historic high of 42% global transactional representation, outpacing standard centralized nodes for the first time in web3 chronicles. Decentralization is inevitable. #DeFi #Ethereum',
        url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop',
        createdAt: '2026-06-18 02:40:12',
        commentCount: 890,
        likeCount: 15410,
        viewCount: 380442,
        shareCount: 4212
      }
    ]
  },
  youtube: {
    'science_simplified': [
      {
        id: 'yt_post_101',
        type: 'video',
        caption: 'Why Quantum Computers Aren\'t Just "Super Fast" PC | Full documentary outlining superposition math, electron spins qubit stability, and topological error corrections in human-understandable charts. #science #physics',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-code-screen-background-34208-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&h=300&fit=crop',
        audioName: 'Scientist Lab Focus Ambience',
        duration: '15:44',
        createdAt: '2026-06-10 12:00:00',
        commentCount: 1892,
        likeCount: 104921,
        viewCount: 890451,
        shareCount: 45012
      },
      {
        id: 'yt_post_102',
        type: 'audio',
        caption: 'ASMR White Noise of Black Hole Accretion Disk (Simulation Auditory Feed) | Unwind with deep cosmic interstellar space frequencies synthesized by our computing cluster. Grounding brain waves to 4Hz.',
        url: 'https://actions.google.com/sounds/v1/ambiences/wind_continuous.ogg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop',
        audioName: 'Cosmic Accretion Sweep 4Hz',
        duration: '3:00:00',
        createdAt: '2026-06-05 21:30:00',
        commentCount: 780,
        likeCount: 52192,
        viewCount: 341029,
        shareCount: 29012
      },
      {
        id: 'yt_profile_science_simplified',
        type: 'profile',
        caption: 'Science Simplified Channel Info • 4.8M Subscribers • Bio: Making complex physics, quantum chemistry, and space explorations easy to visualize! | Upload twice weekly. | Join our Discord channel.',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
        createdAt: '2026-06-10 12:00:00',
        commentCount: 0,
        likeCount: 4800000,
        viewCount: 9814421,
        shareCount: 154101
      }
    ]
  },
  snapchat: {
    'daily_vibe': [
      {
        id: 'sc_post_101',
        type: 'story',
        caption: 'NYC Mornings: Walking to grab a warm vanilla cream flat white. ☕ The weather today is absolute perfection! Autumn breeze makes the concrete feel cosy.',
        url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=1200&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=600&fit=crop',
        createdAt: '2026-06-18 07:11:00',
        commentCount: 45,
        likeCount: 2012,
        viewCount: 15400,
        shareCount: 232
      },
      {
        id: 'sc_post_102',
        type: 'video',
        caption: 'Breathtaking view from Rooftop Lounge in Chelsea! The sunset framing the Empire State is majestic today. #nyc #snapstories',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-nyc-street-with-traffic-at-dusk-34220-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop',
        createdAt: '2026-06-17 19:42:00',
        commentCount: 92,
        likeCount: 5410,
        viewCount: 32090,
        shareCount: 840
      }
    ]
  },
  threads: {
    'coder_threads': [
      {
        id: 'th_post_101',
        type: 'post',
        caption: 'Hot Take ☕: Junior developers are overwriting simple code bases with complex frameworks just to look skilled. Modern browser features handle 90% of layout, reactivity, and animations natively. Clean HTML, standard CSS, and robust state engines make apps fast and delightful. Agree or disagree?',
        url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop',
        createdAt: '2026-06-18 04:12:00',
        commentCount: 122,
        likeCount: 1890,
        viewCount: 14020,
        shareCount: 84
      },
      {
        id: 'th_post_102',
        type: 'video',
        caption: 'Speedrunning a high-performance custom rendering layout using raw Javascript canvas. Zero dependencies, 60fps animations. Perfect fluid interactions! 🏎️💨 #canvas #perf #javascript',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-glowing-light-keyboard-41315-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        audioName: 'Retro Synthwave Keyboard Loop',
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg',
        duration: '0:15',
        createdAt: '2026-06-19 14:24:00',
        commentCount: 310,
        likeCount: 5410,
        viewCount: 22090,
        shareCount: 450
      }
    ]
  },
  tiktok: {
    'dance_beats': [
      {
        id: 'tk_post_101',
        type: 'reel',
        caption: 'Syncing this new summer step routine! 💃 Try it out before it hits the charts. Tag @dance_beats so we can showcase your video variations! #dance #summersteps #tiktokslow',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-happily-on-the-street-4530-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
        audioName: 'Summer Steps Electropop Radio Mix 2026',
        duration: '0:22',
        createdAt: '2026-06-16 11:30:10',
        commentCount: 12902,
        likeCount: 549102,
        viewCount: 1804520,
        shareCount: 124012
      },
      {
        id: 'tk_post_102',
        type: 'post',
        caption: 'Look at the main stage setup today. The vibrant lights and massive soundwalls are ready! 🌌🎹 #mainstage #showcase #lights',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
        createdAt: '2026-06-15 08:35:00',
        commentCount: 4210,
        likeCount: 91045,
        viewCount: 304210,
        shareCount: 1540
      }
    ]
  }
};

/**
 * Returns custom profile dynamic search generator
 * Ensures ANY search in All Downloader or Account Explorer operates correctly!
 */
export function generateDynamicProfile(platform: PlatformType, username: string): ExplorerProfile {
  const normUser = username.replace(/^@/, '').trim().toLowerCase();
  
  // Try to find in sample profiles
  if (SAMPLE_PROFILES[platform]?.[normUser]) {
    return SAMPLE_PROFILES[platform][normUser];
  }
  
  // Create beautiful custom, dynamic profile matching user input!
  const titles: Record<PlatformType, string> = {
    instagram: 'Pixel Creator',
    twitter: 'Tech Pioneer',
    youtube: 'Broadcaster Pro',
    snapchat: 'Vibe Architect',
    threads: 'Thread Artisan',
    tiktok: 'viral_beat'
  };

  const followersCount = ['140K', '890K', '1.2M', '44K', '3.5M'][Math.floor(Math.random() * 5)];
  const followingCount = String(Math.floor(Math.random() * 800) + 50);
  const postsNumber = Math.floor(Math.random() * 1000) + 40;

  return {
    username: normUser || 'creator_pro',
    displayName: `${normUser.charAt(0).toUpperCase() + normUser.slice(1)} | ${titles[platform] || 'Creator'}`,
    avatarUrl: `https://images.unsplash.com/photo-${[
      '1535713875002-d1d0cf377fde',
      '1570295999919-56ceb5ecca61',
      '1438761681033-6461ffad8d80',
      '1472099645785-5658abf4ff4e'
    ][Math.floor(Math.random() * 4)]}?w=150&h=150&fit=crop&crop=faces`,
    bannerUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=250&fit=crop',
    bio: `🎯 Official Socialintel scan profile for @${normUser}. | 🪐 High resonance creative workspace covering visual assets. | 💼 Inquiries: help_${normUser}@agency.com`,
    followers: followersCount,
    following: followingCount,
    isVerified: ['M', 'K'].some(char => followersCount.includes(char)) && Math.random() > 0.3,
    postsCount: postsNumber
  };
}

/**
 * Generates content matching dynamically searched username
 */
export function generateDynamicContent(platform: PlatformType, username: string): ExplorerContent[] {
  const normUser = username.replace(/^@/, '').trim().toLowerCase();
  
  let results: ExplorerContent[] = [];
  if (SAMPLE_CONTENTS[platform]?.[normUser]) {
    results = [...SAMPLE_CONTENTS[platform][normUser]];
  } else {
    // If not found in seeds, generate 3 highly distinctive mock pieces of content!
    const caps = [
      `Unlocking fresh creative frameworks on this gorgeous afternoon! Exploring modern systems is paramount. 🎨✨ #${platform} #workflow`,
      `A magnificent sunrise captured in ultra high details. Moments like this remind us to breathe. 🌅🌿 [Simulated scanner log 100% verified]`,
      `Quick technical walkthrough showing custom interface workflows. Keeping designs simple and negative space generous. Let me know your thoughts! 👇📱`
    ];
    
    const mType: Record<PlatformType, Array<ExplorerContent['type']>> = {
      instagram: ['reel', 'post', 'carousel', 'story'],
      twitter: ['post', 'video', 'carousel'],
      youtube: ['video', 'audio'],
      snapchat: ['story', 'video', 'image'],
      threads: ['post', 'video'],
      tiktok: ['reel', 'video', 'post']
    };

    const types = mType[platform] || ['post'];

    for (let i = 0; i < 3; i++) {
      const currentType = types[i % types.length];
      
      // Pick different media links
      const isVid = ['video', 'reel'].includes(currentType);
      const mediaUrls = isVid
        ? [
            'https://assets.mixkit.co/videos/preview/mixkit-maldives-resort-aerial-view-32431-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-glowing-light-keyboard-41315-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-nyc-street-with-traffic-at-dusk-34220-large.mp4'
          ]
        : [
            'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=1200&fit=crop'
          ];

      const thumbUrls = [
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop'
      ];

      const randId = `${platform.slice(0, 2)}_post_dyn_${100 + i}_${Math.floor(Math.random() * 1000)}`;
      results.push({
        id: randId,
        type: currentType,
        caption: caps[i % caps.length],
        url: mediaUrls[i % mediaUrls.length],
        thumbnailUrl: thumbUrls[i % thumbUrls.length],
        audioUrl: isVid ? 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg' : undefined,
        audioName: isVid ? `Original Sound - Acoustic Wave ${i + 1}` : undefined,
        duration: isVid ? `0:${20 + i * 15}` : undefined,
        createdAt: new Date(Date.now() - i * 86400 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        commentCount: Math.floor(Math.random() * 200) + 12,
        likeCount: Math.floor(Math.random() * 14000) + 150,
        viewCount: Math.floor(Math.random() * 100000) + 2000,
        shareCount: Math.floor(Math.random() * 400) + 5,
        postId: `${randId}_id`,
        userId: `user_${normUser}`
      });
    }
  }

  // If the platform is YouTube, let's always dynamically inject the profile details item so the profile filter shows something meaningful!
  if (platform === 'youtube') {
    const profile = generateDynamicProfile(platform, username);
    const existingProfileItem = results.find(item => item.type === 'profile');
    if (!existingProfileItem) {
      results.push({
        id: `yt_profile_${normUser}`,
        type: 'profile',
        caption: `${profile.displayName} Channel Information • ${profile.followers} Subscribers • Bio: ${profile.bio || 'Professional broadcaster and content creator.'}`,
        url: profile.avatarUrl,
        thumbnailUrl: profile.avatarUrl,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        commentCount: 0,
        likeCount: 50212,
        viewCount: 1200311,
        shareCount: 442,
        postId: `yt_profile_${normUser}_id`,
        userId: `user_${normUser}`
      });
    }
  }

  return results;
}
