import { Note, Folder } from "./types";

// Folder structure - Apple Notes style
export const folders: Folder[] = [
  { id: "all", name: "All Notes", icon: "cloud" },
  { id: "profile", name: "Profile", icon: "folder" },
  { id: "blog", name: "Blog", icon: "blog" },
  { id: "projects", name: "Projects", icon: "folder" },
  { id: "finds", name: "Finds", icon: "bookmarks" },
  { id: "reflections", name: "Reflections", icon: "reflections" },
];

export const portfolioNotes: Note[] = [
  {
    id: "profile-about-me",
    slug: "about-me",
    title: "about me",
    category: "profile",
    folder: "profile",
    public: true,
    session_id: "",
    created_at: "2025-12-19T09:14:00.000Z",
    content: `haider toha
london, uk

[github](https://github.com/haider-toha) • [email](mailto:mohammedhaidertoha@gmail.com) • [linkedin](https://linkedin.com/in/haidertoha)

founding engineer at sammy labs (yc w25). i write code across the stack, from typescript on the frontend to python on the backend with postgres underneath. most of my time goes into building features end-to-end, designing the interface, writing the api, optimising the queries and making sure it holds up in production.

my background is aeronautics (imperial college). designing systems that can't afford to fail taught me to think about failure modes first, asking what breaks, when and how you recover gracefully. i’ve since worked at goldman sachs (scale, process, reliability) and built my own ventures from zero (speed, scrappiness, shipping daily). both shaped how i write code.

i spend about a third of my time with customers, on calls, debugging their issues live, understanding what's actually blocking them vs what they say is blocking them. the best features i've shipped came from watching someone struggle with the product.

what i care about is clean abstractions, fast feedback loops and code that's easy to delete. i'd rather ship something small that works than something ambitious that doesn't.

outside of work i'm usually at the gym, playing cricket or on late-night walks through hyde park when i need to think. i coach my local kids football team, which is the most grounding thing i do each week. recently started gliding and working towards my pilot’s licence.

i read too much. mostly history, philosophy and whatever rabbit hole has me that week.`,
  },
  {
    id: "profile-now",
    slug: "now",
    title: "current focus",
    category: "profile",
    folder: "profile",
    public: true,
    session_id: "",
    created_at: "2025-12-18T16:42:00.000Z",
    content: `**queueing theory**
there's real math under backend performance, things like little's law, m/m/c models and the way rising utilisation feeds tail latency. most engineers still size their connection pools and set timeouts by feel even though the right numbers are completely computable. once you actually compute them it becomes clear that wait time climbs fast as soon as a pool pushes past ~70% utilisation, which is where a lot of the "random" incidents you run into really come from. it's an old field that has barely been touched in web infra.

**deterministic simulation testing**
this is the approach foundationdb pioneered and that antithesis, warpstream and tigerbeetle have been productionising, where you write your code against an abstract clock and network and then run it inside a simulator that owns time, packet order, disk faults and process restarts. because everything runs off a single seed, one run replays the same billion years of synthetic chaos deterministically, so the consistency bugs that would normally take months to surface in production tend to fall out within minutes. still working out how much of this you can retrofit onto an existing codebase and how much of it has to be there from the start.

**durable execution**
the temporal, restate, dbos paradigm lets you write business logic as plain code while the runtime gives you crash-safe, resumable workflows underneath, with the event sourcing handled for you and kept invisible at the point where you actually call it. it's a good fit for anything stateful that reaches across external apis like payments, onboarding or integrations, where a failure halfway through is expensive and retrying is ambiguous because you can't always tell what already ran. the usual worry of what happens if the server dies mid-function stops being something you have to design around, since the runtime tracks progress and resumes from wherever it left off. it reads like boring infrastructure and in practice it ends up mattering far more than it looks.

**multi-armed bandits**
bandits are about moving past fixed-split a/b testing into adaptive allocation, where instead of cutting traffic 50/50 and waiting the way a classic experiment does, algorithms like thompson sampling and ucb keep shifting exposure toward the better variants as results come in and balance exploration against exploitation the whole time. that makes them genuinely useful when your sample sizes are small or your feedback loops are fast. what interests me is the engineering as much as the statistics, in particular how you run bandits across a whole product surface while attributing outcomes honestly and not overfitting to noise.`,
  },
  {
    id: "profile-toolbox",
    slug: "toolbox",
    title: "stack & gear",
    category: "profile",
    folder: "profile",
    public: true,
    session_id: "",
    created_at: "2025-12-17T21:33:00.000Z",
    content: `**languages**
**typescript:** fastest path from idea → interface → shipped feature.
**python:** models, data, experiments and glue code.
**go:** currently teaching myself. drawn to the simplicity and predictability.

**core stack**
**frontend:** react/next.js, tailwind.
**backend:** fastapi (python), chi (go), trpc.
**data:** postgresql (w/ pgvector), redis.
**infra:** docker, terraform, aws ecs/lambda.

**hardware**
**machine:** macbook pro 16" (m4 max, 48gb).
**input:** hhkb hybrid type-s (topre switches), mx master 3s.
**audio:** sony wh-1000xm4 and airpods max (for deep work).`,
  },
  {
    id: "profile-operating-manual",
    slug: "operating-manual",
    title: "operating principles",
    category: "profile",
    folder: "profile",
    public: true,
    session_id: "",
    created_at: "2025-12-16T11:07:00.000Z",
    content: `**users before opinions**
i’ll trade a clever architecture for a workflow that actually unblocks the user.

**document the 'why'**
code tells you *what*. decisions tell you *why*. i write adrs for one-way doors so future-me isn’t guessing.

**optimise for reversibility**
speed comes from confidence. i build systems where deploys are boring and rollbacks are instant. one-way door = slow down. two-way door = move now.

**make it observable**
if it can’t be debugged quickly, it isn’t done. clear failure modes, good logs and metrics are part of the feature.

**strong opinions, loosely held**
i’ll argue for a decision with the data i have. better data wins immediately.`,
  },
  {
    id: "experience-all",
    slug: "experience",
    title: "experience",
    category: "experience",
    folder: "profile",
    public: true,
    session_id: "",
    created_at: "2025-12-15T14:51:00.000Z",
    content: `**founding engineer · sammy labs (yc w25)** · london · nov 2025-present  
own full stack features from react frontend to python backend to postgres. spend about a third of my time on customer calls, debugging issues live and translating pain points into features. i like to move fast and ship daily.

**analyst · goldman sachs** · london · jul 2025-nov 2025  
worked on cloud security and internal tooling for the tech risk & cybersec team. short stint before joining sammy at the seed stage.

**intern · goldman sachs** · birmingham · summer 2024  
built nlp and semantic search tooling that reduced time-to-answer for research analysts. first exposure to building production systems at scale.

**founder · provost academics** · london · may 2024-present  
built an ai tutoring product from scratch and grew it to 50+ paying customers. handled everything from product design to infrastructure to customer support. still running on the side.`,
  },
  {
    id: "project-self-engineering-agent",
    slug: "self-engineering-agent",
    title: "self-engineering agent",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-09-18T20:41:00.000Z",
    content: `an autonomous ai system that creates its own tools on demand. rather than relying on pre-built tool libraries that developers must manually create and maintain, this system enables ai agents to synthesize new tools automatically when needed using test-driven development methodology.

[github](https://github.com/haider-toha/Self-Engineering-Agent-Framework) • [demo](https://youtu.be/7Uh1ukl5Vj8)

---

**the problem: static tool libraries**

every major ai agent framework (langchain, llamaindex, autogen, crewai) shares a fundamental limitation: they depend on static tool libraries. when a user needs functionality that doesn't exist, development stops until a human developer manually creates the new tool.

\`\`\`mermaid
flowchart LR
    subgraph Traditional["Traditional Workflow"]
        A[User Request] --> B{Tool Exists?}
        B -->|Yes| C[Execute Tool]
        B -->|No| D[Fail / Error]
        D --> E[Notify Developer]
        E --> F[Manual Development]
        F --> G[Write Tests]
        G --> H[Debug & Deploy]
    end
\`\`\`

this process typically takes hours to days per new capability. for organisations needing dozens of specialised tools, this becomes unsustainable.
 
---

**the solution: self-engineering agents**

when the agent encounters a request it cannot fulfill with existing tools, it automatically synthesizes a complete solution: specification, test suite, implementation, security verification and registration.

\`\`\`mermaid
flowchart LR
    subgraph SelfEng["Self-Engineering Workflow"]
        A[User Request] --> B{Tool Exists?}
        B -->|Yes| C[Execute Tool]
        B -->|No| D[Auto-Synthesize]
        D --> E[Generate Spec]
        E --> F[Create Tests]
        F --> G[Implement Code]
        G --> H[Verify in Sandbox]
        H --> I[Register Tool]
        I --> C
    end
\`\`\`

the framework uses test-driven development for a critical reason: tests serve as unambiguous specifications. by generating tests before implementation, the system ensures clear requirements, automatic verification, edge case coverage and quality assurance.

---

**system architecture**

\`\`\`mermaid
flowchart TB
    subgraph UI["User Interface Layer"]
        WEB[Web Interface]
        WS[WebSocket Handler]
    end
    
    subgraph ORCH["Orchestration Layer"]
        AO[Agent Orchestrator]
        SM[Session Manager]
    end
    
    subgraph INTEL["Intelligence Layer"]
        QP[Query Planner]
        SS[Semantic Search]
        MM[Memory Manager]
        RE[Reflection Engine]
    end
    
    subgraph SYNTH["Synthesis Layer"]
        SG[Spec Generator]
        TG[Test Generator]
        IG[Implementation Generator]
        SB[Sandbox Verifier]
    end
    
    subgraph DATA["Data Layer"]
        VDB[(Vector Database)]
        TR[(Tool Registry)]
    end
    
    UI <--> ORCH
    ORCH <--> INTEL
    ORCH <--> SYNTH
    INTEL <--> DATA
    SYNTH <--> DATA
\`\`\`

**orchestration layer:** the agent orchestrator serves as the central brain, coordinating all subsystems. it receives user requests, manages session context, routes to appropriate handlers, tracks workflow execution and synthesizes final responses.

**intelligence layer:** query planner analyzes requests to determine complexity and optimal execution strategy. semantic search finds conceptually similar tools using vector embeddings. memory manager maintains conversational context. reflection engine analyzes failures and generates automatic fixes.

**synthesis layer:** specification generator transforms natural language into formal function specifications. test generator creates comprehensive pytest test suites. implementation generator writes production code to satisfy all tests. sandbox verifier executes tests in isolated docker containers.

---

**the synthesis pipeline**

\`\`\`mermaid
flowchart TB
    subgraph Pipeline["TDD Synthesis Pipeline"]
        NL[Natural Language] --> SPEC[Specification]
        SPEC --> SIG[Function Signature]
        SPEC --> PARAMS[Typed Parameters]
        
        SIG --> HP[Happy Path Tests]
        PARAMS --> EC[Edge Case Tests]
        HP --> SUITE[Test Suite]
        EC --> SUITE
        
        SUITE --> IMPL[Generate Code]
        IMPL --> SANDBOX[Docker Sandbox]
        SANDBOX --> PYTEST[Run pytest]
        
        PYTEST --> RESULT{All Pass?}
        RESULT -->|Yes| REG[Register Tool]
        RESULT -->|No| RETRY[Analyze & Retry]
        RETRY --> IMPL
    end
\`\`\`

**stage 1 - specification:** transforms natural language into formal function specification including function name, typed parameter definitions, return type and comprehensive docstring.

**stage 2 - test generation:** creates pytest tests before implementation covering normal operation with typical inputs, edge cases with boundary values, error conditions with invalid inputs and data quality issues.

**stage 3 - implementation:** produces python functions with proper type hints, handles all edge cases identified in tests, provides meaningful error messages and follows production coding standards.

**stage 4 - sandbox verification:** fresh docker container created, implementation and tests copied in, pytest executes with timeout limit, results captured, container destroyed regardless of outcome.

**stage 5 - registration:** generate semantic embedding of docstring, save implementation to tools directory, insert metadata into database with embedding, tool immediately available for future requests.

---

**security architecture**

ai-generated code presents unique security challenges. the framework implements defense in depth:

\`\`\`mermaid
flowchart TB
    subgraph Defenses["Defense Layers"]
        L1["Container Isolation<br/>Fresh per execution, destroyed after"]
        L2["Network Isolation<br/>Disabled, no DNS, no ports"]
        L3["Resource Limits<br/>50% CPU, 256MB RAM, 30s timeout"]
        L4["Filesystem Protection<br/>Read-only mounts, only /tmp writable"]
        L5["Privilege Restriction<br/>Non-root, no sudo, minimal capabilities"]
    end
    
    L1 --> L2 --> L3 --> L4 --> L5 --> SAFE[Safe Execution]
\`\`\`

**container isolation:** every tool execution runs in a docker container completely separate from the host. containers use minimal python image with only essential dependencies. container destruction after each run prevents state persistence.

**network isolation:** containers created with network disabled entirely. no dns resolution, no outbound connections, no listening ports. prevents data exfiltration and external communication.

**resource limits:** cpu quota limits to 50% of single core, memory limit of 256mb prevents memory bombs, 30-second timeout catches infinite loops, process limits prevent fork bombs.

---

**semantic intelligence**

\`\`\`mermaid
flowchart TB
    subgraph Search["Semantic Tool Discovery"]
        TOOL[Tool Docstring] --> EMB_T[Embedding Model]
        QUERY[User Query] --> EMB_Q[Embedding Model]
        EMB_T --> VEC_T[Vector]
        EMB_Q --> VEC_Q[Vector]
        
        VEC_T --> STORE[(pgvector)]
        VEC_Q --> COSINE[Cosine Similarity]
        STORE --> COSINE
        COSINE --> RANK[Ranking]
    end
    
    RANK --> DECISION{Score > 80%?}
    DECISION -->|Yes| EXEC[Execute Tool]
    DECISION -->|65-80%| VERIFY[Verify Compatibility]
    DECISION -->|Below 65%| SYNTH[Trigger Synthesis]
\`\`\`

traditional tool discovery relies on exact keyword matching. "analyze csv" finds tools with "csv" in the name, but "examine spreadsheet" finds nothing despite identical intent.

the semantic system converts text into 1536-dimensional vectors using openai embeddings that capture meaning. cosine similarity measures conceptual relatedness. multi-factor re-ranking combines semantic similarity (70%), historical success rate (20%) and usage frequency (10%).

---

**self-learning mechanisms**

\`\`\`mermaid
flowchart TB
    subgraph Learning["Learning Loop"]
        EXEC[Tool Execution] --> LOG[Log Invocation]
        LOG --> METRICS[Update Metrics]
        METRICS --> SEQ[Sequence Detection]
        
        SEQ --> DETECT{Recurring Pattern?}
        DETECT -->|Yes| RECORD[Record Pattern]
        RECORD --> CONF[Confidence Scoring]
        
        CONF --> EVAL{Promotion Criteria Met?}
        EVAL -->|Yes| COMPOSITE[Generate Composite Tool]
        COMPOSITE --> REG[Register New Tool]
    end
\`\`\`

**workflow pattern recognition:** when tools are used in consistent sequences (a followed by b followed by c), patterns are recorded. patterns gain confidence through repetition.

**composite tool promotion:** frequently-used patterns meeting promotion criteria (minimum frequency, high success rate) become candidates for composite tool generation. the synthesis engine creates a single tool encapsulating the multi-tool workflow.

**reflection engine:** when tools fail in production, the engine analyzes error messages and execution context to identify root causes, produces corrected implementations, tests fixes in sandbox before applying, maintains version history for rollback.

---

**conversational memory**

practical workflows require remembering context. without memory, "now filter that data" fails because the system doesn't know what "that data" refers to. with memory, users can reference previous results, build on earlier computations and develop multi-step analyses conversationally.

**session management:** each conversation tracked as a session with unique identifier. sessions group related messages and persist across browser refreshes.

**data reference tracking:** pattern recognition identifies dataframes, lists or results mentioned in responses. reference resolution maps "use that data" to the correct data object. availability verification confirms data is accessible in current session.

**context window management:** sliding window includes most recent messages. relevance filtering selects semantically relevant historical messages. summarization condenses older context to preserve key information while reducing tokens.

---

**what i learned**

- llms are surprisingly good at writing focused, single-purpose functions
- the hard part is the test harness, not the generation
- docker overhead (~2 seconds) is acceptable for the isolation guarantee
- tool descriptions matter more than implementations for retrieval
- tdd works even better for ai than for humans because tests provide unambiguous success criteria

---

**stack:** python 3.10+, flask, flask-socketio, openai api (gpt-4, text-embedding-3-small), supabase (postgresql + pgvector), docker sdk`,
  },
  {
    id: "project-navier-stokes",
    slug: "parallel-navier-stokes",
    title: "parallel navier-stokes solver",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-08-15T14:22:00.000Z",
    content: `a high-performance c++ solver for 2d incompressible fluid dynamics. built during my aeronautics degree when i wanted to understand both the physics and the computational techniques at a low level.

**the problem**
simulating fluid flow is computationally expensive. the navier-stokes equations describe how velocity fields evolve:

$$\\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla)\\mathbf{u} = -\\frac{1}{\\rho}\\nabla p + \\nu \\nabla^2 \\mathbf{u} + \\mathbf{f}$$

$$\\nabla \\cdot \\mathbf{u} = 0$$

where $\\mathbf{u}$ is velocity, $p$ is pressure, $\\rho$ is density, $\\nu$ is kinematic viscosity and $\\mathbf{f}$ represents external forces. solving them at high resolution requires millions of calculations per timestep. sequential code hits a wall fast.

**approach**
i implemented a pressure-projection method:
1. advect velocity field (move fluid)
2. apply external forces (gravity, etc.)
3. solve pressure poisson equation (enforce incompressibility)
4. project velocity to be divergence-free

the expensive part is step 3, solving the pressure poisson equation:

$$\\nabla^2 p = \\frac{\\rho}{\\Delta t} \\nabla \\cdot \\mathbf{u}^*$$

i used a jacobi iterative solver where each cell update only depends on its neighbours:

$$p_{i,j}^{n+1} = \\frac{1}{4}(p_{i+1,j}^n + p_{i-1,j}^n + p_{i,j+1}^n + p_{i,j-1}^n - \\Delta x^2 b_{i,j})$$

this is embarrassingly parallel since each cell can be updated independently.

**parallelisation strategy**
- **mpi for distributed memory:** split the grid across nodes. each node owns a horizontal slice. ghost cell exchanges happen at boundaries
- **openmp for shared memory:** within each node, parallelise the inner loops with pragma directives. cache-aware iteration order (row-major) reduced l1/l2 misses by ~40%
- **hybrid approach:** mpi between nodes, openmp within nodes. this matched the cluster architecture (16 cores per node, 8 nodes)

**optimisations**
- aligned memory allocation for simd vectorisation
- loop tiling to improve cache locality
- asynchronous mpi communication overlapped with computation
- red-black gauss-seidel for faster convergence (2x fewer iterations than jacobi)

**results**
- achieved near-linear speedup up to 64 cores, with parallel efficiency $E = S/P \\approx 0.88$ where $S$ is speedup and $P$ is processor count
- 512x512 grid at 1000 timesteps: 45 minutes sequential → 48 seconds parallel ($S \\approx 56\\times$)
- learned more about memory hierarchies than any textbook could teach

**stack:** c++, mpi, openmp, hpc cluster, vtk for visualisation

the code is messy (academic code always is), but the experience shaped how i think about performance-critical systems.`,
  },
  {
    id: "project-fpl-moneyball",
    slug: "fpl-analyser",
    title: "fpl analyser",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-07-22T09:15:00.000Z",
    content: `an advanced fantasy premier league analytics platform combining machine learning, monte carlo simulations and mathematical optimization for data-driven fpl decisions.

[live site](https://fpl-analyser-frontend.onrender.com/) • [github](https://github.com/haider-toha/fpl-analyser)

---

**the problem**

fantasy premier league presents a multi-period stochastic optimization problem. you have £100m to pick 15 players. each gameweek, you field 11 and they earn points based on real-life performance. traditional approaches rely on intuition and basic statistics. i wanted to take a quantitative approach and solve three fundamental challenges:

| traditional approach | fpl analyser approach |
|---------------------|----------------------|
| "this player looks good" | expected points model with 50+ features |
| pick players you like | ilp solver guarantees mathematical optimum |
| gut feel on transfers | multi-gameweek rolling horizon planning |
| hope for the best | probability distributions and confidence intervals |

\`\`\`mermaid
flowchart LR
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
\`\`\`

---

**system architecture**

\`\`\`mermaid
flowchart TB
    Frontend["Next.js App<br/>(Frontend)"]
    Backend["FastAPI<br/>(Backend)"]
    ML["ML Module<br/>Expected Points<br/>Bayesian Models<br/>Fixture Rating"]
    Optimizer["Optimizer<br/>Squad ILP<br/>Transfer Plan<br/>Captain Pick"]
    Simulator["Simulator<br/>Monte Carlo<br/>Distributions<br/>Risk Analysis"]
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
\`\`\`

---

**data pipeline**

the fpl api provides all player, team and fixture data. the pipeline ingests raw json, normalises types and foreign keys, calculates derived metrics via ml models, caches with ttl-based expiration and serves via json responses.

| endpoint | data | update frequency | cache ttl |
|----------|------|------------------|-----------|
| bootstrap-static | all players, teams, gws | daily | 15-30 min |
| element-summary/{id} | player history and fixtures | daily | 30 min |
| fixtures | match schedule and results | daily | 15 min |
| event/{gw}/live | live scores | every few min | 60 sec |
| entry/{id} | manager squad and history | on request | 5 min |

caching uses request deduplication (concurrent requests coalesce), conditional fetching with etags and tiered ttl (live data = short, static data = long).

---

**expected points model**

\`\`\`mermaid
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
    end
    
    Calibration["CALIBRATION LAYER<br/>Platt scaling"]
    Output["Expected Points<br/>per Player per GW"]
    
    Features --> Models
    Models --> Calibration
    Calibration --> Output
\`\`\`

the model uses gradient boosting (xgboost) with 100-200 trees, max depth 4-6, l1/l2 regularization to prevent overfitting and learning rate decay. cross-validation tunes hyperparameters. separate models for each position capture position-specific patterns (goalkeepers score via saves and clean sheets, forwards via goals).

---

**bayesian player modeling**

early in the season, limited data means high uncertainty. bayesian updating shrinks estimates toward position averages (priors), then progressively trusts individual performance as more gameweeks accumulate.

\`\`\`mermaid
flowchart LR
    Early["Early Season<br/>GW 1-5<br/>Wide Prior<br/>High uncertainty"]
    Mid["Mid-Season<br/>GW 10-20<br/>Narrower Posterior<br/>Moderate uncertainty"]
    Late["Late Season<br/>GW 30+<br/>Tight Posterior<br/>Low uncertainty"]
    
    Early -->|Bayesian Update| Mid
    Mid -->|Bayesian Update| Late
\`\`\`

hierarchical pooling: league average informs position priors, which inform individual player estimates.

---

**fixture difficulty rating**

fdr combines attack difficulty (how hard to score against this team) and defense difficulty (how likely opponent will score). metrics include goals conceded/scored per game, xG conceded/created, shot volume and quality, with home/away splits.

multi-gameweek aggregation uses geometric mean with time discounting. near fixtures weighted more heavily (gw+1 gets weight 1.0, gw+6 gets weight 0.75). this identifies favorable fixture runs for transfer targeting.

---

**integer linear programming**

squad selection is formulated as an ilp. let $x_i \\in \\{0,1\\}$ indicate whether player $i$ is selected:

$$\\max \\sum_{i=1}^{n} \\mathbb{E}[\\text{pts}_i] \\cdot x_i$$

subject to:

$$\\sum_{i=1}^{n} c_i \\cdot x_i \\leq 100 \\quad \\text{(budget)}$$

$$\\sum_{i \\in T_j} x_i \\leq 3 \\quad \\forall j \\quad \\text{(max 3 per club)}$$

plus position constraints (2 gk, 5 def, 5 mid, 3 fwd). the solution space is astronomical: C(700, 15) = 10^30+ possibilities. brute force is impossible.

ilp constraints define a convex polytope. lp relaxation + branch and bound finds the mathematically optimal solution in under 1 second. the pulp library with cbc solver handles the full ~700 player pool. unlike heuristics, ilp guarantees the best squad.

---

**transfer planning (multi-period)**

rolling horizon optimization plans transfers across 4-8 gameweeks. the objective maximizes total points minus transfer costs (4 points per extra transfer):

$$\\max \\sum_{gw} (\\text{points}[gw] - 4 \\times \\text{extra\\_transfers}[gw])$$

subject to squad validity each gameweek, transfer continuity between gameweeks and free transfer accumulation (max 2). output is an optimal transfer sequence: "gw 20: hold (bank transfer), gw 21: salah → saka, watkins → haaland (2 ft), gw 22: hold..."

---

**monte carlo simulation**

point predictions are uncertain. a player expected to score 6 might score anywhere from 0 to 20. the simulation engine runs 10,000 gameweeks:

\`\`\`
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
\`\`\`

**why negative binomial distribution?**

| normal distribution | negative binomial (actual) |
|--------------------|-----------------------------|
| symmetric | right-skewed |
| allows negative points | non-negative |
| thin tails | heavy tails (hauls) |

fpl points exhibit over-dispersion (variance exceeds mean) and heavy right tails (occasional 15+ point hauls). negative binomial captures this better than normal or poisson.

**performance:** naive python loops take ~30 seconds. numpy vectorization completes 10,000 simulations in ~0.1 seconds (300x speedup).

---

**value over replacement (vor)**

traditional view: "haaland: 8 pts/game, watkins: 5 pts/game, haaland is 3 pts better."

vor view considers opportunity cost. bench fwd averages 3 pts. haaland vor: 8 - 3 = 5. watkins vor: 5 - 3 = 2. per-million efficiency: haaland (14m) = 0.36 vor/m, watkins (8m) = 0.25 vor/m. haaland is more efficient despite the higher price.

---

**core features**

| feature | ml model | optimizer | simulator | live data |
|---------|:--------:|:---------:|:---------:|:---------:|
| player analysis | ✓ | | | ✓ |
| squad optimizer | ✓ | ✓ | | |
| transfer planner | ✓ | ✓ | | |
| captain picker | ✓ | | ✓ | |
| gameweek sim | ✓ | | ✓ | |
| live tracking | | | | ✓ |
| league analysis | | | | ✓ |
| chip strategy | ✓ | ✓ | ✓ | |
| vor rankings | ✓ | | | |
| fixture analysis | ✓ | | | |

**transfer predictions:** fixture swing analysis identifies teams whose fixtures are improving or worsening. transfer recommendations include urgency levels (immediate, soon, plan ahead), expected point gains and reasoning. rotation pairs find players who complement each other's fixtures for smart bench rotation.

**live gameweek:** real-time scores, bonus point predictions from bps standings, fixture status. polling every 60 seconds during active matches.

**chip strategy:** when to use bench boost, triple captain, free hit, wildcard based on fixture patterns and double gameweeks.

---

**performance**

| operation | target | typical | method |
|-----------|--------|---------|--------|
| player list | < 200ms | ~100ms | cached data |
| player detail | < 200ms | ~150ms | cached + computed |
| squad optimization | < 1s | ~300ms | ilp solver |
| simulation (10k) | < 3s | ~1.5s | vectorized numpy |
| live scores | < 500ms | ~200ms | short-ttl cache |

async event loop handles concurrent requests without blocking on network i/o. cpu-bound work (optimization, simulation) uses concurrency limiting to prevent overload.

---

**results**

consistently finished top 100k (out of ~10m players) without spending hours on team selection. the edge comes from discipline: the model doesn't get attached to players or chase last week's haul. beat my manual decisions in 75% of gameweeks.

---

**stack:** python 3.11, fastapi, pydantic, pulp + cbc, xgboost, numpy, httpx, uvicorn | next.js 14, react 18, typescript, tailwindcss, tanstack query, recharts, radix ui | render`,
  },
  {
    id: "project-sentiment-engine",
    slug: "global-sentiment-engine",
    title: "global sentiment engine",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-06-10T16:30:00.000Z",
    content: `a real-time nlp pipeline that ingests multilingual news and social content from 150+ countries, performs gpu-accelerated transformer-based sentiment analysis, aggregates results by country and time and visualises global emotional state on an interactive webgl 3d globe.

[github](https://github.com/haider-toha/sentiment-engine) • [live site](https://sentiment-engine-frontend.onrender.com/)

---

**system architecture**

\`\`\`mermaid
flowchart TB
    subgraph Collection["DATA COLLECTION LAYER"]
        RSS["RSS<br/>300+ feeds"]
        Reddit["Reddit<br/>PRAW"]
        Mastodon["Mastodon<br/>API"]
        HN["Hacker News"]
        Bluesky["Bluesky<br/>AT Proto"]
        Lemmy["Lemmy<br/>API"]
        Normaliser["Article Normaliser<br/>Dedup, Country Detect"]
        
        RSS --> Normaliser
        Reddit --> Normaliser
        Mastodon --> Normaliser
        HN --> Normaliser
        Bluesky --> Normaliser
        Lemmy --> Normaliser
    end
    
    subgraph Processing["PROCESSING LAYER"]
        Cleaner["Text Cleaner<br/>URL, HTML, whitespace"]
        Model["XLM-RoBERTa<br/>278M params, CUDA/CPU"]
        LabelNorm["Label Normaliser<br/>-1.0 to +1.0 scale"]
        Aggregation["Aggregation Engine<br/>Hourly rollups<br/>Weighted averaging<br/>Top articles"]
        
        Cleaner --> Model --> LabelNorm --> Aggregation
    end
    
    subgraph Storage["STORAGE LAYER"]
        DB["SQLite / PostgreSQL<br/>articles + country_sentiment<br/>30-day retention"]
    end
    
    subgraph API["API LAYER"]
        FastAPI["FastAPI async<br/>/sentiment/global<br/>/sentiment/country<br/>/headlines, /trends"]
    end
    
    subgraph Presentation["PRESENTATION LAYER"]
        Frontend["Next.js 14 + React Three Fiber<br/>3D Globe, Country Panel<br/>Headlines, Stats Bar"]
    end
    
    Normaliser --> Cleaner
    Aggregation --> DB
    DB --> FastAPI
    FastAPI --> Frontend
\`\`\`

---

**data collection**

the pipeline ingests from 300+ rss feeds and multiple social platforms. all collectors implement a common interface ensuring consistent data normalization with source type, source name, title, url (used for deduplication), content, country code and publication timestamp.

*rss feed coverage:*

- **wire services (4):** reuters, ap, afp, euronews
- **north america (17):** npr, pbs, nbc, cbs, abc, usa today, washington post, cbc, ctv, toronto star, national post, milenio, el universal mx...
- **europe western (45):** bbc, guardian, sky, telegraph, france 24, le monde, deutsche welle, der spiegel, ansa, la repubblica, el pais, nos, rtbf, swi, orf, rte...
- **europe nordic (18):** svt, aftonbladet, nrk, vg, dr, tv2 dk, yle, helsinki times, iceland monitor...
- **europe eastern (30):** tvn24, gazeta wyborcza, hungary today, romania insider, ekathimerini, kyiv independent, moscow times, n1 serbia/croatia/bosnia...
- **asia (65):** nhk, japan times, yonhap, cgtn, scmp, cna, straits times, jakarta post, bangkok post, times of india, ndtv, dawn...
- **middle east & africa (55):** al jazeera, arab news, haaretz, jerusalem post, gulf news, daily sabah, news24 sa, punch nigeria...
- **americas (40):** folha, clarin, el mercurio, el tiempo, jamaica observer...
- **oceania (15):** abc australia, nz herald, fiji times, rnz pacific...

*country detection pipeline:*

\`\`\`mermaid
flowchart TB
    Input["Article Text"]
    SourceAttr["Source-Based Attribution<br/>If source has known country → assign directly"]
    TextDetect["Text-Based Detection<br/>1. Extract country mentions<br/>2. Match 200+ variations:<br/>Official names, Common names<br/>Demonyms, Major cities, Local names<br/>3. Return most mentioned"]
    Output["Country Code"]
    
    Input --> SourceAttr
    SourceAttr -->|Match found| Output
    SourceAttr -->|No match| TextDetect
    TextDetect --> Output
\`\`\`

---

**sentiment analysis pipeline**

*text preprocessing:*
- remove urls (https?://\\S+)
- strip html tags
- remove hashtags/mentions
- normalise whitespace
- preserve unicode (multilingual support)
- truncate to 512 tokens (model max context)

*supported models:*

| model | parameters | languages | use case |
|-------|------------|-----------|----------|
| cardiffnlp/twitter-xlm-roberta-base-sentiment | 278m | 100+ | default, multilingual news |
| cardiffnlp/twitter-roberta-base-sentiment-latest | 125m | english | high-accuracy english |
| nlptown/bert-base-multilingual-uncased-sentiment | 110m | 6 | nuanced 1-5 star rating |
| prosusai/finbert | 110m | english | financial news |
| siebert/sentiment-roberta-large-english | 355m | english | maximum accuracy |

the inference pipeline runs through huggingface with cuda acceleration when available. model outputs are normalised to a -1.0 to +1.0 scale regardless of the underlying label format. "LABEL_0" with 0.85 confidence becomes score: -0.85, label: "negative". "5 stars" with 0.91 confidence becomes score: +0.91, label: "positive".

*batch processing:*

single inference is inefficient. the system batches articles for gpu parallelization. articles are grouped into batches of 32, filtered for minimum length (10 chars), padded to max length in batch and processed in a single forward pass. results are mapped back to original articles.

---

**aggregation and weighting**

not all sources are equal. credibility weights:

| source type | weight | rationale |
|-------------|--------|-----------|
| rss | 1.0 | established news outlets |
| scraper | 0.9 | direct news site extraction |
| hacker news | 0.8 | curated tech community |
| reddit | 0.6 | mixed user-generated content |
| mastodon | 0.5 | social media, lower signal |

weighted sentiment calculation:

$$\\text{Weighted Average} = \\frac{\\sum (\\text{sentiment\\_score} \\times \\text{source\\_weight})}{\\sum \\text{source\\_weight}}$$

hourly aggregates track country code, hour, simple mean, weighted mean, article count and foreign keys to the top positive/negative articles for that period.

---

**globe visualization**

the frontend uses react three fiber for declarative threejs. the globe component includes an earth sphere with texture, country markers positioned by sentiment and orbitcontrols for user interaction.

*lat/long to 3d position:*

$$\\phi = (90 - \\text{lat}) \\times (\\pi/180)$$
$$\\theta = (\\text{lon} + 180) \\times (\\pi/180)$$
$$x = -r \\sin(\\phi) \\cos(\\theta), \\quad y = r \\cos(\\phi), \\quad z = r \\sin(\\phi) \\sin(\\theta)$$

*sentiment to color:*

| score range | color |
|-------------|-------|
| < -0.3 | #ef4444 (red) |
| -0.3 to 0.0 | interpolate red → amber |
| 0.0 | #f59e0b (amber) |
| 0.0 to 0.3 | interpolate amber → green |
| >= 0.3 | #22c55e (green) |

each country marker uses meshstandardmaterial with emissive properties that intensify on hover (0.3 → 0.6). data fetching uses swr with 60-second refresh intervals, deduplication and automatic revalidation on focus.

---

**performance characteristics**

| operation | gpu (rtx 5070) | cpu (12-core) |
|-----------|----------------|---------------|
| single inference | 15ms | 150ms |
| batch (32 articles) | 80ms | 2400ms |
| effective rate | ~400 articles/sec | ~13 articles/sec |

| source | typical duration | articles |
|--------|------------------|----------|
| rss (300+ feeds) | 2-5 minutes | 2000-5000 |
| reddit | 30-60 seconds | 100-500 |
| hacker news | 10-20 seconds | 50-100 |
| total cycle | 3-7 minutes | 2000-6000 |

| resource | idle | collection | inference |
|----------|------|------------|-----------|
| cpu | <5% | 20-40% | 10-30% |
| ram | 1.2gb | 1.5gb | 1.8gb |
| gpu memory | 500mb | 500mb | 800mb |

database growth averages ~2kb per article, 1000-3000 articles per hour, 50-150mb daily storage with 30-day retention.

---

**error handling and fallbacks**

*collection failures:*
- per-source isolation: one source failure doesn't stop the job
- automatic retry: 3 attempts with exponential backoff
- timeout: 30 seconds per source

*inference failures:*
- text too short (<10 chars): return none, skip article
- model exception: log error, return none for article
- batch failure: fall back to individual processing
- oom: reduce batch size dynamically

*graceful degradation:*
- postgresql credentials missing → falls back to sqlite
- reddit/mastodon credentials missing → skip those collectors
- gpu unavailable → falls back to cpu inference
- model load fails → api returns degraded status

---

**limitations**

- **model accuracy:** ~85% on standard benchmarks; sarcasm and cultural context remain challenging
- **language coverage:** while xlm-roberta supports 100+ languages, accuracy varies; best for high-resource languages
- **real-time latency:** 1-hour collection interval; breaking news delayed up to 60 minutes
- **geographic granularity:** country-level only; no city or region subdivision
- **source availability:** rss feeds may block, rate-limit or discontinue without notice
- **attribution ambiguity:** articles covering multiple countries assigned to most-mentioned
- **bias propagation:** model inherits biases from training data

---

**stack:** python 3.10+, fastapi, uvicorn, sqlalchemy 2.0, apscheduler, pytorch 2.0, transformers 4.37+, httpx | next.js 14, react three fiber, three.js, tailwindcss 3.4, swr, typescript 5`,
  },
  {
    id: "project-merkle-sync",
    slug: "merkle-sync",
    title: "merkle sync",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-05-03T11:45:00.000Z",
    content: `a decentralised file synchronisation engine built from scratch. without http, rest, json or a central server. rather only using raw tcp, udp multicast and merkle trees, the same cryptographic data structure that powers git and bitcoin.

---

**why build this**

every sync tool felt like magic. dropbox, syncthing, rsync - they just work. but i wanted to understand the primitives. how do you verify a terabyte of data by comparing a single 32-byte hash? how do peers discover each other without a central server? what happens when a connection dies halfway through a file transfer?

this project answers those questions by building a sync engine from first principles.

---

**the core idea**

a merkle tree is a hash tree where every file gets hashed, then folders get hashed from their children's hashes, bubbling up to a single root hash. the key property is that changing one byte in one file changes the root hash.

\`\`\`mermaid
flowchart TB
    subgraph Before["BEFORE"]
        R1["root = a3f2..."]
        D1["docs/ = 7b1c..."]
        D2["src/ = e4d9..."]
        F1["readme.md"]
        F2["notes.txt = 9c3e..."]
        F3["main.go"]
        R1 --> D1 & D2
        D1 --> F1 & F2
        D2 --> F3
    end
    
    subgraph After["AFTER editing notes.txt"]
        R2["root = f7b1... CHANGED"]
        D3["docs/ = 4e2a... CHANGED"]
        D4["src/ = e4d9... unchanged"]
        F4["readme.md"]
        F5["notes.txt = c8d2... CHANGED"]
        F6["main.go"]
        R2 --> D3 & D4
        D3 --> F4 & F5
        D4 --> F6
    end
\`\`\`

to find what changed between two machines, compare root hashes. if they match, you are done. if they differ, compare children. recurse only into mismatching branches until you find the exact files that differ.

this gives you $O(\\log n)$ verification. for 10,000 files, you compare maybe 50 hashes instead of reading 10,000 files. for a terabyte of data, two peers can confirm they are in sync by exchanging 32 bytes.

---

**the four layers**

\`\`\`mermaid
flowchart LR
    subgraph D["1. DISCOVERY"]
        UDP["UDP multicast"]
        Peers["peer registry"]
    end
    subgraph S["2. STATE"]
        Watch["file watcher"]
        Tree["merkle tree"]
    end
    subgraph T["3. TRANSPORT"]
        TCP["tcp + binary framing"]
        Proto["custom protocol"]
    end
    subgraph R["4. RECONCILIATION"]
        Diff["tree diff"]
        Stream["chunk streaming"]
    end
    D --> T
    S --> R
    T --> R
\`\`\`

**discovery** - peers broadcast their presence via udp multicast every 5 seconds. no configuration needed. any machine on the local network automatically discovers others. if a peer goes silent for 30 seconds, it gets evicted from the registry.

**state** - a file watcher monitors the synced folder. any change triggers a tree rebuild, updating hashes from the changed file up to the root. the new root hash gets broadcast to connected peers.

**transport** - a custom binary protocol over tcp. each message is just \`[4-byte length][1-byte type][payload]\` with no http headers, no json parsing, no overhead. seven message types handle everything.

**reconciliation** - when root hashes differ, the diff algorithm walks both trees in parallel, drilling into mismatching branches until it identifies the exact files to transfer. files stream in 32kb chunks (never loaded fully into memory) and write to a temp file that gets atomically renamed on completion.

---

**the hard parts**

building a sync engine is easy until things break. the interesting work is handling failure modes.

| failure | solution |
|---------|----------|
| file changes during sync | rwmutex on tree separating readers (sync) from writers (watcher) |
| connection dies mid-transfer | write to temp file, atomic rename on success, delete temp on failure |
| sync loop (A syncs B syncs A...) | only trigger sync if local hash actually changed |
| large files exhaust memory | 32kb streaming chunks, never buffer whole file |
| peer disappears | 30-second heartbeat timeout, automatic eviction |

the invariant that prevents infinite sync loops is subtle but critical. a peer only broadcasts its hash after a local change. receiving a file from someone else does not count as a local change until the transfer completes and the tree rebuilds with the new file.

---

**performance**

| metric | value |
|--------|-------|
| tree build | ~2s for 10k files |
| verification | $O(\\log n)$ hash comparisons |
| throughput | saturates gigabit ethernet |
| memory | ~50 bytes per file in tree |
| discovery | 0-5 seconds |

the bandwidth savings are dramatic. to verify 100,000 files totaling 1tb, a naive approach reads every byte. merkle sync exchanges maybe 100 hashes (3.2kb) to identify what differs, then transfers only changed files.

---

**design choices**

*why go?* goroutines map naturally to concurrent listeners (udp discovery, tcp connections, filesystem watcher). the standard library has everything needed with no external dependencies except fsnotify for cross-platform file watching.

*why not grpc?* seven message types do not justify a code generator and runtime. hand-rolled binary framing is ~200 lines.

*why sha256 over faster hashes?* security by default. if peers do not fully trust each other, a fast non-cryptographic hash like xxhash could be spoofed. optimize later if needed.

*why udp multicast over mdns?* simplicity. mdns requires implementing dns-sd. multicast is 50 lines and works on any local network.

---

**what i learned**

- **tcp is bytes, not messages.** you must frame your own message boundaries. off-by-one in length parsing corrupts everything downstream.

- **merkle trees are everywhere.** git uses them for commits, bitcoin for block verification, certificate transparency for audit logs. once you build one, you see them everywhere.

- **failure handling is the real work.** the happy path is 20% of the code. the other 80% is what happens when connections drop, files change mid-sync, or memory runs low.

- **binary protocols are not scary.** http hides complexity but adds overhead. for internal protocols, rolling your own is simpler than it sounds.

**stack** - go, net (tcp/udp), crypto/sha256, encoding/gob, sync, fsnotify`,
  },
  {
    id: "blog-minimax-m2",
    slug: "minimax-m2-paradigm",
    title: "the $10b shortcut",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-11-16T17:21:00.000Z",
    content: `we are currently witnessing a structural bifurcation in the global ai landscape. on one side, you have the closed-source giants (openai, anthropic, google) scaling dense models behind opaque apis. on the other, the open-source ecosystem has been playing catch-up, mostly through brute-force scaling or finetuning llama derivatives.

but every so often, a model drops that doesn't iterate but rather it disrupts.

the release of **minimax m2** is one of those moments. it poses a very uncomfortable question for the proprietary labs, asking how a model that ranks in the top five of the artificial analysis benchmark, territory usually reserved for gpt-4 and claude opus, can exist with open weights? [1]

i have been testing m2 extensively. it is currently the third most-used model on openrouter and let me be clear, this isn't hype. it is a pragmatic recognition that we have finally hit the "intelligence-cost quadrant" sweet spot. we have been looking for **pareto optimality** where high reasoning capabilities intersect with dirt-cheap inference. m2 occupies this space decisively.

here is my deep dive into why this 230-billion parameter monster (that only thinks it is a 10-billion parameter model) is the future of agentic intelligence.

---

**1. the "mini/max" paradox**

the nomenclature "minimax" is the governing engineering principle behind m2.

- **"mini"** refers to the active computational footprint.
- **"max"** refers to the knowledge capacity.

the architecture relies on a massive mixture-of-experts (moe) design. the total parameter count is a staggering 230 billion. in a traditional dense model (like llama 3 70b), every single one of those parameters would fire for every token generated. that is computationally expensive and slow.

m2, however, uses an aggressive sparsity ratio of approximately 23:1. it only activates **10 billion parameters** per token generation step [3].

**the math of efficiency**

to visualise why this matters, consider the cost of inference ($C$). in a dense model, cost scales with total parameters ($P_{total}$). in m2, it scales with active parameters ($P_{active}$).

$$C_{M2} \\propto P_{active} \\approx \\frac{P_{total}}{23}$$

this simple equation is why m2 changes the economics of ai. it holds the encyclopedic breadth of a 200b+ model (the "max") but runs with the latency and cost profile of a small 10b model (the "mini").

for autonomous agents, this is critical. agents require loops. they plan, they act, they observe, they refine. this cycle can consume thousands of tokens per task. if your underlying model is claude 3 opus, you go broke. if it is llama 3 8b, the agent is too stupid to finish the task. m2 hits the sweet spot because it is smart enough to handle long-horizon tasks but roughly **92% cheaper** than comparable proprietary models [7].

---

**2. the great attention pivot and why m2 dropped "lightning"**

here is a nuanced detail that many people miss. the predecessor, minimax m1, was famous for using "lightning attention", a linear attention mechanism that allowed for massive 1m+ token contexts.

**m2 dropped it.**

m2 reverted to standard **full attention** (softmax). why? because in the real world of coding and "needle-in-a-haystack" retrieval, precision beats theoretical efficiency.

linear attention approximates the interaction between tokens to achieve $O(n)$ complexity. full attention has quadratic complexity $O(n^2)$, meaning it's computationally heavier.

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

see that $QK^T$ term? that's the model comparing *every* token to *every other* token. minimax engineers realised that for an agent to correctly identify a single bug in 50 files of code, you cannot afford the "lossy" compression of linear attention [4]. you need the brutal exactness of the $n \\times n$ matrix. this decision to prioritise **accuracy over raw speed** is why m2 feels so much sharper at coding tasks than m1 did.

---

**3. the death of chain-of-thought and the rise of "interleaved reasoning"**

we need to talk about how this thing thinks. since mid-2024, the industry has been obsessed with chain-of-thought (cot), the idea that the model should vomit out a "reasoning preamble" before giving you an answer.

the problem with standard cot is that, it is linear.

*input → giant block of thinking → final output.*

this is fine for solving a math riddle, but it is terrible for agents. agents need to interact with the world.

minimax m2 introduces **interleaved reasoning**. it doesn't separate thinking and doing; it blends them into a continuous loop, effectively modeling the task as a markov decision process (mdp):

*input → think → tool call (act) → **observation** → think → tool call (act) → answer.*

this is a subtle but profound shift. in this paradigm, "thinking" isn't a preamble; it is a pervasive thread. if the agent tries to scrape a website and gets a 403 forbidden error, it doesn't fail. it sees the observation, "thinks" about it ("*i need to try a different endpoint*") and acts again.

in my testing, this state preservation is the killer feature. the reasoning traces are kept as part of the conversation history object. at step 50 of a complex task, m2 can look back at step 10 and see *why* it made a decision, not just *what* it did [1].

---

**4. the stability algorithm behind cispo**

why is m2 so stable during these long loops? it comes down to how it was trained.

training reasoning models with reinforcement learning (rl) is notoriously unstable. as models generate longer sequences of thought, the variance in gradients explodes. the standard fix is to use algorithms like ppo, which use "clipping" to stop the model from changing too much, too fast.

the problem? ppo clips the *update*. this often suppresses those "aha!" moments where the model makes a massive leap in logic because the algorithm interprets that leap as instability [8].

minimax uses a novel algorithm called **cispo** (clipped importance sampling policy optimisation).

$$L_{CISPO}(\\theta) = \\mathbb{E}\\left[\\min\\left(r_t(\\theta)A_t, \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon)A_t\\right)\\right]$$

without getting bogged down in the full derivation, the "magic" is that cispo clips the *weight* but detaches it from the gradient. it tells the model: *"this was a huge, high-variance move. i will let you learn from it, but i won't let you blow up the training run over it."*

meta ai recently released a paper on scaling rl compute and explicitly identified cispo as the **"most stable way to scale reinforcement learning steps"** [5]. when meta validates your math, you know you are on to something.

---

**5. benchmarks and the "tau squared" coding dominance**

the report request mentioned the "tau squared" benchmark. this refers to **tau-bench** ($\\tau^2$), the current gold standard for agentic reliability.

- **tau-bench:** m2 scores **87%** in the telecom domain. this measures reliability in multi-turn tool use. most models lose track of the user's constraints after turn 3. m2 holds the state.
- **swe-bench verified:** this is the big one for autonomous coding. m2 scores **69.4%**. for context, claude 3.5 sonnet is around 77% and gpt-4o is around 75%. m2 is within striking distance of the absolute state-of-the-art, while being open-weights and significantly cheaper to run [6].
- **browsecomp:** in web navigation agents, m2 scored **44.0%**, which ironically nearly triples the score of claude 3.5 sonnet (19.6%) on that specific evaluation.

---

**to wrap up**

by decoupling total knowledge from active compute (230b/10b), minimax has solved the **economic blocker** for autonomous agents. by implementing interleaved reasoning, they have solved the **cognitive blocker**. and by using cispo, they have turned the "black magic" of rl training into a rigorous science.

for developers, the choice is becoming clearer. you can pay the "proprietary tax" for the absolute peak of intelligence or you can use m2 to get 95% of the performance at a fraction of the cost, with full control over your infrastructure.

in the intelligence vs. price quadrant, m2 stands alone. it is the best bang for the buck we have ever seen.

---

**references**

[1] minimax technical report, "the m2 architecture and performance," 2024.
[2] artificial analysis, "ai model leaderboard q4 2024."
[3] openrouter documentation, "minimax m2 model card and pricing," 2024.
[4] "why m2 returned to full attention," minimax engineering blog, 2024.
[5] meta ai research, "the art of scaling rl compute," arxiv, 2024.
[6] swe-bench leaderboard, "verified split results," 2024.
[7] user comparisons on "the intelligence-price quadrant," reddit/localllama, 2024.
[8] "stabilizing rlhf with cispo," minimax research, 2024.`,
  },
  {
    id: "blog-deepseek-ocr",
    slug: "death-of-tokeniser-deepseek-ocr",
    title: "reading without reading",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-11-01T11:23:00.000Z",
    content: `we have spent the last decade obsessed with scale. we want more parameters, more data and, perhaps most desperately, longer context windows. we went from bert's claustrophobic 512 tokens to gemini's millions, chasing the dream of stuffing entire legal archives or code repositories into a single prompt. but we keep hitting the same invisible wall, "tyranny of the quadratic" as some would put it.

it is a basic fact of the transformer architecture that self-attention scales as $O(n^2)$. it is a physical memory bottleneck defined by the attention matrix calculation:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

the killer here is the $QK^T$ term. it produces a matrix of size $n \\times n$. if you double your sequence length $n$, your memory requirement for storing these attention scores quadruples [1]. we have tried engineering our way out of this with sliding windows and sparse attention, but those are just band-aids. the real problem is the input itself. we are still feeding our ai's discrete text tokens, a legacy method that is surprisingly inefficient for dense information.

enter deepseek-ocr. on the surface, it looks like just another tool to read pdfs. but after tearing apart the technical report, i am convinced this is a trojan horse for a paradigm shift called **contexts optical compression**. it posits a wild theory that pictures might actually be cheaper than words.

---

**1. the mathematics of inefficiency and why text is expensive**

let's look at the numbers. standard tokenisers (bpe, sentencepiece) are rigid. they treat a page of text as a linear string of integers. if you have a complex financial table, the model has to burn tokens representing the structure (pipe characters, newlines, spacing) just to tell the model "this is a table."

from an information theory perspective, this is a disaster. we can quantify the inefficiency using shannon entropy ($H$):

$$H(X) = -\\sum_{i} p(x_i) \\log_2 p(x_i)$$

in a standard text stream, structural tokens (whitespace, brackets, markdown) have very high probability $p(x_i)$, meaning they contribute almost **zero** information (surprise) to the system while consuming valuable slots in the context window [2]. you are paying compute for predictable syntax.

deepseek's hypothesis is that a "visual patch" (a cluster of pixels) creates a holographic representation of the data. the metric that matters here is the compression ratio ($\\rho$), but we need to view it through the lens of vector dimensionality:

$$\\rho = \\frac{N_{\\text{text}} \\times d_{\\text{text}}}{N_{\\text{visual}} \\times d_{\\text{visual}}}$$

where $N$ is the number of tokens and $d$ is the embedding dimension. while $d_{\\text{visual}}$ (the visual embedding size) is typically larger than $d_{\\text{text}}$, deepseek achieves a raw token reduction ($N_{\\text{text}}/N_{\\text{visual}}$) of roughly **10x** [3]. this suggests the model is packing significantly more entropy into each vector, effectively moving the complexity from the *sequence length* (which scales quadratically) to the *channel dimension* (which scales linearly).

---

**2. the engine and its frankenstein architecture**

the deepseek team trained a giant vision transformer (vit) using a serial, heterogeneous pipeline that i honestly find fascinating. it connects components that usually don't talk to each other [8].

here is the "deepencoder" breakdown with the arithmetic that justifies their choices:

**1. the perceiver (sam-base)**

they use the segment anything model (sam) as the front end. to handle the $1024 \\times 1024$ input resolution without melting the gpu, they use **windowed attention**. instead of the global $O(n^2)$, the cost becomes linear with respect to the number of patches, because attention is restricted to a local window $w$:

$$O\\left(\\frac{n}{w} \\cdot w^2\\right) = O(nw)$$

this allows the model to perceive fine-grained details (serifs, decimal points) without the quadratic penalty [7].

**2. the bottleneck (conv layers)**

this is where the physical compression happens. they use a 2-layer convolutional network to downsample the feature map. we can calculate the exact output dimension $O$ using the standard convolution arithmetic:

$$O = \\left\\lfloor \\frac{I - K + 2P}{S} \\right\\rfloor + 1$$

with a kernel $K=3$, stride $S=2$ and padding $P=1$, applied twice to a feature map of $64 \\times 64$ patches (derived from the sam output):

- **step 1:** $O_1 = \\lfloor(64 - 3 + 2)/2\\rfloor + 1 = 32$
- **step 2:** $O_2 = \\lfloor(32 - 3 + 2)/2\\rfloor + 1 = 16$

the result is a $16 \\times 16$ grid, totaling **256 visual tokens**. this massive reduction ($64^2 \\to 16^2$ tokens) is what makes the subsequent processing so cheap [7]. it forces the model to aggregate local features into semantic concepts.

**3. the semantic brain (clip-large)**

finally, they feed those 256 tokens into clip. since $256^2 = 65536$, the global attention cost is negligible. clip aligns these visual patches with the language manifold, getting them ready for the llm to decode [4].

---

**3. the "cliff" and rate-distortion theory in action**

however, there is no free lunch. the report details a massive drop-off in performance when they push the compression too far.

- **at 10x compression:** 97% precision.
- **at 20x compression:** 60% precision.

this is a classic manifestation of **rate-distortion theory**. there is a lower bound on the rate $R$ (bits per symbol) required to achieve a distortion $D$ (error rate):

$$R(D) = \\min_{p(\\hat{x}|x): E[d(x,\\hat{x})] \\le D} I(X; \\hat{X})$$

as deepseek increases the compression ratio, they are forcing $R$ below the intrinsic entropy of the document image. at 20x, the "channel capacity" of the latent space is exceeded by the noise of the pixels (scan lines, font blur). the mutual information $I(X; \\hat{X})$ drops and the decoder is forced to rely on its internal priors (hallucinations) rather than the source signal [2].

this explains why the model starts hallucinating plausible but incorrect numbers at high compression. it is "dreaming" the data based on visual probability rather than reading it. this is a critical limitation. **do not use this for high-stakes finance if you are pushing the compression limits.**

---

**4. operational reality and the "gundam" mode**

i have to mention the "gundam" mode because the naming is fantastic. this is their solution for massive schematics or newspapers.

if you shrink a giant blueprint to $1024 \\times 1024$, you lose the details. gundam mode tiles the image. it processes tiles individually (local detail) and the full image (global context), then stitches them together. even with this heavy lifting, it uses fewer than 800 tokens per page [3]. compare that to mineru or internvl, which burn 6,000+ tokens for the same task [6].

deepseek is proving that general-purpose vlms are incredibly wasteful. they are "over-tokenising" visual noise that carries no semantic value.

---

**5. the future of visual rag and memory forgetting**

this is where my opinion comes in strong. i believe deepseek-ocr signals the obsolescence of the text tokeniser for multimodal ai.

if we can encode a page of text into a vector space that is 10x smaller than the text itself, why would we ever store the text? we are moving toward **visual rag** [5].

imagine a vector database full of these deepencoder embeddings, such that you don't retrieve text; you retrieve the "visual gist" of the page. the model also suggests a biomimetic approach to memory called "memory forgetting" [6]:

- **short-term:** keep recent interactions as high-fidelity text.
- **long-term:** compress older context into low-res visual tokens (tiny mode, 64 tokens).

it mimics how humans remember. you recall the exact wording of the sentence you just read, but for a book you read last year, you only retain the semantic "shape" of the plot.

---

**in a nutshell**

deepseek-ocr is a proof-of-concept for a post-tokenisation era. it validates the hypothesis that visual latent space can hold more entropy per unit than linear text.

for the engineers out there, this could be a 10x cost reduction multiplier for your rag pipelines [7]. for the researchers, it is a challenge to the fundamental assumption that text is the optimal medium for language modeling.

we are witnessing the transition from processing discrete symbols to reasoning in continuous high-dimensional visual spaces. the tokeniser isn't dead yet, but for the first time, it looks like legacy tech.

---

**references**

[1] the quadratic barrier and the tokenisation crisis.
[2] entropy limits and signal-to-noise ratios in visual latent space.
[3] core deepseek-ocr paper: technical claims and benchmarks.
[4] the modality gap and clip alignment.
[5] visual rag and production implications.
[6] benchmarking vs qwen/internvl and memory forgetting.
[7] the serial architecture: sam, conv and clip.
[8] deepencoder specifics and parameter counts.
[9] serial vs parallel architecture in mllms.`,
  },
  {
    id: "blog-imo-2025",
    slug: "cognitive-threshold-imo-2025",
    title: "gold medal, one blind spot",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-08-03T14:47:00.000Z",
    content: `if you have been following the breathless hype cycles of ai, you are likely exhausted. i know i am. but what happened in australia this year is different. openai and google deepmind achieved scores equivalent to a imo gold medal, solving problems that stump the smartest 18-year-olds on the planet [1].

but here is the catch and it is the subject of today's deep dive. they completely face-planted on problem 6.

this dichotomy (perfection on five problems and a "hard zero" on the sixth) is the most important signal we have regarding the current state of artificial intelligence. it reveals exactly where the "cognitive threshold" lies. in this post, i am going to tear down the architecture that got us here, rigorously derive the math behind the problem that stumped the machine and map this all back to what it means for us in software engineering.

---

**1. the new benchmark and why this matters**

let us look at the facts. the imo is the hardest pre-university math competition in the world. it consists of six problems over two days. each is worth 7 points. a gold medal usually requires a score around 35 out of 42.

historically, ai struggles here. standard llms are probabilistic engines. they are "system 1" thinkers. they guess the next word. math requires rigorous, "system 2" logic where one false step collapses the entire proof.

in 2025, both google deepmind (gemini deep think) and openai (o1 series) hit that magic number: **35 points** [1].

they solved algebra, geometry and number theory with a proficiency that would make a tenured professor sweat. but they failed problem 6. this was not a glitch. it was a fundamental limitation of how current transformers process global constraints.

---

**2. the architecture of reasoning and the math of "thinking"**

to understand why they won gold, you have to understand that these are not the same models you use in chatgpt or claude 3.5 sonnet.

the standard models we use for coding (gpt-4o, etc.) operate on **training-time compute**. they are smart because they read a lot of books during training. when you ask them a question, they answer instantly. they do not "think."

mathematically, a standard llm computes the probability of the next token $t_i$ given the context $C$ and previous tokens $t_1, ..., t_{i-1}$:

$$P(t_i | C, t_1, ..., t_{i-1})$$

this is a single forward pass. it is greedy. if $t_j$ is a mistake, the model is doomed because $t_{j+1}$ depends on $t_j$.

the gold medalists use **inference-time compute** [2]. this introduces a latent variable $\\theta$, representing the "reasoning chain" or "hidden thoughts." the model does not just maximise the probability of the answer $A$. it marginalises over the space of possible reasoning paths:

$$P(A | Q) = \\sum_{\\theta \\in \\Theta} P(A | \\theta, Q) \\cdot P(\\theta | Q)$$

here, $\\Theta$ is the set of all possible "thoughts" (steps of proof, backtrackings, corrections). the model spends computational resources (inference time) exploring high-probability paths in $\\Theta$ before committing to an output $A$. this is the shift from **probabilistic pattern matching** to **search-based reasoning**. it is the difference between a parrot repeating a phrase and a human sitting down with a scratchpad.

**the "monitorability tax" and alignment**

this shift introduces a fascinating nuance i call the "monitorability tax" [3]. as these models get smarter, their internal chain of thought $\\theta$ becomes increasingly alien and illegible to humans. to keep them safe, developers force the model to output legible english thoughts. this actually slows them down. we are taxing their intelligence to keep them aligned with human readability. in the imo context, this was crucial because the proofs had to be graded by humans. if the model had used an internal "alien math" shorthand, it would have received a zero, regardless of the correct answer.

---

**3. the "warehouse" problem and a rigorous mathematical breakdown**

now, let us get into the weeds. why did they fail problem 6? the problem was a combinatorial tiling task. to make this concrete, let us use the "warehouse optimisation" analogy.

**3.1 the scenario**

imagine you are the cto of a logistics firm. you have a massive automated warehouse floor that is a perfect square grid of size $n \\times n$ where $n = 2025$.

- **the goal:** you need to pave this floor with rectangular product pallets (tiles). you want to use the *minimum* number of tiles possible (larger tiles = better efficiency).
- **the constraint (osha):** you must install fire alarms (uncovered unit squares).
  1. every row must have exactly one fire alarm.
  2. every column must have exactly one fire alarm.
  3. no tile can cover an alarm.

your job is to place the $n$ alarms in a permutation $\\pi$ that allows you to use the fewest number of tiles to cover the rest of the floor.

**3.2 the trap of the diagonal permutation**

the ai models, acting as greedy optimisers, likely defaulted to the identity permutation (the main diagonal). let us define the set of alarms $S$ as:

$$S = \\{(i, \\pi(i)) : i \\in \\{1, ..., n\\}\\}$$

why is this bad?

let $T(S)$ be the number of rectangular tiles needed for a set of alarms $S$.

if alarms are on the diagonal, every tile is bounded by the "punctures" on the diagonal. a tile starting at row $r_1$ and ending at row $r_2$ cannot cross the diagonal because the alarm at $(k, k)$ where $r_1 \\le k \\le r_2$ would block it.

effectively, the grid splits into two triangular regions (upper and lower).

in the worst case (the diagonal), the number of tiles $T_{diag}$ approaches $O(n)$. specifically:

$$T_{diag}(n) \\approx 2(n-1)$$

for $n = 2025$, this results in $\\approx 4048$ tiles. the ai found this solution and stopped, thinking it was optimal. it satisfied all constraints, but it was terribly inefficient.

**3.3 the optimal solution via the dilworth bound**

the correct answer requires a construction rooted in **dilworth's theorem** and partial order theory. the minimum number of tiles $T_{min}$ is actually given by:

$$T_{min}(n) = 2(\\lceil \\sqrt{n} \\rceil - 1)$$

for our warehouse where $n = 2025$:

$$T_{min}(2025) = 2(\\lceil \\sqrt{2025} \\rceil - 1) = 2(45 - 1) = 88$$

**the proof sketch:**

we can define a partial order on the cells of the grid. let two cells $(r_1, c_1)$ and $(r_2, c_2)$ be comparable if $r_1 < r_2$ and $c_1 < c_2$.

the number of tiles required is linked to the structure of "chains" (increasing sequences) and "antichains" (decreasing sequences) in the permutation of alarms.

if we let $k$ be the length of the longest chain of alarms and $l$ be the length of the longest antichain, a known result in this domain (the greene's theorem extension for grid tilings) suggests the cost is roughly proportional to $k + l$.

to minimise the sum $k + l$ subject to $k \\cdot l \\ge n$ (by erdős-szekeres), we need $k \\approx l \\approx \\sqrt{n}$.

**the "hiura" construction:**

we partition the $n \\times n$ grid into $m \\times m$ blocks, where $m = \\lceil \\sqrt{n} \\rceil$. we place the alarms such that they form a specific "snaking" pattern through these blocks.

specifically, we choose $m = 45$.

the alarms are placed to ensure that we can form massive rectangles that span $\\sqrt{n}$ rows and $\\sqrt{n}$ columns simultaneously.

by balancing the "increasing" and "decreasing" runs of the alarms to be length $\\sqrt{n}$, we minimise the fragmentation.

**3.4 why the ai failed and the missing global vision**

the ai failed because it lacks **global constructive vision**. chain-of-thought is sequential. it is great at local deductions:

*"if A then B. if B then C. therefore, C."*

it is terrible at global optimisation problems that require "seeing" the topology:

*"the grid, as a whole, can be partitioned into sqrt(n)-sized blocks."*

the model could not visualise that breaking the symmetry of the diagonal would yield a $O(n)$ to $O(\\sqrt{n})$ improvement. it got stuck in a local optimum because the gradient of "reasoning" points towards simpler, more symmetric structures like the diagonal [4]. it could not make the "intuitive leap" that a square root function was relevant to a tiling problem.

---

**4. the critical nuances around fairness and tools**

there are two major nuances that critics often miss when analysing this result.

**1. the "code-augmented" hypothesis:**

the ai models were restricted from using tools. they had no python interpreter. this is a massive handicap. if the models had been allowed to write code, they likely would have solved problem 6.

why? because they would not have tried to "reason" the proof from scratch. they would have written a script to simulate the tiling for $n = 1, 2, 3, ..., 100$.

they would have generated the data: $T(n) = 0, 0, 2, 2, 4, 4, ...$

they would have fit the curve $T(n) = 2(\\lceil \\sqrt{n} \\rceil - 1)$.

once they had the formula empirically, the "reasoning" engine would have worked backward to construct the proof. the failure was not in *proving*, but in *conjecturing*.

**2. the contamination debate:**

skeptics argue the models just memorised the training data. this is why problem 6 is so important. it was a novel construction. the fact that the models failed p6 while acing p1-p5 is actually **evidence against memorisation**. if they were just reciting similar problems seen in training, they likely would have hallucinated a solution to p6 based on a similar-looking past problem. the "hard zero" proves they were genuinely trying to reason and genuinely hit a wall.

---

**5. the gap and why you are using the wrong tools**

if you are a developer building software on top of gpt-4o or claude 3.5, you need to look at this data.

| difficulty tier | description | gpt-4o / claude 3.5 | o1 / deep think |
| --- | --- | --- | --- |
| tier 1 | grade school math | 90%+ | 100% |
| tier 3 | national olympiad | <20% | 50% |
| tier 5 | imo hard (problem 6) | 0% | 0% |

the commercial models we use daily failed to even get a bronze. they scored under 13 points [1].

this gap is massive. we are building enterprise software on "system 1" models that cannot handle complex logic without massive hand-holding. the "reasoning" models are a totally different beast.

---

**6. implications for software engineering**

so, what does a math competition tell us about building apps? everything.

**6.1 the "rule engine" is essential**

the ai failed problem 6 because it could not optimise globally. in a real business, that failure means violating a safety regulation or crashing a database.

**takeaway:** we cannot trust ai with "black box" optimisation yet. we need **neuro-symbolic** systems. let the ai propose a warehouse layout, but run it through a deterministic code-based verifier (a rule engine) before you accept it.

if verify(ai_output) returns false, loop back.

**6.2 agentic workflows need context**

the ai failed because it treated the grid as a sequence of rows, not a holistic map. if you are building ai agents, you cannot just feed them a jira ticket. you must provide the **global context**, the full architecture, the database schema, the "grid." an agent without context is just a diagonal line placer in a world that needs a hiura construction [5].

**6.3 the cost of thinking**

inference is no longer a flat rate. a "hard" query might take 10 minutes of gpu time and cost 5 usd. we need to redesign our apis to handle asynchronous, long-running "thought processes." the days of expecting a 200ms json response for complex logic are over [6].

---

**final thoughts**

the 2025 imo proved that ai can reason. it can deduce. it can prove. but it still struggles to *create* novel structures from scratch.

for us, the strategy is clear. use these new "reasoning models" to solve the hard, local logic puzzles. but do not expect them to be the architect of your system. they are the best bricklayers in history, but for now, you still need a human to draw the blueprints.

---

**references**

[1] imo 2025 official results & ai analysis.
[2] "chain of thought reasoning in large language models", google deepmind research.
[3] "the monitorability tax: alignment in reasoning models", openai safety team.
[4] "global vs. local reasoning in transformers", anthropic research.
[5] "agentic patterns for enterprise", o'reilly media.
[6] "economics of inference-time compute", semianalysis.`,
  },
  {
    id: "blog-kimi-k2",
    slug: "silicon-curtain-kimi-k2",
    title: "the moonshot that leaked",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-11-15T09:34:00.000Z",
    content: `i have been arguing for some time that the "capital moat" theory of ai, the idea that you need a gdp-sized budget and a nuclear power plant to train a frontier model was a temporary anomaly, not a law of physics. silicon valley vc's and us policymakers bet the house on the assumption that raw scale was the only path to agi. they believed that as long as the us controlled the supply of h100s and had the deepest pockets, hegemony was secured.

on november 6, 2025, that assumption evaporated.

moonshot ai released kimi k2 thinking and it is a discontinuous leap in architectural efficiency that effectively bypasses us semiconductor sanctions and beats the us flagship model, gpt-5, on reasoning tasks. and they did it for 4.6 million usd [1].

if you are not paying attention to the specific engineering choices that made this possible, you are missing the biggest shift in the ai arms race since the transformer paper. let's look at the math, the architecture and why the geopolitical map just inverted.

---

**1. the architecture of asymmetry**

the headline number is that kimi k2 is a **1 trillion parameter** model. but that number is a trap. in the old "dense" model paradigm (think gpt-4 original flavor), running a 1t model would require an inference cluster so large it would bankrupt a small startup.

moonshot ai built a sparse mixture-of-experts (moe) system that completely decouples knowledge capacity from inference cost.

**1. the sparse matrix**

kimi k2 uses a granular routing mechanism with 384 expert networks [2]. when you send a token to the model, it doesn't activate the whole brain. a learned gating network selects only the top-8 experts relevant to that specific concept.

here is the breakdown:

- total parameters ($P_{total}$): $1 \\times 10^{12}$
- active parameters ($P_{active}$): $\\approx 32 \\times 10^{9}$
- activation rate: $\\frac{32B}{1T} = 3.2\\%$

mathematically, if $E$ is the set of experts and $G(x)$ is the gating function for input $x$, the output $y$ is calculated as:

$$y = \\sum_{i \\in \\text{Top-}8(G(x))} G_i(x) \\cdot E_i(x)$$

this allows kimi k2 to "know" as much as a supercomputer but "run" on high-end consumer hardware. it lowers the time-to-first-token (ttft) drastically. while us labs were focused on "scaling laws" (add more compute), moonshot focused on "efficiency laws" (remove the waste).

**2. native int4 as the sanction buster**

this is the piece that i think us policymakers misunderstood the most. the export controls on nvidia chips were designed to limit memory bandwidth ($B_{mem}$), which is the primary bottleneck for llm inference.

kimi k2 features **native int4 quantisation-aware training (qat)** [3]. most models are trained in 16-bit floating point ($bf16$) and then compressed later, which causes "brain damage" or reasoning degradation. moonshot trained this model in 4-bit integers from day one.

why does this matter? it is simple arithmetic.

$$B_{\\text{effective}} = B_{\\text{hardware}} \\times \\frac{\\text{bits}_{\\text{standard}}}{\\text{bits}_{\\text{model}}} = B_{\\text{hardware}} \\times \\frac{16}{4} = 4 \\times B_{\\text{hardware}}$$

by moving from 16-bit to 4-bit, they reduced the weight size by a factor of 4. this effectively **quadruples the memory bandwidth** of their existing hardware stockpiles [4]. a restricted h800 chip in china running kimi k2 now has the effective throughput of an unrestricted h100 running a standard us model. the sanctions just forced them to write better code.

**3. the muon optimiser**

training a 1t parameter moe in 4-bit precision is notoriously unstable. to solve this, they ditched adamw for the **muon optimiser** [1].

muon orthogonalises gradient updates, which prevents the "expert collapse" problem where the router gets lazy and sends everything to one expert. the research shows muon improves computational efficiency by a factor of 2 compared to standard optimisers [1]. this is how they kept the training cost so low.

---

**2. the cognitive shift to interleaved reasoning**

we are moving past the era of "chain-of-thought" (cot) where the model dumps a static block of text and then gives an answer. kimi k2 implements **interleaved reasoning**, which treats thinking as a persistent, agentic loop [5].

instead of *input → think → output*, the kimi k2 loop looks like this:

*input → think → tool call (act) → **observation** → think (update state) → tool call (act) → ... → answer*

the model thinks, performs a tool call (like a python script), observes the result, updates its internal state and thinks again. it can maintain this "thought trace" across 200-300 sequential steps [1]. it allows for self-correction. if a tool fails, it doesn't hallucinate a success; it reads the error log, rewrites the code and tries again.

**heavy mode and system 2 thinking**

for hard problems, kimi k2 engages "heavy mode," which spawns eight parallel reasoning trajectories [3]. it is a tree of thoughts search implemented at inference time. a meta-reasoning layer then acts as a judge, synthesizing the best outcome. this is the difference between intuitive guessing (system 1) and deliberate calculation (system 2).

---

**3. the benchmarks on humanity's last exam**

the proof is in the performance. we are looking at **humanity's last exam (hle)**, a benchmark designed to be un-gameable.

| model | setting | score |
| --- | --- | --- |
| **kimi k2 thinking** | **heavy mode** | **51.0%** [4] |
| kimi k2 thinking | standard | 44.9% [6] |
| gpt-5 (est) | standard | 41.7% [6] |
| claude sonnet 4.5 | standard | 32.0% [6] |

this is not a statistical error. a 9-point lead over the us flagship in complex reasoning is a generation gap.

furthermore, look at the agentic benchmarks. on **browsecomp** (web navigation), kimi k2 scored **60.2%**, destroying claude's 24.1% [7]. this means kimi is a functional employee, while claude is just a smart encyclopedia.

---

**4. the economic reality check**

here is the statistic that should terrify silicon valley.

- **gpt-5 estimated training cost:** 500 million to 2.5 billion usd [8]
- **kimi k2 training cost:** 4.6 million usd [1]

moonshot ai achieved state-of-the-art performance for roughly 1% of the cost of a us frontier model. this destroys the "capital moat." if a frontier model costs 4.6 million usd, it is no longer the domain of hyperscalers (google, microsoft). it is within the budget of a series a startup, a university or a mid-sized nation-state.

we are seeing a massive deflationary pressure. kimi k2 is open-weight (modified mit license) [9]. why would a european enterprise pay openai 30 usd per million tokens when they can run a smarter model locally for the cost of electricity?

---

**5. the geopolitical inversion**

this release marks the failure of the hardware containment strategy. the us assumed that by controlling the "thermodynamics" of compute (limiting watts and flops via hardware bans), they could control the output of intelligence.

they were wrong.

sanctions forced chinese labs to become efficient. while us labs got lazy with massive compute resources, chinese labs optimised every bit. now that they have the superior architecture, any hardware they do acquire yields exponential returns.

we are already seeing a user adoption shift. procurement data shows that **78% of organisations** prioritizing data sovereignty are now selecting kimi k2 architectures over gpt-5 [10]. the global south and non-us western allies are looking for options that don't pipe their data directly into us-controlled servers. china is positioning itself as the "benevolent provider" of open-source intelligence, a massive soft-power play.

---

**6. my take**

the future isn't going to be a single monopoly model running in a us data centre. it is going to be hybrid, interleaved and ruthlessly efficient. kimi k2 proves that ingenuity is a better predictor of performance than capital expenditure.

if you are building in this space, stop assuming that "bigger is better." the game has changed to "smarter is cheaper."

---

**references**

[1] moonshot ai technical report, "efficiency laws and the muon optimiser," 2025.
[2] kimi k2 architecture whitepaper, section 3.1: sparse routing.
[3] kimi k2 architecture whitepaper, section 4: native int4 qat.
[4] hardware inference analysis, semiconductor watch, november 2025.
[5] react paradigm and interleaved reasoning studies, 2025.
[6] strategic technology intelligence briefing, "comparative analysis of frontier models," december 2025.
[7] browsecomp benchmark leaderboard, q4 2025.
[8] industry estimates based on h100 cluster sizing and energy consumption.
[9] moonshot ai, "kimi k2 thinking release notes," november 6, 2025.
[10] global tech procurement report, december 2025.`,
  },

  {
    id: "writing-desire",
    slug: "two-faces-of-desire",
    title: "two faces of desire",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-08-27T23:12:00.000Z",
    content: `so, is a state of low desire actually a problem? from within, if i am truly content, resting in a quiet ease within my own skin, who can claim that i suffer? why should my lack of wanting be treated as a deficiency if it comes with a profound sense of sufficiency? the trouble seems to arise only when i begin to compare myself to others or when i begin to want what i do not have. it is only at that threshold, when lack intrudes upon contentment, that restlessness and with it suffering, begins.

this question, however, is more complex than it first appears. human traditions have long wrestled with the paradox of desire. is desire the fire that drives growth or the chain that binds us to perpetual dissatisfaction? the stoics taught that true freedom lies in limiting one's wants to what lies within one's control. buddhism, in its most well-known teaching, identified craving as the root of suffering. and yet, to reduce this entire discussion to the dichotomy of east and west or to figures like buddha and socrates, would be to overlook a profound and deeply textured tradition within islamic philosophy, where thinkers sought not only to critique desire but to map its anatomy.

among these thinkers, al-ghazali stands out. for al-ghazali, the problem was never simply desire itself, but its origin and its destination. where does my longing arise from? toward what end does it pull me? desire can be a ladder to transcendence or a pit that swallows us whole. the issue, then, is not to kill desire but to purify it, to transmute its energy so it ceases to serve the lower self and begins to serve the higher.

consider, the famous encounter between alexander the great and diogenes the cynic. on the one hand stands alexander, embodiment of conquest, power and restless striving. he personifies what islamic thought would call the nafs al-ammārah, the commanding soul, driven by appetite and ambition without restraint. on the other hand sits diogenes, dwelling in his barrel, embodying radical detachment from society's norms and possessions. to many, his life appeared absurd; to him, it was freedom.

when alexander, in his grandeur, offered to grant diogenes any wish, diogenes simply replied: "stand out of my sunlight." at first glance, this seems like a witty dismissal. but looked at more closely, it is a philosophical declaration. all of alexander's treasures are powerless compared to the simple gift of sunlight and the sovereign freedom of not needing anything more.

the story takes an even deeper turn when we consider alexander's response: "if i were not alexander, i would wish to be diogenes." his words are not merely admiration but a recognition of something essential, what islamic philosophy calls fitrah, the innate and primordial nature with which every soul is created. alexander, at the peak of worldly power, intuits the hollowness of excess and glimpses the purity of a soul unburdened.

thinkers like ibn sina (avicenna) took such stories not as curiosities but as windows into the spectrum of the soul. for him, alexander and diogenes are not two options to be chosen between, but two poles on a continuum of possibility. the task of the human being is not to side with one extreme or carve out a lazy compromise, but to undergo a process of transformation. this process is tazkiyah, purification of the self, by which raw desire is refined into its truest form. the guiding question, then, is not "how much should i desire?" but "what is the nature of my desire and does it align with my highest self?"

it is here that the notion of low desire becomes more nuanced. for islamic thinkers, low desire is not in itself good or bad. it must be diagnosed. early spiritual masters like al-muhasibi placed enormous emphasis on muhasaba, the inner audit of one's intentions and actions. through this lens, a state of diminished wanting can signify either the pinnacle of spiritual achievement or the depths of spiritual collapse.

for some, low desire reflects qanā'ah or contentment. this is not passive apathy but an active, mature serenity. it is the fruit of struggle, the calm after wrestling with the self and with the illusions of the world. the person of qanā'ah is like diogenes in his barrel, but with a crucial difference. their peace is not a philosophical posture but a spiritual victory. they have not merely renounced; they have reconciled. they rest in the decree of god, their heart unperturbed. to demand more desire from such a soul is to misunderstand them entirely; their quiet is not emptiness but fullness.

for others, however, low desire signals a very different reality. it may arise from kasal (sloth), jubn (cowardice) or sheer despair. this is the artist who never paints, not because she has transcended ambition but because she fears failure. this is the would-be leader who never speaks, not out of humility but out of self-doubt. here, low desire is a prison. the persian poet rumi warns against this false quiet. it is not peace but betrayal, the silencing of the soul's call. in such a state, the soul suffers not because it craves too much, but because it denies its own god-given potential, its fitrah.

the contrast is striking. two people may appear equally unambitious, equally detached, equally at rest. yet one has climbed the mountain of the self and arrived at serenity, while the other has fled the climb altogether. one silence is victory; the other is avoidance. one is like the quiet after a just war is won. the other is like the stillness of a desert that has turned away the rain.

so, is low desire a problem? islamic philosophy resists the simplicity of a yes or no. it offers instead a mirror, a diagnostic tool, an invitation to radical honesty. the questions it poses are:

- is my lack of desire the fruit of qanā'ah or the rot of kasal?

- has my soul subdued the nafs al-ammārah in service of a higher purpose or has it simply gone numb?

- am i aligned with my highest nature or am i betraying it?

the conclusion is subtle yet profound. the problem is never the quantity of desire but its quality and orientation. desire is like water. in one form, it nourishes, purifies and sustains life. in another, it floods, drowns and destroys. the task is not to drain the river but to channel it.

thus, the question of desire becomes not merely psychological but spiritual. the challenge is to discern which quiet we are living in; is it the quiet of fulfillment or the quiet of neglect.`,
  },
  {
    id: "favourites-sporting-moments",
    slug: "sporting-moments",
    title: "sporting moments i love",
    category: "favourites",
    folder: "finds",
    public: true,
    session_id: "",
    created_at: "2025-07-09T18:17:00.000Z",
    content: `a running list of the matches and moments i find myself going back to, the ones that stuck with me long after the result stopped mattering.

**football**
- *messi's last-minute winner against iran, 2014 world cup.* iran had frustrated argentina for ninety minutes and looked set to hold out for a draw, then messi took one touch twenty yards out and bent it into the far corner in stoppage time as if the previous hour and a half had just been him waiting. it is the most messi thing imaginable, a whole game settled in one second of something nobody else on the pitch could do.
- *tioté's equaliser in newcastle 4-4 arsenal, 2011.* arsenal were four goals up at half time and newcastle somehow hauled the whole thing back, with cheick tioté smashing in the leveller near the end for the only goal he would ever score in his time at the club. it means a good deal more now that he died so suddenly in 2017 and it is still the wildest comeback i have watched in the league.
- *lincoln city knocking burnley out of the fa cup, 2017.* a non-league side went to a premier league ground and won it with a header in the very last minute, becoming the first team from outside the league to reach the quarter-finals in over a century. i coach a kids team on saturdays and cup nights like this are exactly why i still tell them anyone can beat anyone.
- *stephanie roche's goal for peamount, 2013.* she flicked the ball up over a defender and volleyed it in during a women's league game that nobody was really filming and it still finished runner-up for fifa's goal of the year, ahead of strikes scored at a world cup by full-time professionals. the best things in football do not always happen on the biggest stages and that is the whole reason this one stuck with me.

**cricket**
- *ben stokes at headingley, 2019 ashes.* england were nine wickets down and still needed seventy-odd to win, with jack leach defending one end and barely able to lay bat on ball and stokes simply took the game off australia almost single-handedly with an unbeaten 135. i have watched a great deal of cricket and i am not sure i have ever seen one player drag a side somewhere it had no right to be quite like that.
- *kohli against pakistan at the mcg, 2022 t20 world cup.* india were four down and the chase looked gone in front of ninety thousand people, then kohli pulled it out of nowhere, the two sixes off haris rauf the kind of shots you are not really allowed to play under that much pressure. india against pakistan is the most loaded fixture in the sport and he made the biggest version of it look like a quiet net.
- *misbah's twin hundreds and the 56-ball blast, abu dhabi 2014.* misbah spent most of his career being teased as the most cautious batsman alive, then made a century in each innings against australia and brought the second one up in fifty-six balls, equalling what was then the fastest test hundred ever scored. watching the most patient man in the game suddenly cut loose like that was a treat reserved for people who actually sit through test cricket.
- *ashton agar's 98 from number eleven on debut, 2013 ashes.* a nineteen-year-old walked out last with australia in deep trouble and very nearly made a hundred batting at number eleven, which had never once been done, before falling two short in a stand that set records of its own. it is one of the great near-misses the game has produced and i still feel quietly robbed on his behalf whenever it comes up.

**tennis**
- *murray winning wimbledon, 2013.* britain had waited seventy-seven years for a man to win the title and murray finally did it in straight sets against djokovic, on a baking sunday with the whole country watching through its fingers. living here, you could feel how much it mattered and the closing game alone, three championship points come and gone before he got over the line, was almost too much to sit through.
- *raducanu winning the us open as a qualifier, 2021.* an eighteen-year-old came through three rounds of qualifying and then took the whole tournament without dropping a single set, something that had simply never been done. for about a fortnight a british teenager nobody outside the sport had heard of looked completely untouchable and then it was over almost as suddenly as it had begun.
- *federer against del potro at the london olympics, 2012.* their semi-final ran to 19-17 in a deciding set with no tiebreak, four and a half hours of two of the most-liked players in the sport refusing to blink, on the same grass wimbledon is played on. i have always been in federer's corner and it is probably the finest match of its type that nobody mentions, purely because it happened to be a semi-final and not a slam final.
- *razzano knocking serena out of the french open, 2012.* a player ranked outside the top hundred beat serena williams in the opening round and saved seven match points doing it, the only time serena ever lost in the first round of a major. razzano had lost her fiancé to a brain tumour the year before and serena was so shaken by the defeat that she went out and hired the coach who built the most dominant stretch of her whole career.

**f1**
- *verstappen's wet drive at brazil, 2016.* the track was barely drivable and half the field was spinning into the barriers and a teenage verstappen dropped to sixteenth late on before carving his way back to third passing what felt like a car a lap. hamilton won the race but nobody really talks about that, because the whole afternoon belonged to the kid making everyone else in the wet look like they were still learning.
- *räikkönen's "leave me alone" win in abu dhabi, 2012.* in his first year back after walking away from f1 to go rallying, räikkönen led most of the race and held alonso off for the win, then told his engineer over the radio to leave him alone because he knew what he was doing. the line is a meme now, but underneath it was a genuinely good drive and a proper comeback, which is very him.
- *webber going round the outside of alonso at eau rouge, spa 2011.* he pulled alongside and simply kept his foot in through the fastest and most frightening corner on the calendar, taking the place somewhere almost nobody would even think to try it. it is a single overtake rather than a whole race, which is probably why it lives on as a clip fans pass around rather than something the casual viewer recalls.
- *kobayashi on the podium at his home race, suzuka 2012.* he held button off to finish third in front of the japanese crowd, the first home driver to manage it there in over twenty years and, as things turned out, the last japanese driver to stand on an f1 podium at all. the scenes with the grandstands afterwards are the sort of thing this sport does better than almost any other.

some of these everyone remembers and some you would only really know if you follow the sport closely, which is how i think a list like this should read.`,
  },
  {
    id: "i have everything but nothing at all",
    slug: "i-have-everything-but-nothing-at-all",
    title: "i have everything but nothing at all",
    category: "blogs",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-12-01T18:12:00.000Z",
    content: `i'm twenty-three. if you saw my life written down you'd probably think i had it figured out. good grades in school, then imperial, goldman after that, the job everyone tells you to chase and i lasted one quarter before i left because i couldn't make myself care about it. then a yc startup, founding engineer. five countries in the last eight months. i play a lot of sport. my parents are good to me and i mean that and i have friends who'd pick up if i called them in the middle of the night. and i pray five times a day, i keep my fasts, i try to do everything i'm meant to do as a muslim and most days i manage it.

and i still feel empty a lot of the time. that's the thing i don't really know how to say to anyone, because it sounds ungrateful and it probably is.

i want to be clear that i'm not depressed or anything. i'm not sitting in the dark. it's more that i keep getting to the things i spent years working for and feeling nothing when i get there. or close to nothing. a day or two of something and then it's gone and i'm already looking at the next thing.

the part that gets me is that i can't even use the obvious excuse. i haven't drifted from my deen. i pray, i fast, i'm trying. if anyone has a reason to feel full it should be me. and i don't and that scares me more than if i'd just stopped praying and could point at that and say, there, that's why.

i looked into it a bit. there's a thing psychologists call the arrival fallacy, where you get to the top of the thing and the view just isn't what the climb promised. and apparently the chemical that drives you is mostly there while you're chasing, not when you actually get it. so you get the thing and the part of you that was lit up for months just switches off. that made sense of the goldman thing. i'd wanted it for years and it lasted about nine weeks before it went flat.

but that doesn't explain everything, because i already know all this and knowing it hasn't fixed anything. i left goldman thinking the problem was the place, the suits, being a small cog in something massive. the startup is better, it's actually mine. and i still feel it. so it's not the job. i keep changing the job.

so maybe it's me, or how i'm living, rather than what i'm doing.

something i've noticed about myself that i don't love. almost everything on that list is something i can show people. the grades, the uni, the countries specially, the countries are basically made to be posted. and when something good happens my first thought isn't to feel it. it's to think about how it'll look when i tell someone. like the feeling has to wait in line behind the telling of it. i read about a therapist who works with high achievers, doctors, lawyers, the kind of people other people envy and he said the thing they admit in the end is that they're still chasing approval, usually from one person, often a parent, even when that parent loves them and already gave it. that's not exactly me. my parents are proud and i believe them. but the shape of it felt familiar. if a thing only feels real once someone's seen it, then it was never really about the thing.

this is where my deen comes into it, because there's an idea i keep coming back to. the heart described as having chambers, different loves in different chambers and one in the middle that's only meant for allah. and the problem is when you put worldly things in that middle one. not loving the dunya, you're allowed to love the dunya, the prophet loved his family and had wealth and spent it. the problem is putting those things in the spot that was only ever built for the one thing that doesn't fade. yasmin mogahed has this line about how if you put a vase on the edge of a table you can't act shocked when it falls. you put it there.

and that's the uncomfortable bit for me. i can pray five times a day and keep every fast and still have quietly moved my actual sense of worth out of that middle chamber and into the dunya without even noticing. the prayers can all be there, done properly, while the thing they're meant to be pointing at has slid somewhere else. i can be doing salah five times a day, which is supposed to pull me out of the world for a minute and put me in front of allah and the second it's over i'm right back to measuring myself by stuff that doesn't last. there's a thing about barakah, that it's not about how much you've got, it's about what fills your time, whether your hours go to something that lasts or something that just evaporates. and when i actually look at where my time and my worry go, i don't come out of it well.

there's a hadith i think about, that whoever makes the dunya his main concern, allah scatters his affairs and puts poverty in front of his eyes and he only gets what was already written for him anyway. and whoever puts the hereafter first gets his affairs sorted and a richness put in his heart and the dunya comes to him regardless. i recognise the scattered part. i recognise the poverty in front of the eyes, in a life that on paper doesn't have any poverty in it.

so what's supposed to go in the middle, if it's not the next thing on the list.

i know the answer. allah. i can say it and i believe it. but i'd be lying if i said i was actually living it, because if i had it properly seated where it's meant to be i don't think i'd feel like this as often as i do. knowing the answer and living the answer are not the same thing and i'm somewhere in the gap.

what i do have are a few things i've noticed. the times i don't feel empty, the times i'm not looking around for proof that any of it counted, are almost never the achievements. they're small and they're nothing you could put on a cv. talking to a friend and losing track of time and not performing anything. the middle of a football match, not winning it, the middle of it, when i'm just a body figuring out a moving problem with other bodies and there's no part of me standing off to the side watching myself. the few minutes after fajr, before i pick up my phone, before the day starts, when there's nothing to chase yet and nothing to show anyone and i'm just quiet for a second.

none of that goes on a cv. i don't think that's a coincidence.

i found out the old christians had a word, acedia, which isn't sadness, it's more like a flatness, a not-caring and the strange thing is it tends to land on people who are busy and capable and look completely fine. and someone wrote that despair doesn't always show up crying, sometimes it shows up showered and dressed and on time and good at its job. and our own tradition talks about a hardness that creeps into a heart that's drifted from where it came from, a heart still going through the motions while the life leaks out of it. i read that stuff and felt caught out.

so maybe the empty feeling isn't a fault. maybe it's telling me something. it shows up exactly when the doing is done and there's nothing left to chase, when it's finally quiet enough to ask what all of it was for. and i've been dealing with that quiet by booking another flight, finding the next thing, adding another line. staying ahead of the question. the travelling is partly that, i can admit it now. it looks like a full life and it works like running away.

i'm not going to pretend i've figured it out, because i haven't. i'll probably catch myself tomorrow already drafting how i'll tell someone about something good, the feeling stuck in line behind it like always. this has been going on longer than the time it took to write this and it's not going to fix itself because i wrote it down.

but there's one small thing i think i can do. next time something good happens i want to actually feel it before i tell anyone and remember where it came from while i'm at it. that's it. just get there a second before the audience does and see if anyone's actually home when i show up on my own with allah instead of with my version of myself.

or maybe i might find it empty again.`,
  },

  {
    id: "finds-food-adventures",
    slug: "food-adventures",
    title: "food adventures",
    category: "favourites",
    folder: "finds",
    public: true,
    session_id: "",
    created_at: "2025-08-08T13:55:00.000Z",
    content: `food is how i understand a city. these are the places that have shaped meals into memories.

**london** *(home)*
- *tayyabs* - a whitechapel institution and the lamb chops that got me through my exams at imperial. you queue in the cold and it's always worth it, no reservations and no pretense.
- *gymkhana* - where i go when something's gone right and the kid goat methi keema is absurd. it's michelin-starred without ever feeling like it.
- *mangal 2* - a dalston ocakbasi where the charcoal smoke stays in your clothes for days and the lamb şiş is the benchmark every other kebab gets measured against.
- *maroush* - shawarma on edgware road at 2am, after a long week.
- *regency cafe* - a proper english breakfast in a westminster room that hasn't changed in decades, brutalist architecture outside and fried eggs in.

**new york**
- *hyderabadi zaiqa* - in curry hill, with a dum biryani that reminded me of dhaka. i found it jet-lagged at 11pm and went back three times that week.
- *the halal guys* - the cart on 53rd and 6th at 1am, for the white sauce. you know the one.
- *joe's pizza* - in greenwich village, where i once stood outside in the rain eating a slice, which is the only correct way to do it.

**san francisco**
- *old mandarin islamic restaurant* - halal chinese that shouldn't exist but does. the hot pot felt like a well-kept secret.
- *reem's california* - arab bakery. the mana'eesh with za'atar hit different when you're far from home.
- *z zoul cafe* - the only sudanese kitchen in the bay, run by one family in the tenderloin. the chef cooks the dishes his grandmother used to make and the shawarma with a bowl of thick lentil soup is what you want.
- *old jerusalem* - a palestinian place in the mission that's been going since 2005. every table gets pickled beets and olives before you've even ordered and the musakhan, sumac chicken and caramelised onions over taboon bread, is the thing to get.

**los angeles**
- *nomad asian bistro* - halal chinese in long beach that's been going since 1980, with the quiet confidence of a place that's had forty years to get it right. order the cumin lamb, the scallion pancakes and the hand-pulled noodles.
- *fatima's grill* - a downey spot doing lebanese-mexican fusion that sounds completely wrong and turns out exactly right. the shawarma fries and the birria tacos are all halal.
- *al-noor* - a pakistani room in lawndale that's been there since '98, with goat biryani and a crowd of regulars who've been coming since the day it opened.

**paris**
- *l'as du fallafel* - in the marais, eaten standing in a cobblestone alley with the sauce dripping down my hand. perfect.
- *mosquée de paris* - mint tea and pastries in the courtyard after friday prayers.

**munich**
- *tengri tagh* - uyghur food, which you almost never find in germany, with big-plate chicken and hand-pulled belt noodles. no alcohol and a small prayer corner at the back.
- *sultanahmet köftecisi* - the munich branch of an istanbul köfte house that's been going since 1920. they do one thing perfectly, grilled meatballs with bean salad, pickles and a bowl of lentil soup.

**dubai**
- *al ustad special kabab* - iranian kebabs in old dubai since 1978. the whole city has transformed around it while it stayed exactly the same.
- *3 fils* - on the waterfront at night, watching the dhows, with a japanese-middle eastern fusion that made me rethink what food can be.

**dhaka**
- *star kabab* - the seekh kebabs my dad used to take me to as a kid, the thing my taste buds were trained on and everything else has been a comparison ever since.
- *kacchi bhai* - if you want to understand what biryani is supposed to taste like, you start here, with the potatoes at the bottom, caramelised and spiced.

**kuala lumpur**
- *nasi lemak wanjo* - a kampung baru institution since the sixties, with a dark, sweet sambal over coconut rice that pulls a queue at breakfast and another one all over again at supper.
- *line clear* - penang's legendary nasi kandar, transplanted to kl. you point at what you want and they flood the rice with a mix of gravies and it's still the most authentic version in the city.
- *ikan bakar jalan bellamy* - a row of open flames near the istana, grilling fish to order. get the stingray in sambal with a pile of ulam on the side.

**penang**
- *deen maju* - the nasi kandar locals will actually queue around the block for, across from the sikh temple. ask for kuah campur so all the gravies run together over the rice and take the spice-fried chicken on top.
- *bangkok lane mee goreng* - a mamak stall in pulau tikus that's been frying the same plate of mee goreng for ninety years. order it with extra squid.
- *bee hwa cafe* - one of the very few places doing halal char koay teow, a dish that barely exists in halal form because the real thing is fried in pork lard. this one still comes with all the smoke and wok hei.
- *roti canai transfer road* - a forty-year-old roadside griddle that drowns its roti in so much curry the locals call it kuah banjir, or flooded. get there early, before it's all gone.

**singapore**
- *green chilli chicken rice* - one stall doing one dish since '99, a fried chicken thigh over pandan coconut rice under a rough green chilli sambal. they shut the moment it runs out, usually some time in the early afternoon.
- *selera rasa* - the nasi lemak at adam road that singaporeans will genuinely argue is the best in the country, with fragrant rice, crisp ikan bilis and a serious sambal.
- *haji kadir* - a golden mile institution doing sup tulang merah, marrow bones in a fierce red gravy that you suck straight out through a straw. messy and completely worth it.

**general rule**
i trust hole-in-the-wall places with bad lighting and no english menu over anywhere with "curated" in the description. food should be a little inconvenient.`,
  },
  {
    id: "favourites-videos",
    slug: "favourite-videos",
    title: "favourite interviews & videos",
    category: "favourites",
    folder: "finds",
    public: true,
    session_id: "",
    created_at: "2025-07-14T08:29:00.000Z",
    content: `videos i've rewatched more than once. the ones that left a mark.

**sport**
- *the last dance* - watched this during lockdown and it broke something open. jordan's obsession isn't healthy, but the way he channelled slights, pain and ego into performance changed how i think about competition. the "and i took that personally" meme undersells it.
- *sachin tendulkar: a billion dreams* - growing up, cricket was the main sport. sachin was proof that quiet discipline could carry the weight of a billion people. i still get emotional watching his final walk at wankhede.
- *pep guardiola masterclasses* - not the press conferences, the tactical breakdowns. how he sees space, how he thinks in systems. i coach kids football on saturdays; his philosophy of "make the pitch big" is the only thing i teach.
- *muhammad ali interviews* - the conviction. the wit. "i'm so mean i make medicine sick." he stood for something when it cost him everything.

**music & process**
- *frank ocean - blonded radio* - he rarely speaks, so when he does, i listen. the way he talks about loneliness and nostalgia shaped how i think about memory.
- *rick rubin: the creative act* - the podcast episodes, the book. "the goal isn't to make art for the audience. it's to make art that the audience didn't know they needed." i think about this constantly.
- *j dilla: still shining* - the sp-303, the samples, the illness. he made beats from a hospital bed. the definition of craft until the end.

**film & storytelling**
- *christopher nolan bfi masterclass* - time, structure, why he shoots on film. practical effects as philosophy. made me appreciate that constraints create art.
- *hayao miyazaki: 10 years with the master* - watching him draw is meditation. the way he cares about wind, about movement, about things most people don't see.
- *denis villeneuve on dune* - adapting something "unfilmable." the ambition, the patience. he waited decades for the technology to catch up to his vision.

**philosophy & faith**
- *hamza yusuf lectures* - particularly "the content of character" and his lectures on the soul. islamic spirituality explained with scholarly depth and poetic clarity. these shaped my twenties.
- *abdal hakim murad on modernity* - tradition engaging with the contemporary without losing itself. rigorous, thoughtful, necessary.

**ideas & culture**
- *anthony bourdain: parts unknown* - every episode. food as lens for understanding people. he listened more than he talked. miss him.
- *roger federer dartmouth speech* - "effortless is a myth." from the most elegant athlete ever. losing 40% of your points still makes you a champion. reframed failure for me.
- *david foster wallace: this is water* - "the really important kind of freedom involves attention and awareness." i return to this when life feels automatic.

**building things**
- *steve jobs lost interview (1995)* - before the second act. raw, unpolished, but the clarity about taste and conviction is all there. "people don't know what they want until you show it to them."
- *andrej karpathy's neural net series* - the only ml content i recommend. no hype, just building intuition from first principles.
- *bret victor: inventing on principle* - what tools should feel like. "creators need an immediate connection to what they create." changed how i think about developer experience.

**documentaries**
- *jiro dreams of sushi* - 80 years of making the same thing, getting slightly better each day. mastery as practice, not destination.
- *free solo* - not about climbing. about what commitment actually looks like. the preparation, the fear, the execution.
- *senna* - rivalry, purity, tragedy. racing as something transcendent.`,
  },
  {
    id: "favourites-reading",
    slug: "reading-list",
    title: "books that shaped me",
    category: "favourites",
    folder: "finds",
    public: true,
    session_id: "",
    created_at: "2025-06-01T14:20:00.000Z",
    content: `i read too much. these are the ones i keep coming back to or recommending to others.

**philosophy & faith**
- *the alchemy of happiness* by al-ghazali - the book that made islamic philosophy click for me. practical spirituality, written a thousand years ago, still devastatingly relevant.
- *meditations* by marcus aurelius - a roman emperor's private journal. stoicism before it became a twitter aesthetic. "you have power over your mind, not outside events."
- *man's search for meaning* by viktor frankl - wrote this after surviving auschwitz. the idea that meaning can be found in any circumstance, even suffering, has stayed with me.
- *the brothers karamazov* by dostoevsky - technically a novel, but it's really philosophy wearing a story. the grand inquisitor chapter alone is worth the 800 pages.

**history & biography**
- *sapiens* by yuval noah harari - the 70,000-year view of humanity. some of it is speculative, but it permanently changed how i think about institutions, money and shared fictions.
- *the looming tower* by lawrence wright - the road to 9/11. essential for understanding the last 25 years.
- *surely you're joking, mr. feynman* - a physicist who picked locks, played bongos in brazil and worked on the atomic bomb. curiosity as a way of life.
- *when breath becomes air* by paul kalanithi - a neurosurgeon facing his own mortality. made me think about what i'd want to have built if time ran out.

**thinking & craft**
- *thinking, fast and slow* by daniel kahneman - system 1 and system 2. i use this framework constantly. we're more irrational than we think.
- *the design of everyday things* by don norman - why doors are confusing and how to think about interfaces. changed how i see the built world.
- *a philosophy of software design* by john ousterhout - short, opinionated, correct. complexity is the enemy. every engineer should read this.
- *high output management* by andy grove - how to think about leverage, meetings and building teams. practical wisdom from intel's ceo.

**essays & collections**
- *consider the lobster* by david foster wallace - the footnotes, the attention, the way he sees everything. exhausting and brilliant.
- *the fire next time* by james baldwin - letter to his nephew about race in america. prose as weapon. "not everything that is faced can be changed, but nothing can be changed until it is faced."
- *a room of one's own* by virginia woolf - about what it takes to create. space, time, money, permission.

**currently reading**
- *the great transformation* by karen armstrong - comparing the axial age across civilisations. dense but rewarding.
- *the anthropic papers* (collected) - trying to understand alignment from the source.

i keep a longer list in notion but these are the ones i'd actually give someone.`,
  },
  {
    id: "favourites-places",
    slug: "places-and-walks",
    title: "places & walks",
    category: "favourites",
    folder: "finds",
    public: true,
    session_id: "",
    created_at: "2025-04-28T19:30:00.000Z",
    content: `i think best when i'm walking. these are the places i go to clear my head or remember why i like being alive.

**london**
- *hyde park, late night* - my default when i need to think, walking the path around the serpentine at 11pm when it's just you and the occasional runner. problems feel smaller out there.
- *hampstead heath* - parliament hill for the skyline and the ponds in summer. this is where london stops being a city and starts being something older.
- *the south bank* - the walk from tate modern to tower bridge, best at dusk when the lights come on and the thames looks cinematic.
- *the barbican conservatory* - tropical plants tucked into brutalist concrete, free and quiet and a little strange and good for reading.
- *columbia road on sundays* - flower market chaos where everyone's in a good mood and i rarely buy anything but i always leave happier.

**new york**
- *central park* - the reservoir loop at dawn, watching the city wake up from inside a rectangle of green.
- *the high line* - an elevated park built on old train tracks, best in the early morning before the tourists arrive.

**san francisco**
- *lands end trail* - the coastal path runs from the old sutro baths ruins out to a little cypress labyrinth above the surf and the golden gate keeps appearing through the trees until you forget you're in a city at all.
- *tank hill* - the overlook locals climb instead of twin peaks, with the same wide view across the bay and none of the tour buses. best in the last of the evening light.
- *the 16th avenue tiled steps* - a long, hand-laid mosaic staircase that climbs up to grand view park. it's a small sand-dune hilltop with one of the finest skyline views in the city and hardly anyone else on it.

**los angeles**
- *the secret stairs* - silver lake and echo park are laced with hundreds of public staircases left over from the old trolley days and you can lose a whole afternoon climbing between gardens and bungalows if you start from the micheltorena steps.
- *fern dell, griffith park* - a shaded creek path lined with ferns that feels like it was airlifted in from oregon. cool and quiet, while everyone else is sweating their way up to the observatory.
- *the bradbury building* - a downtown office building you can wander into for free, with a sunlit victorian atrium of wrought iron railings and open cage lifts that you'll recognise the second you walk in from blade runner.
- *museum of jurassic technology* - a dim and deliberately confusing little museum in culver city where you genuinely can't tell what's real and what's been invented, with a quiet russian tea room up on the roof when you need to recover.

**paris**
- *the marais* - getting lost in the side streets among the falafel, the bookshops and the cobblestones. paris at walking pace.

**munich**
- *the flaucher* - the gravel islands and shallow channels of the isar where münchners spend whole summer afternoons grilling and swimming, far wilder and emptier than the englischer garten if you walk a little upstream from thalkirchen.
- *glockenbachviertel* - the most lived-in corner of the city, where people gather on the steps around gärtnerplatz with corner-shop beers on warm evenings and you can wander for hours without any plan at all.

**kuala lumpur**
- *kampung baru* - a malay village of wooden stilt houses that's somehow held its ground seven hundred metres from the petronas towers, with food on every corner and the unhurried feel of an older city that refuses to leave.
- *bukit tunku* - the greenest and quietest corner of kl, all winding roads under old trees and colonial houses. there's a lookout over the whole skyline at changkat tunku.
- *kl forest eco park* - a canopy walkway strung through genuine old rainforest right beneath the kl tower, ten minutes from the shopping malls and almost completely overlooked.

**penang**
- *the moongate trail* - the way locals actually climb penang hill, a shaded jungle path that winds up through an old moon-gate arch so you earn the view properly instead of riding the funicular.
- *balik pulau* - the quiet other side of the island, all paddy fields and fruit orchards and sleepy kampungs, best taken slowly on a bike before the developers finally get to it.

**singapore**
- *the rail corridor* - twenty-four kilometres of disused railway with the tracks lifted and the whole line left to the grass and if you walk the bukit timah stretch early enough it's just you and the green the entire way.
- *pulau ubin* - a short bumboat from changi takes you to the last of kampong singapore, where you rent a rattling old bike and ride past granite quarries, mangroves and the strange little german girl shrine.
- *lazarus island* - a near-empty crescent of white sand and clear water a short ferry from the city, the beach singaporeans quietly keep for themselves while everyone else is queueing for sentosa.

**nature escapes**
- *peak district* - mam tor and the great ridge, proper hiking with the wind in your face and sheep everywhere.
- *the lake district* - i did helvellyn in the rain and couldn't see a thing and it was still worth it.

**gliding**
- *lasham airfield* - where i'm learning to fly. the silence when you release from the tow plane, with no engine and just wind, is an unreal feeling.

**airports**
an unpopular opinion, but i love airports and that in-between feeling of everyone going somewhere. some of my best thinking has happened in departure lounges.`,
  },
  {
    id: "reflections-questions",
    slug: "open-questions",
    title: "questions i'm sitting with",
    category: "reflections",
    folder: "reflections",
    public: true,
    session_id: "",
    created_at: "2025-06-22T17:43:00.000Z",
    content: `questions i keep coming back to. no answers yet, just the thinking.

**on building**
- when does optimisation become procrastination? at what point is "making it better" just avoiding shipping?
- how do you build for users who don't know what they want yet? where's the line between vision and arrogance?
- is most complexity accidental or are we just bad at seeing why it's necessary?

**on work**
- what's the difference between ambition and anxiety dressed up as ambition?
- how do you stay hungry after you've "made it" by some definition? what replaces the chip on your shoulder?
- is founder mode sustainable or does it just burn different fuel?

**on craft**
- can you have taste without ego? or is conviction about quality inherently a little arrogant?
- how much of expertise is pattern matching vs actual understanding? does it matter?
- what's the right ratio of depth to breadth? when does being a generalist become an excuse?

**on life**
- how do you balance presence with ambition? one says "be here now," the other says "build for later."
- what do you owe the people who shaped you? how do you repay debts you didn't ask to incur?
- is contentment something you find or something you choose? can you will yourself into peace?

**on faith and meaning**
- how do you hold religious conviction without closing off intellectual honesty?
- what does it mean to act well in a world where you can't know all the consequences?
- where does discipline end and self-denial begin?

i don't expect to resolve most of these. but they're useful to carry.`,
  },
  {
    id: "reflections-changed-mind",
    slug: "changed-my-mind",
    title: "things i've changed my mind on",
    category: "reflections",
    folder: "reflections",
    public: true,
    session_id: "",
    created_at: "2025-05-31T21:08:00.000Z",
    content: `beliefs i held strongly and then let go. trying to update faster.

**"more hours = more output"**
*before:* grinding longer meant caring more. if you weren't exhausted, you weren't trying.
*now:* sleep, rest and stepping away are inputs, not rewards. my best work happens in 4 focused hours, not 12 scattered ones.

**"the best code is clever code"**
*before:* elegance meant compression. one-liners were beautiful. abstractions showed sophistication.
*now:* boring code is beautiful. the goal is for someone else (or future me) to understand it instantly. clever is expensive.

**"you need a cs degree to be a real engineer"**
*before:* imposter syndrome from coming from aeronautics. felt like i was faking it.
*now:* the degree teaches structure, not ability. the best engineers i know have every background imaginable. what matters is how you think and how fast you learn.

**"networking is fake"**
*before:* thought building relationships for career reasons was inauthentic. just do good work and people will notice.
*now:* relationships are how anything meaningful happens. it's not networking if you're genuinely curious about people. good work matters, but in silence it dies.

**"move fast and break things"**
*before:* speed above all. fix it later. ship now.
*now:* move fast but know what you're breaking. some things shouldn't break. speed without intention is just chaos with branding.

**"strong opinions, strongly held"**
*before:* conviction was identity. changing your mind was weakness.
*now:* strong opinions, loosely held. the point is to find truth, not to be right. updating quickly is a flex, not a failure.

**"passion is everything"**
*before:* if you're not obsessed, you're doing the wrong thing. follow your passion.
*now:* passion follows mastery. get good at something useful, find meaning in the craft and passion often shows up. waiting for passion is a trap.

**"success is making it"**
*before:* there's a finish line. get the job, hit the number, then you're done.
*now:* there's no arrival. just different games with different stakes. peace comes from the process, not the outcome.

this list will keep growing. that's the point.`,
  }
];
