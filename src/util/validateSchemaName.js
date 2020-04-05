module.exports = function validateSchemaName (name) {
    if(typeof name !== "string" || name.length < 1) {
        throw new Error(`Invalid schema name`)
    }
}