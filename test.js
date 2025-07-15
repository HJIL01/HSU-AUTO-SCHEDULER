const test = [
  { day: "월" },
  { day: "월" },
  { day: "수" },
  { day: "수" },
  { day: "금" },
];

const s = {};

test.map((e) => {
  s[e.day] = (s[e.day] || 0) + 1;
});

console.log(s);
