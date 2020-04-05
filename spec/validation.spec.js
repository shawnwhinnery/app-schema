describe("AppSchema", function () {

    var AppSchema = require('./../src/ApplicationSchema.js'),
        GameSchema = require('./helpers/game.schema.js'),
        schema = AppSchema(GameSchema),
        { validators, factories } = schema,
        Vec3,
        Transform

    it("should return validators and factories for every object in the schema", function () {

        validators = schema.validators
        factories = schema.factories

        expect(schema).toBeInstanceOf(Object)
        expect(validators).toBeInstanceOf(Object)
        expect(factories).toBeInstanceOf(Object)

        GameSchema.models.forEach(model => {

            var validator = validators[model.name],
                factory = factories[model.name]

            expect(validator).toBeInstanceOf(Function);
            expect(factory).toBeInstanceOf(Function);

        })

    });

    it("factory should produce valid Vector3", function () {
        
        Vec3 = factories.Vector3()
        
        expect(Vec3.x).toEqual(0);
        expect(Vec3.y).toEqual(1);
        expect(Vec3.z).toEqual(2);
        
        Vec3 = factories.Vector3({x: 100, y: 200, z: 300})

        expect(Vec3.x).toEqual(100);
        expect(Vec3.y).toEqual(200);
        expect(Vec3.z).toEqual(300);

    });

    it("factory should produce valid Transform", function () {
        
        Transform = factories.Transform({
            scale: {y: 420},
            location: {z: 10, x: 99999}
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

    it("factory should produce valid PlayerCharacter", function () {
        
        Transform = factories.PlayerCharacter({})

        Transform = factories.PlayerCharacter({
            inventory: []
        })

        Transform = factories.PlayerCharacter({
            inventory: [
                {type: "apple", name: 666 }
            ]
        })

        console.log(Transform)       
        // expect(Transform.scale.x).toEqual(0);
        // expect(Transform.scale.y).toEqual(420);
        // expect(Transform.scale.z).toEqual(2);
        
        // expect(Transform.location.x).toEqual(99999);
        // expect(Transform.location.y).toEqual(1);
        // expect(Transform.location.z).toEqual(10);
        
        // expect(Transform.rotation.x).toEqual(0);
        // expect(Transform.rotation.y).toEqual(1);
        // expect(Transform.rotation.z).toEqual(2);

    });
    
});