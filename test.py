from collections import defaultdict

c_list = [
    {"id": 1, "name": "데마", "price": 1000},
    {"id": 2, "name": "데마", "price": 2000},
    {"id": 3, "name": "알고리즘", "price": 2000},
    {"id": 4, "name": "알고리즘", "price": 3000},
    {"id": 5, "name": "테스트", "price": 31000},
]

test = defaultdict(list)

for item in c_list:
    test[item["name"]].append(item)

for k, v in test.items():
    print(f"{k}-{v}")
