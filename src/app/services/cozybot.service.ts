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

@Injectable({
  providedIn: 'root'
})
export class CozybotService {
  private apiUrl = 'http://90.60.191.159:8000/api';

  constructor(private http: HttpClient) {}

  getTopUsers(): Observable<LeaderboardResponse> {
    return this.http.get<LeaderboardResponse>(`${this.apiUrl}/top-users`);
  }

  getLiveStats(): Observable<LiveStats> {
    return this.http.get<LiveStats>(`${this.apiUrl}/total`);
  }
}