const s = ["이건 아님", "테스트1", "테스트2", "테스트3", "테스트4", "테스트5"];

const e = Array.from({ length: 12 }, (_, i) => i);

e.forEach((_, i) => {
  const color = s[(i % (s.length - 1)) + 1];

  console.log(color);
});

// 1 2 3 4 5 2 3 4
//   0 1 2 3 4 5 6
