import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { CozybotService, CozyUser, LeaderboardResponse, LiveStats, CozyServer, CozySound, ServersResponse, SoundsResponse } from '../../services/cozybot.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cozybot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cozybot.component.html',
  styleUrls: ['./cozybot.component.scss']
})
export class CozybotComponent implements OnInit, OnDestroy {
  leaderboard: CozyUser[] = [];
  servers: CozyServer[] = [];
  sounds: CozySound[] = [];
  totalCount = 0;
  totalUsersCount = 0;
  loading = true;
  error = '';
  selectedView: 'users' | 'servers' | 'sounds' = 'users';
  
  // Live stats
  liveStats: LiveStats = { current_listeners: 0, message: '', servers_with_bot: 0, total_servers: 0 };
  previousStats: LiveStats = { current_listeners: 0, message: '', servers_with_bot: 0, total_servers: 0 };
  statsLoading = false;
  animatingListeners = false;
  animatingServers = false;
  
  // Header stats animations
  animatingUsers = false;
  animatingTotalServers = false;
  animatingPoints = false;
  animatingTime = false;
  animatingTitle = false;
  
  // Track previous values for animations
  previousTotalServers = 0;
  
  private statsSubscription: Subscription | null = null;
  private headerStatsSubscription: Subscription | null = null;

  constructor(
    private cozybotService: CozybotService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    // Set page title and favicon
    this.titleService.setTitle('CozyBot - Discord Bot Leaderboard');
    this.setFavicon('assets/images/cozybot/cozybot-logo3.png');
    this.metaService.updateTag({ name: 'description', content: 'CozyBot Discord Bot leaderboard with real-time stats and CozyPoints system.' });
    
    // Check URL parameter for view
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam && ['users', 'servers', 'sounds'].includes(viewParam)) {
      this.selectedView = viewParam as 'users' | 'servers' | 'sounds';
    }
    
    // Always load users data for header stats
    this.loadUsers();
    // Then load selected view data
    if (this.selectedView !== 'users') {
      this.loadData();
    }
    this.startLiveStats();
    this.startHeaderStatsRefresh();
  }

  onViewChange(): void {
    // Update URL parameter without navigation
    const currentUrl = window.location.pathname;
    const newUrl = `${currentUrl}?view=${this.selectedView}`;
    window.history.replaceState({}, '', newUrl);
    this.loadData();
  }


  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
    if (this.headerStatsSubscription) {
      this.headerStatsSubscription.unsubscribe();
    }
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    
    if (this.selectedView === 'users') {
      this.loadUsers();
    } else if (this.selectedView === 'servers') {
      this.loadServers();
    } else if (this.selectedView === 'sounds') {
      this.loadSounds();
    }
  }

  private loadUsers(): void {
    this.loading = this.selectedView === 'users';
    this.cozybotService.getTopUsers().subscribe({
      next: (response: LeaderboardResponse) => {
        this.leaderboard = response.users;
        this.totalUsersCount = response.total_count;
        if (this.selectedView === 'users') {
          this.totalCount = response.total_count;
        }
        this.loading = false;
        
        // Animer les stats du header au premier chargement
        if (this.leaderboard.length > 0) {
          this.triggerInitialAnimations();
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        if (this.selectedView === 'users') {
          this.error = 'Failed to load users data';
        }
        this.loading = false;
      }
    });
  }


  private loadServers(): void {
    this.cozybotService.getTopServers().subscribe({
      next: (response: ServersResponse) => {
        this.servers = response.servers;
        this.totalCount = response.total_count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading servers:', error);
        this.error = 'Failed to load servers data';
        this.loading = false;
      }
    });
  }

  private loadSounds(): void {
    this.cozybotService.getTopSounds().subscribe({
      next: (response: SoundsResponse) => {
        this.sounds = response.sounds;
        this.totalCount = response.total_sounds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sounds:', error);
        this.error = 'Failed to load sounds data';
        this.loading = false;
      }
    });
  }

  private triggerInitialAnimations(): void {
    // Délai pour laisser le DOM se mettre à jour
    setTimeout(() => {
      // Animer le titre en premier
      this.animatingTitle = true;
      setTimeout(() => this.animatingTitle = false, 800);
      
      this.animatingUsers = true;
      setTimeout(() => this.animatingUsers = false, 500);
      
      setTimeout(() => {
        this.animatingPoints = true;
        setTimeout(() => this.animatingPoints = false, 500);
      }, 200);
      
      setTimeout(() => {
        this.animatingTime = true;
        setTimeout(() => this.animatingTime = false, 500);
      }, 400);
    }, 100);
  }

  formatPoints(points: number): string {
    return points.toLocaleString();
  }

  getRankEmoji(rank: number): string {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}.`;
    }
  }

  // Header stats with animation tracking

  getTotalPoints(): number {
    return this.leaderboard.reduce((total, user) => total + user.total_points, 0);
  }

  getTotalUsers(): number {
    return this.totalUsersCount;
  }

  getTotalTimeDays(): string {
    const totalSeconds = this.leaderboard.reduce((total, user) => total + user.listening_time_seconds, 0);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }

  private startHeaderStatsRefresh(): void {
    // Refresh header stats en quinconce toutes les 15 secondes
    let counter = 0;
    this.headerStatsSubscription = interval(15000).subscribe(() => {
      const refreshType = counter % 5;
      switch (refreshType) {
        case 0:
          this.refreshTitleAnimation();
          break;
        case 1:
          this.refreshUsersStats();
          break;
        case 2:
          this.refreshServersStats();
          break;
        case 3:
          this.refreshPointsStats();
          break;
        case 4:
          this.refreshTimeStats();
          break;
      }
      counter++;
    });
  }

  private refreshTitleAnimation(): void {
    this.animatingTitle = true;
    setTimeout(() => this.animatingTitle = false, 800);
  }

  private refreshUsersStats(): void {
    this.cozybotService.getTopUsers().subscribe({
      next: (response: LeaderboardResponse) => {
        // Comparer avec l'ancienne valeur AVANT de mettre à jour
        const currentUsers = this.totalUsersCount;
        const newUsers = response.total_count;
        
        if (currentUsers !== newUsers) {
          this.animatingUsers = true;
          setTimeout(() => this.animatingUsers = false, 500);
        }
        
        this.leaderboard = response.users;
        this.totalUsersCount = response.total_count;
        if (this.selectedView === 'users') {
          this.totalCount = response.total_count;
        }
      },
      error: (error) => {
        console.error('Error refreshing users stats:', error);
      }
    });
  }

  private refreshServersStats(): void {
    // Recharger les live stats
    this.cozybotService.getLiveStats().subscribe({
      next: (stats: LiveStats) => {
        const currentServers = stats.total_servers;
        if (this.previousTotalServers !== currentServers) {
          this.animatingTotalServers = true;
          setTimeout(() => this.animatingTotalServers = false, 500);
          this.previousTotalServers = currentServers;
        }
        this.liveStats = stats;
      },
      error: (error) => {
        console.error('Error refreshing servers stats:', error);
      }
    });
  }

  private refreshPointsStats(): void {
    this.cozybotService.getTopUsers().subscribe({
      next: (response: LeaderboardResponse) => {
        // Comparer avec l'ancienne valeur AVANT de mettre à jour
        const currentPoints = this.getTotalPoints();
        const newPoints = response.users.reduce((total, user) => total + user.total_points, 0);
        
        if (currentPoints !== newPoints) {
          this.animatingPoints = true;
          setTimeout(() => this.animatingPoints = false, 500);
        }
        
        this.leaderboard = response.users;
        this.totalUsersCount = response.total_count;
        if (this.selectedView === 'users') {
          this.totalCount = response.total_count;
        }
      },
      error: (error) => {
        console.error('Error refreshing points stats:', error);
      }
    });
  }

  private refreshTimeStats(): void {
    this.cozybotService.getTopUsers().subscribe({
      next: (response: LeaderboardResponse) => {
        // Comparer avec l'ancienne valeur AVANT de mettre à jour
        const currentTime = this.getTotalTimeDays();
        const totalSeconds = response.users.reduce((total, user) => total + user.listening_time_seconds, 0);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const newTime = `${days}d ${hours}h`;
        
        if (currentTime !== newTime) {
          this.animatingTime = true;
          setTimeout(() => this.animatingTime = false, 500);
        }
        
        this.leaderboard = response.users;
        this.totalUsersCount = response.total_count;
        if (this.selectedView === 'users') {
          this.totalCount = response.total_count;
        }
      },
      error: (error) => {
        console.error('Error refreshing time stats:', error);
      }
    });
  }

  getListeningTimeDays(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    if (hours === 0) {
      return '<1h';
    }
    return `${hours}h`;
  }

  getTopThree(): CozyUser[] {
    return this.leaderboard.slice(0, 3);
  }

  getRemainingUsers(): CozyUser[] {
    return this.leaderboard.slice(3);
  }

  startLiveStats(): void {
    // Charger une première fois immédiatement
    this.loadLiveStats();
    
    // Puis toutes les 5 secondes - uniquement les stats live
    this.statsSubscription = interval(5000).subscribe(() => {
      this.loadLiveStats();
    });
  }

  loadLiveStats(): void {
    this.statsLoading = true;
    this.cozybotService.getLiveStats().subscribe({
      next: (stats: LiveStats) => {
        // Sauvegarder les anciennes stats pour détecter les changements
        this.previousStats = { ...this.liveStats };
        
        // Animer si les valeurs ont changé
        if (this.liveStats.current_listeners !== stats.current_listeners) {
          this.animatingListeners = true;
          setTimeout(() => this.animatingListeners = false, 500);
        }
        if (this.liveStats.servers_with_bot !== stats.servers_with_bot) {
          this.animatingServers = true;
          setTimeout(() => this.animatingServers = false, 500);
        }
        
        this.liveStats = stats;
        this.statsLoading = false;
        
        // Animer Total Servers au premier chargement
        if (this.previousTotalServers === 0) {
          this.previousTotalServers = stats.total_servers;
          setTimeout(() => {
            this.animatingTotalServers = true;
            setTimeout(() => this.animatingTotalServers = false, 500);
          }, 600);
        }
      },
      error: (error) => {
        console.error('Error loading live stats:', error);
        this.statsLoading = false;
      }
    });
  }

  getDisplayName(user: CozyUser): string {
    return user.display_name || user.username;
  }

  trackByUserId(index: number, user: CozyUser): string {
    return user.user_id;
  }

  trackByServerId(index: number, server: CozyServer): string {
    return server.server_id;
  }

  trackBySoundName(index: number, sound: CozySound): string {
    return sound.sound_name;
  }

  formatTime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  getFavoriteSound(user: CozyUser): string {
    return user.favorite_sound || '🎵';
  }

  private setFavicon(iconPath: string): void {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = iconPath;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = iconPath;
      document.getElementsByTagName('head')[0].appendChild(newLink);
    }
  }
}