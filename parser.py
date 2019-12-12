import re
import json
import utm

file = open('raw.txt','r').read().splitlines()

items = []

for line in file:
    match = re.findall(r"^(.*?)\°,(.*?)\°,([a-zA-Z\s]+)$",line)
    if(len(match) == 1):
        vara = (utm.from_latlon(float(match[0][0]), float(match[0][1])))
        x = vara[0]  
        y = vara[1] 
        items.append({
            'x':float(x),
            'y':float(y),
            'long':match[0][0],
            'lat':match[0][1],
            'name':str(match[0][2]),
        })

print(json.dumps(items))