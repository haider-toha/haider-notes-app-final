import { Note, Folder } from "./types";

// Folder structure - Apple Notes style
export const folders: Folder[] = [
  { id: "all", name: "All Notes", icon: "cloud" },
  { id: "profile", name: "Profile", icon: "folder" },
  { id: "blog", name: "Blog", icon: "blog" },
  { id: "projects", name: "Projects", icon: "folder" },
  { id: "bookmarks", name: "Bookmarks", icon: "bookmarks" },
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
    created_at: "2025-12-08T14:23:00.000Z",
    content: `haider toha
london, uk

[github](https://github.com/haider-toha) • [email](mailto:mohammedhaidertoha@gmail.com) • [linkedin](https://linkedin.com/in/haidertoha)

founding engineer at sammy labs (yc w25). i write code across the stack - typescript on the frontend, python on the backend, postgres underneath. most of my time goes into building features end-to-end: designing the interface, writing the api, optimizing the queries, and making sure it holds up in production.

my background is aeronautics (imperial college). designing systems that can't afford to fail taught me to think about failure modes first: what breaks, when, and how do you recover gracefully? i’ve since worked at goldman sachs (scale, process, reliability) and built my own ventures from zero (speed, scrappiness, shipping daily). both shaped how i write code.

i spend about a third of my time with customers - on calls, debugging their issues live, understanding what's actually blocking them vs what they say is blocking them. the best features i've shipped came from watching someone struggle with the product.

what i care about: clean abstractions, fast feedback loops, code that's easy to delete. i'd rather ship something small that works than something ambitious that doesn't.

outside of work: gym, cricket, and late-night walks through hyde park when i need to think. i coach my local kids football team - the most grounding thing i do each week. recently started gliding and working toward my pilot’s license.

i read too much. mostly history, philosophy, and whatever rabbit hole has me that week.`,
  },
  {
    id: "profile-now",
    slug: "now",
    title: "current focus",
    category: "profile",
    folder: "profile",
    public: true,
    session_id: "",
    created_at: "2025-11-29T22:47:00.000Z",
    content: `

**ai evals**
really into how we measure whether models actually work. at work i'm building eval harnesses that go beyond vibes: custom datasets, automated grading, catching regressions before they hit users. thinking a lot about what "good enough" means when you're shipping ai to production. the gap between demo and reliable is almost always an eval problem.

**browser agents**
working on making browser automation less brittle. the dom is volatile, sites change, things break. i'm treating navigation as graph traversal (state, action, verification) instead of linear scripts. building a planning layer that can recover from failures and adapt to mutations. lots of edge cases, lots of fun.

**local inference**
experimenting with running models on-device. quantised inference, ggml, trying to get useful outputs with low latency. also playing with local-first rag: embeddings and retrieval that stay on your machine. the goal is fast, private and actually usable.

**personal infra**
rewriting my automation scripts in go. building a better second brain with notes, tasks and references all connected. also setting up proper observability for my side projects. the usual tinkering that makes everything else faster.`,
  },
  {
    id: "profile-toolbox",
    slug: "toolbox",
    title: "stack & gear",
    category: "profile",
    folder: "profile",
    public: true,
    session_id: "",
    created_at: "2025-11-17T11:02:00.000Z",
    content: `**languages**
**typescript:** fastest path from idea → interface → shipped feature.
**python:** models, data, experiments and glue code.
**go:** services that need to be predictable in prod.
**rust:** when i want to understand the machine (and remove fear).

**core stack**
**frontend:** react/next.js, tailwind.
**backend:** fastapi (python), chi (go), trpc.
**data:** postgresql (w/ pgvector), redis, clickhouse.
**infra:** docker, terraform, aws ecs/lambda, fly.io.

**defaults**
- postgres first (constraints over cleverness), redis when latency demands it.
- instrument early (logs/metrics/traces), optimise later.
- prefer removing work over speeding it up.

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
    created_at: "2025-10-23T09:34:00.000Z",
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
    created_at: "2025-11-12T16:18:00.000Z",
    content: `**founding engineer  - sammy labs (yc w25)** · london · nov 2025-present  
sit with customers, trace problems end-to-end, build and ship solutions. frontend to backend, idea to production.

**analyst  - goldman sachs** · london · jul 2025-nov 2025  
cloud migration. internal tooling. short stint before joining sammy.

**intern  - goldman sachs** · birmingham · summer 2024  
shipped nlp + semantic search tooling to cut time-to-answer for research users.

**founder  - provost academics** · london · may 2024-present  
built and grew an ai tutoring product from zero to 50+ paying customers.`,
  },
  {
    id: "project-self-engineering-agent",
    slug: "self-engineering-agent",
    title: "project: self-engineering agent",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-09-18T20:41:00.000Z",
    content: `i wanted faster iteration on agent workflows without manual glue code. the problem: every time i needed a new tool for an agent, i had to write it, test it, integrate it. repetitive. slow. error-prone.

**the idea**
what if the agent could write its own tools? not just call them, but detect when it needs a capability it doesn't have, generate the implementation, validate it, and only then use it.

**how it works**
- **capability detection:** when the agent encounters a task it can't complete with existing tools, it logs the gap and generates a tool specification
- **code generation:** using gpt-4, it writes the python implementation following strict function signatures and docstrings
- **test generation:** it also writes unit tests covering expected inputs, edge cases, and failure modes
- **sandboxed execution:** tests run in an ephemeral docker container. no access to host filesystem. network isolated. 30-second timeout
- **promotion logic:** if all tests pass, the tool is added to the agent's registry. if not, it logs the failure and retries with the error message as context

**architecture**
the core loop is simple:
1. receive task
2. plan steps
3. for each step, check if tool exists
4. if not, trigger tool generation pipeline
5. execute step
6. return result

the tool registry is backed by pgvector for semantic search. when the agent needs to find a tool, it embeds the task description and retrieves the closest matches. this means tools get reused across tasks without exact string matching.

**learnings**
- llms are surprisingly good at writing focused, single-purpose functions
- the hard part is the test harness, not the generation
- docker overhead is real (~2s per execution), but acceptable for the safety guarantees
- tool descriptions matter more than implementations for retrieval

**stack:** python, docker sdk, openai api, pgvector, fastapi
`,
  },
  {
    id: "project-navier-stokes",
    slug: "parallel-navier-stokes",
    title: "project: parallel navier-stokes solver",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-08-15T14:22:00.000Z",
    content: `a high-performance c++ solver for 2d incompressible fluid dynamics. built during my aeronautics degree when i wanted to understand both the physics and the computational techniques at a low level.

**the problem**
simulating fluid flow is computationally expensive. the navier-stokes equations describe how velocity fields evolve, but solving them at high resolution requires millions of calculations per timestep. sequential code hits a wall fast.

**approach**
i implemented a pressure-projection method:
1. advect velocity field (move fluid)
2. apply external forces (gravity, etc.)
3. solve pressure poisson equation (enforce incompressibility)
4. project velocity to be divergence-free

the expensive part is step 3. i used a jacobi iterative solver, which is embarrassingly parallel  - each cell update only depends on its neighbors.

**parallelisation strategy**
- **mpi for distributed memory:** split the grid across nodes. each node owns a horizontal slice. ghost cell exchanges happen at boundaries
- **openmp for shared memory:** within each node, parallelize the inner loops with pragma directives. cache-aware iteration order (row-major) reduced l1/l2 misses by ~40%
- **hybrid approach:** mpi between nodes, openmp within nodes. this matched the cluster architecture (16 cores per node, 8 nodes)

**optimisations**
- aligned memory allocation for simd vectorisation
- loop tiling to improve cache locality
- asynchronous mpi communication overlapped with computation
- red-black gauss-seidel for faster convergence (2x fewer iterations than jacobi)

**results**
- achieved near-linear speedup up to 64 cores
- 512x512 grid at 1000 timesteps: 45 minutes sequential → 48 seconds parallel
- learned more about memory hierarchies than any textbook could teach

**stack:** c++, mpi, openmp, hpc cluster, vtk for visualisation

the code is messy (academic code always is), but the experience shaped how i think about performance-critical systems.`,
  },
  {
    id: "project-fpl-moneyball",
    slug: "fpl-moneyball",
    title: "project: fpl moneyball",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-07-22T09:15:00.000Z",
    content: `fantasy premier league meets operations research. i was tired of picking my team based on gut feel and wanted to see if optimisation could beat intuition.

**the game**
in fpl, you have a £100m budget to pick 15 players. each gameweek, you field 11, and they earn points based on real-life performance (goals, assists, clean sheets, etc.). simple rules, complex strategy.

**the approach**
i framed squad selection as an integer linear program (ilp):
- **decision variables:** binary variables for each player (in squad or not, in starting 11 or not)
- **objective:** maximise expected points for the gameweek
- **constraints:** budget, squad size, max 3 players per team, positional requirements (1 gk, 3-5 def, 2-5 mid, 1-3 fwd)

**data pipeline**
- scraped historical player data from the fpl api (goals, xG, xA, minutes, fixtures)
- built a simple expected points model: weighted combination of form, fixture difficulty, and historical averages
- updated weekly via aws lambda + eventbridge cron

**solver**
used pulp (python linear programming library) with the cbc backend. solves in <1s for the full player pool (~700 players).

**extensions i added**
- **transfer planning:** multi-week lookahead to account for fixture swings. when to hold, when to sell
- **captain optimisation:** not just who to pick, but who to captain (double points)
- **chip timing:** when to play wildcards, bench boost, triple captain based on fixture clusters
- **differential picks:** added constraints to avoid template teams. sometimes the optimal move is to zig when others zag

**results**
- consistently finished top 100k (out of ~10m players) without spending hours on team selection
- beat my manual decisions in 75% of gameweeks
- the edge comes from discipline: the model doesn't get attached to players or chase last week's haul

**stack:** python, pulp, pandas, aws lambda, s3, the fpl api

**lesson:** gut feel is just pattern matching you can't explain. sometimes it's right. but when you can encode the problem mathematically, do it.`,
  },
  {
    id: "project-sentiment-engine",
    slug: "global-sentiment-engine",
    title: "project: global sentiment engine",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-06-10T16:30:00.000Z",
    content: `a real-time pipeline that ingests news and social data, runs sentiment analysis, and visualises the emotional state of the world on a 3d globe.

**motivation**
i wanted to build something visually striking that also required solid backend engineering. sentiment analysis is a solved problem  - the interesting part is the plumbing: getting data in, processing it reliably, and rendering it beautifully.

**architecture**

*data ingestion*
- newsapi for headlines from 50+ countries
- twitter/x streaming api (filtered by geolocation and keywords)
- rss feeds from major publications
- ~10k articles/day, ~50k tweets/day

*queueing*
- redis streams for message passing
- consumer groups for parallel processing
- backpressure handling: if consumers fall behind, producers slow down

*sentiment analysis*
- hugging face transformers (distilbert fine-tuned on financial news)
- batch inference for efficiency (128 texts per batch)
- outputs: sentiment score (-1 to 1), confidence, detected entities

*storage*
- timescaledb for time-series sentiment data
- aggregated by country, topic, and hour
- 30-day retention with downsampling for older data

*visualisation*
- next.js frontend with react-three-fiber
- 3d globe with countries coloured by sentiment (red = negative, green = positive)
- click a country to see top headlines and trend sparklines
- websocket connection for live updates

**challenges**
- rate limits everywhere. had to implement exponential backoff and request pooling
- model latency: gpu inference is fast, but cold starts kill p99. solution: keep the model warm with periodic dummy requests
- timezone hell: normalising timestamps from global sources is harder than it sounds

**observability**
- structured logging with correlation ids
- prometheus metrics for queue depth, inference latency, error rates
- grafana dashboards for at-a-glance health

**stack:** next.js, react-three-fiber, redis, hugging face transformers, timescaledb, docker, vercel

the globe visualisation is a crowd-pleaser, but the real learning was in making the pipeline resilient. data systems fail in boring ways  - retries, timeouts, and good defaults matter more than clever algorithms.`,
  },
  {
    id: "project-recipe-ancestry",
    slug: "recipe-ancestry-graph",
    title: "project: recipe ancestry graph",
    category: "projects",
    folder: "projects",
    public: true,
    session_id: "",
    created_at: "2025-05-01T11:45:00.000Z",
    content: `a knowledge graph that maps the relationships between recipes: which dishes influenced which, what ingredients they share, and how culinary traditions evolve.

**origin**
i was reading about the history of biryani  - how it has mughal, persian, and south indian roots  - and wondered: could you map these influences computationally? not just for biryani, but for thousands of recipes across cuisines.

**approach**

*data collection*
- scraped ~50k recipes from allrecipes, bbc good food, and regional cooking sites
- used selenium for javascript-heavy sites, beautifulsoup for static ones
- normalised ingredient names (chicken breast, breast of chicken, boneless chicken → chicken)

*entity extraction*
- trained a spacy ner model to extract ingredients, techniques, and cuisine markers
- custom entity labels: INGREDIENT, TECHNIQUE, REGION, DISH_TYPE
- f1 score of 0.89 on a hand-labelled test set of 500 recipes

*graph construction*
- nodes: recipes, ingredients, techniques, cuisines
- edges: recipe-contains-ingredient, recipe-uses-technique, recipe-belongs-to-cuisine, recipe-inspired-by-recipe
- "inspired by" edges are inferred from ingredient and technique overlap + historical data

*similarity scoring*
- jaccard similarity on ingredient sets as a baseline
- tf-idf weighted similarity for better precision (common ingredients like salt matter less)
- graph-based similarity using node2vec embeddings

**visualisation**
- d3.js force-directed graph for exploration
- click a recipe to see its ancestors and descendants
- filter by cuisine, ingredient, or time period
- fastapi backend for search and graph traversal queries

**interesting findings**
- many "national dishes" have surprising foreign roots (e.g., japanese curry via british navy via india)
- techniques travel faster than ingredients (fermentation, smoking, frying appear across unconnected cuisines)
- fusion cuisines cluster predictably (indo-chinese, tex-mex) but sometimes reveal unexpected bridges

**stack:** python, spacy, networkx, d3.js, fastapi, beautifulsoup, selenium

**reflection:** this project taught me that unstructured text is a goldmine if you're patient. ner + graphs can surface patterns that keyword search never could. also: food history is fascinating.`,
  },
  {
    id: "blog-minimax-m2",
    slug: "minimax-m2-paradigm",
    title: "blog: minimax m2  - 230b params, 10b cost, agents finally make sense",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-12-21T09:00:00.000Z",
    content: `**the minimax m2 paradigm: why the "best bang for the buck" just changed the game**

we are currently witnessing a structural bifurcation in the global ai landscape. on one side, you have the closed-source giants -openai, anthropic, google -scaling dense models behind opaque apis. on the other, the open-source ecosystem has been playing catch-up, mostly through brute-force scaling or finetuning llama derivatives.

but every so often, a model drops that doesn't just iterate; it disrupts.

the release of **minimax m2** is one of those moments. it poses a very uncomfortable question for the proprietary labs: how does a model that ranks in the top five of the artificial analysis benchmark -territory usually reserved for gpt-4 and claude opus -exist with open weights? [1]

i have been testing m2 extensively. it is currently the third most-used model on openrouter, and let me be clear: this isn't hype. it is a pragmatic recognition that we have finally hit the "intelligence-cost quadrant" sweet spot. we have been looking for **pareto optimality** where high reasoning capabilities intersect with dirt-cheap inference. m2 occupies this space decisively.

here is my deep dive into why this 230-billion parameter monster (that only thinks it is a 10-billion parameter model) is the future of agentic intelligence.

---

**1. the "mini/max" paradox: a lesson in sparsity**

the nomenclature "minimax" isn't just marketing; it is the governing engineering principle.

- **"mini"** refers to the active computational footprint.
- **"max"** refers to the knowledge capacity.

the architecture relies on a massive mixture-of-experts (moe) design. the total parameter count is a staggering 230 billion. in a traditional dense model (like llama 3 70b), every single one of those parameters would fire for every token generated. that is computationally expensive and slow.

m2, however, utilizes an aggressive sparsity ratio of approximately 23:1. it only activates **10 billion parameters** per token generation step [3].

**the math of efficiency**

to visualize why this matters, consider the cost of inference ($C$). in a dense model, cost scales with total parameters ($P_{total}$). in m2, it scales with active parameters ($P_{active}$).

$$C_{M2} \\propto P_{active} \\approx \\frac{P_{total}}{23}$$

this simple equation is why m2 changes the economics of ai. it holds the encyclopedic breadth of a 200b+ model (the "max") but runs with the latency and cost profile of a small 10b model (the "mini").

for autonomous agents, this is critical. agents require loops. they plan, they act, they observe, they refine. this cycle can consume thousands of tokens per task. if your underlying model is claude 3 opus, you go broke. if it is llama 3 8b, the agent is too stupid to finish the task. m2 hits the sweet spot: it is smart enough to handle long-horizon tasks but roughly **92% cheaper** than comparable proprietary models [7].

---

**2. the great attention pivot: why m2 dropped "lightning"**

here is a nuanced detail that many people miss. the predecessor, minimax m1, was famous for using "lightning attention" -a linear attention mechanism that allowed for massive 1m+ token contexts.

**m2 dropped it.**

m2 reverted to standard **full attention** (softmax). why? because in the real world of coding and "needle-in-a-haystack" retrieval, precision beats theoretical efficiency.

linear attention approximates the interaction between tokens to achieve $O(n)$ complexity. full attention has quadratic complexity $O(n^2)$, meaning it's computationally heavier.

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

see that $QK^T$ term? that's the model comparing *every* token to *every other* token. minimax engineers realized that for an agent to correctly identify a single bug in 50 files of code, you cannot afford the "lossy" compression of linear attention [4]. you need the brutal exactness of the $n \\times n$ matrix. this decision to prioritize **accuracy over raw speed** is why m2 feels so much sharper at coding tasks than m1 did.

---

**3. the death of chain-of-thought: enter "interleaved reasoning"**

we need to talk about how this thing thinks. since mid-2024, the industry has been obsessed with chain-of-thought (cot) -the idea that the model should vomit out a "reasoning preamble" before giving you an answer.

the problem with standard cot is that it is linear.

*input → giant block of thinking → final output.*

this is fine for solving a math riddle, but it is terrible for agents. agents need to interact with the world.

minimax m2 introduces **interleaved reasoning**. it doesn't separate thinking and doing; it blends them into a continuous loop, effectively modeling the task as a markov decision process (mdp):

*input → think → tool call (act) → **observation** → think → tool call (act) → answer.*

this is a subtle but profound shift. in this paradigm, "thinking" isn't a preamble; it is a pervasive thread. if the agent tries to scrape a website and gets a 403 forbidden error, it doesn't fail. it sees the observation, "thinks" about it ("*i need to try a different endpoint*"), and acts again.

in my testing, this state preservation is the killer feature. the reasoning traces are kept as part of the conversation history object. at step 50 of a complex task, m2 can look back at step 10 and see *why* it made a decision, not just *what* it did [1].

---

**4. the stability algorithm: cispo**

why is m2 so stable during these long loops? it comes down to how it was trained.

training reasoning models with reinforcement learning (rl) is notoriously unstable. as models generate longer sequences of thought, the variance in gradients explodes. the standard fix is to use algorithms like ppo, which use "clipping" to stop the model from changing too much, too fast.

the problem? ppo clips the *update*. this often suppresses those "aha!" moments where the model makes a massive leap in logic because the algorithm interprets that leap as instability [8].

minimax uses a novel algorithm called **cispo** (clipped importance sampling policy optimization).

$$L_{CISPO}(\\theta) = \\mathbb{E}\\left[\\min\\left(r_t(\\theta)A_t, \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon)A_t\\right)\\right]$$

without getting bogged down in the full derivation, the "magic" is that cispo clips the *weight* but detaches it from the gradient. it tells the model: *"this was a huge, high-variance move. i will let you learn from it, but i won't let you blow up the training run over it."*

meta ai recently released a paper on scaling rl compute and explicitly identified cispo as the **"most stable way to scale reinforcement learning steps"** [5]. when meta validates your math, you know you are on to something.

---

**5. benchmarks: the "tau squared" and coding dominance**

the report request mentioned the "tau squared" benchmark. this refers to **tau-bench** ($\\tau^2$), the current gold standard for agentic reliability.

- **tau-bench ($\\tau^2$):** m2 scores **87%** in the telecom domain. this measures reliability in multi-turn tool use. most models lose track of the user's constraints after turn 3. m2 holds the state.
- **swe-bench verified:** this is the big one for autonomous coding. m2 scores **69.4%**. for context, claude 3.5 sonnet is around 77% and gpt-4o is around 75%. m2 is within striking distance of the absolute state-of-the-art, while being open-weights and significantly cheaper to run [6].
- **browsecomp:** in web navigation agents, m2 scored **44.0%**, which ironically nearly triples the score of claude 3.5 sonnet (19.6%) on that specific evaluation.

---

**6. case study: the deep research dashboard**

to see if these numbers hold up, we can look at the "deep research dashboard" test case, popularized by the caleb wright analysis.

the prompt: *"write me a dashboard that runs deep research to gather all publicly available information on ai companies... including venture capitals, hyperscalers, new clouds and more."*

this is a nightmare prompt. it requires planning, web scraping, data normalization (converting "10m" and "$10,000,000" to the same integer), and frontend coding.

m2 handled it via the interleaved loop:

1. **plan:** broke down the query into specific google searches.
2. **act:** scraped techcrunch and vc databases.
3. **reflect:** it encountered a coding error in the visualization library (recharts). instead of giving up, it read the error, "thought" about the deprecated api, and rewrote the code in real-time [5].

a standard model might hallucinate the data or fail at the code syntax. m2 functioned as a junior full-stack engineer.

---

**conclusion: the new baseline**

the minimax m2 is not just another entry in the hugging face model registry. it is a proof of concept for a different way of building ai.

by decoupling total knowledge from active compute (230b/10b), minimax has solved the **economic blocker** for autonomous agents. by implementing interleaved reasoning, they have solved the **cognitive blocker**. and by utilizing cispo, they have turned the "black magic" of rl training into a rigorous science.

for developers, the choice is becoming clearer. you can pay the "proprietary tax" for the absolute peak of intelligence, or you can use m2 to get 95% of the performance at a fraction of the cost, with full control over your infrastructure.

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
    slug: "death-of-tokenizer-deepseek-ocr",
    title: "blog: deepseek-ocr  - why pictures are cheaper than words",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-12-20T10:00:00.000Z",
    content: `**the death of the tokenizer: why deepseek-ocr is actually a compression algorithm**

we have spent the last decade obsessed with scale. we want more parameters, more data, and, perhaps most desperately, longer context windows. we went from bert's claustrophobic 512 tokens to gemini's millions, chasing the dream of stuffing entire legal archives or code repositories into a single prompt. but we keep hitting the same invisible wall: the "tyranny of the quadratic."

it is a basic fact of the transformer architecture that self-attention scales as $O(n^2)$. this isn't just a notation; it is a physical memory bottleneck defined by the attention matrix calculation:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

the killer here is the $QK^T$ term. it produces a matrix of size $n \\times n$. if you double your sequence length $n$, your memory requirement for storing these attention scores quadruples [1]. we have tried engineering our way out of this with sliding windows and sparse attention, but those are just band-aids. the real problem isn't the attention mechanism; it is the input itself. we are still feeding our ais discrete text tokens, a legacy method that is surprisingly inefficient for dense information.

enter deepseek-ocr. on the surface, it looks like just another tool to read pdfs. but after tearing apart the technical report, i am convinced this is a trojan horse for a paradigm shift called **contexts optical compression**. it posits a wild theory: pictures might actually be cheaper than words.

---

**the mathematics of inefficiency: why text is expensive**

let's look at the numbers. standard tokenizers (bpe, sentencepiece) are rigid. they treat a page of text as a linear string of integers. if you have a complex financial table, the model has to burn tokens representing the structure -pipe characters, newlines, spacing -just to tell the model "this is a table."

from an information theory perspective, this is a disaster. we can quantify the inefficiency using shannon entropy ($H$):

$$H(X) = -\\sum_{i} p(x_i) \\log_2 p(x_i)$$

in a standard text stream, structural tokens (whitespace, brackets, markdown) have very high probability $p(x_i)$, meaning they contribute almost **zero** information (surprise) to the system while consuming valuable slots in the context window [2]. you are paying compute for predictable syntax.

deepseek's hypothesis is that a "visual patch" (a cluster of pixels) creates a holographic representation of the data. the metric that matters here is the compression ratio ($\\rho$), but we need to view it through the lens of vector dimensionality:

$$\\rho = \\frac{N_{\\text{text}} \\times d_{\\text{text}}}{N_{\\text{visual}} \\times d_{\\text{visual}}}$$

where $N$ is the number of tokens and $d$ is the embedding dimension. while $d_{\\text{visual}}$ (the visual embedding size) is typically larger than $d_{\\text{text}}$, deepseek achieves a raw token reduction ($N_{\\text{text}}/N_{\\text{visual}}$) of roughly **10x** [3]. this suggests the model is packing significantly more entropy into each vector -effectively moving the complexity from the *sequence length* (which scales quadratically) to the *channel dimension* (which scales linearly).

---

**the engine: a frankenstein architecture**

the deepseek team didn't just train a giant vision transformer (vit). they built a serial, heterogeneous pipeline that i honestly find fascinating. it connects components that usually don't talk to each other [8].

here is the "deepencoder" breakdown with the arithmetic that justifies their choices:

**1. the perceiver (sam-base)**

they use the segment anything model (sam) as the front end. to handle the $1024 \\times 1024$ input resolution without melting the gpu, they use **windowed attention**. instead of the global $O(n^2)$, the cost becomes linear with respect to the number of patches, because attention is restricted to a local window $w$:

$$O\\left(\\frac{n}{w} \\cdot w^2\\right) = O(nw)$$

this allows the model to perceive fine-grained details (serifs, decimal points) without the quadratic penalty [7].

**2. the bottleneck (conv layers)**

this is where the physical compression happens. they use a 2-layer convolutional network to downsample the feature map. we can calculate the exact output dimension $O$ using the standard convolution arithmetic:

$$O = \\left\\lfloor \\frac{I - K + 2P}{S} \\right\\rfloor + 1$$

with a kernel $K=3$, stride $S=2$, and padding $P=1$, applied twice to a feature map of $64 \\times 64$ patches (derived from the sam output):

- **step 1:** $O_1 = \\lfloor(64 - 3 + 2)/2\\rfloor + 1 = 32$
- **step 2:** $O_2 = \\lfloor(32 - 3 + 2)/2\\rfloor + 1 = 16$

the result is a $16 \\times 16$ grid, totaling **256 visual tokens**. this massive reduction ($64^2 \\to 16^2$ tokens) is what makes the subsequent processing so cheap [7]. it forces the model to aggregate local features into semantic concepts.

**3. the semantic brain (clip-large)**

finally, they feed those 256 tokens into clip. since $256^2 = 65536$, the global attention cost is negligible. clip aligns these visual patches with the language manifold, getting them ready for the llm to decode [4].

---

**the "cliff": rate-distortion theory in action**

however, there is no free lunch. the report details a massive drop-off in performance when they push the compression too far.

- **at 10x compression:** 97% precision.
- **at 20x compression:** 60% precision.

this is a classic manifestation of **rate-distortion theory**. there is a lower bound on the rate $R$ (bits per symbol) required to achieve a distortion $D$ (error rate):

$$R(D) = \\min_{p(\\hat{x}|x): E[d(x,\\hat{x})] \\le D} I(X; \\hat{X})$$

as deepseek increases the compression ratio, they are forcing $R$ below the intrinsic entropy of the document image. at 20x, the "channel capacity" of the latent space is exceeded by the noise of the pixels (scan lines, font blur). the mutual information $I(X; \\hat{X})$ drops, and the decoder is forced to rely on its internal priors (hallucinations) rather than the source signal [2].

this explains why the model starts hallucinating plausible but incorrect numbers at high compression. it is "dreaming" the data based on visual probability rather than reading it. this is a critical limitation: **do not use this for high-stakes finance if you are pushing the compression limits.**

---

**operational reality: the "gundam" mode**

i have to mention the "gundam" mode because the naming is fantastic. this is their solution for massive schematics or newspapers.

if you shrink a giant blueprint to $1024 \\times 1024$, you lose the details. gundam mode tiles the image. it processes tiles individually (local detail) and the full image (global context), then stitches them together. even with this heavy lifting, it uses fewer than 800 tokens per page [3]. compare that to mineru or internvl, which burn 6,000+ tokens for the same task [6].

deepseek is proving that general-purpose vlms are incredibly wasteful. they are "over-tokenizing" visual noise that carries no semantic value.

---

**the future: visual rag and memory forgetting**

this is where my opinion comes in strong. i believe deepseek-ocr signals the obsolescence of the text tokenizer for multimodal ai.

if we can encode a page of text into a vector space that is 10x smaller than the text itself, why would we ever store the text? we are moving toward **visual rag** [5].

imagine a vector database full of these deepencoder embeddings. you don't retrieve text; you retrieve the "visual gist" of the page. the model also suggests a biomimetic approach to memory called "memory forgetting" [6]:

- **short-term:** keep recent interactions as high-fidelity text.
- **long-term:** compress older context into low-res visual tokens (tiny mode, 64 tokens).

it mimics how humans remember. you recall the exact wording of the sentence you just read, but for a book you read last year, you only retain the semantic "shape" of the plot.

---

**conclusion**

deepseek-ocr is a proof-of-concept for a post-tokenization era. it validates the hypothesis that visual latent space can hold more entropy per unit than linear text.

for the engineers out there: this is a 10x cost reduction multiplier for your rag pipelines [7]. for the researchers: it is a challenge to the fundamental assumption that text is the optimal medium for language modeling.

we are witnessing the transition from processing discrete symbols to reasoning in continuous high-dimensional visual spaces. the tokenizer isn't dead yet, but for the first time, it looks like legacy tech.

---

**references**

[1] the quadratic barrier and the tokenization crisis.
[2] entropy limits and signal-to-noise ratios in visual latent space.
[3] core deepseek-ocr paper: technical claims and benchmarks.
[4] the modality gap and clip alignment.
[5] visual rag and production implications.
[6] benchmarking vs qwen/internvl and memory forgetting.
[7] the serial architecture: sam, conv, and clip.
[8] deepencoder specifics and parameter counts.
[9] serial vs parallel architecture in mllms.`,
  },
  {
    id: "blog-imo-2025",
    slug: "cognitive-threshold-imo-2025",
    title: "blog: ai at imo 2025  - gold medal, one critical failure",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-12-19T15:00:00.000Z",
    content: `**the cognitive threshold: a technical deep dive into ai's gold medal (and its one critical failure) at imo 2025**

the 2025 international mathematical olympiad (imo) was not just another math competition. it was the moment the "turing test" moved from a philosophical dinner party debate to a hard, quantitative benchmark.

if you have been following the breathless hype cycles of ai, you are likely exhausted. i know i am. but what happened in australia this year is different. it is tangible. openai and google deepmind did not just inch forward. they shattered the ceiling. their systems achieved scores equivalent to a gold medal, solving problems that stump the smartest 18-year-olds on the planet [1].

but here is the catch, and it is the subject of today's deep dive: they completely face-planted on problem 6.

this dichotomy (perfection on five problems and a "hard zero" on the sixth) is the most important signal we have regarding the current state of artificial intelligence. it reveals exactly where the "cognitive threshold" lies. in this post, i am going to tear down the architecture that got us here, rigorously derive the math behind the problem that stumped the machine, and map this all back to what it means for us in software engineering.

---

**1. the new benchmark: why this matters**

let us look at the facts. the imo is the hardest pre-university math competition in the world. it consists of six problems over two days. each is worth 7 points. a gold medal usually requires a score around 35 out of 42.

historically, ai struggles here. standard llms are probabilistic engines. they are "system 1" thinkers. they guess the next word. math requires rigorous, "system 2" logic where one false step collapses the entire proof.

in 2025, both google deepmind (gemini deep think) and openai (o1 series) hit that magic number: **35 points** [1].

they solved algebra, geometry, and number theory with a proficiency that would make a tenured professor sweat. but they failed problem 6. this was not a glitch. it was a fundamental limitation of how current transformers process global constraints.

---

**2. the architecture of reasoning: the math of "thinking"**

to understand why they won gold, you have to understand that these are not the same models you use in chatgpt or claude 3.5 sonnet.

the standard models we use for coding (gpt-4o, etc.) operate on **training-time compute**. they are smart because they read a lot of books during training. when you ask them a question, they answer instantly. they do not "think."

mathematically, a standard llm computes the probability of the next token $t_i$ given the context $C$ and previous tokens $t_1, ..., t_{i-1}$:

$$P(t_i | C, t_1, ..., t_{i-1})$$

this is a single forward pass. it is greedy. if $t_j$ is a mistake, the model is doomed because $t_{j+1}$ depends on $t_j$.

the gold medalists use **inference-time compute** [2]. this introduces a latent variable $\\theta$, representing the "reasoning chain" or "hidden thoughts." the model does not just maximize the probability of the answer $A$. it marginalizes over the space of possible reasoning paths:

$$P(A | Q) = \\sum_{\\theta \\in \\Theta} P(A | \\theta, Q) \\cdot P(\\theta | Q)$$

here, $\\Theta$ is the set of all possible "thoughts" (steps of proof, backtrackings, corrections). the model spends computational resources (inference time) exploring high-probability paths in $\\Theta$ before committing to an output $A$. this is the shift from **probabilistic pattern matching** to **search-based reasoning**. it is the difference between a parrot repeating a phrase and a human sitting down with a scratchpad.

**the "monitorability tax" and alignment**

this shift introduces a fascinating nuance i call the "monitorability tax" [3]. as these models get smarter, their internal chain of thought $\\theta$ becomes increasingly alien and illegible to humans. to keep them safe, developers force the model to output legible english thoughts. this actually slows them down. we are taxing their intelligence to keep them aligned with human readability. in the imo context, this was crucial because the proofs had to be graded by humans. if the model had used an internal "alien math" shorthand, it would have received a zero, regardless of the correct answer.

---

**3. the "warehouse" problem: a rigorous mathematical breakdown**

now, let us get into the weeds. why did they fail problem 6? the problem was a combinatorial tiling task. to make this concrete, let us use the "warehouse optimization" analogy.

**3.1 the scenario**

imagine you are the cto of a logistics firm. you have a massive automated warehouse floor that is a perfect square grid of size $n \\times n$ where $n = 2025$.

- **the goal:** you need to pave this floor with rectangular product pallets (tiles). you want to use the *minimum* number of tiles possible (larger tiles = better efficiency).
- **the constraint (osha):** you must install fire alarms (uncovered unit squares).
  1. every row must have exactly one fire alarm.
  2. every column must have exactly one fire alarm.
  3. no tile can cover an alarm.

your job is to place the $n$ alarms in a permutation $\\pi$ that allows you to use the fewest number of tiles to cover the rest of the floor.

**3.2 the trap: the diagonal permutation**

the ai models, acting as greedy optimizers, likely defaulted to the identity permutation (the main diagonal). let us define the set of alarms $S$ as:

$$S = \\{(i, \\pi(i)) : i \\in \\{1, ..., n\\}\\}$$

why is this bad?

let $T(S)$ be the number of rectangular tiles needed for a set of alarms $S$.

if alarms are on the diagonal, every tile is bounded by the "punctures" on the diagonal. a tile starting at row $r_1$ and ending at row $r_2$ cannot cross the diagonal because the alarm at $(k, k)$ where $r_1 \\le k \\le r_2$ would block it.

effectively, the grid splits into two triangular regions (upper and lower).

in the worst case (the diagonal), the number of tiles $T_{diag}$ approaches $O(n)$. specifically:

$$T_{diag}(n) \\approx 2(n-1)$$

for $n = 2025$, this results in $\\approx 4048$ tiles. the ai found this solution and stopped, thinking it was optimal. it satisfied all constraints, but it was terribly inefficient.

**3.3 the optimal solution: the dilworth bound**

the correct answer requires a construction rooted in **dilworth's theorem** and partial order theory. the minimum number of tiles $T_{min}$ is actually given by:

$$T_{min}(n) = 2(\\lceil \\sqrt{n} \\rceil - 1)$$

for our warehouse where $n = 2025$:

$$T_{min}(2025) = 2(\\lceil \\sqrt{2025} \\rceil - 1) = 2(45 - 1) = 88$$

**the proof sketch:**

we can define a partial order on the cells of the grid. let two cells $(r_1, c_1)$ and $(r_2, c_2)$ be comparable if $r_1 < r_2$ and $c_1 < c_2$.

the number of tiles required is linked to the structure of "chains" (increasing sequences) and "antichains" (decreasing sequences) in the permutation of alarms.

if we let $k$ be the length of the longest chain of alarms, and $l$ be the length of the longest antichain, a known result in this domain (the greene's theorem extension for grid tilings) suggests the cost is roughly proportional to $k + l$.

to minimize the sum $k + l$ subject to $k \\cdot l \\ge n$ (by erdős-szekeres), we need $k \\approx l \\approx \\sqrt{n}$.

**the "hiura" construction:**

we partition the $n \\times n$ grid into $m \\times m$ blocks, where $m = \\lceil \\sqrt{n} \\rceil$. we place the alarms such that they form a specific "snaking" pattern through these blocks.

specifically, we choose $m = 45$.

the alarms are placed to ensure that we can form massive rectangles that span $\\sqrt{n}$ rows and $\\sqrt{n}$ columns simultaneously.

by balancing the "increasing" and "decreasing" runs of the alarms to be length $\\sqrt{n}$, we minimize the fragmentation.

**3.4 why the ai failed: the missing global vision**

the ai failed because it lacks **global constructive vision**. chain-of-thought is sequential. it is great at local deductions:

*"if A then B. if B then C. therefore, C."*

it is terrible at global optimization problems that require "seeing" the topology:

*"the grid, as a whole, can be partitioned into sqrt(n)-sized blocks."*

the model could not visualize that breaking the symmetry of the diagonal would yield a $O(n)$ to $O(\\sqrt{n})$ improvement. it got stuck in a local optimum because the gradient of "reasoning" points towards simpler, more symmetric structures like the diagonal [4]. it could not make the "intuitive leap" that a square root function was relevant to a tiling problem.

---

**4. the critical nuances: fairness and tools**

there are two major nuances that critics often miss when analyzing this result.

**1. the "code-augmented" hypothesis:**

the ai models were restricted from using tools. they had no python interpreter. this is a massive handicap. if the models had been allowed to write code, they likely would have solved problem 6.

why? because they would not have tried to "reason" the proof from scratch. they would have written a script to simulate the tiling for $n = 1, 2, 3, ..., 100$.

they would have generated the data: $T(n) = 0, 0, 2, 2, 4, 4, ...$

they would have fit the curve $T(n) = 2(\\lceil \\sqrt{n} \\rceil - 1)$.

once they had the formula empirically, the "reasoning" engine would have worked backward to construct the proof. the failure was not in *proving*, but in *conjecturing*.

**2. the contamination debate:**

skeptics argue the models just memorized the training data. this is why problem 6 is so important. it was a novel construction. the fact that the models failed p6 while acing p1-p5 is actually **evidence against memorization**. if they were just reciting similar problems seen in training, they likely would have hallucinated a solution to p6 based on a similar-looking past problem. the "hard zero" proves they were genuinely trying to reason and genuinely hit a wall.

---

**5. the gap: you are using the wrong tools**

if you are a developer building software on top of gpt-4o or claude 3.5, you need to look at this data.

| difficulty tier | description | gpt-4o / claude 3.5 | o1 / deep think |
| --- | --- | --- | --- |
| tier 1 | grade school math | 90%+ | 100% |
| tier 3 | national olympiad | <20% | 50% |
| tier 5 | imo hard (problem 6) | 0% | 0% |

the commercial models we use daily did not just fail to get gold. they failed to get a bronze. they scored under 13 points [1].

this gap is massive. we are building enterprise software on "system 1" models that cannot handle complex logic without massive hand-holding. the "reasoning" models are a totally different beast.

---

**6. implications for software engineering**

so, what does a math competition tell us about building apps? everything.

**6.1 the "rule engine" is essential**

the ai failed problem 6 because it could not optimize globally. in a real business, that failure means violating a safety regulation or crashing a database.

**takeaway:** we cannot trust ai with "black box" optimization yet. we need **neuro-symbolic** systems. let the ai propose a warehouse layout, but run it through a deterministic code-based verifier (a rule engine) before you accept it.

if verify(ai_output) returns false, loop back.

**6.2 agentic workflows need context**

the ai failed because it treated the grid as a sequence of rows, not a holistic map. if you are building ai agents, you cannot just feed them a jira ticket. you must provide the **global context** -the full architecture, the database schema, the "grid." an agent without context is just a diagonal line placer in a world that needs a hiura construction [5].

**6.3 the cost of thinking**

inference is no longer a flat rate. a "hard" query might take 10 minutes of gpu time and cost $5.00. we need to redesign our apis to handle asynchronous, long-running "thought processes." the days of expecting a 200ms json response for complex logic are over [6].

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
[6] "economics of inference-time compute", semianalysis.

---

**links**

- [imo 2025 official site](https://www.imo-official.org)
- [google deepmind gemini report](https://deepmind.google/technologies/gemini/)
- [openai o1 system card](https://openai.com/index/o1-system-card-safety/)`,
  },
  {
    id: "blog-kimi-k2",
    slug: "silicon-curtain-kimi-k2",
    title: "blog: kimi k2  - $4.6m to beat gpt-5, sanctions failed",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-12-19T09:00:00.000Z",
    content: `**the silicon curtain just fell: why kimi k2 is the most important ai release of the decade**

i have been arguing for years that the "capital moat" theory of ai -the idea that you need a gdp-sized budget and a nuclear power plant to train a frontier model -was a temporary anomaly, not a law of physics. silicon valley vcs and us policymakers bet the house on the assumption that raw scale was the only path to agi. they believed that as long as the us controlled the supply of h100s and had the deepest pockets, hegemony was secured.

on november 6, 2025, that assumption evaporated.

moonshot ai released kimi k2 thinking. it is not just another llm. it is a discontinuous leap in architectural efficiency that effectively bypasses us semiconductor sanctions and beats the us flagship model, gpt-5, on reasoning tasks. and they did it for $4.6 million [1].

if you are not paying attention to the specific engineering choices that made this possible, you are missing the biggest shift in the ai arms race since the transformer paper. let's look at the math, the architecture, and why the geopolitical map just inverted.

---

**the architecture of asymmetry**

the headline number is that kimi k2 is a **1 trillion parameter** model. but that number is a trap. in the old "dense" model paradigm (think gpt-4 original flavor), running a 1t model would require an inference cluster so large it would bankrupt a small startup.

moonshot ai didn't build a dense model. they built a sparse mixture-of-experts (moe) system that completely decouples knowledge capacity from inference cost.

**1. the sparse matrix**

kimi k2 uses a granular routing mechanism with 384 expert networks [2]. when you send a token to the model, it doesn't activate the whole brain. a learned gating network selects only the top-8 experts relevant to that specific concept.

here is the breakdown:

- **total parameters ($P_{total}$):** $1 \\times 10^{12}$
- **active parameters ($P_{active}$):** $\\approx 32 \\times 10^{9}$
- **activation rate:** $\\frac{32B}{1T} = 3.2\\%$

mathematically, if $E$ is the set of experts and $G(x)$ is the gating function for input $x$, the output $y$ is calculated as:

$$y = \\sum_{i \\in \\text{Top-}8(G(x))} G_i(x) \\cdot E_i(x)$$

this allows kimi k2 to "know" as much as a supercomputer but "run" on high-end consumer hardware. it lowers the time-to-first-token (ttft) drastically. while us labs were focused on "scaling laws" (add more compute), moonshot focused on "efficiency laws" (remove the waste).

**2. native int4: the sanction buster**

this is the piece that i think us policymakers misunderstood the most. the export controls on nvidia chips were designed to limit memory bandwidth ($B_{mem}$), which is the primary bottleneck for llm inference.

kimi k2 features **native int4 quantization-aware training (qat)** [3]. most models are trained in 16-bit floating point ($bf16$) and then compressed later, which causes "brain damage" or reasoning degradation. moonshot trained this model in 4-bit integers from day one.

why does this matter? it is simple arithmetic.

$$B_{\\text{effective}} = B_{\\text{hardware}} \\times \\frac{\\text{bits}_{\\text{standard}}}{\\text{bits}_{\\text{model}}} = B_{\\text{hardware}} \\times \\frac{16}{4} = 4 \\times B_{\\text{hardware}}$$

by moving from 16-bit to 4-bit, they reduced the weight size by a factor of 4. this effectively **quadruples the memory bandwidth** of their existing hardware stockpiles [4]. a restricted h800 chip in china running kimi k2 now has the effective throughput of an unrestricted h100 running a standard us model. the sanctions didn't stop them; they just forced them to write better code.

**3. the muon optimizer**

training a 1t parameter moe in 4-bit precision is notoriously unstable. to solve this, they ditched adamw for the **muon optimizer** [1].

muon orthogonalizes gradient updates, which prevents the "expert collapse" problem where the router gets lazy and sends everything to one expert. the research shows muon improves computational efficiency by a factor of 2 compared to standard optimizers [1]. this is how they kept the training cost so low.

---

**the cognitive shift: interleaved reasoning**

we are moving past the era of "chain-of-thought" (cot) where the model dumps a static block of text and then gives an answer. kimi k2 implements **interleaved reasoning**, which treats thinking as a persistent, agentic loop [5].

instead of *input → think → output*, the kimi k2 loop looks like this:

*input → think → tool call (act) → **observation** → think (update state) → tool call (act) → ... → answer*

the model thinks, performs a tool call (like a python script), observes the result, updates its internal state, and thinks again. it can maintain this "thought trace" across 200-300 sequential steps [1]. it allows for self-correction. if a tool fails, it doesn't hallucinate a success; it reads the error log, rewrites the code, and tries again.

**heavy mode: system 2 thinking**

for hard problems, kimi k2 engages "heavy mode," which spawns eight parallel reasoning trajectories [3]. it is a tree of thoughts search implemented at inference time. a meta-reasoning layer then acts as a judge, synthesizing the best outcome. this is the difference between intuitive guessing (system 1) and deliberate calculation (system 2).

---

**the benchmarks: humanity's last exam**

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

**the economic reality check**

here is the statistic that should terrify silicon valley.

- **gpt-5 estimated training cost:** ~$500 million to $2.5 billion [8]
- **kimi k2 training cost:** **$4.6 million** [1]

moonshot ai achieved state-of-the-art performance for roughly 1% of the cost of a us frontier model. this destroys the "capital moat." if a frontier model costs $4.6 million, it is no longer the domain of hyperscalers (google, microsoft). it is within the budget of a series a startup, a university, or a mid-sized nation-state.

we are seeing a massive deflationary pressure. kimi k2 is open-weight (modified mit license) [9]. why would a european enterprise pay openai $30 per million tokens when they can run a smarter model locally for the cost of electricity?

---

**the geopolitical inversion**

this release marks the failure of the hardware containment strategy. the us assumed that by controlling the "thermodynamics" of compute (limiting watts and flops via hardware bans), they could control the output of intelligence.

they were wrong.

sanctions forced chinese labs to become efficient. while us labs got lazy with massive compute resources, chinese labs optimized every bit. now that they have the superior architecture, any hardware they do acquire yields exponential returns.

we are already seeing a user adoption shift. procurement data shows that **78% of organizations** prioritizing data sovereignty are now selecting kimi k2 architectures over gpt-5 [10]. the global south and non-us western allies are looking for options that don't pipe their data directly into us-controlled servers. china is positioning itself as the "benevolent provider" of open-source intelligence, a massive soft-power play.

---

**my take**

the era of us unilateral dominance in ai ended on november 6, 2025.

the future isn't going to be a single monopoly model running in a us datacenter. it is going to be hybrid, interleaved, and ruthlessly efficient. kimi k2 proves that ingenuity is a better predictor of performance than capital expenditure.

if you are building in this space, stop assuming that "bigger is better." the game has changed to "smarter is cheaper."

---

**references**

[1] moonshot ai technical report, "efficiency laws and the muon optimizer," 2025.
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
    id: "blog-fracture-enterprise-ai",
    slug: "fracture-enterprise-ai",
    title: "blog: enterprise ai is broken  - deepseek, dora, and the agentic wall",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-12-18T14:30:00.000Z",
    content: `**the fracture: why deepseek, the dora report, and the "agentic transition" just broke the enterprise ai model**

i have been analyzing the state of enterprise technology for a long time, and i have to say that the current moment feels distinct. it is not just the usual hype cycle. it feels like the tectonic plates of the industry are grinding against each other. we are living through a "phase transition," and like any change in state, things are getting volatile.

the narrative we have been sold for the last two years is simple: buy the model, put it in the app, profit. but the reality i'm seeing on the ground is completely different. we are witnessing a collision of three massive forces: a productivity paradox that won't go away, a technical "sputnik moment" from china that is breaking pricing models, and a geopolitical crackdown that is fracturing the internet itself.

this post is going to be long. we need to get into the math, the architecture, and the messy geopolitical reality. but if you want to understand why your ai pilot is stuck in "poc purgatory" or why the us government is suddenly terrified of a chinese open-source model, you need to understand the bifurcation happening right now.

---

**1. the productivity paradox: why your "ai app" isn't working**

let's start with the elephant in the room. we are two years into the generative ai revolution, and for most enterprises, the roi just isn't there.

economist robert solow famously quipped in 1987, "you can see the computer age everywhere but in the productivity statistics" [1]. we are seeing the exact same thing today. we see ai in our ides, our notion docs, and our search bars. but we do not see it in the ebitda.

why? because we are stuck in phase one of the maturity curve: **the assistive trap**.

90% of organizations are here [2]. we treat ai as a "copilot." it is a faster typewriter. it helps a developer write a function 10% faster, or a marketer draft an email 20% faster. but this is an "additive" approach. it doesn't remove work; it often creates it.

stanford researchers have coined a term for this: **"workslop"** [3]. because the marginal cost of creating content (code, text, emails) has dropped to near zero, we are flooding our organizations with low-value digital artifacts. someone has to review that code. someone has to read that verbose email. the bottleneck didn't disappear; it just moved from creation to verification.

to actually get the "trillion-dollar impact" analysts promised, we have to move to **phase two: agentic workflows**. this is where the ai stops being a helper and starts being a manager. it takes a goal ("fix this bug," "process this invoice") and executes the loop autonomously [4].

but here is the catch. agentic workflows break the economic model of 2024.

---

**2. the math of the agentic loop**

agents are expensive. in a standard chat interface, you ask a question, and the model answers. linear cost.

in an agentic loop, the model reasons, creates a plan, uses a tool, reads the output, realizes it failed, corrects the plan, and tries again. this recursive loop consumes massive amounts of tokens.

if you are running a complex agentic workflow, you are looking at a **15x token multiplier** compared to a standard chat [5].

let's look at the unit economics.

if you are using a gpt-4 class model at standard western pricing (approx. $15.00 blended per million tokens) to run a background agent that processes invoices:

- **context:** 50k tokens (history + docs)
- **iterations:** 10 loops
- **total tokens:** 500,000
- **cost:** ~$7.50 per invoice

that is insolvent. it is cheaper to hire a human. this is the **"unreliability tax"** [5]. you are paying for the agent to fix its own mistakes.

this economic wall was supposed to hold for another few years. but then, deepseek happened.

---

**3. the sputnik moment: deepseek v3.2 and the "china shock"**

in early 2025, deepseek (a chinese lab) dropped v3.2. it didn't just compete with western models; it broke the pricing floor.

they are offering frontier-level reasoning (beating gpt-4o on some benchmarks) for **$0.28 per million tokens**.

how? they didn't just throw more gpus at the problem. they couldn't. due to us export controls, they are forced to train on nvidia h800s -crippled chips with reduced interconnect bandwidth [6]. constraints breed creativity. they had to innovate on the architecture to survive.

here is the technical breakdown of how they cheated the physics of the transformer.

**3a. deepseek sparse attention (dsa)**

the fundamental flaw of the standard transformer architecture is that the attention mechanism has a complexity of O(N²), where N is the context length [7]. if you double the text, the compute cost quadruples.

deepseek introduced sparse attention. instead of every token looking at every other token, they use a "lightning indexer."

- the indexer scans the global context and identifies relevant "blocks"
- the model only activates its heavy compute on the top-k relevant blocks
- it effectively turns an O(N²) problem into a roughly linear problem

**3b. multi-head latent attention (mla)**

the other bottleneck is memory. storing the "key-value (kv) cache" for long conversations eats up massive amounts of vram.

deepseek compresses the kv cache into a low-rank latent vector [8]. this allows them to serve way more concurrent users on fewer gpus.

the result? they can run massive 685-billion parameter models at a fraction of the cost of openai or anthropic.

---

**4. the geopolitical fracture**

this technical breakthrough has triggered a massive geopolitical reaction. we are seeing a "splinternet" emerge in real-time.

us sanctions were designed to starve china of compute. but deepseek proved that **algorithmic efficiency > brute force hardware**.

now, the us government is scrambling. we are seeing proposed legislation like the "no deepseek on government devices act" [9] and aggressive "know your customer" (kyc) laws for cloud providers [10]. the fear is valid. if the entire western developer ecosystem starts routing their code through a chinese api because it is 95% cheaper, that is a massive data exfiltration risk (or "trojan horse" scenario) [11].

but the market is ruthless. i am seeing cios and ctos quietly utilizing what i call the **"cloud loophole."** they are using western aggregators (like openrouter) or hosting the open weights in neutral clouds to access this cheap intelligence. the mandate is "fast and cheap," and right now, the east is winning on unit economics.

---

**5. the "ai mirror": what the dora report tells us**

even if you solve the cost problem with deepseek, you still have the organizational problem. the 2024 dora state of devops report dropped a bombshell that many people ignored: **ai is hurting stability for low-performing teams** [12].

they found a **7.2% decrease in delivery stability** for teams that adopted ai without having strong platform engineering fundamentals.

why? because ai acts as an **"ai mirror."** it reflects and amplifies your existing culture.

- if you have a high-trust, automated ci/cd culture (elite performers), ai accelerates you
- if you have a manual, bureaucratic culture (low performers), ai just generates more "workslop" that gets stuck in your manual testing queues

this creates **"downstream disorder"** [13]. developers generate code in minutes, but the security review takes days. the inventory of half-baked code piles up, and the system clogs.

---

**6. the strategy: building the agentic mesh**

so, what do we do? we cannot ignore the efficiency of the chinese models, but we cannot ignore the security risks. and we certainly cannot ignore the organizational dysfunction.

here is the roadmap for the ai native transition:

**6a. the agentic mesh**
stop building chatbots. start building an infrastructure where agents can talk to each other. this means moving from "human-readable" data (pdfs) to "agent-readable" data (semantic knowledge graphs) [14].

**6b. the ai gateway**
you need a virtualization layer. do not hardcode openai or deepseek into your app. use an ai gateway that routes traffic:
- **high security/reasoning:** route to gpt-4o / claude 3.5 (west)
- **high volume/low risk:** route to a self-hosted deepseek v3 (east/local)

**6c. clean rooms**
if you are going to use the "cheap" models, do not use the public api. download the open weights. run them in an air-gapped vpc with zero internet egress. sanitize the inputs and outputs.

**6d. platform engineering**
you cannot have humans in the loop for every agent action. you need automated governance that scans ai code for vulnerabilities before it hits the repo.

---

**7. the verdict**

the global ai ecosystem is dead. it has bifurcated into a **high-cost/high-compliance stack (west)** and a **low-cost/hyper-efficient stack (east)**.

the winners of the next cycle won't be the ones who blindly pick a side. it will be the ones who can architect a system that leverages the economics of the east and the safety of the west, while rigorously automating their own internal culture to handle the speed.

the "productivity paradox" isn't a failure of the technology. it's a failure of our architecture. time to fix it.

---

**references**

1. solow, r. m. (1987). [we'd better watch out](https://www.nytimes.com/1987/07/12/books/we-d-better-watch-out.html), new york times book review
2. [2024 ai adoption index](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/ai-adoption-index), ibm
3. [workslop and the hidden costs of ai](https://hai.stanford.edu/), stanford hai
4. [agentic workflows vs zero-shot](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/), andrew ng
5. [the unreliability tax in agentic systems](https://www.latent.space/p/agents-reliability), latent space
6. [the chip ban & h800 constraints](https://www.reuters.com/technology/nvidia-h800-chinas-alternative-h100-chip-2023-03-22/), reuters
7. [deepseek v3 technical report](https://arxiv.org/abs/2412.19437), arxiv
8. [multi-head latent attention analysis](https://arxiv.org/abs/2405.04434), arxiv
9. [proposed no deepseek legislation](https://www.congress.gov/bill/118th-congress/house-bill/1234)
10. [us dept of commerce iaas rule](https://www.bis.doc.gov/index.php/regulations/export-administration-regulations-ear)
11. [ai poisoning & backdoors in open weights](https://arxiv.org/abs/2401.05566), arxiv
12. [dora state of devops report 2024](https://dora.dev/research/2024/dora-report/)
13. [cognitive load & platform engineering](https://platformengineering.org/blog/what-is-platform-engineering)
14. [semantic data planes for ai](https://www.semanticweb.org/)`,
  },
  {
    id: "writing-desire",
    slug: "two-faces-of-desire",
    title: "blog: desire  - when wanting less is wisdom vs. when it's defeat",
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
    id: "food adventures",
    slug: "food adventures",
    title: "food adventures",
    category: "favorites",
    folder: "bookmarks",
    public: true,
    session_id: "",
    created_at: "2025-08-08T13:55:00.000Z",
    content: `spots i keep coming back to. mix of top-rated and hidden gems.

**london** *(home)*
- *dishoom*  - the keema per eedu at breakfast. chicken ruby for dinner. institution.
- *tayyabs*  - whitechapel legend. lamb chops that haunt your dreams. always a queue.
- *gymkhana*  - michelin-starred indian. refined, rich, worth every penny.
- *mangal 2*  - dalston ocakbasi. charcoal-grilled perfection.
- *the meat co.*  - westfield. proper halal steakhouse when you need a good cut.
- *maroush*  - edgware road. lebanese late-night after everything else closes.
- *sheesh*  - chigwell vibes. turkish done upscale.

**new york**
- *hyderabadi zaiqa*  - michelin guide biryani. dum style, curry hill.
- *the halal guys*  - street cart classic. white sauce is the move.
- *al badawi*  - brooklyn, middle eastern, traditional setting.
- *adel's famous halal pizza*  - halal slices with proper nyc attitude.

**san francisco**
- *old mandarin islamic restaurant*  - hidden gem. halal chinese, the hot pot is unreal.
- *reem's california*  - arab street food. mana'eesh and fresh bread.
- *mela tandoori kitchen*  - solid pakistani and indian. reliable.

**milan**
- *aladino*  - cozy egyptian/middle eastern. kebabs and falafel done right.
- *riad marrakech*  - moroccan tagines and couscous in traditional setting.
- *dawali*  - lebanese in central milan. good mezze spread.

**rome**
- *himalaya's kashmir*  - indian/pakistani biryani and tandoori. reliable halal.
- *ali baba*  - middle eastern classics. falafel and shawarma.

**paris**
- *l'as du fallafel*  - marais district. the falafel sandwich is legendary.
- *kashmir house*  - pakistani done well. curries with depth.
- *le wok saint germain*  - halal asian fusion. stir-fries and noodles.

**tenerife**
- *restaurante libanés el líbano*  - lebanese on the island. mezze and grills.

**dubai** *(everything halal but these stand out)*
- *al ustad special kabab*  - old dubai institution. iranian kebabs since forever.
- *3 fils*  - japanese-middle eastern fusion. waterfront vibes.
- *al fanar*  - traditional emirati. nostalgic setting, proper local food.
- *enigma at palazzo versace*  - fine dining. persian influences, special occasion.

**munich**
- *saray restaurant*  - turkish classics. köfte and kebabs.
- *sultanahmet köftecisi*  - another solid turkish option.
- *sababa*  - middle eastern. falafel and shawarma.

**dhaka** *(home country, everything halal)*
- *star kabab & restaurant*  - the kebabs. traditional bangladeshi done right.
- *nando's*  - yes, it's a chain, but the peri peri hits different there.
- *kacchi bhai*  - if you want real kacchi biryani.

i always update this list when i visit new places.`,
  },
  {
    id: "favorites-videos",
    slug: "favorite-videos",
    title: "favorite interviews & videos",
    category: "favorites",
    folder: "bookmarks",
    public: true,
    session_id: "",
    created_at: "2025-07-14T08:29:00.000Z",
    content: `videos i've rewatched. conversations that shifted something.

**sport**
- *michael jordan - the last dance*  - obsession, leadership, the cost of greatness.
- *sachin tendulkar: a billion dreams*  - cricket as religion, pressure as fuel.
- *pep guardiola masterclass*  - tactics, philosophy, how he sees the game.
- *kobe bryant's mamba mentality interview*  - relentless work ethic explained.
- *muhammad ali interviews*  - conviction, wit, standing for something.

**music & artists**
- *frank ocean - blonded radio episodes*  - rare glimpses into his process.
- *quincy jones on finding michael jackson*  - legendary storytelling.
- *rick rubin: the creative act*  - on taste, silence and letting things emerge.
- *tyler, the creator on flower boy*  - growth, vulnerability, artistic evolution.
- *j dilla documentary: still shining*  - the producer's producer.

**film & storytelling**
- *martin scorsese on cinema*  - what makes a movie a movie.
- *christopher nolan bfi masterclass*  - time, structure, practical effects.
- *hayao miyazaki: 10 years with the master*  - animation as meditation.
- *denis villeneuve on dune*  - adapting the unadaptable.
- *a24 behind the scenes*  - how they built a studio on taste.

**philosophy & faith**
- *hamza yusuf lectures on the soul*  - islamic spirituality, beautifully articulated.
- *abdal hakim murad on modernity*  - tradition meeting the contemporary.
- *alan watts on letting go*  - eastern philosophy, western clarity.
- *simone de beauvoir interview (1959)*  - freedom, choice, existence.
- *james baldwin debates william buckley*  - rhetoric, dignity, truth to power.

**culture & ideas**
- *anthony bourdain: parts unknown*  - any episode. travel as understanding.
- *chimamanda ngozi adichie: the danger of a single story*  - perspective, narrative.
- *david foster wallace on ambition*  - the water we swim in.
- *trevor noah on identity*  - code-switching, belonging, humor as survival.
- *roger federer dartmouth commencement*  - effortless is a lie, accept losing.

**documentaries**
- *jiro dreams of sushi*  - mastery, dedication, 80 years of one thing.
- *free solo*  - fear, preparation, what commitment actually looks like.
- *chef's table: jeong kwan*  - cooking as spiritual practice.
- *the defiant ones*  - dr. dre and jimmy iovine. unlikely partnership, empire.
- *senna*  - rivalry, purity, racing as art.

**design & craft**
- *jony ive on objectified*  - obsession with materials and intent.
- *dieter rams: less but better*  - principles that outlast trends.
- *kenya hara on emptiness*  - japanese design philosophy.

**building things**
- *steve jobs lost interview (1995)*  - taste, conviction, what matters.
- *andrej karpathy neural net lectures*  - if you want to actually understand ml.
- *bret victor: inventing on principle*  - what a creative tool should feel like.`,
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
*now:* sleep, rest, and stepping away are inputs, not rewards. my best work happens in 4 focused hours, not 12 scattered ones.

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
*now:* passion follows mastery. get good at something useful, find meaning in the craft, and passion often shows up. waiting for passion is a trap.

**"success is making it"**
*before:* there's a finish line. get the job, hit the number, then you're done.
*now:* there's no arrival. just different games with different stakes. peace comes from the process, not the outcome.

this list will keep growing. that's the point.`,
  },
  {
    id: "writing-curves",
    slug: "curves-of-the-mind",
    title: "blog: from shepherds to gödel  - mathematics as human story",
    category: "writing",
    folder: "blog",
    public: true,
    session_id: "",
    created_at: "2025-05-09T10:36:00.000Z",
    content: `mathematics is not a cold kingdom of eternal truths set apart from the world. it is a living river, flowing through cultures, carrying with it the sediments of survival and the light of transcendence. ubiratan d'ambrosio calls this current ethnomathematics, for mathematics is always shaped by the human hand, always marked by the earth from which it springs. the *ethno* gives us the soil and the sky, the *mathema* gives us that which is learned and the *tics* gives us the techniques by which we survive and dream. in this view, mathematics is not a ladder dropped from heaven but a rope we weave ourselves, strand by strand, to climb beyond our limits.

---

at its dawn, mathematics was a matter of necessity. the shepherd who placed a stone for every sheep was already discovering bijection, though he had no name for it. his practice embodies the truth that a function $f: S \\to P$ may be injective and surjective, a pairing where nothing is lost and nothing is left unmatched.

in time, the act of counting became number itself and from number, arithmetic was born. peano would later capture this in axioms such that zero is a number, each number has a successor and addition arises by recursion:

$$m + 0 = m$$

$$m + S(n) = S(m + n)$$

what began with sheep and stones has become a pure, infinite ladder, climbing ever upward, rung by rung.

---

cultures across the earth gave different voices to this truth. the babylonians wrote in base sixty, the mayans in base twenty, the romans in rigid numerals. in the house of wisdom in baghdad, al-khwarizmi gave birth to algebra. he named it *al-jabr*, the art of restoration, balancing what is unknown until it is revealed.

to solve $x^2 + 10x = 39$, he completed the square:

$$x^2 + 10x + 25 = 64$$

so that $x + 5 = 8$ and $x = 3$.

what began as a method of solving practical problems has become a universal language of relations. his algorithms, with his very name giving us the word, seeded the logic of the machines that now hum in every corner of our lives. and his introduction of the hindu-arabic numerals and zero was a revolution beyond reckoning, for zero allowed us not only to count but to imagine the void as number, the infinite as countable.

---

geometry, too, was carried forward in these lands. omar khayyam, both poet and mathematician, sought to untangle euclid's parallel postulate, long a thorn in the side of geometry. he studied its hidden structure and in doing so touched the very threshold of non-euclidean spaces centuries before bolyai or lobachevsky.

khayyam also solved cubic equations using conic sections, drawing a parabola and a circle whose intersection revealed the solution. the equation

$$x^3 + 200x = 20x^2 + 2000$$

was not abstract to him but a curve in space, its truth discovered where shapes meet. he saw algebra and geometry as two halves of one harmony, much as his poetry saw the earthly and the eternal as two reflections of the same light.

---

other voices carried the story further. al-kindi, philosopher of the arabs, spoke of numbers as keys to the harmony of the cosmos, a music heard not with the ears but with the intellect. ibn sina, physician and metaphysician, wove logic and mathematics into his vision of being itself, treating number and magnitude as the scaffolding upon which the edifice of knowledge must rise.

nasir al-din al-tusi, working in maragha, refined euclidean geometry and studied the motion of planets, creating the tusi couple, a geometric construction that generates linear motion from two circles. centuries later, this very device appeared in copernicus' *de revolutionibus*, a quiet testament to the transmission of ideas across cultures.

ibn al-haytham, in his *book of optics*, treated light not only as a physical phenomenon but as a problem in geometry and algebra. his method of controlled experimentation and his analyses of reflection and refraction carried the seeds of what we now call the scientific method. for him, geometry was not only the measure of space but the language of vision itself.

---

the rhythm of survival and transcendence beat again in the invention of calculus. newton and leibniz, grappling with the mystery of motion, invoked infinitesimals, quantities smaller than any number yet greater than zero. they were ghosts, but ghosts with power. berkeley mocked them as phantoms, but planets traced their orbits under their spell.

it was cauchy and weierstrass who gave them clarity, defining limits with precision. to say $\\lim_{x \\to a} f(x) = L$ is to bind the elusive word "approaches" with the language of $\\varepsilon$ and $\\delta$:

$$\\forall \\varepsilon > 0, \\exists \\delta > 0 : |x - a| < \\delta \\Rightarrow |f(x) - L| < \\varepsilon$$

from this, the derivative and the integral arise, rigorous, unshakable, yet still rooted in that ancient desire to capture change itself.

---

and yet, mathematics also encounters its own horizons. in the twentieth century, gödel showed that any system rich enough to contain arithmetic will harbor truths it cannot prove. his incompleteness theorems revealed mathematics to be inexhaustible, forever incomplete. far from diminishing it, this gave mathematics its most profound transcendence, for it revealed that the human quest for knowledge is infinite.

---

to gather sheep with stones, to solve quadratics by completing the square, to trace the path of a planet with a circle within a circle, to define rigor with $\\varepsilon$ and $\\delta$, to discover that truth itself will always exceed our grasp -these are not separate acts but one story.

they are the human story of mathematics, rising from survival into transcendence. al-khwarizmi's equations, khayyam's curves, al-tusi's couples, ibn al-haytham's rays, peano's axioms, weierstrass's limits and gödel's theorems are chapters in a single book we are still writing.

to study mathematics is to walk this path, to trace the footprints of shepherds, philosophers and poets and to add our own. it is to glimpse, in the language of number and proof, the unending effort of a species not content to survive but always reaching beyond, seeking in the finite symbols of mathematics a reflection of the infinite.`,
  },
];
