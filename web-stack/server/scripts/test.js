const client = require('../database/client')

const id = 'unit_3'

client.wrap(async () => {
  const [{ data }] = await client.devices.findOne(
    { id },
    {
      projection: {
        data: {
          $function: {
            body: function (data) {
              return data
            },
            args: ['$standardData'],
            lang: 'js',
          },
        },
      },
    }
  )
})
