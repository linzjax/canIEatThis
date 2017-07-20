# Can I Eat This
A chrome extension that analyzes recipe ingredients to determine whether or not they should be left out according to your diet specifications.

---

Because my stomach is stupid and can't do the one job assigned to it, and as a result my diet is a bit restrictive.

#####I got really tired of spending more time looking up ingredients in recipes than actually making the recipes.

So I made a extension that does the analyzing for me.

#####To Do:
*Format so that only food words are shown
*Enable the user to customize which diet they are following

#### Database Structure

---------------------------------------------------------
| 
| Food
---------------------------------------------------------
| food_id      | SERIAL PRIMARY KEY -> 1
| name         | VARCHAR(255) -> "wheat"
| food_type_id | INT FOREIGN KEY REFERENCES FoodType(food_type_id)
---------------------------------------------------------

---------------------------------------------------------
|
| FoodType
---------------------------------------------------------
| food_type_id | SERIAL PRIMARY KEY -> 1
| name         | VARCHAR(255) -> "grains"
---------------------------------------------------------


_________________________________________________________
|
| Diet
---------------------------------------------------------
| diet_id      | SERIAL PRIMARY KEY -> 1
| name         | VARCHAR(255) -> "paleo"
---------------------------------------------------------

_________________________________________________________
|
| RestrictionList
---------------------------------------------------------
| diet_id      | INT FOREIGN KEY REFERENCES Diet(diet_id)
| food_type_id | INT FOREIGN KEY REFERENCES FoodType(food_type_id)
---------------------------------------------------------

