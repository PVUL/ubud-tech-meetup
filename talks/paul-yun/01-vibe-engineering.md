---
theme: seriph
background: https://cdn.jsdelivr.net/gh/slidevjs/slidev-covers@main/static/4Zfx5NRt8pM.webp
class: "text-center"
info: |
  ## Vibe Engineering
  Vibe code like an engineer by Paul Yun
transition: slide-left
title: Vibe Engineering
date: 2026-04-28
---

<script setup lang="ts">
import Timer from '../../components/Timer.vue'
import Logo from '../../components/Logo.vue'
</script>

<div class="abs-tr m-6">
  <Timer title="Networking" />
</div>

<Logo />

## _Welcome to our 2nd meetup!_
|     |                        |
|----:|:-----------------------|
|6:00 | Networking + Food      |
|6:45 | About Ubud Tech Meetup |
|7:00 | Tech Talk              |
|7:30 | Networking             |

<div class="mt-12">
  <i>— Sponsored by Nhost —</i>
</div>

<style>
h2 {
  color: lightgrey;
}

table {
  width: 17rem;
  margin: 0 auto;
}
</style>

---
layout: cover
---

## Thanks to our sponsor Nhost 🍕

### https://nhost.io


---
src: ../about-meetup.md#2-5
---

---
class: px-20
layout: center
title: Now for the main talk
---

<h2 color="gray" italic>And now to for main talk...</h2>

---
layout: cover
background: https://cdn.jsdelivr.net/gh/slidevjs/slidev-covers@main/static/ahX1sknMGhg.webp 
title: "Tech Talk: Vibe Engineering"
---

<h1>Vibe Engineering</h1>
<h2>Beyond Vibe Coding</h2>

<br />

<p italic>
  Paul Yun — April 28, 2026
</p>


---
layout: two-cols
title: About Me
---


<h2 class="ml-17">Hi, I'm Paul Yun.</h2><br /><br />
<img class="m-auto" src="/assets/01-vibe-engineering-1.JPG" width="300"><br />

::right::

<br /><br /><br />

- Software Engineer for 10 years at Wayfair, Almanac, Kaiber
- Taught at UCLA, edX Bootcamps, Nucamp
- From Philadelphia + I love skateboarding 🛹

<script setup lang="ts">
import SocialHandle from '../../components/SocialHandle.vue'
</script>

<br /><br />
<SocialHandle type="linkedin" url="linkedin.com/in/yunpaul" />
<SocialHandle type="github" url="github.com/PVUL" />

---
layout: center
transition: fade-out
---

# Goal of this talk

## _Shift your approach on vibe coding projects_

---
layout: center
transition: fade-out
---

# Why?

<p v-click.fade-in class="slidev-vclick-target slidev-vclick-hidden text-2xl">
  Because with an engineering mindset:
</p>

<div v-after class="slidev-vclick-target slidev-vclick-hidden text-2xl delay-700 duration-700">
  
  - You can build more complex projects

</div>

<div v-click.fade-in class="slidev-vclick-target slidev-vclick-hidden text-2xl">

  - Systematize your process

</div>

---
layout: center
---

## So how can we start **_engineering_**?

---

# Mental Model Shift

<div class="h-100 w-full px-10 mt-12 flex flex-col transition-all duration-700">
  <!-- Before Section -->
  <div class="before-row flex items-center gap-8 flex-1 transition-all duration-700 min-h-0">
    <div class="w-32 text-xs font-medium uppercase tracking-[0.2em] opacity-40 text-right leading-tight">
      Traditional <br /> + Vibe Coding
    </div>
    <div class="flex-1 h-full flex rounded-xl overflow-hidden border border-slate-300 bg-slate-50 shadow-sm">
      <div class="flex items-center justify-center bg-slate-700 text-white border-r border-white/10" style="width: 12%">
        <span class="text-[9px] uppercase tracking-[0.2em]">Planning</span>
      </div>
      <div class="flex items-center justify-center bg-slate-500 text-white border-r border-white/10" style="width: 78%">
        <span class="text-sm uppercase tracking-[0.3em]">Implementation</span>
      </div>
      <div class="flex items-center justify-center bg-slate-200 text-slate-900" style="width: 10%">
        <span class="text-[9px] uppercase tracking-[0.2em]">Review</span>
      </div>
    </div>
  </div>

  <!-- After Section -->
  <div v-click class="after-row flex items-center gap-8 transition-all duration-700 overflow-hidden min-h-0" style="flex: 0; opacity: 0;">
    <div class="w-32 text-xs font-medium uppercase tracking-[0.2em] text-primary text-right leading-tight">
      Vibe <br /> Engineering
    </div>
    <div class="flex-1 h-full flex rounded-xl overflow-hidden border border-slate-300 bg-slate-50 shadow-sm">
      <div class="flex items-center justify-center bg-slate-700 text-white border-r border-white/10" style="width: 40%">
        <span class="text-sm uppercase tracking-[0.2em]">Planning</span>
      </div>
      <div class="flex items-center justify-center bg-slate-500 text-white border-r border-white/10" style="width: 20%">
        <span class="text-[9px] uppercase tracking-[0.2em]">Implementation</span>
      </div>
      <div class="flex items-center justify-center bg-slate-200 text-slate-900" style="width: 40%">
        <span class="text-sm uppercase tracking-[0.2em]">Review</span>
      </div>
    </div>
  </div>
</div>

<style>
.after-row:not(.slidev-vclick-hidden) {
  flex: 1 !important;
  opacity: 1 !important;
  margin-top: 2rem;
}
.before-row:has(~ .after-row:not(.slidev-vclick-hidden)) {
  flex: 1 !important;
}
</style>


---
layout: center
---

_The approach._

## "Measure twice, cut once"

<br /><br />

---
layout: two-cols
---

# I. Workflow

<div :class="{ 'dim-mode': $clicks >= 2 }">
  <ul>
    <li class="bright">1. Plan
      <ul>
        <li class="bright">1.1 Clarify the spec</li>
        <li class="bright">1.2 Create plan</li>
      </ul>
    </li>
  </ul>
  <br />
  <ul>
    <li class="dim">2. Implement
      <ul>
        <li class="dim">2.1 Implementation tasks</li>
        <li class="dim">2.2 Debug</li>
      </ul>
    </li>
  </ul>
  <br />
  <ul>
    <li class="dim">3. Review
      <ul>
        <li class="dim">3.1 Test</li>
        <li class="dim">3.2 Document</li>
      </ul>
    </li>
  </ul>
</div>

<!-- Registers click 2 with Slidev's counter without showing/hiding anything -->
<span v-click="2" style="display:none" />

::right::

<div v-click.fade-in="1" class="slidev-vclick-target slidev-vclick-hidden">
  <h1>II. Process Improvement</h1>
  <div :class="{ 'dim-mode': $clicks >= 2 }">
    <ul>
      <li class="dim">A. Artifact Curation
        <ul class="ml-5">
          <li class="dim">A.1 Specs, Docs, Opportunities, Decisions, etc.</li>
        </ul>
      </li>
      <br />
      <li class="bright">B. Agentic Skills
        <ul class="ml-5">
          <li class="bright">B.1 Workflow Optimization</li>
          <li class="bright">B.2 Consistent Opportunities Discovery</li>
        </ul>
      </li>
    </ul>
  </div>
</div>

<style>
.dim-mode .dim {
  opacity: 1;
  color: #666;
  transition: opacity 0.4s ease, color 0.4s ease;
}
.dim-mode .bright {
  opacity: 1;
  transition: opacity 0.4s ease;
}
</style>


---

# Workflow: Plan

<div class="diagram-container">

  <div v-click.hide="1" class="diagram-stage">

```mermaid {theme: 'neutral', scale: 1.4}
flowchart LR
  A([Idea]) --> B[Prompt] --> C([Result?])
  style A fill:#94a3b8,color:#0f172a,stroke:none
  style B fill:#475569,color:#f8fafc,stroke:none
  style C fill:#94a3b8,color:#0f172a,stroke:none
```

  <p class="diagram-caption">The hope: one prompt, done.</p>
  </div>

  <div v-click="1" class="diagram-stage slidev-vclick-target slidev-vclick-hidden">

```mermaid {theme: 'neutral', scale: 0.65}
flowchart LR
  subgraph preProm["1. Pre-Prompt"]
    direction LR
    subgraph sources["Idea Sources"]
      direction TB
      S1["1.1 LLM\nconversations\n(high-level\nideas\n+ summary)"] ~~~ S2["1.2 Own\n+ assisted\nresearch"]
    end
    sources --> RPP["1.3\nRefine\nPrompt"]
  end

  preProm --> SPEC[("2. Spec\nArtifact")]

  subgraph pp["3. Prompt & Plan"]
    direction LR
    PROMPT["3.1\nPrompt"] --> plan
    subgraph plan["Plan"]
      direction TB
      PLAN["3.2\nCreate Plan\nvia IDE / Agent"]
      R["3.3\nReview\n1-2 rounds"]
      PLAN --> R
      R -->|refined| PLAN
    end
  end

  SPEC --> pp
  pp -->PA[("4. Plan\nArtifact")]

  style S1 fill:#334155,color:#f1f5f9,stroke:none
  style S2 fill:#334155,color:#f1f5f9,stroke:none
  style RPP fill:#475569,color:#f8fafc,stroke:none
  style SPEC fill:#0f3460,color:#e0f2fe,stroke:#64748b,stroke-width:2px
  style PROMPT fill:#1e3a5f,color:#e0f2fe,stroke:none
  style PA fill:#334155,color:#f1f5f9,stroke:#64748b,stroke-width:2px
  style sources fill:#f1f5f9,stroke:#cbd5e1,color:#334155
  style preProm fill:#f8fafc,stroke:#94a3b8,color:#1e293b
  style pp fill:#e8f0fe,stroke:#94a3b8,color:#1e293b
```

  <p class="diagram-caption">The improved workflow: sources → spec → plan → review.</p>
  </div>

</div>

<style>
.diagram-container {
  position: relative;
  width: 100%;
  height: 420px;
}
.diagram-stage {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.4s ease;
}
.diagram-caption {
  font-size: 1.2rem;
  opacity: 0.45;
  font-style: italic;
  margin-top: 0.25rem;
  text-align: center;
}
</style>

---
layout: center
---

# Process Improvement: Agentic Skills

<div class="grid grid-cols-2 gap-10 mt-10">
  <div v-click>
    <h3 class="text-primary mb-4 uppercase tracking-widest text-sm font-bold">What?</h3>
    <p class="text-lg leading-relaxed opacity-90">
      <b>Agents with power tools.</b> Reusable, versioned instructions (e.g., <code>SKILL.md</code>) that define specific agent behaviors. 
    </p>
    <p class="text-sm opacity-60 mt-2">
      Moving from <i>ephemeral prompts</i> to <i>modular systems</i>.
    </p>
  </div>
  <div v-click>
    <h3 class="text-primary mb-4 uppercase tracking-widest text-sm font-bold">Why?</h3>
    <ul class="space-y-4 list-none p-0">
      <li class="flex items-start gap-3">
        <div class="mt-3 w-2 h-2 rounded-full bg-primary shrink-0" />
        <div><b>Consistency:</b> Enforce engineering rigor by default.</div>
      </li>
      <li class="flex items-start gap-3">
        <div class="mt-3 w-2 h-2 rounded-full bg-primary shrink-0" />
        <div><b>Scaling:</b> Automate complex architectural reviews.</div>
      </li>
      <li class="flex items-start gap-3">
        <div class="mt-3 w-2 h-2 rounded-full bg-primary shrink-0" />
        <div><b>Evolution:</b> Your process improves as your skills repo grows.</div>
      </li>
    </ul>
  </div>
</div>

<div v-click class="mt-10">
  <div class="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-4 font-bold text-center">Skill Examples:</div>
  <div class="grid grid-cols-3 gap-4">
    <div class="skill-card">
      <div class="skill-card-tab">SKILL.md</div>
      <div class="skill-card-name">clarify-specs</div>
      <div class="skill-card-desc">Stress-test a plan via relentless questioning until shared understanding.</div>
    </div>
    <div class="skill-card">
      <div class="skill-card-tab">SKILL.md</div>
      <div class="skill-card-name">improve-codebase-architecture</div>
      <div class="skill-card-desc">Surface refactor opportunities, guided by ADRs and domain context.</div>
    </div>
    <div class="skill-card">
      <div class="skill-card-tab">SKILL.md</div>
      <div class="skill-card-name">caveman</div>
      <div class="skill-card-desc">Ultra-compressed comms — cuts token usage ~75% while keeping accuracy.</div>
    </div>
  </div>
</div>

<style>
.skill-card {
  position: relative;
  padding: 1rem 1rem 0.9rem;
  border-radius: 0.75rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.skill-card-tab {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #94a3b8;
}
.skill-card-name {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f3460;
  word-break: break-word;
}
.skill-card-desc {
  font-size: 0.7rem;
  line-height: 1.35;
  color: #475569;
}
</style>
---

# My project: `Aspire.You`
<br />

#### _Aspire.You_ is a community platform for user-focused personal growth

<img class="m-auto rounded-2xl mt-12" src="/assets/01-vibe-engineering-2.png" width="700">

---
layout: cover
---

# Demo time

<div class="mt-12">

<span italic>and the opportunities I discovered using: </span>
<br /><br />
<span>- agentic skills</span>
<br />
<span>- artifacts</span>
<br />
<span>- agent skills updates</span>

</div>

---

# Result

Using the engineering approach:

- Can build complex architectures, allowing me to focus on product
- Still not perfect, but I wrestle with AI less now

<br />

<div v-click.fade-in class="slidev-vclick-target slidev-vclick-hidden">

_Next implementations:_

- Zustand (manage UI state) and DrizzleORM (type-safe queries)
- Testing Strategy
- Cloudflare Workers + Durable Objects (sync layer)

</div>

---
layout: center
---

_Takeaways._
<h2>1. Clarify specs for planning</h2><br />
<h2>2. Think in systems for process improvement</h2>

<br /><br />

---
layout: center
class: text-center
title: closing
---

## “Perfection is achieved, 
## not when there is nothing more to add, 
## but when there is **_nothing left_** to take away.” 
<span class="mt-10 italic text-right">Antoine de Saint-Exupéry</span>

---
layout: center
---

#### Thank you.

<br />

## Questions?

<br />

---
src: ../about-meetup.md#1 # Logo
---