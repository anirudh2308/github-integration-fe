import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  //   /** ✅ Fetch organizations */
  // getOrganizations(): Observable<GithubOrg[]> {
  //   return this.http.get<GithubOrg[]>(`${this.baseUrl}/orgs`);
  // }

  // /** ✅ Fetch repos for a specific org */
  // getRepositories(org: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/orgs/${org}/repos`);
  // }

  // /** ✅ Fetch commits for a specific repo */
  // getCommits(org: string, repo: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/orgs/${org}/repos/${repo}/commits`);
  // }
}
