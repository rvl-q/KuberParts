import axios from 'axios'

const baseurl = "http://proj01-svc.project:9999";
// const baseurl = "http://localhost:8081";

const healthCheck = async () => {
    // const response = await axios.get(`${baseurl}/healthz`)
    console.log('problems? health 0')
    function wait(ms) {
        return new Promise((_, reject) => {
           setTimeout(() => reject(new Error('timeout succeeded')), ms);
        });
    }
    console.log('problems? health 1')
    try {
        // const response = await Promise.race([wait(500), axios.get(`${baseurl}/todos`)]);
        const response = await Promise.race([wait(500), axios.get(`${baseurl}/healthz`)]);
        console.log('response', response)
        return 200
    } catch {
        console.log('problem!')
        return 500
    }
}

export default { healthCheck }