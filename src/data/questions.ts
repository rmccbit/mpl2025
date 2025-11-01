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
  { id: 31, text: "If a batsman maintains a strike rate of 150 for 30 balls, how many runs has he scored?", choices: ["40", "45", "50", "60"], correctIndex: 1, runs: 2, stage: "playoffs" },

  { id: 32, text: "A bowler concedes 45 runs in 10 overs. How many dot balls did he bowl if he gave only singles otherwise?", choices: ["15", "20", "25", "30"], correctIndex: 0, runs: 2, stage: "playoffs" },

  { id: 33, text: "A team needs 100 runs from 10 overs. If they score 45 in the first 5, what’s the required run rate now?", choices: ["9", "10", "11", "11.5"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 34, text: "The range R of a projectile is given by R = (u² sin(2θ)) / g. If R = 80 m and u = 40 m/s, find θ.", choices: ["22.5°", "30°", "37°", "45°"], correctIndex: 0, runs: 4, stage: "playoffs" },

  { id: 35, text: "A cricketer’s average after 9 innings is 45. After the 10th innings, his average becomes 46. How many runs did he score in the 10th?", choices: ["50", "55", "60", "65"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 36, text: "If a bowler’s strike rate is 18 balls per wicket, how many overs does he need to take 4 wickets?", choices: ["10.8", "12.0", "11.2", "9.6"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 37, text: "A batsman’s score pattern: 10, 20, 40, 80. If this doubles pattern continues, what will be his next score?", choices: ["100", "120", "160", "200"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 38, text: "In coordinate geometry, the midpoint between (2, 3) and (8, 9) is:", choices: ["(4, 5)", "(5, 6)", "(6, 7)", "(7, 8)"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 39, text: "A batsman scores 60, 70, 80, 50 in 4 innings. What score is needed in the 5th innings to average 70?", choices: ["60", "65", "70", "75"], correctIndex: 1, runs: 2, stage: "playoffs" },

  { id: 40, text: "A batsman hits 5 fours and 5 sixes in a 60-ball innings. What percentage of runs came from fours?", choices: ["40%", "50%", "60%", "65%"], correctIndex: 2, runs: 6, stage: "playoffs" },

  { id: 41, text: "A team’s required run rate increases by 0.5 every over. If it started at 8, what’s the RRR after 4 overs?", choices: ["9.5", "10", "10.5", "11"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 42, text: "A cricket ball is projected at 45° with speed 20 m/s. Find maximum height (g = 10 m/s²).", choices: ["5 m", "8 m", "10 m", "12 m"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 43, text: "The probability of a batsman hitting a six is 0.1. In 20 balls, what’s the expected number of sixes?", choices: ["0", "1", "2", "3"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 44, text: "Team needs 30 runs from 12 balls. If they hit 2 sixes and 1 four, how many runs still needed?", choices: ["12", "14", "16", "18"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 45, text: "The line joining midpoints of two sides of a triangle is:", choices: ["Equal to base", "Parallel to base", "Perpendicular to base", "None"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 46, text: "If Team A scores 240 in 40 overs and Team B scores 180 in 30 overs, which has the better run rate?", choices: ["Team A", "Team B", "Equal", "Cannot determine"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 47, text: "A player’s strike rate is 200. How many runs did he score from 12 balls?", choices: ["20", "22", "24", "26"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 48, text: "The equation of a circle with center (2,3) and radius 5 is:", choices: ["(x−2)²+(y−3)²=25", "(x+2)²+(y+3)²=25", "(x−2)²+(y−3)²=5", "(x+2)²+(y+3)²=5"], correctIndex: 0, runs: 6, stage: "playoffs" },

  { id: 49, text: "If 4 wickets fell in 8 overs, what’s the average wickets per over?", choices: ["0.25", "0.5", "0.75", "1"], correctIndex: 1, runs: 1, stage: "playoffs" },

  { id: 50, text: "A batter scores 60 runs with 12 runs from boundaries. What percent of runs came from boundaries?", choices: ["10%", "20%", "25%", "30%"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 51, text: "If Team A’s total run rate after 10 overs is 8.5, what’s their total runs scored?", choices: ["75", "80", "85", "90"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 52, text: "The sum of first 10 natural numbers is:", choices: ["45", "50", "55", "60"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 53, text: "A player takes 5 wickets giving 40 runs. What’s his bowling average?", choices: ["6", "7", "8", "9"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 54, text: "A batsman’s scores are 30, 40, 50, 60, 70. What’s his average?", choices: ["45", "50", "55", "60"], correctIndex: 1, runs: 2, stage: "playoffs" },

  { id: 55, text: "If a cricket field is circular with a boundary radius of 70 m, find its area.", choices: ["14,000 m²", "15,000 m²", "15,400 m²", "16,000 m²"], correctIndex: 2, runs: 6, stage: "playoffs" },

  { id: 56, text: "Team A requires 80 runs in 8 overs. If they score 50 in the next 5 overs, what’s the new RRR?", choices: ["9", "9.5", "10", "10.5"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 57, text: "If a ball is thrown vertically upward with velocity 20 m/s, find time to reach maximum height (g = 10 m/s²).", choices: ["1 s", "2 s", "3 s", "4 s"], correctIndex: 1, runs: 4, stage: "playoffs" },

  { id: 58, text: "In probability, the chance of hitting a six is 1/10. What’s the probability of not hitting a six in one ball?", choices: ["0.1", "0.8", "0.9", "0.95"], correctIndex: 2, runs: 2, stage: "playoffs" },

  { id: 59, text: "A team scores 320/8 in 50 overs. What’s the run rate?", choices: ["6.2", "6.3", "6.4", "6.5"], correctIndex: 2, runs: 4, stage: "playoffs" },

  { id: 60, text: "If Team A scores 10% more than Team B’s 180 runs, how much did Team A score?", choices: ["190", "195", "198", "200"], correctIndex: 2, runs: 2, stage: "playoffs" },

  
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
// export type Question = {
//   id: number;
//   text: string;
//   choices: string[];
//   correctIndex: number;
//   runs: 0 | 1 | 2 | 4 | 6;
//   type?: "normal" | "wide" | "noball";
//   stage: "group" | "playoffs" | "semifinals" | "finals";
// };

// export const QUESTIONS: Question[] = [
//   // GROUP STAGE
//   { id: 1, text: "What is 7 × 8?", choices: ["54", "56", "58", "60"], correctIndex: 1, runs: 2, stage: "group" },
//   { id: 2, text: "What is 12 ÷ 3?", choices: ["3", "4", "5", "6"], correctIndex: 1, runs: 1, stage: "group" },
//   { id: 3, text: "What is the square of 9?", choices: ["81", "72", "99", "79"], correctIndex: 0, runs: 2, stage: "group" },
//   { id: 4, text: "What is 15 + 26?", choices: ["41", "39", "40", "42"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 5, text: "What is 45 - 27?", choices: ["18", "17", "20", "16"], correctIndex: 0, runs: 1, stage: "group" },
//   { id: 6, text: "Find 25% of 200", choices: ["25", "40", "50", "60"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 7, text: "Simplify: (6 × 2) + (4 × 2)", choices: ["20", "18", "16", "14"], correctIndex: 0, runs: 2, stage: "group" },
//   { id: 8, text: "Find x if 2x = 14", choices: ["6", "7", "8", "9"], correctIndex: 1, runs: 1, stage: "group" },
//   { id: 9, text: "Simplify: 5² + 2³", choices: ["33", "31", "29", "25"], correctIndex: 0, runs: 2, stage: "group" },
//   { id: 10, text: "What is the cube of 3?", choices: ["9", "18", "27", "36"], correctIndex: 2, runs: 2, stage: "group" },
//   { id: 11, text: "What is 3/5 of 100?", choices: ["50", "55", "60", "65"], correctIndex: 2, runs: 2, stage: "group" },
//   { id: 12, text: "Simplify: 18 ÷ (3 × 2)", choices: ["6", "3", "2", "4"], correctIndex: 1, runs: 2, stage: "group" },
//   { id: 13, text: "What is the square root of 81?", choices: ["7", "8", "9", "10"], correctIndex: 2, runs: 2, stage: "group" },
//   { id: 14, text: "What is 9 × 6?", choices: ["52", "54", "56", "58"], correctIndex: 1, runs: 2, stage: "group" },
//   { id: 15, text: "What is 48 ÷ 8?", choices: ["5", "6", "7", "8"], correctIndex: 1, runs: 1, stage: "group" },
//   { id: 16, text: "What is 23 + 19?", choices: ["40", "41", "42", "43"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 17, text: "What is 60 - 35?", choices: ["23", "24", "25", "26"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 18, text: "Find 50% of 80", choices: ["30", "35", "40", "45"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 19, text: "What is 4 × 9?", choices: ["32", "34", "36", "38"], correctIndex: 2, runs: 2, stage: "group" },
//   { id: 20, text: "Simplify: 5 + 3 × 2", choices: ["11", "13", "16", "10"], correctIndex: 0, runs: 2, stage: "group" },
//   { id: 21, text: "What is the square of 7?", choices: ["42", "45", "49", "52"], correctIndex: 2, runs: 2, stage: "group" },
//   { id: 22, text: "What is 3 × 11?", choices: ["30", "31", "33", "35"], correctIndex: 2, runs: 2, stage: "group" },
//   { id: 23, text: "Find x if 5x = 25", choices: ["3", "4", "5", "6"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 24, text: "What is 72 ÷ 9?", choices: ["6", "7", "8", "9"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 25, text: "What is 30 + 45?", choices: ["70", "72", "75", "78"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 26, text: "What is 100 - 63?", choices: ["35", "36", "37", "38"], correctIndex: 2, runs: 1, stage: "group" },
//   { id: 27, text: "Find 20% of 100", choices: ["15", "20", "25", "30"], correctIndex: 1, runs: 1, stage: "group" },
//   { id: 28, text: "What is 2/4 simplified?", choices: ["1/4", "1/2", "2/3", "3/4"], correctIndex: 1, runs: 1, stage: "group" },
//   { id: 29, text: "What is 8 × 7?", choices: ["54", "56", "58", "60"], correctIndex: 1, runs: 2, stage: "group" },
//   { id: 30, text: "What is the cube of 2?", choices: ["4", "6", "8", "10"], correctIndex: 2, runs: 2, stage: "group" },
  
//   // PLAYOFFS
//   { id: 31, text: "If x = 5, find 2x + 3", choices: ["13", "12", "15", "10"], correctIndex: 0, runs: 2, stage: "playoffs" },
//   { id: 32, text: "What is 8 × 12?", choices: ["88", "92", "96", "98"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 33, text: "Find missing term: 2, 4, 8, 16, ?", choices: ["20", "24", "30", "32"], correctIndex: 3, runs: 4, stage: "playoffs" },
//   { id: 34, text: "Simplify: 3(2 + 5)", choices: ["21", "18", "15", "24"], correctIndex: 0, runs: 2, stage: "playoffs" },
//   { id: 35, text: "Convert 0.25 to fraction", choices: ["1/2", "1/4", "2/5", "1/5"], correctIndex: 1, runs: 1, stage: "playoffs" },
//   { id: 36, text: "If 5 pencils cost ₹20, cost of 1 pencil is?", choices: ["₹4", "₹5", "₹3", "₹2"], correctIndex: 0, runs: 1, stage: "playoffs" },
//   { id: 37, text: "Simplify: (7 × 3) - (8 ÷ 2)", choices: ["19", "17", "20", "18"], correctIndex: 1, runs: 2, stage: "playoffs" },
//   { id: 38, text: "Find 10% of 350", choices: ["30", "35", "40", "45"], correctIndex: 1, runs: 1, stage: "playoffs" },
//   { id: 39, text: "If perimeter of a square = 24, find side", choices: ["4", "5", "6", "8"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 40, text: "Area of rectangle 5×8?", choices: ["30", "35", "40", "45"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 41, text: "Simplify: (9² - 7²)", choices: ["28", "32", "36", "44"], correctIndex: 1, runs: 4, stage: "playoffs" },
//   { id: 42, text: "If 3x = 21, find x", choices: ["6", "7", "8", "9"], correctIndex: 1, runs: 2, stage: "playoffs" },
//   { id: 43, text: "Simplify: (2³ × 3²)", choices: ["72", "48", "64", "36"], correctIndex: 0, runs: 4, stage: "playoffs" },
//   { id: 44, text: "What is 13 × 8?", choices: ["102", "104", "106", "108"], correctIndex: 1, runs: 2, stage: "playoffs" },
//   { id: 45, text: "Find 15% of 240", choices: ["32", "34", "36", "38"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 46, text: "What is 7²?", choices: ["42", "45", "49", "52"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 47, text: "Simplify: 10 × 6 ÷ 3", choices: ["18", "20", "22", "24"], correctIndex: 1, runs: 2, stage: "playoffs" },
//   { id: 48, text: "If 4x = 36, find x", choices: ["7", "8", "9", "10"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 49, text: "What is 11 × 9?", choices: ["97", "99", "101", "103"], correctIndex: 1, runs: 2, stage: "playoffs" },
//   { id: 50, text: "Find the perimeter of square with side 9", choices: ["32", "34", "36", "38"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 51, text: "What is 5³?", choices: ["100", "115", "125", "135"], correctIndex: 2, runs: 4, stage: "playoffs" },
//   { id: 52, text: "Simplify: (4 + 6) × 2", choices: ["16", "18", "20", "22"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 53, text: "What is 144 ÷ 6?", choices: ["22", "23", "24", "25"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 54, text: "Find 25% of 160", choices: ["35", "38", "40", "42"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 55, text: "What is the LCM of 6 and 8?", choices: ["20", "22", "24", "26"], correctIndex: 2, runs: 4, stage: "playoffs" },
//   { id: 56, text: "Simplify: 18 - 9 + 7", choices: ["14", "15", "16", "17"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 57, text: "What is 17 × 5?", choices: ["80", "83", "85", "88"], correctIndex: 2, runs: 4, stage: "playoffs" },
//   { id: 58, text: "Find 2/5 of 50", choices: ["15", "18", "20", "22"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 59, text: "What is 9²?", choices: ["72", "79", "81", "85"], correctIndex: 2, runs: 2, stage: "playoffs" },
//   { id: 60, text: "Simplify: 100 ÷ 4 × 2", choices: ["45", "48", "50", "52"], correctIndex: 2, runs: 4, stage: "playoffs" },
  
//   // SEMIFINALS
//   { id: 61, text: "Find the mean of 3, 5, 7", choices: ["4", "5", "6", "7"], correctIndex: 1, runs: 2, stage: "semifinals" },
//   { id: 62, text: "What is 15% of 200?", choices: ["25", "30", "35", "40"], correctIndex: 1, runs: 2, stage: "semifinals" },
//   { id: 63, text: "If 8x = 64, x =", choices: ["6", "7", "8", "9"], correctIndex: 2, runs: 1, stage: "semifinals" },
//   { id: 64, text: "Simplify: (10² ÷ 5)", choices: ["10", "15", "20", "25"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 65, text: "What is 9 × 7?", choices: ["61", "63", "65", "67"], correctIndex: 1, runs: 2, stage: "semifinals" },
//   { id: 66, text: "What is 144 ÷ 12?", choices: ["10", "11", "12", "13"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 67, text: "What is 15 × 15?", choices: ["210", "225", "240", "250"], correctIndex: 1, runs: 4, stage: "semifinals" },
//   { id: 68, text: "Find 20% of 150", choices: ["25", "30", "35", "40"], correctIndex: 1, runs: 2, stage: "semifinals" },
//   { id: 69, text: "What is (3 + 4)²?", choices: ["49", "50", "48", "47"], correctIndex: 0, runs: 4, stage: "semifinals" },
//   { id: 70, text: "If 4x = 32, find x", choices: ["6", "7", "8", "9"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 71, text: "What is 11 × 11?", choices: ["119", "121", "123", "125"], correctIndex: 1, runs: 2, stage: "semifinals" },
//   { id: 72, text: "Simplify: 2⁴ + 3²", choices: ["23", "24", "25", "26"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 73, text: "Find 30% of 120", choices: ["33", "34", "35", "36"], correctIndex: 3, runs: 2, stage: "semifinals" },
//   { id: 74, text: "What is 18 × 6?", choices: ["104", "106", "108", "110"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 75, text: "Find the median of 4, 7, 9", choices: ["5", "6", "7", "8"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 76, text: "What is 12²?", choices: ["134", "140", "144", "148"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 77, text: "Simplify: 5⁴ ÷ 5²", choices: ["15", "20", "25", "30"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 78, text: "What is 16 × 8?", choices: ["124", "126", "128", "130"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 79, text: "Find 40% of 200", choices: ["70", "75", "80", "85"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 80, text: "What is √196?", choices: ["12", "13", "14", "15"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 81, text: "Simplify: (8² - 6²)", choices: ["24", "26", "28", "30"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 82, text: "What is 13²?", choices: ["159", "163", "169", "173"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 83, text: "Find the HCF of 24 and 36", choices: ["8", "10", "12", "14"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 84, text: "What is 25 × 4?", choices: ["95", "98", "100", "102"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 85, text: "Simplify: 3³ × 2", choices: ["48", "52", "54", "56"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 86, text: "What is 17 × 6?", choices: ["98", "100", "102", "104"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 87, text: "Find 35% of 140", choices: ["45", "47", "49", "51"], correctIndex: 2, runs: 2, stage: "semifinals" },
//   { id: 88, text: "What is the LCM of 12 and 15?", choices: ["50", "55", "60", "65"], correctIndex: 2, runs: 4, stage: "semifinals" },
//   { id: 89, text: "Simplify: (6 + 8) × (6 - 8)", choices: ["-28", "-24", "-20", "-16"], correctIndex: 0, runs: 4, stage: "semifinals" },
//   { id: 90, text: "What is 4³?", choices: ["56", "60", "64", "68"], correctIndex: 2, runs: 2, stage: "semifinals" },
  
//   // FINALS
//   { id: 91, text: "What is the LCM of 4 and 6?", choices: ["10", "12", "14", "16"], correctIndex: 1, runs: 2, stage: "finals" },
//   { id: 92, text: "What is 6³?", choices: ["206", "216", "226", "236"], correctIndex: 1, runs: 4, stage: "finals" },
//   { id: 93, text: "Convert 3/4 to decimal", choices: ["0.65", "0.70", "0.75", "0.80"], correctIndex: 2, runs: 1, stage: "finals" },
//   { id: 94, text: "What is 5 × 8?", choices: ["38", "40", "42", "44"], correctIndex: 1, runs: 2, stage: "finals" },
//   { id: 95, text: "Find 50% of 80", choices: ["35", "40", "45", "50"], correctIndex: 1, runs: 2, stage: "finals" },
//   { id: 96, text: "What is √144?", choices: ["10", "11", "12", "13"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 97, text: "Simplify: (5 + 3)(5 - 3)", choices: ["13", "15", "16", "18"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 98, text: "What is 14 × 7?", choices: ["96", "98", "100", "102"], correctIndex: 1, runs: 2, stage: "finals" },
//   { id: 99, text: "Find 1/3 of 99", choices: ["31", "32", "33", "34"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 100, text: "What is 3³ + 2²?", choices: ["29", "30", "31", "32"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 101, text: "Simplify: 16 ÷ 2 × 4", choices: ["30", "32", "34", "36"], correctIndex: 1, runs: 2, stage: "finals" },
//   { id: 102, text: "What is 13 × 9?", choices: ["115", "117", "119", "121"], correctIndex: 1, runs: 4, stage: "finals" },
//   { id: 103, text: "Find the HCF of 12 and 18", choices: ["4", "5", "6", "9"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 104, text: "What is 19 × 7?", choices: ["131", "133", "135", "137"], correctIndex: 1, runs: 4, stage: "finals" },
//   { id: 105, text: "Simplify: √225", choices: ["13", "14", "15", "16"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 106, text: "What is 7³?", choices: ["323", "333", "343", "353"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 107, text: "Find 60% of 150", choices: ["85", "88", "90", "92"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 108, text: "What is 14²?", choices: ["186", "192", "196", "200"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 109, text: "Simplify: (10³ ÷ 10)", choices: ["90", "95", "100", "105"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 110, text: "What is the LCM of 8 and 12?", choices: ["20", "22", "24", "26"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 111, text: "Find 3/8 of 64", choices: ["20", "22", "24", "26"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 112, text: "What is 15²?", choices: ["215", "220", "225", "230"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 113, text: "Simplify: (12 + 8) × (12 - 8)", choices: ["70", "75", "80", "85"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 114, text: "What is √256?", choices: ["14", "15", "16", "17"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 115, text: "Find the HCF of 48 and 64", choices: ["12", "14", "16", "18"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 116, text: "What is 21 × 6?", choices: ["122", "124", "126", "128"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 117, text: "Simplify: 5⁴ ÷ 5", choices: ["100", "115", "125", "135"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 118, text: "What is 18²?", choices: ["314", "320", "324", "330"], correctIndex: 2, runs: 4, stage: "finals" },
//   { id: 119, text: "Find 75% of 160", choices: ["115", "118", "120", "122"], correctIndex: 2, runs: 2, stage: "finals" },
//   { id: 120, text: "What is 8³?", choices: ["502", "508", "512", "518"], correctIndex: 2, runs: 4, stage: "finals" }
// ];
