const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
ajv.addSchema(require('./defs.json'))
const validatePayByPrime = ajv.compile(require('./pay-by-prime.json'))


app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/pay-by-prime',
    // validator
    (req, res, next) => {
        const valid = validatePayByPrime(req.body)
        if (!valid) {
            res.json({
                status: 401,
                msg: 'wrong json format',
                error: validatePayByPrime.errors
            })
            return
        }
        next()
    },
    (req, res) => {
        res.json({
            status: 0,
            msg: 'ok'
        })
    })

app.listen(3000, () => console.log('Example app listening on port 3000!'))