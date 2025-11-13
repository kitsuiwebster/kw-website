import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CozyUser {
  user_id: string;
  username: string;
  display_name: string;
  total_points: number;
  rank: number;
  listening_time_seconds: number;
  listening_time_formatted: string;
  daily_streak: number;
  level: number;
  level_progress: number;
  sessions_joined: number;
  achievements_count: number;
}

export interface LeaderboardResponse {
  users: CozyUser[];
  total_count: number;
}

export interface LiveStats {
  current_listeners: number;
  message: string;
  servers_with_bot: number;
  total_servers: number;
}

export interface CozyServer {
  server_id: string;
  server_name: string;
  total_time_seconds: number;
  formatted_time: string;
  rank: number;
}

export interface CozySound {
  sound_name: string;
  display_name: string;
  total_time: number;
  formatted_time: string;
  total_sessions: number;
  unique_listeners: number;
}

export interface ServersResponse {
  servers: CozyServer[];
  total_count: number;
}

export interface SoundsResponse {
  sounds: CozySound[];
  total_sounds: number;
}

@Injectable({
  providedIn: 'root'
})
export class CozybotService {
  private apiUrl = 'https://cozybotapi.kitsuiwebster.com:8000/api';

  constructor(private http: HttpClient) {}

  getTopUsers(): Observable<LeaderboardResponse> {
    return this.http.get<LeaderboardResponse>(`${this.apiUrl}/top-users`);
  }

  getLiveStats(): Observable<LiveStats> {
    return this.http.get<LiveStats>(`${this.apiUrl}/total`);
  }

  getTopServers(): Observable<ServersResponse> {
    return this.http.get<ServersResponse>(`${this.apiUrl}/top-servers`);
  }

  getTopSounds(): Observable<SoundsResponse> {
    return this.http.get<SoundsResponse>(`${this.apiUrl}/top-sounds`);
  }
}