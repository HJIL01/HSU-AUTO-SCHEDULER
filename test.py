from collections import defaultdict

course = [
    {"name": "c1", "start": 10 * 60, "end": 11 * 60, "v": 5},
    {"name": "c2", "start": 10 * 60, "end": 11 * 60 + 30, "v": 2},
    {"name": "c3", "start": 11 * 60 + 30, "end": 12 * 60, "v": 1},
]

days = ["Mon", "Tue"]
indices = defaultdict(list)

for day in days:
    indices[day] = []

print(indices)
