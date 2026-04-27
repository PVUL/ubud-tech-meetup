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

<div text-align="center">
  <h2>Thank you.</h2><br />
  <h3 color="gray" italic>And now to for main talk...</h3>
</div>


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

Because without a proper approach: 
- Vibe coding can limit the complexity of what you can build
- You'll likely spend more time and tokens re-iterating
- It becomes easy to lose focus of original intent


---
layout: center
---

## So how can we apply concepts from **_engineering_**?

<!-- 
* Building with AI using an engineering mindset
* Structured, not reactive
* Focused on systems that last -->

<!-- 
- It's using the approach of vibe coding, but with a systematic engineering approach.
- Why? 
  - (1) it allows you to have better consistency over the quality of outputs. 
  - (2) it allows you to build more complex systems.

- STEPS
  - Clarify the specs
    - research (libraries, frameworks, etc)
    - design (UI, UX, architecture, etc)
    - create a clear prompt
  - Verify the implementation plan
    - implement
    - test
  - Add documentation
    - this provides context for future development (human or non-human) -->

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

<!-- # What can do better. (the shift) -->

<!-- we're in a mad dash to finish quickly because it feels good. but when it's not done right, we actually spend more time fixing it. -->

_The approach._

## "Measure twice, cut once"


---

# Vibe Engineering Workflow

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

---

# workflow overview: clarify spec

---

# workflow overview: plan

---

# workflow overview: implement

---

# workflow overview: debug

---

# workflow overview: document

---

# Here's my project (real world example)

## Aspire.you

- general overview of the project
  - why
  - what is the stack

---

# Demo time

(next 3-4 slides for walk thru of how it was built)

---

# if i vibe coded this without specs

(show screenshot of prompt)


---

# Result

This allows for more complexity to be added overtime.

- system is understandable
- debugging is faster

For example:
- some things I intend to add: x, y, z


---

# Summary (principles)

## takeaways

1. Clarify the specs for planning
2. Review the implementation
  - reading the code and testing thoroughly
3. Document your work


---
layout: center
class: text-center
title: closing
---

## “Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.” 
-Antoine de Saint-Exupéry



<br /><br /><br />
---
layout: cover
---

### Thank you.

<br />

## Questions?

---
src: ../about-meetup.md#1 # Logo
---