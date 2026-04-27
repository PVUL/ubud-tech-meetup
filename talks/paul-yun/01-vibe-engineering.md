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
src: ../about-meetup.md#2-5
---

---
class: px-20
layout: center
title: Thank you
---

<h2>Thank you.</h2><br />
<h3 color="gray" italic>And now to for main talk...</h3>

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

Because with an engineering mindset:

<div v-click.fade-in class="slidev-vclick-target slidev-vclick-hidden text-2xl">
  
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

- 1. Plan
  - 1.1 Clarify the spec
  - 1.2 Create plan

<br />

- 2. Implement
  - 2.1 Implementation tasks
  - 2.2 Debug

<br />

- 3. Review
  - 3.1 Test
  - 3.2 Document

::right::

<div v-click.fade-in class="slidev-vclick-target slidev-vclick-hidden">
  <h1>II. Process Improvement</h1>
  <ul>
    <li>
      A. Artifact Curation
    </li>
    <ul class="ml-5">
      <li>
        A.1 Specs, Docs, Opportunities, Decicisions, etc.
      </li>
    </ul>
    <br />
    <li>
      B. Agentic Skills
    </li>
        <ul class="ml-5">
      <li>
        B.1 Workflow Optimization
      </li>
      <li>
        B.2 Consistent Opportunities Discovery
      </li>
    </ul>
  </ul>
</div>

---

# Workflow: Plan

---

# Workflow: Implement

---

# Workflow: Review

---

# Process Improvement: Artifact Curation

---

# Process Improvement: Agentic Skills

---

# Here's my project (real world example)

## Aspire.you

- general overview of the project
  - why

(screenshot)

---

# Demo time

(next 2-3 slides for walk thru of how it was built)

(and the opportunities I discovered using agentic skills + artifacts + agent skills updates)

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
<h2>1. Clarify specs for planning.</h2><br />
<h2>2. Think in systems for process improvement.</h2>

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