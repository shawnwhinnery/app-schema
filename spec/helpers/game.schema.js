const Vector3 = {
    "name": "Vector3",
    "attributes": [
        {
            "name": "x",
            "type": "number",
            "defaultValue": 0
        },
        {
            "name": "y",
            "type": "number",
            "defaultValue": 1
        },
        {
            "name": "z",
            "type": "number",
            "defaultValue": 2
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
            "type": "string",
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
            "type": "Food",
            "collection": true // If an attribute is an array if similar objects
        }
    ]
}

module.exports = {
    name: "Game", 
    models: [
        Vector3,
        Transform,
        Food,
        PlayerCharacter
    ]
}