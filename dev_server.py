#!/usr/bin/env python3
"""
ArenaPulse Local Development Server & API Mock
Enables zero-dependency local preview of the Tournament Management Platform on Windows/Linux/Mac.
Serves frontend and provides REST endpoints compatible with the Spring Boot MongoDB API.
"""

import http.server
import socketserver
import json
import os
import urllib.parse
from datetime import datetime

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Stateful In-Memory Storage (simulating MongoDB)
tournaments_db = [
    {
        "id": "tour-101",
        "title": "Valorant Champions Invitational 2026",
        "description": "Tier 1 tactical shooter championship featuring top global esports franchises.",
        "game": "Valorant",
        "format": "SINGLE_ELIMINATION",
        "status": "ONGOING",
        "startDate": "2026-11-15",
        "endDate": "2026-11-20",
        "maxParticipants": 8,
        "currentParticipantsCount": 8,
        "prizePool": "$50,000 USD",
        "location": "Reykjavik Arena & Twitch Stream",
        "rules": "Standard 5v5 defusal rules. Best of 3 matches, Grand Final Best of 5.",
        "bannerUrl": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    },
    {
        "id": "tour-102",
        "title": "Apex FC Premier Cup",
        "description": "Premier round-robin tournament for competitive virtual football clubs.",
        "game": "EA Sports FC 25",
        "format": "ROUND_ROBIN",
        "status": "ONGOING",
        "startDate": "2026-11-10",
        "endDate": "2026-11-25",
        "maxParticipants": 4,
        "currentParticipantsCount": 4,
        "prizePool": "$15,000 USD",
        "location": "Online - European Server",
        "rules": "90-minute competitive matches. Win gives 3 pts, Draw gives 1 pt.",
        "bannerUrl": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat()
    }
]

participants_db = [
    {"id": "p1", "tournamentId": "tour-101", "name": "Sentinels Prime", "email": "sentinels@gg.com", "seed": 1, "wins": 1, "losses": 0, "draws": 0, "points": 3, "scoreFor": 2, "scoreAgainst": 0, "matchesPlayed": 1},
    {"id": "p2", "tournamentId": "tour-101", "name": "Fnatic Legion", "email": "fnatic@gg.com", "seed": 2, "wins": 1, "losses": 0, "draws": 0, "points": 3, "scoreFor": 2, "scoreAgainst": 1, "matchesPlayed": 1},
    {"id": "p3", "tournamentId": "tour-101", "name": "Paper Rex Elite", "email": "prx@gg.com", "seed": 3, "wins": 0, "losses": 0, "draws": 0, "points": 0, "scoreFor": 0, "scoreAgainst": 0, "matchesPlayed": 0},
    {"id": "p4", "tournamentId": "tour-101", "name": "DRX Titans", "email": "drx@gg.com", "seed": 4, "wins": 0, "losses": 0, "draws": 0, "points": 0, "scoreFor": 0, "scoreAgainst": 0, "matchesPlayed": 0},
    {"id": "p5", "tournamentId": "tour-101", "name": "LOUD Esports", "email": "loud@gg.com", "seed": 5, "wins": 0, "losses": 0, "draws": 0, "points": 0, "scoreFor": 0, "scoreAgainst": 0, "matchesPlayed": 0},
    {"id": "p6", "tournamentId": "tour-101", "name": "Team Liquid", "email": "liquid@gg.com", "seed": 6, "wins": 0, "losses": 0, "draws": 0, "points": 0, "scoreFor": 0, "scoreAgainst": 0, "matchesPlayed": 0},
    {"id": "p7", "tournamentId": "tour-101", "name": "NRG Shock", "email": "nrg@gg.com", "seed": 7, "wins": 0, "losses": 1, "draws": 0, "points": 0, "scoreFor": 1, "scoreAgainst": 2, "matchesPlayed": 1},
    {"id": "p8", "tournamentId": "tour-101", "name": "Leviatán Apex", "email": "lev@gg.com", "seed": 8, "wins": 0, "losses": 1, "draws": 0, "points": 0, "scoreFor": 0, "scoreAgainst": 2, "matchesPlayed": 1}
]

matches_db = [
    {
        "id": "m1", "tournamentId": "tour-101", "round": 1, "matchNumber": 1, "roundName": "Quarter-Finals",
        "participant1Id": "p1", "participant1Name": "Sentinels Prime", "score1": 2,
        "participant2Id": "p8", "participant2Name": "Leviatán Apex", "score2": 0,
        "winnerId": "p1", "winnerName": "Sentinels Prime", "status": "COMPLETED",
        "nextMatchId": "m5", "nextMatchSlot": 1
    },
    {
        "id": "m2", "tournamentId": "tour-101", "round": 1, "matchNumber": 2, "roundName": "Quarter-Finals",
        "participant1Id": "p4", "participant1Name": "DRX Titans", "score1": None,
        "participant2Id": "p5", "participant2Name": "LOUD Esports", "score2": None,
        "winnerId": None, "winnerName": None, "status": "SCHEDULED",
        "nextMatchId": "m5", "nextMatchSlot": 2
    },
    {
        "id": "m3", "tournamentId": "tour-101", "round": 1, "matchNumber": 3, "roundName": "Quarter-Finals",
        "participant1Id": "p2", "participant1Name": "Fnatic Legion", "score1": 2,
        "participant2Id": "p7", "participant2Name": "NRG Shock", "score2": 1,
        "winnerId": "p2", "winnerName": "Fnatic Legion", "status": "COMPLETED",
        "nextMatchId": "m6", "nextMatchSlot": 1
    },
    {
        "id": "m4", "tournamentId": "tour-101", "round": 1, "matchNumber": 4, "roundName": "Quarter-Finals",
        "participant1Id": "p3", "participant1Name": "Paper Rex Elite", "score1": None,
        "participant2Id": "p6", "participant2Name": "Team Liquid", "score2": None,
        "winnerId": None, "winnerName": None, "status": "SCHEDULED",
        "nextMatchId": "m6", "nextMatchSlot": 2
    },
    {
        "id": "m5", "tournamentId": "tour-101", "round": 2, "matchNumber": 1, "roundName": "Semi-Finals",
        "participant1Id": "p1", "participant1Name": "Sentinels Prime", "score1": None,
        "participant2Id": None, "participant2Name": "TBD", "score2": None,
        "winnerId": None, "winnerName": None, "status": "SCHEDULED",
        "nextMatchId": "m7", "nextMatchSlot": 1
    },
    {
        "id": "m6", "tournamentId": "tour-101", "round": 2, "matchNumber": 2, "roundName": "Semi-Finals",
        "participant1Id": "p2", "participant1Name": "Fnatic Legion", "score1": None,
        "participant2Id": None, "participant2Name": "TBD", "score2": None,
        "winnerId": None, "winnerName": None, "status": "SCHEDULED",
        "nextMatchId": "m7", "nextMatchSlot": 2
    },
    {
        "id": "m7", "tournamentId": "tour-101", "round": 3, "matchNumber": 1, "roundName": "Final",
        "participant1Id": None, "participant1Name": "TBD", "score1": None,
        "participant2Id": None, "participant2Name": "TBD", "score2": None,
        "winnerId": None, "winnerName": None, "status": "SCHEDULED",
        "nextMatchId": None, "nextMatchSlot": None
    }
]

class TournamentHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Route to standalone preview if accessing root
        if path == '/' or path == '/index.html':
            self.path = '/standalone-preview.html'
            return super().do_GET()

        # REST API endpoints
        if path == '/api/dashboard/stats':
            stats = {
                "totalTournaments": len(tournaments_db),
                "activeTournaments": sum(1 for t in tournaments_db if t.get('status') == 'ONGOING'),
                "upcomingTournaments": sum(1 for t in tournaments_db if t.get('status') == 'UPCOMING'),
                "completedTournaments": sum(1 for t in tournaments_db if t.get('status') == 'COMPLETED'),
                "totalParticipants": len(participants_db),
                "totalMatches": len(matches_db),
                "completedMatches": sum(1 for m in matches_db if m.get('status') == 'COMPLETED')
            }
            self.send_json(200, stats)
            return

        if path == '/api/tournaments':
            q = query.get('search', [None])[0]
            st = query.get('status', [None])[0]
            res = tournaments_db
            if q:
                res = [t for t in res if q.lower() in t['title'].lower() or q.lower() in t['game'].lower()]
            if st:
                res = [t for t in res if t.get('status') == st]
            self.send_json(200, res)
            return

        if path.startswith('/api/tournaments/') and not path.endswith('/participants') and not path.endswith('/matches') and not path.endswith('/standings'):
            tid = path.split('/')[-1]
            t = next((item for item in tournaments_db if item["id"] == tid), None)
            if t:
                self.send_json(200, t)
            else:
                self.send_json(404, {"error": "Tournament not found"})
            return

        if path.startswith('/api/tournaments/') and path.endswith('/participants'):
            tid = path.split('/')[-2]
            res = [p for p in participants_db if p.get('tournamentId') == tid]
            self.send_json(200, res)
            return

        if path.startswith('/api/tournaments/') and path.endswith('/matches'):
            tid = path.split('/')[-2]
            res = [m for m in matches_db if m.get('tournamentId') == tid]
            self.send_json(200, res)
            return

        if path.startswith('/api/tournaments/') and path.endswith('/standings'):
            tid = path.split('/')[-2]
            res = [p for p in participants_db if p.get('tournamentId') == tid]
            res.sort(key=lambda x: (x.get('points', 0), x.get('scoreFor', 0)), reverse=True)
            self.send_json(200, res)
            return

        # Fallback to static files
        super().do_GET()

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        data = json.loads(body) if body else {}

        if path == '/api/tournaments':
            new_id = "tour-" + str(int(datetime.now().timestamp()))
            data["id"] = new_id
            data["currentParticipantsCount"] = 0
            data["createdAt"] = datetime.now().isoformat()
            data["updatedAt"] = datetime.now().isoformat()
            tournaments_db.insert(0, data)
            self.send_json(201, data)
            return

        if path.startswith('/api/tournaments/') and path.endswith('/participants'):
            tid = path.split('/')[-2]
            p_id = "p-" + str(int(datetime.now().timestamp()))
            data["id"] = p_id
            data["tournamentId"] = tid
            data["matchesPlayed"] = 0
            data["wins"] = 0
            data["losses"] = 0
            data["draws"] = 0
            data["points"] = 0
            data["scoreFor"] = 0
            data["scoreAgainst"] = 0
            participants_db.append(data)
            for t in tournaments_db:
                if t["id"] == tid:
                    t["currentParticipantsCount"] = t.get("currentParticipantsCount", 0) + 1
            self.send_json(201, data)
            return

        if path.startswith('/api/tournaments/') and path.endswith('/generate-brackets'):
            tid = path.split('/')[-2]
            parts = [p for p in participants_db if p.get('tournamentId') == tid]
            if len(parts) < 2:
                self.send_json(400, {"message": "At least 2 participants required"})
                return

            new_matches = [
                {
                    "id": "gen-m1", "tournamentId": tid, "round": 1, "matchNumber": 1, "roundName": "Semi-Finals",
                    "participant1Id": parts[0]["id"] if len(parts) > 0 else None, "participant1Name": parts[0]["name"] if len(parts) > 0 else "TBD", "score1": None,
                    "participant2Id": parts[1]["id"] if len(parts) > 1 else None, "participant2Name": parts[1]["name"] if len(parts) > 1 else "TBD", "score2": None,
                    "winnerId": None, "winnerName": None, "status": "SCHEDULED", "nextMatchId": "gen-m3", "nextMatchSlot": 1
                },
                {
                    "id": "gen-m2", "tournamentId": tid, "round": 1, "matchNumber": 2, "roundName": "Semi-Finals",
                    "participant1Id": parts[2]["id"] if len(parts) > 2 else None, "participant1Name": parts[2]["name"] if len(parts) > 2 else "TBD", "score1": None,
                    "participant2Id": parts[3]["id"] if len(parts) > 3 else None, "participant2Name": parts[3]["name"] if len(parts) > 3 else "TBD", "score2": None,
                    "winnerId": None, "winnerName": None, "status": "SCHEDULED", "nextMatchId": "gen-m3", "nextMatchSlot": 2
                },
                {
                    "id": "gen-m3", "tournamentId": tid, "round": 2, "matchNumber": 1, "roundName": "Final",
                    "participant1Id": None, "participant1Name": "TBD", "score1": None,
                    "participant2Id": None, "participant2Name": "TBD", "score2": None,
                    "winnerId": None, "winnerName": None, "status": "SCHEDULED", "nextMatchId": None, "nextMatchSlot": None
                }
            ]
            global matches_db
            matches_db = [m for m in matches_db if m.get('tournamentId') != tid] + new_matches
            for t in tournaments_db:
                if t["id"] == tid:
                    t["status"] = "ONGOING"
            self.send_json(200, new_matches)
            return

        self.send_json(404, {"error": "Not Found"})

    def do_PUT(self):
        path = urllib.parse.urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        data = json.loads(body) if body else {}

        if path.startswith('/api/tournaments/'):
            tid = path.split('/')[-1]
            for t in tournaments_db:
                if t["id"] == tid:
                    t.update(data)
                    t["updatedAt"] = datetime.now().isoformat()
                    self.send_json(200, t)
                    return
            self.send_json(404, {"error": "Tournament not found"})
            return

        if path.startswith('/api/matches/') and path.endswith('/score'):
            mid = path.split('/')[-2]
            for m in matches_db:
                if m["id"] == mid:
                    m["score1"] = data.get("score1")
                    m["score2"] = data.get("score2")
                    if data.get("isCompleted"):
                        m["status"] = "COMPLETED"
                        s1 = m["score1"] or 0
                        s2 = m["score2"] or 0
                        if s1 > s2:
                            m["winnerId"] = m["participant1Id"]
                            m["winnerName"] = m["participant1Name"]
                        elif s2 > s1:
                            m["winnerId"] = m["participant2Id"]
                            m["winnerName"] = m["participant2Name"]
                        else:
                            m["winnerId"] = None
                            m["winnerName"] = "Draw"

                        # Advance to next match
                        if m.get("nextMatchId") and m.get("winnerId"):
                            for next_m in matches_db:
                                if next_m["id"] == m["nextMatchId"]:
                                    if m.get("nextMatchSlot") == 1:
                                        next_m["participant1Id"] = m["winnerId"]
                                        next_m["participant1Name"] = m["winnerName"]
                                    else:
                                        next_m["participant2Id"] = m["winnerId"]
                                        next_m["participant2Name"] = m["winnerName"]
                    self.send_json(200, m)
                    return
            self.send_json(404, {"error": "Match not found"})
            return

        self.send_json(404, {"error": "Not Found"})

    def do_DELETE(self):
        path = urllib.parse.urlparse(self.path).path
        if path.startswith('/api/tournaments/') and '/participants/' in path:
            pid = path.split('/')[-1]
            global participants_db
            participants_db = [p for p in participants_db if p["id"] != pid]
            self.send_json(200, {"message": "Participant deleted"})
            return

        if path.startswith('/api/tournaments/'):
            tid = path.split('/')[-1]
            global tournaments_db, matches_db
            tournaments_db = [t for t in tournaments_db if t["id"] != tid]
            participants_db = [p for p in participants_db if p.get("tournamentId") != tid]
            matches_db = [m for m in matches_db if m.get("tournamentId") != tid]
            self.send_json(200, {"message": "Tournament deleted"})
            return

        self.send_json(404, {"error": "Not Found"})

    def send_json(self, status, payload):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), TournamentHandler) as httpd:
        print(f"============================================================")
        print(f" ArenaPulse Tournament Platform is LIVE at:")
        print(f" -> http://localhost:{PORT}")
        print(f" Compatible with Spring Boot API endpoints under /api/*")
        print(f"============================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
