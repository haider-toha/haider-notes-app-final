# N17 — self-engineering agent

folder: projects
date: 18 september 2025
slug: self-engineering-agent

===== PHYSICAL PAGE 167 =====

[ ] copied

[N17]

self-engineering agent

an autonomous ai system that creates its own
tools on demand. rather than relying on pre-built
tool libraries that developers must manually create and
maintain, this system enables ai agents to synthesize
new tools automatically when needed using test-driven development
methodology.

github ↗ • demo ↗

the problem: static tool libraries

every major ai agent framework (langchain, llamaindex, autogen,
crewai) shares a fundamental limitation: they depend on
static tool libraries. when a user needs functionality
that doesn't exist, development stops until a human
developer manually creates the new tool.

[CODE START]
flowchart LR
    subgraph Traditional["Traditional Workflow"]
        A[User Request] --> B{Tool Exists?}
        B -->|Yes| C[Execute Tool]
        B -->|No| D[Fail / Error]
        D --> E[Notify Developer]

===== END PHYSICAL PAGE 167 =====
===== PHYSICAL PAGE 168 =====

[ ] copied

[N17 continued]

        E --> F[Manual Development]
        F --> G[Write Tests]
        G --> H[Debug & Deploy]
    end
[CODE END]

this process typically takes hours to days per
new capability. for organisations needing dozens of specialised
tools, this becomes unsustainable.

the solution: self-engineering agents

when the agent encounters a request it cannot
fulfill with existing tools, it automatically synthesizes a
complete solution: specification, test suite, implementation, security verification
and registration.

[CODE START]
flowchart LR
    subgraph SelfEng["Self-Engineering Workflow"]
        A[User Request] --> B{Tool Exists?}
        B -->|Yes| C[Execute Tool]
        B -->|No| D[Auto-Synthesize]
        D --> E[Generate Spec]

===== END PHYSICAL PAGE 168 =====
===== PHYSICAL PAGE 169 =====

[ ] copied

[N17 continued]

        E --> F[Create Tests]
        F --> G[Implement Code]
        G --> H[Verify in Sandbox]
        H --> I[Register Tool]
        I --> C
    end
[CODE END]

the framework uses test-driven development for a critical
reason: tests serve as unambiguous specifications. by generating
tests before implementation, the system ensures clear requirements,
automatic verification, edge case coverage and quality assurance.

system architecture

[CODE START]
flowchart TB
    subgraph UI["User Interface Layer"]
        WEB[Web Interface]
        WS[WebSocket Handler]
    end
    
    subgraph ORCH["Orchestration Layer"]
        AO[Agent Orchestrator]

===== END PHYSICAL PAGE 169 =====
===== PHYSICAL PAGE 170 =====

[ ] copied

[N17 continued]

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

===== END PHYSICAL PAGE 170 =====
===== PHYSICAL PAGE 171 =====

[ ] copied

[N17 continued]

    ORCH <--> SYNTH
    INTEL <--> DATA
    SYNTH <--> DATA
[CODE END]

orchestration layer: the agent orchestrator serves as the
central brain, coordinating all subsystems. it receives user
requests, manages session context, routes to appropriate handlers,
tracks workflow execution and synthesizes final responses.

intelligence layer: query planner analyzes requests to determine
complexity and optimal execution strategy. semantic search finds
conceptually similar tools using vector embeddings. memory manager
maintains conversational context. reflection engine analyzes failures and
generates automatic fixes.

synthesis layer: specification generator transforms natural language into
formal function specifications. test generator creates comprehensive pytest
test suites. implementation generator writes production code to
satisfy all tests. sandbox verifier executes tests in
isolated docker containers.

===== END PHYSICAL PAGE 171 =====
===== PHYSICAL PAGE 172 =====

[ ] copied

[N17 continued]

the synthesis pipeline

[CODE START]
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
[CODE END]

===== END PHYSICAL PAGE 172 =====
===== PHYSICAL PAGE 173 =====

[ ] copied

[N17 continued]


stage 1 - specification: transforms natural language into
formal function specification including function name, typed parameter
definitions, return type and comprehensive docstring.

stage 2 - test generation: creates pytest tests
before implementation covering normal operation with typical inputs,
edge cases with boundary values, error conditions with
invalid inputs and data quality issues.

stage 3 - implementation: produces python functions with
proper type hints, handles all edge cases identified
in tests, provides meaningful error messages and follows
production coding standards.

stage 4 - sandbox verification: fresh docker container
created, implementation and tests copied in, pytest executes
with timeout limit, results captured, container destroyed regardless
of outcome.

stage 5 - registration: generate semantic embedding of
docstring, save implementation to tools directory, insert metadata
into database with embedding, tool immediately available for
future requests.

===== END PHYSICAL PAGE 173 =====
===== PHYSICAL PAGE 174 =====

[ ] copied

[N17 continued]


security architecture

ai-generated code presents unique security challenges. the framework
implements defense in depth:

[CODE START]
flowchart TB
    subgraph Defenses["Defense Layers"]
        L1["Container Isolation<br/>Fresh per execution, destroyed after"]
        L2["Network Isolation<br/>Disabled, no DNS, no ports"]
        L3["Resource Limits<br/>50% CPU, 256MB RAM, 30s timeout"]
        L4["Filesystem Protection<br/>Read-only mounts, only /tmp writable"]
        L5["Privilege Restriction<br/>Non-root, no sudo, minimal capabilities"]
    end
    
    L1 --> L2 --> L3 --> L4 --> L5 --> SAFE[Safe Execution]
[CODE END]

container isolation: every tool execution runs in a
docker container completely separate from the host. containers
use minimal python image with only essential dependencies.
container destruction after each run prevents state persistence.

===== END PHYSICAL PAGE 174 =====
===== PHYSICAL PAGE 175 =====

[ ] copied

[N17 continued]

network isolation: containers created with network disabled entirely.
no dns resolution, no outbound connections, no listening
ports. prevents data exfiltration and external communication.

resource limits: cpu quota limits to 50% of
single core, memory limit of 256mb prevents memory
bombs, 30-second timeout catches infinite loops, process limits
prevent fork bombs.

semantic intelligence

[CODE START]
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

===== END PHYSICAL PAGE 175 =====
===== PHYSICAL PAGE 176 =====

[ ] copied

[N17 continued]

    
    RANK --> DECISION{Score > 80%?}
    DECISION -->|Yes| EXEC[Execute Tool]
    DECISION -->|65-80%| VERIFY[Verify Compatibility]
    DECISION -->|Below 65%| SYNTH[Trigger Synthesis]
[CODE END]

traditional tool discovery relies on exact keyword matching.
"analyze csv" finds tools with "csv" in the
name, but "examine spreadsheet" finds nothing despite identical
intent.

the semantic system converts text into 1536-dimensional vectors
using openai embeddings that capture meaning. cosine similarity
measures conceptual relatedness. multi-factor re-ranking combines semantic similarity
(70%), historical success rate (20%) and usage frequency
(10%).

self-learning mechanisms

[CODE START]
flowchart TB
    subgraph Learning["Learning Loop"]
        EXEC[Tool Execution] --> LOG[Log Invocation]

===== END PHYSICAL PAGE 176 =====
===== PHYSICAL PAGE 177 =====

[ ] copied

[N17 continued]

        LOG --> METRICS[Update Metrics]
        METRICS --> SEQ[Sequence Detection]
        
        SEQ --> DETECT{Recurring Pattern?}
        DETECT -->|Yes| RECORD[Record Pattern]
        RECORD --> CONF[Confidence Scoring]
        
        CONF --> EVAL{Promotion Criteria Met?}
        EVAL -->|Yes| COMPOSITE[Generate Composite Tool]
        COMPOSITE --> REG[Register New Tool]
    end
[CODE END]

workflow pattern recognition: when tools are used in
consistent sequences (a followed by b followed by
c), patterns are recorded. patterns gain confidence through
repetition.

composite tool promotion: frequently-used patterns meeting promotion criteria
(minimum frequency, high success rate) become candidates for
composite tool generation. the synthesis engine creates a
single tool encapsulating the multi-tool workflow.

reflection engine: when tools fail in production, the

===== END PHYSICAL PAGE 177 =====
===== PHYSICAL PAGE 178 =====

[ ] copied

[N17 continued]

engine analyzes error messages and execution context to
identify root causes, produces corrected implementations, tests fixes
in sandbox before applying, maintains version history for
rollback.

conversational memory

practical workflows require remembering context. without memory, "now
filter that data" fails because the system doesn't
know what "that data" refers to. with memory,
users can reference previous results, build on earlier
computations and develop multi-step analyses conversationally.

session management: each conversation tracked as a session
with unique identifier. sessions group related messages and
persist across browser refreshes.

data reference tracking: pattern recognition identifies dataframes, lists
or results mentioned in responses. reference resolution maps
"use that data" to the correct data object.
availability verification confirms data is accessible in current
session.

context window management: sliding window includes most recent

===== END PHYSICAL PAGE 178 =====
===== PHYSICAL PAGE 179 =====

[ ] copied

[N17 continued]

messages. relevance filtering selects semantically relevant historical messages.
summarization condenses older context to preserve key information
while reducing tokens.

what i learned

- llms are surprisingly good at writing focused, single-purpose
  functions
- the hard part is the test harness, not
  the generation
- docker overhead (~2 seconds) is acceptable for the
  isolation guarantee
- tool descriptions matter more than implementations for retrieval
- tdd works even better for ai than for
  humans because tests provide unambiguous success criteria

stack: python 3.10+, flask, flask-socketio, openai api (gpt-4,
text-embedding-3-small), supabase (postgresql + pgvector), docker sdk

===== END PHYSICAL PAGE 179 =====
