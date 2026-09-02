# N10 — the $10b shortcut

folder: blog
date: 9 january 2026
slug: minimax-m2-paradigm

===== PHYSICAL PAGE 089 =====

[ ] copied

[N10]

the $10b shortcut

we are currently witnessing a structural bifurcation in
the global ai landscape. on one side, you
have the closed-source giants (openai, anthropic, google) scaling
dense models behind opaque apis. on the other,
the open-source ecosystem has been playing catch-up, mostly
through brute-force scaling or finetuning llama derivatives.

but every so often, a model drops that
doesn't iterate but rather it disrupts.

the release of minimax m2 is one of
those moments. it poses a very uncomfortable question
for the proprietary labs, asking how a model
that ranks in the top five of the
artificial analysis benchmark, territory usually reserved for gpt-4
and claude opus, can exist with open weights?
[1]

i have been testing m2 extensively. it is
currently the third most-used model on openrouter and
let me be clear, this isn't hype. it
is a pragmatic recognition that we have finally
hit the "intelligence-cost quadrant" sweet spot. we have
been looking for pareto optimality where high reasoning

===== END PHYSICAL PAGE 089 =====
===== PHYSICAL PAGE 090 =====

[ ] copied

[N10 continued]

capabilities intersect with dirt-cheap inference. m2 occupies this
space decisively.

here is my deep dive into why this
230-billion parameter monster (that only thinks it is
a 10-billion parameter model) is the future of
agentic intelligence.

1. the "mini/max" paradox

the nomenclature "minimax" is the governing engineering principle
behind m2.

- "mini" refers to the active computational footprint.
- "max" refers to the knowledge capacity.

the architecture relies on a massive mixture-of-experts (moe)
design. the total parameter count is a staggering
230 billion. in a traditional dense model (like
llama 3 70b), every single one of those
parameters would fire for every token generated. that
is computationally expensive and slow.

m2, however, uses an aggressive sparsity ratio of

===== END PHYSICAL PAGE 090 =====
===== PHYSICAL PAGE 091 =====

[ ] copied

[N10 continued]

approximately 23:1. it only activates 10 billion parameters
per token generation step [3].

the math of efficiency

to visualise why this matters, consider the cost
of inference ($C$). in a dense model, cost
scales with total parameters ($P_{total}$). in m2, it
scales with active parameters ($P_{active}$).

C_{M2} \propto P_{active} \approx \frac{P_{total}}{23}

this simple equation is why m2 changes the
economics of ai. it holds the encyclopedic breadth
of a 200b+ model (the "max") but runs
with the latency and cost profile of a
small 10b model (the "mini").

for autonomous agents, this is critical. agents require
loops. they plan, they act, they observe, they
refine. this cycle can consume thousands of tokens
per task. if your underlying model is claude
3 opus, you go broke. if it is
llama 3 8b, the agent is too stupid

===== END PHYSICAL PAGE 091 =====
===== PHYSICAL PAGE 092 =====

[ ] copied

[N10 continued]

to finish the task. m2 hits the sweet
spot because it is smart enough to handle
long-horizon tasks but roughly 92% cheaper than comparable
proprietary models [7].

2. the great attention pivot and why m2
dropped "lightning"

here is a nuanced detail that many people
miss. the predecessor, minimax m1, was famous for
using "lightning attention", a linear attention mechanism that
allowed for massive 1m+ token contexts.

m2 dropped it.

m2 reverted to standard full attention (softmax). why?
because in the real world of coding and
"needle-in-a-haystack" retrieval, precision beats theoretical efficiency.

linear attention approximates the interaction between tokens to
achieve $O(n)$ complexity. full attention has quadratic complexity
$O(n^2)$, meaning it's computationally heavier.

\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V

===== END PHYSICAL PAGE 092 =====
===== PHYSICAL PAGE 093 =====

[ ] copied

[N10 continued]


see that $QK^T$ term? that's the model comparing
every token to every other token. minimax engineers
realised that for an agent to correctly identify
a single bug in 50 files of code,
you cannot afford the "lossy" compression of linear
attention [4]. you need the brutal exactness of
the $n \times n$ matrix. this decision to
prioritise accuracy over raw speed is why m2
feels so much sharper at coding tasks than
m1 did.

3. the death of chain-of-thought and the rise
of "interleaved reasoning"

we need to talk about how this thing
thinks. since mid-2024, the industry has been obsessed
with chain-of-thought (cot), the idea that the model
should vomit out a "reasoning preamble" before giving
you an answer.

the problem with standard cot is that, it
is linear.

===== END PHYSICAL PAGE 093 =====
===== PHYSICAL PAGE 094 =====

[ ] copied

[N10 continued]

input → giant block of thinking → final
output.

this is fine for solving a math riddle,
but it is terrible for agents. agents need
to interact with the world.

minimax m2 introduces interleaved reasoning. it doesn't separate
thinking and doing; it blends them into a
continuous loop, effectively modeling the task as a
markov decision process (mdp):

input → think → tool call (act) →
observation → think → tool call (act) →
answer.

this is a subtle but profound shift. in
this paradigm, "thinking" isn't a preamble; it is
a pervasive thread. if the agent tries to
scrape a website and gets a 403 forbidden
error, it doesn't fail. it sees the observation,
"thinks" about it ("i need to try a
different endpoint") and acts again.

===== END PHYSICAL PAGE 094 =====
===== PHYSICAL PAGE 095 =====

[ ] copied

[N10 continued]

in my testing, this state preservation is the
killer feature. the reasoning traces are kept as
part of the conversation history object. at step
50 of a complex task, m2 can look
back at step 10 and see why it
made a decision, not just what it did
[1].

4. the stability algorithm behind cispo

why is m2 so stable during these long
loops? it comes down to how it was
trained.

training reasoning models with reinforcement learning (rl) is
notoriously unstable. as models generate longer sequences of
thought, the variance in gradients explodes. the standard
fix is to use algorithms like ppo, which
use "clipping" to stop the model from changing
too much, too fast.

the problem? ppo clips the update. this often
suppresses those "aha!" moments where the model makes
a massive leap in logic because the algorithm

===== END PHYSICAL PAGE 095 =====
===== PHYSICAL PAGE 096 =====

[ ] copied

[N10 continued]

interprets that leap as instability [8].

minimax uses a novel algorithm called cispo (clipped
importance sampling policy optimisation).

L_{CISPO}(\theta) = \mathbb{E}\left[\min\left(r_t(\theta)A_t, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)A_t\right)\right]

without getting bogged down in the full derivation,
the "magic" is that cispo clips the weight
but detaches it from the gradient. it tells
the model: "this was a huge, high-variance move.
i will let you learn from it, but
i won't let you blow up the training
run over it."

meta ai recently released a paper on scaling
rl compute and explicitly identified cispo as the
"most stable way to scale reinforcement learning steps"
[5]. when meta validates your math, you know
you are on to something.

===== END PHYSICAL PAGE 096 =====
===== PHYSICAL PAGE 097 =====

[ ] copied

[N10 continued]

5. benchmarks and the "tau squared" coding dominance

the report request mentioned the "tau squared" benchmark.
this refers to tau-bench ($\tau^2$), the current gold
standard for agentic reliability.

- tau-bench: m2 scores 87% in the telecom domain.
  this measures reliability in multi-turn tool use. most
  models lose track of the user's constraints after
  turn 3. m2 holds the state.
- swe-bench verified: this is the big one for
  autonomous coding. m2 scores 69.4%. for context, claude
  3.5 sonnet is around 77% and gpt-4o is
  around 75%. m2 is within striking distance of
  the absolute state-of-the-art, while being open-weights and significantly
  cheaper to run [6].
- browsecomp: in web navigation agents, m2 scored 44.0%,
  which ironically nearly triples the score of claude
  3.5 sonnet (19.6%) on that specific evaluation.

===== END PHYSICAL PAGE 097 =====
===== PHYSICAL PAGE 098 =====

[ ] copied

[N10 continued]

to wrap up

by decoupling total knowledge from active compute (230b/10b),
minimax has solved the economic blocker for autonomous
agents. by implementing interleaved reasoning, they have solved
the cognitive blocker. and by using cispo, they
have turned the "black magic" of rl training
into a rigorous science.

for developers, the choice is becoming clearer. you
can pay the "proprietary tax" for the absolute
peak of intelligence or you can use m2
to get 95% of the performance at a
fraction of the cost, with full control over
your infrastructure.

in the intelligence vs. price quadrant, m2 stands
alone. it is the best bang for the
buck we have ever seen.

references

[1] minimax technical report, "the m2 architecture and
performance," 2024.

===== END PHYSICAL PAGE 098 =====
===== PHYSICAL PAGE 099 =====

[ ] copied

[N10 continued]

[2] artificial analysis, "ai model leaderboard q4 2024."
[3] openrouter documentation, "minimax m2 model card and
pricing," 2024.
[4] "why m2 returned to full attention," minimax
engineering blog, 2024.
[5] meta ai research, "the art of scaling
rl compute," arxiv, 2024.
[6] swe-bench leaderboard, "verified split results," 2024.
[7] user comparisons on "the intelligence-price quadrant," reddit/localllama,
2024.
[8] "stabilizing rlhf with cispo," minimax research, 2024.

===== END PHYSICAL PAGE 099 =====
