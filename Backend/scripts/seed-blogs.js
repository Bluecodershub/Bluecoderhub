import { query, getPool } from '../src/db/pool.js';

const AUTHOR = 'Bluecoderhub Research';
const CATEGORY_AI = 'AI Engineering';
const CATEGORY_DATA = 'Data Engineering';

const posts = [
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
