
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

    // initialize models
    // --------------------------------------------
    models.forEach(model => {

        factories[model.name] = (obj = {}) => {

            var output = {}

            model.attributes.forEach(attribute => {
                var { name, type, defaultValue, collection } = attribute

                if(collection) {
                    defaultValue = []
                }

                var factory = factories[type],
                    validator = validators[type],
                    inputValue = obj[name],
                    poopinValue = typeof inputValue === 'undefined' ? defaultValue : obj[name],
                    testValue = factory && !collection ? factory(poopinValue) : poopinValue,
                    isValid = collection ? (() => {
                        var valid = Array.isArray(testValue)
                        if(valid && testValue.length) {
                            testValue.forEach(_obj => {
                                if(!validator(_obj)) {
                                    valid = false
                                }
                            })
                        }
                        return valid
                    })() : validator(testValue)

                console.log('')
                console.log('FACTORY ------------------'.yellow)
                console.log('model:         '.grey, model.name.green)
                console.log('attribute:     '.grey, attribute.name.green)
                console.log('attribute type:'.grey, type.green)
                console.log('collection:    '.grey, !!collection ? "true".blue : "false".red)
                console.log('defaultValue:  '.grey, defaultValue)
                console.log('inputValue:    '.grey, inputValue)
                console.log('poopinValue:   '.grey, poopinValue)
                console.log('testValue:     '.grey, testValue)
                console.log('isValid:       '.grey, isValid ? "true".blue : "false".red)
                
                console.log('validator:     '.blue, validator)
                console.log('factory:       '.blue, factory)

                if (!isValid) {
                    if(factory) {
                        output[name] = factory(testValue)
                    } else {
                        throw new Error(`missing or invalid attrubute "${testValue}" for attribute "${name}" while constructing model "${model.name}". Expected type "${type}".`)
                    }
                } else {
                    if(factory && !collection) {
                        output[name] = factory(testValue)
                    } else {
                        output[name] = testValue
                    }
                }

            })
            // console.log('--')
            // console.log(output[name])
            // console.log('--')

            // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~'.yellow)

            return output
        }

        validators[model.name] = obj => {

            var modelisValid = true

            model.attributes.forEach(attribute => {

                var attrValid = false,
                    inputValue = obj[attribute.name],
                    validator = validators[attribute.type],
                    defaultValue = attribute.collection ? [] : attribute.defaultValue
                    

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
                    
                    inputValue = Array.isArray(inputValue) ? inputValue : defaultValue

                    var collectionValid = !inputValue.some((_obj, i) => {
                            console.log(`${model.name} : ${attribute.name} : ${inputValue}`)
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

    })

    return {
        validators,
        factories
    }
}
