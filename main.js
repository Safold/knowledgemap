const container = document.getElementById('graph');
const options = {
   layout: {
    randomSeed: undefined,
    improvedLayout:true,
    clusterThreshold: 150,
    hierarchical: {
      enabled:true,
      levelSeparation: 150,
      nodeSpacing: 100,
      treeSpacing: 400,
      blockShifting: false,
      edgeMinimization: false,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'directed',  // hubsize, directed
      shakeTowards: 'roots'  // roots, leaves
    }
  },
    physics:{
      enabled: true,
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 100,
        springConstant: 0.01,
        nodeDistance: 120,
        damping: 0.09,
        avoidOverlap: 0
      }
    },
    interaction: {
      dragNodes: false,
      dragView: true,
      zoomView: true
    },
    nodes: {
      fixed: false,
      color: {
        border: '#49e0e8',
        background: '#282671',
        highlight: {
          border: '#49e0e8',
          background: '#282671'},
      },
      font: {
        color: 'rgb(252, 252, 252)',
      },
      shape: 'box',
    }
}
let nodes, edges, info;

  fetch('data.json')
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => console.error('Failed to load data.json:', error))

function processData(data) {
  nodes = data.map(item => ({ id: item.id, label: item.title }))
  edges = new vis.DataSet(
    data
      .map(item => ({ from: item.parent, to: item.id }))
      .filter(edge => edge.to !== '')
  )
  info = data.map(item => ({ id: item.id, title: item.title, description: item.description, related: item.related }))
  
  const dataset = { nodes, edges }
  const network = new vis.Network(container, dataset, options)
  
  network.on("click", function (params) {
    if (params.nodes.length === 0) return;
    document.getElementById('node-title').textContent = info.find(item => item.id === params.nodes[0]).title
    document.getElementById('node-description').textContent = info.find(item => item.id === params.nodes[0]).description
    
    
    // Тут я получаю массив Айди связанных узлов
    let relatedId = info.find(item => item.id === params.nodes[0]).related
    console.log('Related ID:', relatedId)
    //Тут я через Айди вытягиваю названия узлов и создаю массив названий связанных узлов
    let relatedTitles = relatedId.map(id => info.find(item => item.id === id)?.title || ' ')
    console.log('Related Titles:', relatedTitles)
    // Здесь я через map прохожусь по массиву названий и поочередно вставляю в отдельный а тег и присоединяю перенос строки через join
    document.getElementById('node-related').innerHTML = relatedTitles.map(title => `<a href="#" data-id="${info.find(item => item.title === title)?.id || ''}">${title}</a>`).join('<br>')
    
    
    document.getElementById('info-panel').classList.add('open')
  })
      
  
  document.getElementById('node-related').addEventListener('click', function(event){
    if (event.target.tagName === 'A'){
      const id = event.target.dataset.id
      network.setSelection({nodes: [id]})
      network.focus(id, {scale: 1.5, locked: false, animation: {duration: 1000, easingFunction: 'easeInOutQuad'}})
           
        
      }
    })

}


// Теперь мне нужно чтобы при нажатии на ссылку срабатывала setSelection и focus из vis.js. Помимо этого срабатывала смена контекста как при клике на узел
// Для этого я добавляю обработчик события на ссылки, беру их тайтл, снова нахожу айди и передаю в setSelection и focus. После этого вызываю функцию которая обновляет контекст панели информации.