# N16 — gold medal, one blind spot

folder: blog
date: 3 august 2025
slug: cognitive-threshold-imo-2025

===== PHYSICAL PAGE 150 =====

[ ] copied

[N16]

gold medal, one blind spot

if you have been following the breathless hype
cycles of ai, you are likely exhausted. i
know i am. but what happened in australia
this year is different. openai and google deepmind
achieved scores equivalent to a imo gold medal,
solving problems that stump the smartest 18-year-olds on
the planet [1].

but here is the catch and it is
the subject of today's deep dive. they completely
face-planted on problem 6.

this dichotomy (perfection on five problems and a
"hard zero" on the sixth) is the most
important signal we have regarding the current state
of artificial intelligence. it reveals exactly where the
"cognitive threshold" lies. in this post, i am
going to tear down the architecture that got
us here, rigorously derive the math behind the
problem that stumped the machine and map this
all back to what it means for us
in software engineering.

===== END PHYSICAL PAGE 150 =====
===== PHYSICAL PAGE 151 =====

[ ] copied

[N16 continued]

1. the new benchmark and why this matters

let us look at the facts. the imo
is the hardest pre-university math competition in the
world. it consists of six problems over two
days. each is worth 7 points. a gold
medal usually requires a score around 35 out
of 42.

historically, ai struggles here. standard llms are probabilistic
engines. they are "system 1" thinkers. they guess
the next word. math requires rigorous, "system 2"
logic where one false step collapses the entire
proof.

in 2025, both google deepmind (gemini deep think)
and openai (o1 series) hit that magic number:
35 points [1].

they solved algebra, geometry and number theory with
a proficiency that would make a tenured professor
sweat. but they failed problem 6. this was
not a glitch. it was a fundamental limitation
of how current transformers process global constraints.

===== END PHYSICAL PAGE 151 =====
===== PHYSICAL PAGE 152 =====

[ ] copied

[N16 continued]


2. the architecture of reasoning and the math
of "thinking"

to understand why they won gold, you have
to understand that these are not the same
models you use in chatgpt or claude 3.5
sonnet.

the standard models we use for coding (gpt-4o,
etc.) operate on training-time compute. they are smart
because they read a lot of books during
training. when you ask them a question, they
answer instantly. they do not "think."

mathematically, a standard llm computes the probability of
the next token $t_i$ given the context $C$
and previous tokens $t_1, ..., t_{i-1}$:

P(t_i | C, t_1, ..., t_{i-1})

this is a single forward pass. it is
greedy. if $t_j$ is a mistake, the model
is doomed because $t_{j+1}$ depends on $t_j$.

===== END PHYSICAL PAGE 152 =====
===== PHYSICAL PAGE 153 =====

[ ] copied

[N16 continued]


the gold medalists use inference-time compute [2]. this
introduces a latent variable $\theta$, representing the "reasoning
chain" or "hidden thoughts." the model does not
just maximise the probability of the answer $A$.
it marginalises over the space of possible reasoning
paths:

P(A | Q) = \sum_{\theta \in \Theta} P(A | \theta, Q) \cdot P(\theta | Q)

here, $\Theta$ is the set of all possible
"thoughts" (steps of proof, backtrackings, corrections). the model
spends computational resources (inference time) exploring high-probability paths
in $\Theta$ before committing to an output $A$.
this is the shift from probabilistic pattern matching
to search-based reasoning. it is the difference between
a parrot repeating a phrase and a human
sitting down with a scratchpad.

the "monitorability tax" and alignment

this shift introduces a fascinating nuance i call
the "monitorability tax" [3]. as these models get
smarter, their internal chain of thought $\theta$ becomes

===== END PHYSICAL PAGE 153 =====
===== PHYSICAL PAGE 154 =====

[ ] copied

[N16 continued]

increasingly alien and illegible to humans. to keep
them safe, developers force the model to output
legible english thoughts. this actually slows them down.
we are taxing their intelligence to keep them
aligned with human readability. in the imo context,
this was crucial because the proofs had to
be graded by humans. if the model had
used an internal "alien math" shorthand, it would
have received a zero, regardless of the correct
answer.

3. the "warehouse" problem and a rigorous mathematical
breakdown

now, let us get into the weeds. why
did they fail problem 6? the problem was
a combinatorial tiling task. to make this concrete,
let us use the "warehouse optimisation" analogy.

3.1 the scenario

imagine you are the cto of a logistics
firm. you have a massive automated warehouse floor
that is a perfect square grid of size

===== END PHYSICAL PAGE 154 =====
===== PHYSICAL PAGE 155 =====

[ ] copied

[N16 continued]

$n \times n$ where $n = 2025$.

- the goal: you need to pave this floor
  with rectangular product pallets (tiles). you want to
  use the minimum number of tiles possible (larger
  tiles = better efficiency).
- the constraint (osha): you must install fire alarms
  (uncovered unit squares).
1. every row must have exactly one fire alarm.
2. every column must have exactly one fire alarm.
3. no tile can cover an alarm.

your job is to place the $n$ alarms
in a permutation $\pi$ that allows you to
use the fewest number of tiles to cover
the rest of the floor.

3.2 the trap of the diagonal permutation

the ai models, acting as greedy optimisers, likely
defaulted to the identity permutation (the main diagonal).
let us define the set of alarms $S$
as:

===== END PHYSICAL PAGE 155 =====
===== PHYSICAL PAGE 156 =====

[ ] copied

[N16 continued]

S = \{(i, \pi(i)) : i \in \{1, ..., n\}\}

why is this bad?

let $T(S)$ be the number of rectangular tiles
needed for a set of alarms $S$.

if alarms are on the diagonal, every tile
is bounded by the "punctures" on the diagonal.
a tile starting at row $r_1$ and ending
at row $r_2$ cannot cross the diagonal because
the alarm at $(k, k)$ where $r_1 \le
k \le r_2$ would block it.

effectively, the grid splits into two triangular regions
(upper and lower).

in the worst case (the diagonal), the number
of tiles $T_{diag}$ approaches $O(n)$. specifically:

T_{diag}(n) \approx 2(n-1)

for $n = 2025$, this results in $\approx
4048$ tiles. the ai found this solution and

===== END PHYSICAL PAGE 156 =====
===== PHYSICAL PAGE 157 =====

[ ] copied

[N16 continued]

stopped, thinking it was optimal. it satisfied all
constraints, but it was terribly inefficient.

3.3 the optimal solution via the dilworth bound

the correct answer requires a construction rooted in
dilworth's theorem and partial order theory. the minimum
number of tiles $T_{min}$ is actually given by:

T_{min}(n) = 2(\lceil \sqrt{n} \rceil - 1)

for our warehouse where $n = 2025$:

T_{min}(2025) = 2(\lceil \sqrt{2025} \rceil - 1) = 2(45 - 1) = 88

the proof sketch:

we can define a partial order on the
cells of the grid. let two cells $(r_1,
c_1)$ and $(r_2, c_2)$ be comparable if $r_1
< r_2$ and $c_1 < c_2$.

the number of tiles required is linked to
the structure of "chains" (increasing sequences) and "antichains"

===== END PHYSICAL PAGE 157 =====
===== PHYSICAL PAGE 158 =====

[ ] copied

[N16 continued]

(decreasing sequences) in the permutation of alarms.

if we let $k$ be the length of
the longest chain of alarms and $l$ be
the length of the longest antichain, a known
result in this domain (the greene's theorem extension
for grid tilings) suggests the cost is roughly
proportional to $k + l$.

to minimise the sum $k + l$ subject
to $k \cdot l \ge n$ (by erdős-szekeres),
we need $k \approx l \approx \sqrt{n}$.

the "hiura" construction:

we partition the $n \times n$ grid into
$m \times m$ blocks, where $m = \lceil
\sqrt{n} \rceil$. we place the alarms such that
they form a specific "snaking" pattern through these
blocks.

specifically, we choose $m = 45$.

the alarms are placed to ensure that we

===== END PHYSICAL PAGE 158 =====
===== PHYSICAL PAGE 159 =====

[ ] copied

[N16 continued]

can form massive rectangles that span $\sqrt{n}$ rows
and $\sqrt{n}$ columns simultaneously.

by balancing the "increasing" and "decreasing" runs of
the alarms to be length $\sqrt{n}$, we minimise
the fragmentation.

3.4 why the ai failed and the missing
global vision

the ai failed because it lacks global constructive
vision. chain-of-thought is sequential. it is great at
local deductions:

"if A then B. if B then C.
therefore, C."

it is terrible at global optimisation problems that
require "seeing" the topology:

"the grid, as a whole, can be partitioned
into sqrt(n)-sized blocks."

the model could not visualise that breaking the

===== END PHYSICAL PAGE 159 =====
===== PHYSICAL PAGE 160 =====

[ ] copied

[N16 continued]

symmetry of the diagonal would yield a $O(n)$
to $O(\sqrt{n})$ improvement. it got stuck in a
local optimum because the gradient of "reasoning" points
towards simpler, more symmetric structures like the diagonal
[4]. it could not make the "intuitive leap"
that a square root function was relevant to
a tiling problem.

4. the critical nuances around fairness and tools

there are two major nuances that critics often
miss when analysing this result.

1. the "code-augmented" hypothesis:

the ai models were restricted from using tools.
they had no python interpreter. this is a
massive handicap. if the models had been allowed
to write code, they likely would have solved
problem 6.

why? because they would not have tried to
"reason" the proof from scratch. they would have
written a script to simulate the tiling for

===== END PHYSICAL PAGE 160 =====
===== PHYSICAL PAGE 161 =====

[ ] copied

[N16 continued]

$n = 1, 2, 3, ..., 100$.

they would have generated the data: $T(n) =
0, 0, 2, 2, 4, 4, ...$

they would have fit the curve $T(n) =
2(\lceil \sqrt{n} \rceil - 1)$.

once they had the formula empirically, the "reasoning"
engine would have worked backward to construct the
proof. the failure was not in proving, but
in conjecturing.

2. the contamination debate:

skeptics argue the models just memorised the training
data. this is why problem 6 is so
important. it was a novel construction. the fact
that the models failed p6 while acing p1-p5
is actually evidence against memorisation. if they were
just reciting similar problems seen in training, they
likely would have hallucinated a solution to p6
based on a similar-looking past problem. the "hard
zero" proves they were genuinely trying to reason

===== END PHYSICAL PAGE 161 =====
===== PHYSICAL PAGE 162 =====

[ ] copied

[N16 continued]

and genuinely hit a wall.

5. the gap and why you are using
the wrong tools

if you are a developer building software on
top of gpt-4o or claude 3.5, you need
to look at this data.

difficulty tier · description · gpt-4o / claude 3.5 · o1 / deep think
tier 1 · grade school math · 90%+ · 100%
tier 3 · national olympiad · <20% · 50%
tier 5 · imo hard (problem 6) · 0% · 0%

the commercial models we use daily failed to
even get a bronze. they scored under 13
points [1].

this gap is massive. we are building enterprise
software on "system 1" models that cannot handle
complex logic without massive hand-holding. the "reasoning" models
are a totally different beast.

===== END PHYSICAL PAGE 162 =====
===== PHYSICAL PAGE 163 =====

[ ] copied

[N16 continued]

6. implications for software engineering

so, what does a math competition tell us
about building apps? everything.

6.1 the "rule engine" is essential

the ai failed problem 6 because it could
not optimise globally. in a real business, that
failure means violating a safety regulation or crashing
a database.

takeaway: we cannot trust ai with "black box"
optimisation yet. we need neuro-symbolic systems. let the
ai propose a warehouse layout, but run it
through a deterministic code-based verifier (a rule engine)
before you accept it.

if verify(ai_output) returns false, loop back.

===== END PHYSICAL PAGE 163 =====
===== PHYSICAL PAGE 164 =====

[ ] copied

[N16 continued]

6.2 agentic workflows need context

the ai failed because it treated the grid
as a sequence of rows, not a holistic
map. if you are building ai agents, you
cannot just feed them a jira ticket. you
must provide the global context, the full architecture,
the database schema, the "grid." an agent without
context is just a diagonal line placer in
a world that needs a hiura construction [5].

6.3 the cost of thinking

inference is no longer a flat rate. a
"hard" query might take 10 minutes of gpu
time and cost 5 usd. we need to
redesign our apis to handle asynchronous, long-running "thought
processes." the days of expecting a 200ms json
response for complex logic are over [6].

===== END PHYSICAL PAGE 164 =====
===== PHYSICAL PAGE 165 =====

[ ] copied

[N16 continued]

final thoughts

the 2025 imo proved that ai can reason.
it can deduce. it can prove. but it
still struggles to create novel structures from scratch.

for us, the strategy is clear. use these
new "reasoning models" to solve the hard, local
logic puzzles. but do not expect them to
be the architect of your system. they are
the best bricklayers in history, but for now,
you still need a human to draw the
blueprints.

references

[1] imo 2025 official results & ai analysis.
[2] "chain of thought reasoning in large language
models", google deepmind research.
[3] "the monitorability tax: alignment in reasoning models",
openai safety team.
[4] "global vs. local reasoning in transformers", anthropic
research.
[5] "agentic patterns for enterprise", o'reilly media.

===== END PHYSICAL PAGE 165 =====
===== PHYSICAL PAGE 166 =====

[ ] copied

[N16 continued]

[6] "economics of inference-time compute", semianalysis.

===== END PHYSICAL PAGE 166 =====
