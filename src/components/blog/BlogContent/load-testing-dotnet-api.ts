// src/blog/BlogContent/load-testing-dotnet-apis.ts

export const loadTestingDotnetApisMarkdown = `
# Load Testing .NET APIs with k6 and Grafana

How I use k6 and Grafana to understand API performance, catch regressions early, and keep systems reliable for real users.

---

## Why I Stopped Trusting “It Works on My Machine”

I used to be happy when my .NET API returned \`200 OK\` and my unit tests were all green.  
Then traffic hit production, latency spiked, and suddenly “it works locally” wasn’t good enough.

- A small deployment would double average response times.
- A new query would quietly introduce an N+1 problem.
- A “simple” feature would push CPU to 90% under moderate load.

I needed a way to **rehearse production traffic before it actually happened**, not just hope my API would cope. That’s where k6 and Grafana came in.

---

## The Stack: .NET, k6, and Grafana

At a high level, the workflow looks like this:

- **ASP.NET Core / .NET API**: The system under test.
- **k6**: The load test runner written in Go with a JavaScript scripting model.
- **Grafana**: The observability layer, giving me dashboards for latency, throughput, errors, and resource usage.

You can run k6 locally, in CI, or in the cloud, and push metrics into backends like InfluxDB, Prometheus, or Grafana Cloud to visualize them.

---

## What k6 Brings to .NET APIs

k6 sits in a sweet spot:

- **Developer-friendly**: Tests are JavaScript files you can keep next to your .NET solution.
- **Scenario-driven**: You can simulate constant, ramping, or spike traffic with different executors.
- **Metrics-first**: Built-in metrics like \`http_req_duration\`, \`http_reqs\`, and \`http_req_failed\` plus custom metrics and thresholds.

This matters for .NET APIs because the performance story often depends on:

- Middleware ordering
- EF Core query shapes
- Async I/O handling
- Caching layers
- Pooling (connections, HttpClient, etc.)

k6 exposes how these decisions behave under real load, not just in micro-benchmarks.

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

k6 prints a summary with p95 duration, average latency, and success rates. That’s often enough to catch low-hanging bottlenecks early.

---

## Designing Load Tests Around SLOs, Not Just “Traffic”

One of the biggest mindset shifts for me was to stop thinking about tests as “throw X users at it,” and instead to think about **Service Level Objectives (SLOs)**:

- 95% of product requests must complete < 400 ms.
- Error rate must stay below 1%.
- The system should recover after a short spike without a prolonged latency tail.

k6 makes this concrete via \`thresholds\`. For example:

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
        { duration: "1m", target: 200 },
        { duration: "30s", target: 200 },
        { duration: "1m", target: 0 },
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

This style of test will **fail your pipeline** (or at least scream at you) if new code violates your latency or error budgets.

---

## Wiring k6 Metrics into Grafana

Running k6 locally is nice, but for anything serious, you want the metrics persisted and visualized. There are several options: InfluxDB + Grafana, Prometheus + Grafana, or Grafana Cloud’s built-in support.

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
- Watch metrics like:
  - \`http_req_duration\` (as a heatmap + percentiles)
  - \`http_reqs\` (requests per second)
  - \`vus\` (virtual users over time)
  - Error rates and custom metrics.

Seeing latency over time aligned with spikes in VUs and errors is often what reveals the **real root cause**: slow downstream dependencies, thread pool starvation, or database hotspots.

---

## Observability: Connecting k6 with .NET Telemetry

k6 gives you external metrics. Your .NET app should provide internal ones:

- **ASP.NET Core logging + structured logs**
- **OpenTelemetry** for traces and metrics
- **Application Insights, Prometheus, or Grafana Loki/Tempo** for storage and queries

A powerful pattern:

1. Trigger a k6 load scenario.
2. Watch the **k6 dashboards** (RPS, latency, errors).
3. Correlate with:
   - API traces (see which endpoints and spans are slow).
   - DB metrics (slow queries, high lock wait times).
   - CPU/memory graphs.

This combo turns a vague “the API feels slow under load” into “the \`GET /api/products\` endpoint is blocked on a specific EF Core query when concurrency passes 80 VUs.”

---

## Building Realistic Scenarios with k6

Real traffic is rarely a single endpoint hammered in isolation. A more realistic test might:

- Log in
- Fetch a list
- Retrieve details
- Post an action
- Occasionally hit a slow reporting endpoint

In k6 you can model this as a “user journey”:

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

This gives you a feel for **whole flows**, not just endpoints in isolation. It’s closer to the way users actually stress your system.

---

## Lessons Learned Load Testing .NET APIs

Over time, a few patterns kept coming up.

### 1. Minimal APIs vs Controllers

Minimal APIs in ASP.NET Core tend to have slightly less overhead than full MVC controllers under high load, especially for simple JSON endpoints.  
k6 made the difference visible when I tested both skeletons under the same conditions.

### 2. EF Core Queries Matter More Than You Think

Under load, naive queries tank performance:

- Missing indexes
- Using \`.Include()\` chains unnecessarily
- Large payloads with no pagination

k6 surfaced this when p95 latency spiked during list endpoints while other endpoints stayed fine. Fixing the queries often made a bigger difference than tweaking Kestrel settings.

### 3. Caching is a Load Test’s Best Friend

Adding:

- Response caching
- In-memory or distributed cache for common reads
- Short-term caching for “expensive but stable” computations

turned failing thresholds into passing ones without touching business logic. k6 graphs went from “sawtooth” to “flat and boring” (which is what you want in production).

### 4. High RPS is Useless Without SLOs

Chasing raw RPS is a trap. A more meaningful question is:

> Can we keep p95 under 400 ms, with <1% errors, at our expected peak traffic?

k6 thresholds let you encode that directly into tests, so you can get a simple **pass/fail** signal in CI.

---

## Integrating k6 into Your .NET CI/CD Pipeline

The final step is making load testing **repeatable and automated**:

1. **Keep scripts in your repo** alongside your .NET solution, e.g. \`tests/load/load-test-products.js\`.
2. **Run k6 in CI** after integration tests, but before deployment to production.
3. **Fail the pipeline** when thresholds are breached.

Example GitHub Actions step (pseudo):

\`\`\`yaml
- name: Run k6 load test
  uses: grafana/k6-action@v0.3.0
  with:
    filename: tests/load/load-test-products.js
\`\`\`

If the thresholds fail, the action fails, and your pipeline is blocked until performance is fixed. It’s a simple way to encode performance expectations as **tests**, not tribal knowledge.

---

## Getting Started Yourself

If you want to try this on your own .NET API:

1. **Install k6** (or use Docker).
2. Start with a tiny script hitting a single endpoint.
3. Add **checks** so failures are explicit.
4. Add **thresholds** that reflect your SLOs.
5. Integrate with **Grafana** for dashboards.
6. Iterate:
   - Find bottlenecks.
   - Fix them in .NET.
   - Re-run tests.

You don’t need a perfect test suite on day one. A single useful test that runs on every PR is already a huge step up in confidence.

---

## Closing Thoughts

Load testing isn’t about proving that your .NET API is “perfect.” It’s about getting **early, honest feedback** on how it behaves when real users start leaning on it.

k6 gives you a scriptable, developer-friendly way to apply pressure.  
Grafana gives you the eyes to actually see what’s going on.  
Together, they turn performance from a late-night firefight into a routine part of your development cycle.

If you ship APIs for a living, investing a bit of time in this setup pays back every time you deploy without that sinking “I hope this doesn’t melt prod” feeling.
`;