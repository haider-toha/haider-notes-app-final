# N02 — current focus

folder: profile
date: 29 may 2026
slug: now

===== PHYSICAL PAGE 004 =====

[ ] copied

[N02]

current focus

queueing theory
there's real math under backend performance, things like
little's law, m/m/c models and the way rising
utilisation feeds tail latency. most engineers still size
their connection pools and set timeouts by feel
even though the right numbers are completely computable.
once you actually compute them it becomes clear
that wait time climbs fast as soon as
a pool pushes past ~70% utilisation, which is
where a lot of the "random" incidents you
run into really come from. it's an old
field that has barely been touched in web
infra.

deterministic simulation testing
this is the approach foundationdb pioneered and that
antithesis, warpstream and tigerbeetle have been productionising, where
you write your code against an abstract clock
and network and then run it inside a
simulator that owns time, packet order, disk faults
and process restarts. because everything runs off a
single seed, one run replays the same billion
years of synthetic chaos deterministically, so the consistency
bugs that would normally take months to surface

===== END PHYSICAL PAGE 004 =====
===== PHYSICAL PAGE 005 =====

[ ] copied

[N02 continued]

in production tend to fall out within minutes.
still working out how much of this you
can retrofit onto an existing codebase and how
much of it has to be there from
the start.

durable execution
the temporal, restate, dbos paradigm lets you write
business logic as plain code while the runtime
gives you crash-safe, resumable workflows underneath, with the
event sourcing handled for you and kept invisible
at the point where you actually call it.
it's a good fit for anything stateful that
reaches across external apis like payments, onboarding or
integrations, where a failure halfway through is expensive
and retrying is ambiguous because you can't always
tell what already ran. the usual worry of
what happens if the server dies mid-function stops
being something you have to design around, since
the runtime tracks progress and resumes from wherever
it left off. it reads like boring infrastructure
and in practice it ends up mattering far
more than it looks.

===== END PHYSICAL PAGE 005 =====
===== PHYSICAL PAGE 006 =====

[ ] copied

[N02 continued]

multi-armed bandits
bandits are about moving past fixed-split a/b testing
into adaptive allocation, where instead of cutting traffic
50/50 and waiting the way a classic experiment
does, algorithms like thompson sampling and ucb keep
shifting exposure toward the better variants as results
come in and balance exploration against exploitation the
whole time. that makes them genuinely useful when
your sample sizes are small or your feedback
loops are fast. what interests me is the
engineering as much as the statistics, in particular
how you run bandits across a whole product
surface while attributing outcomes honestly and not overfitting
to noise.

===== END PHYSICAL PAGE 006 =====
