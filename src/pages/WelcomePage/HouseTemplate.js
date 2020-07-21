import * as THREE from 'three'
import React, { Component } from 'react';
import './HouseTemplate.css'

import sofa from './icons/sofa.png'
import table from './icons/table.png'
import chair from './icons/chair.png'
import lamp from './icons/lamp.png'
import bookshelf from './icons/bookshelf.png'
import camera from './icons/camera.svg'
import album from './icons/album.svg'
import gallery from './icons/gallery.svg'
import refresh from './icons/refresh.svg'

import Modal from 'react-modal';
import {OBJLoader, MTLLoader} from 'three-obj-mtl-loader';
import Zmage from 'react-zmage'

const ThreeBSP = require('tthreebsp')(THREE)

const _SUPER_CATEGORIES_3D =
{
  'bookshelf': 1,
  'sofa': 5,
  'chair': 3,
  'lamp': 7,
  'table': 4
}
//  [
//   {'id': 1, 'category': 'Cabinet/Shelf/Desk'},
//   {'id': 2, 'category': 'Bed'},
//   {'id': 3, 'category': 'Chair'},
//   {'id': 4, 'category': 'Table'},
//   {'id': 5, 'category': 'Sofa'},
//   {'id': 6, 'category': 'Pier/Stool'},
//   {'id': 7, 'category': 'Lighting'},
// ]

class HouseTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            currentItem: -1,
            loading: false,
            clickType: -1,
            items: ['gallery', 'camera', 'album'],
        }
    }
    componentDidMount() {
        this.init()
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

        // this.loadObj(`${process.env.PUBLIC_URL}/0000033.obj`, `${process.env.PUBLIC_URL }/0000033.png`)
      
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
        const geometry5 = new THREE.BoxGeometry(8, 3.6, 1.4);
        // const wdMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color('#D6AF9C'), shininess:5} );
        const wdMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color('#FFFFFF'), shininess:5} );
        const mesh5 = new THREE.Mesh( geometry5, wdMaterial );
        // mesh5.position.set(-2, 0.1, 0);
        mesh5.position.set(1, 0, 0);
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
    

        const geometry6 = new THREE.BoxGeometry(0.1, 3.6, 1.4);
        const mesh6 = new THREE.Mesh( geometry6, wdMaterial );
        // mesh6.position.set(-1.99, 0, -2.98);
        const geometry7 = new THREE.BoxGeometry(0.1, 3.4, 0.6);
        const geometry8 = new THREE.BoxGeometry(0.1, 3.4, 0.6);
        const mesh7 = new THREE.Mesh( geometry7, wdMaterial );
        mesh7.position.set(0, 0, 0.35);
        const mesh8 = new THREE.Mesh( geometry8, wdMaterial );
        mesh8.position.set(0, 0, -0.3);
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
        wdResult.position.set(4, 0, -1.9);
        this.scene.add(wdResult);
        
    }

    animate =() => {
        requestAnimationFrame( this.animate );
        if (this.obj) {
          this.obj.rotation.x += 0.01;
          // this.obj.rotation.y += 0.01;
        }
        
        // this.line.rotation.x += 0.02
        this.renderer.render( this.scene, this.camera );
      }
  
    componentWillUnmount() {
          this.mount.removeChild(this.renderer.domElement)
    }

    toggleModal = (id, event) => {
        event.preventDefault();
        this.setState({
          modalIsOpen: !this.state.modalIsOpen,
          loading: true,
          clickType: id
        });
      }
    
    handleOnAfterOpenModal = () => {
    // when ready, we can access the available refs.
    (new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), 500);
    })).then(res => {
        this.setState({
        loading: false
        });
    });
    }

    loadObj = (objUrl, mtlUrl) => {

      const loader = new OBJLoader()

      loader.load(objUrl, geometry => {
        var material = new THREE.MeshLambertMaterial({color: 0x5C3A21});

      geometry.traverse( function (child) {
          if ( child instanceof THREE.Mesh ) {
              child.material.map = THREE.ImageUtils.loadTexture(mtlUrl);
              child.material.needsUpdate = true;
          }
      });

           // geometry is a group of children. If a child has one additional child it's probably a mesh
           geometry.children.forEach(function (child) {
               if (child.children.length == 1) {
                   if (child.children[0] instanceof THREE.Mesh) {
                       child.children[0].material = material;
                   }
               }
           });

           geometry.scale.set(1, 1, 1);
           geometry.rotation.x = -2;
           this.obj = geometry
           this.scene.add(geometry);
       });
    }

    getChildrenMsg = (children, msg) => {
      this.setState({
        childrenMsg: msg
      })
    }

    render() {
        const { modalIsOpen, items, loading, clickType } = this.state
          return (
              <div
                  className= "canvas"
                  ref={(mount) => { this.mount = mount }}
              >
                  <img className="icon sofa" id="sofa" src={sofa} onClick={e => {this.toggleModal('sofa', e)}} />
                  <img className="icon table" id="table" src={table} onClick={e => {this.toggleModal('table', e)}} />
                  <img className="icon chair" id="chair" src={chair} onClick={e => {this.toggleModal('chair', e)}} />
                  <img className="icon lamp" id="lamp" src={lamp} onClick={e => {this.toggleModal('lamp', e)}} />
                  <img className="icon bookshelf" id="bookshelf" src={bookshelf} onClick={e => {this.toggleModal('bookshelf', e)}} />
                  <Modal
                    closeTimeoutMS={150}
                    contentLabel="modalA"
                    isOpen={modalIsOpen}
                    onAfterOpen={this.handleOnAfterOpenModal}
                    onRequestClose={e => {this.toggleModal(clickType, e)}}
                    ariaHideApp={false}
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
                      <div className="selection-wrapper">
                        {loading ? (
                          <p>Loading...</p>
                          ) : (
                          <List items={items} type={clickType} parent={this} />
                          )
                        }
                      </div>
                    </Modal>
                </div>
          );
    }
}

class Item extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
        loading: true,
        browsing: false,
        count: 0,
      };
    }
  
    toggleModal = index => event => {
      this.setState({
        isOpen: !this.state.isOpen,
      });
      console.log("NESTED MODAL ITEM", index, this.state.isOpen);
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

    shuffle = arr => {
      for (let i = 1; i < arr.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    return arr
    }


    handleOnAfterOpenModal = async () => {
      const { type } = this.props

      try {
        const res = await fetch('/photos/gallery', {
          method: 'post',
          body: this.transformRequest({
            category: _SUPER_CATEGORIES_3D[type]
          }),
          mode: 'cors',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
          }, 
        })
        const resJson = await res.json()

        let galleryImages = []
        for (let i in resJson) {
          const cat = resJson[i]
          for (let j in cat) {
            galleryImages.push({
              src: `http://103.79.27.148:8001/${cat[j].image}`,
              alt: cat[j].style,
              mesh: cat[j].model,
              texture: cat[j].texture
            })
          }
        }

        this.setState({
          galleryImages: this.shuffle(galleryImages),
          loading: false,
          count: 0,
        })
       } catch (err) {
        console.log(err);
      }
    }

    onBrowsingClose = () => {
      const state = this.state.browsing
      this.setState({
        browsing: !state,
      }, () => {
        if (state) {
          const zmage = document.getElementById("zmage")
          zmage.parentNode.removeChild(zmage)
        }
      })
    }

    onGalleryImageClick = index => {
      const {selection, galleryImages} = this.props
      this.props.parent.getChildrenMsg(this, selection, galleryImages(index))
    }

    onRefreshClick = async () => {
      const { count, galleryImages } = this.state
      console.log(galleryImages)
      if ((galleryImages.length - 3) < count) {
        this.setState({
          loading: true,
        }, async () => {
          await this.handleOnAfterOpenModal()
        })
      }
      else 
        this.setState({
          count: count+3
        })
    }
  
    render() {
      const { isOpen, loading, galleryImages, browsing, count } = this.state;
      const { selection, index } = this.props;
      const toggleModal = this.toggleModal(index);
      return (
        <div className="selection-wrapper">
          {
            this.displaySelection(selection)
          }
          <Modal 
          contentLabel="modalB"
          isOpen={isOpen}
          onRequestClose={toggleModal}
          ariaHideApp={false}
          onAfterOpen={this.handleOnAfterOpenModal}
          style={{
            content: {
                position: 'absolute',
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
                backgroundColor: '#ffffff',
                border: 'None',
                boxShadow: '5px 5px 10px rgba(0,0,0,0.25)',
                borderRadius: '25px',
              }
          }}
          >
            {
              loading ? (<p> loading... </p>) : <div className="gallery-images-wrapper">
                <div className="gallery-image-wrapper" onClick={count => {
                  this.onGalleryImageClick(count)
                }}>
                   <Zmage
                    src={galleryImages[count].src}
                    alt="展示序列图片"
                    preset="mobile"
                    className="gallery-image"
                    browsing={browsing}
                    />
                  <div className="style-text">{galleryImages[count].alt}</div>
                 </div>
                 <div className="gallery-image-wrapper" onClick={count => {
                  this.onGalleryImageClick(count+1)
                  }}>
                   <Zmage
                    src={galleryImages[count+1].src}
                    alt="展示序列图片"
                    preset="mobile"
                    className="gallery-image"
                    browsing={browsing}
                    />
                  <div className="style-text">{galleryImages[count+1].alt}</div>
                 </div>
                 <div className="gallery-image-wrapper" onClick={count => {
                  this.onGalleryImageClick(count+2)
                  }}>
                   <Zmage
                    src={galleryImages[count+2].src}
                    alt="展示序列图片"
                    preset="mobile"
                    className="gallery-image"
                    browsing={browsing}
                    />
                  <div className="style-text">{galleryImages[count+2].alt}</div>
                 </div>
                  <img className="refresh" src={refresh} onClick={this.onRefreshClick} />
              </div>
             
            }
          </Modal>
        </div>
      );
    }
  }
  
  class List extends Component {
    render() {
      return this.props.items.map((selection, index) => (
        <Item key={index} index={index} selection={selection} type={this.props.type} parent={this.props.parent} />
      ));
    }
  }

export default HouseTemplate;