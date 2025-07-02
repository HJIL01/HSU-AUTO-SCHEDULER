from collections import defaultdict

c_list = [
    {"id": 1, "name": "데마", "price": 1000, "ss": "전기"},
    {"id": 2, "name": "데마", "price": 2000, "ss": "전기"},
    {"id": 3, "name": "알고리즘", "price": 2000, "ss": "전필"},
    {"id": 4, "name": "알고리즘", "price": 3000, "ss": "전선"},
    {"id": 5, "name": "테스트", "price": 31000, "ss": "전선"},
]

test = [0, 1, 1, 0, 0]

total = sum(pro["price"] * cur for pro, cur in zip(c_list, test) if pro["ss"] == "전기")

print(total)
