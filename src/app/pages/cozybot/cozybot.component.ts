import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CozybotService, CozyUser, LeaderboardResponse, LiveStats } from '../../services/cozybot.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cozybot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cozybot.component.html',
  styleUrls: ['./cozybot.component.scss']
})
export class CozybotComponent implements OnInit, OnDestroy {
  leaderboard: CozyUser[] = [];
  totalCount = 0;
  loading = true;
  error = '';
  
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
  
  private statsSubscription: Subscription | null = null;
  private headerStatsSubscription: Subscription | null = null;

  constructor(private cozybotService: CozybotService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
    this.startLiveStats();
    this.startHeaderStatsRefresh();
  }


  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
    if (this.headerStatsSubscription) {
      this.headerStatsSubscription.unsubscribe();
    }
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.error = '';
    
    this.cozybotService.getTopUsers().subscribe({
      next: (response: LeaderboardResponse) => {
        this.leaderboard = response.users;
        this.totalCount = response.total_count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.error = 'Failed to load leaderboard data';
        this.loading = false;
      }
    });
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
  private previousTotalUsers = 0;
  private previousTotalServers = 0;
  private previousTotalPoints = 0;
  private previousTotalTime = '';

  getTotalPoints(): number {
    return this.leaderboard.reduce((total, user) => total + user.total_points, 0);
  }

  getTotalUsers(): number {
    return this.totalCount;
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
      const refreshType = counter % 4;
      switch (refreshType) {
        case 0:
          this.refreshUsersStats();
          break;
        case 1:
          this.refreshServersStats();
          break;
        case 2:
          this.refreshPointsStats();
          break;
        case 3:
          this.refreshTimeStats();
          break;
      }
      counter++;
    });
  }

  private refreshUsersStats(): void {
    const currentUsers = this.getTotalUsers();
    if (this.previousTotalUsers !== currentUsers) {
      this.animatingUsers = true;
      setTimeout(() => this.animatingUsers = false, 500);
      this.previousTotalUsers = currentUsers;
    }
  }

  private refreshServersStats(): void {
    const currentServers = this.liveStats.total_servers;
    if (this.previousTotalServers !== currentServers) {
      this.animatingTotalServers = true;
      setTimeout(() => this.animatingTotalServers = false, 500);
      this.previousTotalServers = currentServers;
    }
  }

  private refreshPointsStats(): void {
    const currentPoints = this.getTotalPoints();
    if (this.previousTotalPoints !== currentPoints) {
      this.animatingPoints = true;
      setTimeout(() => this.animatingPoints = false, 500);
      this.previousTotalPoints = currentPoints;
    }
  }

  private refreshTimeStats(): void {
    const currentTime = this.getTotalTimeDays();
    if (this.previousTotalTime !== currentTime) {
      this.animatingTime = true;
      setTimeout(() => this.animatingTime = false, 500);
      this.previousTotalTime = currentTime;
    }
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
}