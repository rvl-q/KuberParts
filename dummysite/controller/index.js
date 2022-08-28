const k8s = require('@kubernetes/client-node')
const JSONStream = require('json-stream')
const request = require('request')
const mustache = require('mustache')
const fs = require('fs').promises

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts = {};
kc.applyToRequest(opts);

// console.log(kc)

const sendRequestToApi = async (api, method = 'get', options = {}) => new Promise((resolve, reject) => request[method](`${kc.getCurrentCluster().server}${api}`, {...opts, ...options, headers: { ...options.headers, ...opts.headers }}, (err, res) => err ? reject(err) : resolve(JSON.parse(res.body))))

const getIngYAML = async (fields) => {
    const deploymentTemplate = await fs.readFile("ingress.mustache", "utf-8")
    return mustache.render(deploymentTemplate, fields)
  }

  const getDefIngYAML = async (fields) => {
    const deploymentTemplate = await fs.readFile("defaultingress.mustache", "utf-8")
    return mustache.render(deploymentTemplate, fields)
  }

const k8sApi = kc.makeApiClient(k8s.CoreV1Api)
const k8sDepApi = kc.makeApiClient(k8s.AppsV1Api)

function initStatusLoop() {
    const stream = new JSONStream()
    stream.on('data', async ({ type, object }) => {
        console.log('type', type)
        if (type === 'ADDED') {
            const fields = {
                website_url: object.spec.website_url,
                name: object.metadata.name,
                namespace: object.metadata.namespace || 'default',
                image: object.spec.image,
                rawnamespace: object.metadata.namespace
            }
            try {
                if (await NoService(fields)) {
                    console.log('Creating service');
                    createService(fields)
                } else {
                    console.log('Service ok');
                }
                if (await NoIngress(fields)) {
                    console.log('Creating ingress');
                    createIngress(fields)    
                } else {
                    console.log('Ingress ok');
                }
                if (await NoDeployment(fields)) {
                    console.log('Creating deployment');
                    createDeployment(fields)
                } else {
                    console.log('Deployment ok');
                }
            } catch (error) {
                console.log('watch loop error', JSON.stringify(error.stack).length)
                console.log('error')
            }
        } else if (type === 'DELETED') {
            const fields = {
                website_url: object.spec.website_url,
                name: object.metadata.name,
                namespace: object.metadata.namespace || 'default',
                image: object.spec.image,
            }
            try {
                console.log('else')
                removeDeployment(fields)
                console.log('removed')
            } catch (error) {
                console.log('watch loop DELETE error', JSON.stringify(error))
                console.log('error')
            }
        }
    })
    request.get(`${kc.getCurrentCluster().server}/apis/stable.dwk/v1/dummysites?watch=true`, opts).pipe(stream)
}

const NoService = async (fields) => {
    const { namespace } = fields
    const { items } = await sendRequestToApi(`/api/v1/namespaces/${namespace}/services`)
    // console.log('NoSer 007', items)
    if (!items) { return true } else {console.log('NoSer 3',(items.find(item => item.metadata.name === `${fields.name}-svc`))) ; return typeof (items.find(item => item.metadata.name === `${fields.name}-svc`)) === 'undefined' }
}

const NoIngress = async (fields) => {
    // console.log('NoIng 1');
    const { name, namespace } = fields
    const { items } = await sendRequestToApi(`/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`)
    // console.log('NoIng 007', items)
    if (!items) { console.log('NoIng 2'); return true } else { console.log('NoIng 3', (items.find(item => item.metadata.name === `${name}-ing`)) ); return typeof (items.find(item => item.metadata.name === `${name}-ing`)) === 'undefined' }
}
  
const NoDeployment = async (fields) => {
    // console.log('NoDep 1')
    const { name, namespace } = fields
    const { items } = await sendRequestToApi(`/apis/apps/v1/namespaces/${namespace}/deployments`)
    // console.log('NoDep 007', items)
    if (!items) { console.log('NoDep 2'); return true } else { console.log('NoDep 3', (items.find(item => item.metadata.name === `${fields.name}-dep`))); return typeof (items.find(item => item.metadata.name === `${name}-dep`)) === 'undefined' }
}

async function createService(fields) {
    await k8sApi.createNamespacedService(fields.namespace, {
        apiVersions: 'v1',
        kind: 'Service',
        metadata: {
            name: `${fields.name}-svc`,
        },
        spec: {
            type: 'ClusterIP',
            selector: {
                app: fields.name,
            },
            ports: [{
                port: 2345,
                protocol: 'TCP',
                targetPort: 3000,
            }]
        }
    }).catch(error => {
        console.log('svc create error')
        console.log(JSON.stringify(error, ["message", "response"]));
    })
}

async function createIngress(fields) {
    // let yaml
    const yaml = fields.namespace === 'default' ? await getDefIngYAML(fields) : await getIngYAML(fields)
    console.log('mustaassi:\n', yaml)
    sendRequestToApi(`/apis/networking.k8s.io/v1/namespaces/${fields.namespace}/ingresses`, 'post', {
        headers: {
          'Content-Type': 'application/yaml'
        },
        body: yaml
    }).catch(error => {
        console.log('ingress creating error')
        console.log(JSON.stringify(error));
    })
}

async function createDeployment(fields) {
    await k8sDepApi.createNamespacedDeployment(fields.namespace, {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name: `${fields.name}-dep`,
            namespace: `${fields.namespace}`
        },
        spec: {
            selector: {
                matchLabels: {
                    app: fields.name
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: fields.name
                    }
                },
                spec: {
                    containers: [{
                        name: 'dummysite-app',
                        image: `${fields.image}`,
                        env: [{
                            name: 'URL',
                            value: fields.website_url
                        }]
                    }]
                }
            }
        }
    }).catch(error => {
        console.log('create deployment error')
        console.log(JSON.stringify(error, ["message", "response"]));
    })
}


/*
deleteNamespacedDeployment(name: string, namespace: string, pretty?: string, dryRun?: string, 
    gracePeriodSeconds?: number, orphanDependents?: boolean, propagationPolicy?: string, 
    body?: V1DeleteOptions, options?: { headers: {} }): Promise<{ body: V1Status; response: IncomingMessage }>

deleteNamespacedDeployment("nginx", NAMESPACE, null, null, null, null, null, null);
*/
async function removeDeployment(fields) {
    await k8sDepApi.deleteNamespacedDeployment( `${fields.name}-dep`,
        fields.namespace,
        null, null, null, null, null, null
    ).catch(error => {
        console.log('deployment remove error')
        console.log(JSON.stringify(error));
    })
}

initStatusLoop()