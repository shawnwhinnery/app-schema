
require('colors')

const {
    STRING,
    BOOLEAN,
    NUMBER,
    OBJECT
} = require('./consts.js')

const validateSchemaName = require('./util/validateSchemaName.js')
const validateSchemaModels = require('./util/validateSchemaModels.js')
const defaultValidators = {
    string: b => {
        return typeof b === STRING
    },
    boolean: b => {
        return typeof b === BOOLEAN
    },
    number: n => {
        return typeof n === NUMBER
    },
    array: a => {
        return Array.isArray(a)
    },
    object: o => {
        return !!o && typeof o === OBJECT && o.constructor === Object
    },
    "*": () => {
        return true
    }
}

module.exports = ({
    name, models
}) => {

    // validate input
    // --------------------------------------------
    validateSchemaName(name)
    validateSchemaModels(models)

    const validators = { ...defaultValidators }
    const factories = {}
    const serializers = {}
    const deserializers = {}

    // initialize models
    // --------------------------------------------
    models.forEach(model => {

        factories[model.name] = (obj = {}) => {

            var output = {}

            model.attributes.forEach(attribute => {
                var { name, type, defaultValue, collection } = attribute

                var factory = factories[type],
                    validator = validators[type],
                    sourceValue = obj[name],
                    finalValue,
                    isValid

                if (collection) {

                    // default collections
                    if (sourceValue === undefined || sourceValue == null) {
                        sourceValue = []
                    }

                    if (Array.isArray(sourceValue)) {
                        sourceValue = factory ? sourceValue.map(factory) : sourceValue
                        finalValue = sourceValue
                        isValid = true
                    } else {
                        throw new Error(`Collections must be arrays`)
                    }

                } else {
                    finalValue = sourceValue === undefined ? defaultValue : sourceValue
                    if (factory) {
                        finalValue = factory(finalValue)
                    }
                    isValid = validator(finalValue)
                }


                if (!isValid) {
                    throw new Error(`missing or invalid attrubute "${finalValue}" for attribute "${name}" while constructing model "${model.name}". Expected type "${type}" actual type is "${typeof finalValue}".`)
                } else {
                    output[name] = finalValue
                }

            })

            return output
        }

        validators[model.name] = obj => {

            var modelisValid = true

            model.attributes.forEach(attribute => {

                var attrValid = false,
                    inputValue = obj[attribute.name],
                    validator = validators[attribute.type]


                // console.log('')
                // console.log('VALIDATE ------------------'.yellow)
                // console.log('model:         ', model.name.green)
                // console.log('attribute:     ', attribute.name.green)
                // console.log('attribute type:', attribute.type.green)
                // console.log('collection:    ', !!attribute.collection)
                // console.log('defaultValue:  ', defaultValue)
                // // console.log('factory:       ', factory)
                // console.log('validator:     ', validator)
                // console.log('inputValue:    ', inputValue)
                // // console.log('isValid:       ', isValid)
                // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~'.yellow)

                if (attribute.collection) {

                    inputValue = Array.isArray(inputValue) ? inputValue : []

                    var collectionValid = !inputValue.some((_obj, i) => {
                        // console.log(`${model.name} : ${attribute.name} : ${inputValue}`)
                        return !validator(inputValue)
                    })

                    attrValid = collectionValid

                } else if (attribute.enumerable) {
                    attrValid = !!~attribute.enumerable.indexOf(inputValue)
                } else {
                    if (validator(inputValue)) {
                        attrValid = true
                    }
                }

                if (!attrValid) {
                    modelisValid = false
                }
            })

            return modelisValid
        }

        serializers[model.name] = obj => {

            var arr = [],
                validator = validators[model.type]

            if (validator) {
                if (!validator(obj)) {
                    throw new Error('invalid object')
                }
            }

            model.attributes.forEach(attribute => {

                var serializer = serializers[attribute.type],
                    inputVal = obj[attribute.name]

                if (attribute.collection) {
                    if (serializer) {
                        arr.push(inputVal.map(serializer))
                    } else {
                        arr.push(inputVal)
                    }
                } else {
                    if (serializer) {
                        arr.push(serializer(inputVal))
                    } else {
                        arr.push(inputVal)
                    }
                }
            })

            return arr

        }

        deserializers[model.name] = arr => {

            var obj = {}

            model.attributes.forEach((attribute, i) => {

                var deserializer = deserializers[attribute.type],
                    inputVal = arr[i]

                if (attribute.collection) {
                    if (deserializer) {
                        obj[attribute.name] = inputVal.map(deserializer)
                    } else {
                        obj[attribute.name] = inputVal
                    }
                } else {
                    if (deserializer) {
                        obj[attribute.name] = deserializer(inputVal)
                    } else {
                        obj[attribute.name] = inputVal
                    }
                }

            })

            return obj

        }

    })

    return {
        validators,
        factories,
        serializers,
        deserializers
    }
}
