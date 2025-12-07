import { Note } from './types';

export const portfolioNotes: Note[] = [
  {
    id: "profile-about-me",
    slug: "about-me",
    title: "about me",
    category: "profile",
    public: true,
    session_id: "",
    created_at: "2025-01-25T09:00:00.000Z",
    content: `haider toha
london, uk

[github](https://github.com/haider-toha) • [email](mailto:mohammedhaidertoha@gmail.com) • [linkedin](https://linkedin.com/in/haidertoha)

i am a founding engineer at **sammy labs** (yc w25).

my background is in aeronautics (imperial college), which means i treat software reliability as a safety factor, not a nice-to-have. i have worked at massive scale (goldman sachs) and built profitable products from zero (provost academics).

currently, i spend my days embedded with unicorn customers, diagnosing deep technical bottlenecks and shipping infrastructure that solves them in hours, not weeks.

offline, i stay active with the gym, cricket and the occasional late-night walk through hyde park when i need to clear my head. i coach my local kids football team which has been one of the most grounding things i do each week. i have also started gliding and plan to get my pilot’s license.

i read voraciously. currently cycling through *the dream machine*, *poor charlie's almanack* and manuals on distributed consensus protocols.`
  },
  {
    id: "profile-now",
    slug: "now",
    title: "current focus",
    category: "profile",
    public: true,
    session_id: "",
    created_at: "2025-01-24T10:00:00.000Z",
    content: `**browser agent runtime**
i am reverse-engineering the way we interact with the web. most automation breaks because the dom is volatile. i am building a probabilistic planning layer that treats browser interaction as a graph traversal problem rather than a linear script. this involves building custom headless drivers that can 'see' and 'reason' about page mutations in real-time.

**edge ml & quantization**
hacking on running 7b parameter models on consumer hardware with <50ms latency. i am experimenting with llama.cpp bindings for rust to build a local-first rag pipeline that doesn't leak data to the cloud.

**system architecture**
tuning my 'second brain' in tana and rewriting my local automation scripts in go. i believe that if you perform a task three times, you should automate it. if you perform it ten times, you should engineer it.`
  },
  {
    id: "profile-toolbox",
    slug: "toolbox",
    title: "stack & gear",
    category: "profile",
    public: true,
    session_id: "",
    created_at: "2025-01-23T08:30:00.000Z",
    content: `**languages**
**typescript:** my default for product velocity.
**python:** for anything involving tensors or dataframes.
**go:** for high-concurrency backend services.
**rust:** currently implementing a toy vector database to understand memory safety.

**core stack**
**frontend:** next.js, react server components, tailwind css
**backend:** fastapi (python), chi (go), trpc
**data:** postgresql (w/ pgvector), redis, clickhouse
**infra:** docker, terraform, aws ecs/lambda, fly.io

**hardware**
**machine:** macbook pro 16" (m4 max, 48gb)
**input:** hhkb hybrid type-s (topre switches), mx master 3s
**audio:** sony wh-1000xm4 and airpods max (for deep work)`
  },
  {
    id: "profile-operating-manual",
    slug: "operating-manual",
    title: "operating principles",
    category: "profile",
    public: true,
    session_id: "",
    created_at: "2025-01-22T10:00:00.000Z",
    content: `**strong opinions, loosely held**
i will argue passionately for a technical decision based on the data i have. if you show me better data, i will change my mind instantly. ego has no place in a pull request.

**document the 'why'**
code tells you *what* is happening. comments tell you *why*. i write adr (architecture decision records) for major system choices so future-me doesn't have to guess why we chose an event bus over http.

**optimise for reversibility**
speed comes from confidence. i build systems where deployments are boring and rollbacks are instant. if a decision is a one-way door, we slow down. if it's a two-way door, we move immediately.

**radical candour**
if the ship is sinking, say so. i value direct, actionable feedback over polite obfuscation. a red build pipeline is a gift because it tells us the truth.`
  },
  {
    id: "experience-all",
    slug: "experience",
    title: "experience",
    category: "experience",
    public: true,
    session_id: "",
    created_at: "2025-01-20T09:00:00.000Z",
    content: `**founding software engineer : sammy labs (yc w25)**
london, uk · nov 2025–present

- collaborating closely with enterprise customers like deel to diagnose workflow bottlenecks, trace deep technical issues and ship targeted fixes with turnaround times measured in days.
- implemented an end-to-end slack & jira notification system triggered by sqs task-completion events.
- built idempotent consumers and retry-safe delivery paths, delivering sub-200ms notifications at scale.

**analyst : goldman sachs**
london, uk · jul 2025–nov 2025

- selected for the flagship cloud fast track project. worked on modernising critical banking infrastructure.
- architected legacy on-prem workflows onto aws, leveraging cloud-native patterns for higher availability and resilience.

**intern : goldman sachs**
birmingham, uk · summer 2024

- built an nlp search service that translates analysts’ natural-language queries into mongodb calls, returning answers in 4s vs 35s legacy workflow for 150+ global investment research users.
- containerised a java/python microservice using docker and ran it on aws ecs with semantic vector search, achieving 94% query-to-api accuracy. authored terraform iac for zero-click deploys.
- hosted an 8-bit-quantised llama-3-8b on sagemaker for keyword extraction, halving per-query compute cost (£0.12 to £0.06/1k calls) without loss of f1 score.

**founder & lead engineer : provost academics**
london, uk · may 2024–present

- bootstrapped an ai tutoring marketplace to 50+ paying clients and £5k mrr.
- built a rag grading engine (gpt-4, pgvector) that marks papers in under 60s with 95% human-examiner agreement.
- solved the 'latex hallucination' problem by writing a custom tokeniser that normalises mathematical notation before embedding.`
  },
  {
    id: "projects-all",
    slug: "projects",
    title: "projects",
    category: "projects",
    public: true,
    session_id: "",
    created_at: "2025-01-18T09:00:00.000Z",
    content: `**self-engineering agent framework**
an experiment in recursive capability. i built an agent loop that identifies missing tools in its registry, generates python code to fulfill that need, writes unit tests and executes them in an ephemeral docker container. if the tests pass, it commits the tool to its own vector memory.
*stack: python, docker sdk, openai api, pgvector*
[code](https://github.com/your-repo/Self-Engineering-Agent-Framework.git)

**parallel navier-stokes solver**
pure computational horsepower. a c++ solver for 2d fluid dynamics equations. i hand-optimised memory access patterns to minimise cache misses and implemented hybrid mpi (multi-node) and openmp (multi-thread) parallelism, achieving a 12x speedup on imperial's hpc cluster.
*stack: c++, mpi, openmp, hpc*

**fpl moneyball**
applying operations research to fantasy football. formulated the squad selection problem as an integer linear programming (ilp) model. uses pulp to solve for the maximum expected points subject to constraints (budget, team limits). it consistently beats the global average by ~20%.
*stack: python, pulp (optimisation), pandas, aws lambda*

**global sentiment engine**
a real-time nlp pipeline. scrapes headlines from 50+ international sources, pushes them to a redis queue and processes them with a fine-tuned bert model for sentiment analysis. the frontend uses three.js to render a 3d heatmap of global anxiety levels.
*stack: next.js, react-three-fiber, redis, hugging face transformers*

**recipe ancestry graph**
mapping the evolution of cuisine. uses spacy's named entity recognition (ner) to extract ingredients from unstructured text. builds a networkx directed graph to calculate the 'edit distance' between recipes, visualising how a french bechamel evolves into a greek moussaka.
*stack: python, networkx, d3.js, fast-api*`
  },
  {
    id: "writing-desire",
    slug: "two-faces-of-desire",
    title: "blogs: the two faces of desire",
    category: "writing",
    public: true,
    session_id: "",
    created_at: "2025-09-06T21:05:43.000Z",
    content: `**september 6, 2025 · 10 min read · 1,158 words**

so, is a state of low desire actually a problem? from within, if i am truly content, resting in a quiet ease within my own skin, who can claim that i suffer? why should my lack of wanting be treated as a deficiency if it comes with a profound sense of sufficiency? the trouble seems to arise only when i begin to compare myself to others or when i begin to want what i do not have. it is only at that threshold, when lack intrudes upon contentment, that restlessness and with it suffering, begins.

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

thus, the question of desire becomes not merely psychological but spiritual. the challenge is to discern which quiet we are living in; is it the quiet of fulfillment or the quiet of neglect.`
  },
  {
    id: "writing-curves",
    slug: "curves-of-the-mind",
    title: "blogs: curves of the world, curves of the mind",
    category: "writing",
    public: true,
    session_id: "",
    created_at: "2025-05-10T11:45:00.000Z",
    content: `**may 10, 2025 · 12 min read · 1,124 words**

mathematics is not a cold kingdom of eternal truths set apart from the world. it is a living river, flowing through cultures, carrying with it the sediments of survival and the light of transcendence. ubiratan d'ambrosio calls this current ethnomathematics, for mathematics is always shaped by the human hand, always marked by the earth from which it springs. the ethno gives us the soil and the sky, the mathema gives us that which is learned and the tics gives us the techniques by which we survive and dream. in this view, mathematics is not a ladder dropped from heaven but a rope we weave ourselves, strand by strand, to climb beyond our limits.

at its dawn, mathematics was a matter of necessity. the shepherd who placed a stone for every sheep was already discovering bijection, though he had no name for it. his practice embodies the truth that a function f: s → p may be injective and surjective, a pairing where nothing is lost and nothing is left unmatched. in time, the act of counting became number itself and from number, arithmetic was born. peano would later capture this in axioms such that zero is a number, each number has a successor and addition arises by recursion, m + 0 = m, m + s(n) = s(m + n). what began with sheep and stones has become a pure, infinite ladder, climbing ever upward, rung by rung.

cultures across the earth gave different voices to this truth. the babylonians wrote in base sixty, the mayans in base twenty, the romans in rigid numerals. in the house of wisdom in baghdad, al-khwarizmi gave birth to algebra. he named it al-jabr, the art of restoration, balancing what is unknown until it is revealed. to solve x² + 10x = 39, he completed the square: x² + 10x + 25 = 64, so that x + 5 = 8 and x = 3. what began as a method of solving practical problems has become a universal language of relations. his algorithms, with his very name giving us the word, seeded the logic of the machines that now hum in every corner of our lives. and his introduction of the hindu-arabic numerals and zero was a revolution beyond reckoning, for zero allowed us not only to count but to imagine the void as number, the infinite as countable.

geometry, too, was carried forward in these lands. omar khayyam, both poet and mathematician, sought to untangle euclid's parallel postulate, long a thorn in the side of geometry. he studied its hidden structure and in doing so touched the very threshold of non-euclidean spaces centuries before bolyai or lobachevsky. khayyam also solved cubic equations using conic sections, drawing a parabola and a circle whose intersection revealed the solution. the equation x³ + 200x = 20x² + 2000 was not abstract to him but a curve in space, its truth discovered where shapes meet. he saw algebra and geometry as two halves of one harmony, much as his poetry saw the earthly and the eternal as two reflections of the same light.

other voices carried the story further. al-kindi, philosopher of the arabs, spoke of numbers as keys to the harmony of the cosmos, a music heard not with the ears but with the intellect. ibn sina, physician and metaphysician, wove logic and mathematics into his vision of being itself, treating number and magnitude as the scaffolding upon which the edifice of knowledge must rise. nasir al-din al-tusi, working in maragha, refined euclidean geometry and studied the motion of planets, creating the tusi couple, a geometric construction that generates linear motion from two circles. centuries later, this very device appeared in copernicus' de revolutionibus, a quiet testament to the transmission of ideas across cultures. ibn al-haytham, in his book of optics, treated light not only as a physical phenomenon but as a problem in geometry and algebra. his method of controlled experimentation and his analyses of reflection and refraction carried the seeds of what we now call the scientific method. for him, geometry was not only the measure of space but the language of vision itself.

the rhythm of survival and transcendence beat again in the invention of calculus. newton and leibniz, grappling with the mystery of motion, invoked infinitesimals, quantities smaller than any number yet greater than zero. they were ghosts, but ghosts with power. berkeley mocked them as phantoms, but planets traced their orbits under their spell. it was cauchy and weierstrass who gave them clarity, defining limits with precision. to say lim x→a f(x) = l is to bind the elusive word "approaches" with the language of ε and δ. for every ε > 0, there exists a δ > 0 such that whenever |x - a| < δ, then |f(x) - l| < ε. from this, the derivative and the integral arise, rigorous, unshakable, yet still rooted in that ancient desire to capture change itself.

and yet, mathematics also encounters its own horizons. in the twentieth century, gödel showed that any system rich enough to contain arithmetic will harbor truths it cannot prove. his theorems revealed mathematics to be inexhaustible, forever incomplete. far from diminishing it, this gave mathematics its most profound transcendence, for it revealed that the human quest for knowledge is infinite.

to gather sheep with stones, to solve quadratics by completing the square, to trace the path of a planet with a circle within a circle, to define rigor with ε and δ, to discover that truth itself will always exceed our grasp, these are not separate acts but one story. they are the human story of mathematics, rising from survival into transcendence. al-khwarizmi's equations, khayyam's curves, al-tusi's couples, ibn al-haytham's rays, peano's axioms, weierstrass's limits and gödel's theorems are chapters in a single book we are still writing. to study mathematics is to walk this path, to trace the footprints of shepherds, philosophers and poets and to add our own. it is to glimpse, in the language of number and proof, the unending effort of a species not content to survive but always reaching beyond, seeking in the finite symbols of mathematics a reflection of the infinite.`
  }
];