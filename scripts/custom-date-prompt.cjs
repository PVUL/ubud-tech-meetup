'use strict'

/**
 * Forked from: https://github.com/derhuerst/date-prompt
 * Reason: Upstream hardcodes hour and minute entry. We only want YYYY-MM-DD.
 * 
 * NOTE TO PAUL: this is pretty cool fork, so we should open source this, 
 *   						 but make it a more customizeable- 
 *               ie. order of layout, separators, display format, ui controls
 */
const ui = require('cli-styles')
const esc = require('ansi-escapes')
const moment = require('moment')
const wrap = require('prompt-skeleton')

const CYAN_UNDERLINE = (s) => `\x1b[36m\x1b[4m${s}\x1b[0m`
const BOLD = (s) => `\x1b[1m${s}\x1b[0m`

const digits = [
	{ unit: 'month', method: 'month', length: 2, format: 'MM', displayFormat: 'MMM', offset: 1, separator: ' ' }
	, { unit: 'day', method: 'date', length: 2, format: 'DD', separator: ' ' }
	, { unit: 'year', method: 'year', length: 4, format: 'YYYY', separator: '' }
]

const isNumber = /[0-9]/

const DatePrompt = {

	reset: function () {
		this.typed = ''; this.lastHit = 0
		this.value = this.initialValue
		this.render()
	}

	, abort: function () {
		this.done = this.aborted = true
		this.render()
		this.out.write('\n')
		this.value = this.value.toISOString(true)
		this.close()
	}

	, submit: function () {
		this.done = true
		this.aborted = false
		this.render()
		this.out.write('\n')
		this.value = this.value.toISOString(true)
		this.close()
	}

	, first: function () {
		if (this.cursor !== 0) { this.typed = ''; this.lastHit = 0 }
		this.cursor = 0
		this.render()
	}
	, last: function () {
		if (this.cursor !== digits.length - 1) { this.typed = ''; this.lastHit = 0 }
		this.cursor = digits.length - 1
		this.render()
	}

	, left: function () {
		if (this.cursor === 0) return this.bell()
		this.typed = ''; this.lastHit = 0
		this.cursor--
		this.render()
	}
	, right: function () {
		if (this.cursor === digits.length - 1) return this.bell()
		this.typed = ''; this.lastHit = 0
		this.cursor++
		this.render()
	}
	, next: function () {
		this.typed = ''; this.lastHit = 0
		this.cursor = (this.cursor + 1) % digits.length
		this.render()
	}

	, up: function () {
		this.typed = ''; this.lastHit = 0
		this.value.subtract(1, digits[this.cursor].unit)
		this.render()
	}
	, down: function () {
		this.typed = ''; this.lastHit = 0
		this.value.add(1, digits[this.cursor].unit)
		this.render()
	}

	, _: function (n) {
		if (!isNumber.test(n)) return this.bell()

		const now = Date.now()
		if ((now - this.lastHit) > 1000) this.typed = ''
		this.typed += n
		this.lastHit = now

		const d = digits[this.cursor]
		const v = parseInt(this.typed) - (d.offset || 0)
		const typedLength = Math.abs(parseInt(this.typed)).toString().length

		if (typedLength >= d.length) {
			this.typed = ''; this.lastHit = 0
			this.value[d.method](v)
			if (this.cursor < digits.length - 1) this.cursor++
		}

		this.render()
	}

	, renderDigits: function () {
		let str = ''
		for (let i = 0; i < digits.length; i++) {
			const digit = digits[i]
			const display = this.value.format(digit.displayFormat || digit.format)
			str += (!this.done && i === this.cursor)
				? CYAN_UNDERLINE(display)
				: display
			str += digit.separator !== undefined ? digit.separator : ' '
		}
		return str
	}

	, render: function () {
		process.stdout.write(esc.eraseLine + esc.cursorTo(0)
			+ esc.cursorHide + [
				ui.symbol(this.done, this.aborted)
				, BOLD(this.msg), ui.delimiter(false)
				, this.renderDigits()
			].join(' '))
	}
}

const defaults = {
	msg: ''
	, value: moment()
	, cursor: 0
	, typed: ''
	, lastHit: 0
	, done: false
	, aborted: false
}

const create = (msg, opt) => {
	if ('string' !== typeof msg) throw new Error('Message must be string.')
	if (Array.isArray(opt) || 'object' !== typeof opt) opt = {}

	if ('number' === typeof opt.cursor && 0 < opt.cursor <= (digits.length - 1))
		opt.cursor = parseInt(opt.cursor)
	else opt.cursor = 0

	let p = Object.assign(Object.create(DatePrompt), defaults, opt)
	p.msg = msg
	p.initialValue = p.value

	return wrap(p)
}

module.exports = Object.assign(create, { DatePrompt })
