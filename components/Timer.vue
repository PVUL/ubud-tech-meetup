<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  duration: { type: [Number, String], default: null },
  at: { type: String, default: null },
  title: { type: String, default: '' },
  autostart: { type: Boolean, default: false }
})

const timerContainer = ref<HTMLElement | null>(null)
const timeLeft = ref(0)
const isRunning = ref(false)
const isDone = ref(false)
const isMinimized = ref(true)
const interval = ref<number | null>(null)
const totalInitialSeconds = ref(0)

const lastInputMode = ref<'duration' | 'deadline'>('duration')
const liveTitle = ref(props.title)
const minsInput = ref('')
const secsInput = ref('')
const targetDigits = ref('00:00')
const targetAmPm = ref('pm')

const STORAGE_KEY = 'timer-vibe-config'

const saveConfig = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    mins: minsInput.value,
    secs: secsInput.value,
    deadline: targetDigits.value,
    ampm: targetAmPm.value,
    mode: lastInputMode.value
  }))
}

const minsRef = ref<HTMLInputElement | null>(null)
const secsRef = ref<HTMLInputElement | null>(null)

const blurActive = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

const size = ref({ width: 180 })
const isResizing = ref(false)
const resizeStart = ref({ x: 0, w: 0 })

let isConfettiActive = false
let observer: IntersectionObserver | null = null

const onResizeMouseDown = (e: MouseEvent) => {
  if (isRunning.value) return
  isResizing.value = true
  resizeStart.value = { x: e.clientX, w: size.value.width }
  e.preventDefault()
}

const onGlobalMouseMove = (e: MouseEvent) => {
  if (isResizing.value) {
    const deltaX = resizeStart.value.x - e.clientX
    size.value.width = Math.min(600, Math.max(180, resizeStart.value.w + deltaX))
  }
}

const onGlobalMouseUp = () => isResizing.value = false

const onGlobalClick = (e: MouseEvent) => {
  if (isDone.value && timerContainer.value && !timerContainer.value.contains(e.target as Node)) {
    isDone.value = false
    isMinimized.value = true 
    reset(true)
  }
}

let isSyncing = false

const formatAbsolute = (seconds: number) => {
  const date = new Date()
  date.setSeconds(date.getSeconds() + seconds)
  const h = date.getHours()
  const m = date.getMinutes()
  const displayH = h % 12 || 12
  const ampm = h >= 12 ? 'pm' : 'am'
  return { digits: `${displayH}:${String(m).padStart(2, '0')}`, ampm }
}

const updateUIFromSeconds = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  minsInput.value = m > 0 ? String(m) : ''
  secsInput.value = s > 0 ? String(s).padStart(2, '0') : ''
  const abs = formatAbsolute(sec)
  targetDigits.value = abs.digits
  targetAmPm.value = abs.ampm
  timeLeft.value = sec
  totalInitialSeconds.value = sec
}

const handleManualInput = () => {
  if (isSyncing || isRunning.value) return
  isSyncing = true
  lastInputMode.value = 'duration'
  const m = parseInt(minsInput.value) || 0
  const s = parseInt(secsInput.value) || 0
  const total = (Math.min(m, 9999) * 60) + Math.min(s, 59)
  timeLeft.value = total
  totalInitialSeconds.value = total
  const abs = formatAbsolute(total)
  targetDigits.value = abs.digits
  targetAmPm.value = abs.ampm
  isSyncing = false
  saveConfig()
}

const handleSecsInput = (e: Event) => {
  if (isRunning.value) return
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '')
  if (val.length === 1 && val !== '0') {
    secsInput.value = '0' + val
  } else if (val.length === 3) {
    secsInput.value = val.slice(-2)
  } else {
    secsInput.value = val
  }
  handleManualInput()
}

const calculateDeadlineDiff = (): number | null => {
  const matches = targetDigits.value.match(/(\d+):?(\d+)?/)
  if (!matches) return null
  let h = parseInt(matches[1])
  let m = matches[2] ? Math.min(parseInt(matches[2]), 59) : 0
  if (h > 12) h = 12 
  let finalH = h
  if (targetAmPm.value === 'pm' && h < 12) finalH += 12
  if (targetAmPm.value === 'am' && h === 12) finalH = 0
  const now = new Date()
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), finalH, m, 0)
  let diff = Math.floor((targetDate.getTime() - now.getTime()) / 1000)
  if (diff < 0) diff += 86400 
  return diff
}

const handleTargetInput = () => {
  if (isSyncing || isRunning.value) return
  isSyncing = true
  lastInputMode.value = 'deadline'
  const diff = calculateDeadlineDiff()
  if (diff !== null) {
    timeLeft.value = diff
    totalInitialSeconds.value = diff
    const minVal = Math.floor(diff / 60)
    const secVal = diff % 60
    minsInput.value = minVal > 0 ? String(minVal) : ''
    secsInput.value = secVal > 0 ? String(secVal).padStart(2, '0') : ''
  }
  isSyncing = false
  saveConfig()
}

const toggleAmPm = () => {
  if (isRunning.value) return
  targetAmPm.value = targetAmPm.value === 'pm' ? 'am' : 'pm'
  handleTargetInput()
  saveConfig()
  blurActive()
}

const handleSecsBackspace = (e: KeyboardEvent) => {
  if (!secsInput.value) {
    minsRef.value?.focus()
  }
}

const startTimer = () => {
  blurActive()
  if (lastInputMode.value === 'deadline') {
    const freshDiff = calculateDeadlineDiff()
    if (freshDiff !== null) {
      timeLeft.value = freshDiff
      totalInitialSeconds.value = freshDiff
    }
  } else {
    const m = parseInt(minsInput.value) || 0
    const s = parseInt(secsInput.value) || 0
    timeLeft.value = (m * 60) + s
    totalInitialSeconds.value = timeLeft.value
  }
  if (isRunning.value || timeLeft.value <= 0) return
  isRunning.value = true
  isDone.value = false
  interval.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      if (!isSyncing) {
        minsInput.value = String(Math.floor(timeLeft.value / 60))
        secsInput.value = String(timeLeft.value % 60).padStart(2, '0')
      }
    } else {
      finish()
    }
  }, 1000)
}

const finish = () => {
  stopTimer()
  isDone.value = true
  isMinimized.value = false 
  triggerConfetti()
}

const triggerConfetti = () => {
  isConfettiActive = true
  const end = Date.now() + 5000
  const colors = ['#ffffff', '#666666']
  const frame = () => {
    if (!isConfettiActive) return
    confetti({ particleCount: 15, angle: 60, spread: 80, origin: { x: 0 }, colors, zIndex: 10000 })
    confetti({ particleCount: 15, angle: 120, spread: 80, origin: { x: 1 }, colors, zIndex: 10000 })
    if (Date.now() < end) requestAnimationFrame(frame)
    else isConfettiActive = false
  }
  frame()
}

const stopTimer = () => {
  isRunning.value = false
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = null
  }
}

const reset = (fromUser = false) => {
  stopTimer()
  isDone.value = false
  isConfettiActive = false
  confetti.reset()

  // Prioritize session storage as the primary default
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const config = JSON.parse(saved)
      minsInput.value = config.mins || ''
      secsInput.value = config.secs || ''
      targetDigits.value = config.deadline || '00:00'
      targetAmPm.value = config.ampm || 'pm'
      lastInputMode.value = config.mode || 'duration'
      
      if (config.mode === 'deadline') {
        handleTargetInput()
      } else {
        handleManualInput()
      }
      return // Successfully loaded from session, stop here.
    } catch (e) {}
  }

  if (props.at) {
    const s = props.at.trim().toLowerCase()
    const matches = s.match(/(\d+):?(\d+)?\s*(am|pm)?/)
    if (matches) {
        targetDigits.value = `${matches[1]}:${matches[2] || '00'}`
        targetAmPm.value = matches[3] || 'pm'
        handleTargetInput()
    }
  } else if (props.duration) {
    const val = parseInt(String(props.duration)) || 900
    updateUIFromSeconds(String(props.duration).includes(':') ? val : val * 60)
  } else {
    updateUIFromSeconds(900)
  }
  blurActive()
}

const toggleTimer = () => {
  if (isRunning.value) stopTimer()
  else startTimer()
  blurActive()
}

const setupVisibilityObserver = () => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        reset()
        isMinimized.value = true
      }
    })
  }, { threshold: [0] })
  if (timerContainer.value) observer.observe(timerContainer.value)
}

onMounted(() => {
  reset()
  if (props.autostart) startTimer()
  setupVisibilityObserver()
  window.addEventListener('mousemove', onGlobalMouseMove)
  window.addEventListener('mouseup', onGlobalMouseUp)
  window.addEventListener('click', onGlobalClick)
})

onUnmounted(() => {
  stopTimer()
  isConfettiActive = false
  confetti.reset()
  if (observer) observer.disconnect()
  window.removeEventListener('mousemove', onGlobalMouseMove)
  window.removeEventListener('mouseup', onGlobalMouseUp)
  window.removeEventListener('click', onGlobalClick)
})

watch(() => [props.duration, props.at, props.title], () => {
  liveTitle.value = props.title || ''
  reset()
})
</script>

<template>
  <div 
    ref="timerContainer"
    class="timer-vibe-fixed group relative flex flex-col rounded-3xl border border-white/10 backdrop-blur-3xl shadow-[0_32px_128px_rgba(0,0,0,0.9)] transition-[width,max-height,background-color,border-color,box-shadow,border-radius,opacity] duration-400 ease-out select-none overflow-hidden will-change-[width,max-height]"
    :class="{ 
      'bg-zinc-100 ring-2 ring-white status-done text-black': isDone,
      'bg-black/95 text-white': !isDone,
      'w-10 h-10 cursor-pointer hover:bg-zinc-900 border-white/20': isMinimized && !isRunning
    }"
    :style="{ 
      width: isMinimized && !isRunning ? '40px' : `${size.width}px`,
      height: isMinimized && !isRunning ? '40px' : 'auto',
      maxHeight: isMinimized && !isRunning ? '40px' : '600px'
    }"
    @click="if (isMinimized) isMinimized = false; else if (isDone) { isDone = false; isMinimized = true; reset(true); }"
  >
    <!-- SHARED TOGGLE BUTTONS (TOP-RIGHT FIXED) -->
    <div v-if="!isMinimized" class="absolute top-3 right-3 flex gap-4 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity z-[70] mix-blend-difference">
      <button @click.stop="isMinimized = !isMinimized" class="w-5 h-5 flex items-center justify-center transition-transform active:scale-90">
        <div class="i-carbon:subtract text-[14px]" />
      </button>
    </div>

      <!-- 1. Iconic Mode (Clock Icon) -->
      <Transition name="vibe-pop">
        <div v-if="isMinimized && !isRunning" key="puck" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="i-carbon:time text-lg text-white/50 group-hover:text-white transition-colors" />
        </div>
      </Transition>

      <!-- 2. HUD Modes -->
      <Transition name="vibe-fade">
        <div 
          v-if="!(isMinimized && !isRunning)" 
          key="hud"
          class="w-full h-full flex flex-col items-center justify-center"
          :class="isMinimized ? 'p-2 pb-3 pt-6' : 'p-6'"
        >
          
          <!-- Left Resize Edge -->
          <div 
            v-if="!isRunning && !isMinimized"
            class="absolute inset-y-0 left-0 w-1.5 cursor-ew-resize hover:bg-white/5 transition-colors z-50"
            @mousedown="onResizeMouseDown"
          />

          <!-- Header -->
          <div v-if="!isMinimized" class="w-full h-4 flex justify-center items-center mb-6 mt-1 px-8 opacity-80">
              <input 
                v-model="liveTitle" 
                :disabled="isRunning"
                class="bg-transparent border-none outline-none text-[8px] font-sans font-medium tracking-[0.5em] uppercase text-center w-full transition-all"
                :class="isRunning ? 'text-zinc-600' : (isDone ? 'text-black/40' : 'text-zinc-500 hover:text-white focus:text-white')"
              />
          </div>

          <!-- Main Countdown -->
          <div class="flex flex-col items-center w-full gap-1 mb-2 transition-all duration-700">
            <span v-if="!isMinimized" class="text-[7px] font-sans font-semibold uppercase tracking-[0.2em] opacity-40">Remaining</span>
            <div class="flex items-baseline font-mono font-bold tabular-nums leading-none">
              <input 
                ref="minsRef"
                v-model="minsInput"
                @input="handleManualInput"
                @keyup.enter="startTimer"
                :disabled="isRunning"
                placeholder="0"
                class="bg-transparent text-right outline-none p-0 text-2xl w-[55px] placeholder:text-zinc-900 transition-all"
                :class="isDone ? 'text-black' : (isRunning ? 'text-white' : 'text-white/80 focus:text-white')"
              />
              <span class="font-sans font-bold uppercase mx-1 self-center mt-1.5 opacity-50 text-[9px]">m</span>
              <input 
                ref="secsRef"
                :value="secsInput"
                @input="handleSecsInput"
                @keydown.backspace="handleSecsBackspace"
                @keyup.enter="startTimer"
                maxlength="2"
                :disabled="isRunning"
                placeholder="00"
                class="bg-transparent outline-none p-0 text-2xl w-[40px] placeholder:text-zinc-900 transition-all"
                :class="isDone ? 'text-black' : (isRunning ? 'text-white' : 'text-white/80 focus:text-white')"
              />
              <span class="font-sans font-bold uppercase ml-0.5 self-center mt-1.5 opacity-50 text-[9px]">s</span>
            </div>
          </div>

          <!-- Deadline Area -->
          <div v-if="!isMinimized" class="flex flex-col items-center w-full border-t border-white/5 pt-6 gap-3 mb-6 transition-all">
            <span class="text-[7px] font-sans font-semibold uppercase tracking-[0.2em] opacity-40">Until</span>
            <div class="flex items-center gap-2 justify-center">
              <input 
                v-model="targetDigits"
                @input="handleTargetInput"
                @keyup.enter="startTimer"
                :disabled="isRunning"
                class="bg-transparent border-none outline-none font-mono font-medium text-center transition-all text-lg w-20"
                :class="isDone ? 'text-black' : (isRunning ? 'text-zinc-500' : 'text-white/70 hover:text-white focus:text-white')"
              />
              <button 
                @click="toggleAmPm" 
                :disabled="isRunning"
                class="px-2 py-0.5 rounded border text-[9px] font-sans font-black uppercase transition-all"
                :class="isDone ? 'border-black/20 text-black' : (isRunning ? 'border-zinc-800 text-zinc-600' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white')"
              >
                {{ targetAmPm }}
              </button>
            </div>
          </div>

          <!-- Progress Bar & Footer Controls -->
          <div v-if="!isMinimized" class="w-full flex items-center gap-6 mt-2 h-4">
            <div class="flex-1 h-[1.5px] rounded-full overflow-hidden relative" :class="isDone ? 'bg-black/10' : 'bg-zinc-800'">
              <div 
                class="absolute inset-y-0 left-0 transition-opacity duration-1000 ease-linear shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                :class="isDone ? 'bg-black' : 'bg-white'"
                :style="{ width: `${(timeLeft / (totalInitialSeconds || 1)) * 100}%` }"
              />
            </div>
            <div class="flex gap-4 min-w-[50px] justify-end">
              <button @click="toggleTimer" class="transition-all active:scale-90 hover:scale-110">
                <div v-if="!isRunning" class="i-carbon:play-filled text-[14px]" :class="isDone ? 'text-black/60' : 'text-zinc-500 hover:text-white'" />
                <div v-else class="i-carbon:pause-filled text-[14px] text-white" />
              </button>
              <button 
                @click="reset(true)" 
                class="transition-all active:scale-90 hover:scale-110" 
                :class="isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'"
              >
                <div class="i-carbon:reset text-[14px]" :class="isDone ? 'text-black/60' : 'text-zinc-500 hover:text-zinc-300'" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
</template>

<style scoped>
@keyframes status-done-vibe {
  0%, 100% { box-shadow: 0 32px 128px rgba(0,0,0,0.9); }
  50% { box-shadow: 0 0 60px rgba(255, 255, 255, 0.4); }
}

.status-done {
  animation: status-done-vibe 2s infinite ease-in-out;
}

input:disabled, button:disabled {
  cursor: default;
}

/* Vibe Fade Transitions */
.vibe-fade-enter-active, .vibe-fade-leave-active {
  transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.vibe-fade-enter-from, .vibe-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* Iconic Puck Pop */
.vibe-pop-enter-active, .vibe-pop-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.vibe-pop-enter-from, .vibe-pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
