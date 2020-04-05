const {DEFAULT_TYPES} = require('./../consts.js')

module.exports = function validateSchemaModels (models) {

    var modelNameOccourances = new Set()

    // first pass index model names
    models.forEach(({name, attributes}) => {
        if(modelNameOccourances.has(name)) {
            throw new Error(`duplicate model name "${name}" detected. Model names must be unique.`)
        }
        modelNameOccourances.add(name)
    })
    
    // second pass validate attributes
    models.forEach(({name, attributes}) => { 
        
        var attributeOccourances = new Set()

        attributes.forEach((attribute) => {

            if(!attribute.name) {
                throw new Error(`attributes must have a name. Detected in model "${name}".`)
            }

            if(!attribute.type) {
                throw new Error(`attributes must have a type (or a collection). Detected in model "${name}".`)
            }

            
            if(attributeOccourances.has(attribute.name)) {
                throw new Error(`duplicate attribute name "${name}". Detected in model "${name}".`)
            }
            
            if(DEFAULT_TYPES.indexOf(attribute.type) === -1 && !modelNameOccourances.has(attribute.type)) {
                throw new Error(`unknown attribute type detected "${attribute.type}". Detected in model "${name}".`)
            }

        })
    })
}