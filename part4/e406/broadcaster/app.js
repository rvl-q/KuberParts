const NATS = require('nats')
const natsSC = NATS.StringCodec()
const botKey = process.env.TELEGRAM_KEY
const HOSTNAME = process.env.HOSTNAME
const chatId = -1001182325354 // bot testing 123

console.log('Broadcaster started:', HOSTNAME)
NATS.connect({servers: process.env.NATS_URL ?? 'nats://my-nats.default:4222'})
    .then(async (conn) => {
        // console.log('Sending message: 1')
        const sub = conn.subscribe('todo_status', { queue: 'broadcaster.workers' }) 
        // console.log('Sending message: 2', sub)
        for await (const message of sub) {
            console.log(`Sending message: ${natsSC.decode(message.data)}`)
            const m_json = encodeURIComponent(natsSC.decode(message.data))
            await fetch(`https://api.telegram.org/bot${botKey}/sendMessage?chat_id=${chatId}&text=${m_json}%0A%0ASent%20by:%20${HOSTNAME}`)
            // console.log('Sending message: 4')
        }
    })