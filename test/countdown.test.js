import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COUNTDOWN, TIER_POINTS } from '../src/content.js';
import {
  answerQuestion, countdownLeft, countdownOver, newCountdownRun, newState, restore, submit,
} from '../src/game.js';

test('Countdown-Runde startet frisch mit großzügiger Zeit (#12)', () => {
  const s = newCountdownRun(1_000);
  assert.equal(s.insight, 0);
  assert.deepEqual(s.unlocked, ['person']);
  assert.equal(countdownLeft(s, 1_000), COUNTDOWN.startMs);
  assert.ok(COUNTDOWN.startMs >= 120_000, 'mindestens zwei Minuten');
  assert.equal(countdownLeft(s, 61_000), COUNTDOWN.startMs - 60_000);
  assert.equal(countdownLeft(newState(), 0), 0, 'normales Spiel hat keine Uhr');
  assert.equal(countdownOver(newState(), 1e15), false);
});

test('Treffer bringen Zeit – schwereres Wissen mehr', () => {
  const s = newCountdownRun(0);
  const easy = submit(s, 'Einstein', 10_000);            // Stufe 1
  assert.equal(easy.timeBonus, COUNTDOWN.bonusMs[1]);
  assert.equal(countdownLeft(s, 10_000), COUNTDOWN.startMs - 10_000 + COUNTDOWN.bonusMs[1]);

  const hard = submit(s, 'Jocelyn Bell Burnell', 11_000);
  assert.ok(hard.timeBonus > easy.timeBonus, 'höhere Stufe, mehr Zeit');

  const wrong = submit(s, 'Quatsch', 12_000);
  assert.equal(wrong.status, 'unbekannt');
  const again = submit(s, 'Einstein', 13_000);           // Abklingzeit läuft noch
  assert.equal(again.timeBonus, 0);
});

test('Im normalen Spiel gibt es keinen Zeitbonus', () => {
  const s = newState();
  assert.equal(submit(s, 'Einstein', 0).timeBonus, 0);
  assert.equal(s.countdown, null);
});

test('Bei 0 ist die Runde vorbei – keine Punkte mehr', () => {
  const s = newCountdownRun(0);
  submit(s, 'Einstein', 1_000);
  const end = COUNTDOWN.startMs + COUNTDOWN.bonusMs[1];
  assert.equal(countdownOver(s, end - 1), false);
  const r = submit(s, 'Marie Curie', end);
  assert.equal(r.status, 'vorbei');
  assert.equal(r.gained, 0);
  assert.equal(s.insight, TIER_POINTS[1]);
  assert.equal(countdownOver(s, end), true);
  assert.equal(s.countdown.endedAt, end);
  assert.equal(countdownLeft(s, end), 0);
  assert.equal(answerQuestion(s, 'f_zwei_nobel', 'Marie Curie', end).status, 'vorbei');
});

test('Fragen bringen doppelte Zeit, die Uhr hat eine Obergrenze', () => {
  const s = newCountdownRun(0);
  const r = answerQuestion(s, 'f_relativ', 'Einstein', 1_000);
  assert.equal(r.status, 'richtig');
  assert.equal(r.timeBonus, COUNTDOWN.bonusMs[1] * COUNTDOWN.questionFactor);

  s.countdown.endsAt = COUNTDOWN.maxMs; // Uhr fast voll
  const capped = submit(s, 'Marie Curie', 0);
  assert.equal(capped.timeBonus, 0);
  assert.equal(countdownLeft(s, 0), COUNTDOWN.maxMs);
});

test('Ein geladener Spielstand ist nie eine Countdown-Runde', () => {
  const run = newCountdownRun(0);
  assert.equal(restore(JSON.parse(JSON.stringify(run))).countdown, null);
});
