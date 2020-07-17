import * as THREE from 'three'
import React, { Component } from 'react';
import './HouseTemplate.css'
import sofa from './icons/sofa.png'
import table from './icons/table.png'
import chair from './icons/chair.png'
import lamp from './icons/lamp.png'
import bookshelf from './icons/bookshelf.png'
import ReactModal from 'react-modal';



const ThreeBSP = require('tthreebsp')(THREE)


class HouseTemplate extends Component {
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
        camera.position.z = 2;
        camera.position.y = 0;

        const light1 = new THREE.PointLight(0xffffff, 1.3);
        light1.position.set(0, 4, 4);
        scene.add(light1);

        const shadowLight = new THREE.DirectionalLight(0xffffff, .9)
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

        // const light2 = new THREE.PointLight(0xffffff, 1);
        // light2.position.set(0, -5, -3);
        // scene.add(light2);
        // const light3 = new THREE.PointLight(0xffffff, 0.5);
        // light3.position.set(0, 0, 10);
        // scene.add(light2);

        scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
      
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
        const material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#FDFFFD') } )
        const mesh1 = new THREE.Mesh( geometry1, material );
        const mesh2 = new THREE.Mesh( geometry2, material );
        mesh1.position.set(0,0.1,0)
        const mesh1BSP = new ThreeBSP(mesh1)
        const mesh2BSP = new ThreeBSP(mesh2)
        const resultBSP = mesh1BSP.subtract(mesh2BSP)
        const result = resultBSP.toMesh()
        const loader = new THREE.TextureLoader()
        const texture = loader.load(require('./images/default_floor.jpeg')); 
        const resMaterial = new THREE.MeshLambertMaterial( { map: texture } );
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
        mesh3.position.set(0,0,0.08)
        const mesh3BSP = new ThreeBSP(mesh3)
        const mesh4BSP = new ThreeBSP(mesh4)
        const wallResultBSP = mesh3BSP.subtract(mesh4BSP)
        const wallResult = wallResultBSP.toMesh()
        // const loader = new THREE.TextureLoader()
        // const texture = loader.load(require('./images/default_floor.jpg')); 
        // const resMaterial = new THREE.MeshPhongMaterial( { map: texture } );
        wallResult.geometry.computeFaceNormals()
        wallResult.geometry.computeVertexNormals()
        wallResult.material = wallMaterial
        this.wallResult = wallResult
        wallResult.rotation.set(-Math.PI,0,0)
        wallResult.position.set(0.01,0,-2)
        this.scene.add(wallResult) 

        // windows
        // const geometry5 = new THREE.BoxGeometry(4, 4, 2);
        // const wdMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color('#D6AF9C') } );
        // const mesh5 = new THREE.Mesh( geometry5, wdMaterial );
        // mesh5.position.set(0.01,0,-2)
        // this.scene.add(mesh5) 
        
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

    render() {
          return (
              <div
                  className= "canvas"
                  ref={(mount) => { this.mount = mount }}
              >
                  <img className="icon sofa" src={sofa} />
                  <img className="icon table" src={table} />
                  <img className="icon chair" src={chair} />
                  <img className="icon lamp" src={lamp} />
                  <img className="icon bookshelf" src={bookshelf} />
                </div>
          );
    }
}

export default HouseTemplate;