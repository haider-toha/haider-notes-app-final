# N19 — fpl analyser

folder: projects
date: 22 july 2025
slug: fpl-analyser

===== PHYSICAL PAGE 184 =====

[ ] copied

[N19]

fpl analyser

an advanced fantasy premier league analytics platform combining
machine learning, monte carlo simulations and mathematical optimization
for data-driven fpl decisions.

live site ↗ • github ↗

the problem

fantasy premier league presents a multi-period stochastic optimization
problem. you have £100m to pick 15 players.
each gameweek, you field 11 and they earn
points based on real-life performance. traditional approaches rely
on intuition and basic statistics. i wanted to
take a quantitative approach and solve three fundamental
challenges:

traditional approach · fpl analyser approach
"this player looks good" · expected points model with 50+ features
pick players you like · ilp solver guarantees mathematical optimum
gut feel on transfers · multi-gameweek rolling horizon planning
hope for the best · probability distributions and confidence intervals

[CODE START]
flowchart LR

===== END PHYSICAL PAGE 184 =====
===== PHYSICAL PAGE 185 =====

[ ] copied

[N19 continued]

    subgraph PREDICTION["1. PREDICTION"]
        P1["How many points will each player score?"]
        P2["ML Models: xG, Form, Fixtures"]
    end
    subgraph OPTIMIZATION["2. OPTIMIZATION"]
        O1["Which 15 players maximize returns?"]
        O2["Integer LP, CBC Solver, <1 sec"]
    end
    subgraph RISK["3. RISK ASSESSMENT"]
        R1["What's the range of outcomes?"]
        R2["Monte Carlo, 10k sims, distributions"]
    end
    PREDICTION --> OPTIMIZATION --> RISK
[CODE END]

system architecture

[CODE START]
flowchart TB
    Frontend["Next.js App<br/>(Frontend)"]
    Backend["FastAPI<br/>(Backend)"]
    ML["ML Module<br/>Expected Points<br/>Bayesian Models<br/>Fixture Rating"]
    Optimizer["Optimizer<br/>Squad ILP<br/>Transfer Plan<br/>Captain Pick"]
    Simulator["Simulator<br/>Monte Carlo<br/>Distributions<br/>Risk Analysis"]

===== END PHYSICAL PAGE 185 =====
===== PHYSICAL PAGE 186 =====

[ ] copied

[N19 continued]

    DataLayer["Data Layer<br/>Async Fetching<br/>TTL Caching<br/>Rate Limiting"]
    FPLAPI["Official FPL API"]
 
    Frontend -->|REST API| Backend
    Backend --> ML
    Backend --> Optimizer
    Backend --> Simulator
    ML --> DataLayer
    Optimizer --> DataLayer
    Simulator --> DataLayer
    DataLayer --> FPLAPI
[CODE END]

data pipeline

the fpl api provides all player, team and
fixture data. the pipeline ingests raw json, normalises
types and foreign keys, calculates derived metrics via
ml models, caches with ttl-based expiration and serves
via json responses.

endpoint · data · update frequency · cache ttl
bootstrap-static · all players, teams, gws · daily · 15-30 min
element-summary/{id} · player history and fixtures · daily · 30 min

===== END PHYSICAL PAGE 186 =====
===== PHYSICAL PAGE 187 =====

[ ] copied

[N19 continued]

fixtures · match schedule and results · daily · 15 min
event/{gw}/live · live scores · every few min · 60 sec
entry/{id} · manager squad and history · on request · 5 min

caching uses request deduplication (concurrent requests coalesce), conditional
fetching with etags and tiered ttl (live data
= short, static data = long).

expected points model

[CODE START]
flowchart TB
    subgraph Features["INPUT FEATURES (~50-80)"]
        Form["FORM<br/>Points/5, Goals/5<br/>Assists/5, Minutes/5"]
        Stats["UNDERLYING STATS<br/>xG, xA, xGI<br/>Shots, Key passes"]
        Fixture["FIXTURE CONTEXT<br/>Home/Away, Opp str.<br/>Days rest, FDR"]
        Avail["AVAILABILITY<br/>Injury %, Minutes<br/>trend, News"]
    end
    
    subgraph Models["POSITION-SPECIFIC XGBOOST"]
        GKP["GKP<br/>Saves, Pen Save"]
        DEF["DEF<br/>CS, Tackles, BPS"]
        MID["MID<br/>Goals, Assists<br/>Chance creation"]
        FWD["FWD<br/>Goals, Assists"]

===== END PHYSICAL PAGE 187 =====
===== PHYSICAL PAGE 188 =====

[ ] copied

[N19 continued]

    end
    
    Calibration["CALIBRATION LAYER<br/>Platt scaling"]
    Output["Expected Points<br/>per Player per GW"]
    
    Features --> Models
    Models --> Calibration
    Calibration --> Output
[CODE END]

the model uses gradient boosting (xgboost) with 100-200
trees, max depth 4-6, l1/l2 regularization to prevent
overfitting and learning rate decay. cross-validation tunes hyperparameters.
separate models for each position capture position-specific patterns
(goalkeepers score via saves and clean sheets, forwards
via goals).

bayesian player modeling

early in the season, limited data means high
uncertainty. bayesian updating shrinks estimates toward position averages
(priors), then progressively trusts individual performance as more
gameweeks accumulate.

===== END PHYSICAL PAGE 188 =====
===== PHYSICAL PAGE 189 =====

[ ] copied

[N19 continued]

[CODE START]
flowchart LR
    Early["Early Season<br/>GW 1-5<br/>Wide Prior<br/>High uncertainty"]
    Mid["Mid-Season<br/>GW 10-20<br/>Narrower Posterior<br/>Moderate uncertainty"]
    Late["Late Season<br/>GW 30+<br/>Tight Posterior<br/>Low uncertainty"]
    
    Early -->|Bayesian Update| Mid
    Mid -->|Bayesian Update| Late
[CODE END]

hierarchical pooling: league average informs position priors, which
inform individual player estimates.

fixture difficulty rating

fdr combines attack difficulty (how hard to score
against this team) and defense difficulty (how likely
opponent will score). metrics include goals conceded/scored per
game, xG conceded/created, shot volume and quality, with
home/away splits.

multi-gameweek aggregation uses geometric mean with time discounting.
near fixtures weighted more heavily (gw+1 gets weight
1.0, gw+6 gets weight 0.75). this identifies favorable

===== END PHYSICAL PAGE 189 =====
===== PHYSICAL PAGE 190 =====

[ ] copied

[N19 continued]

fixture runs for transfer targeting.

integer linear programming

squad selection is formulated as an ilp. let
$x_i \in \{0,1\}$ indicate whether player $i$ is
selected:

\max \sum_{i=1}^{n} \mathbb{E}[\text{pts}_i] \cdot x_i

subject to:

\sum_{i=1}^{n} c_i \cdot x_i \leq 100 \quad \text{(budget)}

\sum_{i \in T_j} x_i \leq 3 \quad \forall j \quad \text{(max 3 per club)}

plus position constraints (2 gk, 5 def, 5
mid, 3 fwd). the solution space is astronomical:
C(700, 15) = 10^30+ possibilities. brute force is
impossible.

ilp constraints define a convex polytope. lp relaxation
+ branch and bound finds the mathematically optimal
solution in under 1 second. the pulp library

===== END PHYSICAL PAGE 190 =====
===== PHYSICAL PAGE 191 =====

[ ] copied

[N19 continued]

with cbc solver handles the full ~700 player
pool. unlike heuristics, ilp guarantees the best squad.

transfer planning (multi-period)

rolling horizon optimization plans transfers across 4-8 gameweeks.
the objective maximizes total points minus transfer costs
(4 points per extra transfer):

\max \sum_{gw} (\text{points}[gw] - 4 \times \text{extra\_transfers}[gw])

subject to squad validity each gameweek, transfer continuity
between gameweeks and free transfer accumulation (max 2).
output is an optimal transfer sequence: "gw 20:
hold (bank transfer), gw 21: salah → saka,
watkins → haaland (2 ft), gw 22: hold..."

monte carlo simulation

point predictions are uncertain. a player expected to
score 6 might score anywhere from 0 to
20. the simulation engine runs 10,000 gameweeks:

[CODE START]

===== END PHYSICAL PAGE 191 =====
===== PHYSICAL PAGE 192 =====

[ ] copied

[N19 continued]

FOR iteration = 1 to 10,000:
    For each player:
        sample points from player's distribution
    Apply captain multiplier (2x)
    Sum starting XI points
    Handle auto-substitutions
    Record: total_points[iteration]
 
AGGREGATE:
    • Mean (expected points)
    • Median
    • Standard deviation
    • 5th/95th percentiles (90% CI)
    • Full histogram
[CODE END]

why negative binomial distribution?

normal distribution · negative binomial (actual)
symmetric · right-skewed
allows negative points · non-negative
thin tails · heavy tails (hauls)

fpl points exhibit over-dispersion (variance exceeds mean) and

===== END PHYSICAL PAGE 192 =====
===== PHYSICAL PAGE 193 =====

[ ] copied

[N19 continued]

heavy right tails (occasional 15+ point hauls). negative
binomial captures this better than normal or poisson.

performance: naive python loops take ~30 seconds. numpy
vectorization completes 10,000 simulations in ~0.1 seconds (300x
speedup).

value over replacement (vor)

traditional view: "haaland: 8 pts/game, watkins: 5 pts/game,
haaland is 3 pts better."

vor view considers opportunity cost. bench fwd averages
3 pts. haaland vor: 8 - 3 =
5. watkins vor: 5 - 3 = 2.
per-million efficiency: haaland (14m) = 0.36 vor/m, watkins
(8m) = 0.25 vor/m. haaland is more efficient
despite the higher price.

core features

feature · ml model · optimizer · simulator · live data
player analysis · ✓ ·  ·  · ✓
squad optimizer · ✓ · ✓ ·  · 

===== END PHYSICAL PAGE 193 =====
===== PHYSICAL PAGE 194 =====

[ ] copied

[N19 continued]

transfer planner · ✓ · ✓ ·  · 
captain picker · ✓ ·  · ✓ · 
gameweek sim · ✓ ·  · ✓ · 
live tracking ·  ·  ·  · ✓
league analysis ·  ·  ·  · ✓
chip strategy · ✓ · ✓ · ✓ · 
vor rankings · ✓ ·  ·  · 
fixture analysis · ✓ ·  ·  · 

transfer predictions: fixture swing analysis identifies teams whose
fixtures are improving or worsening. transfer recommendations include
urgency levels (immediate, soon, plan ahead), expected point
gains and reasoning. rotation pairs find players who
complement each other's fixtures for smart bench rotation.

live gameweek: real-time scores, bonus point predictions from
bps standings, fixture status. polling every 60 seconds
during active matches.

chip strategy: when to use bench boost, triple
captain, free hit, wildcard based on fixture patterns
and double gameweeks.

===== END PHYSICAL PAGE 194 =====
===== PHYSICAL PAGE 195 =====

[ ] copied

[N19 continued]

performance

operation · target · typical · method
player list · < 200ms · ~100ms · cached data
player detail · < 200ms · ~150ms · cached + computed
squad optimization · < 1s · ~300ms · ilp solver
simulation (10k) · < 3s · ~1.5s · vectorized numpy
live scores · < 500ms · ~200ms · short-ttl cache

async event loop handles concurrent requests without blocking
on network i/o. cpu-bound work (optimization, simulation) uses
concurrency limiting to prevent overload.

results

consistently finished top 100k (out of ~10m players)
without spending hours on team selection. the edge
comes from discipline: the model doesn't get attached
to players or chase last week's haul. beat
my manual decisions in 75% of gameweeks.

stack: python 3.11, fastapi, pydantic, pulp + cbc,
xgboost, numpy, httpx, uvicorn | next.js 14, react
18, typescript, tailwindcss, tanstack query, recharts, radix ui

===== END PHYSICAL PAGE 195 =====
===== PHYSICAL PAGE 196 =====

[ ] copied

[N19 continued]

| render

===== END PHYSICAL PAGE 196 =====
