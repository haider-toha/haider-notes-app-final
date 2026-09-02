# N20 — global sentiment engine

folder: projects
date: 10 june 2025
slug: global-sentiment-engine

===== PHYSICAL PAGE 197 =====

[ ] copied

[N20]

global sentiment engine

a real-time nlp pipeline that ingests multilingual news
and social content from 150+ countries, performs gpu-accelerated
transformer-based sentiment analysis, aggregates results by country and
time and visualises global emotional state on an
interactive webgl 3d globe.

github ↗ • live site ↗

system architecture

[CODE START]
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

===== END PHYSICAL PAGE 197 =====
===== PHYSICAL PAGE 198 =====

[ ] copied

[N20 continued]

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

===== END PHYSICAL PAGE 198 =====
===== PHYSICAL PAGE 199 =====

[ ] copied

[N20 continued]

    end
    
    Normaliser --> Cleaner
    Aggregation --> DB
    DB --> FastAPI
    FastAPI --> Frontend
[CODE END]

data collection

the pipeline ingests from 300+ rss feeds and
multiple social platforms. all collectors implement a common
interface ensuring consistent data normalization with source type,
source name, title, url (used for deduplication), content,
country code and publication timestamp.

rss feed coverage:

- wire services (4): reuters, ap, afp, euronews
- north america (17): npr, pbs, nbc, cbs, abc,
  usa today, washington post, cbc, ctv, toronto star,
  national post, milenio, el universal mx...

===== END PHYSICAL PAGE 199 =====
===== PHYSICAL PAGE 200 =====

[ ] copied

[N20 continued]

- europe western (45): bbc, guardian, sky, telegraph, france
  24, le monde, deutsche welle, der spiegel, ansa,
  la repubblica, el pais, nos, rtbf, swi orf,
  rte...
- europe nordic (18): svt, aftonbladet, nrk, vg, dr,
  tv2 dk, yle, helsinki times, iceland monitor...
- europe eastern (30): tvn24, gazeta wyborcza, hungary today,
  romania insider, ekathimerini, kyiv independent, moscow times, n1
  serbia/croatia/bosnia...
- asia (65): nhk, japan times, yonhap, cgtn, scmp,
  cna, straits times, jakarta post, bangkok post, times
  of india, ndtv, dawn...
- middle east & africa (55): al jazeera, arab
  news, haaretz, jerusalem post, gulf news, daily sabah,
  news24 sa, punch nigeria...
- americas (40): folha, clarin, el mercurio, el tiempo,
  jamaica observer...
- oceania (15): abc australia, nz herald, fiji times,
  rnz pacific...

country detection pipeline:

[CODE START]
flowchart TB

===== END PHYSICAL PAGE 200 =====
===== PHYSICAL PAGE 201 =====

[ ] copied

[N20 continued]

    Input["Article Text"]
    SourceAttr["Source-Based Attribution<br/>If source has known country → assign directly"]
    TextDetect["Text-Based Detection<br/>1. Extract country mentions<br/>2. Match 200+ variations:<br/>Official names, Common names<br/>Demonyms, Major cities, Local names<br/>3. Return most mentioned"]
    Output["Country Code"]
    
    Input --> SourceAttr
    SourceAttr -->|Match found| Output
    SourceAttr -->|No match| TextDetect
    TextDetect --> Output
[CODE END]

sentiment analysis pipeline

text preprocessing:
- remove urls (https?://\S+)
- strip html tags
- remove hashtags/mentions
- normalise whitespace
- preserve unicode (multilingual support)
- truncate to 512 tokens (model max context)

supported models:

===== END PHYSICAL PAGE 201 =====
===== PHYSICAL PAGE 202 =====

[ ] copied

[N20 continued]

model · parameters · languages · use case
cardiffnlp/twitter-xlm-roberta-base-sentiment · 278m · 100+ · default, multilingual news
cardiffnlp/twitter-roberta-base-sentiment-latest · 125m · english · high-accuracy english
nlptown/bert-base-multilingual-uncased-sentiment · 110m · 6 · nuanced 1-5 star rating
prosusai/finbert · 110m · english · financial news
siebert/sentiment-roberta-large-english · 355m · english · maximum accuracy

the inference pipeline runs through huggingface with cuda
acceleration when available. model outputs are normalised to
a -1.0 to +1.0 scale regardless of the
underlying label format. "LABEL_0" with 0.85 confidence becomes
score: -0.85, label: "negative". "5 stars" with 0.91
confidence becomes score: +0.91, label: "positive".

batch processing:

single inference is inefficient. the system batches articles
for gpu parallelization. articles are grouped into batches
of 32, filtered for minimum length (10 chars),
padded to max length in batch and processed
in a single forward pass. results are mapped
back to original articles.

===== END PHYSICAL PAGE 202 =====
===== PHYSICAL PAGE 203 =====

[ ] copied

[N20 continued]

aggregation and weighting

not all sources are equal. credibility weights:

source type · weight · rationale
rss · 1.0 · established news outlets
scraper · 0.9 · direct news site extraction
hacker news · 0.8 · curated tech community
reddit · 0.6 · mixed user-generated content
mastodon · 0.5 · social media, lower signal

weighted sentiment calculation:

\text{Weighted Average} = \frac{\sum (\text{sentiment\_score} \times \text{source\_weight})}{\sum \text{source\_weight}}

hourly aggregates track country code, hour, simple mean,
weighted mean, article count and foreign keys to
the top positive/negative articles for that period.

globe visualization

the frontend uses react three fiber for declarative
threejs. the globe component includes an earth sphere
with texture, country markers positioned by sentiment and

===== END PHYSICAL PAGE 203 =====
===== PHYSICAL PAGE 204 =====

[ ] copied

[N20 continued]

orbitcontrols for user interaction.

lat/long to 3d position:

\phi = (90 - \text{lat}) \times (\pi/180)
\theta = (\text{lon} + 180) \times (\pi/180)
x = -r \sin(\phi) \cos(\theta), \quad y = r \cos(\phi), \quad z = r \sin(\phi) \sin(\theta)

sentiment to color:

score range · color
< -0.3 · #ef4444 (red)
-0.3 to 0.0 · interpolate red → amber
0.0 · #f59e0b (amber)
0.0 to 0.3 · interpolate amber → green
>= 0.3 · #22c55e (green)

each country marker uses meshstandardmaterial with emissive properties
that intensify on hover (0.3 → 0.6). data
fetching uses swr with 60-second refresh intervals, deduplication
and automatic revalidation on focus.

===== END PHYSICAL PAGE 204 =====
===== PHYSICAL PAGE 205 =====

[ ] copied

[N20 continued]

performance characteristics

operation · gpu (rtx 5070) · cpu (12-core)
single inference · 15ms · 150ms
batch (32 articles) · 80ms · 2400ms
effective rate · ~400 articles/sec · ~13 articles/sec

source · typical duration · articles
rss (300+ feeds) · 2-5 minutes · 2000-5000
reddit · 30-60 seconds · 100-500
hacker news · 10-20 seconds · 50-100
total cycle · 3-7 minutes · 2000-6000

resource · idle · collection · inference
cpu · <5% · 20-40% · 10-30%
ram · 1.2gb · 1.5gb · 1.8gb
gpu memory · 500mb · 500mb · 800mb

database growth averages ~2kb per article, 1000-3000 articles
per hour, 50-150mb daily storage with 30-day retention.

error handling and fallbacks

collection failures:

===== END PHYSICAL PAGE 205 =====
===== PHYSICAL PAGE 206 =====

[ ] copied

[N20 continued]

- per-source isolation: one source failure doesn't stop the
  job
- automatic retry: 3 attempts with exponential backoff
- timeout: 30 seconds per source

inference failures:
- text too short (<10 chars): return none, skip
  article
- model exception: log error, return none for article
- batch failure: fall back to individual processing
- oom: reduce batch size dynamically

graceful degradation:
- postgresql credentials missing → falls back to sqlite
- reddit/mastodon credentials missing → skip those collectors
- gpu unavailable → falls back to cpu inference
- model load fails → api returns degraded status

limitations

- model accuracy: ~85% on standard benchmarks; sarcasm and
  cultural context remain challenging
- language coverage: while xlm-roberta supports 100+ languages, accuracy
  varies; best for high-resource languages

===== END PHYSICAL PAGE 206 =====
===== PHYSICAL PAGE 207 =====

[ ] copied

[N20 continued]

- real-time latency: 1-hour collection interval; breaking news delayed
  up to 60 minutes
- geographic granularity: country-level only; no city or region
  subdivision
- source availability: rss feeds may block, rate-limit or
  discontinue without notice
- attribution ambiguity: articles covering multiple countries assigned to
  most-mentioned
- bias propagation: model inherits biases from training data

stack: python 3.10+, fastapi, uvicorn, sqlalchemy 2.0, apscheduler,
pytorch 2.0, transformers 4.37+, httpx | next.js 14,
react three fiber, three.js, tailwindcss 3.4, swr, typescript
5

===== END PHYSICAL PAGE 207 =====
