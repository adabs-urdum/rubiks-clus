// 667 * 912 --> 0.7313596491 * 1
// head 200 --> 0.2192982456
// eyes 90 --> 0.09868421053
// mouth 103 --> 0.1129385965
// torso 518 --> 0.5679824561

function WebGLThreeJS(){
  let scene,
      camera,
      renderer,
      raycaster,
      mouse,
      intersects,
      clickables,
      currentTarget,
      xClicked,
      yClicked,
      shadowHelper,
      floatingTotal,
      people,
      parts;

  const THREE = require('three');
  const OBJLoader = require('three-obj-loader');
  OBJLoader(THREE);
  const MTLLoader = require('three-mtl-loader');

  function init(){
    console.log('init');
    setVars();
    bindEvents();
    addParts();
    addHair();
    addEyes();
    addMouth();
    addTorso();
    mainLoop();
  }

  function addParts(){
    
  }

  function addHair(){
    let cubeGeometry = new THREE.BoxGeometry(1,0.2192982456,1);
    let loader = new THREE.TextureLoader();
    let materialArray = [
        new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0xFFFFFF,
          map: loader.load('/dist/img/team/yanik_top.jpg'),
        }),
        new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0xFFFFFF,
          map: loader.load('/dist/img/team/damian_top.jpg'),
        }),
        new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0x333333,
        }),
        new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0x333333,
        }),
        new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0xFFFFFF,
          map: loader.load('/dist/img/team/sarah_top.jpg'),
        }),
        new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0xFFFFFF,
          map: loader.load('/dist/img/team/laurin_top.jpg'),
        }),
    ];
    let mesh = new THREE.Mesh( cubeGeometry, materialArray );

    mesh.geometry.dynamic = true;
    mesh.geometry.computeVertexNormals();

    mesh.material.needsUpdate = true;

    // mesh.receiveShadow = true;
    // mesh.castShadow = true;

    mesh.position.y += 0.135;

    clickables.push(mesh);
    scene.add(mesh);
  }

  function addEyes(){
    let cubeGeometry = new THREE.BoxGeometry(1,0.09868421053,1);
    let loader = new THREE.TextureLoader();
    let materialArray = [
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/yanik_eyes.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/damian_eyes.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0x333333,
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0x333333,
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/sarah_eyes.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/laurin_eyes.jpg'),
      }),
    ];
    let mesh = new THREE.Mesh( cubeGeometry, materialArray );

    mesh.geometry.dynamic = true;
    mesh.geometry.computeVertexNormals();

    mesh.material.needsUpdate = true;

    // mesh.receiveShadow = true;
    // mesh.castShadow = true;

    mesh.position.y -= 0.035;

    clickables.push(mesh);
    scene.add(mesh);
  }

  function addMouth(){
    let cubeGeometry = new THREE.BoxGeometry(1,0.1129385965,1);
    let loader = new THREE.TextureLoader();
    let materialArray = [
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/yanik_mouth.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/damian_mouth.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0x333333,
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0x333333,
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/sarah_mouth.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/laurin_mouth.jpg'),
      }),
    ];
    let mesh = new THREE.Mesh( cubeGeometry, materialArray );

    mesh.geometry.dynamic = true;
    mesh.geometry.computeVertexNormals();

    mesh.material.needsUpdate = true;

    // mesh.receiveShadow = true;
    // mesh.castShadow = true;

    mesh.position.y -= 0.15;

    clickables.push(mesh);
    scene.add(mesh);
  }

  function addTorso(){
    let cubeGeometry = new THREE.BoxGeometry(1,0.5679824561,1);
    let loader = new THREE.TextureLoader();
    let materialArray = [
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/yanik_torso.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/damian_torso.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0x333333,
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0x333333,
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/sarah_torso.jpg'),
      }),
      new THREE.MeshLambertMaterial({
        flatShading: false,
        color: 0xFFFFFF,
        map: loader.load('/dist/img/team/laurin_torso.jpg'),
      }),
    ];
    let mesh = new THREE.Mesh( cubeGeometry, materialArray );

    mesh.geometry.dynamic = true;
    mesh.geometry.computeVertexNormals();

    mesh.material.needsUpdate = true;

    // mesh.receiveShadow = true;
    // mesh.castShadow = true;

    mesh.position.y -= 0.5;

    clickables.push(mesh);
    scene.add(mesh);
  }

  function setVars(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 250);
    camera.position.set(0,0,3);
    camera.lookAt( 0,-0.3,0 );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;
    clickables = [];

    // HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    scene.add(hemisphereLight);

    // DirectionalLight( color : Integer, intensity : Float )
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(0, 50, 0);
    directionalLight.target.position.set(0, 0, 0);
    // directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 5000;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    scene.add(directionalLight);

    // PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
    pointLight = new THREE.PointLight(0xffd9d9, 0.3, 0, 2);
    pointLight.position.set(-2,0,2);
    // pointLight.castShadow = true;
    // scene.add(pointLight);

    // SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )
    spotLight = new THREE.SpotLight(0xffd9d9, 1, 10, 1, 1, 1);
    spotLight.position.set(0,0.3,3);
    // spotLight.castShadow = true;
    // scene.add(spotLight);

    domContainer = document.getElementsByClassName('rubiks')[0];

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;
    renderer.setSize(domContainer.offsetWidth, domContainer.offsetHeight);

    domContainer.appendChild(renderer.domElement);

    floatingTotal = 0;
    floatingDirection = true;

    people = [
      'cyrill',
      'damian',
      'kajo',
      'kevin',
      'laurin',
      'oli',
      'romina',
      'sarah',
      'yanik'
    ];

    parts = [
      'eyes',
      'mouth',
      'top',
      'torso'
    ];

  }

  function bindEvents(){
    domContainer.addEventListener('mousedown', onMouseDown);
    domContainer.addEventListener('touchstart', onTouchDown);
    domContainer.addEventListener('mouseup', onMouseUp);
    domContainer.addEventListener('touchend', onTouchUp);
  }

  function onMouseDown(e){

    xClicked = e.clientX;
    yClicked = e.clientY;

    mouse.x = (xClicked / domContainer.offsetWidth) * 2 - 1;
    mouse.y = -(yClicked / domContainer.offsetHeight) * 2 + 1;
    mouse.z = 1;

    raycaster.setFromCamera( mouse, camera );

    intersects = raycaster.intersectObjects( clickables, false );

    if(intersects.length){
      currentTarget = intersects[0].object;
      domContainer.addEventListener('mousemove', onMouseMove);
    }

  }

  function onTouchDown(e){

    xClicked = e.touches[0].clientX;
    yClicked = e.touches[0].clientY;

    mouse.x = (xClicked / domContainer.offsetWidth) * 2 - 1;
    mouse.y = -(yClicked / domContainer.offsetHeight) * 2 + 1;
    mouse.z = 1;

    raycaster.setFromCamera( mouse, camera );

    intersects = raycaster.intersectObjects( clickables, false );

    if(intersects.length){
      currentTarget = intersects[0].object;
      domContainer.addEventListener('touchmove', onTouchMove);
    }

  }

  function onMouseMove(e){
    const xMouse = e.clientX;
    const yMouse = e.clientY;
    currentTarget.rotation.y += (xMouse - xClicked) / 160;
    renderer.shadowMap.needsUpdate = true;
    xClicked = xMouse;
    yClicked = yMouse;
  }

  function onTouchMove(e){
    const xMouse = e.touches[0].clientX;
    const yMouse = e.touches[0].clientY;
    currentTarget.rotation.y += (xMouse - xClicked) / 160;
    currentTarget.geometry.computeVertexNormals();
    xClicked = xMouse;
    yClicked = yMouse;
  }

  function onMouseUp(){
    domContainer.removeEventListener('mousemove', onMouseMove);
  }

  function onTouchUp(){
    domContainer.removeEventListener('touchmove', onTouchMove);
  }

  function resizeRenderer(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function float(){
    clickables.map(clickable => {
      const amount = Math.random() / 2000;

      if(floatingTotal < -0.05){
        floatingDirection = true;
      }
      else if(floatingTotal > 0.05){
        floatingDirection = false;
      }

      if(floatingDirection){
        floatingTotal += amount;
        clickable.position.y += amount;
      }
      else{
        floatingTotal -= amount;
        clickable.position.y -= amount;
      }
    });
  }

  function mainLoop(){
    renderer.render(scene, camera);
    // float();
    requestAnimationFrame(mainLoop);
  }

  init();
}

WebGLThreeJS();
