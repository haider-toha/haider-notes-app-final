# N14 — reading without reading

folder: blog
date: 1 november 2025
slug: death-of-tokeniser-deepseek-ocr

===== PHYSICAL PAGE 132 =====

[ ] copied

[N14]

reading without reading

we have spent the last decade obsessed with
scale. we want more parameters, more data and,
perhaps most desperately, longer context windows. we went
from bert's claustrophobic 512 tokens to gemini's millions,
chasing the dream of stuffing entire legal archives
or code repositories into a single prompt. but
we keep hitting the same invisible wall, "tyranny
of the quadratic" as some would put it.

it is a basic fact of the transformer
architecture that self-attention scales as $O(n^2)$. it is
a physical memory bottleneck defined by the attention
matrix calculation:

\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V

the killer here is the $QK^T$ term. it
produces a matrix of size $n \times n$.
if you double your sequence length $n$, your
memory requirement for storing these attention scores quadruples
[1]. we have tried engineering our way out
of this with sliding windows and sparse attention,
but those are just band-aids. the real problem
is the input itself. we are still feeding

===== END PHYSICAL PAGE 132 =====
===== PHYSICAL PAGE 133 =====

[ ] copied

[N14 continued]

our ai's discrete text tokens, a legacy method
that is surprisingly inefficient for dense information.

enter deepseek-ocr. on the surface, it looks like
just another tool to read pdfs. but after
tearing apart the technical report, i am convinced
this is a trojan horse for a paradigm
shift called contexts optical compression. it posits a
wild theory that pictures might actually be cheaper
than words.

1. the mathematics of inefficiency and why text
is expensive

let's look at the numbers. standard tokenisers (bpe,
sentencepiece) are rigid. they treat a page of
text as a linear string of integers. if
you have a complex financial table, the model
has to burn tokens representing the structure (pipe
characters, newlines, spacing) just to tell the model
"this is a table."

from an information theory perspective, this is a
disaster. we can quantify the inefficiency using shannon

===== END PHYSICAL PAGE 133 =====
===== PHYSICAL PAGE 134 =====

[ ] copied

[N14 continued]

entropy ($H$):

H(X) = -\sum_{i} p(x_i) \log_2 p(x_i)

in a standard text stream, structural tokens (whitespace,
brackets, markdown) have very high probability $p(x_i)$, meaning
they contribute almost zero information (surprise) to the
system while consuming valuable slots in the context
window [2]. you are paying compute for predictable
syntax.

deepseek's hypothesis is that a "visual patch" (a
cluster of pixels) creates a holographic representation of
the data. the metric that matters here is
the compression ratio ($\rho$), but we need to
view it through the lens of vector dimensionality:

\rho = \frac{N_{\text{text}} \times d_{\text{text}}}{N_{\text{visual}} \times d_{\text{visual}}}

where $N$ is the number of tokens and
$d$ is the embedding dimension. while $d_{\text{visual}}$ (the
visual embedding size) is typically larger than $d_{\text{text}}$,
deepseek achieves a raw token reduction ($N_{\text{text}}/N_{\text{visual}}$) of
roughly 10x [3]. this suggests the model is

===== END PHYSICAL PAGE 134 =====
===== PHYSICAL PAGE 135 =====

[ ] copied

[N14 continued]

packing significantly more entropy into each vector, effectively
moving the complexity from the sequence length (which
scales quadratically) to the channel dimension (which scales
linearly).

2. the engine and its frankenstein architecture

the deepseek team trained a giant vision transformer
(vit) using a serial, heterogeneous pipeline that i
honestly find fascinating. it connects components that usually
don't talk to each other [8].

here is the "deepencoder" breakdown with the arithmetic
that justifies their choices:

1. the perceiver (sam-base)

they use the segment anything model (sam) as
the front end. to handle the $1024 \times
1024$ input resolution without melting the gpu, they
use windowed attention. instead of the global $O(n^2)$,
the cost becomes linear with respect to the
number of patches, because attention is restricted to
a local window $w$:

===== END PHYSICAL PAGE 135 =====
===== PHYSICAL PAGE 136 =====

[ ] copied

[N14 continued]


O\left(\frac{n}{w} \cdot w^2\right) = O(nw)

this allows the model to perceive fine-grained details
(serifs, decimal points) without the quadratic penalty [7].

2. the bottleneck (conv layers)

this is where the physical compression happens. they
use a 2-layer convolutional network to downsample the
feature map. we can calculate the exact output
dimension $O$ using the standard convolution arithmetic:

O = \left\lfloor \frac{I - K + 2P}{S} \right\rfloor + 1

with a kernel $K=3$, stride $S=2$ and padding
$P=1$, applied twice to a feature map of
$64 \times 64$ patches (derived from the sam
output):

- step 1: $O_1 = \lfloor(64 - 3 +
  2)/2\rfloor + 1 = 32$
- step 2: $O_2 = \lfloor(32 - 3 +
  2)/2\rfloor + 1 = 16$

===== END PHYSICAL PAGE 136 =====
===== PHYSICAL PAGE 137 =====

[ ] copied

[N14 continued]


the result is a $16 \times 16$ grid,
totaling 256 visual tokens. this massive reduction ($64^2
\to 16^2$ tokens) is what makes the subsequent
processing so cheap [7]. it forces the model
to aggregate local features into semantic concepts.

3. the semantic brain (clip-large)

finally, they feed those 256 tokens into clip.
since $256^2 = 65536$, the global attention cost
is negligible. clip aligns these visual patches with
the language manifold, getting them ready for the
llm to decode [4].

3. the "cliff" and rate-distortion theory in action

however, there is no free lunch. the report
details a massive drop-off in performance when they
push the compression too far.

- at 10x compression: 97% precision.
- at 20x compression: 60% precision.

===== END PHYSICAL PAGE 137 =====
===== PHYSICAL PAGE 138 =====

[ ] copied

[N14 continued]

this is a classic manifestation of rate-distortion theory.
there is a lower bound on the rate
$R$ (bits per symbol) required to achieve a
distortion $D$ (error rate):

R(D) = \min_{p(\hat{x}|x): E[d(x,\hat{x})] \le D} I(X; \hat{X})

as deepseek increases the compression ratio, they are
forcing $R$ below the intrinsic entropy of the
document image. at 20x, the "channel capacity" of
the latent space is exceeded by the noise
of the pixels (scan lines, font blur). the
mutual information $I(X; \hat{X})$ drops and the decoder
is forced to rely on its internal priors
(hallucinations) rather than the source signal [2].

this explains why the model starts hallucinating plausible
but incorrect numbers at high compression. it is
"dreaming" the data based on visual probability rather
than reading it. this is a critical limitation.
do not use this for high-stakes finance if
you are pushing the compression limits.

===== END PHYSICAL PAGE 138 =====
===== PHYSICAL PAGE 139 =====

[ ] copied

[N14 continued]

4. operational reality and the "gundam" mode

i have to mention the "gundam" mode because
the naming is fantastic. this is their solution
for massive schematics or newspapers.

if you shrink a giant blueprint to $1024
\times 1024$, you lose the details. gundam mode
tiles the image. it processes tiles individually (local
detail) and the full image (global context), then
stitches them together. even with this heavy lifting,
it uses fewer than 800 tokens per page
[3]. compare that to mineru or internvl, which
burn 6,000+ tokens for the same task [6].

deepseek is proving that general-purpose vlms are incredibly
wasteful. they are "over-tokenising" visual noise that carries
no semantic value.

===== END PHYSICAL PAGE 139 =====
===== PHYSICAL PAGE 140 =====

[ ] copied

[N14 continued]

5. the future of visual rag and memory
forgetting

this is where my opinion comes in strong.
i believe deepseek-ocr signals the obsolescence of the
text tokeniser for multimodal ai.

if we can encode a page of text
into a vector space that is 10x smaller
than the text itself, why would we ever
store the text? we are moving toward visual
rag [5].

imagine a vector database full of these deepencoder
embeddings, such that you don't retrieve text; you
retrieve the "visual gist" of the page. the
model also suggests a biomimetic approach to memory
called "memory forgetting" [6]:

- short-term: keep recent interactions as high-fidelity text.
- long-term: compress older context into low-res visual tokens
  (tiny mode, 64 tokens).

it mimics how humans remember. you recall the

===== END PHYSICAL PAGE 140 =====
===== PHYSICAL PAGE 141 =====

[ ] copied

[N14 continued]

exact wording of the sentence you just read,
but for a book you read last year,
you only retain the semantic "shape" of the
plot.

in a nutshell

deepseek-ocr is a proof-of-concept for a post-tokenisation era.
it validates the hypothesis that visual latent space
can hold more entropy per unit than linear
text.

for the engineers out there, this could be
a 10x cost reduction multiplier for your rag
pipelines [7]. for the researchers, it is a
challenge to the fundamental assumption that text is
the optimal medium for language modeling.

we are witnessing the transition from processing discrete
symbols to reasoning in continuous high-dimensional visual spaces.
the tokeniser isn't dead yet, but for the
first time, it looks like legacy tech.

===== END PHYSICAL PAGE 141 =====
===== PHYSICAL PAGE 142 =====

[ ] copied

[N14 continued]

references

[1] the quadratic barrier and the tokenisation crisis.
[2] entropy limits and signal-to-noise ratios in visual
latent space.
[3] core deepseek-ocr paper: technical claims and benchmarks.
[4] the modality gap and clip alignment.
[5] visual rag and production implications.
[6] benchmarking vs qwen/internvl and memory forgetting.
[7] the serial architecture: sam, conv and clip.
[8] deepencoder specifics and parameter counts.
[9] serial vs parallel architecture in mllms.

===== END PHYSICAL PAGE 142 =====
