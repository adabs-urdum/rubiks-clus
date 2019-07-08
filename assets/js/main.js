// 667 * 912 --> 0.7313596491 * 1
// head 200 --> 0.2192982456
// eyes 90 --> 0.09868421053
// mouth 103 --> 0.1129385965
// torso 518 --> 0.5679824561

import {Promise} from 'bluebird';

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

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
      floatingTotal,
      people,
      closestRotation,
      currentRotation,
      parts,
      path,
      currentPerson,
      floatingDirection,
      runInitAnimation,
      runRandomAnimation,
      randomButton,
      domContainer,
      domContainerXmin,
      domContainerXmax,
      domContainerYmin,
      domContainerYmax,
      rotationPoints,
      runEasing,
      hemisphereLight,
      directionalLight,
      pointLight,
      photoButton;

  const THREE = require('three');

  function init(){

    setVars();
    bindEvents();
    addParts();
    mainLoop();

  }

  function setVars(){

    currentRotation = 0;
    closestRotation = 0;
    floatingTotal = 0;
    floatingDirection = true;
    runRandomAnimation = false;
    randomButton = document.getElementById('randomButton');
    photoButton = document.getElementById('photoButton');
    domContainer = document.getElementsByClassName('rubiks')[0];

    rotationPoints = [
      0,
      Math.PI / 2, // 90deg
      Math.PI, // 180deg
      Math.PI * 1.5, // 270deg
      Math.PI * 2, // 360deg
      Math.PI / -2, // -90deg
      Math.PI * -1, // -180deg
      Math.PI * -1.5, // -270deg
      Math.PI * -2 // -360deg
    ];
    runEasing = true;

    runInitAnimation = true;

    currentPerson = 4;

    people = [
      {
        name: 'cyrill',
      },
      {
        name: 'damian',
      },
      {
        name: 'kajo',
      },
      {
        name: 'kevin',
      },
      {
        name: 'laurin',
      },
      {
        name: 'oli',
      },
      {
        name: 'romina',
      },
      {
        name: 'sarah',
      },
      {
        name: 'yanik',
      }
    ].shuffle();

    path = '/dist/img/team/';

    parts = [
      {
        name: 'top',
        height: 0.2192982456,
        posY: 0.135,
      },
      {
        name: 'eyes',
        height: 0.09868421053,
        posY: -0.035,
      },
      {
        name: 'mouth',
        height: 0.1129385965,
        posY: -0.15,
      },
      {
        name: 'torso',
        height: 0.5679824561,
        posY: -0.5,
      }
    ];

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, domContainer.offsetWidth / domContainer.offsetHeight, 1, 250);
    camera.position.set(0,0.2,3);
    camera.lookAt( 0,-0.3,0 );

    if(window.innerWidth <= 768){
      camera.position.z = 4;
    }
    else if(window.innerWidth >= 768){
      camera.position.z = 3.5;
    }
    else if(window.innerWidth >= 1024){
      camera.position.z = 3;
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;
    clickables = [];

    setLights();

    setRenderer();

    domContainer.appendChild(renderer.domElement);

  }

  function setRenderer(){
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true ,
    });
    renderer.setSize(domContainer.offsetWidth, domContainer.offsetHeight);
  }

  function setLights(){
    // HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    scene.add(hemisphereLight);

    // DirectionalLight( color : Integer, intensity : Float )
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(0, 50, 0);
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);

    // PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
    pointLight = new THREE.PointLight(0xfff3f3, 0.3, 0, 2);
    pointLight.position.set(-2,0,2);
    scene.add(pointLight);
  }

  function addParts(){

    parts.map(part => {

      let cubeGeometry = new THREE.BoxGeometry(1,part.height,1);
      let loader = new THREE.TextureLoader();

      let materials = [
        new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0x222222,
        }),
      ];
      materials = materials.concat(people.map(person => {
        return new THREE.MeshLambertMaterial({
          flatShading: false,
          color: 0xffffff,
          map: loader.load(path + person.name + '_' + part.name + '.jpg'),
        });
      }));

      cubeGeometry.materials = materials;

      cubeGeometry.computeFaceNormals();
      cubeGeometry.computeVertexNormals();

      let mesh = new THREE.Mesh( cubeGeometry, materials );

      // right
      mesh.geometry.faces[0].materialIndex = 1;
      mesh.geometry.faces[1].materialIndex = 1;

      // left
      mesh.geometry.faces[2].materialIndex = 2;
      mesh.geometry.faces[3].materialIndex = 2;

      // up
      mesh.geometry.faces[4].materialIndex = 0;
      mesh.geometry.faces[5].materialIndex = 0;

      // down
      mesh.geometry.faces[6].materialIndex = 0;
      mesh.geometry.faces[7].materialIndex = 0;

      // front
      mesh.geometry.faces[8].materialIndex = 3;
      mesh.geometry.faces[9].materialIndex = 3;

      // back
      mesh.geometry.faces[10].materialIndex = 4;
      mesh.geometry.faces[11].materialIndex = 4;

      mesh.geometry.groupsNeedUpdate = true;

      mesh.geometry.dynamic = true;
      mesh.geometry.computeVertexNormals();

      mesh.currentMaterialIndex = 4;

      mesh.material.needsUpdate = true;

      mesh.rotationSpeed = (Math.random() - 0.5) / 1000;
      mesh.rotationPosition = (Math.random() - 0.5) / 100;

      mesh.difference = 0;
      mesh.closestRotation = 0;
      mesh.currentRotation = 0;

      mesh.closestRotationDegree = closestRotation * 180 / Math.PI;

      mesh.position.y += part.posY;

      currentTarget = mesh;
      clickables.push(mesh);
      scene.add(mesh);
    });

  }

  function bindEvents(){
    domContainer.addEventListener('mousedown', onMouseDown);
    domContainer.addEventListener('touchstart', onTouchDown);
    domContainer.addEventListener('mouseup', onMouseUp);
    domContainer.addEventListener('touchend', onTouchUp);
    randomButton.addEventListener('click', () => {runRandomAnimation = true; });
    photoButton.addEventListener('click', saveAsImage);
    window.addEventListener('resize', resizeRenderer);
  }

  function saveAsImage(e){
    const resizedCanvas = document.createElement('canvas');
    const resizedContext = resizedCanvas.getContext('2d');
    const resizedRenderer = renderer;

    resizedCanvas.height = '512';
    resizedCanvas.width = '512';

    const resizedCamera = new THREE.PerspectiveCamera(30, resizedCanvas.width / resizedCanvas.height, 1, 250);
    resizedCamera.position.set(0,0.2,2.45);
    resizedCamera.lookAt( 0,-0.35,0 );
    resizedRenderer.render(scene, resizedCamera);

    const canvas = resizedRenderer.domElement;
    const context = canvas.getContext('2d');

    resizedContext.drawImage(canvas, 0, 0, 512, 512);

    const w = window.open('', '');
    w.document.title = 'Screenshot';
    const img = w.document.createElement('img');
    img.src = resizedCanvas.toDataURL('image/png', 1.0);

    w.document.body.appendChild(img);

  }

  function onMouseDown(e){

    runEasing = false;
    xClicked = e.clientX;
    yClicked = e.clientY;

    mouse.x = (xClicked / domContainer.offsetWidth) * 2 - 1;
    mouse.y = -(yClicked / domContainer.offsetHeight) * 2 + 1;
    mouse.z = 1;

    raycaster.setFromCamera( mouse, camera );

    intersects = raycaster.intersectObjects( clickables, false );

    if(intersects.length){
      currentTarget = intersects[0].object;
      resetCurrentRotation();
      setClosest();
      domContainer.addEventListener('mousemove', onMouseMove);
    }

  }

  function onTouchDown(e){

    runEasing = false;

    xClicked = e.touches[0].clientX;
    yClicked = e.touches[0].clientY;

    mouse.x = (xClicked / domContainer.offsetWidth) * 2 - 1;
    mouse.y = -(yClicked / domContainer.offsetHeight) * 2 + 1;
    mouse.z = 1;

    raycaster.setFromCamera( mouse, camera );

    intersects = raycaster.intersectObjects( clickables, false );

    if(intersects.length){
      currentTarget = intersects[0].object;
      resetCurrentRotation();
      setClosest();
      domContainer.addEventListener('touchmove', onTouchMove);
    }

  }

  function onMouseMove(e){
    const xMouse = e.clientX;
    const yMouse = e.clientY;
    currentTarget.rotation.y += (xMouse - xClicked) / 160;
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
    runEasing = true;
    resetCurrentRotation();
    setClosest();
  }

  function onTouchUp(){
    domContainer.removeEventListener('touchmove', onTouchMove);
    runEasing = true;
    resetCurrentRotation();
    setClosest();
  }

  function setNewFace(){

    currentTarget.geometry.groupsNeedUpdate = true;
    currentTarget.turn = currentTarget.closestRotationDegree / 90;

    currentTarget.currentMaterialIndex += 1;
    if(currentTarget.currentMaterialIndex > currentTarget.material.length - 1){
      currentTarget.currentMaterialIndex = 1;
    }

    const steps = {
      '0': [10,11],
      '1': [0,1],
      '2': [8,9],
      '3': [2,3],
      '4': [10,11],
      '-1': [2,3],
      '-2': [8,9],
      '-3': [0,1],
      '-4': [10,11]
    };

    const faceKeys = steps[currentTarget.turn];

    faceKeys.map(faceKey => {
      currentTarget.geometry.faces[faceKey].materialIndex = currentTarget.currentMaterialIndex;
    });
    currentTarget.geometry.groupsNeedUpdate = true;

  }

  function setNewFaceAll(){

    clickables.map(clickable => {

      clickable.geometry.groupsNeedUpdate = true;
      clickable.turn = clickable.closestRotationDegree / 90;

      clickable.currentMaterialIndex += 1;
      if(clickable.currentMaterialIndex > clickable.material.length - 1){
        clickable.currentMaterialIndex = 1;
      }

      const steps = {
        '0': [10,11],
        '1': [0,1],
        '2': [8,9],
        '3': [2,3],
        '4': [10,11],
        '-1': [2,3],
        '-2': [8,9],
        '-3': [0,1],
        '-4': [10,11]
      };

      const faceKeys = steps[clickable.turn];

      faceKeys.map(faceKey => {
        clickable.geometry.faces[faceKey].materialIndex = clickable.currentMaterialIndex;
      });
      clickable.geometry.groupsNeedUpdate = true;

    });

  }

  function setClosest(){
    clickables.map(clickable => {
      clickable.rotation.y = clickable.rotation.y;
      clickable.closestRotation = rotationPoints.reduce(function(prev, curr) {
        return (Math.abs(curr - clickable.rotation.y) < Math.abs(prev - clickable.rotation.y) ? curr : prev);
      });
      clickable.closestRotationDegree = clickable.closestRotation * 180 / Math.PI;
    });
  }

  function fitCurrent(){
    currentTarget.difference = currentTarget.closestRotation - currentTarget.rotation.y;
    if(currentTarget.difference >= 0.008 || currentTarget.difference <= -0.008){
      if(currentTarget.difference > 1 || currentTarget.difference < -0.1){
        currentTarget.rotation.y += currentTarget.difference * 0.1;
      }
      else if(currentTarget.difference > 0.01 || currentTarget.difference < -0.01){
        currentTarget.rotation.y += currentTarget.difference * 0.071;
      }
      else if(currentTarget.difference <= 0.01 || currentTarget.difference >= -0.01){
        currentTarget.rotation.y += currentTarget.difference * 0.061;
      }
    }
    else{
      runEasing = false;
      resetCurrentRotation();
      setClosest();
      setNewFace();
    }
  }

  function fitAll(){
    clickables.map(clickable => {
      clickable.difference = (clickable.closestRotation - clickable.rotation.y);
      if(clickable.difference >= 0.008 || clickable.difference <= -0.008){
        if(clickable.difference > 1 || clickable.difference < -0.1){
          clickable.rotation.y += clickable.difference * 0.1;
        }
        else if(clickable.difference > 0.01 || clickable.difference < -0.01){
          clickable.rotation.y += clickable.difference * 0.071;
        }
        else if(clickable.difference <= 0.01 || clickable.difference >= -0.01){
          clickable.rotation.y += clickable.difference * 0.061;
        }
      }
      else{
        runEasing = false;
        resetCurrentRotation();
        setClosest();
        setNewFace();
      }
    });
  }

  function resetCurrentRotation(){
    if(currentTarget.rotation.y <= (Math.PI * -2)){
      currentTarget.rotation.y = currentTarget.rotation.y + (Math.PI * 2);
      currentTarget.rotationPosition = currentTarget.rotation.y;
    }
    else if(currentTarget.rotation.y >= (Math.PI * 2)){
      currentTarget.rotation.y = currentTarget.rotation.y + (Math.PI * -2);
      currentTarget.rotationPosition = currentTarget.rotation.y;
    }

  }

  function resetRotationAll(){
    clickables.map(clickable => {
      if(clickable.rotation.y <= (Math.PI * -2)){
        clickable.rotation.y = clickable.rotation.y + (Math.PI * 2);
        clickable.rotationPosition = clickable.rotation.y;
      }
      else if(clickable.rotation.y >= (Math.PI * 2)){
        clickable.rotation.y = clickable.rotation.y + (Math.PI * -2);
        clickable.rotationPosition = clickable.rotation.y;
      }
    });
  }

  function resetDomContainerSizes(){
      const domContainerRect = domContainer.getBoundingClientRect();
      domContainerXmin = domContainerRect.left;
      domContainerXmax = domContainerRect.right;
      domContainerYmin = domContainerRect.top;
      domContainerYmax = domContainerRect.bottom;
    }

  function resizeRenderer(){
    if(window.innerWidth <= 768){
      camera.position.z = 4;
    }
    resetDomContainerSizes();
    camera.aspect = domContainer.offsetWidth / domContainer.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(domContainer.offsetWidth, domContainer.offsetHeight);
  }

  function initialAnimation(){
    clickables.map(clickable => {
      clickable.rotationPosition += clickable.rotationSpeed * 2,7 * Math.random();
      clickable.rotation.y += (Math.sin(clickable.rotationPosition));
      window.setTimeout(()=>{
        runInitAnimation = false;
        runEasing = false;
        setClosest();
        fitAll();
      }, 500);
    });
  }

  function randomAnimation(){
    clickables.map(clickable => {
      clickable.rotationPosition += clickable.rotationSpeed * Math.PI * 2;
      clickable.rotation.y += (Math.sin(clickable.rotationPosition));
      resetCurrentRotation();
      window.setTimeout(()=>{
        runRandomAnimation = false;
        runEasing = false;
        setClosest();
        resetRotationAll();
        fitAll();
        setNewFaceAll();
      }, 500);
    });
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

    if(runEasing){
      fitCurrent();
    }

    if(runInitAnimation){
      initialAnimation();
    }

    if(runRandomAnimation){
      randomAnimation();
    }

    // float();
    requestAnimationFrame(mainLoop);
  }

  init();
}

WebGLThreeJS();
