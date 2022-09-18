interface FieldOptions {
    required?: boolean
    type: string
}

/**
 * This will validate the type of the fields in a PATCH request body, and strip unnecessary fields.
 * @param data The request data
 * @param fields The fields, with the key being the field name and value being the type.
 */
export default function validateRequestBody(data: any, fields: Record<string, FieldOptions>): any {

    const newData = {}

    for (const field of Object.keys(fields)) {
        // Data has field?
        if (data[field]) {
            //type is correct?
            if (typeof data[field] === data[field].type) throw TypeError(`Field ${field} is not of type ${data[field].type}`)
            newData[field] = data[field]
        }
    }

    return newData
}