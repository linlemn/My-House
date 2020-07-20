import * as THREE from 'three'
import React, { Component } from 'react';
import './HouseTemplate.css'

import sofa from './icons/sofa.png'
import table from './icons/table.png'
import chair from './icons/chair.png'
import lamp from './icons/lamp.png'
import bookshelf from './icons/bookshelf.png'
import camera from './icons/camera.png'
import album from './icons/album.svg'
import gallery from './icons/gallery.svg'

import Modal from 'react-modal';
import {OBJLoader, MTLLoader} from 'three-obj-mtl-loader';
const ThreeBSP = require('tthreebsp')(THREE)


class HouseTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            currentItem: -1,
            loading: false,
            items: []
        }
    }
    componentDidMount() {
        this.init()
        // document.getElementsByClassName('select-video')[0].setAttribute('capture', 'user')
    }

    init = () => {
        const scene =  new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 75, this.mount.clientWidth / this.mount.clientHeight, 0.1, 1000 );
        camera.lookAt(scene.position);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor('rgb(247, 245, 228)',1.0)
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        renderer.setSize(this.mount.clientWidth, this.mount.clientHeight );
        renderer.shadowMap.enabled = true;
        this.mount.appendChild( renderer.domElement );
        camera.position.z = 1.7;
        camera.position.y = 0;

        const light1 = new THREE.PointLight(0xffffff, 1.4);
        light1.position.set(0, 7, 4);
        scene.add(light1);

        const shadowLight = new THREE.DirectionalLight(0xffffff, 1)
        shadowLight.position.set(0, 350, -350);
        shadowLight.castShadow = true;
        shadowLight.shadow.camera.left = -400;
        shadowLight.shadow.camera.right = 400;
        shadowLight.shadow.camera.top = 400;
        shadowLight.shadow.camera.bottom = -400;
        shadowLight.shadow.camera.near = 1;
        shadowLight.shadow.camera.far = 1000;
        shadowLight.shadow.mapSize.width = 2048;
        shadowLight.shadow.mapSize.height = 2048;
        scene.add(shadowLight);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
        light2.position.set(10, 4, 4);
        scene.add(light2);
        // const light3 = new THREE.PointLight(0xffffff, 0.5);
        // light3.position.set(0, 0, 10);
        // scene.add(light2);

        scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

        // const loader = new THREE.TextureLoader();
        // const bgTexture = loader.load(process.env.PUBLIC_URL + '/images/bg3.jpg'); 
        // scene.background = bgTexture;
      
        this.createRoom()
        this.createIcon()
        this.animate()
    }

    createRoundRect = (x, y, width, height, radius) => {
        const shape = new THREE.Shape()
        shape.moveTo( x, y + radius );
        shape.lineTo( x, y + height - radius );
        shape.quadraticCurveTo( x, y + height, x + radius, y + height );
        shape.lineTo( x + width - radius, y + height) ;
        shape.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
        shape.lineTo( x + width, y + radius );
        shape.quadraticCurveTo( x + width, y, x + width - radius, y );
        shape.lineTo( x + radius, y );
        shape.quadraticCurveTo( x, y, x, y + radius );
        return shape
    }

    createIcon = () => {
        const geom1 = new THREE.CircleGeometry(0.3, 360)
        const loader = new THREE.TextureLoader()
        const texture = loader.load(require('./icons/sofa.png')) 
        const material = new THREE.MeshBasicMaterial( { map: texture } )
        material.transparent = true
        const mesh = new THREE.Mesh( geom1, material )
        // this.scene.add(mesh)
    }

    createRoom = () => {

        // floor
        const geometry1 = new THREE.BoxGeometry(8, 4, 2);
        const geometry2 = new THREE.BoxGeometry(8, 4, 2);
        // const material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#E8CACD') } );
        const material = new THREE.MeshLambertMaterial( { color: new THREE.Color('#ffffff') } )
        const mesh1 = new THREE.Mesh( geometry1, material );
        const mesh2 = new THREE.Mesh( geometry2, material );
        mesh1.position.set(0,0.1,0)
        const mesh1BSP = new ThreeBSP(mesh1)
        const mesh2BSP = new ThreeBSP(mesh2)
        const resultBSP = mesh1BSP.subtract(mesh2BSP)
        const result = resultBSP.toMesh()
        // const loader = new THREE.TextureLoader()
        // const texture = loader.load(require('./images/default_floor.jpeg')); 
        // const resMaterial = new THREE.MeshLambertMaterial( { map: texture } );
        result.geometry.computeFaceNormals()
        result.geometry.computeVertexNormals()
        result.material = material
        this.result = result
        result.rotation.set(-Math.PI,0,0)
        result.position.set(0.01,0,-2)
        this.scene.add(result) 
        
        //walls
        const geometry3 = new THREE.BoxGeometry(8, 4, 2);
        const geometry4 = new THREE.BoxGeometry(7.80, 4, 2);
        // const wallMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color('#E4B56A') } );
        const wallMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color('#EFD0D6') } );
        const mesh3 = new THREE.Mesh( geometry3, wallMaterial );
        const mesh4 = new THREE.Mesh( geometry4, wallMaterial );
        mesh3.position.set(0,0,0.1);
        const mesh3BSP = new ThreeBSP(mesh3);
        const mesh4BSP = new ThreeBSP(mesh4);
        var wallResultBSP = mesh3BSP.subtract(mesh4BSP);
        const geometry5 = new THREE.BoxGeometry(2.1, 3.9, 2.2);
        // const wdMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color('#D6AF9C'), shininess:5} );
        const wdMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color('#FFFFFF'), shininess:5} );
        const mesh5 = new THREE.Mesh( geometry5, wdMaterial );
        mesh5.position.set(-2, 0.1, 0);
        const mesh5BSP = new ThreeBSP(mesh5);
        wallResultBSP = wallResultBSP.subtract(mesh5BSP);
        const wallResult = wallResultBSP.toMesh()
        wallResult.geometry.computeFaceNormals()
        wallResult.geometry.computeVertexNormals()
        wallResult.material = wallMaterial
        this.wallResult = wallResult
        wallResult.rotation.set(-Math.PI,0,0)
        wallResult.position.set(0.01,0,-2)
        this.scene.add(wallResult) 

        // windows

        // let mtlLoader = new MTLLoader();
        // mtlLoader.setPath(process.env.PUBLIC_URL);
        // mtlLoader.load('file.mtl', materials => {
        //     const objLoader = new OBJLoader();
        //     // objLoader.setMaterials(materials);
        //     objLoader.load(process.env.PUBLIC_URL + '/file.obj', (root) => {
        //         root.material = wdMaterial
        //         root.scale.x =  root.scale.y =  root.scale.z = 0.0007
        //         root.position.set(-1.99, 0, -2.98);
        //         root.updateMatrix();
        //         this.scene.add(root);
        //     });
        // });
    

        const geometry6 = new THREE.BoxGeometry(2.1, 4, 0.06);
        const mesh6 = new THREE.Mesh( geometry6, wdMaterial );
        // mesh6.position.set(-1.99, 0, -2.98);
        const geometry7 = new THREE.BoxGeometry(0.9, 3.6, 1);
        const mesh7 = new THREE.Mesh( geometry7, wdMaterial );
        mesh7.position.set(0.5, 0, 0.03);
        const mesh8 = new THREE.Mesh( geometry7, wdMaterial );
        mesh8.position.set(-0.5, 0, 0.03);
        const mesh6BSP = new ThreeBSP(mesh6);
        const mesh7BSP = new ThreeBSP(mesh7);
        const mesh8BSP = new ThreeBSP(mesh8);
        var wdResultBSP = mesh6BSP.subtract(mesh7BSP);
        wdResultBSP = wdResultBSP.subtract(mesh8BSP);
        const wdResult = wdResultBSP.toMesh();
        wdResult.geometry.computeFaceNormals()
        wdResult.geometry.computeVertexNormals()
        wdResult.material = wdMaterial;
        this.wdResult = wdResult
        wdResult.position.set(-1.99, 0, -2.98);
        this.scene.add(wdResult);
        
    }

    animate =() => {
        requestAnimationFrame( this.animate );
        // this.icon.rotation.x += 0.01;
        // this.icon.rotation.y += 0.01;
        // this.line.rotation.x += 0.02
        this.renderer.render( this.scene, this.camera );
      }
  
    componentWillUnmount() {
          this.mount.removeChild(this.renderer.domElement)
    }

    toggleModal = event => {
        event.preventDefault();
        console.log("NESTEDMODAL", event);
        this.setState({
          items: [],
          modalIsOpen: !this.state.modalIsOpen,
          loading: true
        });
      }
    
    handleOnAfterOpenModal = () => {
    // when ready, we can access the available refs.
    (new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), 500);
    })).then(res => {
        this.setState({
        items: [1, 2, 3, 4, 5].map(x => `Item ${x}`),
        loading: false
        });
    });
    }

    render() {
        const { modalIsOpen } = this.state
          return (
              <div
                  className= "canvas"
                  ref={(mount) => { this.mount = mount }}
              >
                  <img className="icon sofa" id="sofa" src={sofa} onClick={this.toggleModal} />
                  <img className="icon table" id="table" src={table} onClick={this.toggleModal} />
                  <img className="icon chair" id="chair" src={chair} onClick={this.toggleModal} />
                  <img className="icon lamp" id="lamp" src={lamp} onClick={this.toggleModal} />
                  <img className="icon bookshelf" id="bookshelf" src={bookshelf} onClick={this.toggleModal} />
                  <Modal
                    closeTimeoutMS={150}
                    contentLabel="modalA"
                    isOpen={modalIsOpen}
                    onAfterOpen={this.handleOnAfterOpenModal}
                    onRequestClose={this.toggleModal}
                    ariaHideApp={true}
                    style={{
                        content: {
                            position: 'absolute',
                            top: '20%',
                            left: '30%',
                            right: '30%',
                            bottom: '20%',
                            backgroundColor: 'rgba(255, 255, 255)',
                            border: 'None',
                            boxShadow: '5px 5px 10px rgba(0,0,0,0.25)',
                            borderRadius: '10%',
                          }
                    }}
                    >
                    {
                    <div className="selection-wrapper">
                        <img className="selection" src={camera} />
                        <input type="file" accept="image/*" capture="camera" />  
                        <img className="selection" src={album} />
                        <img className="selection" src={gallery} />
                    </div>
                    }
                    </Modal>
                </div>
          );
    }
}

class Item extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
    }
  
    toggleModal = index => event => {
      console.log("NESTED MODAL ITEM", event);
      this.setState({
        itemNumber: !this.state.isOpen ? index : null,
        isOpen: !this.state.isOpen
      });
    };

    displaySelection = selection => {
      const toggleModal = this.toggleModal(this.props.index);
      switch (selection) {
        case 'camera':
          return <div className="selection" key={selection}>
          <img src={camera} /> 
          <input type="file" accept="image/*" capture="camera" />  
        </div>
        case 'gallery':
          return <div className="selection" key={selection} onClick={toggleModal}>
          <img src={gallery} /> 
        </div>
        case 'album':
          return  <div className="selection" key={selection}>
            <img src={album} /> 
            <input type="file" accept="image/*" />  
          </div>
        default:
          return
      }
    }

    transformRequest =  (data) => {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
  }

    handleOnAfterOpenModal = () => {
      const {type} = this.props
      fetch('/photos/gallery', {
        method: 'post',
        body: this.transformRequest({
          category: _SUPER_CATEGORIES_3D[type]
        }),
        mode: 'cors',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }, 
      }).then(function (response) {
        console.log(response);
        this.setState({
          loading: false
        })
      })
      .catch(function (error) {
        console.log(error);
      });
      // axios.post('/photos/gallery', qs.stringify({
      //   category: _SUPER_CATEGORIES_3D[selection]
      // }))
      // .then(function (response) {
      //   console.log(response);
      //   this.setState({
      //     loading: false
      //   })
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });

      // // when ready, we can access the available refs.
      // (new Promise((resolve, reject) => {
      //     setTimeout(() => resolve(true), 500);
      // })).then(res => {
      //     this.setState({
      //     // items: [1, 2, 3, 4, 5].map(x => `Item ${x}`),
      //     // items: ['gallery', 'camera', 'album'],
      //     loading: false
      //     });
      // });
      }

    displayModalContent = selection => {
      switch (selection) {
        case 'camera':
          return <img src={camera} /> 
        case 'gallery':
          return  <div className="gallery-wrapper">
            
          </div>
         
        case 'album':
          return <img src={album} /> 
        default:
          return
      }
    }
  
    render() {
      const { isOpen, itemNumber } = this.state;
      const { number, index } = this.props;
  
      const toggleModal = this.toggleModal(index);
  
      return (
        <div key={index} onClick={toggleModal}>
          <a href="javascript:void(0)">{number}</a>
          <Modal closeTimeoutMS={150}
                 contentLabel="modalB"
                 isOpen={isOpen}
                 onRequestClose={toggleModal}
                 ariaHideApp={true}
                 aria={{
                   labelledby: "item_title",
                   describedby: "item_info"
                 }}>
            <h1 id="item_title">Item: {itemNumber + 1}</h1>
            <div id="item_info">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pulvinar varius auctor. Aliquam maximus et justo ut faucibus. Nullam sit amet urna molestie turpis bibendum accumsan a id sem. Proin ullamcorper nisl sapien, gravida dictum nibh congue vel. Vivamus convallis dolor vitae ipsum ultricies, vitae pulvinar justo tincidunt. Maecenas a nunc elit. Phasellus fermentum, tellus ut consectetur scelerisque, eros nunc lacinia eros, aliquet efficitur tellus arcu a nibh. Praesent quis consequat nulla. Etiam dapibus ac sem vel efficitur. Nunc faucibus efficitur leo vitae vulputate. Nunc at quam vitae felis pretium vehicula vel eu quam. Quisque sapien mauris, condimentum eget dictum ut, congue id dolor. Donec vitae varius orci, eu faucibus turpis. Morbi eleifend orci non urna bibendum, ac scelerisque augue efficitur.</p>
            </div>
          </Modal>
        </div>
      );
    }
  }
  
  class List extends Component {
    render() {
      return this.props.items.map((n, index) => (
        <Item key={index} index={index} number={n} />
      ));
    }
  }
  
  
//   class NestedModals extends Component {
//     constructor(props) {
//       super(props);
  
//       this.state = {
//         isOpen: false,
//         currentItem: -1,
//         loading: false,
//         items: []
//       };
//     }
  
//     toggleModal = event => {
//       event.preventDefault();
//       console.log("NESTEDMODAL", event);
//       this.setState({
//         items: [],
//         isOpen: !this.state.isOpen,
//         loading: true
//       });
//     }
  
//     handleOnAfterOpenModal = () => {
//       // when ready, we can access the available refs.
//       (new Promise((resolve, reject) => {
//         setTimeout(() => resolve(true), 500);
//       })).then(res => {
//         this.setState({
//           items: [1, 2, 3, 4, 5].map(x => `Item ${x}`),
//           loading: false
//         });
//       });
//     }
  
//     render() {
//       const { isOpen } = this.state;
//       return (
//         <div>
//           <Modal
//             id="test"
//             closeTimeoutMS={150}
//             contentLabel="modalA"
//             isOpen={isOpen}
//             onAfterOpen={this.handleOnAfterOpenModal}
//             onRequestClose={this.toggleModal}>
//             <h1>List of items</h1>
//             {this.state.loading ? (
//               <p>Loading...</p>
//             ) : (
//               <List items={this.state.items} />
//             )}
//           </Modal>
//         </div>
//       );
//     }
//   }

export default HouseTemplate;