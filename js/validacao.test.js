// Rode com: node --test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const V = require('./validacao.js');

test('máscara de dinheiro cresce da direita para a esquerda', () => {
  assert.equal(V.mascararMoeda('1'), 'R$ 0,01');
  assert.equal(V.mascararMoeda('123456'), 'R$ 1.234,56');
  assert.equal(V.mascararMoeda('R$ 0,005'), 'R$ 0,05');
  assert.equal(V.mascararMoeda(''), '');
});

test('lê o valor de um campo de dinheiro', () => {
  assert.equal(V.lerMoeda('R$ 1.234,56'), 1234.56);
  assert.equal(V.lerMoeda(''), 0);
});

test('valida CPF pelos dígitos verificadores', () => {
  assert.equal(V.cpfValido('529.982.247-25'), true);
  assert.equal(V.cpfValido('529.982.247-24'), false);
  assert.equal(V.cpfValido('000.000.000-00'), false);
});

test('aplica as máscaras de CPF, CEP, telefone e conta', () => {
  assert.equal(V.mascararCpf('52998224725'), '529.982.247-25');
  assert.equal(V.mascararCep('01310100'), '01310-100');
  assert.equal(V.mascararTelefone('11987654321'), '(11) 98765-4321');
  assert.equal(V.mascararConta('1234567'), '123456-7');
});

test('confere a maioridade', () => {
  const hoje = new Date('2026-10-07T12:00:00');
  assert.equal(V.maiorDeIdade('2008-10-07', hoje), true);
  assert.equal(V.maiorDeIdade('2008-10-08', hoje), false);
  assert.equal(V.maiorDeIdade('2030-01-01', hoje), false);
});

test('exige senha com 8 caracteres, letra e número', () => {
  assert.equal(V.senhaForte('banco2026'), true);
  assert.equal(V.senhaForte('12345678'), false);
  assert.equal(V.senhaForte('abc123'), false);
});
