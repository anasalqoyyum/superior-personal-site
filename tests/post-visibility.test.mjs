import assert from 'node:assert/strict'
import test from 'node:test'
import { isPostListed } from '../src/utils/post-visibility.ts'

const listAfter = '2026-11-15T00:00:00+07:00'
const boundary = Date.parse('2026-11-14T17:00:00Z')

test('lists ordinary posts without a scheduled date', () => {
  assert.equal(isPostListed({ now: boundary }), true)
})

test('keeps a scheduled post unlisted until midnight in its timezone', () => {
  assert.equal(isPostListed({ listAfter, now: boundary - 1 }), false)
  assert.equal(isPostListed({ listAfter, now: boundary }), true)
  assert.equal(isPostListed({ listAfter, now: boundary + 1 }), true)
})

test('keeps explicitly hidden posts unlisted after their scheduled date', () => {
  assert.equal(isPostListed({ hidden: true, now: boundary }), false)
  assert.equal(
    isPostListed({ hidden: true, listAfter, now: boundary + 1 }),
    false
  )
})
