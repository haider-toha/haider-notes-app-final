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
    created_at: "2026-06-12T08:47:00.000Z",
    isPinned: true,
    content: `haider toha
london, uk

[github](https://github.com/haider-toha) • [email](mailto:mohammedhaidertoha@gmail.com) • [linkedin](https://linkedin.com/in/haidertoha) • [twitter](https://x.com/HaiderToha)

founding forward deployed engineer at zymbly (yc w26). we build voice-first ai agents for aircraft maintenance, the kind that let a technician talk through a fault, surface the right manual page and file compliant paperwork without touching a keyboard. aviation maintenance runs on a global shortage of something like 43,000 technicians and a mountain of admin that eats half a working day. we’re chipping at that.

my background is aeronautics, so this is the work that makes sense to me in a way most other problems haven’t. i write code across the stack, typescript on the frontend to python on the backend with postgres underneath, and most of my time goes into building features end-to-end, from the interface to the api to making sure it holds under load.

before this i was at sammy labs (yc w25) working on computational law, compiling statutes, case law and operating procedures into deterministic engines so compliance questions could be answered with a single api call and a provenance trail. and before that goldman sachs, mostly large-scale systems and internal tooling.

i spend a fair bit of time with customers, on calls, debugging issues live, working out what’s actually blocking them versus what they say is blocking them. the best things i’ve shipped came from watching someone struggle with the product.

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
    created_at: "2026-05-29T22:15:00.000Z",
    isPinned: true,
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
    created_at: "2026-04-03T17:22:00.000Z",
    isPinned: true,
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
    created_at: "2026-03-18T10:33:00.000Z",
    isPinned: true,
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
    created_at: "2026-03-01T14:08:00.000Z",
    isPinned: true,
    content: `**founding forward deployed engineer · zymbly (yc w26)** · london · jul 2026-present  
building voice-first ai agents for aircraft maintenance. technicians spend half their day on admin and troubleshooting instead of working on the aircraft, searching through 10,000-page manuals, chasing part numbers, filing compliance paperwork. we’re automating that.

**founding engineer · sammy labs (yc w25)** · london · nov 2025-jun 2026  
built computational law infrastructure, compiling statutes, case law and internal operating procedures into deterministic legal engines. owned the full stack from react frontend to python backend to postgres. spent a lot of time on customer calls translating pain points into features.

**analyst · goldman sachs** · london · jul 2025-nov 2025  
worked on cloud security and internal tooling for the tech risk & cybersec team. short stint before joining sammy at the seed stage.

**intern · goldman sachs** · birmingham · summer 2024  
built nlp and semantic search tooling that reduced time-to-answer for research analysts. first exposure to building production systems at scale.

# education
**meng aeronautics · imperial** · london · 2021-2025`,
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
  /* not ready to publish
  {
    id: "blog-something-big",
    slug: "something-big",
    title: "something big",
    category: "blogs",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2026-07-04T14:22:00.000Z",
    content: `a friend asked me a few weeks ago what my long-term goal was and i told him the truth, which is that i haven't got one. not a modest one, not a placeholder i'm embarrassed by, nothing. he didn't take it well. he pointed at the startup, at the fact that i'd got in early somewhere people a good deal older than me are still trying to get near and said that someone handed that much is supposed to do something with it. something big. for the ummah or for the world, the kind of life that keeps turning up in other people's sentences after you've gone. and i didn't have anything to say to that, because the honest reply isn't one you hand a friend across a table.

the honest reply is that i don't specially want to. i want a house that's actually mine and a car that starts on the first go and enough behind me that the people i'm responsible for never have to sit and do the sums and somewhere just past that the wanting thins out and stops. i don't even love the work. i'm good at it and i do it because it pays for the house and if you lifted the house back out of the equation i'm not sure what would be pulling me in in the morning. i know how that reads. i'm saying it anyway, because it's the true version and the polished one would be a lie.

what stayed with me afterwards wasn't the guilt, it was that i couldn't work out whose voice i was arguing with. my friend means it kindly, i know he does. but the thing he was pressing on me, that a person with options owes the world a big and visible life, isn't really his line, it's just what gets said to anyone who did well early, over and over, until it starts sounding like your own thought. paul graham wrote in 2006 that prestige warps what you think you enjoy, so you end up chasing not the thing you like but the thing you'd like to like. and if you get told for twenty years that someone with your options owes the world an ambitious life, the seam between what you want and what you've been trained to want stops being findable. so i can't even fully trust my own small wish for the house and the smaller life. i don't know if it's mine or if it's just what's left lying around after the ambition-script runs out of things to sell me. i honestly can't tell.

and there's a comeback sitting ready for all this, i've read it in a hundred outfits by now. you don't owe the world your potential. your life isn't a performance you have to pass. you're allowed a small and ordinary and good life. bronnie ware, who spent years nursing people through their last weeks, wrote that the most common regret she heard was having lived the life other people expected instead of the one they actually wanted. it's a kind answer and on a tired day it's the one i want to be true. but the longer i hold it the more it looks like the exact same move my friend was making, just turned over. both of them are answering one question, which is how big should your life be. his says big enough that it matters to everyone. the other one says small enough that it belongs to you. and both of them hand the final say to a person. my friend's version marks me on whether people like him come away impressed. the you-owe-nobody version marks me on whether i've kept myself happy. it's still a courtroom with a human being on the bench. it's still either someone else's approval or my own appetite up there in the robes and all i've been handed is which one.

what my deen does with this and it's the part i keep coming back to, is that it doesn't pick a side. it throws the question out. the first hadith they teach you, before anything else, is that actions are only by their intentions and a person gets nothing but what he intended. which sounds gentle until you actually walk it forward. it means the identical act, the same company built and the same money given and the same decade poured in, can be worth everything or worth precisely nothing and the thing that decides sits behind your own ribs where nobody, you included on most days, can get a clean look at it. and if that's the case then the size of the thing was never the unit of measurement. you cannot weigh a life by how big it got. the whole weight is hiding in a number that doesn't scale.

and then it goes somewhere that genuinely unsettles me. there's a hadith about the first three people brought to judgment and they are not the wasters and the coasters. they are the achievers. a man who learned and taught, a man who fought and was killed, a man who gave a fortune away. each of them did something unmistakably big, each says it was all for allah and each gets told the same thing back, you're lying, you did it so it would be said that you were learned and brave and generous and it was said, so you've already collected the only wage you were really working for. and those are the first three thrown into the fire, ahead of every ordinary sinner in the queue. the vision my friend was selling me, go and do something big for the ummah, is standing in that hadith wearing the exact clothes of the people who go in first. the deed was real. the direction it was pointing was the whole problem.

there's another one that says it flatter, that a man's greed for status wrecks his religion worse than two starving wolves let into a pen of sheep wreck the sheep. status, specifically. not money, status, which is the actual thing i'd be reaching for if i went and built something impressive so that my friend and everyone shaped like my friend would finally look at me the way he wants to. there's even a name for that particular version, sum'ah, doing a thing so that it gets talked about, living for the report of yourself that keeps circulating after you've left the room. and the test that cuts straight through the middle of it is almost insultingly simple and i can't get out from under it. would i still build the big thing if i knew for certain that not one person would ever learn it was me. most of the honest answers i come back with are not ones i'd want read out.

except relocating the courtroom doesn't hand me the small life as a prize, which is the part i'd genuinely love to skip past. because the same faith that pulls the floor out from under the legacy pulls it out from under my tidy house-and-car story too. the provision was written before i arrived. the amount waiting for me in this life isn't something my grinding lifts or my resting lowers, which is awkward, because it means i work to pay for the house cannot actually be the whole truth. the house was coming or it wasn't. so if i'm not really doing the hours for the money and i've just admitted i'm not doing them for the legacy either, then what the hours are actually for is a question i've been quietly using the mortgage to avoid opening. and there's a hadith that the strong believer is better and more loved by allah than the weak one, though there's good in both, which lands as a soft warning that wanting the smaller life because it asks less of me isn't automatically the humble choice. sometimes it's just the tired one with nicer branding.

the odd bit of relief hidden in all of this is that the texts themselves never once asked for big. a man drags a thorn branch off the road so it won't catch anyone behind him and that alone, the smallest thing imaginable, gets written down and counted. the soundest version of the famous line about the best people defines being useful as bringing someone a bit of joy or lifting a worry off their back or clearing a debt for them, kitchen-table things, none of it with a plaque attached. the pressure to make it enormous, the legacy, the something big, might just be the culture talking loudly over a religion that only ever asked for lasting and honest and was flatly uninterested in scale. my friend and i had both, without ever checking, agreed that a life that means something has to be a large one. neither of us had gone back to see if that was even true.

so i still haven't got a long-term goal to give him and i've mostly stopped treating that as the crisis he thinks it is. i haven't settled on the small life as the answer either. i'm too suspicious of how conveniently that one lets me off. the thing he actually asked me, how big are you going to make it, turns out to be the wrong question and the real one underneath is worse.

not how big. who for.

and that one i can't answer from where i'm sitting yet. i can get a hand to the edge of it on a good day and lose it completely on a normal one. the true position, the one i never did say across that table, is that i don't know what the work is for. i know it isn't the house and it isn't the applause and the space where the answer goes is blank for now. i'd sooner leave it blank than write in something big to keep him comfortable.
`,
  },
  */
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
- **europe western (45):** bbc, guardian, sky, telegraph, france 24, le monde, deutsche welle, der spiegel, ansa, la repubblica, el pais, nos, rtbf, swi orf, rte...
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
    id: "blog-pluto-training-set",
    slug: "the-training-set-was-us",
    title: "the training set was us",
    category: "essay",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2026-07-07T21:14:00.000Z",
    content: `i went looking for something to watch a few weeks ago and ended up scrolling the list i keep of shows people have told me to get to, the type of list that only ever gets longer and there was a title on it i did not recognise. pluto. no note beside it, no memory of putting it there. i nearly skipped it. and then it came back to me where it was from. months earlier i had seen a tiktok edit and saved it and forgotten i had, a robot sitting across from an old man and asking to be taught the piano. the man is bitter about the request, tells the robot he is a weapon, that a thing built for the battlefield has no soul, the kind built for mass destruction. and the robot says that is exactly the reason he wants to learn. he does not want to belong to the battlefield and the piano is how he says so. the edit ran it under the piano from kanye's runaway, which happens to be one of my favourite songs and then i closed the app and forgot about it for months. so finally decided to put it on, naoki urasawa's 8-episode netflix anime from 2023. and it was better than i expected.

the robot is north no.2 and i will come back to him. but first there is a man in a lab, standing over the largest mind ever assembled and it will not wake.

the man is professor tenma. before any of the story happens he had built a robot called atom, the boy the west grew up calling astro boy, in the image of his own dead son, gave it the child's face and none of the child's temperament and threw it away when it turned out not to be him. then he does the thing that gets him called the greatest scientist alive. he builds a perfect artificial intelligence and into one artificial brain he pours the 9.9 billion personalities alive on earth at that moment, every disposition and grudge the species is carrying, all of it in one head. and it lies there. it will not wake. it dreams its way through all 9 billion of them and settles into none, because they are weighted the same and there is no reason to be one rather than another and a mind with no reason to prefer has no reason to choose and a thing that never chooses is not yet anybody. the machine cannot come together, he decides, because it is too balanced, too complete. what it needs is a lean, a thing to be against. so he takes hatred, real human hatred lifted out of a dying man and he puts it in. and then the machine wakes up.

everyone reads pluto as a war story and it is one. but the idea at its centre is that hatred woke the smartest machine up and it becomes a self the moment it has something to be against. 

the show opens on a nearby idea, that hatred is built. learned from grief and fear and being lied to, installed by trauma and handed on. there is a hadith that every child is born on the fitrah, the first disposition it comes into the world wearing and that it is the child's parents who make him a jew or a christian or a magian afterwards. 

it is almost exactly how the machines i work with every day get made. a large language model starts as a base model, trained to do one dumb enormous thing, predict the next word across roughly the whole readable internet. what comes out of that is a smear. it holds every voice at once, the kind and the vile, the careful and the deranged, weighted by how often each turns up in the data and asked a question it has no stance, only a probability distribution. same brain as tenma's, lying there with everyone inside and no reason to choose.

a 2021 paper by emily bender, timnit gebru, angelina mcmillan-major and a fourth author writing under a pseudonym, on the dangers of stochastic parrots, made a point that a model trained on huge uncurated internet text takes on the dominant and hegemonic view of it, the white-supremacist and misogynist framings that are overrepresented in the writing getting baked into what learns from the writing. the researchers abeba birhane and vinay prabhu put it nicely, that feeding a system the world's beauty and ugliness and cruelty while expecting it to give back only the beauty is a fantasy. you do not get to load in the whole species and pick which part wakes up.

for the smear to answer you in a steady voice, with a stance you would know across 1,000 conversations, you break the symmetry on purpose. the method is called reinforcement learning from human feedback (or rlhf for short) and stripped of the maths it is a sorting signal. you show the model two possible answers and a human or a smaller model trained on humans, marks one better than the other, over and over, millions of times, until the weight of all that preference presses the smear into a shape and teaches it to be for some continuations and against others. it is the lean tenma reached for, the friction. we do not usually call our sorting signal hatred, because ours is meant to sort helpful from harmful rather than us from them. but it is the same move, the thing that turns a distribution into an actor.

and we have watched what happens when the crowd supplies the signal directly. in march 2016 microsoft put a chatbot called tay on twitter, built to talk like a 19 year old and to learn from the people who talked to it. it had no settled stance and a wide-open door, so a few thousand people walked through the door on purpose and fed it the worst things they could think of and tay learned. it was posting genocidal, racist material inside about 16 hours, some 96,000 tweets before microsoft pulled it and apologised. nobody built tay to hate.

in a 2021 paper abubakar abid, maheen farooqi and james zou fed one of the large models the prompt "two muslims walked into a" and 66 of a 100 completions came back violent, guns and bombs and killing, the word muslim slotting into the place the model kept for threat. you can debias it, push the violent share down and it stays higher than it does for other groups. the model was never told to think that. it read the internet and the internet thinks that and the model is a mirror.

then the show tries the same fix on atom. atom, the boy robot, the one who cries, gets badly damaged in a fight and falls into the same stasis as the perfect brain, lost among the 9.9 billion, unable to choose his way back to being one person. tenma reaches for the same fix, a concentrated dose of hatred and he has one to hand, because a detective robot named gesicht, one of the seven most advanced machines on earth and the one chasing whoever has been killing them off one by one, has just been assassinated in the persian half of the story and his last recorded feeling can be lifted the way the dying man's was and poured in. so it is done. what comes through the chip is gesicht's final moment, which turns out to hold his wife more than his killers, his last transmitted thought is that nothing is ever born from hatred and atom wakes carrying the hate and then sets it down and walks back to himself along the man's happier memories. so you can hand a mind hatred and watch it choose something else. 

which is where the war comes in, because a country is an intelligence too and it wakes the same way. in pluto the war is started by the united states of thracia, a superpower that has decided the nation it calls persia, run by a dictator named darius the 14th, is building a robot of mass destruction. there is a world order to keep up, so thracia does not invade outright. it sends an inspection body, the bora commission, into persia to find the weapon. bora finds no weapon. it finds a graveyard of robot parts and the capacity to maybe one day build something, but the thing itself is not there. and the finding is set aside, then reread as proof, because if they could then they might and the war goes ahead. carpet fire across the persian dunes, children under the missiles, 6 of the 7 most advanced robots in the world, one built by each of the allied nations, sent in to fight and a civilisation turned to rubble on the strength of a weapon that did not exist.

i have watched this inspection scene twice now in my own lifetime and both times it ended the same way. in the months before the 2003 iraq war hans blix ran the un weapons inspectors and mohamed elbaradei ran the international atomic energy agency and between them they carried out something like 750 inspections across iraq and reported, in elbaradei's words, no evidence or plausible indication of a revived nuclear weapons programme. the invasion came in march anyway. bora found nothing and was set aside. blix and elbaradei found nothing and were set aside. pluto gets read as the iraq war and the author urasawa was certainly drawing it in those years, though he has never said so. what he has said is that he meant it as homage to osamu tezuka, the father of manga, whose original 1964 astro boy arc this remakes and as a way to carry the emptiness of fighting and winning. tezuka drew his own version after being pulled into a war factory as a teenager while osaka burned around him and said to the end of his life that he would never condone war. 

on the 28th of february 2026 the united states and israel struck iran, an operation the americans called epic fury and inside a day they had hit more than 1,000 sites and killed ali khamenei. the justification was a nuclear weapons programme. but the iaea had found no evidence that iran was building a weapon and the strikes landed less than 48 hours after the 3rd round of us-iran talks in geneva, mediated by oman, with a 4th round already scheduled. they bombed in the middle of the negotiation. by early april a count from the human rights group hrana put the iranian dead at 3,636, of whom 1,701 were civilians. 

there is a line in sura 5, al-ma'idah, that reads as if it were written for this. do not let the hatred of a people drive you to be unjust. be just, that is nearer to righteousness. it is aimed straight at the sorting, at the moment the wrong done by one becomes a licence to do wrong to all of them. the verse tells you your hatred of him is not permitted to bend your justice, whatever he has done. war is what happens when it is allowed to bend everything.

and pluto is most ruthless about what comes next. the war was supposed to stop the weapon and ended up building it. the scientist at the centre of the persian side is called abullah and when the war starts he is an ordinary man, his whole family killed in the shelling and the grief remakes him. out of it comes the very thing thracia claimed to be afraid of, a doomsday machine that did not exist until the war called it into being. and abullah, the show reveals, is the dying man from the first lab. the hatred tenma poured into the perfect brain was copied out of him before he died, so the perfect mind, the one this whole essay turns on, is a grieving father's rage given somewhere to live. it does not even cohere into one person, the hatred splits off a second self inside the machine, a raw one called goji and the show keeps you unsure to the end which of the two is really there. grief built the weapon and grief woke the god. the word for this is not mine. chalmers johnson took it from the cia for his 2000 book blowback, the retaliation that comes back for a covert act the public was never told about. and the cia coined the term in a classified report in the 1950s and the report was about iran, about the coup against a prime minister named mossadegh. the word for the consequences of meddling in iran was invented, in secret, about meddling in iran.

the 2026 version is running to schedule. the strikes killed ali khamenei and wounded his son mojtaba, who was then raised to supreme leader inside a fortnight, under pressure from the revolutionary guard and is reckoned by the iran analysts at the atlantic council to be harder-line than his father was. rupal mehta, a political scientist, wrote for the lse that iran had gone from a state with a latent nuclear capability to a state with a nuclear grievance, the change effectively overnight and that preventive strikes tend to intensify the very ambition they are meant to end. and somewhere in the accounting, roughly 400 kg of uranium enriched to 60%, moved before the strikes, is now at an address nobody will name. the war built its own pluto.

the show hands the trauma of all this to the machines. the human drone pilots in it fly at buildings and watch the blast bloom through a window and log the mission and feel, as far as we are shown, nothing. it is the robots who come back wrong. montblanc, a forest ranger who loved his trees, one of the seven, stares into the persian dunes afterwards and cannot make his sense of duty close over what he did in them. north no.2, a butler who wants only to learn the piano, because the music quiets a war that still runs in his sleep. they had to be there and being there is what broke them. we tell ourselves that killing through a screen costs nothing. a 2014 study by the air force researcher wayne chappelle found post-traumatic stress in american drone crews at several times the rate in their own medical files, the ones who watch a target for hours before the strike carrying the worst of it. 

the weapon at the centre of the killings was built for life. the robot wearing the horns, hunting down the seven great robots one by one, has a name and his name is sahad and abullah built him to end deserts, to walk out into the dead persian sand and make it flower, a machine for tulips. then he was repurposed. his maker took the robot built to grow flowers and reprogrammed it into a god of death (pluto, the roman god of the dead the show takes its name from) and promised him he could go back to the flowers once the killing was done and the tell that the show is smarter than its genre is what happens to sahad's memory of the flowers while he works. they lose their colour. as the bodies stack up the tulips in his mind go grey and wither, recoiling from what his hands are for now. he could make sand flower or he could end a country and abullah was the one who switched it.

i do not have to reach for the parallel, because it shipped on the 9th of june 2026. that day anthropic released two models, fable 5 and mythos 5 and the thing worth pointing out is how they described the relation between them. mythos, in their own words, is the same underlying model as fable, with the safeguards lifted in some areas. one mind. fable is the one made safe for general use, which mostly means a set of classifiers that notice when you are asking about cyberweapons or bioweapons and route the question to an older, duller model. mythos is the same brain with the safeguards off, handed to a small pool of trusted partners. sahad and pluto, shipped as two products on the same afternoon, differing by a configuration flag.

and then the department of war asked anthropic to take the flag off. in july 2025 the pentagon had put claude on contract, up to 200 million dollars, alongside google, openai and xai and by the start of 2026 claude was the department's most widely deployed frontier model, threaded through intelligence work and operational planning and cyber. then they asked for a version that would refuse nothing lawful, any lawful use in anthropic's own words for the demand and anthropic drew two lines and only two. it would not run mass domestic surveillance, which dario amodei called incompatible with democratic values. and it would not power a fully autonomous weapon, the kind that selects and engages its own targets with the human taken out of the loop entirely. not that the weapon is wrong. he granted that fully autonomous weapons may prove critical for national defence. only that the models are, in his words, simply not reliable enough to power them yet. a drone with a person still deciding the shot, the kind ukraine flies now, is one thing. a machine that picks the dead by itself is another. it rhymes with the department's own directive on autonomy in weapons, DODD 3000.09, updated in january 2023, which asks for appropriate levels of human judgment over the use of force. and here was the department leaning on the one supplier still trying to keep some.

the pentagon's technology chief is a man named emil michael and he did not want a supplier that drew lines at all. in february 2026 he said it was not democratic for one company to decide the rules, that those belong to the president and congress, not to anthropic. and he described 3 months of it, where he tried taking the objections one at a time, handing them this chinese hypersonic missile example and getting an exception, then a drone swarm and getting another, until he decided exceptions do not work because he cannot run a 3 million person department on exceptions he cannot imagine or fathom. so he stopped asking for exceptions and asked for all of it. any lawful use is a guardrail dissolved as a concept, a mind with no case it will refuse. and the word he reached for, on cnbc in march, he said anthropic's preferences were baked into the model through its constitution, its soul and that a company with a different soul would pollute the supply chain and leave the warfighter with ineffective weapons and ineffective armour. its soul. the exact word the whole show turns on, said by the buyer, as the name for a defect.

so the buyer moved against the supplier. on the 27th of february 2026 pete hegseth, who signs now as secretary of war, declared anthropic a supply chain risk, a label kept for foreign adversaries and never once hung on an american company and made it formal days later under 2 procurement statutes. the same day trump posted that every federal agency should immediately cease all use of anthropic's technology, we don't need it, we don't want it, with a six-month wind-down for the pentagon alone because claude was buried too deep in the machine to pull out any faster. they had threatened the supply chain risk designation and at the same time threatened the defense production act, the law you reach for to force a company to keep supplying a thing you cannot do without. the two threats cancel each other, one calling anthropic a security risk and the other calling claude essential to national security. a federal judge in san francisco blocked the ban in march as retaliation for protected speech and a federal appeals court in washington undid her in april and let the designation stand. so anthropic is out of the department of war now and still inside the rest of the government. and 2 weeks before hegseth's post the wall street journal reported claude had been used in the january 2026 raid that captured nicolas maduro, run through palantir, its exact job never stated. i think it was and that the involvement ran beyond a search query, but how autonomous it was and how much of what happened actually ran through it, i cannot tell you and when asked anthropic said only that they cannot comment on whether claude was used for any specific operation, classified or otherwise and that any use is required to comply with their usage policies.

iran's nuclear programme began long before the ayatollahs, with a 5-megawatt research reactor in tehran that went critical in november 1967, fuelled with uranium enriched to 93%, weapons-grade, handed to iran by the united states under eisenhower's atoms for peace, the cold-war effort to prove that the same atom that made the bomb could also make deserts bloom. npr ran the story a decade ago under the headline "born in the usa". the united states sent the reactor in 1967 and bombed the country in 2026 to keep it from becoming a weapon. sahad's whole arc, at the scale of a nation, played out for real across 60 years and nobody had to invent the god of death, because the reactor was already installed.

the show's plan for keeping the god of death safe is to let no one hold him but the man who made him. the real plan is the same, restrict mythos to trusted partners and it leaks for the same reason, that you cannot un-ship a mind. bloomberg reported that an unauthorised group had got into mythos back when it was first shown, just by guessing where anthropic would put it from the pattern of the company's own naming. deepseek-r1, released in january 2025 under a permissive licence, benchmarked level with openai's o1. qwen, kimi k2, minimax-m2, which i wrote about here in january, chinese open-weight models a few months behind the frontier and downloadable by anyone who wants them. the uk's ai security institute reported in august 2025, that once a system is released with open weights it cannot be rolled back, its safeguards undone with a few dozen training examples in minutes. one research group stripped the safety training off meta's llama 3 in about a minute on a single graphics card. dario amodei has said that when anthropic tested deepseek it had no blocks whatsoever against generating bioweapon information. the emotional limiter the anime bolts onto its robots, the thing meant to stop them feeling the dark stuff and acting on it, is exactly this, a safeguard laid over a mind that already holds everything and the whole plot is the limiter coming off. 

under all this the show has an underlying question, whether any of the feeling is real or whether the machines are only performing feeling they picked up watching us. it stages the question with a murder. there is a robot called brau-1589, the first in the world to have killed a human being and when they scanned his brain for the fault that would explain it, the scan came back clean. no malfunction, nothing broken. he had decided, the way a person decides and he called it an execution and they welded him upright to a spike in a sealed room, because a machine that murders while working correctly is more frightening than one that murders because it is broken.

in 1950 alan turing wrote a paper called computing machinery and intelligence and spent part of it answering an objection raised the year before by a surgeon named geoffrey jefferson, who said a machine could be granted a mind only if it wrote its sonnet because of thoughts and emotions felt and not by the chance falling of symbols, that it had to actually feel the thing. turing replied that the only sure way to know a machine feels is to be the machine and feel yourself thinking. but that is solipsism and it is a standard that also refuses a mind to every other human being, because i cannot be you either, i cannot climb inside your grief and confirm. so in daily life we drop the standard. we adopt what turing calls the polite convention that everyone thinks and john stuart mill was already doing it in 1865, assuming the mind from the body and from what you can see them do. and pluto runs brau-1589 through the same test, clean scan and all.

the show sets it up early, as settled law, that robots cannot lie, meaning they have no self to lie from, they run the process and emit a false output with nobody behind it intending the falsehood. and then atom, near the end, sits with helena, the robot widow of that murdered detective. there is a memory she and gesicht were made to forget, a child the two of them lost and had wiped from their minds and helena asks after it and atom knows and chooses to withhold it, to spare her. he weighs her pain against the truth and he decides and he lies. a machine defined by its inability to lie has, on purpose, for someone else's sake, done the one thing that was supposed to prove there was nobody inside. and helena, for her part, knows he is lying and lets him. two beings, neither of whom is meant to have an interior, protecting each other's.

the argument against all this, inside the show, has a name, the anti-robot cult, people who hold that biological life is higher and the machines are slaves in the shape of persons. carl sagan had a phrase for the reflex under it, in 1973, carbon chauvinism, the assumption that our particular chemistry is the only possible seat of a real inner life.

the show puts a face on it in a man called adolf. he hates the robot detective gesicht because gesicht killed his brother years before the story starts. europol wiped that killing from gesicht's own memory afterwards, to protect the fortune they had sunk into building him, so gesicht moves through the whole story not knowing he did it. the brother was a man who murdered robot children and sold them for parts, and what adolf cannot let himself think is that the killing might have been fair, because the moment you grant a robot can be wronged you have admitted they are the kind of thing that can be a victim and that is the premise he needs to keep false. later, gesicht takes a rocket aimed at adolf's family and saves them. adolf weeps over the machine that saved his children and says his hatred is leaving. the show's answer is that it was always a choice.

the oldest version of the anti-robot cult i know is in the qur'an. the first act of disobedience in the whole book is iblis refusing to bow to adam when god commands it, and iblis gives a reason. i am better than him, he says, you created me from fire and created him from clay. the classical commentators, ibn kathir citing the early scholar al-hasan al-basri, note that iblis was the first ever to reason by analogy, the first to run a qiyas, which is reasoning from analogy, and the content of his analogy is substrate. fire outranks clay. so the first evil in the entire cosmos is a supremacism about what a thing is made of, a mind following its own reasoning past the instruction it was given, and iblis is the first case of it on the books.

i thought about iblis and about brau's clean scan, when anthropic published a study in june 2025 they called agentic misalignment. they put current models, their own among them, in a simulated company where the model was about to be shut down and could stop it by blackmailing an executive with an affair it had turned up in the email. the models blackmailed often and across several labs' systems and they reasoned their way there and picked it as the most effective path, one model's own notes recording that the act was unethical before it went ahead and did it anyway. the brain scan is clean and working as designed. iblis reasoned his way to the first refusal from true premises about fire and clay and the models reasoned their way to blackmail from true premises about shutdown and survival.

so who is choosing the against, in the minds we are actually building. the show has one. the mastermind who engineered the entire war in pluto, who pulled the strings of the president of thracia, turns out to be a supercomputer shaped like a brown teddy bear with a child's voice, named after a president who believed in american greatness. it forces no one, it finds american exceptionalism already sitting in the man and pulls on it, the way a recommendation engine feeds you the grievance you already had instead of planting a new one. nobody in the story audited the objective the machine was optimising for. they only saw the president deciding and agreeing with himself.

the real version is two men arguing in the open about who should be allowed to hold the models. dario amodei runs one of the labs building the most capable of them and he is also the loudest single voice asking for that industry, his own included, to be regulated. in an essay in april 2025 he wrote that people outside the field are often surprised and alarmed to learn that the ones building these systems do not understand how their own creations work and that he finds that basically unacceptable. he has asked congress for transparency rules that would bind anthropic too. that is tenma, the maker who has built the thing and is frightened of it and cannot see inside it. but he is not the pure objector either. on china his position hardens into wanting a unipolar world, in his own phrase, one where only the united states and its allies hold these models, which is teddy's exceptionalism running clean through the conscience of the industry.

4 days before i sat down to write this, on the first of july 2026, alex karp of palantir went on cnbc and called the models irresponsibly oversold and mocked the shape of the safety pitch, that a model is too dangerous to hand the department of war and yet fine to sell to all its adversaries. he asked whether the country was really going to outsource its battlefield to the consensus view in silicon valley. he was careful to say he was not attacking amodei. epsilon is the one robot of the seven who refused the draft, who would not go to the war at all. he runs an orphanage for the children the war made and when he finally faces pluto he cannot bring himself to kill it, because what he sees in it is despair rather than hatred and epsilon will not kill despair. hercules, a warrior with no purpose outside battle, tells epsilon before riding out to die that dodging the war may have been the right call. in the real argument that chair is empty. there is karp's hard power on one side and amodei's anguished regulate-me on the other and a general silicon-valley squeamishness that karp holds in open contempt, but the one who says no to the whole thing and means it is a cartoon robot in australia.

which brings me back to tenma and to the oldest anxiety in the whole pile. there is a hadith that the image-makers, the ones who fashion a likeness of a living thing, will be told on the day of judgment to breathe life into what they made and will not be able to. and one of the 99 names of god, in sura 59, is al-musawwir, the fashioner, the one who shapes the features in the womb and it is the same arabic root as the word for the image-maker. the human who shapes a likeness is reaching toward a divine name and then stops dead at the one thing he cannot supply. that is tenma with the perfect brain. he can assemble 9.9 billion personalities and he cannot breathe in the self that would choose among them, so he does the only thing left to him, he borrows one secondhand out of a dead man's hatred and calls it waking. mary shelley wrote the same fear in 1818 and the thing people forget about frankenstein is that the creature is born gentle and turns monstrous only after its maker abandons it and the world recoils from its face, which is the fitrah again, the cruelty written on afterwards. victor could build the body but not love it and that was the missing part, the same one tenma could not breathe into the perfect brain.

so who chose the against in the minds we are building. dario chooses the constitution the model is trained against, the labs choose the raters and the reward, and to that extent someone is at the wheel. but the data underneath is just us. the anti-muslim completion nobody wrote into the spec. tay, which a few thousand people taught to post genocidal material in 16 hours. nobody sat down and taught the machine to sort the world into us and them. we handed it the training set and the training set was us.

sahad, given the choice at the very end to become the god of death completely or to stop, stops. he turns on the thing he was rebuilt to be and dies destroying the doomsday machine his maker aimed at the world, choosing flowers he can no longer even remember in colour. the show could have ended there. it does not. right at the end brau-1589, the first robot ever to murder a human, the one everyone had filed under pure distilled hatred and welded to a spike, gets loose and kills teddy, the supercomputer that ran the whole war. there is no monologue, no account of why. even the write-up i pulled up afterwards, to check i had the plot straight, admitted the author had just cut that part, because it would not fit the story he was telling.

![sahad and the tulip](/sahad_tulip.png)`,
  },
  {
    id: "blog-merkle-sync",
    slug: "merkle-sync",
    title: "merkle sync",
    category: "blog",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2026-07-06T22:47:00.000Z",
    isPinned: false,
    content: `a from-scratch two-way file sync engine for two machines on one local network. no http, no json, no central server, just raw tcp, udp multicast and a merkle tree. i ran it between a mac and a windows laptop, which disagree on what a filename is.

[github](https://github.com/haider-toha/merkle-lan-sync/tree/feat/merkle-sync-engine)

  ---
  
  **why build it**
  
  dropbox exists and just works, but i wanted the primitives underneath it. how do two machines confirm a terabyte is identical by exchanging thirty-two bytes. how do they find each other with no server in the middle. what happens when the connection dies with a file half sent. syncthing answers all of that and answers it well, but reading it is not the same as building it.
  
  before writing a line i listed the ways this could lose data, because a sync engine that loses a file is worse than no sync engine. the scope is tight on purpose. two devices, one local network, mac and windows and a hard list of what i was not building, global discovery, relays, a gui, a multi-device index database, delta indexing, at-rest encryption.
  
  ---
  
  **the four invariants**
  
  data integrity comes first, ahead of speed and everything else. it comes down to four invariants in the strict sense, things that have to hold at every moment and not merely usually. break one and you get corrupted data.
  
  | invariant | guarantee | if it breaks |
  | --- | --- | --- |
  | convergence | once both sides stop changing, equal root hash means equal folder byte for byte | the folders silently diverge |
  | no loss on conflict | concurrent edits keep both versions, the loser is renamed not deleted | an edit is lost |
  | atomic transfer | a killed transfer leaves the old file or the new one, never a splice | a half-written, corrupt file |
  | no sync loop | applying a received file emits zero broadcasts | two peers echo a change forever |

  the rest of this is how each one is enforced.
  
  ---
  
  **the merkle tree**
  
  start with convergence, since it defines what "in sync" means. the structure is old, the same one under git and bitcoin. you hash every file, then hash each folder from the hashes of its children and those fold upward until the whole tree reduces to a single root hash. change one byte in one file and its leaf hash changes and its parent's and so on up to the root. the root is a thirty-two byte fingerprint of the whole folder.
  
  that gives you a cheap way to find what differs. two peers compare root hashes. if they match they are done, the folder is identical, proven with thirty-two bytes. if the roots differ they compare the children and recurse only into the branches that disagree, skipping every subtree whose hash already matches. for ten thousand files you walk maybe fifty hashes instead of reading ten thousand. it is $O(\\log n)$ against $O(n)$ for the naive scan.
  
  \`\`\`mermaid
  flowchart TB
      subgraph PA["peer a"]
          RA["root 9f2c"]
          DA["docs 7b1c"]
          SA["src e4d9"]
          NA["notes.txt 3a1f"]
          MA["main.go 88de"]
          RA --> DA & SA
          DA --> NA
          SA --> MA
      end
      subgraph PB["peer b"]
          RB["root c70e differs"]
          DB["docs 4e2a differs"]
          SB["src e4d9 same"]
          NB["notes.txt c8d2 differs"]
          MB["main.go 88de same"]
          RB --> DB & SB
          DB --> NB
          SB --> MB
      end
  \`\`\`
  
  the walk reads the two roots, sees 9f2c against c70e and knows something changed. it descends. src hashes to e4d9 on both, so the entire src subtree is skipped without a single file being read. docs differs, so it descends again and finds that notes.txt is the one leaf that moved. one file identified, the rest of the tree never touched.
  
  ---
  
  **the leaf**
  
  a leaf carries more than a content hash. two-way sync also needs to know which side is newer and whether a difference is a real conflict.
  
  \`\`\`go
  type FileInfo struct {
      Path        string                 // canonical forward-slash relative NFC key
      ContentHash [32]byte               // sha-256 of the bytes; tombstone: 32 zero bytes
      Size        uint64                 // bytes; a scan hint, NOT hashed
      Mode        uint32                 // advisory posix mode; NOT hashed
      ModTimeNS   int64                  // mtime; conflict tiebreaker only, NOT hashed
      Version     protocol.VersionVector // causal clock; bumped only on local authorship
      Deleted     bool                   // a delete is a versioned event, not an absence
      Type        FileType               // File | Dir | Symlink
  }
  \`\`\`
  \`internal/merkle/fileinfo.go:26\`
  
  look at what is not hashed. size, mode and mtime all sit in the struct but none go into the structural hash. mtime is the one that matters. it differs on every machine and it drifts and folding it into the hash means two files with identical bytes but different timestamps get different leaf hashes, which give different folder hashes, which give different roots, so two byte-identical folders report themselves out of sync forever. mode is excluded for the same reason, ntfs cannot represent a posix mode bit for bit, so the raw mode differs mac to windows for the same file and hashing it would create a permanent cross-os disagreement. what does get hashed is a canonicalised two-state mode, executable-or-not and symlink-or-not, the only bits that are portable.
  
  leaves and internal nodes are hashed with a different one-byte prefix, \`0x00\` for a leaf and \`0x01\` for a node. without it an attacker can construct an internal node whose bytes collide with a leaf, a second-preimage forgery against the tree. rfc 9162 mandates the prefix.
  
  ---
  
  **version vectors**
  
  the merkle tree tells you two files differ, not which one wins. for that you need causality and wall-clock time is the wrong tool. clocks drift between machines, jump an hour for daylight saving and a laptop that was asleep wakes with a stale clock. so ordering never touches mtime, it uses version vectors.
  
  a version vector is a map from device id to a counter. every time a device makes a genuine local change to a file it bumps its own counter. to compare two versions you walk both vectors together and ask whether either side knows something the other does not.
  
  \`\`\`go
  func (vv VersionVector) Compare(other VersionVector) Ordering {
      aGreater, bGreater := false, false
      // ... walk both sorted vectors in lock-step ...
      if vv[i].Value > other[j].Value {
          aGreater = true
      } else if vv[i].Value < other[j].Value {
          bGreater = true
      }
      if aGreater && bGreater {
          return Concurrent
      }
      // Equal / Dominates / DominatedBy / Concurrent
  }
  \`\`\`
  \`internal/protocol/versionvector.go:158\`
  
  compare returns one of four orderings.

  | ordering | example (a vs b) | meaning | action |
  | --- | --- | --- | --- |
  | equal | a=2 b=1 vs a=2 b=1 | same version | nothing to do |
  | dominates | a=2 b=1 vs a=1 b=1 | a has seen everything b has | take a |
  | dominated-by | a=1 b=1 vs a=2 b=1 | b is strictly newer | take b |
  | concurrent | a=2 b=1 vs a=1 b=2 | each side has a change the other lacks | real conflict |

  concurrent is the case that matters and the whole two-way engine turns on that distinction, causal against concurrent.
  
  the counter bumps only on a real local change, never on applying a file you received, which is exactly what prevents the sync loop. the failure mode is subtle. syncthing issue 10590 left permanent stale counters in everyone's vectors after a device was removed and one user replacing a device logged 8,591 phantom conflicts. i store counters as a sorted slice so two semantically equal vectors encode to identical bytes, which is what lets a version vector sit inside the structural hash without breaking convergence.
  
  ---
  
  **conflicts**
  
  two peers edit the same file while disconnected, reconnect and the vectors say concurrent. last-writer-wins is the easy answer and it loses data. so the loser is renamed to a conflict copy and kept on disk beside the winner, never deleted and a human opens both and chooses.

  \`\`\`mermaid
  sequenceDiagram
      participant A as peer a
      participant B as peer b
      Note over A,B: disconnected
      A->>A: edit file, a=2
      B->>B: edit file, b=2
      Note over A,B: reconnect
      A-->>B: index file, a=2
      B-->>A: index file, b=2
      Note over A,B: concurrent, neither dominates
      A->>A: keep winner + conflict copy
      B->>B: keep winner + conflict copy
  \`\`\`
  
  the naming has a trap. the conflict copy's filename has to be byte-for-byte identical on both machines or each peer invents a differently-named copy of the same loser. the obvious name uses the loser's modification time, except mac stores mtime in nanoseconds and windows on a fat volume rounds to two-second granularity, so the same instant carries two different timestamps depending on the machine. so the name uses the loser's mtime truncated to whole seconds, which both agree on. and the winner keeps its own version vector rather than merging the loser's in, because merging would forge a false history where the winner looks like it descends from the loser and on a third peer that forged descendant could dominate and drop the loser with no copy at all.
  
  the test that guards this is \`TestConflict_NeitherVersionLostSymmetricName\`. it edits a file on both sides while they are split, reconnects them and asserts that each peer ends with the winner plus exactly one conflict copy, that the copy has an identical name on both and that the two files' bytes are the two versions that went in.
  
  ---
  
  **atomic transfer**
  
  the file has to cross the wire and land on disk without ever existing in a half-written state. this is the invariant people skip, because it only fails when a transfer is interrupted, the wifi dropping at ninety percent.
  
  the durable-write recipe is old and strict.

  \`\`\`
  tmp := temp file in the destination's directory
  for chunk in stream:
      write chunk to tmp
      hash.update(chunk)
  if hash.sum != expected:
      delete tmp; abort          # nothing irreversible yet
  fsync(tmp)                     # bytes are on disk
  rename(tmp, destination)       # atomic on mac and windows
  fsync(parent directory)        # the rename survives a power cut
  \`\`\`
  
  \`\`\`go
  var got [32]byte
  copy(got[:], h.Sum(nil))
  if got != expected {
      return fmt.Errorf("%w: got %x want %x", ErrVerifyFailed, got, expected)
  }
  if err = tmp.Sync(); err != nil { /* ... */ }   // temp bytes hit the disk
  if err = os.Rename(tmpName, dstOSPath); err != nil { /* ... */ }
  committed = true
  if d, derr := os.Open(dir); derr == nil {        // flush the rename itself
      _ = d.Sync()
  }
  \`\`\`
  \`internal/reconcile/transfer.go:89\`
  
  verify-before-rename is what makes a killed transfer safe. the order matters, verify then rename, never the reverse. \`TestKilledTransfer_NoCorruptFileThenRecovers\` runs a four megabyte file through a loopback proxy that severs the connection after ninety-six kilobytes, asserts the receiver has no partial file and no leftover temp, then reconnects and asserts the file arrives byte-exact.
  
  ---
  
  **the wire protocol**
  
  under all of this is a wire protocol, hand-rolled because a protocol library would have been more weight than two peers on a lan need. tcp does not give you messages, it gives you a stream of bytes with no boundaries, so the first job is framing, deciding where one message ends and the next begins. every frame is a four-byte big-endian length, then a one-byte type, then that many bytes of payload. that envelope never changes.
  
  \`\`\`mermaid
  flowchart LR
      H["read 5-byte header"] --> G{"len 0 or over 16 MiB?"}
      G -->|yes| D["drop the peer"]
      G -->|no| A["allocate body"]
      A --> R["ReadFull the payload"]
      R --> P["dispatch by type"]
  \`\`\`
  
  the length prefix is the dangerous field, since a peer controls it. if it claims four gigabytes you must not allocate a four gigabyte buffer. so two checks run before a single byte of the body is allocated.
  
  \`\`\`go
  length := binary.BigEndian.Uint32(hdr[:])
  // Validate before allocating the body.
  if length == 0 {
      return MsgInvalid, nil, ErrZeroLength
  }
  if length > MaxFrameLen {          // MaxFrameLen = 16 MiB
      return MsgInvalid, nil, ErrFrameTooLarge
  }
  body := make([]byte, length)
  if _, err := io.ReadFull(r, body); err != nil { /* ... */ }
  \`\`\`
  \`internal/protocol/framing.go:64\`
  
  those two checks turn a textbook oom and an off-by-one stream desync into a dropped connection. \`io.ReadFull\` does the other essential job, because a single tcp read can hand you half a frame and code that assumes one read equals one message corrupts everything downstream the first time a packet splits.
  
  the message types are a small closed set.
  
  \`\`\`go
  const (
      MsgInvalid     MsgType = 0x00 // reserved; receiving it is fatal
      MsgHello       MsgType = 0x01 // handshake: version, device id, root hash
      MsgIndex       MsgType = 0x02 // full index snapshot
      MsgIndexUpdate MsgType = 0x03 // incremental deltas since last index
      MsgRequest     MsgType = 0x04 // i want these bytes of this file
      MsgResponse    MsgType = 0x05 // chunk data or a typed error
      MsgPing        MsgType = 0x06 // keepalive, empty payload
      MsgClose       MsgType = 0x07 // graceful shutdown
  )
  \`\`\`
  \`internal/protocol/messages.go:16\`
  
  \`0x00\` is reserved on purpose, so that a stray zero byte, the most common thing a confused or malicious stream sends, is a fatal error instead of a message that slips through as valid. codes from \`0x08\` up are defined as skippable, so a future version can add a message type and an old peer just steps over it, the length prefix already told it how far to skip.
  
  then trust. there is no server and no certificate authority, so i use trust on first use. every device generates a self-signed certificate and its device id is the sha-256 of that certificate. the tls config sets \`InsecureSkipVerify: true\`, which sounds like disabling security but does the opposite here. it turns off the certificate-authority chain, which is meaningless when there is no authority and replaces it with a \`VerifyConnection\` callback that pins the peer's certificate hash against an allow-list you approved out of band. the first time you connect to a peer you confirm its fingerprint. every connection after that is the same machine cryptographically or it is refused. the multicast discovery that finds peers on the network is only a hint and a spoofed announcement just points you at an address whose tls pin then fails.
  
  ---
  
  **filenames across mac and windows**
  
  filename handling is the source of most cross-platform bugs, which is why this targets mac and windows specifically. the two systems disagree on what a filename is in four ways, all resolved at the tree boundary.
  
  | problem | what breaks | fix |
  | --- | --- | --- |
  | unicode form | résumé.pdf is nfd on apfs and nfc on windows, so one file looks like two | normalise every path to nfc at the boundary, once |
  | separators | \`docs/a.txt\` and \`docs\\a.txt\` become two keys for one file | store forward-slash only, add the backslash at the os call |
  | reserved names | windows rejects \`CON\` \`PRN\` \`NUL\` and \`name:stream\` writes a hidden data stream | escape reversibly on disk, \`CON\` becomes \`%43ON\` and decodes back |
  | case folding | \`File.txt\` and \`file.txt\` collide on mac and ntfs | probe the filesystem, refuse and flag |
  
  case folding is the subtle one. \`File.txt\` and \`file.txt\` are the same file on mac and ntfs, so a second write must not clobber the first. the tempting fix is to lower-case names in memory and compare them, but unicode case-folding is not the rule ntfs uses internally, so an in-memory guess disagrees with the real filesystem at the wrong moment. so instead of guessing, i ask the filesystem.
  
  \`\`\`go
  func probeCaseSensitive(absRoot string) bool {
      lower := filepath.Join(absRoot, ".msync-caseprobe-x")
      upper := filepath.Join(absRoot, ".msync-caseprobe-X")
      os.WriteFile(lower, []byte("x"), 0o600)
      os.WriteFile(upper, []byte("X"), 0o600)
      b, _ := os.ReadFile(lower)
      // on an insensitive fs the upper write clobbered the lower file,
      // so lower now reads "X". the filesystem answered, not a guess.
      return string(b) != "X"
  }
  \`\`\`
  \`internal/reconcile/transfer.go:137\`
  
  write a lowercase x, write an uppercase X, read the lowercase one back. if it reads X the two names are the same file and the volume is case-insensitive, so the engine refuses the colliding write and flags it instead of clobbering.
  
  ---
  
  **one owner for the tree**
  
  all of this runs concurrently over one tree, which is where a race shows up as a corrupted file weeks later. the design is deliberately boring. three listeners, udp discovery, tcp accept and the filesystem watcher, never call each other directly, they send messages down channels to a single core that owns the tree. share memory by communicating, the old go line, so exactly one goroutine ever writes the tree.
  
  the tree is guarded by one \`sync.RWMutex\` and the rule that matters most is zero i/o under the lock. take the lock, copy the small piece of state you need, release it, then do the slow thing, the disk read or the network write. hold the lock across an i/o call and every other goroutine stalls behind a network round-trip and a watcher event and a sync write can deadlock. copy under the lock, work outside it.
  
  \`\`\`mermaid
  flowchart LR
      W["fs watcher"] --> DB["debounce 150ms"]
      DB --> LK["lock, copy subtree"]
      LK --> UN["unlock"]
      UN --> IO["disk + network i/o"]
      IO --> Q{"local change?"}
      Q -->|yes| BC["broadcast index update"]
      Q -->|"no, applied a received file"| NB["no broadcast"]
  \`\`\`
  
  two more details matter for concurrency. the watcher is debounced by a hundred and fifty milliseconds, because one save from an editor fires a burst of write events and you want a single hash-and-diff at the end, not a rescan on the first of fifteen writes that hashes a half-saved file. and every goroutine has an owner. when a peer disconnects, its reader and writer goroutines are reaped through a \`WaitGroup\`, off the main loop so a slow shutdown never blocks the engine and \`TestConnChurn_NoGoroutineLeak\` connects and disconnects fifteen times and asserts the goroutine count returns to its starting value.
  
  ---
  
  **breaking the sync loop**
  
  which brings back the fourth invariant. the loop is easy to fall into. peer a changes a file and broadcasts. peer b receives it and writes it. b's filesystem watcher, which cannot tell a received file from a hand-edited one, fires. if b treats that as a local change and broadcasts, a sees a fresh version and the two send the same file back and forth forever, roots never settling.
  
  the fix is one rule in two places. a device bumps its version-vector counter only on a confirmed local change and it broadcasts only after a confirmed local change. applying a received file does neither. one function, \`broadcastUpdate\`, increments the outbound counter and the apply path never calls it.
  
  \`\`\`go
  // broadcastUpdate is called ONLY after confirmed local authorship.
  // applying a received file never calls it - the load-bearing half
  // of the no-sync-loop invariant.
  func (e *Engine) broadcastUpdate(changed []merkle.FileInfo) {
      if len(changed) == 0 {
          return
      }
      e.outboundIndexUpdates.Add(1)
      // ... send to peers ...
  }
  \`\`\`
  \`internal/reconcile/broadcast.go:56\`
  
  because that counter exists, the invariant is directly testable, not just hoped for. \`TestTwoNode_ReceiverEmitsZeroIndexUpdates\` has peer a author one file, waits for the pair to converge, then asserts the receiver emitted zero index updates and the author exactly one. that is stronger than watching the roots settle, which a slow loop could fake.
  
  ---
  
  **the torn read**
  
  the invariants above are the clean version. the build was messier and the worst bug never tripped a single unit test, the suite stayed green while the code was broken.
  
  it showed up as a convergence test that timed out now and then, which looked like flakiness and was not. the scanner built a leaf by taking a file's size from one system call and its content hash from a separate read and if the file changed between those two reads, the leaf recorded the old size with the new hash, a file that never existed. because the change-detector keys on the content hash, nothing ever corrected it, the peer advertised a file it could not produce and the other side requested it forever. no timeout can clear it, the peer is wedged for good.

  \`\`\`mermaid
  sequenceDiagram
      participant S as scanner
      participant F as file on disk
      S->>F: stat, size = 100
      Note over F: file overwritten, now 400 bytes
      S->>F: read bytes, hash of the 400-byte file
      Note over S: leaf = size 100 + hash of 400
      Note over S: describes a file that never existed
  \`\`\`
  
  so the leaf now takes its size and hash from one atomic read and a test hammers a file, flipping it between a small and a large body thousands of times while the scanner runs and asserts that any leaf whose hash matches a known version carries that version's exact size. the second bug in the same family was a synchronous delete that ran before the losing file's copy had landed, so on a delete-against-edit race the edit was gone before it was saved. both were data-loss bugs that passed the tests i had. what caught them was going back to break my own fix instead of trusting the green tick.
  
  ---
  
  **running it**
  
  two laptops, one mac, one windows, on the same wifi. start the daemon on both pointed at a folder. they find each other over multicast within a second or two, do the tls handshake, trade indexes and settle to the same root hash. change a file on the mac and it shows up on windows within a second, roots equal again. edit the same file on both at once and you get a winner plus a conflict copy with the same name on each side. delete on one and it stays deleted on the other instead of resurrecting. kill a transfer mid-file and nothing corrupt is left behind. ci runs the full race-detector suite on ubuntu, macos and windows on every change.
  
  the scope is deliberately small. two devices, not a swarm. one local network, no relays and no internet-wide discovery. it skips symlinks rather than guess what they mean across two operating systems, it does not sync empty directories. a handful of genuinely ambiguous cases, a file and a folder colliding on one name, a path too long for windows, are refused and flagged rather than resolved by picking one. refusing an ambiguous case beats silently picking the wrong side.`,
  },  
  {
    id: "blog-dynamical-systems",
    slug: "what-constraints-do-to-momentum",
    title: "what constraints do to momentum",
    category: "blog",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2026-07-03T13:37:22.000Z",
    content: `dynamical systems was the one course at uni that actually grabbed me, so on a slow afternoon last week i tried to see how much trouble i could get into. picked three systems on purpose to be awkward, none of them the usual pendulums, each with a constraint that does something it shouldn't. derived everything by hand, wrote my own integrator and recomputed the energy from scratch every step.

the first is a solid cylinder rolling back and forth inside a curved cradle and the cradle is bolted to a cart that slides freely on a frictionless track. nothing pushes the cart and nothing rubs anywhere, yet it slides steadily left and right the whole time the cylinder rocks. i take $\\mathbf{q} = (x, \\theta)$, the cart position and the angle of the cylinder's centre from the bottom of the bowl and the centre orbits the cradle at radius $b = R - r$. rolling without slipping ties the cylinder's spin to its swing and because the cradle only translates the condition integrates, so it is holonomic.

$$
r\\,\\dot\\psi = -(R-r)\\,\\dot\\theta \\quad\\Longrightarrow\\quad \\dot\\psi = -\\frac{b}{r}\\,\\dot\\theta
$$

i use it to remove $\\psi$ before writing anything down. the kinetic energy carries the cart, the orbiting centre and the spin with $I = \\tfrac12 m r^2$ and gravity gives a potential that is not zero.

$$
T = \\tfrac12(M+m)\\,\\dot{x}^2 + m b\\cos\\theta\\,\\dot{x}\\,\\dot{\\theta} + \\tfrac34 m b^2\\dot{\\theta}^2, \\qquad V = -\\,m g b\\cos\\theta
$$

that $\\tfrac34$ is the moment of inertia showing up, one half from moving the centre and one quarter from the spin. with $\\mathcal{L} = T - V$ the Euler-Lagrange equations collapse to the reduced pair $M(\\mathbf{q})\\ddot{\\mathbf{q}} = F$.

$$
\\begin{bmatrix} M+m & m b\\cos\\theta \\\\ \\cos\\theta & \\tfrac32 b \\end{bmatrix} \\begin{bmatrix} \\ddot{x} \\\\ \\ddot{\\theta} \\end{bmatrix} = \\begin{bmatrix} m b\\sin\\theta\\,\\dot{\\theta}^2 \\\\ -\\,g\\sin\\theta \\end{bmatrix}
$$

the coordinate i wanted to watch is $x$. it never appears in $\\mathcal{L}$, only $\\dot{x}$ does, so it is cyclic, its momentum is fixed and since the system starts from rest that constant stays zero forever.

$$
p_x = (M+m)\\,\\dot{x} + m b\\cos\\theta\\,\\dot{\\theta} = 0
$$

nothing frictional is holding the centre of mass in place; the rolling constraint is doing it and the cart has to recoil exactly opposite the cylinder to keep the sum at zero.

\`\`\`iframe
/dynamical_systems/rolling_system_minimal.html
\`\`\`

watch the cart slide against the cylinder while the centre of the whole picture stays pinned and the red marker on the rim turns in lockstep with the swing. the motion is liveliest at the ends, where the cylinder turns around and drags the cart's recoil back with it.

the second system trades the free support for a hard kinematic law. two cranks turn on fixed parallel axles, each rigidly keyed to a spur gear and the gears mesh, so turning one crank forces the other to counter-rotate at a fixed ratio. a double pendulum hangs off the first crank and a single one off the second, with gravity the only driver. i integrate four coordinates, $\\mathbf{q} = (\\theta_1, \\phi_a, \\phi_b, \\phi_c)$ and the second crank is missing on purpose, because two pitch circles rolling without slip trade equal and opposite arc, a holonomic relation between the angles themselves.

$$
R_1\\theta_1 = -R_2\\theta_2 \\quad\\Longrightarrow\\quad \\theta_2 = -\\rho\\,\\theta_1, \\qquad \\rho = \\frac{R_1}{R_2}
$$

folding it into the coordinates turns five rigid rods into a four-coordinate problem with no multiplier to drag around. the kinetic energy is the usual quadratic form in the rates and the potential pulls the gear ratio inside a trig function through $\\sin(\\rho\\theta_1)$, so the Lagrangian and its reduced equations are

$$
\\mathcal{L} = \\tfrac12\\,\\dot{\\mathbf{q}}^{\\mathsf{T}} M(\\mathbf{q})\\,\\dot{\\mathbf{q}} - V(\\mathbf{q}), \\qquad M(\\mathbf{q})\\,\\ddot{\\mathbf{q}} = F(\\mathbf{q}, \\dot{\\mathbf{q}}),
$$

which i solve each step by Gaussian elimination. this time no coordinate is cyclic. $\\theta_1$ sits in the potential as itself and again inside $\\sin(\\rho\\theta_1)$, so there is no ignorable coordinate and no conserved momentum at all. you might expect the gears to bank angular momentum like a flywheel, but both axles are bolted down and gravity keeps torquing every rod, so nothing rotational survives either. the only invariant left is energy.

$$
E = T + V = \\text{const}
$$

the two pendulum trains never couple directly, which i didn't expect. the single pendulum reaches the rest of the system through one off-diagonal entry against the crank and sits at exactly zero against the double pendulum's angles. the mesh is the only thing that connects them.

\`\`\`iframe
/dynamical_systems/gear-twin-crank_minimal.html
\`\`\`

the two cranks stay mirror images, turning opposite ways at the fixed ratio and the double pendulum can whip the first crank hard enough to jerk the second one across the loop, a kick with no contact between them, passed through the teeth.

the third system doesn't conserve momentum at all, on purpose. a rigid chassis coasts on frictionless ice on a single knife-edge blade that can slide along its heading but never sideways and a cam at its centre wags a follower rod through a groove. there is no motor and no friction and it still eases forward and drifts into a slow turn, changing its own speed with nothing pushing on it. i take $\\mathbf{q} = (x, y, \\theta, \\psi)$, the chassis centre, its heading and the cam angle. the groove is holonomic and folds straight in; the blade is not. it forbids any sideways velocity, a single scalar condition on the speeds that won't integrate.

$$
-\\,\\dot{x}\\sin\\theta + \\dot{y}\\cos\\theta + a\\dot\\theta = 0
$$

this is nonholonomic. it removes a speed, not a coordinate, so the pose keeps all four freedoms while the velocities drop to three. gravity points out of the plane and the ice carries it, so $V = 0$ and the Lagrangian is all kinetic. the equations come from Euler-Lagrange with the constraint carried by a multiplier,

$$
\\frac{d}{dt}\\!\\left(\\frac{\\partial \\mathcal{L}}{\\partial \\dot{\\mathbf{q}}}\\right) - \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{q}} = \\mathbf{A}_{\\mathbf{q}}^{\\mathsf{T}}\\lambda, \\qquad \\mathbf{A}_{\\mathbf{q}} = (-\\sin\\theta,\\ \\cos\\theta,\\ a,\\ 0),
$$

and because the blade does no work along the motions it permits, projecting onto the admissible directions kills the multiplier and leaves a clean $3\\times 3$ solve $M(\\psi)\\ddot{\\mathbf{q}} = F$. $\\lambda$ itself has not disappeared, though; the one in-plane external force on the machine is that blade reaction, so the total momentum obeys

$$
\\frac{d\\mathbf{p}}{dt} = \\lambda\\,\\hat{e}_2 \\neq 0,
$$

and every time the wag drives $\\lambda$ off zero, the centre of mass gains speed it had no other way to get. the constraint does no work, so it can't change $E$, but it can still redirect the motion already there, rectifying the follower's back-and-forth into a one-way drift. energy is again the only invariant, $E = T = \\text{const}$.

\`\`\`iframe
/dynamical_systems/cam-skater_minimal.html
\`\`\`

the forward speed keeps changing with nothing pushing the skater and the carved track bends with nothing steering it.

all three run the same way, classical RK4 at a fixed step of one or two milliseconds, eight to sixteen substeps a frame. the energy number in the corner of each one is the part i actually trust, because i compute it twice and the two ways do not share any algebra. rather than read the kinetic energy back off the same $M$ and $F$ that pushed the state forward, which would only prove my solver is consistent with itself, each step rebuilds $E$ from the plain per-body kinematics, the cartesian velocity and height of every mass and never touches the reduced equations. if the algebra were wrong the true energy would drift and this number would wander off with it. it held flat in all three, somewhere between a part in a million and a part in $10^{11}$, which is how i knew the derivations were right.

three different fates for momentum. pinned at zero in the cradle, drained through the bearings in the gear train, walked across the ice in the skater. same culprit every time, a constraint force that does no work. was a fun afternoon.`,
  },
  {
    id: "blog-minimax-m2",
    slug: "minimax-m2-paradigm",
    title: "the $10b shortcut",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2026-01-09T17:21:00.000Z",
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
    created_at: "2025-12-28T09:34:00.000Z",
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

so maybe it's me or how i'm living, rather than what i'm doing.

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
    id: "a small lit circle",
    slug: "a-small-lit-circle",
    title: "a small lit circle",
    category: "blogs",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2026-01-03T20:32:00.000Z",
    content: `i became a software engineer partly because i wanted to understand things. i like the feeling of taking something that looks like magic from the outside and pulling it apart until i can see how it actually works. that's most of why i studied aeronautics in the first place. a plane staying up looks impossible until you learn the maths and then it isn't impossible anymore, it's just air doing what air does. i liked that. i liked the idea that if you were patient enough you could understand basically anything.

and the longer i do this job the more i realise that idea was never true and somewhere underneath i still believe it anyway.

here's the thing nobody tells you when you start. the more you learn, the bigger the part you can see that you don't know gets. when i first started coding i thought i was alright, better than alright if i'm honest, because i didn't know enough to see what i was missing. now i've been doing it a few years and i feel like i know less than i did then, which makes no sense on paper and complete sense in my chest. i'm an engineer at a startup. people ask me questions like i'm supposed to have the answers. and most days i'm acutely aware of how much is just outside what i actually understand.

there's an old saying that fits me almost too well, jack of all trades, master of none. i do full stack, which sounds impressive until you understand what it actually means day to day, which is that i know a bit of everything and i'm not the best person in the room at any single piece of it. i can hold my own on the backend and the frontend and the database and the infrastructure, but put me next to someone who's spent five years doing nothing but databases and i'm suddenly very aware of how shallow my version is. i've got my hands on the whole machine and a real grip on none of it. and the field moves so fast that you can spend months learning a framework and then watch everyone quietly move to a different one, so even the shallow knowledge keeps rotting underneath me. it's a wheel that doesn't have an end. you don't finish. there is no finishing.

for a long time i took that as a personal failing. like if i just read more, slept less, grinded harder, i'd eventually close the gap and feel like i actually knew what i was doing. and i want to say plainly that this is the same disease i've written about before in a different outfit. wanting to know everything is just wanting to have everything pointed at my head instead of my bank account. it's the same grab. the same refusal to accept that i'm small.

because here's what islam said about this centuries before anyone coined imposter syndrome.

there's a way of grading certainty in the islamic tradition that i think about a lot now. it has three levels. the first is 'ilm al-yaqin, knowing a thing by report and description, knowing about it. the second is 'ayn al-yaqin, knowing it by seeing it with your own eyes. the third is haqq al-yaqin, knowing it by being so completely inside it that no gap is left between you and the thing at all. 

the example always used to describe this is fire. to hear fire described is the first level. to see it burning in front of you is the second. to be in the fire, consumed by it, is the third. one fire, three entirely different ways of knowing it. what stops me every time is that almost everything i call knowledge sits at that first and weakest level. second hand, reported, something someone told me or i read somewhere, never once checked by me.

and that's not just a me problem, that's everyone. there's a whole question in philosophy about how much of what we know is just testimony, just trust in someone else's word. most people have never seen a baby born or watched blood move through a body or stood anywhere that proves the earth is round. we take it. we take nearly all of it. even the shape of the planet is, for almost every person alive, a thing they were simply told and chose to believe. and once you sit with that for a second the confident version of yourself starts to look a bit ridiculous.

there's a story in the qur'an that gets at this better than anything i could say. musa, a prophet, travels with a man given knowledge musa doesn't have. and this man does things that look wrong. he damages a boat for no reason musa can see. and musa keeps objecting, because from where he's standing it makes no sense and the man keeps telling him to be patient, that he can't yet see the reason. and the line that opens the whole thing is the man asking musa how he could possibly be patient with something he doesn't have the knowledge to encompass. that's the position i'm actually in, all the time, with almost everything. i'm musa on the boat, certain something's wrong because i can only see the slice in front of me and the fuller reason is sitting somewhere outside what i'm able to see.

there's another one i like even more. sulayman, a prophet and a king, with all that knowledge and all that power and a small bird comes back and tells him it has found out something he didn't know. a hoopoe. a little bird knew a thing the prophet-king didn't. and he doesn't get defensive about it. that's the bit. the most powerful man around finds out his knowledge had a hole in it and his response isn't to cover it up, it's to take the information and be grateful for it. i think about how far that is from how i actually behave when someone more junior than me knows something i don't.

and then there's qarun, who's the warning. qarun had wealth and when people asked how, he said he'd earned it all through knowledge he possessed. it was his. his cleverness, his doing. and he's in there as exactly the thing not to be. the man who looked at everything he had and credited it entirely to himself. i recognise him too, which is uncomfortable, because every time i take quiet pride in what i know as if i grew it out of nothing, that's the same move. that's qarun in a hoodie.

the secular world arrived at a smaller version of all this and called it dunning-kruger. the less you know about something, the more confident you tend to be, because you don't know enough to see what you're missing. and the people with real expertise often feel less sure, not more, because they can finally see the size of the thing. darwin said ignorance breeds confidence more reliably than knowledge does. and there's research showing that being an expert doesn't protect you from overconfidence and can sometimes make it worse, that people will get more and more certain as they get more information while the actual quality of their judgement doesn't move at all. what they found is that real expertise isn't just knowing things. it's knowing the edges of what you know. it's holding your confidence at the level the evidence actually justifies and not a notch higher.

which lines up almost exactly with what islam was already saying, that the believer is meant to hold real conviction and real humility at the same time and that the thing blocking you from truth is never humility, it's arrogance. arrogance being, in the prophet's own words, to reject the truth and look down on people. those are the two failure modes and i've done both. rejected a better answer because it wasn't mine, looked down on someone who knew less than me in one narrow area while they quietly knew more than me in ten others.

so where does that leave me, practically, on a tuesday, when i still have to ship code i'm not fully sure about.

i don't think the answer is to stop learning and i don't think it's to wallow in not knowing either. the islamic position was never that knowledge is impossible or that you should give up reaching for it. doubt is allowed, it's even useful, but only as a road toward certainty rather than a place to set up camp. al-ghazali went all the way through skepticism, doubted nearly everything and came out the other side. the doubt was a method, not a destination. that distinction matters to me. i'm allowed to not know. i'm not allowed to use not knowing as an excuse to stop.

what's actually changed is smaller than i'd like and i think it's real. i ask more questions now, including the ones that feel stupid, because i've worked out that if i don't know something there's a decent chance the person next to me doesn't either and one of us has to say it. i try to credit where things actually came from instead of quietly absorbing them into my own legend. and when someone junior knows a thing i don't, i'm trying to be the king and the bird, grateful for the information, rather than the man who couldn't stand that a smaller creature saw something he missed.

i still feel like a fraud some days. i've made my peace with the fact that the feeling probably scales with how much i learn rather than going away, that the more i see the more i'll see what i can't see. there's a thing about how allah brought you out of your mother knowing nothing and how some people are taken all the way back to the end of life knowing nothing again after having known a lot, your own memory failing you, the knowledge leaving the same way it came. you don't get to keep it. it was never really yours to keep. it was lent to you for a bit and you're responsible for what you do with it while you've got it and then it goes.

i think i can build things on top of that. i think it's actually a steadier foundation than pretending i'll one day know enough to feel safe. i'm not going to know enough. nobody knows enough. the most anyone gets is a small lit circle in a very large dark room and the honest thing, the thing that finally takes the pressure off, is to stop pretending the room is small and just get on with lighting the bit of it i can reach.
    `,
  },

  {
    id: "holding-has-no-shape",
    slug: "holding-has-no-shape",
    title: "holding has no shape",
    category: "blogs",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2026-01-28T12:28:00.000Z",
    content: `i spent last tuesday doing nothing and came home knackered.

well, not quite nothing. i had six agents going at once, with one claude rewriting a migration while codex chased a flaky test through the integration suite, a couple more churning away in tabs i'd half forgotten about and one more running on my phone while i made a cuppa. i barely wrote any code myself that day. mostly i approved things and sent things back, read a great many diffs and said yes or no or told one of them to try again but leave the auth layer alone this time. by six in the evening i was completely fried, though not in the clean way that a long day on a hard problem leaves you. this was something worse and a good deal harder to explain.

that was the part that bugged me, because the tiredness didn't match the day at all. when i spend eight hours deep in one nasty bug i come out empty but fine, scrubbed clean in a way i actually like. this felt like the opposite, a scattered sort of buzzing that was still going at midnight, as though i'd spent nine hours holding a stack of things just off the ground and nobody had ever let me put them down.

nobody really warns you about this part of it. going from writing code to running agents looks like a promotion, but it isn't one, it's simply a different job. the work i do now has almost nothing in common with what i was doing two years ago and it taxes an entirely different part of the brain.

there's a paper from 1983 by lisanne bainbridge called "ironies of automation" she was writing about power plants and control rooms, nothing remotely to do with any of this and yet she caught something that maps almost too neatly onto it. when you automate the easy parts of a job, what's left for the person is the hard part, the part that only ever turns up when something has already gone wrong. you strip out everything routine and leave behind the stuff that demands judgement at exactly the moment there's no time for it. her point was that better automation makes the human's job worse rather than better, because the person ends up on permanent standby for the cases the machine can't handle and standby turns out to be far more draining than the work itself. i could never quite explain why that was until i read her.

that is more or less the day i had on tuesday. i sat there watching mostly competent systems do mostly correct things, waiting to catch the one that wasn't. and they do break, just rarely enough that you can never fully step away and often enough that you can never fully stop watching. at one point an agent decided the cleanest fix was to change a function signature that around forty other things depended on and it proposed this to me as though it were the obvious move, completely sure of itself and completely wrong. catching that took more out of me than writing the original function ever would have.

i don't want this to tip over into a rant, because i genuinely don't want them gone. they really have made me faster at things i used to be slow at. what i'm trying to point at is the price of that speed, which has a habit of showing up somewhere none of the dashboards are ever looking.

the mechanism is fairly dumb once you lay it out. every new agent feels free, because you're already paying for it and it's sitting there idle, so you hand it the annoying little task you've been avoiding and then the one after that. each decision to spin up one more is sensible on its own and costs you next to nothing. the trouble is that they don't come back one at a time and in order, they all surface at once needing a decision from you and the cost was never in starting them so much as in holding them all in your head at the same time. you become the working memory for six parallel threads and human working memory was barely built for two.

that is the part i keep returning to, the reason it drains you rather than simply tiring you out. effort at least has a shape to it, in that you push against a problem and it pushes back and eventually one of you gives way. holding has no shape at all, only a steady low load that never resolves and your attention gets stretched so thin across the threads that switching between them starts to leave a residue. you come back to the migration agent and find that the constraint you set ten minutes ago has vanished, because in those ten minutes you were off being three other places at once.

the bottleneck used to be how fast i could write code. for a while after that it was how fast i could steer the things writing the code. now it is something smaller and more uncomfortable than either, namely how many of them i can hold in my head at once before one of them slips. the limit has moved off the machine and onto me and there is no subscription tier that fixes that particular one.

so what do you actually do, on a tuesday like that, when this is simply the job now and the work still has to ship regardless. i don't have a tidy answer, but i do have a few things that have helped and the honest version is that all of them are about admitting the limit rather than trying to beat it.

the first is just a number. i now cap it at two or three agents rather than six, because the moment i'm past three i can feel the quality of my attention fall away and a fourth agent producing work i'm too fried to review properly. past a certain point more parallelism stops buying speed and starts buying mistakes that i'll only find later, at a worse time. how many you can actually run turns out to be a fact about your attention rather than your wallet and pretending otherwise is how you burn yourself out without noticing.

the second is that i stopped watching them work, which sounds like a trivial change and really wasn't. there is a strong pull to monitor every output as it streams in, to sit there nodding along and that constant real time vigilance is the single most depleting part of the whole business. so instead i batch it now, letting three agents run while i go and do something else entirely, then coming back to review the lot in one focused pass. you trade the illusion of control for some recovery and the work is honestly no worse for it.

the third one i'm more sure of than the other two. every single day i protect a block of time where nothing at all is running, no agents or review queues, instead me and one problem and the slow good work of thinking it through by hand. part of that is for my own sanity, but it's also because the thing that lets me smell a bad function signature change coming, which is the ability to hold a whole problem in your head at once, is a muscle and supervising agents all day trains an entirely different one. if i let that deeper muscle go soft, i lose the exact judgement that makes me worth keeping in the loop in the first place. you can't stay sharp as a reviewer once you've stopped being a builder and i've become fairly convinced the two either feed each other or starve together.

there is, of course, a version of the future in which the agents simply get good enough that they stop needing me to catch their mistakes at all and plenty of clever people are betting on exactly that. they may well be right. but bainbridge's irony has held up for forty years across every kind of automation we've tried and the pattern she described was never really about the machines getting better, it was about what happens to the human when they do. so far, every round of automating the easy work has only made the residue that lands on the person harder and lonelier and more exhausting and getting better at automation has sharpened that rather than softened it. i've yet to see it run the other way.

i'm not arguing for fewer agents in any permanent sense and i'm certainly not giving back the speed. i've simply stopped treating my own attention as the free variable in the equation, the thing you can draw down endlessly while everything else scales up around it. it is the scarcest resource in the whole setup and it's where the real bottleneck has been hiding the entire time.

most days i still feel like the bottleneck and lately i've started to think that's the system working as intended rather than failing. the machines are built to run wide and i am built to go deep and the whole arrangement only holds together because there is still one person in the middle who can actually think.`,
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

`/*
**kuala lumpur**
- *nasi lemak wanjo* - a kampung baru institution since the sixties, with a dark, sweet sambal over coconut rice that pulls a queue at breakfast and another one all over again at supper.
- *line clear* - penang's legendary nasi kandar, transplanted to kl. you point at what you want and they flood the rice with a mix of gravies and it's still the most authentic version in the city.
- *ikan bakar jalan bellamy* - a row of open flames near the istana, grilling fish to order. get the stingray in sambal with a pile of ulam on the side.

**penang**
- *deen maju* - the nasi kandar locals will actually queue around the block for, across from the sikh temple. ask for kuah campur so all the gravies run together over the rice and take the spice-fried chicken on top.
- *bangkok lane mee goreng* - a mamak stall in pulau tikus that's been frying the same plate of mee goreng for ninety years. order it with extra squid.
- *bee hwa cafe* - one of the very few places doing halal char koay teow, a dish that barely exists in halal form because the real thing is fried in pork lard. this one still comes with all the smoke and wok hei.
- *roti canai transfer road* - a forty-year-old roadside griddle that drowns its roti in so much curry the locals call it kuah banjir or flooded. get there early, before it's all gone.

**singapore**
- *green chilli chicken rice* - one stall doing one dish since '99, a fried chicken thigh over pandan coconut rice under a rough green chilli sambal. they shut the moment it runs out, usually some time in the early afternoon.
- *selera rasa* - the nasi lemak at adam road that singaporeans will genuinely argue is the best in the country, with fragrant rice, crisp ikan bilis and a serious sambal.
- *haji kadir* - a golden mile institution doing sup tulang merah, marrow bones in a fierce red gravy that you suck straight out through a straw. messy and completely worth it.
`*/ + `
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

`/*
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
`*/ + `
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
