import * as THREE from "three";
import React, { Component } from "react";
import "./HouseTemplate.css";

import sofa from "./icons/sofa.png";
import table from "./icons/table.png";
import chair from "./icons/chair.png";
import human from "./icons/human.svg";
import bookshelf from "./icons/bookshelf.png";
import album from "./icons/album.png";
import gallery from "./icons/gallery.png";
import refresh from "./icons/refresh.svg";
import meshHouse from "./icons/meshHouse.svg";
import voxHouse from "./icons/voxHouse.svg";
import confirm from "./icons/confirm.svg";
import confirm_grey from "./icons/confirm_grey.png";
import wallPaper from "./icons/wall.png";
// import camera from './icons/camera.svg'

import Modal from "react-modal";
import { OBJLoader, MTLLoader } from "three-obj-mtl-loader";
import Zmage from "react-zmage";

import axios from "axios";
import { ShapeUtils, ImageLoader } from "three";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

const ThreeBSP = require("tthreebsp")(THREE);

THREE.ImageUtils.crossOrigin = "";

const _SUPER_CATEGORIES_3D = {
  bookshelf: 1,
  sofa: 5,
  chair: 3,
  lamp: 7,
  table: 4,
};

const _FINED_GRAINED_CATEGORY_ = {
  bookshelf: [
    "Children Cabinet",
    "Wardrobe",
    "Console",
    "Wine Cooler",
    "Drawer Chest / Corner",
    "cabinet",
    "Shelf",
    "Round End Table",
  ],
  chair: ["Lounge Chair / Book-chair / Computer Chair"],
  sofa: ["Three-Seat / Multi-person sofa", "Two-seat Sofa"],
  table: ["Desk"],
};
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
      wallModalIsOpen: false,
      currentItem: -1,
      loading: false,
      clickType: -1,
      items: ["gallery", "album"],
      objs: {},
      iconDisplayState: {
        sofa: true,
        table: true,
        human: true,
        chair: true,
        bookshelf: true,
      },
      meshOrVox: "mesh",
      buildingObjectUrls: {},
      wallColors: ["#FFFDE7", "#EFD0D6", "#FBD460", "#78909C"],
      isReselectOpen: false,
      isPreviewOpen: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      this.mount.clientWidth / this.mount.clientHeight,
      0.1,
      1000
    );
    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("rgb(247, 245, 228)", 1.0);
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    renderer.shadowMap.enabled = true;
    this.mount.appendChild(renderer.domElement);
    camera.position.z = 1.7;
    camera.position.y = 0;

    const light1 = new THREE.PointLight(0xffffff, 1.4);
    light1.position.set(0, 7, 4);
    scene.add(light1);

    const light2 = new THREE.SpotLight(0xffffff, 0.12);
    light2.position.set(0, 0, 50);
    scene.add(light2);

    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    document.addEventListener("mousedown", this.onFurnitureClick, false);

    this.createRoom();
    // this.createIcon()
    this.loadModel();
    this.animate();
    // this.loadObj(`${process.env.PUBLIC_URL}/0000008.obj`, `${process.env.PUBLIC_URL}/0000033.png`, 'obj')
  };

  loadModel = () => {
    if (document.referrer.indexOf("8081") <= -1) return;
    const iconDisplayStateRecord = window.sessionStorage.getItem(
      "iconDisplayState"
    );
    if (iconDisplayStateRecord) {
      let ids = {
        sofa: true,
        table: true,
        human: true,
        chair: true,
        bookshelf: true,
      };
      let bourls = {};
      const idsrArr = iconDisplayStateRecord.split("?");
      for (let state in idsrArr) {
        if (!idsrArr[state]) continue;
        const splitArr = idsrArr[state].split(":");
        const type = splitArr[0];
        console.log(splitArr, idsrArr, type);
        ids[type] = splitArr[1] == "false" ? false : true;
        const objRecord = window.sessionStorage.getItem(type);
        if (objRecord) {
          const objRecordSplitArr = objRecord.split("?");
          let urls = {};
          for (let url in objRecordSplitArr)
            urls[objRecordSplitArr[url].split(":")[0]] = objRecordSplitArr[
              url
            ].split(":")[1];
          bourls[type] = urls;
          this.loadObj(urls.mesh, urls.texture, type);
        }
      }
      console.log(ids);

      this.setState({
        iconDisplayState: ids,
        buildingObjectUrls: bourls,
      });
    }
  };

  createRoundRect = (x, y, width, height, radius) => {
    const shape = new THREE.Shape();
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(
      x + width,
      y + height,
      x + width,
      y + height - radius
    );
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);
    return shape;
  };

  createRoom = () => {
    // floor
    const geometry1 = new THREE.BoxGeometry(8, 4, 2);
    const geometry2 = new THREE.BoxGeometry(8, 4, 2);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#ffffff"),
    });
    const mesh1 = new THREE.Mesh(geometry1, material);
    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh1.position.set(0, 0.1, 0);
    const mesh1BSP = new ThreeBSP(mesh1);
    const mesh2BSP = new ThreeBSP(mesh2);
    const resultBSP = mesh1BSP.subtract(mesh2BSP);
    const result = resultBSP.toMesh();
    // const loader = new THREE.TextureLoader()
    // const texture = loader.load((`${process.env.PUBLIC_URL}/images/default_floor.jpeg`));
    // const resMaterial = new THREE.MeshLambertMaterial( { map: texture } );
    result.geometry.computeFaceNormals();
    result.geometry.computeVertexNormals();
    result.material = material;
    this.result = result;
    result.rotation.set(-Math.PI, 0, 0);
    result.position.set(0.01, 0, -2);
    this.scene.add(result);

    //walls
    const geometry3 = new THREE.BoxGeometry(8, 4, 2);
    const geometry4 = new THREE.BoxGeometry(7.8, 4, 2);
    // const wallMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color('#FBD460') } );
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color("#EFD0D6"),
    });
    const mesh3 = new THREE.Mesh(geometry3, wallMaterial);
    const mesh4 = new THREE.Mesh(geometry4, wallMaterial);
    mesh3.position.set(0, 0, 0.1);
    const mesh3BSP = new ThreeBSP(mesh3);
    const mesh4BSP = new ThreeBSP(mesh4);
    var wallResultBSP = mesh3BSP.subtract(mesh4BSP);
    const geometry5 = new THREE.BoxGeometry(8, 3.6, 1.4);
    // const wdMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color('#D6AF9C'), shininess:5} );
    const wdMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#FFFFFF"),
      shininess: 5,
    });
    const mesh5 = new THREE.Mesh(geometry5, wdMaterial);
    // mesh5.position.set(-2, 0.1, 0);
    mesh5.position.set(1, 0, 0);
    const mesh5BSP = new ThreeBSP(mesh5);
    wallResultBSP = wallResultBSP.subtract(mesh5BSP);
    const wallResult = wallResultBSP.toMesh();
    wallResult.geometry.computeFaceNormals();
    wallResult.geometry.computeVertexNormals();
    wallResult.material = wallMaterial;
    this.wallResult = wallResult;
    wallResult.rotation.set(-Math.PI, 0, 0);
    wallResult.position.set(0.01, 0, -2);
    this.scene.add(wallResult);
    const _objs = this.state.objs;
    _objs["wall"] = wallResult;
    this.setState({
      objs: _objs,
    });

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
    const mesh6 = new THREE.Mesh(geometry6, wdMaterial);
    // mesh6.position.set(-1.99, 0, -2.98);
    const geometry7 = new THREE.BoxGeometry(0.1, 3.4, 0.6);
    const geometry8 = new THREE.BoxGeometry(0.1, 3.4, 0.6);
    const mesh7 = new THREE.Mesh(geometry7, wdMaterial);
    mesh7.position.set(0, 0, 0.35);
    const mesh8 = new THREE.Mesh(geometry8, wdMaterial);
    mesh8.position.set(0, 0, -0.3);
    const mesh6BSP = new ThreeBSP(mesh6);
    const mesh7BSP = new ThreeBSP(mesh7);
    const mesh8BSP = new ThreeBSP(mesh8);
    var wdResultBSP = mesh6BSP.subtract(mesh7BSP);
    wdResultBSP = wdResultBSP.subtract(mesh8BSP);
    const wdResult = wdResultBSP.toMesh();
    wdResult.geometry.computeFaceNormals();
    wdResult.geometry.computeVertexNormals();
    wdResult.material = wdMaterial;
    this.wdResult = wdResult;
    wdResult.position.set(4, 0, -1.9);
    this.scene.add(wdResult);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.obj) {
      // this.obj.rotation.x += 0.01;
      // this.obj.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  };

  componentWillUnmount() {
    this.mount.removeChild(this.renderer.domElement);
  }

  toggleModal = (id, event) => {
    // console.log(id, this.state.modalIsOpen)
    // event.preventDefault();
    event.stopPropagation();
    if (id == "wall") {
      this.setState({
        wallModalIsOpen: !this.state.wallModalIsOpen,
        loading: true,
      });
    } else if (id == "reselect") {
      this.setState({
        isReselectOpen: false,
        loading: true,
      });
    } else if (id == "preview") {
      this.setState({
        isPreviewOpen: false,
        loading: true,
      });
    } else {
      this.setState({
        modalIsOpen: !this.state.modalIsOpen,
        loading: this.state.modalIsOpen ? true : false,
        clickType: id,
      });
    }
  };

  handleOnAfterOpenModal = () => {
    // when ready, we can access the available refs.
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 500);
    }).then((res) => {
      this.setState({
        loading: false,
      });
    });
  };

  handleWallOnAfterOpenModal = () => {
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 500);
    }).then((res) => {
      this.setState({
        loading: false,
      });
    });
  };

  loadObj = async (objUrl, mtlUrl, type) => {
    console.log(mtlUrl, objUrl);
    const oldObj = this.state.objs[type];
    if (type in this.state.objs) {
      console.log(type, objUrl);
      this.scene.remove(this.state.objs[type]);
    }
    var loader = null;
    if (type == "human") {
      loader = new OBJLoader2();
    } else {
      loader = new OBJLoader();
    }

    loader.load(objUrl, (geometry) => {
      var material = new THREE.MeshLambertMaterial();

      geometry.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          if (type != "human") {
            console.log(mtlUrl);
            const l = new ImageLoader();
            l.setCrossOrigin("Anonymous");
            child.material.map = THREE.ImageUtils.loadTexture(mtlUrl);
            // child.material.map = l.loadTexture(mtlUrl);
          } else {
          }
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

      //  geometry.rotation.x = -2;
      let wrapper = new THREE.Object3D();
      wrapper.add(geometry);

      if (type == "human") {
        const light3 = new THREE.SpotLight(0xffffff, 1);
        light3.position.set(-1, -0.3, 1.5);
        light3.target = wrapper;
        light3.angle = Math.PI / 10;
        light3.distance = 3;
        this.scene.add(light3);
        this.setState({
          light3: light3,
        });
      } else {
        this.scene.remove(this.state.light3);
      }

      geometry.name = type;

      const objs = this.state.objs;
      if (objs[type]) {
        this.scene.remove(objs[type]);
      }
      objs[type] = wrapper;
      this.setState({
        objs,
      });
      this.placeFurniture(type);
      this.scene.add(wrapper);
    });
  };

  getChildrenMsg = (type, galleryImage) => {
    this.loadObj(
      this.state.meshOrVox == "mesh" ? galleryImage.mesh : galleryImage.voxsobj,
      galleryImage.texture,
      type
    );
    let iconDisplayState = this.state.iconDisplayState;
    iconDisplayState[type] = false;
    const { buildingObjectUrls } = this.state;
    buildingObjectUrls[type] = galleryImage;
    this.setState({
      iconDisplayState,
      modalIsOpen: false,
      buildingObjectUrls,
    });
  };

  onHouseTypeIconClick = (type) => {
    if (type == "wall") {
      this.setState({
        wallModalIsOpen: true,
      });
    } else {
      this.setState({
        meshOrVox: type,
      });
      for (let _type in this.state.buildingObjectUrls) {
        const obj = this.state.buildingObjectUrls[_type];
        console.log(obj.mesh, obj.voxsobj);
        this.loadObj(
          type == "mesh" ? obj.mesh : obj.voxsobj,
          obj.texture,
          _type
        );
      }
    }
  };

  onFurnitureClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let objects = [];
    const raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    //监听全局点击事件,通过ray检测选中哪一个object
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);
    this.scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        //根据需求判断哪些加入objects,也可以在生成object的时候push进objects
        objects.push(child);
      }

      const {
        modalIsOpen,
        wallModalIsOpen,
        isPreviewOpen,
        isReselectOpen,
      } = this.state;
      for (let type in this.state.objs) {
        if (type !== "wall") {
          const object = this.state.objs[type];
          let intersects = raycaster.intersectObject(object, true);
          if (
            intersects.length > 0 &&
            !modalIsOpen &&
            !wallModalIsOpen &&
            !isPreviewOpen &&
            !isReselectOpen
          ) {
            this.setState({
              isReselectOpen: true,
              clickFurnitureType: type,
              clickType: type,
            });
          }
        }
      }
    }, false);
  };

  toInstruction = (event) => {
    this.setState({
      instOrPre: "inst",
      isPreviewOpen: true,
    });
    // event.stopPropagation()
    // const {iconDisplayState, buildingObjectUrls, clickFurnitureType} = this.state
    // // 跳转前记录
    // let iconDisplayStateRecord = ''
    // for (let t in buildingObjectUrls) {
    //   if (buildingObjectUrls[t]) {
    //     window.sessionStorage.setItem(t, `mesh:${buildingObjectUrls[t].mesh}?texture:${buildingObjectUrls[t].texture}?ldr:${buildingObjectUrls[t].ldr}?vox:${buildingObjectUrls[t].obj}`)
    //     iconDisplayStateRecord += `${t}:${iconDisplayState[t]}?`
    //   }
    // }
    // window.sessionStorage.setItem('iconDisplayState', iconDisplayStateRecord)
    //   // type是字符串
    //   const ldr = this.state.buildingObjectUrls[clickFurnitureType].ldr.split('/').pop()
    //   window.location.href = (`http://103.79.27.148:8081/buildinginstructions/sample_instructions.htm?model=${ldr}`)
  };

  onReselectionClick = (event) => {
    event.stopPropagation();
    // 获取点击的类型，
    this.setState({
      isReselectOpen: !this.state.isReselectOpen,
      modalIsOpen: !this.state.modalIsOpen,
    });
  };

  onPreviewClick = (event) => {
    event.stopPropagation();
    this.setState({
      isPreviewOpen: true,
      instOrPre: "pre",
    });
  };

  getLdrName = () => {
    const { buildingObjectUrls, clickFurnitureType } = this.state;
    return buildingObjectUrls[clickFurnitureType]
      ? buildingObjectUrls[clickFurnitureType].ldr.split("/").pop()
      : "";
  };

  getInstOrPre = () => {
    if (this.state.instOrPre == "pre")
      return `http://103.79.27.148:8081/buildinginstructions/sample_view.htm?model=${this.getLdrName()}`;
    else if (this.state.instOrPre == "inst") {
      const { buildingObjectUrls, clickFurnitureType } = this.state;
      const ldr = buildingObjectUrls[clickFurnitureType].ldr.split("/").pop();
      return `http://103.79.27.148:8081/buildinginstructions/sample_instructions.htm?model=${ldr}`;
    } else {
      return "";
    }
  };

  render() {
    const {
      modalIsOpen,
      wallModalIsOpen,
      items,
      loading,
      clickType,
      iconDisplayState,
      meshOrVox,
      isReselectOpen,
      isPreviewOpen,
    } = this.state;
    return (
      <div
        className="canvas"
        ref={(mount) => {
          this.mount = mount;
        }}
      >
        <div className="house-type-wrapper">
          <div>
            <img
              src={wallPaper}
              className="house-unselected"
              onClick={(e) => {
                this.toggleModal("wall", e);
              }}
            ></img>
            <Modal
              closeTimeoutMS={150}
              contentLabel="modalA"
              isOpen={wallModalIsOpen}
              onAfterOpen={this.handleWallOnAfterOpenModal}
              onRequestClose={(e) => {
                this.toggleModal("wall", e);
              }}
              ariaHideApp={false}
              style={{
                content: {
                  position: "absolute",
                  top: "20%",
                  left: "30%",
                  right: "30%",
                  bottom: "20%",
                  backgroundColor: "rgba(255, 255, 255)",
                  border: "None",
                  boxShadow: "5px 5px 10px rgba(0,0,0,0.25)",
                  borderRadius: "10%",
                  padding: "35px",
                },
              }}
            >
              <div className="wall-selection-wrapper">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <List
                    items={["wall"]}
                    type={"wall"}
                    parent={this}
                    wallColors={this.state.wallColors}
                  />
                )}
              </div>
            </Modal>
          </div>
          {/* <img src={meshHouse} className={meshOrVox == 'mesh' ? 'house-selected' : 'house-unselected'} onClick={e => {
            this.onHouseTypeIconClick('mesh')
          }}></img> */}
          {/* <img src={voxHouse} className={meshOrVox == 'vox' ? 'house-selected' : 'house-unselected'} onClick={e => {
            this.onHouseTypeIconClick('vox')
          }}></img> */}
        </div>
        {iconDisplayState["sofa"] && (
          <img
            className="icon sofa"
            id="sofa"
            src={sofa}
            onMouseDown={(e) => {
              this.toggleModal("sofa", e);
            }}
          />
        )}
        {iconDisplayState["table"] && (
          <img
            className="icon table"
            id="table"
            src={table}
            onMouseDown={(e) => {
              this.toggleModal("table", e);
            }}
          />
        )}
        {iconDisplayState["chair"] && (
          <img
            className="icon chair"
            id="chair"
            src={chair}
            onMouseDown={(e) => {
              this.toggleModal("chair", e);
            }}
          />
        )}
        {iconDisplayState["human"] && (
          <img
            className="icon human"
            id="human"
            src={human}
            onMouseDown={(e) => {
              this.toggleModal("human", e);
            }}
          />
        )}
        {iconDisplayState["bookshelf"] && (
          <img
            className="icon bookshelf"
            id="bookshelf"
            src={bookshelf}
            onMouseDown={(e) => {
              this.toggleModal("bookshelf", e);
            }}
          />
        )}
        <Modal
          closeTimeoutMS={150}
          contentLabel="modalA"
          isOpen={modalIsOpen}
          onAfterOpen={this.handleOnAfterOpenModal}
          onRequestClose={(e) => {
            this.toggleModal(clickType, e);
          }}
          ariaHideApp={false}
          style={{
            content: {
              position: "absolute",
              top: "20%",
              left: "30%",
              right: "30%",
              bottom: "20%",
              backgroundColor: "rgba(255, 255, 255)",
              border: "None",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.25)",
              borderRadius: "10%",
              padding: "50px",
            },
          }}
        >
          <div className="selection-wrapper">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <List
                items={clickType == "human" ? ["album"] : items}
                type={clickType}
                parent={this}
              />
            )}
          </div>
        </Modal>
        <Modal
          closeTimeoutMS={150}
          isOpen={isReselectOpen}
          onRequestClose={(e) => {
            this.toggleModal("reselect", e);
          }}
          ariaHideApp={false}
          onAfterOpen={this.handleOnAfterOpenModal}
          style={{
            content: {
              position: "absolute",
              top: "20%",
              left: "30%",
              right: "30%",
              bottom: "20%",
              backgroundColor: "rgba(255, 255, 255)",
              border: "None",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.25)",
              borderRadius: "10%",
              padding: "35px",
            },
          }}
        >
          <div className="reselect-images-wrapper">
            <div
              className="reselect-image-wrapper"
              onClick={(e) => {
                this.toInstruction(e);
              }}
            >
              <div className="reselect-style-text">{"LEGO Instruction"}</div>
            </div>
            <div
              className="reselect-image-wrapper"
              onClick={(e) => {
                this.onReselectionClick(e);
              }}
            >
              <div className="reselect-style-text">{"Reselect"}</div>
            </div>
            <div
              className="reselect-image-wrapper"
              onClick={(e) => {
                this.onPreviewClick(e);
              }}
            >
              <div className="reselect-style-text">{"LEGO Preview"}</div>
            </div>
          </div>
        </Modal>
        <Modal
          closeTimeoutMS={150}
          isOpen={isPreviewOpen}
          onRequestClose={(e) => {
            this.toggleModal("preview", e);
          }}
          ariaHideApp={false}
          // onAfterOpen={this.handleOnAfterOpenPreviewModal}
          style={{
            content: {
              position: "absolute",
              top: "10%",
              left: "10%",
              right: "10%",
              bottom: "10%",
              backgroundColor: "#ffffff",
              border: "None",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.25)",
              borderRadius: "25px",
              padding: "0",
            },
          }}
        >
          {/* <div className="canvas-preview" ref={(previewMount) => { this.previewMount = previewMount }}></div> */}
          <iframe className="canvas-preview" src={this.getInstOrPre()}></iframe>
        </Modal>
      </div>
    );
  }

  computeScale(geometry) {
    var box = new THREE.Box3();
    box.expandByObject(geometry);
    var maxX = box.max.x;
    var minX = box.min.x;
    var maxY = box.max.y;
    var minY = box.min.y;
    var maxZ = box.max.z;
    var minZ = box.min.z;
    var maxDis =
      Math.sqrt(
        (maxX - minX) * (maxX - minX) +
          (maxY - minY) * (maxY - minY) +
          (maxZ - minZ) * (maxZ - minZ)
      ) / 2;
    var scale = 1.0 / maxDis;
    return scale;
  }

  placeFurniture(type) {
    var box = new THREE.Box3();
    box.expandByObject(this.state.objs[type]);
    var length = box.max.x - box.min.x;
    var height = box.max.y - box.min.y;
    var width = box.max.z - box.min.z;
    console.log("before scaling", length, height, width); // m_height, m_width, m_length
    var m = new THREE.Matrix4();
    var vec = new THREE.Vector3(1, 0, 0);
    m.set(
      1 - 2 * vec.x * vec.x,
      -2 * vec.x * vec.y,
      -2 * vec.x * vec.z,
      0,
      -2 * vec.x * vec.y,
      1 - 2 * vec.y * vec.y,
      -2 * vec.y * vec.z,
      0,
      -2 * vec.x * vec.z,
      -2 * vec.y * vec.z,
      1 - 2 * vec.z * vec.z,
      0,
      0,
      0,
      0,
      1
    );
    if (this.state.meshOrVox == "vox") {
      const { buildingObjectUrls } = this.state;
      const lengthScale = buildingObjectUrls[type].size[0] / height;
      const heightScale = buildingObjectUrls[type].size[1] / width;
      const widthScale = buildingObjectUrls[type].size[2] / length;
      console.log(lengthScale, heightScale, widthScale);
      if (type == "sofa") {
        // this.state.objs[type].scale.set(lengthScale, heightScale, widthScale)
        // this.state.objs[type].scale.set(lengthScale, lengthScale*0.5, lengthScale*0.9)
        this.state.objs[type].scale.set(
          lengthScale,
          heightScale,
          lengthScale * 0.8
        );
        box = new THREE.Box3();
        box.expandByObject(this.state.objs[type]);
        length = box.max.x - box.min.x;
        height = box.max.y - box.min.y;
        width = box.max.z - box.min.z;
        console.log("vox after scaling", length, height, width);
        this.state.objs[type].rotateX(-Math.PI / 2);
        this.state.objs[type].rotateZ(Math.PI);
        this.state.objs[type].rotateY((-3 * Math.PI) / 2);
        this.state.objs[type].applyMatrix4(m);
        // this.state.objs[type].children[0].geometry.center()
        this.state.objs[type].position.set(-2, -0.5, -2.6);
      } else if (type == "chair") {
        // chair
        this.state.objs[type].scale.set(
          lengthScale / 1.5,
          lengthScale / 1.5,
          lengthScale / 1.5
        );
        box = new THREE.Box3();
        box.expandByObject(this.state.objs[type]);
        length = box.max.x - box.min.x;
        height = box.max.y - box.min.y;
        width = box.max.z - box.min.z;
        console.log("vox after scaling", length, height, width);
        this.state.objs[type].rotateX(-Math.PI / 2);
        this.state.objs[type].rotateZ(Math.PI);
        this.state.objs[type].rotateY((-3 * Math.PI) / 2);
        this.state.objs[type].position.set(1.8, -0.5, -0.5);
        this.state.objs[type].rotateX(1);
      } else if (type == "table") {
        // table
        this.state.objs[type].scale.set(
          lengthScale * 0.6,
          widthScale * 0.6,
          lengthScale * 0.6
        );
        box = new THREE.Box3();
        box.expandByObject(this.state.objs[type]);
        length = box.max.x - box.min.x;
        height = box.max.y - box.min.y;
        width = box.max.z - box.min.z;
        console.log("vox after scaling", length, height, width);
        this.state.objs[type].rotateX(-Math.PI / 2);
        this.state.objs[type].rotateZ(Math.PI);
        this.state.objs[type].rotateY((-3 * Math.PI) / 2);
        this.state.objs[type].position.set(1.3, -0.2, -0.9);
      } else if (type == "bookshelf") {
        this.state.objs[type].scale.set(lengthScale, heightScale, widthScale);
        box = new THREE.Box3();
        box.expandByObject(this.state.objs[type]);
        length = box.max.x - box.min.x;
        height = box.max.y - box.min.y;
        width = box.max.z - box.min.z;
        console.log("vox after scaling", length, height, width);
        this.state.objs[type].rotateX(-Math.PI / 2);
        this.state.objs[type].rotateZ(Math.PI);
        this.state.objs[type].rotateY((-3 * Math.PI) / 2);
        this.state.objs[type].applyMatrix4(m);
        this.state.objs[type].position.set(0, -1, -1.6);
      } else if (type == "human") {
        this.state.objs[type].scale.set(0.7, 0.8, 0.7);
        this.state.objs[type].position.set(-1, -0.3, 0);
      }
    } else {
      if (type == "sofa") {
        if (length > 2.4 && length < 3.5) {
          this.state.objs[type].scale.set(0.8, 0.8, 0.5);
        } else if (length >= 3.3) {
          this.state.objs[type].scale.set(0.6, 0.6, 0.45);
        }
        // this.state.objs[type].rotation.x = -0.1
        this.state.objs[type].position.set(0, -1, -0.6);
      } else if (type == "chair") {
        // chair
        // this.state.objs[type].rotation.y = -1
        // this.state.objs[type].rotation.x = -0.2
        if (length > 0.5) {
          this.state.objs[type].scale.x = 0.65;
        }
        if (width > 0.5) {
          this.state.objs[type].scale.z = 0.65;
        }
        if (height > 0.5) {
          this.state.objs[type].scale.y = 0.65;
        }
        this.state.objs[type].rotateY(-1);
        // this.state.objs[type].rotateX(0.1)
        this.state.objs[type].position.set(1.5, -1, -0.1);
      } else if (type == "table") {
        // this.state.objs[4].rotation.y = -1
        this.state.objs[type].rotateX(-0.2);
        this.state.objs[type].position.set(0, -1, 0);
        if (length > 1.9) {
          // this.state.objs[type].scale.set(0.6, 0.5, 0.5);
          this.state.objs[type].scale.x = 0.5;
        }
        if (height > 0.9 && height < 1.5) {
          this.state.objs[type].scale.y = 0.5;
        } else if (height >= 1.5) {
          this.state.objs[type].scale.y = 0.3;
        }
        if (width > 0.6) {
          this.state.objs[type].scale.z = 0.3;
        }
        // this.state.objs[type].scale.set(0.7, 0.7, 0.7);
      } else if (type == "bookshelf") {
        if (length > 1.5) {
          this.state.objs[type].scale.set(0.3, 0.7, 0.7);
        } else {
          this.state.objs[type].scale.set(0.7, 0.7, 0.7);
        }
        this.state.objs[type].rotateY(Math.PI / 2);
        this.state.objs[type].position.set(-1.8, -1, -0.2);
      } else if (type == "human") {
        this.state.objs[type].scale.set(0.7, 0.8, 0.7);
        this.state.objs[type].position.set(-1, -0.3, 0);
      }
      const { buildingObjectUrls } = this.state;
      box = new THREE.Box3();
      box.expandByObject(this.state.objs[type]);
      length = box.max.x - box.min.x;
      height = box.max.y - box.min.y;
      width = box.max.z - box.min.z;
      console.log("after scaling", length, height, width);
      buildingObjectUrls[type].size = [length, height, width];
      this.setState({
        buildingObjectUrls: buildingObjectUrls,
      });
    }
  }
}

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      loading: true,
      browsing: false,
      confirm_disable: false,
      count: 0,
    };
  }

  toggleModal = (selection, wallPaper = 1) => async (event) => {
    event.stopPropagation();
    console.log("out", selection);
    if (selection === "wall") {
      console.log(selection);
      const _objs = this.props.parent.state.objs;
      const wallMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(
          this.props.parent.state.wallColors[wallPaper - 1]
        ),
      });
      _objs["wall"].material = wallMaterial;
      // this.setState({
      //   isOpen: !this.state.isOpen,
      // })
      this.props.parent.setState({
        objs: _objs,
        wallModalIsOpen: !this.props.parent.state.wallModalIsOpen,
      });
    } else if (selection == "album") {
      let url;
      if (event.target.files) {
        const file = event.target.files[0];
        if (window.createObjectURL != undefined) {
          url = await window.createObjectURL(file);
        } else if (window.URL != undefined) {
          url = await window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
          url = await window.webkitURL.createObjectURL(file);
        }
        this.setState({
          isOpen: !this.state.isOpen,
          selectedAlbumImageUrl: url,
          selectedAlbumImage: file,
        });
      }
    } else if (selection == "gallery") {
      console.log("here");
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }
  };

  onChosenWallColor = (selection, wallPaper = 1) => async (event) => {
    // event.preventDefault();
    event.stopPropagation();
    const _objs = this.props.parent.state.objs;
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(this.props.parent.state.wallColors[wallPaper]),
    });
    _objs["wall"].material = wallMaterial;
    this.setState({
      isOpen: !this.state.isOpen,
    });
    this.props.parent.setState({
      objs: _objs,
      wallModalIsOpen: !this.props.parent.state.wallModalIsOpen,
    });
  };

  displaySelection = (selection) => {
    const toggleModal = this.toggleModal(selection);
    switch (selection) {
      // case 'camera':
      //   return <div className="selection" key={selection}>
      //   <img src={camera} />
      //   <input type="file" accept="image/*" capture="camera" />
      // </div>
      case "gallery":
        return (
          <div className="selection" key={selection} onClick={toggleModal}>
            <img src={gallery} />
          </div>
        );
      case "album":
        return this.props.type == "human" ? (
          <div className="human-album">
            <div className="huamn-style-text">{"请拍摄全身~"}</div>
            <img src={album} />
            <input type="file" accept="image/*" onChange={toggleModal} />
          </div>
        ) : (
          <div className="selection" key={selection}>
            <img src={album} />
            <input type="file" accept="image/*" onChange={toggleModal} />
          </div>
        );
      case "wall":
        return (
          <div>
            <p className="wallpaper-text">选择壁纸颜色</p>
            <div className="wall-selection-wrapper">
              <div
                className="wallpaper-color wallpaper-0"
                onClick={this.onChosenWallColor("wall", 0)}
              ></div>
              <div
                className="wallpaper-color wallpaper-1"
                onClick={this.onChosenWallColor("wall", 1)}
              ></div>
              <div
                className="wallpaper-color wallpaper-2"
                onClick={this.onChosenWallColor("wall", 2)}
              ></div>
              <div
                className="wallpaper-color wallpaper-3"
                onClick={this.onChosenWallColor("wall", 3)}
              ></div>
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  transformRequest = (data) => {
    let ret = "";
    for (let it in data) {
      ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
    }
    return ret;
  };

  shuffle = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      const random = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    return arr;
  };

  handleOnAfterOpenModal = async () => {
    const { type, selection } = this.props;

    console.log(selection);
    if (selection == "gallery") {
      try {
        const res = await fetch("http://103.79.27.148:8001/photos/gallery", {
          method: "post",
          body: this.transformRequest({
            category: _SUPER_CATEGORIES_3D[type],
          }),
          mode: "cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        const resJson = await res.json();

        let galleryImages = [];
        for (let i in resJson) {
          console.log(i, _FINED_GRAINED_CATEGORY_[type].indexOf(i));
          if (_FINED_GRAINED_CATEGORY_[type].indexOf(i) > -1) {
            const cat = resJson[i];
            for (let j in cat) {
              galleryImages.push({
                src: `http://103.79.27.148:8001/${cat[j].image}`,
                alt: cat[j].style,
                mesh: `http://103.79.27.148:8001/${cat[j].model}`,
                texture: `http://103.79.27.148:8001/${cat[j].texture}`,
                vox: `http://103.79.27.148:8001/${cat[j].vox[2]}`,
                ldr: `http://103.79.27.148:8001/${cat[j].ldr_with_stop[2]}`,
                voxsobj: `http://103.79.27.148:8001/${cat[j].voxsobj[2]}`,
              });
            }
          }
        }

        this.setState({
          galleryImages: this.shuffle(galleryImages),
          loading: false,
          count: 0,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        loading: false,
      });
    }
  };

  onBrowsingClose = () => {
    const state = this.state.browsing;
    this.setState(
      {
        browsing: !state,
      },
      () => {
        if (state) {
          const zmage = document.getElementById("zmage");
          zmage.parentNode.removeChild(zmage);
        }
      }
    );
  };

  onGalleryImageClick = (index) => {
    const { type } = this.props;
    const { galleryImages } = this.state;
    this.props.parent.getChildrenMsg(type, galleryImages[index]);
    this.setState({
      isOpen: false,
    });
  };

  onRefreshClick = async () => {
    const { count, galleryImages } = this.state;
    if (galleryImages.length - 3 <= count) {
      this.setState(
        {
          loading: true,
        },
        async () => {
          await this.handleOnAfterOpenModal();
        }
      );
    } else
      this.setState({
        count: count + 3,
      });
  };

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  onConfirmClick = async (e) => {
    e.preventDefault();

    if (this.state.confirm_disable == true) {
      return;
    }

    // 设置confirm icon disable
    this.setState({
      confirm_disable: true,
    });
    var confirm_icon = document.getElementById("confirm-icon");
    confirm_icon.src = confirm_grey;

    const { selectedAlbumImage } = this.state;
    const { type } = this.props;
    let formdata = new FormData();
    const imageData = selectedAlbumImage;
    formdata.append("file", imageData);
    formdata.append("category", _SUPER_CATEGORIES_3D[type]);
    formdata.append("resolution", 32);

    try {
      if (type != "human") {
        const res = await axios.post(
          "http://103.79.27.148:8001/photos/basic-upload/",
          formdata,
          {
            headers: {
              "Content-type": "multipart/form-data",
            },
          }
        );

        const {
          url,
          url_mesh,
          url_texture,
          url_vox,
          url_ldr_with_stop,
          url_voxsobj,
        } = res.data;

        let new_formdata = new FormData();
        new_formdata.append('new_photo_path', `/data2/bixiao/Code/3dconst/multiple-file-upload-py3/${url.substring(1)}`)
        new_formdata.append('original_texture_path', `/data2/bixiao/Code/3dconst/multiple-file-upload-py3/${url_texture}`)
        const new_texture_res = await axios.post(
          "/get_new_texutre",
          new_formdata,
          {
            headers: {
              "Content-type": "multipart/form-data",
            },
          }
        );
        
        // const new_texture_res = await fetch("/bibi/get_new_texture", {
        //   method: "POST",
        //   mode: "cors",
        //   body: new_formdata,
        //   headers: {
        //     "Content-type": "multipart/form-data",
        //   },
        // });

        const {
          new_texture_path
        } = new_texture_res.data;

        this.props.parent.getChildrenMsg(type, {
          mesh: `http://103.79.27.148:8001/${url_mesh}`,
          texture: `http://103.79.27.148:8001/${new_texture_path.substring(new_texture_path.indexOf('media'))}`,
          vox: `http://103.79.27.148:8001/${url_vox}`,
          ldr: `http://103.79.27.148:8001/${url_ldr_with_stop}`,
          voxsobj: `http://103.79.27.148:8001/${url_voxsobj}`,
        });
        this.setState({
          isOpen: false,
        });
      } else {
        const res = await axios.post(
          "http://103.79.27.148:8001/photos/reconstruction-upload/",
          formdata,
          {
            headers: {
              "Content-type": "multipart/form-data",
            },
          }
        );
        const {
          url_mesh,
          url_texture,
          url_vox,
          url_ldr_with_stop,
          url_voxsobj,
        } = res.data;
        this.props.parent.getChildrenMsg(type, {
          mesh: `http://103.79.27.148:8001/${url_mesh}`,
          texture: `http://103.79.27.148:8001/${url_texture}`,
          vox: `http://103.79.27.148:8001/${url_vox}`,
          ldr: `http://103.79.27.148:8001/${url_ldr_with_stop}`,
          voxsobj: `http://103.79.27.148:8001/${url_voxsobj}`,
        });
        this.setState({
          isOpen: false,
        });
      }
    } catch (err) {
      console.log(err);
    }

    // 设置confirm icon 不 disable
    this.setState({
      confirm_disable: false,
    });
    confirm_icon.src = confirm;
  };

  displayModalContent = () => {
    const {
      loading,
      galleryImages,
      browsing,
      count,
      selectedAlbumImageUrl,
      objs,
      wallColors,
    } = this.state;
    const { selection } = this.props;
    if (loading) return <p> loading... </p>;
    else {
      if (selection == "gallery")
        return (
          <div className="gallery-images-wrapper">
            <div
              className="gallery-image-wrapper"
              onClick={(e) => {
                this.onGalleryImageClick(count);
              }}
            >
              <Zmage
                src={galleryImages[count].src}
                alt="展示序列图片"
                preset="mobile"
                className="gallery-image"
                browsing={browsing}
              />
              <div className="style-text">{galleryImages[count].alt}</div>
            </div>
            <div
              className="gallery-image-wrapper"
              onClick={(e) => {
                this.onGalleryImageClick(count + 1);
              }}
            >
              <Zmage
                src={galleryImages[count + 1].src}
                alt="展示序列图片"
                preset="mobile"
                className="gallery-image"
                browsing={browsing}
              />
              <div className="style-text">{galleryImages[count + 1].alt}</div>
            </div>
            <div
              className="gallery-image-wrapper"
              onClick={(e) => {
                this.onGalleryImageClick(count + 2);
              }}
            >
              <Zmage
                src={galleryImages[count + 2].src}
                alt="展示序列图片"
                preset="mobile"
                className="gallery-image"
                browsing={browsing}
              />
              <div className="style-text">{galleryImages[count + 2].alt}</div>
            </div>
            <img
              className="refresh"
              src={refresh}
              onClick={this.onRefreshClick}
            />
          </div>
        );
      else if (selection == "album") {
        return (
          <div
            className="album-image-wrapper"
            onClick={(e) => {
              // this.onGalleryImageClick(count)
            }}
          >
            <Zmage
              src={selectedAlbumImageUrl}
              alt="展示序列图片"
              preset="mobile"
              className="album-image"
              browsing={browsing}
            />
            <img
              src={confirm}
              id="confirm-icon"
              className="confirm-icon"
              onClick={this.onConfirmClick}
            />
          </div>
        );
      }
    }
  };

  render() {
    const { isOpen } = this.state;
    const { selection } = this.props;
    const toggleModal = this.toggleModal(selection);
    return (
      <div
        className={
          selection == "wall" ? "wall-selection-wrapper" : "selection-wrapper"
        }
      >
        {this.displaySelection(selection)}
        <Modal
          contentLabel="modalB"
          isOpen={isOpen}
          onRequestClose={toggleModal}
          ariaHideApp={false}
          onAfterOpen={this.handleOnAfterOpenModal}
          style={{
            content: {
              position: "absolute",
              top: "10%",
              left: "5%",
              right: "5%",
              bottom: "10%",
              backgroundColor: "#ffffff",
              border: "None",
              boxShadow: "5px 5px 10px rgba(0,0,0,0.25)",
              borderRadius: "25px",
            },
          }}
        >
          {this.displayModalContent()}
        </Modal>
      </div>
    );
  }
}

class List extends Component {
  render() {
    return this.props.items.map((selection, index) => (
      <Item
        key={index}
        index={index}
        selection={selection}
        type={this.props.type}
        parent={this.props.parent}
        wallColors={this.props.wallColors}
      />
    ));
  }
}

export default HouseTemplate;
