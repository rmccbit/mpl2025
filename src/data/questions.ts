export type Question = {
  id: number;
  text: string;
  choices: string[];
  correctIndex: number;
  runs: 0 | 1 | 2 | 4 | 6;
  type?: "normal" | "wide" | "noball";
  stage: "group" | "playoffs" | "semifinals" | "finals";
};

export const QUESTIONS: Question[] = [
  // GROUP STAGE
  // 🏏 FIRST INNINGS
// 🏃‍♂️ 1-RUN QUESTIONS
  { id: 1, text: "A fielder takes a catch on the last ball of the match. How many legal deliveries remain in the over?", choices: ["5", "6", "7", "0"], correctIndex: 3, runs: 1, stage: "group" },
  { id: 2, text: "If a bowler bowls 8 overs and concedes 32 runs, what is his economy rate?", choices: ["6", "7", "4", "9"], correctIndex: 2, runs: 1, stage: "group" },

  // ⚡ 2-RUN QUESTIONS
  { id: 3, text: "A player’s strike rate dropped from 150 to 120. Find the percentage decrease.", choices: ["15%", "18.75%", "20%", "22%"], correctIndex: 2, runs: 2, stage: "group" },
  { id: 4, text: "A team needs 42 runs from 21 balls. What required run rate do they need (runs per over)?", choices: ["10", "11", "12", "14"], correctIndex: 2, runs: 2, stage: "group" },
  { id: 5, text: "A bowler delivers 6 overs, giving 36 runs. He bowls 4 more overs, conceding 28 runs. What is his overall economy rate?", choices: ["5.8", "6", "6.2", "6.4"], correctIndex: 1, runs: 2, stage: "group" },
  { id: 6, text: "A batsman scores 72 runs off 60 balls. If he hits 3 more fours, what will his new strike rate be?", choices: ["118", "120", "122", "124"], correctIndex: 2, runs: 2, stage: "group" },

  // 💥 4-RUN QUESTIONS
  { id: 7, text: "A batsman scores 90 runs which include 6 fours and 5 sixes. What percentage of his total score came from boundaries?", choices: ["60%", "65%", "70%", "75%"], correctIndex: 0, runs: 4, stage: "group" },
  { id: 8, text: "In a 20-over game, Team A scores 220. Team B is at 140 after 14 overs. What is the required run rate now (runs per over)?", choices: ["12.5", "13", "13.3", "14"], correctIndex: 2, runs: 4, stage: "group" },
  { id: 9, text: "A cricket stadium is circular with a boundary radius of 50 meters. What is the cost of fencing the boundary if it costs ₹120 per meter?", choices: ["37,600", "37,700", "37,699", "37,800"], correctIndex: 2, runs: 4, stage: "group" },
  { id: 10, text: "Team A scores 250 in 50 overs. After 25 overs, they are 120/3. What is the required run rate for the remaining overs?", choices: ["5", "5.2", "5.4", "5.6"], correctIndex: 2, runs: 4, stage: "group" },
  { id: 11, text: "A bowler bowls 10 overs taking 5 wickets for 60 runs. Another bowler bowls 8 overs, taking 4 wickets for 48 runs. Who has the better strike rate?", choices: ["Bowler 1", "Bowler 2", "Equal", "Cannot determine"], correctIndex: 0, runs: 4, stage: "group" },

  // 🚀 6-RUN QUESTIONS
  { id: 12, text: "Team A and Team B play 20 overs each. Team A’s run rate = 8.5, Team B’s = 7.9. Who wins and by how many runs?", choices: ["Team A by 12", "Team A by 13", "Team B by 12", "Draw"], correctIndex: 0, runs: 6, stage: "group" },
  { id: 13, text: "A batsman’s scores in 6 matches: 50, 65, 70, 60, 75, 80. If the lowest score is ignored, what is his new average?", choices: ["68", "69", "70", "71"], correctIndex: 2, runs: 6, stage: "group" },
  { id: 14, text: "In a Cricket match, 5 batsmen A, B, C, D, and E scored an average of 42 runs. D scored 7 more than E, E scored 9 fewer than A; B scored as many as D and E combined; and B and C scored 110 between them. How many runs did E score?", choices: ["25", "28", "30", "32"], correctIndex: 1, runs: 6, stage: "group" },
  { id: 15, text: "Team A bats first scoring 180. Team B scores 170 in 20 overs. If a bonus point is given for winning with a run rate > 1.1× opponent, do they get it?", choices: ["Yes", "No", "Tie", "Invalid"], correctIndex: 1, runs: 6, stage: "group" },

  // 🏏 SECOND INNINGS
  // 🏃‍♂️ 1-RUN QUESTIONS
  { id: 16, text: "A batsman’s last 7 scores are: 25, 50, 75, 80, 95, 45, 65. Find the median and mean.", choices: ["65 & 62.1", "65 & 62.1", "65 & 64.3", "65 & 60.5"], correctIndex: 1, runs: 1, stage: "group" },
  { id: 17, text: "A bowler delivers the ball at 144 km/h. Convert the speed to m/s.", choices: ["38.0", "39.0", "40.0", "41.0"], correctIndex: 2, runs: 1, stage: "group" },

  // ⚡ 2-RUN QUESTIONS
  { id: 18, text: "Tickets for a match are sold at ₹500 each. Out of 12,000 seats, 85% are sold. Find the total revenue.", choices: ["4,800,000", "5,100,000", "5,200,000", "5,100,500"], correctIndex: 1, runs: 2, stage: "group" },
  { id: 19, text: "How many balls are there in 17.3 overs?", choices: ["115", "105", "104", "114"], correctIndex: 1, runs: 2, stage: "group" },
  { id: 20, text: "A batsman scores 60, 70, 80, 50 in 4 innings. What score is needed in the 5th innings to average 70?", choices: ["60", "65", "70", "75"], correctIndex: 1, runs: 2, stage: "group" },
  { id: 21, text: "A bowler concedes 45 runs in 5 overs and 36 runs in 4 overs. Find his combined economy rate.", choices: ["9", "9.2", "9.5", "10"], correctIndex: 1, runs: 2, stage: "group" },

  // 💥 4-RUN QUESTIONS
  { id: 22, text: "In a match, the run rate graph shows runs increasing linearly from 50 to 210 between overs 12 and 62. Find the slope of the graph (runs per over).", choices: ["2", "3.2", "4", "5"], correctIndex: 1, runs: 4, stage: "group" },
  { id: 23, text: "A batsman’s first three scores are 45, 70, and 90. If he wants an average of 75 after four innings, how many runs must he score next?", choices: ["70", "75", "95", "85"], correctIndex: 2, runs: 4, stage: "group" },
  { id: 24, text: "A team scored 350 runs in a match. The captain scored 3 times as many runs as the vice-captain. If together they scored 180 runs, how many runs did the vice-captain score?", choices: ["40", "45", "50", "55"], correctIndex: 1, runs: 4, stage: "group" },
  { id: 25, text: "The run rate for first 30 overs is 5.8 and for next 20 overs is 7.2. What is the overall run rate for 50 overs?", choices: ["6.3", "6.4", "6.5", "6.6"], correctIndex: 2, runs: 4, stage: "group" },
  { id: 26, text: "A bowler takes 3, 4, 5, 2 wickets in 4 matches. What is the average wickets per match?", choices: ["3.0", "3.5", "4.0", "4.5"], correctIndex: 1, runs: 4, stage: "group" },

  // 🚀 6-RUN QUESTIONS
  { id: 27, text: "A batsman has a 0.05 probability of scoring a century in a match. In a 12-match series, find the probability that he scores at least one century.", choices: ["40.3%", "45.3%", "50.3%", "55.3%"], correctIndex: 2, runs: 6, stage: "group" },
  { id: 28, text: "Two batsmen, A and B, score runs according to an arithmetic sequence over overs. A’s scoring rate increases by 1.5 runs per over, starting from 5.0 runs. B’s scoring rate increases by 1.0 run per over, starting from 4.0 runs. They bat together for 10 overs. Find the total partnership runs.", choices: ["200.5", "202.5", "204.5", "206.5"], correctIndex: 1, runs: 6, stage: "group" },
  { id: 29, text: "Batsmen A & B scoring per over (arithmetic sequences): A: 5, 7, 9, ... B: 6, 6.5, 7, ... They bat 12 overs. Find total runs and % contribution of B.", choices: ["290 runs, 36.36%", "297 runs, 35.35%", "298 runs, 36.5%", "295 runs, 36.3%"], correctIndex: 1, runs: 6, stage: "group" },
  { id: 30, text: "Team scores 210 in 40 overs. Chasing team has 50 runs off 10 overs. Required run rate for remaining 30 overs?", choices: ["5.33", "5.5", "5.7", "6.0"], correctIndex: 0, runs: 6, stage: "group" },

  
  // PLAYOFFS
  { id: 31, text: "If a batsman maintains a strike rate of 150 for 30 balls, how many runs has he scored?", choices: ["40", "45", "50", "60"], correctIndex: 3, runs: 2, stage: "playoffs" },

  { id: 32, text: "A bowler concedes 45 runs in 5 overs. How many dot balls did he bowl if he gave only singles otherwise?", choices: ["15", "20", "25", "30"], correctIndex: 1, runs: 2, stage: "playoffs" },

  { id: 33, text: "A team needs 100 runs from 10 overs. If they score 45 in the first 5, what’s the required run rate now?", choices: ["9", "10", "11", "11.5"], correctIndex: 1, runs: 2, stage: "playoffs" },

  { id: 34, text: "The range R of a projectile is given by R = (u² sin(2θ)) / g. If R = 80 m and u = 40 m/s, find θ.", choices: ["22.5°", "30°", "37°", "45°"], correctIndex: 0, runs: 4, stage: "playoffs" },

  { id: 35, text: "A cricketer’s average after 9 innings is 45. After the 10th innings, his average becomes 46. How many runs did he score in the 10th?", choices: ["50", "55", "60", "65"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 36, text: "If a bowler’s strike rate is 18 balls per wicket, how many overs does he need to take 4 wickets?", choices: ["10.8", "12.0", "11.2", "9.6"], correctIndex: 0, runs: 4, stage: "playoffs" },

  { id: 37, text: "A batsman’s score pattern: 10, 20, 40, 80. If this doubles pattern continues, what will be his next score?", choices: ["100", "120", "160", "200"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 38, text: "In coordinate geometry, the midpoint between (2, 3) and (8, 9) is:", choices: ["(4, 5)", "(5, 6)", "(6, 7)", "(7, 8)"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 39, text: "If a player’s economy rate improves from 9.6 to 8.0 after one match, what does it indicate?", choices: ["He bowled fewer overs", "He bowled better", "He conceded more runs", "No change"], correctIndex: 1, runs: 2, stage: "playoffs" },

  { id: 40, text: "A batsman hits 10 boundaries and 3 sixes in a 60-ball innings. What percentage of runs came from boundaries?", choices: ["50%", "60%", "65%", "70%"], correctIndex: 2, runs: 6, stage: "playoffs" },

  { id: 41, text: "A team’s required run rate increases by 0.5 every over. If it started at 8, what’s the RRR after 4 overs?", choices: ["9.5", "10", "10.5", "11"], correctIndex: 0, runs: 4, stage: "playoffs" },

  { id: 42, text: "A cricket ball is projected at 45° with speed 20 m/s. Find maximum height (g = 10 m/s²).", choices: ["5 m", "8 m", "10 m", "12 m"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 43, text: "The probability of a batsman hitting a six is 0.1. In 10 balls, what’s the expected number of sixes?", choices: ["0", "1", "2", "3"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 44, text: "Team needs 30 runs from 12 balls. If they hit 2 sixes and 1 four, how many runs still needed?", choices: ["12", "14", "16", "18"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 45, text: "The line joining midpoints of two sides of a triangle is:", choices: ["Equal to base", "Parallel to base", "Perpendicular to base", "None"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 46, text: "If Team A scores 240 in 40 overs and Team B scores 180 in 30 overs, which has the better run rate?", choices: ["Team A", "Team B", "Equal", "Cannot determine"], correctIndex: 0, runs: 2, stage: "playoffs" },

  { id: 47, text: "A player’s strike rate is 200. How many runs did he score from 12 balls?", choices: ["20", "22", "24", "26"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 48, text: "The equation of a circle with center (2,3) and radius 5 is:", choices: ["(x−2)²+(y−3)²=25", "(x+2)²+(y+3)²=25", "(x−2)²+(y−3)²=5", "(x+2)²+(y+3)²=5"], correctIndex: 0, runs: 6, stage: "playoffs" },

  { id: 49, text: "If 4 wickets fell in 8 overs, what’s the average wickets per over?", choices: ["0.25", "0.5", "0.75", "1"], correctIndex: 1, runs: 1, stage: "playoffs" },

  { id: 50, text: "A batsman scores 72 runs with 12 boundaries. What percent of runs came from boundaries?", choices: ["50%", "60%", "65%", "70%"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 51, text: "If Team A’s total run rate after 10 overs is 8.5, what’s their total runs scored?", choices: ["75", "80", "85", "90"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 52, text: "The sum of first 10 natural numbers is:", choices: ["45", "50", "55", "60"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 53, text: "A player takes 5 wickets giving 40 runs. What’s his bowling average?", choices: ["6", "7", "8", "9"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 54, text: "A batsman’s scores are 30, 40, 50, 60, 70. What’s his average?", choices: ["45", "50", "55", "60"], correctIndex: 1, runs: 2, stage: "playoffs" },

  { id: 55, text: "If a cricket field is circular with a boundary radius of 70 m, find its area.", choices: ["14,000 m²", "15,000 m²", "15,400 m²", "16,000 m²"], correctIndex: 2, runs: 6, stage: "playoffs" },

  { id: 56, text: "Team A requires 80 runs in 8 overs. If they score 50 in the next 5 overs, what’s the new RRR?", choices: ["9", "9.5", "10", "10.5"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 57, text: "If a ball is thrown vertically upward with velocity 20 m/s, find time to reach maximum height (g = 10 m/s²).", choices: ["1 s", "2 s", "3 s", "4 s"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 58, text: "In probability, the chance of hitting a six is 1/10. What’s the probability of not hitting a six in one ball?", choices: ["0.1", "0.8", "0.9", "0.95"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 59, text: "A team scores 320/8 in 50 overs. What’s the run rate?", choices: ["6.2", "6.3", "6.4", "6.5"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 60, text: "If Team A scores 10% more than Team B’s 180 runs, how much did Team A score?", choices: ["190", "195", "198", "200"], correctIndex: 1, runs: 2, stage: "playoffs" },

    
  // SEMIFINALS
  { id: 61, text: "In a T20 match, Team A scored 184 runs for 4 wickets in 20 overs. While chasing, Team B reached 46 runs for 1 wicket in 5 overs, but play was stopped due to rain and no further play was possible. Who is declared the winner?", choices: ["Team A", "Team B", "Draw", "No Result"], correctIndex: 3, runs: 1, stage: "semifinals" },
  { id: 62, text: "Two batsmen scored equal runs. The number of balls faced by each is the positive root of the equations: A1: x² − 47x − 150 = 0, A2: x² − 55x − 300 = 0. Who is the Man of the Match?", choices: ["A1", "A2", "Both", "Cannot be determined"], correctIndex: 0, runs: 1, stage: "semifinals" },
  { id: 63, text: "If two batsmen Shikhar Dhawan and David Warner have a partnership ratio of 5/3:5/4. Both together scored 210 runs. Find who has scored more runs and by how much?", choices: ["Shikhar Dhawan, 30", "David Andrew Warner, 30", "David Andrew Warner, 40", "Shikhar Dhawan, 40"], correctIndex: 0, runs: 2, stage: "semifinals" },
  { id: 64, text: "SKY has scored 10 runs in the first 10 balls. After 20 balls, his strike rate is 250. How many runs did he score in the last 10 balls?", choices: ["36", "45", "40", "63"], correctIndex: 2, runs: 2, stage: "playoffs" },
  { id: 65, text: "A batsman scores 35, 42, 58, and 65 runs in his first four innings. If he wants a strike rate of 120 after 50 balls in total and he faced 20, 18, 25, and 22 balls respectively in the first four innings, how many runs should he score in the 5th innings if he faces 15 balls?", choices: ["40", "42", "44", "46"], correctIndex: 1, runs: 2, stage: "semifinals" },
  { id: 66, text: "Two batsmen, A and B, share a partnership of 180 runs. If A scores 20% more than B, find their individual scores.", choices: ["A: 100, B: 80", "A: 108, B: 72", "A: 110, B: 70", "A: 120, B: 60"], correctIndex: 1, runs: 2, stage: "semifinals" },
  { id: 67, text: "A batsman scored 0, 45, 63, 72 in the last four innings. Find the minimum runs in the 5th innings so that average is at least 50.", choices: ["69", "70", "71", "72"], correctIndex: 1, runs: 4, stage: "semifinals" },
  { id: 68, text: "Player X scores 80 runs at strike rate 160. Player Y faces 50% more balls than Player X but has a strike rate of 120. Who scores more runs and by how much?", choices: ["Player X by 10 runs", "Player Y by 10 runs", "Player Y by 20 runs", "Player X by 20 runs"], correctIndex: 1, runs: 4, stage: "semifinals" },
  { id: 69, text: "A batsman’s batting average after 24 innings is 41. He scores 15 runs in the 25th innings. What is the batting average after 25 innings?", choices: ["40", "39.90", "39.96", "None"], correctIndex: 2, runs: 4, stage: "semifinals" },
  { id: 70, text: "A batsman scores 50, 62, 70, 80, and 90 runs in 5 innings. If his next innings is 120 runs, what will be his new batting average?", choices: ["78.67", "77.00", "76.40", "75.60"], correctIndex: 0, runs: 4, stage: "semifinals" },
  { id: 71, text: "In a T20 match, Player X bowls 4 overs at an economy of 6.5, and Player Y bowls 5 overs at an economy of 7.2. Who concedes more runs and by how much?", choices: ["Player X, 1 run more", "Player Y, 1 run more", "Player Y, 0.5 runs more", "Player X, 0.5 runs more"], correctIndex: 1, runs: 4, stage: "semifinals" },
  { id: 72, text: "The number of wickets taken by bowler A is [44i⁴ + 23i²] and that by bowler B is [12i⁶ + 42i⁸]. Who took more wickets?", choices: ["Bowler A", "Bowler B", "Both have equal wickets", "None of the above"], correctIndex: 1, runs: 6, stage: "semifinals" },
  { id: 73, text: "In the first 6 overs (Powerplay), a team scores at 8 runs per over without losing a wicket. For the next 9 overs, they accelerate to 10 runs per over but lose 4 wickets. How many runs do they have at the end of 15 overs, and what is their run rate?", choices: ["138, 9", "136, 9.2", "138, 9.2", "136, 9"], correctIndex: 2, runs: 6, stage: "semifinals" },
  { id: 74, text: "A cricket ball is projected from point A on the pitch at a certain velocity and angle such that it describes a parabolic arc reaching maximum height h and lands at point B on the boundary field. If the pitch is represented as a line segment AB on the x-axis, and the ball's path is modeled by a quadratic function y = −ax² + bx + c, how can you find the coordinates of the highest point of the ball's path? Calculate h if the vertex is at x = b/2a.", choices: ["h = c − (b²)/2a", "h = c + (b²)/2a", "h = c + (b²)/4a", "h = c − (b²)/4a"], correctIndex: 2, runs: 6, stage: "semifinals" },
  { id: 75, text: "A bowler has a bowling average given by the function A(n) = 15 + 0.5n, where n is the number of matches played. If he has played 12 matches, what is his average?", choices: ["20", "21", "22", "23"], correctIndex: 1, runs: 6, stage: "semifinals" },
  { id: 76, text: "The cricket ground boundary can be approximated by a 3D elliptical paraboloid described by z = 4 − (x²/16) − (y²/9). Calculate the volume of the region above ground level (i.e. where z ≥ 0) within this boundary.", choices: ["48π", "64π", "96π", "128π"], correctIndex: 2, runs: 1, stage: "semifinals" },
  { id: 77, text: "A batsman has a strike rate of 120 after 40 balls. He wants to increase his overall strike rate to 150 by the time he faces 60 balls. What must his strike rate be for the next 20 balls?", choices: ["210", "200", "220", "None"], correctIndex: 0, runs: 1, stage: "semifinals" },
  { id: 78, text: "A batsman must hit a six on the last ball to win. The ball must cover 102.4 meters at a 45° angle with g = 10 m/s². What is minimum velocity needed?", choices: ["30 m/s", "32 m/s", "64 m/s", "60 m/s"], correctIndex: 1, runs: 2, stage: "semifinals" },
  { id: 79, text: "In a T20 match, Team X’s average run rate for the first 10 overs was 7.5. To finish with an overall average run rate of 9 runs per over, what should be their average run rate in the remaining 10 overs?", choices: ["10.5", "10.8", "11.0", "11.5"], correctIndex: 2, runs: 2, stage: "semifinals" },
  { id: 80, text: "A batsman faces 60 balls and scores 72 runs at a strike rate of 120. He then faces 30 more balls and wants to raise his strike rate to 150. How many runs should he score in the next 30 balls?", choices: ["63", "66", "68", "70"], correctIndex: 1, runs: 2, stage: "semifinals" },
  { id: 81, text: "Team Y scores 80 runs in 10 overs. To reach a total of 180 runs in 20 overs, what run rate should they maintain in the remaining overs?", choices: ["9", "10", "11", "12"], correctIndex: 1, runs: 2, stage: "semifinals" },
  { id: 82, text: "A cricket ball is rolled toward wickets 22 yards apart, with the diameter of the ball 3 inches and wicket width 8 inches. If the ball rolls in a straight line, within what angle does the ball's direction lie (relative to the center line) to avoid missing the wickets?", choices: ["±0.30°", "±0.18°", "±0.45°", "±0.60°"], correctIndex: 1, runs: 4, stage: "semifinals" },
  { id: 83, text: "A ball hit by a batsman moves on the ground towards boundary point P along segment RP. The fielder at Q runs along QP to intercept. If triangle PQS is isosceles with PQ = PS = SR, find the magnitude of angle QPR.", choices: ["36°", "42°", "54°", "84°"], correctIndex: 0, runs: 4, stage: "semifinals" },
  { id: 84, text: "Runs scored by Team A and Team B are values of solutions [f(7)] and [g(7)] of differential equations: dy/dx = 6x + 7, with y(0) = 13, and dy/dx = 4x + 9, with y(1) = 54. Find the winning team and margin.", choices: ["Team B won by 5 runs", "Team A won by 5 runs", "Team B won by 6 runs", "Team A won by 6 runs"], correctIndex: 1, runs: 4, stage: "semifinals" },
  { id: 85, text: "A batsman hits 4, 8, 15, 16, and 23 runs in the first 5 balls of an over. What is his average run per ball in this over?", choices: ["11.2", "12.0", "13.2", "14.0"], correctIndex: 0, runs: 4, stage: "semifinals" },
  { id: 86, text: "A cricket team has scores modeled by the function f(x) = 5x² + 2x + 10, where x = overs bowled. What is the total score at the end of 6 overs?", choices: ["250", "262", "274", "286"], correctIndex: 1, runs: 4, stage: "semifinals" },
  { id: 87, text: "Team A: Coefficient of x⁵ in (1 + x)⁷. Team B: Coefficient of x⁴ in (3 + x)⁶. Who won?", choices: ["Team B won by 114 runs", "Team A won by 114 runs", "Team B won by 57 runs", "Team A won by 57 runs"], correctIndex: 0, runs: 6, stage: "semifinals" },
  { id: 88, text: "From a pool of 27 players (13 batsmen including 2 keepers, 3 all-rounders, and the rest bowlers), how many ways can you form a team of 11 players with 1 keeper, 3 bowlers, 2 all-rounders, 6 batsmen (including the keeper)?", choices: ["456,120", "457,380", "458,640", "460,000"], correctIndex: 1, runs: 6, stage: "semifinals" },
  { id: 89, text: "Team A won the toss and chose to bat, scored 264. Team B has scored 55 runs in 30 balls. Find current run rate (CRR) and required run rate (RRR).", choices: ["CRR 10, RRR 14", "CRR 11, RRR 14", "CRR 11, RRR 13", "CRR 10, RRR 13"], correctIndex: 1, runs: 6, stage: "semifinals" },
  { id: 90, text: "A fielder throws a ball from the boundary to the stumps. If his velocity is 20 m/s at an angle of 30° and the distance is 40 m, will he hit the stumps? Take g = 10 m/s².", choices: ["Yes", "No", "Only if he throws higher", "Cannot determine"], correctIndex: 1, runs: 6, stage: "semifinals" },

  
  // FINALS
  { id: 91, text: "In a partnership, Player A scored 80 runs off 50 balls, and Player B scored 60 off 40 balls. Find the combined strike rate.", choices: ["152.6", "154.6", "153.6", "155.6"], correctIndex: 3, runs: 1, stage: "finals" },
  { id: 92, text: "If a circular cricket field has a diameter of 90 m, find the boundary area. (Use π = 3.14)", choices: ["17,662.5 m²", "6,358.5 m²", "17,562.5 m²", "6,458.5 m²"], correctIndex: 1, runs: 1, stage: "finals" },
  { id: 93, text: "A batsman faces 60 balls and hits a six 8 times. What is the probability that he does NOT hit a six on a randomly chosen ball?", choices: ["2/15", "52/60", "1/30", "10/75"], correctIndex: 1, runs: 2, stage: "finals" },
  { id: 94, text: "If the run rate was 4.5 for the first 20 overs, what must it be for the next 30 overs to reach a target of 325 runs?", choices: ["7", "7.5", "7.83", "8"], correctIndex: 2, runs: 2, stage: "finals" },
  { id: 95, text: "In a 50-over match, a batsman hits 10 sixes and 15 fours and scores 140 runs. How many singles did he run?", choices: ["20", "30", "25", "35"], correctIndex: 1, runs: 2, stage: "finals" },
  { id: 96, text: "A team scores 200 runs in 40 overs. They need 300 to win in 50 overs. What should be their required run rate?", choices: ["6", "5.5", "6.5", "7"], correctIndex: 0, runs: 2, stage: "finals" },
  { id: 97, text: "In a cricket match, a team scores runs in 5 consecutive overs as follows: 6, 12, 18, 24, 30 runs. What type of growth does the team’s total runs show over these overs?", choices: ["Arithmetic progression with a common difference of 6", "Geometric progression with a common ratio of 2", "Quadratic growth with increasing differences", "Exponential growth with base 3"], correctIndex: 0, runs: 4, stage: "finals" },
  { id: 98, text: "Team B needs 36 runs off 12 balls with 2 wickets left. If every delivery has a 0.20 probability of getting out, what’s the probability they finish with at least 1 wicket?", choices: ["12%", "25%", "27.5%", "20%"], correctIndex: 2, runs: 4, stage: "finals" },
  { id: 99, text: "In a 100-run partnership, A scores runs in the ratio 3 : 2 to B. If A’s strike rate is 25% higher than B’s, then what is the ratio of balls faced by A and B?", choices: ["4 : 3", "3 : 4", "5 : 4", "6 : 5"], correctIndex: 3, runs: 4, stage: "finals" },
  { id: 100, text: "A team scores runs in 6 consecutive overs as 10, 14, 18, 22, 26, 30. What type of growth does this sequence show?", choices: ["Arithmetic progression", "Geometric progression", "Quadratic growth", "Exponential growth"], correctIndex: 0, runs: 4, stage: "finals" },
  { id: 101, text: "A batsman hits 20 boundaries and 10 sixes in 100 runs. If he faced 80 balls, find his strike rate.", choices: ["120", "125", "130", "135"], correctIndex: 1, runs: 4, stage: "finals" },
  { id: 102, text: "In a 3-match series, Team A gets 2 points for a win, 1 for a draw, 0 for a loss. If probability of win is 1/3 and draw is 1/6, what is the probability that Team A scores exactly 5 points?", choices: ["1/16", "1/10", "1/8", "1/18"], correctIndex: 3, runs: 6, stage: "finals" },
  { id: 103, text: "Allowed runs per ball: {0,1,2,3,4,6}. Three balls (ordered). How many ordered triples sum to 12?", choices: ["10", "13", "11", "15"], correctIndex: 1, runs: 6, stage: "finals" },
  { id: 104, text: "In an IPL match, a team’s runs per over follow a Poisson distribution with mean λ=8 runs per over. Find the probability that the team scores at least 180 runs in 20 overs.", choices: ["0.06", "0.22", "0.38", "0.50"], correctIndex: 0, runs: 6, stage: "finals" },
  { id: 105, text: "In an IPL match, a team scores runs per over as Poisson with mean λ=10. Find probability they score ≤ 150 in 20 overs.", choices: ["0.42", "0.48", "0.52", "0.56"], correctIndex: 1, runs: 6, stage: "finals" },
  { id: 106, text: "A batsman’s strike rate is 140. If he faces 75 balls, how many runs does he score?", choices: ["110", "120", "105", "100"], correctIndex: 2, runs: 1, stage: "finals" },
  { id: 107, text: "A cricketer has a mean score of 60 runs over 10 innings. How many runs must be scored in the 11th innings to raise the mean to 62?", choices: ["82", "682", "12", "50"], correctIndex: 0, runs: 1, stage: "finals" },
  { id: 108, text: "A bowler faces 50 balls, with a 0.12 probability of taking a wicket per ball. What is the expected number of wickets?", choices: ["6", "4", "8", "10"], correctIndex: 0, runs: 2, stage: "finals" },
  { id: 109, text: "In a cricket innings, a batsman scored 94 runs with 10 boundaries (fours) and some sixes. If he scored 30 singles, how many sixes did he hit?", choices: ["2", "3", "4", "5"], correctIndex: 2, runs: 2, stage: "finals" },
  { id: 110, text: "A bowler has bowled 30 balls with probability 0.1 of taking a wicket per ball. What is the probability he takes at least 1 wicket?", choices: ["0.95", "0.96", "0.97", "0.98"], correctIndex: 2, runs: 2, stage: "finals" },
  { id: 111, text: "In a 20-over match, a batsman hits 5 sixes and 12 fours and scores 85 runs. How many singles did he make?", choices: ["10", "13", "15", "18"], correctIndex: 1, runs: 2, stage: "finals" },
  { id: 112, text: "A bowler concedes runs on each ball independently with distribution: 0 runs (0.4), 1 run (0.3), 2 runs (0.2), 4 runs (0.1). Find the probability that in an over (6 balls) he gives exactly 6 runs.", choices: ["0.07", "0.06", "0.09", "0.10"], correctIndex: 1, runs: 4, stage: "finals" },
  { id: 113, text: "A circular cricket ground has radius R = 50m. The boundary rope is moved 5 m inside for safety. Find the percentage reduction in playing area.", choices: ["13%", "7%", "15%", "19%"], correctIndex: 3, runs: 4, stage: "finals" },
  { id: 114, text: "A cricket field is circular with radius 70 m. The boundary rope covers only a sector of 120° for practice nets. Find the area and length of the rope needed.", choices: ["146.6m", "150.3m", "160m", "180.5m"], correctIndex: 0, runs: 4, stage: "finals" },
  { id: 115, text: "A bowler concedes 5, 3, 2, 4, 6, 0 runs in 6 balls. Find the mean and variance of runs per ball.", choices: ["3.33, 3.22", "3.33, 3.56", "3.33, 2.22", "3.33, 2.56"], correctIndex: 1, runs: 4, stage: "finals" },
  { id: 116, text: "A circular cricket ground has radius 60 m. If the boundary rope is moved 10 m inward, find the reduction in area.", choices: ["28.3%", "25%", "26%", "27%"], correctIndex: 0, runs: 4, stage: "finals" },
  { id: 117, text: "In an IPL match, Kohli and Maxwell have a partnership of 150 runs. Kohli scores runs in the ratio of 3:2 compared to Maxwell. Later, Kohli hits a six off a no-ball, which adds 7 runs to his score. Find Kohli’s new percentage of total partnership.", choices: ["61%", "62%", "63%", "65%"], correctIndex: 1, runs: 6, stage: "finals" },
  { id: 118, text: "Given team R wants to gain 0.5 Net Run Rate after the match. Now team R and team A are matched for a T20 match and team A set a target of 150. Then find the number of overs in which the match has to be finished.", choices: ["18.70", "18.75", "18.85", "None"], correctIndex: 1, runs: 6, stage: "finals" },
  { id: 119, text: "Before his last match, Suresh's average score was 54. In his last match, he scored 60 runs which increased his average to 55. What runs must he score in his next match to increase his average to 56?", choices: ["56", "62", "70", "68"], correctIndex: 1, runs: 6, stage: "finals" }
];
