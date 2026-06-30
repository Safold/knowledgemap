const container = document.getElementById('graph');
const options = {}
let nodes, edges, info;

  fetch('data.json')
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => console.error('Failed to load data.json:', error))

function processData(data) {
  nodes = data.map(item => ({ id: item.id, label: item.title }))
  edges = new vis.DataSet(
    data
      .map(item => ({ from: item.id, to: item.parent }))
      .filter(edge => edge.to !== '')
  )
  info = data.map(item => ({ id: item.id, title: item.title, description: item.description, related: item.related }))
  
  const dataset = { nodes, edges }
  const network = new vis.Network(container, dataset, options)
  
  network.on("click", function (params) {
    if (params.nodes.length === 0) return;
    document.getElementById('node-title').textContent = info.find(item => item.id === params.nodes[0]).title
    document.getElementById('node-description').textContent = info.find(item => item.id === params.nodes[0]).description
    document.getElementById('node-related').textContent = info.find(item => item.id === params.nodes[0]).related
    document.getElementById('info-panel').classList.add('open')
  })}
