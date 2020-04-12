describe("AppSchema", function () {

    var AppSchema = require('./../src/ApplicationSchema.js'),
        GameSchema = require('./helpers/game.schema.js'),
        schema = AppSchema(GameSchema),
        { validators, factories, serializers, deserializers } = schema,
        Vec3,
        Transform,
        PlayerCharacter
    
    it("should return validators, factories, serializers, deserializers ", function () {

        var foo = [
            "validators",
            "factories",
            "serializers",
            "deserializers"
        ]
        

        expect(schema).toBeInstanceOf(Object)
        expect(validators).toBeInstanceOf(Object)
        expect(factories).toBeInstanceOf(Object)
        expect(serializers).toBeInstanceOf(Object)
        expect(deserializers).toBeInstanceOf(Object)

        GameSchema.models.forEach(model => {
            expect(validators[model.name]).toBeInstanceOf(Function)
            expect(factories[model.name]).toBeInstanceOf(Function)
            expect(serializers[model.name]).toBeInstanceOf(Function)
            expect(deserializers[model.name]).toBeInstanceOf(Function)
        })

    });
    
    it("factory should produce valid Vector3 with correct values", function () {

        Vec3 = factories.Vector3()

        expect(Vec3.x).toEqual(0);
        expect(Vec3.y).toEqual(1);
        expect(Vec3.z).toEqual(2);

        Vec3 = factories.Vector3({ x: 100, y: 200, z: 300 })

        expect(Vec3.x).toEqual(100);
        expect(Vec3.y).toEqual(200);
        expect(Vec3.z).toEqual(300);

    });
    
    it("factory should produce valid Transform using default values for the rotation", function () {

        Transform = factories.Transform({
            scale: { y: 420 },
            location: { z: 10, x: 99999 }
        })

        expect(Transform.scale.x).toEqual(0);
        expect(Transform.scale.y).toEqual(420);
        expect(Transform.scale.z).toEqual(2);

        expect(Transform.location.x).toEqual(99999);
        expect(Transform.location.y).toEqual(1);
        expect(Transform.location.z).toEqual(10);

        expect(Transform.rotation.x).toEqual(0);
        expect(Transform.rotation.y).toEqual(1);
        expect(Transform.rotation.z).toEqual(2);

    });
    
    it("should serialize and deserialize a PlayerCharacter", function () {


        const expectedFlat = [
                [[0, 1, 2], [0, 1, 2], [0, 1, 2]],
                [['apple', 10000000], ['apple', 20000000]]
            ],
            expectedFat = {
                transform: {
                    location: { x: 0, y: 1, z: 2 },
                    rotation: { x: 0, y: 1, z: 2 },
                    scale: { x: 0, y: 1, z: 2 }
                },
                inventory: [
                    { type: 'apple', created: 10000000 },
                    { type: 'apple', created: 20000000 }
                ]
            },
            flat = serializers.PlayerCharacter(expectedFat),
            fat = deserializers.PlayerCharacter(expectedFlat)

        expect(flat[0][0][0]).toEqual(expectedFlat[0][0][0]);
        expect(flat[0][0][1]).toEqual(expectedFlat[0][0][1]);
        expect(flat[0][0][2]).toEqual(expectedFlat[0][0][2]);

        expect(flat[1][0][0]).toEqual(expectedFlat[1][0][0]);
        expect(flat[1][0][1]).toEqual(expectedFlat[1][0][1]);

        expect(flat[1][1][0]).toEqual(expectedFlat[1][1][0]);
        expect(flat[1][1][1]).toEqual(expectedFlat[1][1][1]);

        expect(fat.transform.location.x).toEqual(expectedFat.transform.location.x);
        expect(fat.transform.location.y).toEqual(expectedFat.transform.location.y);
        expect(fat.transform.location.z).toEqual(expectedFat.transform.location.z);

        expect(fat.transform.rotation.x).toEqual(expectedFat.transform.rotation.x);
        expect(fat.transform.rotation.y).toEqual(expectedFat.transform.rotation.y);
        expect(fat.transform.rotation.z).toEqual(expectedFat.transform.rotation.z);

        expect(fat.transform.scale.x).toEqual(expectedFat.transform.scale.x);
        expect(fat.transform.scale.y).toEqual(expectedFat.transform.scale.y);
        expect(fat.transform.scale.z).toEqual(expectedFat.transform.scale.z);


    });

});