# N12 — the moonshot that leaked

folder: blog
date: 28 december 2025
slug: silicon-curtain-kimi-k2

===== PHYSICAL PAGE 111 =====

[ ] copied

[N12]

the moonshot that leaked

i have been arguing for some time that
the "capital moat" theory of ai, the idea
that you need a gdp-sized budget and a
nuclear power plant to train a frontier model
was a temporary anomaly, not a law of
physics. silicon valley vc's and us policymakers bet
the house on the assumption that raw scale
was the only path to agi. they believed
that as long as the us controlled the
supply of h100s and had the deepest pockets,
hegemony was secured.

on november 6, 2025, that assumption evaporated.

moonshot ai released kimi k2 thinking and it
is a discontinuous leap in architectural efficiency that
effectively bypasses us semiconductor sanctions and beats the
us flagship model, gpt-5, on reasoning tasks. and
they did it for 4.6 million usd [1].

if you are not paying attention to the
specific engineering choices that made this possible, you
are missing the biggest shift in the ai
arms race since the transformer paper. let's look

===== END PHYSICAL PAGE 111 =====
===== PHYSICAL PAGE 112 =====

[ ] copied

[N12 continued]

at the math, the architecture and why the
geopolitical map just inverted.

1. the architecture of asymmetry

the headline number is that kimi k2 is
a 1 trillion parameter model. but that number
is a trap. in the old "dense" model
paradigm (think gpt-4 original flavor), running a 1t
model would require an inference cluster so large
it would bankrupt a small startup.

moonshot ai built a sparse mixture-of-experts (moe) system
that completely decouples knowledge capacity from inference cost.

1. the sparse matrix

kimi k2 uses a granular routing mechanism with
384 expert networks [2]. when you send a
token to the model, it doesn't activate the
whole brain. a learned gating network selects only
the top-8 experts relevant to that specific concept.

here is the breakdown:

===== END PHYSICAL PAGE 112 =====
===== PHYSICAL PAGE 113 =====

[ ] copied

[N12 continued]


- total parameters ($P_{total}$): $1 \times 10^{12}$
- active parameters ($P_{active}$): $\approx 32 \times 10^{9}$
- activation rate: $\frac{32B}{1T} = 3.2\%$

mathematically, if $E$ is the set of experts
and $G(x)$ is the gating function for input
$x$, the output $y$ is calculated as:

y = \sum_{i \in \text{Top-}8(G(x))} G_i(x) \cdot E_i(x)

this allows kimi k2 to "know" as much
as a supercomputer but "run" on high-end consumer
hardware. it lowers the time-to-first-token (ttft) drastically. while
us labs were focused on "scaling laws" (add
more compute), moonshot focused on "efficiency laws" (remove
the waste).

2. native int4 as the sanction buster

this is the piece that i think us
policymakers misunderstood the most. the export controls on
nvidia chips were designed to limit memory bandwidth
($B_{mem}$), which is the primary bottleneck for llm

===== END PHYSICAL PAGE 113 =====
===== PHYSICAL PAGE 114 =====

[ ] copied

[N12 continued]

inference.

kimi k2 features native int4 quantisation-aware training (qat)
[3]. most models are trained in 16-bit floating
point ($bf16$) and then compressed later, which causes
"brain damage" or reasoning degradation. moonshot trained this
model in 4-bit integers from day one.

why does this matter? it is simple arithmetic.

B_{\text{effective}} = B_{\text{hardware}} \times \frac{\text{bits}_{\text{standard}}}{\text{bits}_{\text{model}}} = B_{\text{hardware}} \times \frac{16}{4} = 4 \times B_{\text{hardware}}

by moving from 16-bit to 4-bit, they reduced
the weight size by a factor of 4.
this effectively quadruples the memory bandwidth of their
existing hardware stockpiles [4]. a restricted h800 chip
in china running kimi k2 now has the
effective throughput of an unrestricted h100 running a
standard us model. the sanctions just forced them
to write better code.

===== END PHYSICAL PAGE 114 =====
===== PHYSICAL PAGE 115 =====

[ ] copied

[N12 continued]

3. the muon optimiser

training a 1t parameter moe in 4-bit precision
is notoriously unstable. to solve this, they ditched
adamw for the muon optimiser [1].

muon orthogonalises gradient updates, which prevents the "expert
collapse" problem where the router gets lazy and
sends everything to one expert. the research shows
muon improves computational efficiency by a factor of
2 compared to standard optimisers [1]. this is
how they kept the training cost so low.

2. the cognitive shift to interleaved reasoning

we are moving past the era of "chain-of-thought"
(cot) where the model dumps a static block
of text and then gives an answer. kimi
k2 implements interleaved reasoning, which treats thinking as
a persistent, agentic loop [5].

instead of input → think → output, the
kimi k2 loop looks like this:

===== END PHYSICAL PAGE 115 =====
===== PHYSICAL PAGE 116 =====

[ ] copied

[N12 continued]

input → think → tool call (act) →
observation → think (update state) → tool call
(act) → ... → answer

the model thinks, performs a tool call (like
a python script), observes the result, updates its
internal state and thinks again. it can maintain
this "thought trace" across 200-300 sequential steps [1].
it allows for self-correction. if a tool fails,
it doesn't hallucinate a success; it reads the
error log, rewrites the code and tries again.

heavy mode and system 2 thinking

for hard problems, kimi k2 engages "heavy mode,"
which spawns eight parallel reasoning trajectories [3]. it
is a tree of thoughts search implemented at
inference time. a meta-reasoning layer then acts as
a judge, synthesizing the best outcome. this is
the difference between intuitive guessing (system 1) and
deliberate calculation (system 2).

===== END PHYSICAL PAGE 116 =====
===== PHYSICAL PAGE 117 =====

[ ] copied

[N12 continued]

3. the benchmarks on humanity's last exam

the proof is in the performance. we are
looking at humanity's last exam (hle), a benchmark
designed to be un-gameable.

model · setting · score
kimi k2 thinking · heavy mode · 51.0% [4]
kimi k2 thinking · standard · 44.9% [6]
gpt-5 (est) · standard · 41.7% [6]
claude sonnet 4.5 · standard · 32.0% [6]

this is not a statistical error. a 9-point
lead over the us flagship in complex reasoning
is a generation gap.

furthermore, look at the agentic benchmarks. on browsecomp
(web navigation), kimi k2 scored 60.2%, destroying claude's
24.1% [7]. this means kimi is a functional
employee, while claude is just a smart encyclopedia.

===== END PHYSICAL PAGE 117 =====
===== PHYSICAL PAGE 118 =====

[ ] copied

[N12 continued]

4. the economic reality check

here is the statistic that should terrify silicon
valley.

- gpt-5 estimated training cost: 500 million to 2.5
  billion usd [8]
- kimi k2 training cost: 4.6 million usd [1]

moonshot ai achieved state-of-the-art performance for roughly 1%
of the cost of a us frontier model.
this destroys the "capital moat." if a frontier
model costs 4.6 million usd, it is no
longer the domain of hyperscalers (google, microsoft). it
is within the budget of a series a
startup, a university or a mid-sized nation-state.

we are seeing a massive deflationary pressure. kimi
k2 is open-weight (modified mit license) [9]. why
would a european enterprise pay openai 30 usd
per million tokens when they can run a
smarter model locally for the cost of electricity?

===== END PHYSICAL PAGE 118 =====
===== PHYSICAL PAGE 119 =====

[ ] copied

[N12 continued]

5. the geopolitical inversion

this release marks the failure of the hardware
containment strategy. the us assumed that by controlling
the "thermodynamics" of compute (limiting watts and flops
via hardware bans), they could control the output
of intelligence.

they were wrong.

sanctions forced chinese labs to become efficient. while
us labs got lazy with massive compute resources,
chinese labs optimised every bit. now that they
have the superior architecture, any hardware they do
acquire yields exponential returns.

we are already seeing a user adoption shift.
procurement data shows that 78% of organisations prioritizing
data sovereignty are now selecting kimi k2 architectures
over gpt-5 [10]. the global south and non-us
western allies are looking for options that don't
pipe their data directly into us-controlled servers. china
is positioning itself as the "benevolent provider" of
open-source intelligence, a massive soft-power play.

===== END PHYSICAL PAGE 119 =====
===== PHYSICAL PAGE 120 =====

[ ] copied

[N12 continued]


6. my take

the future isn't going to be a single
monopoly model running in a us data centre.
it is going to be hybrid, interleaved and
ruthlessly efficient. kimi k2 proves that ingenuity is
a better predictor of performance than capital expenditure.

if you are building in this space, stop
assuming that "bigger is better." the game has
changed to "smarter is cheaper."

references

[1] moonshot ai technical report, "efficiency laws and
the muon optimiser," 2025.
[2] kimi k2 architecture whitepaper, section 3.1: sparse
routing.
[3] kimi k2 architecture whitepaper, section 4: native
int4 qat.
[4] hardware inference analysis, semiconductor watch, november 2025.
[5] react paradigm and interleaved reasoning studies, 2025.
[6] strategic technology intelligence briefing, "comparative analysis of

===== END PHYSICAL PAGE 120 =====
===== PHYSICAL PAGE 121 =====

[ ] copied

[N12 continued]

frontier models," december 2025.
[7] browsecomp benchmark leaderboard, q4 2025.
[8] industry estimates based on h100 cluster sizing
and energy consumption.
[9] moonshot ai, "kimi k2 thinking release notes,"
november 6, 2025.
[10] global tech procurement report, december 2025.

===== END PHYSICAL PAGE 121 =====
