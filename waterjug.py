
from collections import defaultdict
x=input("Water Capacity of JUG 1:")
y=input("Water Capacity of JUG 2:")
z=input("Water Capacity of JUG 3:")
l=input("Aim water:")
jug1, jug2,jug3, aim = x, y,z, l

visited = defaultdict(lambda: False)
 

def waterJugSolver(amt1, amt2,amt3):
 
    if (amt1 == aim and amt2 == 0) or (amt2 == aim and amt1 == 0) or (amt3 == aim and amt3 == 0):
        print(amt1, amt2,amt3)
        return True
     
    if visited[(amt1, amt2,amt3)] == False:
        
     
        visited[(amt1, amt2,amt3)] = True
     

        return (waterJugSolver(0, amt2,amt3) or
                waterJugSolver(amt1, 0,amt3) or
                waterJugSolver(amt1, amt2,0) or
                waterJugSolver(jug1, amt2,amt3) or
                waterJugSolver(amt1, jug2,amt3) or
                waterJugSolver(amt1, amt2,jug3) or
                waterJugSolver(amt1 + min(amt2, (jug1-amt1)),
                amt2 - min(amt2, (jug1-amt1))) or
                waterJugSolver(amt1 - min(amt1, (jug2-amt2)),
                amt2 + min(amt1, (jug2-amt2))))
     
   
    else:
        return False
 
print("Steps: ")

waterJugSolver(12, 0,0)
