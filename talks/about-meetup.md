---
# @see https://sli.dev/features/importing-slides#importing-specific-slides  
layout: cover
class: text-center
transition: fade-out
title: Logo
---

<script setup lang="ts">
import Logo from '../components/Logo.vue'
</script>

<div class="-mt-14">
<Logo size=300 />
</div>

---
transition: fade-out
class: text-center
title: About Ubud Tech Meetup
---

<script setup lang="ts">
import Image from '../components/Image.vue'
</script>

## About Ubud Tech Meetup

<br />
<Image src="/photos/2026-04-07.jpg" width="400" />

<div v-click.fade-in class="slidev-vclick-target mt-6 text-xl italic"> 
Why We Exist?
</div>

<div v-click.fade-in class="slidev-vclick-target mt-3 text-3xl"> 
To Share and Educate Community Members-<br /> Devs, Designers + Tech Enthusiasts
</div>

---
transition: slide-up
title: What To Expect From Us
---

# What To Expect From Us

(should ask what the audience expectations of the group is)

<div v-click.fade-in class="slidev-vclick-target slidev-vclick-hidden"> 

- share and educate

</div>

<div v-after class="v-afters">

- networking
- tech talks
- work on community projects together (for learning, fun, and building the community)

</div>

---
layout: default
title: Code of Conduct
---

# Code of conduct

<div v-click.fade-in class="slidev-vclick-target slidev-vclick-hidden">

- Be Kind.

</div>

<div v-after class="v-afters">

- No Selling.
- Support Growth in Eachother.

</div>

---
class: text-center
title: Call for Community Tech Talks
---

<script setup lang="ts">
import Image from '../components/Image.vue'
</script>

# Call for Community Tech Talks
### We're looking for community members who are interested
### in sharing and educating our tech community

<br />
<br />

<Image src="/qr-codes/call-for-talks.png" width="200" />
https://tally.so/r/RGZb6J
