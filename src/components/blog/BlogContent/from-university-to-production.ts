export const fromUniversityToProductionMarkdown = `
# From University Projects to Production Systems

Reflections on the shift from assignments and capstones to long‑lived systems that customers depend on every day.

---

## The First Time “Good Enough” Wasn’t

At university, “done” usually meant:

- It compiles.
- It passes the marking scheme tests.
- You can demo it in a lab without it crashing.

The first time I shipped something that **real people** used every day, those rules broke instantly.

Suddenly it wasn’t enough that my code worked on my laptop at 2 a.m. on a Thursday. It had to behave:

- Under traffic spikes.
- When a dependency was slow or down.
- When someone used it in a way I didn’t expect.
- At 3 a.m. on a Sunday when no lecturer was watching, but an incident channel absolutely was.

That was my real transition: from “does it work?” to “does it keep working?”

---

## University Projects vs Production Systems

The contrast is bigger than it looks on paper.

| Aspect                    | University Projects                              | Production Systems                                          |
|---------------------------|--------------------------------------------------|-------------------------------------------------------------|
| Time horizon             | Weeks or a single semester                       | Years, sometimes a decade                                   |
| Main goal                | Demonstrate understanding, get a grade          | Deliver value, keep SLAs/SLOs, control risk                |
| Code ownership           | Small project group                              | Multiple teams over time                                    |
| Users                    | Lecturer, maybe classmates                       | Paying customers, internal teams, automated clients        |
| Failure impact           | Lost marks                                       | Lost revenue, trust, and sleep                              |
| Feedback loop            | Assignment feedback                              | Monitoring, alerts, tickets, angry Slack messages          |

In class, you generally optimize for **clarity for the marker**.  
In production, you optimize for **change over time**: can someone who joins six months from now safely evolve this system?

---

## Requirements That Don’t Fit on a Coursework PDF

Coursework normally gives you one requirements document. In real life you juggle many, and they change constantly:

- Product wants new features.
- Security wants certain controls.
- Ops wants stability and observability.
- Customers want lower latency and fewer bugs.
- Finance wants lower infrastructure cost.

And those requirements are often **implicit**:

- “It must be fast” means “p95 latency < 400 ms” once you translate it to an SLO.
- “It must scale” means “it should survive X requests per second without falling over.”
- “It must be secure” means “it passes specific checks, audits, and threat models.”

At university, non‑functional requirements are usually a paragraph on the last page.  
In production, they are often the **difference between success and failure**.

---

## Coding Alone vs Coding in a System

Most university projects are self‑contained:

- One repository.
- One database.
- Maybe one frontend and one backend.

In production, your service is part of an ecosystem:

- It calls other APIs.
- It depends on queues, caches, and databases.
- Other services depend on you.

That changes how you think:

- You care about **backwards compatibility**.
- You add **feature flags** to change behaviour safely.
- You design for **degradation**: what happens if a dependency is slow or down?

You stop asking only “does my function return the right result?” and start asking “what does this do to the rest of the system?”

---

## Tests: From “Does It Work?” to “Will It Break Later?”

At university, tests are usually about correctness:

- Unit tests for algorithms.
- Maybe an integration test or two.

In production, tests are about **regression, safety, and confidence**:

- Unit tests still matter.
- Integration tests validate wiring.
- Contract tests protect consumers and providers.
- End‑to‑end tests simulate real flows.
- Load tests show how it behaves under pressure.
- Smoke tests run after deploy to confirm basic health.

You’re no longer only checking “is the output correct?” but “can I change this feature without breaking five others?” and “can the system handle real traffic?” [web:72][web:120][web:122]

---

## Time Management: Deadlines vs Continuous Delivery

In university, time is shaped by:

- Assignment deadlines.
- Exam dates.
- Group project milestones.

In a production team:

- Work is continuous.
- Releases are frequent (ideally small and often).
- You balance feature work, tech debt, bugs, and maintenance.

You learn that:

- **Done** includes monitoring, documentation, and rollback plans.
- **Small frequent changes** are safer than big, rare ones.
- **Stability** is a feature, not an afterthought.

Shipping becomes a **habit**, not a final sprint before hand‑in day.

---

## Tooling: From IDE to Ecosystem

Uni projects often revolve around:

- An IDE (VS Code, IntelliJ, Visual Studio).
- A framework or two.
- Git, sometimes lightly.

In production, tooling is an ecosystem:

- **Version control & code review**: Git, pull requests, branch policies.
- **CI/CD**: automated builds, tests, deployments.
- **Observability**: logs, metrics, traces, dashboards.
- **Automation**: scripts, pipelines, infrastructure‑as‑code.
- **Performance tooling**: load test tools, profilers, APM. [web:74][web:120]

It’s less about knowing one tool perfectly and more about knowing **how they work together**.

---

## The Mindset Shift That Really Matters

For me, the biggest change wasn’t about frameworks or tools. It was about **responsibility**:

- At university, I was responsible for **my grade**.
- In production, I’m responsible for **users and teammates**.

That shift shows up in small decisions:

- I don’t “just push to main” anymore.
- I add logs for future me (or someone else) to debug issues.
- I think about **failure modes** before they happen.
- I ask “how will we know if this breaks?” as part of design.

The code might look similar, but the mindset is **completely different**.

---

## How to Prepare While You’re Still in University

If you’re still in that transition zone, there are things you can do now to make the jump smoother:

- Treat at least one project like a **real product**:
  - Use proper Git branching and pull requests.
  - Set up CI (lint, tests, build).
  - Add simple monitoring (logs, metrics, health endpoints).
- Practice **reading** other people’s code, not just writing your own.
- Learn how to **debug in production‑like scenarios**:
  - How do you trace a bug when you can’t step through everything locally?
- Build something that lives longer than one semester:
  - A personal project you maintain for a year.
  - A small API or tool that you actually use.

You don’t need to simulate a full enterprise. Just pick one project and treat it with production habits.

---

## Looking Back: What I Wish I’d Known

If I could go back and talk to my university‑era self, I’d say:

- **You’re not “just a student.”** The habits you build now will follow you into your first job.
- Learn to **write code for other humans**, not just markers.
- Get comfortable with:
  - Tests
  - Logs
  - Monitoring
  - Deployments
- Don’t be afraid of “boring” topics like error handling or configuration.  
  In production, those are the parts that keep systems alive.

Most importantly: **it’s okay if you don’t feel “ready.”**  
No one ever feels fully ready the first time their code supports real users. You learn by doing, by breaking things (safely), and by improving them the next time.

That’s the real difference between university projects and production systems:  
it’s not just that they run longer — it’s that you keep learning alongside them.
`;