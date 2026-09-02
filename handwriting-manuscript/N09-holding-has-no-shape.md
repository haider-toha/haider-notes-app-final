# N09 — holding has no shape

folder: blog
date: 28 january 2026
slug: holding-has-no-shape

===== PHYSICAL PAGE 079 =====

[ ] copied

[N09]

holding has no shape

i spent last tuesday doing nothing and came
home knackered.

well, not quite nothing. i had six agents
going at once, with one claude rewriting a
migration while codex chased a flaky test through
the integration suite, a couple more churning away
in tabs i'd half forgotten about and one
more running on my phone while i made
a cuppa. i barely wrote any code myself
that day. mostly i approved things and sent
things back, read a great many diffs and
said yes or no or told one of
them to try again but leave the auth
layer alone this time. by six in the
evening i was completely fried, though not in
the clean way that a long day on
a hard problem leaves you. this was something
worse and a good deal harder to explain.

that was the part that bugged me, because
the tiredness didn't match the day at all.
when i spend eight hours deep in one
nasty bug i come out empty but fine,

===== END PHYSICAL PAGE 079 =====
===== PHYSICAL PAGE 080 =====

[ ] copied

[N09 continued]

scrubbed clean in a way i actually like.
this felt like the opposite, a scattered sort
of buzzing that was still going at midnight,
as though i'd spent nine hours holding a
stack of things just off the ground and
nobody had ever let me put them down.

nobody really warns you about this part of
it. going from writing code to running agents
looks like a promotion, but it isn't one,
it's simply a different job. the work i
do now has almost nothing in common with
what i was doing two years ago and
it taxes an entirely different part of the
brain.

there's a paper from 1983 by lisanne bainbridge
called "ironies of automation" she was writing about
power plants and control rooms, nothing remotely to
do with any of this and yet she
caught something that maps almost too neatly onto
it. when you automate the easy parts of
a job, what's left for the person is
the hard part, the part that only ever

===== END PHYSICAL PAGE 080 =====
===== PHYSICAL PAGE 081 =====

[ ] copied

[N09 continued]

turns up when something has already gone wrong.
you strip out everything routine and leave behind
the stuff that demands judgement at exactly the
moment there's no time for it. her point
was that better automation makes the human's job
worse rather than better, because the person ends
up on permanent standby for the cases the
machine can't handle and standby turns out to
be far more draining than the work itself.
i could never quite explain why that was
until i read her.

that is more or less the day i
had on tuesday. i sat there watching mostly
competent systems do mostly correct things, waiting to
catch the one that wasn't. and they do
break, just rarely enough that you can never
fully step away and often enough that you
can never fully stop watching. at one point
an agent decided the cleanest fix was to
change a function signature that around forty other
things depended on and it proposed this to
me as though it were the obvious move,
completely sure of itself and completely wrong. catching

===== END PHYSICAL PAGE 081 =====
===== PHYSICAL PAGE 082 =====

[ ] copied

[N09 continued]

that took more out of me than writing
the original function ever would have.

i don't want this to tip over into
a rant, because i genuinely don't want them
gone. they really have made me faster at
things i used to be slow at. what
i'm trying to point at is the price
of that speed, which has a habit of
showing up somewhere none of the dashboards are
ever looking.

the mechanism is fairly dumb once you lay
it out. every new agent feels free, because
you're already paying for it and it's sitting
there idle, so you hand it the annoying
little task you've been avoiding and then the
one after that. each decision to spin up
one more is sensible on its own and
costs you next to nothing. the trouble is
that they don't come back one at a
time and in order, they all surface at
once needing a decision from you and the
cost was never in starting them so much

===== END PHYSICAL PAGE 082 =====
===== PHYSICAL PAGE 083 =====

[ ] copied

[N09 continued]

as in holding them all in your head
at the same time. you become the working
memory for six parallel threads and human working
memory was barely built for two.

that is the part i keep returning to,
the reason it drains you rather than simply
tiring you out. effort at least has a
shape to it, in that you push against
a problem and it pushes back and eventually
one of you gives way. holding has no
shape at all, only a steady low load
that never resolves and your attention gets stretched
so thin across the threads that switching between
them starts to leave a residue. you come
back to the migration agent and find that
the constraint you set ten minutes ago has
vanished, because in those ten minutes you were
off being three other places at once.

the bottleneck used to be how fast i
could write code. for a while after that
it was how fast i could steer the
things writing the code. now it is something

===== END PHYSICAL PAGE 083 =====
===== PHYSICAL PAGE 084 =====

[ ] copied

[N09 continued]

smaller and more uncomfortable than either, namely how
many of them i can hold in my
head at once before one of them slips.
the limit has moved off the machine and
onto me and there is no subscription tier
that fixes that particular one.

so what do you actually do, on a
tuesday like that, when this is simply the
job now and the work still has to
ship regardless. i don't have a tidy answer,
but i do have a few things that
have helped and the honest version is that
all of them are about admitting the limit
rather than trying to beat it.

the first is just a number. i now
cap it at two or three agents rather
than six, because the moment i'm past three
i can feel the quality of my attention
fall away and a fourth agent producing work
i'm too fried to review properly. past a
certain point more parallelism stops buying speed and
starts buying mistakes that i'll only find later,

===== END PHYSICAL PAGE 084 =====
===== PHYSICAL PAGE 085 =====

[ ] copied

[N09 continued]

at a worse time. how many you can
actually run turns out to be a fact
about your attention rather than your wallet and
pretending otherwise is how you burn yourself out
without noticing.

the second is that i stopped watching them
work, which sounds like a trivial change and
really wasn't. there is a strong pull to
monitor every output as it streams in, to
sit there nodding along and that constant real
time vigilance is the single most depleting part
of the whole business. so instead i batch
it now, letting three agents run while i
go and do something else entirely, then coming
back to review the lot in one focused
pass. you trade the illusion of control for
some recovery and the work is honestly no
worse for it.

the third one i'm more sure of than
the other two. every single day i protect
a block of time where nothing at all
is running, no agents or review queues, instead

===== END PHYSICAL PAGE 085 =====
===== PHYSICAL PAGE 086 =====

[ ] copied

[N09 continued]

me and one problem and the slow good
work of thinking it through by hand. part
of that is for my own sanity, but
it's also because the thing that lets me
smell a bad function signature change coming, which
is the ability to hold a whole problem
in your head at once, is a muscle
and supervising agents all day trains an entirely
different one. if i let that deeper muscle
go soft, i lose the exact judgement that
makes me worth keeping in the loop in
the first place. you can't stay sharp as
a reviewer once you've stopped being a builder
and i've become fairly convinced the two either
feed each other or starve together.

there is, of course, a version of the
future in which the agents simply get good
enough that they stop needing me to catch
their mistakes at all and plenty of clever
people are betting on exactly that. they may
well be right. but bainbridge's irony has held
up for forty years across every kind of
automation we've tried and the pattern she described

===== END PHYSICAL PAGE 086 =====
===== PHYSICAL PAGE 087 =====

[ ] copied

[N09 continued]

was never really about the machines getting better,
it was about what happens to the human
when they do. so far, every round of
automating the easy work has only made the
residue that lands on the person harder and
lonelier and more exhausting and getting better at
automation has sharpened that rather than softened it.
i've yet to see it run the other
way.

i'm not arguing for fewer agents in any
permanent sense and i'm certainly not giving back
the speed. i've simply stopped treating my own
attention as the free variable in the equation,
the thing you can draw down endlessly while
everything else scales up around it. it is
the scarcest resource in the whole setup and
it's where the real bottleneck has been hiding
the entire time.

most days i still feel like the bottleneck
and lately i've started to think that's the
system working as intended rather than failing. the
machines are built to run wide and i

===== END PHYSICAL PAGE 087 =====
===== PHYSICAL PAGE 088 =====

[ ] copied

[N09 continued]

am built to go deep and the whole
arrangement only holds together because there is still
one person in the middle who can actually
think.

===== END PHYSICAL PAGE 088 =====
