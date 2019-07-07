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
      floatingTotal,
      people,
      closestRotation,
      currentRotation,
      parts,
      path,
      currentPerson,
      rotationSpeed,
      rotationPosition,
      closestRotationDegree,
      floatingDirection,
      runInitAnimation;

  const THREE = require('three');

  function init(){

    setVars();
    bindEvents();
    addParts();
    initialAnimation();
    mainLoop();

  }

  function setVars(){

    currentRotation = 0;
    closestRotation = 0;
    floatingTotal = 0;
    floatingDirection = true;

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
    ];

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

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 250);
    camera.position.set(0,0,3);
    camera.lookAt( 0,-0.3,0 );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;
    clickables = [];

    setLights();

    domContainer = document.getElementsByClassName('rubiks')[0];

    setRenderer();

    domContainer.appendChild(renderer.domElement);

  }

  function setRenderer(){
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
  }

  function setLights(){
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
        })
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
      mesh.rotationPosition = (Math.random() - 0.5) / 10000;

      mesh.difference = 0;
      mesh.closestRotation = 0;
      mesh.currentRotation = 0;

      mesh.closestRotationDegree = closestRotation * 180 / Math.PI;

      // mesh.receiveShadow = true;
      // mesh.castShadow = true;

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
    currentTarget.rotation.y = currentTarget.rotation.y;
    if(currentTarget.rotation.y <= (Math.PI * -2)){
      currentTarget.rotation.y = currentTarget.rotation.y + (Math.PI * 2);
    }
    else if(currentTarget.rotation.y >= (Math.PI * 2)){
      currentTarget.rotation.y = currentTarget.rotation.y + (Math.PI * -2);
    }

  }

  function resizeRenderer(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function initialAnimation(){
    clickables.map(clickable => {
      clickable.rotationPosition += clickable.rotationSpeed;
      clickable.rotation.y += (Math.sin(clickable.rotationPosition));
      window.setTimeout(()=>{
        runInitAnimation = false;
        runEasing = false;
        setClosest();
        fitAll();
      }, 1000);
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

    // float();
    requestAnimationFrame(mainLoop);
  }

  init();
}

WebGLThreeJS();
