import { query, getPool } from '../src/db/pool.js';

const AUTHOR = 'Bluecoderhub Research';
const CATEGORY_AI = 'AI Engineering';
const CATEGORY_DATA = 'Data Engineering';
const CATEGORY_CAD = 'AI CAD';
const CATEGORY_EDU = 'AI in Education';
const CATEGORY_FOUND = 'AI Foundations';

const posts = [
  {
    slug: 'the-transformer-was-not-the-insight-scaling-was',
    title: 'The Transformer Was Not the Insight. Scaling Was.',
    category: CATEGORY_FOUND,
    author: AUTHOR,
    excerpt: 'The standard telling gives attention the credit. The archive of what got published is not the archive of what mattered. Read Kaplan. Read Chinchilla. Read Hoffmann.',
    tags: ['scaling-laws', 'transformer', 'chinchilla', 'kaplan', 'foundation-models', 'ai-research'],
    content: `The standard telling of the last decade of deep learning gives credit to attention. "Attention Is All You Need" is treated as the year zero of modern AI. The architecture wins the retrospective.

The architecture is not what won. The scaling law did.

## The confounder in the historical record

The transformer arrived in 2017. GPT-2 arrived in 2019. GPT-3 arrived in 2020. In each case, the interesting change was not that the model got wider or deeper — it was that the compute-per-parameter and the training-token budget grew by orders of magnitude, and someone had the discipline to run the experiments.

Kaplan et al. (2020) and later Hoffmann et al. (2022) formalized what practitioners had already learned: loss is a power law in compute, model size, and dataset size. Given a compute budget, the optimal split between parameters and tokens is a specific ratio. The winning move is not a better architecture — it is not overspending on parameters.

The Chinchilla paper is the actual insight of the modern era. It just does not have the same marketing.

## What the transformer contributed

The transformer contributed parallelism. Attention is O(n²) in sequence length but embarrassingly parallel across the sequence dimension, which is what modern GPUs prefer. It let researchers scale training in ways RNNs structurally could not. Without that parallelism, the compute-scaling experiments would have been infeasible.

But this is the transformer as substrate, not as insight. Any architecture that scaled linearly with tokenized context and used dense matmul primitives would have gotten us here. The evidence is that state-space models, mixture-of-experts variants, and Mamba-class architectures now trade blows with transformers at scale. The load-bearing element was never the specific attention formulation.

## Why the record was written this way

Academic culture rewards specific, citable innovations. "We tried a bigger model on more data" is not a paper. "We introduced multi-head scaled dot-product attention" is. The archive of what got published is not the archive of what mattered.

Industrial research culture also rewarded architectures, because architectures could be patented, published, and hired for. The scaling insight lived in engineering notebooks, not in ICML proceedings. By the time the field acknowledged it, the credit had already gone elsewhere.

## What this implies for the next decade

If scaling is the insight, then the next order-of-magnitude in capability is a question about who has capital, data, and thermal capacity — not about who has cleverer attention variants. The academic contribution shifts from proposing architectures to characterizing scaling behavior, safety at scale, and the transfer of capabilities across domains.

The uncomfortable version: an ambitious ML PhD in 2026 who is spending their thesis on a novel attention variant is optimizing for the wrong incentive structure. The problems worth working on are alignment, evaluation, efficient inference at scale, and the empirical science of what capabilities emerge from what training mixtures. Not another transformer variant.

The paper the field will remember from this decade is not the architecture paper. It is the scaling laws paper. Read Kaplan. Read Chinchilla. Read Hoffmann. Then decide what you want to spend your PhD on.`
  },
  {
    slug: 'p-vs-np-is-not-the-question-verifiability-is',
    title: 'P vs NP Is Not the Question. Verifiability Is.',
    category: CATEGORY_FOUND,
    author: AUTHOR,
    excerpt: 'Undergraduate complexity courses spend a semester on P vs NP. It is the correct question for its era. It is no longer the operationally important one. The generation-verification gap is.',
    tags: ['complexity-theory', 'verifiability', 'cs-curriculum', 'llm-engineering', 'ai-evaluation', 'foundations'],
    content: `Undergraduate complexity courses spend a semester on P vs NP. It is the correct question for its era. It is no longer the operationally important one.

The distinction that matters for AI systems, right now, is between problems where verification is asymptotically cheaper than generation and problems where it is not.

## The generation-verification gap

Consider three problems.

- Prime factorization. Generating the factors is exponential in the size of the input; verifying a proposed factorization is polynomial. Huge gap. This is the classical NP structure.
- Playing chess at grandmaster level. Generation is hard; verification is also hard, because "was this the right move" is not a polynomial-time question against any oracle we have.
- Writing a correct implementation of a linked list in C. Generation, for a competent programmer, is minutes. Verification, given a compiler and a small test suite, is seconds.

LLMs are useful in direct proportion to the size of this gap. Where verification is cheap, an LLM can propose, a check can accept or reject, and the loop works. Where verification is as expensive as generation, the LLM output is a coin flip and no downstream check can rescue it.

## The AI engineering consequence

The single most useful mental model for what LLMs can do reliably is: they extend to any task where verification is easy. Code that has tests. Math with theorem provers. Formal specifications with model checkers. Structured data with schema validators. Web scraping with expected-output assertions.

Where verification is hard, LLMs produce plausible outputs that fail silently. This is the entire mystery behind "the demo worked but production is unreliable" — the demo had a human verifier watching every output, and the human was cheap. Production has no verifier, and the failures accumulate.

The engineering discipline that works is: for every LLM application, define the verifier before you define the prompt. If you cannot cheaply detect that an output is wrong, you cannot deploy it. This is not a limitation of the current models. It is a structural property of using a probabilistic system in a place where costs are asymmetric.

## The theoretical connection

The complexity class NP is exactly the class of problems where solutions have short, polynomially-checkable witnesses. This is the class where LLMs are structurally strong. Not because they solve NP problems, but because they generate candidate witnesses cheaply, and the check that accepts or rejects the witness is a separate, cheap computation.

The class of problems where LLMs are structurally weak is not defined by any classical complexity result — it is problems where the verification oracle itself is expensive, or absent, or has to be another model. That last case — LLM-as-judge — is where most production teams silently break, because they build a system whose correctness depends on a verifier that is not cheaper than the generator.

## The revised undergraduate question

The version of complexity theory that a working AI engineer needs is not "is P equal to NP." It is "for the problem I am solving, what is the ratio of verification cost to generation cost, and is my LLM's error rate low enough that the verifier is not the bottleneck."

That is not the question that will win a Turing award. It is the question that will decide whether the feature ships. Undergraduate courses that teach P vs NP without teaching verifiability are graduating engineers who cannot answer the question their first job will actually ask.

Add the module. It is not a big change to the syllabus, and it is the most immediately applicable idea in the entire course.`
  },
  {
    slug: 'why-compilers-predict-llm-engineers-better-than-ml-courses',
    title: 'Why Compilers Predict LLM Engineers Better Than ML Courses Do',
    category: CATEGORY_EDU,
    author: AUTHOR,
    excerpt: 'The graduate students who become excellent LLM engineers disproportionately come from compilers, not ML. The correlation is strong enough to be worth explaining — and to rethink the CS curriculum around.',
    tags: ['compilers', 'cs-curriculum', 'ai-education', 'llm-engineering', 'type-systems', 'hiring'],
    content: `The graduate students who become excellent LLM engineers, in our experience hiring them, disproportionately come from a background that is not ML. They come from compilers.

This is not obvious. The correlation is strong enough to be worth explaining.

## What compilers actually teach

A compilers course teaches, in order:

- The discipline of representing programs at multiple levels of abstraction that must remain semantically equivalent
- Static analysis over structured representations
- Type systems as a mechanism for expressing and enforcing invariants
- The distinction between what a program says and what a program means, with the second being the load-bearing concept
- The engineering practice of writing transformations that are correct because you understand the invariants, not because you tested them exhaustively

Every one of these is what an LLM engineer needs to reason about. LLM outputs are programs in a strange abstract language. Prompts are IRs. Tool schemas are type systems. Evaluations are static analyses. The mental furniture is already in place.

## What ML courses actually teach

A standard ML course teaches optimization theory, probabilistic modeling, statistical learning theory, and specific model architectures. All of these are foundational, and all of them are the wrong level of abstraction for LLM engineering.

The working LLM engineer rarely writes an optimizer. They rarely derive a gradient. They rarely tune a hyperparameter that is not a temperature setting. The parts of ML they touch are the API surface, not the mathematical core.

The parts they do touch — designing prompt structures, reasoning about tool call semantics, building evaluation harnesses, tracing failures back to context assembly bugs — are precisely the parts a compilers course prepared them for.

## The specific transferable skills

Three concrete examples of the transfer.

### Structured outputs as type systems

Getting a model to produce reliable structured output is a type-system problem. You define a schema, the schema constrains what the model can emit, the check enforces the constraint. The student who has thought about how a type checker rules out ill-formed programs finds structured outputs intuitive. The student who has only trained models finds them confusing.

### Prompt caching as a compiler-style optimization

Prompt caching rewards you for structuring prompts as a mostly-immutable prefix followed by a mutable suffix. This is exactly the discipline of writing IRs where hoistable computations are lifted out of the loop. The student who has thought about loop-invariant code motion knows immediately how to structure a system prompt for cache efficiency.

### Agent loops as interpreter design

An agent runtime is an interpreter for a strange DSL where the model emits ops and the harness executes them. The student who has written an interpreter, even a small one, immediately understands the design axes — reduction strategy, state representation, error handling, observability. The student who has not spends six months rediscovering them.

## What this means for CS curricula

The prescription is not that ML courses are useless. They remain foundational for anyone who wants to work on models themselves. The prescription is that the top of the LLM engineering funnel — the graduate coming out of school expecting to build LLM-powered products — is better served by the compilers sequence than by an additional ML course.

This is a real curriculum question for departments right now. The demand from industry is for LLM engineers, not ML researchers. The pipeline is set up to produce the second. The universities that adjust — that make a strong compilers sequence a recommended path for AI-product-focused students — will produce graduates who are ready to work on day one.

The universities that treat "an AI-focused undergraduate program" as "more ML courses" will produce graduates whose first job requires them to unlearn what they were taught and pick up an entirely different set of intuitions.

Compilers is not a legacy course. It is the most modern course in the CS curriculum for anyone who wants to build with LLMs.`
  },
  {
    slug: 'text-to-cad-is-almost-ready-almost',
    title: 'Text-to-CAD Is Almost Ready. Almost.',
    category: CATEGORY_CAD,
    author: AUTHOR,
    excerpt: 'The demos are extraordinary. In the mechanical engineer\'s inbox, it is a two-hour cleanup job. The gap is not a matter of scale. It is structural.',
    tags: ['ai-cad', 'generative-design', 'cad', 'mechanical-engineering', 'text-to-cad'],
    content: `The demos are extraordinary. Type "a bracket that mounts a Raspberry Pi to a 20mm aluminum extrusion, with M3 clearance holes and a cable pass-through" and watch a parametric model appear. On the demo reel, it is finished in eight seconds. In the mechanical engineer's inbox, it is a two-hour cleanup job.

The gap is not a matter of scale. It is structural.

## What the demos are actually doing

Most text-to-CAD demos in 2026 fall into three buckets:

- Mesh generation — a diffusion or transformer model producing a triangulated surface directly. Fine for concept renders, useless for manufacturing. You cannot dimension a mesh.
- Sketch-and-extrude scripting — a code-generating model that emits Python for a CAD kernel (OpenSCAD, CadQuery, Fusion API). Parametric and editable, but limited to the geometry the LLM can hold in its head at once.
- Constraint solving with LLM heuristics — the model proposes a topology, a constraint solver locks it into a valid parametric definition. The most promising path, and the slowest to demo well.

The first two are what you see on social media. The third is what will actually ship into professional workflows.

## Why the mesh path is a dead end

A manufacturing drawing needs GD&T — geometric dimensioning and tolerancing — datum references, and feature control frames. A mesh has none of these. It is a bag of triangles. To manufacture from a mesh, someone has to re-model it as a parametric solid, which is the very work the AI was supposed to skip.

Mesh output is fine for architectural concept work, product ideation, or 3D-printed one-offs. It is not fine for anything that touches an ISO tolerance callout.

## The real ceiling: intent

Text-to-CAD hits the same wall RAG hits: the model does not know what you actually meant. "A bracket for a Raspberry Pi" specifies neither the load path, the fastener class, nor the tolerance stack. The demo hides this by picking reasonable defaults for a demo-shaped part. A production part has a spec sheet, and the spec sheet has fifty numbers that were negotiated between three teams.

The AI cannot infer those numbers from a sentence. It can only ask, and the question tree is deep enough that by the time you have answered it, you have written the CAD script yourself.

## Where text-to-CAD earns its keep today

The wins are narrower and less glamorous than the demos suggest:

- Boilerplate features — hole patterns, mounting flanges, standardized brackets. The parts you have already drawn a hundred times.
- Sketch cleanup — a rough hand-drawn sketch, converted to a constrained sketch in the CAD tool. Reliable and boring, saves fifteen minutes.
- Library part search — describe what you want, the system finds the closest match in a fastener or component library. This is retrieval, not generation, and it is where most of the real value is.
- Suggested parametric ranges — you set up a design study, the LLM proposes reasonable ranges for the variables based on the material and load. A copilot, not an author.

None of this is text-to-full-CAD. All of it is useful.

## The three-year forecast

Text-to-CAD will get good at the same rate that reasoning models get good at multi-constraint problems, which is fast. Within three years, a competent engineer will describe a part, receive a first-draft parametric model, and spend an hour refining it — instead of an hour drawing it and a second hour refining it. That is a real productivity gain, and it is what the tooling will actually deliver.

What it will not deliver, on that timeline, is the demo where the engineer types a sentence and walks away. The manufacturing floor does not accept vibes.

Buy the copilot. Skip the magic wand.`
  },
  {
    slug: 'context-engineering-is-the-new-prompt-engineering',
    title: 'Context Engineering Is the New Prompt Engineering',
    category: CATEGORY_AI,
    author: AUTHOR,
    excerpt: 'Prompt engineering had a good run. In 2026 the interesting work has shifted one layer up: not what you say to the model, but what you put in the context window with it.',
    tags: ['llm', 'context-engineering', 'prompt-engineering', 'production-ai', 'caching'],
    content: `Prompt engineering had a good run. In 2023 it was a job title. By 2026 the interesting work has shifted one layer up: not what you say to the model, but what you put in the context window with it.

Call it context engineering. It is where the wins are now.

## The prompt is a small part of the context

For a modern production LLM app, the prompt itself is a rounding error. The context is dominated by:

- The system message and instructions
- Retrieved documents from RAG
- Tool schemas and prior tool call outputs
- Conversation history
- Memory or persistent state
- Guardrails and refusal templates

Each of these is a design surface. Each is more consequential than the phrasing of the user's turn. And each is invisible to the "prompt engineer" who is still tweaking wording in a playground.

## The four decisions that dominate quality

Real context engineering is about four things.

### What goes in

Not "everything relevant" — a common trap. Everything relevant is too much, and the model's attention degrades with context length in ways benchmarks do not capture. You want the minimum context that answers the question, ranked by relevance, deduplicated across sources, and truncated at a budget.

Deciding what to leave out is harder than deciding what to include.

### What order it appears in

Recency and primacy both matter. Instructions at the very start and the very end are followed more reliably than instructions in the middle. Retrieved chunks near the top are weighted more heavily than chunks near the bottom, even when the model claims otherwise.

If your system prompt is 400 tokens, the last 50 tokens do more work than the first 350. Structure accordingly.

### What format it is in

Markdown headings help the model orient. XML tags help more, especially for delimiting user-supplied content from system content. JSON is best when the downstream code needs structure — worst when you want the model to read prose thoughtfully.

The format is a signal about what to attend to. It is not decoration.

### What is cached

Prompt caching turns context engineering from "how do I fit this in the context window" to "how do I structure this so the stable parts hit the cache." That means the immutable stuff — system prompt, tool schemas, retrieved corpus — comes first, and the volatile stuff — user turn, live retrieval — comes last.

Get this wrong and you pay 5-10x on the bill. Get it right and the same feature gets cheaper every quarter as your cache hit rate climbs.

## The mental model

The best way to think about context engineering is as a workspace layout, not as a message. You are laying out a desk for the model to work at. Documents on one side, tools on the other, current task in the middle, sticky notes at the top for the rules. The model works better at a well-organized desk than at a messy one, and the difference is not subtle.

Prompt engineering is the sticky note. Context engineering is the desk. Learn the desk.`
  },
  {
    slug: 'the-personalized-tutor-was-always-the-killer-app',
    title: 'The Personalized Tutor Was Always the Killer App',
    category: CATEGORY_EDU,
    author: AUTHOR,
    excerpt: 'Every generation of ed-tech promised a personalized tutor for every learner. LLMs are the first technology that can plausibly deliver — but only if we stop shipping chatbots and start shipping tutors.',
    tags: ['ai-education', 'edtech', 'tutoring', 'personalized-learning', 'llm'],
    content: `Every generation of ed-tech has promised the same thing: a personalized tutor for every learner. The 2000s tried adaptive quizzing. The 2010s tried MOOCs with recommendation engines. Neither worked, because the underlying technology could not model what the student did not understand.

LLMs can. That is the shift, and it is bigger than any other single change in education technology in the last thirty years.

## Why previous attempts failed

Adaptive quizzing measured what you got wrong, not why. If you missed a question, the system pushed you to an easier question — a movement in difficulty, not in understanding. A student who missed the question because of a shaky prerequisite got the same intervention as one who missed it from a careless read. The correction was noise.

MOOCs recommended courses. Nobody needed course recommendations. They needed someone who could look at their work and say "you understand this, you do not understand that, here is what to try next."

That someone is what a tutor is. And an LLM can do a surprising fraction of the job, right now, for essentially any subject a well-educated adult can teach.

## What the tutor actually needs

A working AI tutor is not a chatbot that answers questions. It is a system with four capabilities:

- A model of the student's current state — what they have shown they know, what they have shown they do not, and how confident either of those estimates is.
- A model of the subject — the concept graph, the prerequisite structure, the common misconceptions at each level.
- A theory of intervention — given the two above, what should the student try next? Not "what is the answer" — "what is the useful next problem."
- A patient conversational surface — the willingness to listen to a wrong explanation and locate the specific step where the reasoning broke, instead of just correcting the final answer.

The first two are where the interesting engineering lives, and where most current AI tutors are weak. They default to the chatbot mode: helpful in the moment, but not carrying any model of the student across sessions. That is not tutoring. That is a very fluent search engine.

## The regulatory shape

There is a real question about what an AI tutor is allowed to do. In K-12 systems, an AI that adapts curriculum runs into IEP law, FERPA obligations, and instructional-time accreditation questions. In higher education, the moment the tutor becomes evaluative, it enters the same regulatory space as any other assessment tool.

Companies building consumer AI tutors mostly sidestep this by staying out of formal education contexts. That is a viable business — the parent buying tutoring for their child does not need FERPA compliance — but it caps the impact. The version that matters is the one that plugs into the classroom, and that version has to solve a policy problem alongside the technology problem.

## What "solved" would look like

A solved AI tutor at scale would look like this: every student has a persistent learning model that follows them across subjects and grades, updated from their work with the tutor. The tutor knows what the student has been taught, what they have demonstrated fluency in, and what they are stuck on right now. It generates practice problems calibrated to the edge of their current ability. It reports progress to teachers in language the teacher can act on.

None of this is science fiction. All of it is engineering. The parts that are still missing are the persistent learner model, the shared concept graph across subjects, and the teacher-facing surface that keeps educators in the loop instead of routing around them.

The companies that build those parts are building the killer app that ed-tech has been chasing for thirty years. The companies still building chatbots that answer homework are not.`
  },
  {
    slug: 'the-boring-wins-in-ai-assisted-cad',
    title: 'The Boring Wins in AI-Assisted CAD',
    category: CATEGORY_CAD,
    author: AUTHOR,
    excerpt: 'The interesting question about AI in CAD is not "when will it generate the whole model." It is which parts of the modeler\'s day are already gone. The answer is more than most people realize.',
    tags: ['ai-cad', 'cad', 'feature-recognition', 'gd-and-t', 'mechanical-engineering'],
    content: `The interesting question about AI in CAD is not "when will it generate the whole model." It is "which parts of the modeler's day are already gone."

The answer, as of mid-2026, is more than most people realize — and none of it looks like the sizzle reels.

## The five workflows that already shifted

Talk to any working ME or product designer who has adopted AI tools in the last twelve months, and the same five wins come up.

### Feature recognition on imported STEP files

You get a STEP file from a supplier. It is a dead solid — no features, no history, no parametric tree. Historically, re-parameterizing it was a slow, error-prone slog. AI-driven feature recognition now reconstructs the feature tree from geometry in seconds, and gets it right often enough that the human review is faster than manual re-modeling.

This is not glamorous. It is worth an hour per file.

### Drawing annotation and GD&T suggestions

Drop a finished 3D model into the drawing environment, and the tool suggests views, dimension callouts, and GD&T controls based on the part's manufacturing intent. The engineer edits and approves. What used to be forty-five minutes of view placement and callout typing is now ten minutes of review.

The AI is not designing the tolerance scheme — it is proposing the standard patterns you would have applied anyway. That is exactly the shape of a good copilot.

### Mesh cleanup and reverse engineering

Scan-to-CAD used to be a specialist skill. Now the AI does the surface reconstruction, identifies primitive features — holes, planes, cylinders — and hands you a mostly-clean parametric model with the primitives already fitted. You still have to review it, but the starting point is hours ahead of where it used to be.

### Simulation setup

Meshing is the reason FEA jobs get postponed. AI-driven meshing now picks element sizes, refinement zones, and boundary layers automatically for standard analyses. The convergence is not always perfect on the first pass, but the second pass takes minutes instead of half a day.

### Part library retrieval

"Find me the standard flange that mates to this." "Show me every bracket in our library within these envelope dimensions." Embedding-based search over engineering component libraries turns a fifteen-minute rummage into a five-second query. The technology is exactly what powers RAG in software — applied to geometry metadata and standards documents.

## Why these wins are unglamorous by design

The pattern here is consistent: AI is winning in CAD wherever the task is high-volume, well-defined, and has an obvious human-in-the-loop review. It is not winning in generative design where the outputs are still mostly demos, or in text-to-CAD where the intent gap is unbridged, or in "AI CAE" where the physics are unforgiving of guessing.

The wins are boring because they are compounding. Fifteen minutes here, an hour there, one saved trip through the drawing template — the engineer who adopts the boring wins is 30% more productive by the end of the quarter, and the engineer who is waiting for text-to-CAD is still waiting.

## The buying signal for teams

If you are evaluating an AI CAD tool, ignore the generative demos. Ask three questions:

- Does it read our imported files well and reconstruct the feature tree?
- Does it produce drawing annotations we would actually approve?
- Does it search our internal part library semantically, not just by filename?

If yes to any two, the ROI is already there. The magic wand ships in a version you have not paid for yet.`
  },
  {
    slug: 'the-agent-runtime-is-your-new-operating-system',
    title: 'The Agent Runtime Is Your New Operating System',
    category: CATEGORY_AI,
    author: AUTHOR,
    excerpt: 'An agent framework is not a library. It is a runtime — and the field has spent two years pretending otherwise. Pick it the way you pick an operating system.',
    tags: ['agents', 'llm', 'architecture', 'runtime', 'production-ai'],
    content: `An agent framework is not a library. It is a runtime. And the field has spent two years pretending otherwise.

The consequence: teams keep picking frameworks the way they pick logging libraries — by API surface, star count, blog post frequency — and then get bitten by the parts that matter, which are not the API surface.

## What the runtime actually decides for you

An agent runtime is answering, whether you think about it or not:

- How is a run bounded? Wall-clock timeout, token budget, tool-call cap, or nothing? The last option is the default in most frameworks, and it is the reason your bill has a bad day.
- How is state persisted between turns? In memory, in a database, in the framework's opinionated schema? If your process crashes mid-run, does the agent resume, restart, or lose the work?
- How are tools registered and validated? Are schemas checked at load time, at call time, or never? Does a malformed tool schema fail loudly or produce silently wrong tool calls?
- How are errors surfaced? A network hiccup mid-turn — is it retried transparently, propagated to the model as a tool error, or bubbled to the caller? Each choice has product-visible consequences.
- How is observability wired? Are traces emitted per turn, per tool call, per token? Can you pull a full run out of the system after a customer complaint, or does the observability end at "the request 500'd"?

These decisions look like implementation details. They are actually the shape of your product. Change the runtime and every one of them changes.

## The framework tax nobody discloses

Most teams underestimate how much of their code base ends up shaped by the framework choice. Prompt templates use the framework's format. Tool definitions use the framework's decorators. Retries live in the framework's middleware. Observability plugs into the framework's callback system.

Six months in, "swap the framework" means rewriting 20-40% of the codebase. This is a lock-in that nobody puts in the README.

## The runtime you can build in a week

Here is the uncomfortable truth: for many production agent apps, the runtime you actually need is not a framework at all. It is:

- A loop that calls the model
- A tool dispatcher with schema validation
- A retry policy with backoff
- A budget check per turn
- A persistence layer for state and traces
- A structured logger

That is 500 lines of code, not a dependency. It is boring, it is inspectable, and it does not change under you when the framework maintainer refactors.

Frameworks earn their place when you need patterns they encode — human-in-the-loop review, durable multi-step workflows, complex evaluation harnesses. If your product is a single-turn or short-loop agent with a handful of tools, the framework is more surface than value.

## The one thing to measure

If you take one thing from this: measure your runtime cost against a from-scratch baseline every six months. If the framework is not saving you more engineering time than it is costing in learning curves, upgrades, and lock-in, replace it. The frameworks that survive this test are the ones worth committing to. The rest are momentum.

Agent runtimes are the operating system of the AI stack. Pick them the way you pick an operating system: reluctantly, and with an eye on what you cannot change later.`
  },
  {
    slug: 'what-coding-bootcamps-get-wrong-about-ai',
    title: 'What Coding Bootcamps Get Wrong About AI',
    category: CATEGORY_EDU,
    author: AUTHOR,
    excerpt: 'The bootcamp model is under structural pressure. Most schools are responding with the wrong reflex — adding an "AI module" instead of rebuilding around what junior engineers now need to do.',
    tags: ['ai-education', 'bootcamps', 'developer-education', 'code-review', 'hiring'],
    content: `Coding bootcamps had a decade of predictable success. Twelve weeks of intensive instruction produced a junior developer who could ship a CRUD app, get hired, and pay back the tuition on entry-level wages. The curriculum was standardized, the outcomes were measurable, and the market absorbed graduates as fast as the schools could produce them.

That model is under structural pressure now, and most bootcamps are responding with the wrong reflex. They are adding an "AI module" to the existing curriculum instead of rebuilding around what junior engineers actually need to be able to do in 2026.

## The junior developer job changed

Two years ago, the entry-level developer's job was to write CRUD endpoints, wire up frontends, and debug small features. In 2026, the AI assistant writes the CRUD endpoint faster than the junior can, and the code is usually correct. The junior's marginal value is not in producing code — it is in evaluating what the AI produced, reading it critically, catching the subtle bug, and integrating it into a codebase they understand.

The skills that make this possible are: reading code fluently, understanding a codebase's architecture, writing tests that catch real regressions, and debugging by hypothesis. None of these are the top of a typical bootcamp curriculum, which still front-loads syntax and framework mechanics.

The result: bootcamp graduates who can write React components but cannot evaluate whether an AI's React component is any good.

## What the AI module misses

The typical AI module bolted onto an existing bootcamp teaches:

- How to prompt Copilot or Cursor
- Basic RAG with an off-the-shelf embedding model
- How to build a chatbot with a framework
- Maybe a lecture on evals

This is the wrong list. What the junior developer actually needs, and what the bootcamps are not teaching:

- Code review as a primary skill — spotting when the AI wrote plausible-looking code that does the wrong thing, especially in the parts of the codebase the AI could not see.
- Debugging AI-authored code — the failure modes are different from human-authored code and require different heuristics.
- Test writing as insurance against AI drift — because the code will change again next week, and only the tests catch the regressions.
- Reading codebases with intent — the assistant is only as useful as the context you give it, and the context comes from understanding what is already there.
- Judgment about when not to use the assistant — the boring parts of the job where the assistant is faster than you are also the parts where it is easiest to accept its output without reading it.

The bootcamps that adapt to this will produce hires who make senior engineers' lives easier. The ones that keep teaching "React syntax plus a prompting elective" will produce hires who need to be walked through code they wrote yesterday.

## The market signal

Hiring managers have already noticed. Job postings for entry-level developers in 2026 emphasize reading and reviewing code more than writing it. Interviews increasingly include "here is some AI-generated code, tell me what is wrong with it" as a first-round screen. Take-home projects ask for code review write-ups alongside the working implementation.

The bootcamps that get this right treat the assistant as the constant, not the exception. Every project uses one. Every project also requires the student to explain what they changed and why. Every project ends with a review of AI-suggested code the student rejected, and the reasoning for the rejection.

## The uncomfortable truth

A twelve-week program cannot produce a senior engineer. It never could. What it produced was a junior engineer who could be trusted with junior work, and the industry paid because the junior work was worth paying for. In 2026, the junior work has changed shape, and the training has to change shape with it — or the graduate cannot be trusted with anything.

Bootcamps are not obsolete. They are being asked to teach a harder curriculum in the same twelve weeks, and the ones that succeed will look very different from the ones that thrived in 2019. The others will fold, quietly, blaming AI when the real problem is that they never updated the syllabus.`
  },
  {
    slug: 'rag-failure-modes-nobody-talks-about',
    title: 'The RAG Failure Modes Nobody Talks About',
    category: CATEGORY_AI,
    author: AUTHOR,
    excerpt: 'A typical RAG demo looks impressive. Then it ships to production, and the failures arrive one quarter at a time. Here is what they look like.',
    tags: ['rag', 'llm', 'retrieval', 'evaluation', 'production-ai'],
    content: `A typical RAG demo looks impressive. You embed a corpus, retrieve top-k chunks, stuff them in a prompt, and the model answers questions about your data. The pipeline ships in a weekend.

Then it goes to production, and the failures arrive one quarter at a time.

## The retrieval-quality ceiling

The first hard truth: your RAG system is only as good as your retriever, and your retriever is mostly cosine similarity over embeddings that were never trained on your domain. Generic embeddings score "JavaScript runtime" close to "JavaScript framework," but they do not know your internal term "Plover" is your billing service. The model writes confident answers about Plover that have nothing to do with the documents that actually mention it, because those documents never made the top-k.

The fix is rarely a better embedding model. It is hybrid retrieval — BM25 for term-exact recall, dense vectors for semantic recall, and a reranker on top — plus a domain-specific evaluation set that lets you actually measure improvements instead of guessing.

## The chunk boundary problem

The second truth: your chunks lie. A 512-token chunk that ends mid-sentence will retrieve well, get fed to the model, and produce an answer that confidently completes the sentence in the wrong direction. The model has no signal that the context was truncated. It will not say "I don't know." It will write the next sentence anyway.

Overlap helps. Semantic chunking helps more. Hierarchical retrieval — where you fetch a small chunk, then expand outward to the surrounding context window — helps most. None of this is in the typical tutorial.

## The freshness gap

Most RAG systems have an embedding pipeline that runs nightly. By the time a user asks about today's deploy, the index is yesterday's. Worse: when the underlying document changes, the old chunks remain in the index until the next full reindex, so the model retrieves stale facts and contradicts the current source.

Streaming ingestion is hard. Delete-on-update is harder. Most teams discover this six months after launch, when a customer-facing system gives an answer that no longer matches the public docs.

## The evaluation gap

The deepest failure: most teams ship RAG without an eval set. They look at three queries that work, declare victory, and ship. When the system regresses — and it always regresses, because someone changed the chunking strategy or swapped embedding models or upgraded the LLM — there is no way to know.

Building a 200-question gold-standard eval set is the single highest-leverage investment in any RAG system. It is also the thing nobody wants to do, because writing 200 question-answer pairs is unglamorous work.

## The model-as-oracle assumption

Finally: even when retrieval is perfect, the LLM is not a neutral reader. It has prior beliefs. Ask it a question where the retrieved context contradicts a popular myth, and it will quietly side with the myth. Pin the response to the context with explicit instructions — answer only from the provided sources, cite the source for each claim, and say "not in the provided sources" if the answer is not there — and measure how often it actually obeys.

The honest version of a RAG project takes three months longer than the demo suggests. Plan for it.`
  },
  {
    slug: 'stop-fine-tuning-start-evaluating',
    title: 'Stop Fine-Tuning. Start Evaluating.',
    category: CATEGORY_AI,
    author: AUTHOR,
    excerpt: 'In 2024, fine-tuning was the default answer. In 2026, it is almost always the wrong one. The real asset to build is an evaluation harness, not a model.',
    tags: ['llm', 'fine-tuning', 'evaluation', 'prompt-engineering'],
    content: `In 2024, fine-tuning was the default answer. In 2026, it is almost always the wrong one.

The reasoning is unglamorous. Frontier models improved faster than your fine-tunes can keep up with. Every few months, the base model's zero-shot performance on your domain crosses the line where your custom fine-tune was operating. You pay the engineering cost of maintaining a pipeline that is perpetually one quarter behind.

## What fine-tuning was good at

Fine-tuning made sense when:

- The base model genuinely could not do the task
- You needed structured outputs that prompting could not reliably produce
- You had a closed, well-defined task with a stable distribution
- Latency or cost mandated a smaller model

In 2026, prompting handles the first two for almost any task you can describe in words. Structured outputs are a built-in API feature, not a fine-tuning win. Long-context models make few-shot examples a comma-separated list, not a training set.

## What is left

The real fine-tuning wins today are narrower than the conversation suggests:

- Specialized domain language where prompting alone cannot teach the rules — legal templates with strict formatting, medical coding, regulatory compliance text
- High-volume, low-margin classification where a small open model is the only economically viable answer
- Behavioral cloning of a specific voice or workflow that you cannot articulate in a prompt

If your use case is not on that list, you almost certainly want to spend the same time on prompt engineering and evaluation infrastructure.

## The eval loop is the product

Here is the shift: the asset you build is not a model. It is an evaluation harness.

When the next model releases — and one will, this quarter — you swap it in, run your evals, and either ship or do not. Your eval suite is the moat. Your prompts are the configuration. Your retrieval pipeline is the data layer.

Teams that treat AI products this way ship faster every quarter. Teams that treat them as model-training projects ship once, then maintain a pipeline that drifts further behind every release.

## The half-life of training data

There is a final wrinkle nobody mentions: the training data you collected six months ago may already be inferior to what the base model can generate today. The human annotators who hand-labeled your dataset were calibrated against a worse model than the one now in production. If you retrain on that data, you may be teaching your model to be worse than its baseline.

Audit your training data against the current base model's outputs. If the model is winning more than it is losing, your dataset is now a regression hazard.

## The default in 2026

Evaluate first. Prompt next. Fine-tune only when you have evidence that nothing else clears the bar. The engineering discipline that ships reliable AI products is the inverse of the one that shipped reliable ML products five years ago — and most teams have not made the switch.`
  },
  {
    slug: 'postgres-is-a-vector-database',
    title: 'Postgres Is a Vector Database (If You Let It Be)',
    category: CATEGORY_DATA,
    author: AUTHOR,
    excerpt: 'The vector database market exists because of a marketing gap, not a technical one. For most teams, a Postgres instance plus pgvector outperforms the dedicated store.',
    tags: ['postgres', 'pgvector', 'embeddings', 'vector-search', 'rag'],
    content: `The vector database market exists because of a marketing gap, not a technical one. For 90% of teams, a Postgres instance you already have, plus pgvector, will outperform the dedicated vector database you were about to provision.

The remaining 10% have a real reason. Most teams do not.

## The numbers

A modern pgvector setup with HNSW indexing handles up to roughly 10 million vectors at low-latency queries on a single Postgres node, with appropriate RAM and dimensionality. That covers more production RAG systems than anyone writing a Pinecone tutorial would admit.

The trade is that you give up some of the absolute query speed of a dedicated vector store in exchange for transactional consistency, joins to your relational data, and the ability to manage one database instead of two.

## Where the dedicated stores win

There are real wins on the other side:

- Sustained query rates above a few thousand per second on a single replica
- Vector counts above 50 million where index build time and memory pressure become operational problems on Postgres
- Multi-tenant isolation where every tenant has its own collection with strict isolation guarantees
- Native support for sparse plus dense hybrid retrieval where the platform's BM25 integration is more mature than the Postgres extension stack

If you are not in one of those situations, you are paying a recurring bill, a new operational surface, and a synchronization tax — keeping the vector store consistent with your source-of-truth database — for marginal latency improvements you may never measure.

## The unsexy part

Postgres also lets you do the thing that is structurally hard in a dedicated vector store: write a query that filters by tenant, by document type, by recency, and by similarity, in a single transaction. Most teams discover this requirement six months in, after they have already committed to a separate vector store, and end up re-implementing filter pushdown by maintaining metadata tables in both systems.

Start with Postgres plus pgvector. Measure. Move only when the measurement, not the marketing, tells you to.

## A pragmatic migration path

If you do outgrow it, the migration is bounded and well-understood: you already have the source-of-truth in Postgres, so reindexing into a vector store is a one-direction batch job. The cost of going Postgres-first and migrating later is much lower than the cost of going vector-first and discovering you needed transactional joins.

The expensive mistake is the inverse: building on a vector store, growing dependent on its query model, then needing to add the relational features you would have had for free in Postgres.

## The decision tree

If your vector count is under 10 million and you already run Postgres: pgvector. If you have spiky read traffic but few writes and need millisecond p99: pgvector with a read replica. If you have a multi-tenant SaaS with hard isolation requirements and ten thousand tenants: probably a dedicated store, but measure first. If your team has never operated Postgres at scale: hire that skill before you outsource it to a vendor.

The default should be the database you already know how to operate. The exception needs to justify itself in numbers.`
  },
  {
    slug: 'the-eval-loop-is-the-product',
    title: 'The Eval Loop Is the Product',
    category: CATEGORY_AI,
    author: AUTHOR,
    excerpt: 'Build the evaluation harness before you build the feature. This sounds backwards. It is also the only way to build AI products that do not degrade silently.',
    tags: ['evaluation', 'llm-ops', 'testing', 'methodology', 'production-ai'],
    content: `The most useful thing I can tell a team starting an AI product is: build the evaluation harness before you build the feature.

This sounds backwards. It is the opposite of how software has been built for the last twenty years. It is also the only way to build AI products that do not degrade silently.

## Why evals matter more than tests

A unit test asserts deterministic behavior. Given input X, the function returns Y. If Y changes, the test fails immediately.

An LLM is not deterministic. Given input X, it returns something in a distribution of Ys. The right way to measure it is not a single assertion but a population of inputs scored against a rubric. Every time you change the prompt, the model, the retrieval pipeline, or the system message, you re-run the population and measure the shift.

If you do not have that population, you cannot measure anything. You ship by vibes.

## What a good eval set looks like

A good eval set has three layers:

- A small smoke set of 10 to 30 examples that runs on every PR — fast feedback, catches catastrophic regressions
- A medium regression set of 100 to 300 examples that runs nightly — catches subtler drift across prompt changes
- A large stress set of 1,000 or more examples that runs weekly or on major changes — adversarial inputs, edge cases, long-tail distributions

The composition matters more than the size. A 200-example eval set covering 12 failure modes is more useful than a 2,000-example set that is 90% happy-path.

## The hardest part is grading

For deterministic outputs — classification labels, structured data — grading is easy. For open-ended outputs, you have three options:

- Reference-based: compare against gold answers, which requires writing the gold answers
- LLM-as-judge: have a stronger model grade the output against a rubric, which requires designing the rubric and validating the judge
- Human review: spot-check a sample, which requires people, time, and consistency calibration

Most production systems use all three at different stages. The honest version of building an AI product is that the eval infrastructure is half the codebase.

## The judge needs evals too

If you use LLM-as-judge — and you should, for almost any non-trivial open-ended task — the judge itself needs an eval set. You write 50 examples with hand-labeled correct grades, run the judge against them, and measure agreement. If the judge disagrees with the human grader more than 15% of the time on your domain, your judge is the bottleneck, not the model under test.

Most teams skip this step and discover six months later that their nightly regression numbers are noise.

## The discipline shift

The teams that ship reliable AI products treat evaluation as a first-class engineering discipline. They write evals before features. They review changes to prompts the way other teams review changes to schemas. They version their eval sets in git and treat regressions as breaking changes.

The teams that do not ship features that work in demos and degrade in ways nobody can explain. The model version updated, or the retrieval index drifted, or someone tweaked the system prompt to fix one bug and introduced three others — but nobody noticed, because nobody was measuring.

Build the eval loop first. The product follows.`
  },
  {
    slug: 'multi-agent-systems-field-report',
    title: 'Multi-Agent Systems: A Field Report',
    category: CATEGORY_AI,
    author: AUTHOR,
    excerpt: 'After eighteen months of teams building multi-agent systems in production, the picture is clearer than the discourse suggests. Here is what actually works.',
    tags: ['agents', 'llm', 'architecture', 'multi-agent', 'production-ai'],
    content: `After eighteen months of teams building multi-agent systems in production, the picture is clearer than the discourse suggests. Some patterns work. More patterns waste a lot of money to do worse than a single agent with better tools.

This is a field report from what we have seen ship.

## Where multi-agent helps

Genuine wins concentrate in three shapes:

### Parallel research

Dispatching several agents to explore independent sub-questions concurrently, then synthesizing. The pattern works because the sub-questions are genuinely independent — there is no coordination cost between them. A user asks "compare these four vendors on pricing, security posture, and integration story," and you fan out one agent per vendor.

### Specialist routing

A coordinator that classifies the request and routes to a specialist with a narrower prompt, a different tool set, or a different model. Works when the specialists really are specialists, not just the same model with a different system prompt. A code-review specialist with access to the linter and the test runner is a different thing from a docs-writing specialist with access to the search index.

### Verification chains

A generator-critic loop where one agent produces output and another scrutinizes it against constraints. The win comes from the critic having explicit instructions to disagree, not from having two models in the pipeline. The critic needs a different prompt, a different reading of the spec, and a clear license to fail the output.

These work because each agent has a clearly bounded role and the handoff protocol is narrow.

## Where multi-agent fails

The failures are equally consistent:

### Coordinator-as-bottleneck

A single agent orchestrating five specialists ends up serializing the work, paying tokens for context shuttling between them, and producing the same answer slower and more expensively than a single capable agent would have.

### Compounding ambiguity

Each agent in a chain interprets the previous output. Small misinterpretations compound. By the fourth hop, the system is answering a question subtly different from the one that was asked. Debugging this is exquisitely painful because no single agent did anything wrong.

### The "let agents collaborate" fantasy

Open-ended multi-agent conversations where agents debate or delegate to each other almost never produce better outputs than a single well-prompted agent. They burn tokens, take longer, and produce work that is harder to debug. The literature shows occasional gains on narrow benchmarks; production logs show consistent costs.

## A working rule of thumb

If you can write the coordination logic as deterministic code — first do X, then if X.kind equals foo do Y, else do Z — that is usually the right answer. The coordinator is a function, not an LLM. The LLMs are the leaves.

If the coordination genuinely requires reasoning about a dynamic state space, then the agentic coordinator earns its place. But test the deterministic version first. It will surprise you how often it is enough.

## The cost shape

Multi-agent systems have a cost shape that is easy to underestimate. Token counts multiply by the number of agents involved. Latency stacks if the agents are serial. Failure modes multiply combinatorially. A five-agent system is not five times the complexity — it is something closer to the product of the agents' individual failure rates.

A single well-prompted agent with good tools handles 80% of what teams try to build multi-agent systems for. Build that first, measure where it actually fails, and add coordination only where you have evidence it pays for itself.`
  },
  {
    slug: 'cost-aware-inference-quiet-engineering',
    title: 'Cost-Aware Inference: The Quiet Engineering of LLM Apps',
    category: CATEGORY_AI,
    author: AUTHOR,
    excerpt: 'The pricing page lies, gently. The gap between back-of-envelope math and your production bill is engineering — the quiet kind nobody puts on the slide.',
    tags: ['llm', 'cost-optimization', 'caching', 'infrastructure', 'production-ai'],
    content: `The pricing page lies, gently. It shows you input tokens at one rate and output tokens at another, and your back-of-envelope math says the feature will cost a few dollars a day. Six weeks in, you are looking at a five-figure monthly bill and trying to figure out what happened.

The gap between the pricing page and the production bill is engineering — the quiet kind nobody puts on the slide.

## Where the money actually goes

The big surprises tend to come from a few places:

### Context inflation

Every conversation turn includes the full history, plus retrieved chunks, plus the system prompt. A user that "chats for a while" can quickly push 20K tokens of input per turn, and you are paying for it every turn. The cost grows quadratically in turn count if you also rerun retrieval each time.

### Retry loops

A tool call fails, the agent retries with a slightly different prompt, the retry includes the previous failed attempt as context. One stuck loop can spend a meaningful fraction of a dollar in a minute. Across a fleet of users, this is the failure mode that shows up on the bill before it shows up in the logs.

### Reasoning tokens

Thinking-enabled models emit internal reasoning that you pay for but never see. The bill grows in places the logs do not show. If you have not instrumented thinking-token counts separately, you cannot tell whether a regression is from the visible output or the invisible reasoning.

### Streaming over-fetch

The model is told to "explain your reasoning step by step," it dutifully writes a thousand-token explanation, and your UI shows only the final answer. You paid for the prose. Trim the prompt; the model will write less.

## Prompt caching is not optional

For any production app with a stable system prompt, prompt caching cuts input costs by 80-90% on cached turns. This is not a minor optimization. It is the difference between a feature that is viable and one that is not.

The discipline is to structure your prompts so the stable parts come first — system instructions, tools, retrieved corpus chunks if they are stable — and the dynamic parts (current user message, fresh retrieval) come last. Then mark cache breakpoints explicitly.

Teams that skip this pay 5-10x more than teams that do not, for the same product. The provider's documentation makes this look like a tuning knob; in practice it is a structural choice that needs to be made early.

## Model selection as a runtime decision

The most over-spent dollars in LLM apps come from using the strongest model for every request when only some requests need it. A router that classifies the request and sends easy ones to a smaller, cheaper model captures a large fraction of the cost savings with a small fraction of the user-visible quality cost.

The classifier itself can be the smaller model, or a deterministic heuristic. The point is that the choice happens per request, not per feature.

## Observability is the foundation

You cannot optimize what you do not measure. The minimum observability for a production LLM app is:

- Cost per request, broken down by input, output, and cache
- p50 and p95 latency, by model and endpoint
- Token counts by component (system, retrieved context, user message, tools, output)
- Cache hit rate per route

Without these, every cost optimization is a guess. With them, the next two hours of engineering are obvious.

## The compounding effect

The teams that win on LLM economics are not the ones with the best single optimization. They are the ones who instrumented early, found the three biggest sources of spend, fixed them, and then moved on to the next three. The compounding effect over six months is the difference between a sustainable feature and one that gets killed by the CFO.

Cost is a quality attribute. Engineer it like one.`
  }
];

const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
let createdBy = null;
if (adminEmail) {
  const userResult = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  createdBy = userResult.rows[0]?.id || null;
}

let inserted = 0;
let updated = 0;

for (const post of posts) {
  const existing = await query('SELECT id FROM blog_posts WHERE slug = $1', [post.slug]);
  if (existing.rowCount > 0) {
    await query(
      `UPDATE blog_posts
       SET title = $1, category = $2, author = $3, excerpt = $4, content = $5,
           tags = $6, published = true, updated_at = NOW()
       WHERE slug = $7`,
      [post.title, post.category, post.author, post.excerpt, post.content, post.tags, post.slug]
    );
    updated++;
  } else {
    await query(
      `INSERT INTO blog_posts (slug, title, category, author, excerpt, content, tags, published, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)`,
      [post.slug, post.title, post.category, post.author, post.excerpt, post.content, post.tags, createdBy]
    );
    inserted++;
  }
}

await getPool().end();
console.log(`Seeded AI & ML blog posts: ${inserted} inserted, ${updated} updated.`);
