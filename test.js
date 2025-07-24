const test = Array.from({ length: 500 }, (_, i) => i);
const cur = 2;
const per = 50;

const start = (cur - 1) * per;
const end = start + per;

const s = test.slice(start, end);

console.log(s, s.length);
