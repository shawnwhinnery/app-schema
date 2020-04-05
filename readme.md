# Objectives
This project aims at creating a tool kit for generating code higly optimized for working with nested data structures

- creation
- validation
- serilization
- deserialization


## Models
````JavaScript
const Vector3 = {
    "name": "Vector3",
    "attributes": [
        { 
            "name": "x", 
            "type": "number"
        },
        { 
            "name": "y", 
            "type": "number"
        },
        { 
            "name": "z", 
            "type": "string"
        }
    ]
}

const Transform = {
    "name": "Transform",
    "attributes": [
        { 
            "name": "location", 
            "type": "Vector3" // Transform.location must be a valid Vector3
        },
        { 
            "name": "rotation", 
            "type": "Vector3" // Transform.rotation must be a valid Vector3
        },
        { 
            "name": "scale", 
            "type": "Vector3" // Transform.scale must be a valid Vector3
        }
    ]
}

const Food = {
    "name": "Food",
    "attributes": [
        { 
            "name": "type", 
            "enumerable": [
                "apple",
                "carrot",
                "steak"
            ]
        },
        { 
            "name": "Food", 
            "type": "string"
        }
    ]
}


const PlayerCharacter = {
    "name": "PlayerCharacter",
    "attributes": [
        { 
            "name": "transform", 
            "type": "Transform" // PlayerCharacter.transform must be a valid Transform
        },
        {
            "name": "inventory",
            "collection": "Food" // If an attribute is an array if similar objects
        }
    ]
}

````