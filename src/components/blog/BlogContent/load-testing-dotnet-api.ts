export const loadTestingDotnetApisMarkdown = `
# Load Testing .NET APIs with Grafana K6

How I use k6 to understand API performance, catch regressions early, and keep systems reliable for real users.
---

## Why I Stopped Trusting “It Works on My Machine”

I used to be happy when my .NET API returned \`200 OK\` and my unit tests were all green.  
Then traffic hit production, latency spiked, and suddenly “it works locally” wasn’t good enough.

- A small deployment would double average response times.
- A new query would quietly introduce an N+1 problem.
- A “simple” feature would push CPU to 90% under moderate load.

I needed a way to **rehearse production traffic before it actually happened**, not just hope my API would cope. That’s where k6 and Grafana came in.
---

## The Stack: .NET, Grafana K6

At a high level, the workflow looks like this:

- **ASP.NET Core / .NET API**: The system under test.
- **k6**: The load test runner with a JavaScript scripting model. You write tests as JS files that define virtual user behavior, load patterns, and thresholds.
- **Grafana**: The observability layer, giving dashboards for latency, throughput, errors, and resource usage.

You can run k6 locally, in CI, or in the cloud, and push metrics into backends like InfluxDB, Prometheus, or Grafana Cloud to visualize them.
---

## What k6 Brings to .NET APIs

k6 sits in a nice middle ground:

- **Developer-friendly**: Tests are JavaScript files you can keep next to your .NET solution.
- **Scenario-driven**: You can simulate constant, ramping, spike, and long-running traffic.
- **Metrics-first**: Built-in metrics like \`http_req_duration\`, \`http_reqs\`, and \`http_req_failed\` plus custom metrics and thresholds.
- **Integrations**: Works with Grafana, InfluxDB, Prometheus, and more for long-term storage and visualization.
- **Lightweight**: Runs on your laptop or CI without special infra.
- **CI/CD friendly**: You can fail pipelines when performance thresholds are breached.

This matters for .NET APIs because the performance story often depends on:

- Middleware ordering
- EF Core query shapes
- Async I/O handling
- Caching layers
- Pooling (connections, HttpClient, etc.)
- Thread pool behavior under load

k6 exposes how these decisions behave under real load, not just in micro-benchmarks.
---

## Setup and Requirements

| Item               | What you need                                                           | Why you need it                             |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------------- |
| .NET API           | A .NET API running locally, e.g. ASP.NET Core on \`https://localhost:5001\`. | This is the API you will load test.         |
| k6                 | k6 installed on your machine or running via Docker.                    | This runs the load tests.                   |
| Basic JS skills    | Ability to read and edit simple JavaScript.                            | k6 scripts are written in JavaScript.       |
| Grafana (optional) | Grafana Cloud, or Grafana + InfluxDB/Prometheus.                       | To see graphs for latency, RPS, and errors. |
| Telemetry (optional) | Logs, metrics, and traces (e.g. App Insights, Prometheus, Loki/Tempo). | To see what happens inside the .NET app.    |
| Traffic + goals    | Rough idea of peak traffic and targets (e.g. “95% < 400 ms, <1% errors”). | To design useful tests and thresholds.      |
---

## A Simple k6 Test for a .NET API

Let’s say we have an ASP.NET Core API endpoint:

\`\`\`csharp
// GET /api/products
[HttpGet]
public async Task<IActionResult> GetProducts()
{
    var products = await _db.Products
        .AsNoTracking()
        .OrderBy(p => p.Id)
        .Take(50)
        .ToListAsync();

    return Ok(products);
}
\`\`\`

We want to know: **Can this handle 100 virtual users for 5 minutes without blowing up latency or error rates?**

A minimal k6 script:

\`\`\`js
// load-test-products.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 100,
  duration: "5m",
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests under 500ms
    http_req_failed: ["rate<0.01"],   // <1% errors allowed
  },
};

export default function () {
  const res = http.get("https://localhost:5001/api/products");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has body": (r) => r.body && r.body.length > 0,
  });

  // small think time
  sleep(0.5);
}
\`\`\`

Run it with:

\`\`\`bash
k6 run load-test-products.js
\`\`\`

k6 prints a text summary with percentiles, averages, errors, and threshold results at the end of the run.
---

## How to Read the k6 Output

After the test, k6 shows an “end-of-test summary” in the terminal. A very simplified example looks like this:

\`\`\`text
✓ http_req_duration.....: avg=210ms  p(90)=320ms  p(95)=410ms  p(99)=900ms
✓ http_req_failed.......: 0.50%      50 out of 10,000
✓ checks................: 99.50%     9,950 out of 10,000
  http_reqs.............: 10,000     330.12/s
  vus...................: 100        min=100 max=100
\`\`\`

Here is how to read it in plain terms:

- **http_req_duration**: How long requests took.
  - \`avg\`: Simple average. Can hide spikes.
  - \`p(90)\`, \`p(95)\`, \`p(99)\`: Percentiles. \`p(95)=410ms\` means 95% of requests finished in 410 ms or less. Focus on p95 or p99, not only avg.
- **http_req_failed**: Error rate. Here 0.5% of all HTTP requests failed. You want this under your error budget (for example <1%).
- **checks**: Your JS \`check()\` calls. If this is less than 100%, some responses didn’t match what you expect (wrong status code, empty body, etc.).
- **http_reqs**: Total number of requests and roughly how many per second (RPS).
- **vus**: How many virtual users were active.

If you defined \`thresholds\`, k6 will show which ones passed or failed, for example:

\`\`\`text
█ THRESHOLDS
  http_req_duration......: ✓ p(95)<500  p(95)=410ms
  http_req_failed........: ✗ rate<0.01  rate=0.5%
\`\`\`

In my own runs, I treat:

- **All thresholds green** as “build is good”.
- **Any red threshold** as “don’t ship, find the bottleneck first”.
---

## Designing Load Tests Around SLOs, Not Just “Traffic”

One of the biggest mindset shifts for me was to stop thinking about tests as “throw X users at it,” and instead to think about **Service Level Objectives (SLOs)**.

> SLO in one minute  
> An **SLO (Service Level Objective)** is a clear performance target for your system.  
> Metric: what you measure (for example, latency, error rate, uptime).  
> Target: the goal (for example, “95% of requests under 400 ms”, or “error rate < 1%”).  
> Time window: how long you measure it over (for example, per day or per month).  
Some example SLOs for a .NET API:

- 95% of product requests must complete < 400 ms.
- Error rate must stay below 1%.
- The system should recover after a short spike without a long latency tail.

k6 makes this concrete via \`thresholds\`:

\`\`\`js
export const options = {
  scenarios: {
    steady_traffic: {
      executor: "constant-vus",
      vus: 50,
      duration: "10m",
    },
    spike_traffic: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m",  target: 200 },
        { duration: "30s", target: 200 },
        { duration: "1m",  target: 0 },
      ],
      startTime: "2m",
    },
  },
  thresholds: {
    http_req_duration: ["avg<300", "p(90)<500", "p(99)<1500"],
    http_req_failed: [
      "rate<0.01",
      {
        threshold: "rate<0.2",
        abortOnFail: true,
        delayAbortEval: "30s",
      },
    ],
    checks: ["rate>0.98"],
  },
};
\`\`\`

This style of test will **fail your pipeline** (or at least shout at you) if new code breaks your latency or error budgets.
---

## Common Load Test Types with k6

Different test types answer different questions:

- **Smoke test**: Very small, very short. Checks that the script works and the API does not explode right away.
- **Load test**: Simulates normal or peak traffic for a while. Main question: “Do we meet our SLOs at expected load?”
- **Stress test**: Pushes traffic beyond normal peaks. Main question: “Where does it break, and how does it fail?”
- **Spike test**: Jumps quickly from low to very high traffic. Main question: “Can we handle sudden spikes (e.g. campaigns)?”
- **Soak test**: Runs for hours at modest load. Main question: “Do we have memory leaks or slow resource leaks?”

Once you know what question you are asking, you can pick the right executor and test length in k6.
---

## Wiring k6 Metrics into Grafana

Running k6 locally is nice, but for anything serious you want metrics in a time-series backend with dashboards.

A common self-hosted flow is:

1. Run InfluxDB or Prometheus.
2. Point k6 to that backend.
3. Build or reuse a Grafana dashboard.

For InfluxDB, you can configure k6 like:

\`\`\`bash
k6 run \\
  -o influxdb=http://localhost:8086/k6 \\
  load-test-products.js
\`\`\`

In Grafana:

- Add InfluxDB as a data source.
- Import the official **k6 dashboard** (ID \`16072\`) or a similar community one.
- Watch panels like:
  - \`http_req_duration\` (heatmap + percentiles)
  - \`http_reqs\` (RPS)
  - \`vus\` (virtual users over time)
  - Error rates and custom metrics.

Seeing latency over time aligned with VUs and errors often reveals the real cause: slow DB, thread pool starvation, or a hot endpoint.
---

## Observability: Connecting k6 with .NET Telemetry

k6 gives you external metrics. Your .NET app should give you internal signals:

- **ASP.NET Core logging + structured logs**
- **OpenTelemetry** for traces and metrics
- **Application Insights, Prometheus, Grafana Loki/Tempo** for storage and querying.

A nice workflow:

1. Trigger a k6 scenario.
2. Watch the k6 / Grafana dashboards (RPS, latency, errors).
3. Correlate that with:
   - API traces (which endpoints and spans are slow).
   - DB metrics (slow queries, high lock waits).
   - CPU and memory graphs.

This turns “the API feels slow under load” into something like “\`GET /api/products\` is blocked on a specific EF Core query when we go past 80 VUs.”
---

## Building Realistic Scenarios with k6

Real users don’t hammer one endpoint in isolation. A more realistic flow might:

- Log in
- Fetch a list
- Retrieve details
- Post an action
- Occasionally call a slow reporting endpoint

In k6 you can model this as a simple “user journey”:

\`\`\`js
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "https://localhost:5001";

export const options = {
  vus: 50,
  duration: "10m",
  thresholds: {
    http_req_duration: ["p(95)<600"],
  },
};

export default function () {
  // 1. Login
  const loginRes = http.post(\`\${BASE_URL}/api/auth/login\`, {
    username: "load_user",
    password: "P@ssw0rd!",
  });

  check(loginRes, {
    "login ok": (r) => r.status === 200,
  });

  const token = loginRes.json("token");

  const params = {
    headers: {
      Authorization: \`Bearer \${token}\`,
    },
  };

  // 2. Fetch list
  const listRes = http.get(\`\${BASE_URL}/api/products\`, params);
  check(listRes, { "products ok": (r) => r.status === 200 });

  sleep(0.5);

  // 3. Fetch details for one product
  const products = listRes.json();
  const first = Array.isArray(products) ? products[0] : undefined;
  const id = first?.id;

  if (id) {
    const detailRes = http.get(\`\${BASE_URL}/api/products/\${id}\`, params);
    check(detailRes, { "details ok": (r) => r.status === 200 });
  }

  sleep(0.5);
}
\`\`\`

This gives you a feel for whole flows, not just single endpoints.
---

## Troubleshooting .NET Bottlenecks with Load Tests

When a test fails or a Grafana graph looks bad, I try to name the bottleneck and then dig in with .NET tools.

- **High latency, low CPU**: Usually I/O-bound issues like slow DB queries, missing indexes, chatty HTTP calls, or lock contention. Fixes often live in EF Core queries, caching, or how you talk to downstream services.
- **High CPU, high latency**: Look for heavy JSON serialization, big LINQ work in memory, or expensive per-request logic that should be cached or moved off the hot path.
- **Thread pool starvation**: Symptoms are growing queues and worse latency even at modest load. Common causes: blocking calls inside async code (sync-over-async), long sync work on request threads, or too many tasks waiting on the same resource.
- **Memory / resource leaks**: Soak tests reveal steadily rising memory, connection counts, or handles. This often traces back to misused HttpClient, DbContext lifetime issues, or not disposing resources.

In practice, I run a failing k6 scenario, capture traces or counters, fix one thing, and re-run until the same test passes with margin.
---

## Lessons Learned Load Testing .NET APIs

Over time, a few patterns kept coming up.

### 1. Minimal APIs vs Controllers

Minimal APIs in ASP.NET Core tend to have slightly less overhead than full MVC controllers under high load, especially for simple JSON endpoints.  
k6 made the difference visible when I tested both skeletons under the same conditions.

### 2. EF Core Queries Matter More Than You Think

Under load, naive queries hurt:

- Missing indexes
- Heavy \`.Include()\` chains
- Large payloads with no pagination

k6 surfaced this when p95 latency spiked on list endpoints while others stayed fine. Fixing the queries often helped more than tuning Kestrel.

### 3. Caching is a Load Test’s Best Friend

Adding:

- Response caching
- In-memory or distributed cache for common reads
- Short-term caching for “expensive but stable” work

turned failing thresholds into passing ones without touching business logic. Grafana graphs went from “noisy and jagged” to “flat and boring”, which is what you want.

### 4. High RPS is Useless Without SLOs

Chasing raw RPS is a trap. A better question:

> Can we keep p95 under 400 ms, with <1% errors, at our expected peak traffic?

k6 thresholds let you encode that straight into tests so you get a simple pass/fail in CI.
---

## Integrating k6 into Your .NET CI/CD Pipeline

The last step is to make load testing repeatable and automated:

1. **Keep scripts in your repo** alongside your .NET solution, e.g. \`tests/load/load-test-products.js\`.
2. **Run k6 in CI** after integration tests, but before production deploy.
3. **Fail the pipeline** when thresholds are breached.

Example GitHub Actions step (pseudo):

\`\`\`yaml
- name: Run k6 load test
  uses: grafana/k6-action@v0.3.0
  with:
    filename: tests/load/load-test-products.js
\`\`\`

If thresholds fail, the action fails and your pipeline is blocked until performance is back in line with your SLOs.
---

## Getting Started Yourself

If you want to try this on your own .NET API:

1. **Install k6** (or use Docker).
2. Start with a tiny script hitting a single endpoint.
3. Add **checks** so failures are explicit.
4. Add **thresholds** that match your SLOs.
5. Integrate with **Grafana** for dashboards.
6. Iterate:
   - Find bottlenecks.
   - Fix them in .NET.
   - Re-run tests.

You don’t need a perfect test suite on day one. One useful test that runs on every PR already buys you a lot of confidence.
---

## Closing Thoughts

Load testing isn’t about proving that your .NET API is “perfect.” It’s about getting early, honest feedback on how it behaves when real users lean on it.

k6 gives you a scriptable, developer-friendly way to apply pressure.  
Grafana gives you the eyes to see what’s going on.  
Together, they turn performance from a late-night firefight into a normal part of your development cycle.
`;