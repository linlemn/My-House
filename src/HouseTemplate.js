import * as THREE from 'three'
import React, { Component } from 'react';
import './HouseTemplate.css'

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
        this.mount.appendChild( renderer.domElement );
        camera.position.z = 4.3;
        camera.position.y = 0.5;

        const light = new THREE.SpotLight(0xffffff);
        light.position.set(0, 2.5, 4.2);
        scene.add(light);
      
        this.createWalls()
        this.createIcon()
        this.animate()
    }

    createIcon = () => {
        const geom1 = new THREE.BoxGeometry(0.5, 0.5, 0.5)
        const loader = new THREE.TextureLoader()
        const texture = loader.load('./crate.jpg') 
        const material = new THREE.MeshBasicMaterial( { map: texture } )
        const mesh = new THREE.Mesh( geom1, material )
        this.scene.add(mesh)
        // this.renderer.render()
    }

    createWalls = () => {
        const geometry1 = new THREE.BoxGeometry(2, 2, 2);
        const geometry2 = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial( { color: new THREE.Color('#E8CACD') } );
        const mesh1 = new THREE.Mesh( geometry1, material );
        const mesh2 = new THREE.Mesh( geometry2, material );
        mesh1.position.set(0.05,0.05,0.05)
        const mesh1BSP = new ThreeBSP(mesh1)
        const mesh2BSP = new ThreeBSP(mesh2)
        const resultBSP = mesh1BSP.subtract(mesh2BSP)
        const result = resultBSP.toMesh()
        result.geometry.computeFaceNormals()
        result.geometry.computeVertexNormals()
        result.material = material
        this.result = result
        result.rotation.set(-Math.PI,-Math.PI/4,0)
        result.position.set(0.01,0,0)
        this.scene.add(result)
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
              />
          );
    }
}

export default HouseTemplate;