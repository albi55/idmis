'use strict';

const DIM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const rrumbullako = (v) => Math.round(v * 10 + 1e-9) / 10;

function ditetECiklit(l, kc, muaji, dita = 1) {
  const [l1, l2, l3, l4] = l;
  const [ki, km, ke] = kc || [];
  let doy = Math.min(dita, DIM[muaji - 1]) - 1;
  for (let m0 = 0; m0 < muaji - 1; m0++) doy += DIM[m0];
  const ditet = [];
  for (let d = 0; d < l1 + l2 + l3 + l4; d++, doy = (doy + 1) % 365) {
    let m = 0;
    let x = doy;
    while (x >= DIM[m]) { x -= DIM[m]; m++; }
    const faza = d < l1 ? 1 : d < l1 + l2 ? 2 : d < l1 + l2 + l3 ? 3 : 4;
    const k = !kc ? null
      : faza === 1 ? ki
        : faza === 2 ? ki + (km - ki) * (d + 1 - l1) / l2
          : faza === 3 ? km
            : km + (ke - km) * (d + 1 - l1 - l2 - l3) / l4;
    ditet.push({ m, faza, kc: k });
  }
  return ditet;
}

function kalendari(l, muaji) {
  const qelizat = new Array(12).fill(null);
  if (!l || !muaji) return qelizat;
  ditetECiklit(l, null, muaji).forEach((d) => {
    const q = qelizat[d.m] || (qelizat[d.m] = []);
    if (q[q.length - 1] !== d.faza) q.push(d.faza);
  });
  return qelizat;
}

function nevojaMujore(l, kc, muaji, eto, reshjet, dita = 1) {
  if (!l || !muaji || kc.some((k) => k == null)) return null;
  const etc = new Array(12).fill(0);
  const neto = new Array(12).fill(0);
  ditetECiklit(l, kc, muaji, dita).forEach((d) => {
    const e = d.kc * eto[d.m];
    etc[d.m] += e;
    neto[d.m] += Math.max(0, e - (reshjet[d.m] || 0) / DIM[d.m]);
  });
  return { etc: etc.map(rrumbullako), neto: neto.map(rrumbullako) };
}

module.exports = { kalendari, nevojaMujore };
